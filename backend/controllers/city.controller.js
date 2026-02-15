const City = require('../models/City');
const axios = require('axios');

/* ===================== Утилиты ===================== */

// Транслит UZ lat -> UZ cyr
function uzLatToCyr(s = '') {
  const map = {
    "O'":"Ў","G'":"Ғ","o'":"ў","g'":"ғ","Sh":"Ш","Ch":"Ч","sh":"ш","ch":"ч",
    "Yo":"Ё","yo":"ё","Ya":"Я","ya":"я","Yu":"Ю","yu":"ю","Ng":"Нг","ng":"нг",
    "Gʻ":"Ғ","gʻ":"ғ","Oʻ":"Ў","oʻ":"ў","ʼ":"’","`":"’","’":"’"
  };

  Object.keys(map)
    .sort((a,b)=>b.length-a.length)
    .forEach(k => { s = s.replaceAll(k, map[k]); });

  const single = {
    A:"А",B:"Б",D:"Д",E:"Е",F:"Ф",G:"Г",H:"Ҳ",I:"И",J:"Ж",K:"К",L:"Л",M:"М",N:"Н",O:"О",P:"П",Q:"Қ",R:"Р",S:"С",T:"Т",U:"У",V:"В",X:"Х",Y:"Й",Z:"З",
    a:"а",b:"б",d:"д",e:"е",f:"ф",g:"г",h:"ҳ",i:"и",j:"ж",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",q:"қ",r:"р",s:"с",t:"т",u:"у",v:"в",x:"х",y:"й",z:"з"
  };

  return s.split('').map(ch => single[ch] ?? ch).join('');
}

// Приоритет по населению
function calcPriority(pop = 0, isCapital = false) {
  if (isCapital) return 110;
  if (pop >= 1_000_000) return 100;
  if (pop >= 500_000) return 90;
  if (pop >= 200_000) return 80;
  if (pop >= 100_000) return 70;
  if (pop >= 50_000) return 60;
  if (pop >= 30_000) return 50;
  return 0;
}

/* ===================== CRUD ===================== */

// GET /api/cities
exports.getCities = async (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);

    const filter = {};

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { nameRu: regex },
        { nameUzLat: regex },
        { nameUzCyr: regex },
        { nameEn: regex },
        { region: regex }
      ];
    }

    const total = await City.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const cities = await City.find(filter)
      .sort({ priority: -1, population: -1, _id: 1 })
      .skip((safePage - 1) * limit)
      .limit(limit);

    res.json({
      total,
      page: safePage,
      limit,
      cities
    });

  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};


// POST /api/cities
exports.createCity = async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json(city);
  } catch (err) {
    res.status(400).json({ message: 'Ошибка создания', error: err.message });
  }
};


// PUT /api/cities/:id
exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!city) {
      return res.status(404).json({ message: 'Город не найден' });
    }

    res.json(city);

  } catch (err) {
    res.status(400).json({ message: 'Ошибка обновления', error: err.message });
  }
};


// DELETE /api/cities (массовое удаление)
exports.deleteCities = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Нет ID для удаления' });
    }

    await City.deleteMany({ _id: { $in: ids } });

    res.json({ message: 'Удалено успешно' });

  } catch (err) {
    res.status(500).json({ message: 'Ошибка удаления', error: err.message });
  }
};


/* ===================== Импорт ===================== */

// POST /api/cities/import
exports.importCitiesFromSource = async (req, res) => {
  try {
    const username = process.env.GEONAMES_USERNAME;

    if (!username) {
      return res.status(400).json({ error: 'GEONAMES_USERNAME не указан' });
    }

    console.log("🚀 Начат импорт городов...");
    console.log("🗑 Удаляем старые города...");


    const deleted = await City.deleteMany({});
    console.log(`🧹 Удалено старых городов: ${deleted.deletedCount}`);

    const maxRows = 1000;
    let base = [];
    let startRow = 0;

    // 1) Загружаем RU
    while (true) {
      const { data } = await axios.get('http://api.geonames.org/searchJSON', {
        params: {
          country: 'UZ',
          featureClass: 'P',
          maxRows,
          startRow,
          lang: 'ru',
          username
        }
      });

      const batch = data?.geonames ?? [];
      console.log(`📦 RU batch получен: ${batch.length} записей (startRow: ${startRow})`);
      if (!batch.length) break;

      base = base.concat(batch);

      if (batch.length < maxRows) break;
      startRow += maxRows;
    }

    if (!base.length) {
      return res.status(500).json({ error: 'GeoNames не вернул населённые пункты' });
    }

    const byId = new Map();
    base.forEach(g => byId.set(g.geonameId, { ru: g, en: null, uz: null }));

    // 2) EN + UZ
    for (const lang of ['en', 'uz']) {
      startRow = 0;

      while (true) {
        const { data } = await axios.get('http://api.geonames.org/searchJSON', {
          params: {
            country: 'UZ',
            featureClass: 'P',
            maxRows,
            startRow,
            lang,
            username
          }
        });

        const batch = data?.geonames ?? [];
        console.log(`📦 ${lang.toUpperCase()} batch: ${batch.length} записей (startRow: ${startRow})`);
        if (!batch.length) break;

        batch.forEach(g => {
          const slot = byId.get(g.geonameId);
          if (slot) slot[lang] = g;
        });

        if (batch.length < maxRows) break;
        startRow += maxRows;
      }
    }

    let added = 0;

    console.log(`📊 Всего найдено уникальных городов: ${byId.size}`);
    console.log("💾 Начинаем сохранение в базу...");


    for (const [id, pack] of byId.entries()) {
      const g = pack.ru;
      const pop = Number(g.population || 0);

      const nameRu = pack.ru?.name || '';
      const nameEn = pack.en?.name || nameRu;
      const nameUzLat = pack.uz?.name || '';
      const nameUzCyr = nameUzLat ? uzLatToCyr(nameUzLat) : '';

      const isCapital =
        g.featureCode === 'PPLC' ||
        nameEn.toLowerCase() === 'tashkent';

      const priority = calcPriority(pop, isCapital);

      await City.create({
        geonameId: id,
        nameRu,
        nameEn,
        nameUzLat,
        nameUzCyr,
        region: g.adminName1 || '',
        country: g.countryCode || 'UZ',
        lat: Number(g.lat),
        lon: Number(g.lng),
        population: pop,
        priority,
        isActive: true
      });

      added++;

      if (added % 100 === 0) {
        console.log(`⏳ Сохранено ${added} городов...`);
        }
    }

    console.log(`✅ Импорт завершён. Добавлено: ${added}`);

    res.json({
      message: 'Импорт завершён',
      added,
      totalSeen: byId.size
    });

  } catch (err) {
    res.status(500).json({
      error: 'Ошибка импорта',
      details: err.message
    });
  }
};

const Route = require('../models/Route');

// нормализация города
const normalizeCity = (addr) => {
  return addr?.split(',')[0]
    .toLowerCase()
    .replace(/^г\.\s?/, '')            // убирает "г."
    .replace(/[^a-zа-яё\s]/gi, '')     // убирает всё кроме букв
    .trim();
};

exports.searchRoutes = async (req, res) => {
  try {
    const { from, to, date, type, passengers, weight } = req.body;

    if (!from || !to || !date || !type) {
      return res.status(400).json({ message: 'Обязательные поля не заполнены' });
    }

    const fromCity = normalizeCity(from.address);
    const toCity = normalizeCity(to.address);

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    console.log('[ПОИСК]:', { fromCity, toCity, type, date });

    const routes = await Route.find({
      type,
      isActive: true,
      fromCity,
      toCity,
      date: {
        $gte: searchDate,
        $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000)
      },
      ...(type === 'trip' ? { frontSeats: { $gte: passengers || 1 } } : {}),
      ...(type === 'delivery' ? { weight: { $gte: weight || 1 } } : {})
    }).populate('userId', 'firstName lastName');

    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const user = req.user;

    if (!user.isDriver || user.passportStatus !== 'confirmed' || !user.isPhoneVerified) {
      return res.status(403).json({ message: 'Только подтверждённые водители могут создавать маршруты' });
    }

    const {
      from, to, date, time,
      frontSeats, backSeats,
      frontPrice, backPrice,
      comment
    } = req.body;

    if (!from || !to || !date || !time) {
      return res.status(400).json({ message: 'Обязательные поля не заполнены' });
    }

    const fromCity = normalizeCity(from.address);
    const toCity = normalizeCity(to.address);

    const newRoute = new Route({
      userId: user._id,
      from,
      to,
      fromCity,
      toCity,
      date: new Date(date),
      time,
      frontSeats,
      backSeats,
      frontPrice,
      backPrice,
      comment,
      isActive: true
    });

    await newRoute.save();
    res.status(201).json({ message: 'Маршрут создан', route: newRoute });
  } catch (err) {
    console.error('Ошибка создания маршрута:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

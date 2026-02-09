// src/pages/profile/AddTransport.jsx
import React, { useEffect, useMemo, useState } from "react";
import { X, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import { useToast } from "../../components/ui/useToast";

const AddTransport = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const safeLang = lang || "ru";
  const { showToast } = useToast();
  const token = localStorage.getItem("token");

  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);

  const [brandId, setBrandId] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [colorId, setColorId] = useState(null);

  const [customBrand, setCustomBrand] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customColor, setCustomColor] = useState("");

  const [loading, setLoading] = useState(false);

  const selectedBrand = useMemo(() => brands.find((b) => b._id === brandId) || null, [brands, brandId]);

  useEffect(() => {
    (async () => {
      try {
        const [bRes, cRes] = await Promise.all([
          fetch(`${API_URL}/api/cars/brands`),
          fetch(`${API_URL}/api/cars/colors`),
        ]);
        const [bData, cData] = await Promise.all([bRes.json(), cRes.json()]);
        setBrands(Array.isArray(bData) ? bData : []);
        setColors(Array.isArray(cData) ? cData : []);
      } catch {
        showToast("Ошибка загрузки справочников", "error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!brandId) {
      setModels([]);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/cars/models?brand=${brandId}`);
        const data = await res.json();
        setModels(Array.isArray(data) ? data : []);
      } catch {
        showToast("Ошибка загрузки моделей", "error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  const filteredBrands = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? brands.filter((b) => (b.name || "").toLowerCase().includes(q)) : brands;
  }, [brands, search]);

  const filteredModels = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? models.filter((m) => (m.name || "").toLowerCase().includes(q)) : models;
  }, [models, search]);

  const filteredColors = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? colors.filter((c) => (c.nameRu || "").toLowerCase().includes(q)) : colors;
  }, [colors, search]);

  const goStep = (n) => {
    setStep(n);
    setSearch("");
  };

  const handleCreate = async () => {
    if (loading) return;

    const hasBrand = Boolean(brandId || customBrand.trim());
    const hasModel = Boolean(modelId || customModel.trim());
    const hasColor = Boolean(colorId || customColor.trim());

    if (!hasBrand) return showToast("Укажите марку автомобиля", "error");
    if (!hasModel) return showToast("Укажите модель автомобиля", "error");
    if (!hasColor) return showToast("Укажите цвет автомобиля", "error");

    try {
      setLoading(true);

      const payload = {
        brandId: brandId || null,
        customBrand: brandId ? null : customBrand.trim(),
        modelId: modelId || null,
        customModel: modelId ? null : customModel.trim(),
        colorId: colorId || null,
        customColor: colorId ? null : customColor.trim(),
      };

      const res = await fetch(`${API_URL}/api/profile/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || "Ошибка при добавлении транспорта";
        showToast(msg, "error");
        return;
      }

      showToast("Транспорт успешно добавлен", "success");
      navigate(`/${safeLang}/profile/transport`);
    } catch {
      showToast("Ошибка при добавлении транспорта", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button onClick={() => navigate(`/${safeLang}/profile/menu`)} className="p-2 rounded-full hover:bg-gray-100 transition">
            <X size={24} className="text-gray-700" />
          </button>
        </div>
      </header>

      <div className="max-w-[560px] mx-auto px-4">
        <h1 className="text-[28px] font-semibold text-center mb-6">
          {step === 1 && "Кто производитель?"}
          {step === 2 && "Какая модель?"}
          {step === 3 && "Какой цвет?"}
        </h1>

        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Введите название" className="w-full h-[56px] rounded-xl border border-gray-300 px-4 text-[16px] mb-4 focus:outline-none focus:border-[#32BB78]  transition" />

        {/* STEP 1: BRAND */}
        {step === 1 && (
          <div className="space-y-2">
            {filteredBrands.map((b, idx) => (
              <React.Fragment key={b._id}>
                <button
                  onClick={() => {
                    setBrandId(b._id);
                    setCustomBrand("");
                    setModelId(null);
                    setCustomModel("");
                    setColorId(null);
                    setCustomColor("");
                    goStep(2);
                  }}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-xl hover:bg-gray-100  transition"
                >
                  <div className="flex items-center gap-3">
                    <img src={b.logo?.url} alt={b.name} className="w-8 h-8 object-contain" />
                    <span className="text-[16px] font-medium">{b.name}</span>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </button>
                {idx !== filteredBrands.length - 1 && <div className="h-[1px] bg-gray-200 w-full rounded-full" />}
              </React.Fragment>
            ))}

            <input
              value={customBrand}
              onChange={(e) => {
                setCustomBrand(e.target.value);
                setBrandId(null);
                setModelId(null);
                setCustomModel("");
                setModels([]);
                setColorId(null);
                setCustomColor("");
              }}
              placeholder="Другая марка"
              className="w-full h-[56px] rounded-xl border border-gray-300 px-4 text-[16px] transition mb-10"
            />

            {customBrand.trim() && (
              <button onClick={() => goStep(2)} className="w-full h-[52px] rounded-xl bg-[#32BB78] text-white text-[17px] font-semibold hover:bg-[#2aa86e] transition mb-10">
                Далее
              </button>
            )}
          </div>
        )}

        {/* STEP 2: MODEL */}
        {step === 2 && (
          <div className="space-y-2">
            {filteredModels.map((m, idx) => (
              <React.Fragment key={m._id}>
                <button
                  onClick={() => {
                    setModelId(m._id);
                    setCustomModel("");
                    setColorId(null);
                    setCustomColor("");
                    goStep(3);
                  }}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-xl hover:bg-gray-100  transition"
                >
                  <div className="flex items-center gap-3">
                    {selectedBrand?.logo?.url ? <img src={selectedBrand.logo.url} alt={selectedBrand.name} className="w-8 h-8 object-contain" /> : <div className="w-8 h-8" />}
                    <span className="text-[16px] font-medium">{m.name}</span>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </button>
                {idx !== filteredModels.length - 1 && <div className="h-[1px] bg-gray-200 w-full rounded-full" />}
              </React.Fragment>
            ))}

            <input
              value={customModel}
              onChange={(e) => {
                setCustomModel(e.target.value);
                setModelId(null);
                setColorId(null);
                setCustomColor("");
              }}
              placeholder="Другая модель"
              className="w-full h-[56px] rounded-xl border border-gray-300 px-4 text-[16px]  transition"
            />

            {customModel.trim() && (
              <button onClick={() => goStep(3)} className="w-full h-[52px] rounded-xl bg-[#32BB78] text-white text-[17px] font-semibold hover:bg-[#2aa86e] transition">
                Далее
              </button>
            )}
          </div>
        )}

        
        {/* STEP 3: COLOR */}
        {step === 3 && (
          <div className="space-y-2">
            {filteredColors.map((c, idx) => (
              <React.Fragment key={c._id}>
                <button
                  onClick={() => {
                    setColorId(c._id);
                    setCustomColor("");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl  transition ${colorId === c._id ? "bg-gray-100" : "hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                    <span className="text-[16px] font-medium">{c.nameRu}</span>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </button>
                {idx !== filteredColors.length - 1 && <div className="h-[1px] bg-gray-200 w-full rounded-full" />}
              </React.Fragment>
            ))}

            <input
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                setColorId(null);
              }}
              placeholder="Другой цвет"
              className="w-full h-[56px] rounded-xl border border-gray-300 px-4 text-[16px]  transition"
            />

            <button
              onClick={handleCreate}
              disabled={loading || (!colorId && !customColor.trim())}
              className="w-full h-[52px] rounded-xl bg-[#32BB78] text-white text-[17px] font-semibold flex items-center justify-center gap-2 hover:bg-[#2aa86e] transition disabled:opacity-60 disabled:hover:bg-[#32BB78]"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Добавить транспорт"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTransport;

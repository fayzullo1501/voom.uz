// src/pages/profile/EditTransport.jsx
import React, { useEffect, useState } from "react";
import { X, Calendar, Trash2, Loader2, ChevronLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import { useToast } from "../../components/ui/useToast";
import uzFlag from "../../assets/uz-flag.svg";

const EditTransport = () => {
  const navigate = useNavigate();
  const { lang, id } = useParams();
  const { showToast } = useToast();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changed, setChanged] = useState(false);

  const [car, setCar] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [plateNumber, setPlateNumber] = useState("");
  const [productionYear, setProductionYear] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/profile/cars/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setCar(data);
        setPhotos(data.photos || []);
        setPlateNumber(data.plateNumber || "");
        setProductionYear(data.productionYear || "");
      })
      .catch(() => showToast("Ошибка загрузки транспорта", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/api/profile/cars/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plateNumber, productionYear }),
      });
      if (!res.ok) throw new Error();
      showToast("Изменения сохранены", "success");
      setChanged(false);
    } catch {
      showToast("Ошибка сохранения", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;

    const confirmed = window.confirm("Вы уверены, что хотите удалить транспорт?");
    if (!confirmed) return;

    try {
      setDeleting(true);

      const res = await fetch(`${API_URL}/api/profile/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      showToast("Транспорт удалён", "success");
      navigate(`/${lang}/profile/transport`);
    } catch {
      showToast("Ошибка удаления транспорта", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
      </div>
    );
  }

  const brandName = car.brand?.name || car.customBrand || "—";
  const modelName = car.model?.name || car.customModel || "—";
  const colorName = car.color?.nameRu || car.customColor || "—";
  const colorHex = car.color?.hex || "#e5e7eb";
  const mainPhoto = photos[0];

  const renderPlateView = () => {
    const empty = !plateNumber;
    return (
      <div className="relative w-full max-w-[320px] md:max-w-[380px] h-[72px] md:h-[86px] border-2 border-[#0F2A3D] rounded-[10px] md:rounded-[12px] flex items-center overflow-hidden">
        <span className="absolute left-[10px] w-[8px] h-[8px] top-1/2 -translate-y-1/2 rounded-full bg-black" />
        <div className="w-[70px] md:w-[90px] h-full flex items-center justify-center pl-6 border-r-2 border-[#0F2A3D] text-[24px] md:text-[36px] font-plate tracking-[2px] whitespace-nowrap">
          {empty ? <span className="text-gray-300">40</span> : plateNumber.slice(0, 2)}
        </div>
        <div className="flex-1 h-full flex items-center justify-center px-6 text-[24px] md:text-[36px] font-plate tracking-[2px] whitespace-nowrap">
          {empty ? (
            <>
              <span className="text-gray-300">H</span>
              <span className="text-gray-300">024</span>
              <span className="text-gray-300">AX</span>
            </>
          ) : (
            <span>{plateNumber.slice(2)}</span>
          )}
        </div>
        <div className="w-[70px] md:w-[85px] h-full flex flex-col items-center justify-center pr-8">
          <img src={uzFlag} className="w-6 h-4" />
          <span className="text-[13px] font-semibold text-blue-700">UZ</span>
        </div>
        <span className="absolute right-[18px] w-[8px] h-[8px] top-1/2 -translate-y-1/2 rounded-full bg-black" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10">
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button className="p-2 rounded-full invisible">
            <X size={24} />
          </button>
        </div>
      </header>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-[440px] flex items-center justify-center">
          <button onClick={() => navigate(`/${lang}/profile/transport`)} className="absolute left-0 p-2 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[28px] font-semibold">Детали автомобиля</h1>
        </div>
      </div>

      <div className="max-w-[420px] mx-auto">
        {/* MAIN PHOTO */}
        <button
          onClick={() => navigate(`/${lang}/profile/transport/${id}/photos`)}
          className="w-full mb-8"
        >
          {!mainPhoto && (
            <div className="w-full h-[180px] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 text-[15px] hover:bg-gray-200 transition">
              Добавить фото транспорта
            </div>
          )}
          {mainPhoto && (
            <div className="relative w-full h-[180px] rounded-2xl overflow-hidden">
              <img src={mainPhoto.url} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow">
                <Pencil size={16} />
              </div>
            </div>
          )}
        </button>

        <div className="mb-5">
          <div className="text-gray-500 text-[14px] mb-1">Марка</div>
          <div className="text-[18px] font-medium">{brandName}</div>
        </div>

        <div className="mb-5">
          <div className="text-gray-500 text-[14px] mb-1">Модель</div>
          <div className="text-[18px] font-medium">{modelName}</div>
        </div>

        <button onClick={() => navigate(`/${lang}/profile/transport/${id}/plate`)} className="w-full text-left mb-6">
          <div className="text-gray-500 text-[14px] mb-2">Гос. номер</div>
          {renderPlateView()}
        </button>

        <div className="mb-6">
          <div className="text-gray-500 text-[14px] mb-1">Год выпуска</div>
          <div className="flex items-center gap-3 h-[48px]">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              value={productionYear}
              placeholder="XXXX"
              onChange={(e) => {
                setProductionYear(e.target.value);
                setChanged(true);
              }}
              className="text-[18px] font-medium focus:outline-none placeholder-gray-300"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="text-gray-500 text-[14px] mb-1">Цвет</div>
          <div className="flex items-center gap-3 h-[48px]">
            <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: colorHex }} />
            <span className="text-[16px]">{colorName}</span>
          </div>
        </div>

        {!changed && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full flex items-center justify-center gap-2 text-red-500 text-[15px] font-medium disabled:opacity-60"
          >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Удалить транспорт
          </button>
        )}

        {changed && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-[52px] mt-4 rounded-xl bg-[#32BB78] text-white text-[17px] font-semibold flex items-center justify-center gap-2 hover:bg-[#2aa86e] transition disabled:opacity-70"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : "Сохранить"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditTransport;

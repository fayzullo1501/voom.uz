// src/pages/profile/MyTransport.jsx
import React, { useEffect, useState } from "react";
import { X, ChevronRight, Calendar, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import uzFlag from "../../assets/uz-flag.svg";

const MyTransport = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const token = localStorage.getItem("token");

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/profile/cars`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setCars(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">
      <header>
        <div className="container-wide flex items-center justify-end">
          <button onClick={() => navigate(`/${lang}/profile/menu`)} className="p-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>

      <h1 className="text-[32px] sm:text-[36px] font-semibold text-center mt-4">Мои автомобили</h1>

      {loading && (
        <div className="mt-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
        </div>
      )}

      {!loading && cars.length === 0 && <div className="mt-10 text-center text-gray-500">У вас пока нет добавленного транспорта</div>}

      <div className="mt-8 flex flex-col items-center gap-4">
        {cars.map((car) => {
          const brandName = car.brand?.name || car.customBrand || "—";
          const modelName = car.model?.name || car.customModel || "—";
          const logoUrl = car.brand?.logo?.url || null;
          const colorName = car.color?.nameRu || car.customColor || null;
          const colorHex = car.color?.hex || "#E5E7EB";
          const plate = car.plateNumber || "XX X XXX X";
          const year = car.productionYear || "XXXX";

          return (
            <button
              key={car._id}
              onClick={() => navigate(`/${lang}/profile/transport/${car._id}/edit`)}
              className="w-full max-w-[380px] min-h-[130px] border border-gray-200 rounded-2xl px-5 py-6 flex items-center justify-between hover:bg-gray-100 transition"
            >
              <div className="flex flex-col gap-4 text-left w-full">
                <div className="flex items-start gap-3">
                  {logoUrl && <img src={logoUrl} alt={brandName} className="h-[44px] w-auto object-contain flex-shrink-0" />}
                  <div className="text-[18px] font-semibold leading-tight">
                    {brandName}
                    <br />
                    {modelName}
                  </div>
                </div>

                <div className="flex items-center gap-5 text-[14px] text-gray-700 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{year}</span>
                  </div>

                  {colorName && (
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: colorHex }} />
                      <span className="font-medium">{colorName}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <img src={uzFlag} alt="UZ" className="w-4 h-4" />
                    <span className="font-medium tracking-wide">{plate}</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-6 h-6 text-black flex-shrink-0" />
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8 flex justify-center">
        <button
          onClick={() => navigate(`/${lang}/profile/transport/add`)}
          className="w-full max-w-[380px] h-[56px] rounded-xl bg-[#32BB78] text-white text-[17px] font-semibold hover:bg-[#2aa86e] transition"
        >
          Добавить транспорт
        </button>
      </div>
    </div>
  );
};

export default MyTransport;

// src/components/users/UserCarsTab.jsx
import { useState } from "react";
import { Car, Eye, X } from "lucide-react";

const Loader = () => (
  <div className="h-[260px] flex flex-col items-center justify-center text-gray-500 gap-3">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
    <div className="text-[15px]">Загрузка</div>
  </div>
);

/* ===== МОДАЛКА ФОТО ===== */
const PhotosModal = ({ car, onClose }) => {
  if (!car) return null;

  const brandName = car.brand?.name || car.customBrand || "";
  const modelName = car.model?.name || car.customModel || "";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-[950px] max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="text-[18px] font-semibold text-gray-900">
            Фото автомобиля — {brandName} {modelName}
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto">
          {car.photos?.length ? (
            <div className="grid grid-cols-3 gap-5">
              {car.photos.map((p) => (
                <div
                  key={p._id}
                  className="group relative rounded-xl overflow-hidden border border-gray-200"
                >
                  <img
                    src={p.url}
                    alt="car"
                    className="w-full h-[220px] object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-16 text-[15px]">
              Фото отсутствуют
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserCarsTab = ({ cars, loading }) => {
  const [selectedCar, setSelectedCar] = useState(null);

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-2xl p-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-2xl p-6">
      <div className="text-[18px] font-semibold flex items-center gap-2 mb-6">
        <Car size={18} />
        Автомобили пользователя ({cars?.length || 0})
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-[14px]">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left w-[80px]">ID</th>
              <th className="px-4 py-3 text-left w-[80px]">Лого</th>
              <th className="px-4 py-3 text-left">Марка</th>
              <th className="px-4 py-3 text-left">Модель</th>
              <th className="px-4 py-3 text-left">Цвет</th>
              <th className="px-4 py-3 text-left">Гос. номер</th>
              <th className="px-4 py-3 text-left">Год</th>
              <th className="px-4 py-3 w-[80px]"></th>
            </tr>
          </thead>

          <tbody>
            {cars?.length ? (
              cars.map((car) => (
                <tr key={car._id} className="border-t">
                  <td className="px-4 py-3 text-gray-500">
                    {car._id.slice(-6)}
                  </td>

                  <td className="px-4 py-3">
                    {car.brand?.logo?.url ? (
                    <img
                        src={car.brand.logo.url}
                        alt="logo"
                        className="w-10 h-10 object-contain"
                    />
                    ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                    )}
                  </td>

                  <td className="px-4 py-3">{car.brand?.name || car.customBrand || "—"}</td>
                  <td className="px-4 py-3">{car.model?.name || car.customModel || "—"}</td>
                  <td className="px-4 py-3">{car.color?.nameRu || car.customColor || "—"}</td>
                  <td className="px-4 py-3">{car.plateNumber || "—"}</td>
                  <td className="px-4 py-3">{car.productionYear || "—"}</td>

                  <td className="px-4 py-3 flex justify-end">
                    <button
                      onClick={() => setSelectedCar(car)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                  Автомобили не добавлены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCar && (
        <PhotosModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  );
};

export default UserCarsTab;
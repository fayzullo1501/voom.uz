// src/components/users/UserRoutesTab.jsx
import { useState } from "react";
import { Route, Eye, X } from "lucide-react";

const Loader = () => (
  <div className="h-[260px] flex flex-col items-center justify-center text-gray-500 gap-3">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
    <div className="text-[15px]">Загрузка</div>
  </div>
);

/* ===============================
   STATUS UI
=============================== */
const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-gray-200 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const labels = {
    active: "Активный",
    in_progress: "В пути",
    completed: "Завершён",
    cancelled: "Отменён",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[13px] font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

/* ===============================
   PASSENGERS MODAL
=============================== */
const PassengersModal = ({ route, onClose }) => {
  if (!route) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[800px] max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="text-[18px] font-semibold">
            Пассажиры маршрута
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto">
          {route.confirmedPassengers?.length ? (
            <table className="w-full text-[14px] border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left w-[80px]">ID</th>
                  <th className="px-4 py-3 text-left w-[80px]">Фото</th>
                  <th className="px-4 py-3 text-left">Имя</th>
                  <th className="px-4 py-3 text-left">Фамилия</th>
                  <th className="px-4 py-3 text-left">Телефон</th>
                </tr>
              </thead>

              <tbody>
                {route.confirmedPassengers
                .filter(Boolean)
                .map((p) => (
                    <tr key={p._id} className="border-t">
                    <td className="px-4 py-3 text-gray-500">
                      {p._id.slice(-6)}
                    </td>

                    <td className="px-4 py-3">
                      {p.profilePhoto?.url ? (
                        <img
                          src={p.profilePhoto.url}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                      )}
                    </td>

                    <td className="px-4 py-3">{p.firstName || "—"}</td>
                    <td className="px-4 py-3">{p.lastName || "—"}</td>
                    <td className="px-4 py-3">
                      {p.phone
                        ? `+998 ${p.phone.slice(0,2)} ${p.phone.slice(2,5)} ${p.phone.slice(5,7)} ${p.phone.slice(7,9)}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-400 py-16">
              Подтверждённых пассажиров нет
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===============================
   MAIN COMPONENT
=============================== */
const UserRoutesTab = ({ routes, loading }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);

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
        <Route size={18} />
        Маршруты пользователя ({routes?.length || 0})
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-[14px]">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left w-[80px]">ID</th>
              <th className="px-4 py-3 text-left">Откуда</th>
              <th className="px-4 py-3 text-left">Куда</th>
              <th className="px-4 py-3 text-left">Дата и время</th>
              <th className="px-4 py-3 text-left w-[120px]">
                Пассажиры
              </th>
              <th className="px-4 py-3 text-left w-[150px]">
                Статус
              </th>
            </tr>
          </thead>

          <tbody>
            {routes?.length ? (
              routes.map((route) => (
                <tr key={route._id} className="border-t">
                  <td className="px-4 py-3 text-gray-500">
                    {route._id.slice(-6)}
                  </td>

                  <td className="px-4 py-3">
                    {route.fromCity?.nameRu || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {route.toCity?.nameRu || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {route.departureAt
                    ? new Date(route.departureAt).toLocaleString("ru-RU")
                    : "—"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span>
                        {route.confirmedPassengers?.length || 0}
                      </span>

                      <button
                        onClick={() => setSelectedRoute(route)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={route.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  Маршруты не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRoute && (
        <PassengersModal
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
        />
      )}
    </div>
  );
};

export default UserRoutesTab;
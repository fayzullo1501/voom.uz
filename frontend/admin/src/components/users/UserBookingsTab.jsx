import { useState } from "react";
import { Ticket, Eye, X } from "lucide-react";

/* ===============================
   HELPERS
=============================== */

const formatPhone = (phone) => {
  if (!phone) return "—";
  return `+998 ${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(
    5,
    7
  )} ${phone.slice(7, 9)}`;
};

const formatSeatType = (type) => {
  const map = {
    front: "Переднее",
    back: "Заднее",
    whole: "Вся машина",
  };
  return map[type] || type;
};

/* ===============================
   LOADER
=============================== */

const Loader = () => (
  <div className="h-[260px] flex items-center justify-center text-gray-500">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
  </div>
);

/* ===============================
   STATUS BADGE
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
   DRIVER MODAL
=============================== */

const DriverModal = ({ driver, onClose }) => {
  if (!driver) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[500px] rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-6">
          <div className="text-[18px] font-semibold">
            Информация о водителе
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          {driver.profilePhoto?.url ? (
            <img
              src={driver.profilePhoto.url}
              className="w-20 h-20 rounded-full object-cover"
              alt=""
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200" />
          )}

          <div>
            <div className="font-semibold text-[16px]">
              {driver.firstName} {driver.lastName}
            </div>
            <div className="text-gray-500 text-[14px]">
              {formatPhone(driver.phone)}
            </div>
          </div>
        </div>

        <div className="text-[14px] text-gray-500">
          ID: {driver._id}
        </div>
      </div>
    </div>
  );
};

/* ===============================
   PASSENGERS MODAL
=============================== */

const PassengersModal = ({ passengers, onClose }) => {
  if (!passengers) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[950px] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between p-6 border-b">
          <div className="text-[18px] font-semibold">
            Пассажиры поездки
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {passengers.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              Подтверждённых пассажиров нет
            </div>
          ) : (
            <table className="w-full text-[14px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Фото</th>
                  <th className="px-4 py-3 text-left">Имя</th>
                  <th className="px-4 py-3 text-left">Фамилия</th>
                  <th className="px-4 py-3 text-left">Телефон</th>
                  <th className="px-4 py-3 text-left">Место</th>
                  <th className="px-4 py-3 text-left">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-4 py-3">
                      {p._id?.slice(-6)}
                    </td>
                    <td className="px-4 py-3">
                      {p.profilePhoto?.url ? (
                        <img
                          src={p.profilePhoto.url}
                          className="w-10 h-10 rounded-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                      )}
                    </td>
                    <td className="px-4 py-3">{p.firstName}</td>
                    <td className="px-4 py-3">{p.lastName}</td>
                    <td className="px-4 py-3">
                      {formatPhone(p.phone)}
                    </td>
                    <td className="px-4 py-3">
                      {formatSeatType(p.seatType)}
                    </td>
                    <td className="px-4 py-3">
                      {p.totalPrice} сум
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===============================
   CAR MODAL
=============================== */

const CarModal = ({ car, onClose }) => {
  if (!car) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[650px] rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-6">
          <div className="text-[18px] font-semibold">
            Информация о машине
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {car.photos?.length > 0 && (
          <img
            src={car.photos[0].url}
            className="w-full h-52 object-cover rounded-xl mb-6"
            alt=""
          />
        )}

        <div className="space-y-2 text-[14px]">
          <div>ID: {car._id}</div>
          <div> Марка: {car.brand?.name || car.customBrand || "—"} </div>
          <div> Модель: {car.model?.name || car.customModel || "—"} </div>
          <div>Цвет: {car.color?.nameRu}</div>
          <div>Гос номер: {car.plateNumber}</div>
          <div>Год: {car.productionYear}</div>
        </div>
      </div>
    </div>
  );
};

/* ===============================
   MAIN COMPONENT
=============================== */

const UserBookingsTab = ({ bookings, loading }) => {
  const [driver, setDriver] = useState(null);
  const [passengers, setPassengers] = useState(null);
  const [car, setCar] = useState(null);

  if (loading) return <Loader />;

  return (
    <div className="border border-gray-200 rounded-2xl p-6">
      <div className="text-[18px] font-semibold flex items-center gap-2 mb-6">
        <Ticket size={18} />
        Бронирования пользователя ({bookings?.length || 0})
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-[14px]">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Откуда</th>
              <th className="px-4 py-3 text-left">Куда</th>
              <th className="px-4 py-3 text-left">Дата</th>
              <th className="px-4 py-3 text-left">Водитель</th>
              <th className="px-4 py-3 text-left">Сумма</th>
              <th className="px-4 py-3 text-left">Пассажиры</th>
              <th className="px-4 py-3 text-left">Машина</th>
              <th className="px-4 py-3 text-left">Статус</th>
            </tr>
          </thead>

          <tbody>
            {bookings?.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="px-4 py-3">
                  {b._id?.slice(-6)}
                </td>

                <td className="px-4 py-3">
                  {b.route?.fromCity?.nameRu || "—"}
                </td>

                <td className="px-4 py-3">
                  {b.route?.toCity?.nameRu || "—"}
                </td>

                <td className="px-4 py-3">
                  {b.route?.departureAt
                    ? new Date(
                        b.route.departureAt
                      ).toLocaleString("ru-RU")
                    : "—"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {b.route?.driver?.firstName || "—"}
                    <Eye
                      size={16}
                      className="cursor-pointer"
                      onClick={() =>
                        b.route?.driver &&
                        setDriver(b.route.driver)
                      }
                    />
                  </div>
                </td>

                <td className="px-4 py-3">
                  {b.totalPrice} сум
                </td>

                <td className="px-4 py-3">
                  <Eye
                    size={16}
                    className="cursor-pointer"
                    onClick={() =>
                      setPassengers(
                        b.confirmedPassengers || []
                      )
                    }
                  />
                </td>

                <td className="px-4 py-3">
                  <Eye
                    size={16}
                    className="cursor-pointer"
                    onClick={() =>
                      b.route?.car && setCar(b.route.car)
                    }
                  />
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={b.route?.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {driver && (
        <DriverModal
          driver={driver}
          onClose={() => setDriver(null)}
        />
      )}

      {passengers && (
        <PassengersModal
          passengers={passengers}
          onClose={() => setPassengers(null)}
        />
      )}

      {car && (
        <CarModal
          car={car}
          onClose={() => setCar(null)}
        />
      )}
    </div>
  );
};

export default UserBookingsTab;
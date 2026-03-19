// src/components/profile/PassengerBookingModal.jsx
import { X, Check, X as XIcon, MapPin } from "lucide-react";

const formatPhone = (phone) => {
  if (!phone) return "";

  const clean = phone.replace(/\D/g, "");

  if (clean.length === 9) {
    return `+998 ${clean.slice(0,2)} ${clean.slice(2,5)} ${clean.slice(5,7)} ${clean.slice(7,9)}`;
  }

  return phone;
};

const PassengerBookingModal = ({
  booking,
  onClose,
  onAccept,
  onReject,
}) => {
  if (!booking) return null;

  const passenger = booking.passenger;

  const pickup = booking.pickupLocation || {};
    const dropoff = booking.dropoffLocation || {};

    const hasPickupCoords = pickup.lat && pickup.lng;
    const hasDropoffCoords = dropoff.lat && dropoff.lng;

    const openMap = (lat, lng) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
    };
  
  return (
    <div
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center px-4"
        >
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[720px] bg-white rounded-2xl overflow-hidden"
        >

        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <span className="font-semibold text-lg">Информация о пассажире</span>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-5">

          {/* USER */}
          <div className="flex items-center gap-4">
            <img
              src={passenger?.profilePhoto?.url}
              className="w-16 h-16 rounded-full object-cover"
            />

            <div>
              <div className="font-semibold text-[18px]">
                {booking.passengerName ||
                  `${passenger?.firstName || ""} ${passenger?.lastName || ""}`}
              </div>

              <div className="text-gray-600">
                {formatPhone(booking.passengerPhone || passenger?.phone)}
              </div>
            </div>
          </div>

          {/* ROUTE INFO */}
          <div className="space-y-3 text-sm">

            <div>
            <div className="text-gray-500">Откуда забрать</div>

            <div className="flex items-center justify-between gap-3">
                <div className="font-medium">
                {pickup.address || "—"}
                </div>

                {hasPickupCoords && (
                <button
                    onClick={() => openMap(pickup.lat, pickup.lng)}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                    <MapPin size={16} />
                </button>
                )}
            </div>
            </div>

           <div>
            <div className="text-gray-500">Куда доставить</div>

            <div className="flex items-center justify-between gap-3">
                <div className="font-medium">
                {dropoff.address || "—"}
                </div>

                {hasDropoffCoords && (
                <button
                    onClick={() => openMap(dropoff.lat, dropoff.lng)}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                    <MapPin size={16} />
                </button>
                )}
            </div>
            </div>

            <div>
              <div className="text-gray-500">Места</div>
              <div className="font-medium">
                {booking.seatType === "whole"
                  ? "Вся машина"
                  : `${booking.seatType === "front" ? "Переднее" : "Заднее"} × ${booking.seatsCount}`}
              </div>
            </div>

            {booking.message && (
            <div>
                <div className="text-gray-500">Комментарий</div>
                <div className="font-medium">
                {booking.message}
                </div>
            </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        {booking.status === "pending" && (
          <div className="p-5 border-t flex gap-3">
            <button
              onClick={() => onAccept(booking._id)}
              className="flex-1 h-[52px] bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Принять
            </button>

            <button
              onClick={() => onReject(booking._id)}
              className="flex-1 h-[52px] bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <XIcon size={20} />
              Отклонить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerBookingModal;
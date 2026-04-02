import { useState } from "react";
import { X, Check, X as XIcon, MapPin, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import HiddenContact from "../ui/HiddenContact";

const BOOKING_FEE = 3000;

const formatPhone = (phone) => {
  if (!phone) return "";
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 9) {
    return `+998 ${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 7)} ${clean.slice(7, 9)}`;
  }
  return phone;
};

const PassengerBookingModal = ({
  booking,
  onClose,
  onAccept,
  onReject,
}) => {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();
  const { lang } = useParams();

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  if (!booking) return null;

  const passenger = booking.passenger;
  const isAccepted = booking.status === "accepted";

  const pickup = booking.pickupLocation || {};
  const dropoff = booking.dropoffLocation || {};

  const hasPickupCoords = pickup.lat && pickup.lng;
  const hasDropoffCoords = dropoff.lat && dropoff.lng;

  const openMap = (lat, lng) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
  };

  const handleAccept = async () => {
    setAcceptLoading(true);
    setInsufficientBalance(false);
    try {
      await onAccept(booking._id, (err) => {
        if (err === "insufficient_balance") {
          setInsufficientBalance(true);
        }
      });
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleReject = async () => {
    setRejectLoading(true);
    try {
      await onReject(booking._id);
    } finally {
      setRejectLoading(false);
    }
  };

  const seatLabel =
    booking.seatType === "whole"
      ? t("passengerModal.seatWhole")
      : `${booking.seatType === "front" ? t("passengerModal.seatFront") : t("passengerModal.seatBack")} × ${booking.seatsCount}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/40 flex items-end sm:items-center justify-center sm:px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-[720px] bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <span className="font-semibold text-lg">{t("passengerModal.title")}</span>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* USER */}
          <div className="flex items-center gap-4">
            {passenger?.profilePhoto?.url ? (
              <img
                src={passenger.profilePhoto.url}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0" />
            )}

            <div>
              <div className="font-semibold text-[18px]">
                {booking.passengerName ||
                  `${passenger?.firstName || ""} ${passenger?.lastName || ""}`.trim()}
              </div>

              {/* Контакт: скрыт до принятия */}
              {isAccepted ? (
                <div className="text-gray-600 mt-1">
                  {formatPhone(booking.passengerPhone || passenger?.phone)}
                </div>
              ) : (
                <div className="mt-1">
                  <HiddenContact fee={BOOKING_FEE} />
                </div>
              )}
            </div>
          </div>

          {/* ROUTE INFO */}
          <div className="space-y-3 text-sm">

            <div>
              <div className="text-gray-500">{t("passengerModal.pickup")}</div>
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{pickup.address || "—"}</div>
                {hasPickupCoords && (
                  <button
                    onClick={() => openMap(pickup.lat, pickup.lng)}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 flex-shrink-0"
                  >
                    <MapPin size={16} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="text-gray-500">{t("passengerModal.dropoff")}</div>
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{dropoff.address || "—"}</div>
                {hasDropoffCoords && (
                  <button
                    onClick={() => openMap(dropoff.lat, dropoff.lng)}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 flex-shrink-0"
                  >
                    <MapPin size={16} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="text-gray-500">{t("passengerModal.seats")}</div>
              <div className="font-medium">{seatLabel}</div>
            </div>

            {booking.message && (
              <div>
                <div className="text-gray-500">{t("passengerModal.comment")}</div>
                <div className="font-medium">{booking.message}</div>
              </div>
            )}
          </div>

          {/* Insufficient balance warning */}
          {insufficientBalance && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <Wallet size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-red-700">
                  {t("passengerModal.insufficientBalance")}
                </div>
                <div className="text-sm text-red-600 mt-0.5">
                  {t("passengerModal.insufficientBalanceHint")}
                </div>
                <button
                  onClick={() => navigate(`/${lang}/profile/balance/top-up`)}
                  className="mt-2 text-sm font-medium text-red-700 underline"
                >
                  {t("passengerModal.topUpBalance")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {booking.status === "pending" && (
          <div className="p-5 border-t flex gap-3">
            <button
              onClick={handleAccept}
              disabled={acceptLoading || rejectLoading}
              className="flex-1 h-[52px] bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Check size={20} />
              {acceptLoading ? t("passengerModal.accepting") : t("passengerModal.accept")}
            </button>

            <button
              onClick={handleReject}
              disabled={acceptLoading || rejectLoading}
              className="flex-1 h-[52px] bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <XIcon size={20} />
              {rejectLoading ? t("passengerModal.rejecting") : t("passengerModal.reject")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerBookingModal;

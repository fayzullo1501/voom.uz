// src/components/profile/MyBookingDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../config/api";
import { ChevronLeft, Maximize2, X, Star, FileText, Loader2 } from "lucide-react";
import driverAvatar from "../../assets/driverbookingtest.jpg";
import avatarPlaceholder from "../../assets/avatar-placeholder.svg";
import carAvatar from "../../assets/carbookingtest.jpg";
import userVerified from "../../assets/userverified.svg";
import PlateNumber from "../../components/ui/PlateNumber";
import HiddenContact from "../../components/ui/HiddenContact";


const MyBookingDetails = () => {
  const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation("profile");

  const locale =
    i18n.language === "uz" ? "uz-UZ" :
    i18n.language === "en" ? "en-US" : "ru-RU";

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapOpen, setMapOpen] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const mapRef = useRef(null);
  const modalMapRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmitReview = async () => {
    if (!rating) return;

    try {
      const res = await fetch(
        `${API_URL}/api/bookings/${id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            rating,
            comment: review,
          }),
        }
      );

      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Review error:", err);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm(t("bookingDetails.cancelConfirm"))) return;

    try {
      const res = await fetch(
        `${API_URL}/api/bookings/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        navigate(-1);
      }
    } catch (err) {
      console.error("Cancel booking error:", err);
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setMapLoading(true);

        const res = await fetch(
          `${API_URL}/api/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setBooking(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  useEffect(() => {
    if (!booking?.route?.polyline) return;

    const initMap = () => {
      setMapLoading(false);
      if (!window.google?.maps?.geometry) return;

      const decodedPath =
        window.google.maps.geometry.encoding.decodePath(
          booking.route.polyline
        );

      if (!decodedPath.length || !mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
      });

      const polyline = new window.google.maps.Polyline({
        path: decodedPath,
        strokeColor: "#2563EB",
        strokeOpacity: 0.95,
        strokeWeight: 8,
        geodesic: true,
      });

      polyline.setMap(map);

      new window.google.maps.Marker({
        position: decodedPath[0],
        map: map,
        label: { text: "A", color: "#ffffff", fontWeight: "bold" },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#2563EB",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      new window.google.maps.Marker({
        position: decodedPath[decodedPath.length - 1],
        map: map,
        label: { text: "B", color: "#ffffff", fontWeight: "bold" },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#2563EB",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      const bounds = new window.google.maps.LatLngBounds();
      decodedPath.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, 30);
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=geometry`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [booking]);

  useEffect(() => {
    if (!mapOpen || !booking?.route?.polyline) return;
    if (!window.google?.maps?.geometry) return;
    if (!modalMapRef.current) return;

    const decodedPath =
      window.google.maps.geometry.encoding.decodePath(
        booking.route.polyline
      );

    if (!decodedPath.length) return;

    const map = new window.google.maps.Map(modalMapRef.current, {
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
    });

    const polyline = new window.google.maps.Polyline({
      path: decodedPath,
      strokeColor: "#2563EB",
      strokeOpacity: 0.95,
      strokeWeight: 8,
      geodesic: true,
    });

    polyline.setMap(map);

    new window.google.maps.Marker({
      position: decodedPath[0],
      map,
      label: { text: "A", color: "#fff", fontWeight: "bold" },
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#2563EB",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });

    new window.google.maps.Marker({
      position: decodedPath[decodedPath.length - 1],
      map,
      label: { text: "B", color: "#fff", fontWeight: "bold" },
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#2563EB",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });

    const bounds = new window.google.maps.LatLngBounds();
    decodedPath.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds);
  }, [mapOpen, booking]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
      </div>
    );

  const driver = booking?.route?.driver;

  const isVerified =
    driver?.phoneVerified &&
    driver?.emailVerified &&
    driver?.profilePhoto?.status === "approved" &&
    driver?.passport?.status === "approved";

  const car = booking?.route?.car;

  const carPhoto =
    car?.photos?.length > 0
      ? car.photos[0].url
      : carAvatar;

  const carBrand = car?.brand?.name || car?.customBrand || "";
  const carModel = car?.model?.name || car?.customModel || "";
  const carColor = car?.color?.nameRu || car?.customColor || "";

  const carName = `${carBrand} ${carModel}`.trim();

  const plate = car?.plateNumber || "";

  const passengers = [
    booking,
    ...(booking?.route?.bookings || []).filter(
      (b) => b._id !== booking._id && b.status === "accepted"
    ),
  ];

  const mySeats = booking?.seatsCount || 0;

  const totalPassengers =
    booking?.route?.bookings
      ?.filter((b) => b.status === "accepted")
      ?.reduce((sum, b) => sum + (b.seatsCount || 0), 0) || 0;

  const passengerName =
    booking?.passengerName ||
    `${booking?.passenger?.firstName || ""} ${booking?.passenger?.lastName || ""}`.trim();

  const passengerPhone =
    booking?.passengerPhone || booking?.passenger?.phone || "";

  const isMe =
    passengerName ===
    `${booking?.passenger?.firstName || ""} ${booking?.passenger?.lastName || ""}`.trim();

  const bookedBy = isMe
    ? t("bookingDetails.me")
    : `${passengerName} (${passengerPhone})`;

  const totalPrice = booking?.totalPrice || 0;

  const departureDateFormatted = booking
    ? new Date(booking.route?.departureAt).toLocaleDateString(locale)
    : "";

  const departureDateLong = booking
    ? new Date(booking.route?.departureAt).toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const departureTime = booking
    ? new Date(booking.route?.departureAt).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const arrivalTime = booking
    ? new Date(booking.route?.arrivalAt).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button className="p-2 rounded-full transition invisible" aria-hidden="true" tabIndex={-1}>
            <X size={24} />
          </button>
        </div>
      </header>

      {/* ===== Title ===== */}
      <div className="container-wide mb-6">
        <div className="border-b border-gray-300">
          <div className="flex items-center justify-between py-4">

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label={t("bookingDetails.back")}
              >
                <ChevronLeft size={24} className="text-gray-800" />
              </button>

              <div className="flex items-center gap-2 text-[20px] sm:text-[24px] font-semibold">
                <span>
                  {booking
                    ? `${booking.route?.fromCity?.nameRu?.toUpperCase()} – ${booking.route?.toCity?.nameRu?.toUpperCase()}`
                    : ""}
                </span>
                <span className="text-gray-500 text-[16px] sm:text-[18px] font-normal">
                  {booking ? `${t("bookingDetails.dateIn")}${departureDateFormatted}` : ""}
                </span>
              </div>
            </div>

            <div
              className={`text-[24px] font-medium ${
                booking?.route?.status === "active"
                  ? "text-green-600"
                  : booking?.route?.status === "completed"
                  ? "text-gray-500"
                  : booking?.route?.status === "cancelled"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {booking?.route?.status === "active" && t("bookingDetails.status.active")}
              {booking?.route?.status === "completed" && t("bookingDetails.status.completed")}
              {booking?.route?.status === "cancelled" && t("bookingDetails.status.cancelled")}
              {booking?.route?.status === "in_progress" && t("bookingDetails.status.in_progress")}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="container-wide flex-1 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6">

          {/* ===== Left ===== */}
          <div className="flex flex-col">
            <div className="text-[22px] sm:text-[26px] font-bold mb-4">
              {t("bookingDetails.routeInfo")}
            </div>

            <div className="relative border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
              <button
                onClick={() => setMapOpen(true)}
                className="absolute right-3 top-3 z-10 w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <Maximize2 size={18} />
              </button>

              <div className="relative">
                {mapLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                  </div>
                )}
                <div ref={mapRef} className="w-full h-[260px] sm:h-[340px] lg:h-[420px]" />
              </div>
            </div>

            {/* ===== REVIEW ===== */}
            {booking?.route?.status === "completed" && (
              <div className="mt-10">
                {!booking?.review?.rating ? (
                  <>
                    <div className="text-[22px] sm:text-[26px] font-bold mb-4">
                      {t("bookingDetails.leaveReview")}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          onClick={() => setRating(i)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                        >
                          <Star
                            size={26}
                            className={
                              i <= rating
                                ? "text-[#F5B301] fill-[#F5B301]"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder={t("bookingDetails.reviewPlaceholder")}
                      className="w-full h-[140px] rounded-2xl px-4 py-4 border border-gray-300 outline-none focus:border-gray-400 transition text-[15px]"
                    />

                    <button
                      onClick={handleSubmitReview}
                      className="w-full sm:w-[260px] h-[52px] mt-5 bg-[#32BB78] text-white rounded-xl text-[16px] font-semibold hover:bg-[#2aa86e] transition"
                    >
                      {t("bookingDetails.save")}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-[22px] sm:text-[26px] font-bold mb-4">
                      {t("bookingDetails.yourReview")}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={22}
                          className={
                            i <= booking.review.rating
                              ? "text-[#F5B301] fill-[#F5B301]"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>

                    <div className="text-gray-700">
                      {booking.review.comment}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ===== PASSENGERS ===== */}
            <div className="mt-10">
              <div className="text-[22px] sm:text-[26px] font-bold mb-4">
                {t("bookingDetails.passengers")}
              </div>

              <div className="space-y-2">
                {passengers.length === 0 && (
                  <div className="text-gray-400">{t("bookingDetails.noPassengers")}</div>
                )}

                {passengers.map((b) => {
                  const passenger = b.passenger;

                  const name =
                    b.passengerName ||
                    `${passenger?.firstName || ""} ${passenger?.lastName || ""}`.trim();

                  const avatar =
                    passenger?.profilePhoto?.url ||
                    passenger?.profilePhoto ||
                    passenger?.photo ||
                    avatarPlaceholder;

                  return (
                    <div
                      key={b._id || passenger?._id}
                      className="flex items-center gap-4 px-4 py-4 transition"
                    >
                      <img
                        src={avatar}
                        className="w-14 h-14 rounded-full object-cover"
                      />

                      <div>
                        <div className="font-semibold text-[18px]">
                          {name || t("bookingDetails.passenger")}
                        </div>

                        {b._id === booking._id ? (
                          <div
                            className={`text-sm font-medium ${
                              b.status === "pending"
                                ? "text-yellow-500"
                                : b.status === "accepted"
                                ? "text-green-600"
                                : b.status === "cancelled"
                                ? "text-red-600"
                                : b.status === "rejected"
                                ? "text-gray-500"
                                : ""
                            }`}
                          >
                            {b.status === "pending" && t("bookingDetails.bookingStatus.pending")}
                            {b.status === "accepted" && t("bookingDetails.bookingStatus.accepted")}
                            {b.status === "cancelled" && t("bookingDetails.bookingStatus.cancelled")}
                            {b.status === "rejected" && t("bookingDetails.bookingStatus.rejected")}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            ×{b.seatsCount} —{" "}
                            {b.seatType === "front"
                              ? t("bookingDetails.seatType.front")
                              : t("bookingDetails.seatType.back")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===== Right ===== */}
          <div className="lg:relative">
            <div className="lg:sticky lg:top-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">

              <div className="text-[22px] sm:text-[26px] font-bold mb-4">
                {t("bookingDetails.yourOrder")}
              </div>

              {/* Route timeline */}
              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">
                  {departureDateLong}
                </div>

                <div className="grid grid-cols-[auto_24px_1fr] gap-3">
                  <div className="flex flex-col gap-[38px] text-[14px] font-medium">
                    <div>{departureTime}</div>
                    <div>{arrivalTime}</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-black" />
                    <div className="w-[2px] h-[52px] bg-black" />
                    <div className="w-4 h-4 rounded-full border-2 border-black" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="font-bold">
                        {booking?.route?.fromCity?.nameRu?.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking?.route?.fromCity?.region}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">
                        {booking?.route?.toCity?.nameRu?.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking?.route?.toCity?.region}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver */}
              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">
                  {t("bookingDetails.driver")}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={
                      driver?.profilePhoto?.status === "approved" &&
                      driver?.profilePhoto?.url
                        ? driver.profilePhoto.url
                        : driverAvatar
                    }
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">
                      {driver?.firstName} {driver?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {driver?.rating?.toFixed(1) || "0.0"} / 5 · {driver?.reviewsCount || 0} {t("bookingDetails.reviews")}
                    </div>
                  </div>
                </div>

                {isVerified && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <img src={userVerified} className="w-4 h-4" />
                    {t("bookingDetails.profileVerified")}
                  </div>
                )}
              </div>

              {/* Car */}
              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">
                  {t("bookingDetails.car")}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={carPhoto}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">
                      {carName || t("bookingDetails.car")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {carColor || ""}
                    </div>
                  </div>
                </div>

                {plate && (
                  <PlateNumber
                    value={plate}
                    size="responsive"
                    className="mt-3 self-start"
                  />
                )}
              </div>

              {/* My data */}
              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">
                  {t("bookingDetails.myData")}
                </div>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>{t("bookingDetails.bookedBy")}</span>
                    <span>{bookedBy}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>{t("bookingDetails.mySeats")}</span>
                    <span>{mySeats}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>{t("bookingDetails.totalPassengers")}</span>
                    <span>{totalPassengers}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold text-[20px] mb-4">
                  {t("bookingDetails.tripCost")}
                </div>

                <div className="text-sm space-y-3">
                  <div className="flex justify-between">
                    <span>{t("bookingDetails.paymentType")}</span>
                    <span>{t("bookingDetails.cash")}</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-300 pt-3">
                    <span>{t("bookingDetails.toPay")}</span>
                    <span className="font-bold">
                      {totalPrice.toLocaleString(locale)} {t("bookingDetails.currency")}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full h-[56px] bg-[#32BB78] text-white rounded-xl font-semibold hover:bg-[#2aa86e] transition flex items-center justify-center gap-2">
                <FileText size={18} />
                {t("bookingDetails.downloadInvoice")}
              </button>

              {booking?.route?.status === "active" && (
                <button
                  onClick={handleCancelBooking}
                  className="w-full mt-3 text-red-600 text-[15px] font-medium hover:underline"
                >
                  {t("bookingDetails.cancelBooking")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Map modal ===== */}
      {mapOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-[1100px] bg-white rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <span className="font-semibold">{t("bookingDetails.mapTitle")}</span>
              <button onClick={() => setMapOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div ref={modalMapRef} className="h-[420px] sm:h-[520px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingDetails;

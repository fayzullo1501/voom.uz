// src/components/profile/MyRouteDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../config/api";
import { formatDateLong, formatDateShort, formatTime, safeLocale } from "../../utils/formatDate";
import avatar from "../../assets/driverbookingtest.jpg";
import PlateNumber from "../../components/ui/PlateNumber";
import HiddenContact from "../../components/ui/HiddenContact";
import PassengerBookingModal from "../../components/profile/PassengerBookingModal";

const formatPhone = (phone) => {
  if (!phone) return "";

  const clean = phone.replace(/\D/g, "");

  if (clean.length === 9) {
    return `+998 ${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 7)} ${clean.slice(7, 9)}`;
  }

  return phone;
};

const MyRouteDetails = () => {
  const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation("profile");

  const locale = safeLocale(i18n.language);

  const cityName = (city) => {
    if (!city) return "";
    if (i18n.language === "uz") return (city.nameUzLat || city.nameRu || "").toUpperCase();
    if (i18n.language === "en") return (city.nameEn || city.nameRu || "").toUpperCase();
    return (city.nameRu || "").toUpperCase();
  };

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapOpen, setMapOpen] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const menuRef = useRef(null);
  const mapRef = useRef(null);
  const modalMapRef = useRef(null);

  const handleAccept = async (bookingId, onError) => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/accept`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        if (data?.message === "insufficient_balance") {
          onError?.("insufficient_balance");
          return;
        }

        const errorMessages = {
          not_enough_front_seats: t("routeDetails.errors.frontTaken"),
          not_enough_back_seats: t("routeDetails.errors.backTaken"),
          not_enough_seats: t("routeDetails.errors.noSeats"),
        };

        alert(
          errorMessages[data?.message] ||
          t("routeDetails.errors.cannotAccept")
        );

        return;
      }

      setSelectedBooking(null);
      const updatedRes = await fetch(`${API_URL}/api/routes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const updatedData = await updatedRes.json();
      if (updatedRes.ok) setRoute(updatedData);
    } catch (err) {
      console.error(err);
      alert(t("routeDetails.errors.serverError"));
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await fetch(`${API_URL}/api/bookings/${bookingId}/reject`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSelectedBooking(null);
      const updatedRes = await fetch(`${API_URL}/api/routes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const updatedData = await updatedRes.json();
      if (updatedRes.ok) setRoute(updatedData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRouteStatusChange = async (newStatus) => {
    try {
      await fetch(`${API_URL}/api/routes/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        setMapLoading(true);

        const res = await fetch(
          `${API_URL}/api/routes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setRoute(data);
        }
      } catch (err) {
        console.error("Failed to load route", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [id]);

  useEffect(() => {
    if (!route?.polyline) return;

    const initMap = () => {
      setMapLoading(false);
      if (!window.google?.maps?.geometry) return;

      const decodedPath =
        window.google.maps.geometry.encoding.decodePath(route.polyline);

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
  }, [route]);

  useEffect(() => {
    if (!mapOpen || !route?.polyline) return;
    if (!window.google?.maps?.geometry) return;
    if (!modalMapRef.current) return;

    const decodedPath =
      window.google.maps.geometry.encoding.decodePath(route.polyline);

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
  }, [mapOpen, route]);

  const plate = route?.car?.plateNumber || "";

  const earnedAmount =
    route?.bookings
      ?.filter((b) => b.status === "accepted")
      ?.reduce((total, booking) => total + (booking.totalPrice || 0), 0) || 0;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
      </div>
    );

  if (!route)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        {t("routeDetails.notFound")}
      </div>
    );

  const departureDateFormatted = formatDateShort(route.departureAt, i18n.language);
  const departureDateLong = formatDateLong(route.departureAt, i18n.language);
  const departureTime = formatTime(route.departureAt, i18n.language);
  const arrivalTime = formatTime(route.arrivalAt, i18n.language);

  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button className="p-2 rounded-full invisible" aria-hidden="true" tabIndex={-1}>
            <X size={24} />
          </button>
        </div>
      </header>

      {/* ===== Title ===== */}
      <div className="container-wide mb-6">
        <div className="border-b border-gray-300">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center gap-2 text-[20px] sm:text-[24px] font-semibold">
                <span>
                  {route ? `${cityName(route.fromCity)} – ${cityName(route.toCity)}` : ""}
                </span>
                <span className="text-gray-500 text-[16px] sm:text-[18px] font-normal">
                  {route ? `${t("routeDetails.dateIn")}${departureDateFormatted}` : ""}
                </span>
              </div>
            </div>
            <div
              className={`text-[24px] font-medium ${
                route?.status === "active"
                  ? "text-green-600"
                  : route?.status === "completed"
                  ? "text-gray-500"
                  : route?.status === "cancelled"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {route?.status === "active" && t("routeDetails.status.active")}
              {route?.status === "completed" && t("routeDetails.status.completed")}
              {route?.status === "cancelled" && t("routeDetails.status.cancelled")}
              {route?.status === "in_progress" && t("routeDetails.status.in_progress")}
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 items-start">

          {/* LEFT */}
          <div className="flex flex-col">
            <div className="text-[22px] sm:text-[26px] font-bold mb-4">
              {t("routeDetails.routeInfo")}
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
                <div ref={mapRef} className="w-full h-[320px] sm:h-[380px] lg:h-[460px]" />
              </div>
            </div>

            {/* PASSENGERS */}
            <div className="mt-10">
              <div className="text-[32px] font-bold mb-6">
                {t("routeDetails.passengers")}
              </div>

              <div className="space-y-2">
                {route?.bookings?.length === 0 && (
                  <div className="text-gray-400">{t("routeDetails.noBookings")}</div>
                )}

                {route?.bookings
                  ?.slice()
                  ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  ?.map((booking) => {
                    const passenger = booking.passenger;

                    return (
                      <div
                        key={booking._id}
                        onClick={() => setSelectedBooking(booking)}
                        className="group flex items-center justify-between px-4 py-4 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={passenger?.profilePhoto?.url || avatar}
                            className="w-14 h-14 rounded-full object-cover"
                          />

                          <div>
                            <div className="font-semibold text-[18px]">
                              {booking.passengerName ||
                                `${passenger?.firstName || ""} ${passenger?.lastName || ""}`}
                            </div>

                            <div className="text-sm text-gray-500 mt-1">
                              {booking.seatType === "whole"
                                ? t("routeDetails.seatType.whole")
                                : `${
                                    booking.seatType === "front"
                                      ? t("routeDetails.seatType.front")
                                      : t("routeDetails.seatType.back")
                                  } × ${booking.seatsCount}`}
                            </div>

                            <div className="text-sm mt-1">
                              {booking.status === "pending" && (
                                <span className="text-yellow-600">
                                  {t("routeDetails.bookingStatus.pending")}
                                </span>
                              )}
                              {booking.status === "accepted" && (
                                <span className="text-green-600">
                                  {t("routeDetails.bookingStatus.accepted")}
                                </span>
                              )}
                              {booking.status === "cancelled" && (
                                <span className="text-red-600">
                                  {t("routeDetails.bookingStatus.cancelled")}
                                </span>
                              )}
                              {booking.status === "rejected" && (
                                <span className="text-gray-500">
                                  {t("routeDetails.bookingStatus.rejected")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="lg:sticky lg:top-6">
              <div className="text-[22px] sm:text-[26px] font-bold mb-4">
                {t("routeDetails.yourRoute")}
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
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                      <div className="font-bold">
                        {cityName(route?.fromCity)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {route?.fromCity?.region}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="font-bold">
                        {cityName(route?.toCity)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {route?.toCity?.region}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Car */}
              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">
                  {t("routeDetails.car")}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={route?.car?.brand?.logo?.url}
                    alt=""
                    className="w-12 h-10 object-contain"
                  />

                  <div className="flex flex-col">
                    <div className="font-semibold text-[18px]">
                      {route?.car?.brand?.name || route?.car?.customBrand}{" "}
                      {route?.car?.model?.name || route?.car?.customModel}
                    </div>
                    <div className="text-sm text-gray-500">
                      {route?.car?.color?.nameRu}
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

              {/* Amount */}
              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold text-[22px] mb-4">
                  {t("routeDetails.tripAmount")}
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-4">
                  <span>{t("routeDetails.total")}</span>
                  <span className="font-bold">
                    {earnedAmount.toLocaleString(locale)} {t("routeDetails.currency")}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {route?.status === "active" && (
                <>
                  <button
                    onClick={() => handleRouteStatusChange("in_progress")}
                    className="w-full h-[56px] bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition mb-3"
                  >
                    {t("routeDetails.start")}
                  </button>

                  <div
                    onClick={() => handleRouteStatusChange("cancelled")}
                    className="text-center text-red-600 font-medium cursor-pointer hover:underline"
                  >
                    {t("routeDetails.cancelRoute")}
                  </div>
                </>
              )}

              {route?.status === "in_progress" && (
                <button
                  onClick={() => handleRouteStatusChange("completed")}
                  className="w-full h-[56px] bg-[#32BB78] text-white rounded-xl font-semibold hover:bg-[#2aa86e] transition mb-3"
                >
                  {t("routeDetails.completeRoute")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map modal */}
      {mapOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-[1100px] bg-white rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <span className="font-semibold">{t("routeDetails.mapTitle")}</span>
              <button onClick={() => setMapOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div ref={modalMapRef} className="w-full h-[420px] sm:h-[520px]" />
          </div>
        </div>
      )}

      {selectedBooking && (
        <PassengerBookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default MyRouteDetails;

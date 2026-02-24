// src/components/profile/MyRouteDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, Maximize2, X, Check, X as XIcon, MoreVertical, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import avatar from "../../assets/driverbookingtest.jpg";
import uzFlag from "../../assets/flag-uz.svg";

const MyRouteDetails = () => {
  
  const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const navigate = useNavigate();
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapOpen, setMapOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const mapRef = useRef(null);
  const modalMapRef = useRef(null);

  const handleAccept = async (bookingId) => {
    try {
      await fetch(`${API_URL}/api/bookings/${bookingId}/accept`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
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

      window.location.reload();
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
    console.log("ROUTE:", route);
      console.log("POLYLINE:", route?.polyline);
      console.log("GOOGLE KEY:", GOOGLE_KEY);
      console.log("window.google:", window.google);

    if (!route?.polyline) return;

    console.log("INIT MAP STARTED");
    console.log("geometry:", window.google?.maps?.geometry);

    const initMap = () => {
      if (!window.google?.maps?.geometry) return;

      const decodedPath =
        window.google.maps.geometry.encoding.decodePath(route.polyline);

      console.log("DECODED PATH:", decodedPath);

      if (!decodedPath.length || !mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        mapTypeControl: false,
        fullscreenControl: false,   // убрать стандартную кнопку
        streetViewControl: false,   // убрать человечка
        zoomControl: true,          // оставить зум
      });

      const polyline = new window.google.maps.Polyline({
        path: decodedPath,
        strokeColor: "#2563EB",
        strokeOpacity: 0.95,
        strokeWeight: 8,      // было 6 → стало 8
        geodesic: true,
      });

      polyline.setMap(map);

      // ===== START MARKER (A)
      new window.google.maps.Marker({
        position: decodedPath[0],
        map: map,
        label: {
          text: "A",
          color: "#ffffff",
          fontWeight: "bold",
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#2563EB",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      // ===== END MARKER (B)
      new window.google.maps.Marker({
        position: decodedPath[decodedPath.length - 1],
        map: map,
        label: {
          text: "B",
          color: "#ffffff",
          fontWeight: "bold",
        },
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

    // A marker
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

    // B marker
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
  const regionCode = plate.slice(0, 2);
  const restPlate = plate.slice(2).trim();

  const earnedAmount =
    route?.bookings
      ?.filter((b) => b.status === "accepted")
      ?.reduce((total, booking) => {
        return total + (booking.totalPrice || 0);
      }, 0) || 0;

  const formattedEarned = earnedAmount.toLocaleString("ru-RU");

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
      </div>
    );

  if (!route)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        Маршрут не найден
      </div>
    );
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button className="p-2 rounded-full invisible" aria-hidden="true" tabIndex={-1}>
            <X size={24} />
          </button>
        </div>
      </header>

      <div className="container-wide mb-6">
        <div className="border-b border-gray-300">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center gap-2 text-[20px] sm:text-[24px] font-semibold">
                <span> {route ? `${route.fromCity?.nameRu?.toUpperCase()} – ${route.toCity?.nameRu?.toUpperCase()}` : ""} </span>
                <span className="text-gray-500 text-[16px] sm:text-[18px] font-normal"> {route ? `в ${new Date(route.departureAt).toLocaleDateString("ru-RU")}` : ""} </span>
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
              {route?.status === "active" && "Активный"}
              {route?.status === "completed" && "Завершён"}
              {route?.status === "cancelled" && "Отменён"}
              {route?.status === "in_progress" && "В пути"}
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide flex-1 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6">
          {/* LEFT */}
          <div className="flex flex-col">
            <div className="text-[22px] sm:text-[26px] font-bold mb-4">Информация зарегистрированного маршрута</div>

            <div className="relative border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
              <button onClick={() => setMapOpen(true)} className="absolute right-3 top-3 z-10 w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                <Maximize2 size={18} />
              </button>
              <div
                ref={mapRef}
                className="w-full h-[320px] sm:h-[380px] lg:h-[460px]"
              />
            </div>

            <div className="mt-10">
              <div className="text-[32px] font-bold mb-6">Пассажиры</div>

              <div className="space-y-2">
                {route?.bookings?.length === 0 && (
                  <div className="text-gray-400">Бронирований пока нет</div>
                )}

                {route?.bookings?.map((booking) => {
                  const passenger = booking.passenger;

                  return (
                    <div
                      key={booking._id}
                      className="group flex items-center justify-between px-4 py-4 rounded-xl hover:bg-gray-200 transition"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={passenger?.profilePhoto?.url || avatar}
                          className="w-14 h-14 rounded-full object-cover"
                        />

                        <div>
                          <div className="font-semibold text-[18px]">
                            {passenger?.firstName} {passenger?.lastName}
                          </div>

                          <div
                            className={`text-[15px] ${
                              booking.status === "accepted"
                                ? "text-gray-600"
                                : "text-gray-400 blur-[6px] select-none"
                            }`}
                          >
                            {passenger?.phone}
                          </div>

                          <div className="text-sm text-gray-500 mt-1">
                            {booking.seatType === "whole"
                              ? "Вся машина"
                              : `${booking.seatType === "front" ? "Переднее" : "Заднее"} × ${
                                  booking.seatsCount
                                }`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAccept(booking._id)}
                              className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white"
                            >
                              <Check size={26} className="text-green-600" />
                            </button>

                            <button
                              onClick={() => handleReject(booking._id)}
                              className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white"
                            >
                              <XIcon size={26} className="text-red-600" />
                            </button>
                          </>
                        )}

                        {booking.status === "accepted" && (
                          <span className="text-green-600 font-medium">Принят</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:relative">
            <div className="lg:sticky lg:top-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
              <div className="text-[22px] sm:text-[26px] font-bold mb-4">Ваш маршрут</div>

              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">
                  {route
                    ? new Date(route.departureAt).toLocaleDateString("ru-RU", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })
                    : ""}
                </div>

                <div className="grid grid-cols-[auto_24px_1fr] gap-3">
                  <div className="flex flex-col gap-[38px] text-[14px] font-medium">
                    <div>
                      {route
                        ? new Date(route.departureAt).toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>

                    <div>
                      {route
                        ? new Date(route.arrivalAt).toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-black" />
                    <div className="w-[2px] h-[52px] bg-black" />
                    <div className="w-4 h-4 rounded-full border-2 border-black" />
                  </div>
                  <div className="flex flex-col gap-6">
                    {/* FROM */}
                    <div className="flex flex-col">
                      <div className="font-bold">
                        {route?.fromCity?.nameRu?.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {route?.fromCity?.region}
                      </div>
                    </div>

                    {/* TO */}
                    <div className="flex flex-col">
                      <div className="font-bold">
                        {route?.toCity?.nameRu?.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {route?.toCity?.region}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">Автомобиль</div>

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

                <div className="mt-3 inline-flex items-center border-2 border-black rounded-lg overflow-visible bg-white">
                  <div className="px-2 py-1 text-[14px] font-semibold border-r-2 border-black">
                    {regionCode}
                  </div>

                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="text-[14px] font-semibold tracking-widest">
                      {restPlate}
                    </div>

                    <div className="flex flex-col items-center">
                      <img src={uzFlag} className="w-4 h-[10px] mb-[2px]" />
                      <div className="text-[10px] font-semibold text-blue-600 leading-none">
                        UZ
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold text-[22px] mb-4">Сумма за поездку</div>
                <div className="flex justify-between border-t border-gray-300 pt-4">
                  <span>Всего</span>
                  <span className="font-bold">
                    {formattedEarned} сум
                  </span>
                </div>
              </div>

              {route?.status === "active" && (
                <>
                  <button
                    onClick={() => handleRouteStatusChange("in_progress")}
                    className="w-full h-[56px] bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition mb-3"
                  >
                    Поехали
                  </button>

                  <div
                    onClick={() => handleRouteStatusChange("cancelled")}
                    className="text-center text-red-600 font-medium cursor-pointer hover:underline"
                  >
                    Отменить маршрут
                  </div>
                </>
              )}

              {route?.status === "in_progress" && (
                <button
                  onClick={() => handleRouteStatusChange("completed")}
                  className="w-full h-[56px] bg-[#32BB78] text-white rounded-xl font-semibold hover:bg-[#2aa86e] transition mb-3"
                >
                  Завершить маршрут
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {mapOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-[1100px] bg-white rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <span className="font-semibold">Карта маршрута</span>
              <button onClick={() => setMapOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div
              ref={modalMapRef}
              className="w-full h-[420px] sm:h-[520px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRouteDetails;

// src/pages/routes/RouteDetails.jsx
import React, { useState, useEffect } from "react";
import { Share2, ChevronLeft, ChevronRight, Star, Phone, Armchair, Loader2 } from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useNavigate, useParams } from "react-router-dom";
import uzFlag from "../../assets/flag-uz.svg";
import userVerified from "../../assets/userverified.svg";
import avatarPlaceholder from "../../assets/avatar-placeholder.svg";

const API_URL = import.meta.env.VITE_API_URL;

const RouteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(`${API_URL}/api/routes/${id}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setRoute(data);
      } catch (err) {
        console.error("Route load error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-[#000] animate-spin" />
      </div>
    );
  if (!route) return <div className="p-10">Маршрут не найден</div>;

  const plate = route.car?.plateNumber || "";
  const regionCode = plate.slice(0, 2);
  const restPlate = plate.slice(2).trim();

  const isVerified =
  route.driver?.passport?.status === "approved" &&
  route.driver?.profilePhoto?.status === "approved" &&
  route.driver?.phoneVerified === true;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container-wide pb-20 lg:pb-32">
        {/* HEADER */}
        <div className="relative flex items-center py-4 border-b border-gray-300">
          <button onClick={() => window.history.back()} className="absolute left-0 flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition lg:static lg:mr-4">
            <ChevronLeft size={18} />
            <span className="hidden lg:inline ml-2 text-[15px] font-medium">Назад</span>
          </button>

          <div className="mx-auto text-[20px] lg:text-[36px] font-semibold text-center lg:text-left lg:mx-0">
            Детали маршрута
          </div>

          <button className="absolute right-0 flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition lg:static lg:ml-auto">
            <Share2 size={18} />
            <span className="hidden lg:inline ml-2 text-[15px] font-medium">Поделиться</span>
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4 mt-6">
          {/* LEFT */}
          <div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 rounded-2xl overflow-hidden">
                <img src={route.car?.photos?.[active]?.url} className="w-full h-[260px] lg:h-[420px] object-cover" />

                <button onClick={() => setActive(active === 0 ? route.car?.photos?.length - 1 : active - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 text-white rounded-full flex items-center justify-center">
                  <ChevronLeft size={18} />
                </button>

                <button onClick={() => setActive(active === route.car?.photos?.length - 1 ? 0 : active + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 text-white rounded-full flex items-center justify-center">
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {route.car?.photos?.map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${active === i ? "bg-white" : "bg-white/40"}`} />
                  ))}
                </div>
              </div>

              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
                {route.car?.photos?.map((img, i) => (
                  <button key={i} onClick={() => setActive(i)} className="w-[90px] h-[70px] flex-shrink-0 rounded-xl overflow-hidden">
                    <img src={img.url} alt="" className={`w-full h-full object-cover transition ${active === i ? "opacity-100" : "opacity-60"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* DRIVER */}
            <div className="mt-8 border rounded-2xl p-5 border-gray-300">
              <div className="flex items-center gap-4">
                <img src={ route.driver?.profilePhoto?.url ? route.driver.profilePhoto.url : avatarPlaceholder } alt="" className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <div className="text-[16px] font-semibold">{route.driver?.firstName} {route.driver?.lastName}</div>
                  <div className="flex items-center gap-1 text-[14px] text-gray-500">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    5.0 · 4 отзыва
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 text-[14px] text-gray-700">
                {isVerified && (
                  <div className="flex items-center gap-2">
                    <img src={userVerified} alt="" className="w-5 h-5" />
                    <span>Профиль подтвержден</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{route.driver?.phone}</span>
                </div>
              </div>

              <div className="mt-4 border-t pt-4 flex flex-col gap-2 text-[14px] text-gray-700 border-gray-300">
                <div className="flex items-center gap-2">
                  <Armchair size={16} />
                  <span>Переднее место — {route.priceFront.toLocaleString("ru-RU")} сум ({route.availableSeatsFront} свободно)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Armchair size={16} />
                  <span>Заднее место — {route.priceBack.toLocaleString("ru-RU")} сум ({route.availableSeatsBack} свободно)</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="lg:sticky lg:top-24">
              <div className=" border border-gray-300 rounded-2xl p-6">
                <div className="text-[22px] font-bold mb-1">Маршрут</div>
                <div className="text-[16px] text-gray-600 mb-6">{new Date(route.departureAt).toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", })}</div>
                <div className="grid grid-cols-[auto_24px_1fr] gap-3">
                  <div className="flex flex-col gap-[38px] text-[15px] font-medium">
                    <div>{new Date(route.departureAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", })}</div>
                    <div>
                      {route.arrivalAt
                        ? new Date(route.arrivalAt).toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-white" />
                    <div className="w-[2px] h-[52px] bg-black" />
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-white" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-[18px] font-bold">{route.fromCity?.nameRu}</div>
                      <div className="text-[14px] text-gray-500">
                        {route.fromCity?.region}
                      </div>
                    </div>
                    <div>
                      <div className="text-[18px] font-bold">{route.toCity?.nameRu}</div>
                      <div className="text-[14px] text-gray-500">
                        {route.toCity?.region}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t pt-5 border-gray-300">
                  <div className="text-[22px] font-bold mb-3">Автомобиль</div>
                  <div className="flex items-center gap-3">
                    <img src={route.car?.brand?.logo?.url} alt="" className="w-12 h-10" />
                    <div>
                      <div className="text-[20px] font-semibold">
                        {route.car?.brand?.name || route.car?.customBrand}{" "}
                        {route.car?.model?.name || route.car?.customModel}
                      </div>
                      <div className="text-[16px] text-gray-500">{route.car?.color}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="text-[18px] font-bold">Номер машины</div>
                  <div className="inline-flex items-center border-2 border-black rounded-lg overflow-hidden bg-white max-w-full">
                    <div className="px-2 py-1 text-[14px] lg:px-3 lg:py-2 lg:text-[18px] font-semibold border-r-2 border-black">
                      {regionCode}
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 lg:gap-3 lg:px-3 lg:py-2">
                      <div className="text-[14px] lg:text-[18px] font-semibold tracking-widest">
                        {restPlate}
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src={uzFlag}
                          alt=""
                          className="w-4 h-[10px] lg:w-5 lg:h-3 mb-[2px]"
                        />
                        <div className="text-[10px] lg:text-[11px] font-semibold text-blue-600 leading-none">
                          UZ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("booking")}
                className="w-full h-[56px] mt-4 bg-[#32BB78] text-white rounded-xl text-[17px] font-semibold hover:bg-[#2aa86e] transition"
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RouteDetails;

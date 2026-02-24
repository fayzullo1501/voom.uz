// src/components/profile/MyRouteDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, Maximize2, X, Check, X as XIcon, MoreVertical } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import avatar from "../../assets/driverbookingtest.jpg";
import carAvatar from "../../assets/carbookingtest.jpg";
import uzFlag from "../../assets/flag-uz.svg";

const MyRouteDetails = () => {

  
  const navigate = useNavigate();
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
        const res = await fetch(
          `${API_URL}/api/profile/routes/${id}`,
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
      }
    };

    fetchRoute();
  }, [id]);

  useEffect(() => {
    if (!route?.polyline) return;

    console.log("POLYLINE FROM API:", route?.polyline);

    const waitForGoogle = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.geometry) {

        clearInterval(waitForGoogle);

        const decodedPath =
          window.google.maps.geometry.encoding.decodePath(route.polyline);

        if (!decodedPath || decodedPath.length === 0) return;

        const map = new window.google.maps.Map(
          document.getElementById("route-map"),
          {
            zoom: 8,
            center: decodedPath[0],
            mapTypeControl: false,
          }
        );

        const polyline = new window.google.maps.Polyline({
          path: decodedPath,
          strokeColor: "#000000",
          strokeOpacity: 1.0,
          strokeWeight: 4,
        });

        polyline.setMap(map);

        const bounds = new window.google.maps.LatLngBounds();
        decodedPath.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds);
      }
    }, 200);

    return () => clearInterval(waitForGoogle);

  }, [route]);

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
                <span>FERGHANA – TASHKENT</span>
                <span className="text-gray-500 text-[16px] sm:text-[18px] font-normal">в 13.01.2026</span>
              </div>
            </div>
            <div className="text-[24px] font-medium text-green-600">Активный</div>
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
                id="route-map"
                className="w-full h-[260px] sm:h-[340px] lg:h-[420px]"
              />
            </div>

            <div className="mt-10">
              <div className="text-[32px] font-bold mb-6">Пассажиры</div>

              <div className="space-y-2">
                {/* WAITING */}
                <div className="group flex items-center justify-between px-4 py-4 rounded-xl hover:bg-gray-200 transition">
                  <div className="flex items-center gap-4">
                    <img src={avatar} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-[18px]">Fayzullo Abdulazizov</div>
                      <div className="text-[15px] text-gray-400 blur-[6px] select-none">+998 99 999-99-99</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-12 h-12 rounded-xl flex items-center justify-center transition group-hover:bg-white hover:bg-white">
                      <Check size={26} className="text-green-600" />
                    </button>
                    <button className="w-12 h-12 rounded-xl flex items-center justify-center transition group-hover:bg-white hover:bg-white">
                      <XIcon size={26} className="text-red-600" />
                    </button>
                  </div>
                </div>

                {/* ACCEPTED */}
                <div className="group flex items-center justify-between px-4 py-4 rounded-xl hover:bg-gray-200 transition relative">
                  <div className="flex items-center gap-4">
                    <img src={avatar} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-[18px]">Jasur Sharipov</div>
                      <div className="text-[15px] text-gray-600">+998 99 996-16-96</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative" ref={menuRef}>
                    <span className="text-green-600 font-medium">Принят</span>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="w-12 h-12 rounded-xl flex items-center justify-center transition group-hover:bg-white hover:bg-white">
                      <MoreVertical size={22} />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20 min-w-[160px]">
                        <button className="w-full text-left px-4 py-3 text-[15px] hover:bg-gray-100 transition">Отменить</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:relative">
            <div className="lg:sticky lg:top-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
              <div className="text-[22px] sm:text-[26px] font-bold mb-4">Ваш маршрут</div>

              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">Суббота, 12 Августа</div>

                <div className="grid grid-cols-[auto_24px_1fr] gap-3">
                  <div className="flex flex-col gap-[38px] text-[14px] font-medium">
                    <div>23:00</div>
                    <div>03:00</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-black" />
                    <div className="w-[2px] h-[52px] bg-black" />
                    <div className="w-4 h-4 rounded-full border-2 border-black" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="font-bold">TASHKENT</div>
                      <div className="text-xs text-gray-500">Ташкент, Узбекистан</div>
                    </div>
                    <div>
                      <div className="font-bold">FERGHANA</div>
                      <div className="text-xs text-gray-500">Ферганская область, Узбекистан</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">Автомобиль</div>

                <div className="flex items-center gap-3">
                  <img src={carAvatar} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">Chevrolet Malibu 2 turbo</div>
                    <div className="text-sm text-gray-500">Черный</div>
                  </div>
                </div>

                <div className="mt-3 inline-flex items-center border-2 border-black rounded-lg overflow-hidden bg-white">
                  <div className="px-2 py-1 text-[14px] font-semibold border-r-2 border-black">01</div>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="text-[14px] font-semibold tracking-widest">F 001 AA</div>
                    <div className="flex flex-col items-center">
                      <img src={uzFlag} className="w-4 h-[10px] mb-[2px]" />
                      <div className="text-[10px] font-semibold text-blue-600 leading-none">UZ</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold text-[22px] mb-4">Сумма за поездку</div>
                <div className="flex justify-between border-t border-gray-300 pt-4">
                  <span>Всего</span>
                  <span className="font-bold">300 000 сум</span>
                </div>
              </div>

              <button className="w-full h-[56px] bg-[#32BB78] text-white rounded-xl font-semibold hover:bg-[#2aa86e] transition mb-3">
                Поехали
              </button>

              <div className="text-center text-red-600 font-medium cursor-pointer hover:underline">
                Отменить маршрут
              </div>
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
            <div className="h-[420px] sm:h-[520px]">
              <iframe className="w-full h-full" src="https://www.google.com/maps?q=Fergana%20Uzbekistan%20to%20Tashkent%20Uzbekistan&output=embed" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRouteDetails;

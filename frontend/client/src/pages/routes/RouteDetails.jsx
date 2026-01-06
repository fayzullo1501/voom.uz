// src/pages/routes/RouteDetails.jsx
import React, { useState } from "react";
import { Share2, ChevronLeft, ChevronRight, Star, Phone, Armchair } from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import carImg1 from "../../assets/mycar1.jpg";
import carImg2 from "../../assets/mycar2.jpg";
import avatar from "../../assets/driverbookingtest.jpg";
import chevroletLogo from "../../assets/chevrolet.png";
import uzFlag from "../../assets/flag-uz.svg";
import userVerified from "../../assets/userverified.svg";
import { useNavigate } from "react-router-dom";

const images = [carImg1, carImg2, carImg1, carImg2];

const RouteDetails = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();


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
                <img src={images[active]} alt="" className="w-full h-[260px] lg:h-[420px] object-cover" />

                <button onClick={() => setActive(active === 0 ? images.length - 1 : active - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 text-white rounded-full flex items-center justify-center">
                  <ChevronLeft size={18} />
                </button>

                <button onClick={() => setActive(active === images.length - 1 ? 0 : active + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 text-white rounded-full flex items-center justify-center">
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {images.map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${active === i ? "bg-white" : "bg-white/40"}`} />
                  ))}
                </div>
              </div>

              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActive(i)} className="w-[90px] h-[70px] flex-shrink-0 rounded-xl overflow-hidden">
                    <img src={img} alt="" className={`w-full h-full object-cover transition ${active === i ? "opacity-100" : "opacity-60"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* DRIVER */}
            <div className="mt-8 border rounded-2xl p-5 border-gray-300">
              <div className="flex items-center gap-4">
                <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <div className="text-[16px] font-semibold">Fayzullo Abdulazizov</div>
                  <div className="flex items-center gap-1 text-[14px] text-gray-500">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    5.0 · 4 отзыва
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 text-[14px] text-gray-700">
                <div className="flex items-center gap-2">
                  <img src={userVerified} alt="" className="w-5 h-5" />
                  <span>Профиль подтвержден</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>+998 (99) 996-16-96</span>
                </div>
              </div>

              <div className="mt-4 border-t pt-4 flex flex-col gap-2 text-[14px] text-gray-700 border-gray-300">
                <div className="flex items-center gap-2">
                  <Armchair size={16} />
                  <span>Переднее место — 150 000 сум (1 свободно)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Armchair size={16} />
                  <span>Заднее место — 80 000 сум (2 свободно)</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="lg:sticky lg:top-24">
              <div className="bg-[#F9FAFB] border border-gray-300 rounded-2xl p-6">
                <div className="text-[22px] font-bold mb-1">Маршрут</div>
                <div className="text-[16px] text-gray-600 mb-6">Суббота, 12 августа</div>

                <div className="grid grid-cols-[auto_24px_1fr] gap-3">
                  <div className="flex flex-col gap-[38px] text-[15px] font-medium">
                    <div>23:00</div>
                    <div>03:00</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-white" />
                    <div className="w-[2px] h-[52px] bg-black" />
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-white" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-[18px] font-bold">FERGHANA</div>
                      <div className="text-[14px] text-gray-500">
                        Ферганская область, Узбекистан
                      </div>
                    </div>
                    <div>
                      <div className="text-[18px] font-bold">TASHKENT</div>
                      <div className="text-[14px] text-gray-500">
                        Ташкентская область, Узбекистан
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t pt-5 border-gray-300">
                  <div className="text-[22px] font-bold mb-3">Автомобиль</div>
                  <div className="flex items-center gap-3">
                    <img src={chevroletLogo} alt="" className="w-12 h-10" />
                    <div>
                      <div className="text-[20px] font-semibold">
                        Chevrolet Malibu 2 turbo
                      </div>
                      <div className="text-[16px] text-gray-500">Черный</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="text-[18px] font-bold">Номер машины</div>
                  <div className="inline-flex items-center border-2 border-black rounded-lg overflow-hidden bg-white max-w-full">
                    <div className="px-2 py-1 text-[14px] lg:px-3 lg:py-2 lg:text-[18px] font-semibold border-r-2 border-black">
                      01
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 lg:gap-3 lg:px-3 lg:py-2">
                      <div className="text-[14px] lg:text-[18px] font-semibold tracking-widest">
                        F 001 AA
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

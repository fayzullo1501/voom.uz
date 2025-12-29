// src/pages/routes/RoutesResults.jsx
import React, { useState } from "react";
import Header from "../../components/layout/Header";
import RoutesSearch from "../../components/routes/RoutesSearch";
import carImg1 from "../../assets/mycar1.jpg";
import carImg2 from "../../assets/mycar2.jpg";
import avatar from "../../assets/driverbookingtest.jpg";
import userVerified from "../../assets/userverified.svg";
import chevroletLogo from "../../assets/chevrolet.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [carImg1, carImg2];

const RoutesResults = () => {
  const [activeImage, setActiveImage] = useState([0, 0, 0]);
  const [sort, setSort] = useState("early");
  const [timeFilters, setTimeFilters] = useState({ before6: false, morning: false, day: false, after18: false });
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const changeImage = (cardIndex, dir) => {
    setActiveImage((prev) => {
      const next = [...prev];
      next[cardIndex] = dir === "next" ? (next[cardIndex] + 1) % images.length : (next[cardIndex] - 1 + images.length) % images.length;
      return next;
    });
  };

  const toggleTime = (key) => setTimeFilters((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />
      <RoutesSearch />

      <div className="container-wide mt-8 flex gap-10 h-[calc(100vh-260px)]">
        {/* Filters */}
        <div className="w-[300px] shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="text-[20px] font-semibold">Сортировать</div>
            <button className="text-[14px] text-gray-500 hover:text-gray-700">Сбросить все</button>
          </div>

          {/* Radio */}
          <div className="space-y-5">
            {[
              ["early", "Самые ранние поездки"],
              ["cheap", "Самые дешевые поездки"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer text-[16px]">
                <input type="radio" checked={sort === value} onChange={() => setSort(value)} className="sr-only" />
                <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${sort === value ? "border-[#32BB78]" : "border-gray-300"}`}>
                    {sort === value && <span className="w-2.5 h-2.5 rounded-full bg-[#32BB78]" />}
                </span>
                {label}
              </label>
            ))}
          </div>

          <div className="h-[2px] bg-gray-200 my-6" />

          {/* Time filters */}
          <div className="text-[18px] font-semibold mb-4">Время выезда</div>
          <div className="space-y-4">
            {[
              ["before6", "До 06:00", 1],
              ["morning", "06:00 - 12:00", 12],
              ["day", "12:00 - 18:00", 6],
              ["after18", "После 18:00", 0],
            ].map(([key, label, count]) => (
              <label key={key} className="flex items-center justify-between text-[15px] cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={timeFilters[key]} onChange={() => toggleTime(key)} className="sr-only" />
                  <span className={`w-5 h-5 rounded flex items-center justify-center border-2 ${timeFilters[key] ? "bg-[#32BB78] border-[#32BB78]" : "border-gray-400"}`}>
                    {timeFilters[key] && (
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10.5L8.5 14L15 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {label}
                </div>
                <span className="text-gray-700">{count}</span>
              </label>
            ))}
          </div>

          <div className="h-[2px] bg-gray-200 my-6" />

          {/* Verified */}
          <div className="text-[18px] font-semibold mb-4">Доверие и безопасность</div>
          <label className="flex items-center justify-between text-[15px] cursor-pointer">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={verifiedOnly} onChange={() => setVerifiedOnly(!verifiedOnly)} className="sr-only" />
              <span className={`w-5 h-5 rounded flex items-center justify-center border-2 ${verifiedOnly ? "bg-[#32BB78] border-[#32BB78]" : "border-gray-400"}`}>
                {verifiedOnly && (
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10.5L8.5 14L15 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              Профиль подтвержден
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">1</span>
              <img src={userVerified} className="w-4 h-4" />
            </div>
          </label>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="text-[20px] font-semibold mb-6">
            13 результатов по <span className="text-gray-500">FERGHANA - TASHKENT</span> в 13.01.2026
          </div>

          <div className="space-y-4">
            {[0, 1, 2].map((cardIndex) => (
              <div key={cardIndex} className="border border-gray-200 rounded-[18px] p-4 flex gap-6 hover:bg-gray-50 transition cursor-pointer">
                <div className="relative w-[260px] rounded-[14px] overflow-hidden shrink-0">
                    <img src={images[activeImage[cardIndex]]} className="absolute inset-0 w-full h-full object-cover" />

                    <button onClick={(e) => { e.stopPropagation(); changeImage(cardIndex, "prev"); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center">
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>

                    <button onClick={(e) => { e.stopPropagation(); changeImage(cardIndex, "next"); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-white" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, i) => (
                        <span key={i} className={`w-2 h-2 rounded-full transition ${activeImage[cardIndex] === i ? "bg-white" : "bg-white/50"}`} />
                        ))}
                    </div>
                </div>


                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[18px] font-semibold">Выезд в 19:00 13.01.2026</div>
                      <div className="mt-2 flex items-center gap-6">
                        <div>
                          <div className="font-semibold">FERGHANA</div>
                          <div className="text-gray-500 text-[14px]">Ферганская область, Узбекистан</div>
                        </div>
                        <div className="text-[22px] text-gray-700">→</div>
                        <div>
                          <div className="font-semibold">TASHKENT</div>
                          <div className="text-gray-500 text-[14px]">Ташкентская область, Узбекистан</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[14px] font-semibold">от <span className="text-[26px] font-bold">150,000</span> сум</div>
                      <div className="text-gray-500 text-[14px]">3 свободных мест</div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-gray-200 my-4" />

                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                      <img src={chevroletLogo} className="w-10 h-10 object-contain" />
                      <div>
                        <div className="font-semibold">Chevrolet Malibu</div>
                        <div className="text-[14px]">01 F 001 AA</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <img src={avatar} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-2 font-semibold">
                          Fayzullo Abdulazizov
                        </div>
                        <div className="text-[14px]">+998 99 996-16-96</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesResults;

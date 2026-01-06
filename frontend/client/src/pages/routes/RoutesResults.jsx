// src/pages/routes/RoutesResults.jsx
import React, { useState } from "react";
import Header from "../../components/layout/Header";
import RoutesSearch from "../../components/routes/RoutesSearch";
import RoutesFilters from "../../components/routes/RoutesFilters";
import carImg1 from "../../assets/mycar1.jpg";
import carImg2 from "../../assets/mycar2.jpg";
import avatar from "../../assets/driverbookingtest.jpg";
import chevroletLogo from "../../assets/chevrolet.png";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";


const images = [carImg1, carImg2];

const RoutesResults = () => {
  const [activeImage, setActiveImage] = useState([0, 0, 0]);
  const [sort, setSort] = useState("early");
  const [timeFilters, setTimeFilters] = useState({ before6: false, morning: false, day: false, after18: false });
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();


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

      {/* MOBILE SEARCH BAR */}
      <div className="md:hidden px-4 mt-4">
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div onClick={() => setMobileSearchOpen(true)} className="cursor-pointer">
            <div className="text-[15px] font-semibold">FERGHANA → TASHKENT</div>
            <div className="text-[13px] text-gray-500">Ср, 31 дек · 4 пассажира</div>
          </div>
          <button onClick={() => setMobileFiltersOpen(true)} className="text-[#32BB78] font-semibold text-[15px]">
            Фильтровать
          </button>
        </div>
      </div>

      {/* DESKTOP SEARCH */}
      <div className="hidden md:block">
        <RoutesSearch />
      </div>

      {/* DESKTOP CONTENT */}
      <div className="container-wide mt-8 hidden md:flex gap-10 h-[calc(100vh-260px)]">
        <div className="w-[300px] shrink-0">
          <RoutesFilters sort={sort} setSort={setSort} timeFilters={timeFilters} toggleTime={toggleTime} verifiedOnly={verifiedOnly} setVerifiedOnly={setVerifiedOnly} />
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="text-[20px] font-semibold mb-6">
            13 результатов по <span className="text-gray-500">FERGHANA - TASHKENT</span> в 13.01.2026
          </div>

          <div className="space-y-4">
            {[0, 1, 2].map((cardIndex) => (
              <div key={cardIndex} onClick={() => navigate("details")} className="border border-gray-200 rounded-[18px] p-4 flex gap-6 hover:bg-gray-50 transition cursor-pointer">
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
                      <span key={i} className={`w-2 h-2 rounded-full ${activeImage[cardIndex] === i ? "bg-white" : "bg-white/50"}`} />
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
                        <div className="font-semibold">Fayzullo Abdulazizov</div>
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

      {/* MOBILE RESULTS */}
      <div className="md:hidden px-4 mt-4 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} onClick={() => navigate("details")} className="border border-gray-200 rounded-2xl p-4 bg-white cursor-pointer">
            <div className="flex gap-4">
              <img src={carImg1} className="w-24 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-semibold">16:29</div>
                  <div className="font-bold">150 000 сум</div>
                </div>
                <div className="text-gray-500 text-[14px]">FERGHANA → TASHKENT</div>
                <div className="mt-1 text-[14px] text-gray-600">Chevrolet Malibu · 3 места</div>
                <div className="mt-2 flex items-center gap-2">
                  <img src={avatar} className="w-6 h-6 rounded-full" />
                  <span className="text-[13px]">Fayzullo Abdulazizov</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE SEARCH MODAL */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="p-4 flex justify-end">
            <button onClick={() => setMobileSearchOpen(false)}>
              <X className="w-7 h-7" />
            </button>
          </div>
          <RoutesSearch isMobileModal onClose={() => setMobileSearchOpen(false)} />
        </div>
      )}

      {/* MOBILE FILTERS MODAL */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="p-4 flex justify-end">
            <button onClick={() => setMobileFiltersOpen(false)}>
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="px-4 pb-4">

            <RoutesFilters
              sort={sort}
              setSort={setSort}
              timeFilters={timeFilters}
              toggleTime={toggleTime}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default RoutesResults;

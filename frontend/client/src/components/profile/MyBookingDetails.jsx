// src/components/profile/MyBookingDetails.jsx
import React, { useState } from "react";
import { ChevronLeft, Maximize2, X, Star, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import driverAvatar from "../../assets/driverbookingtest.jpg";
import carAvatar from "../../assets/carbookingtest.jpg";
import userVerified from "../../assets/userverified.svg";
import uzFlag from "../../assets/flag-uz.svg";


const MyBookingDetails = () => {
  const navigate = useNavigate();
  const [mapOpen, setMapOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ===== Header (как BalanceTopUp) ===== */}
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
                
                {/* Левая часть */}
                <div className="flex items-center gap-3">
                    <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    aria-label="Назад"
                    >
                    <ChevronLeft size={24} className="text-gray-800" />
                    </button>

                    <div className="flex items-center gap-2 text-[20px] sm:text-[24px] font-semibold">
                    <span>FERGHANA – TASHKENT</span>
                    <span className="text-gray-500 text-[16px] sm:text-[18px] font-normal">
                        в 13.01.2026
                    </span>
                    </div>
                </div>

                {/* Правая часть */}
                <div className="text-[24px] font-medium text-green-600">
                    Завершенный
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
              Информация забронированного маршрута
            </div>

            <div className="relative border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
              <button onClick={() => setMapOpen(true)} className="absolute right-3 top-3 z-10 w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                <Maximize2 size={18} />
              </button>

              <div className="w-full h-[260px] sm:h-[340px] lg:h-[420px]">
                <iframe className="w-full h-full" src="https://www.google.com/maps?q=Fergana%20Uzbekistan%20to%20Tashkent%20Uzbekistan&output=embed" loading="lazy" />
              </div>
            </div>

            <div className="mt-10">
              <div className="text-[22px] sm:text-[26px] font-bold mb-4">Оставить отзыв</div>

              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} onClick={() => setRating(i)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
                    <Star size={26} className={i <= rating ? "text-[#F5B301] fill-[#F5B301]" : "text-gray-300"} />
                  </button>
                ))}
              </div>

              <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Текст" className="w-full h-[140px] rounded-2xl px-4 py-4 border border-gray-300 outline-none focus:border-gray-400 transition text-[15px]" />

              <button className="w-full sm:w-[260px] h-[52px] mt-5 bg-[#32BB78] text-white rounded-xl text-[16px] font-semibold hover:bg-[#2aa86e] transition">
                Сохранить
              </button>
            </div>
          </div>

          {/* ===== Right (scrollable) ===== */}
          <div className="lg:relative">
            <div className="lg:sticky lg:top-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
              <div className="text-[22px] sm:text-[26px] font-bold mb-4">Ваш заказ</div>

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
                      <div className="font-bold">FERGHANA</div>
                      <div className="text-xs text-gray-500">Ферганская область, Узбекистан</div>
                    </div>
                    <div>
                      <div className="font-bold">TASHKENT</div>
                      <div className="text-xs text-gray-500">Ташкентская область, Узбекистан</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">Водитель</div>

                <div className="flex items-center gap-3">
                  <img src={driverAvatar} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">Fayzullo Abdulazizov</div>
                    <div className="text-sm text-gray-500">★ 5 / 5 · 4 отзыва</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <img src={userVerified} className="w-4 h-4" />
                  Профиль подтвержден
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

                <div className="mt-3 inline-flex items-center border-2 border-black rounded-lg overflow-hidden bg-white max-w-full">
                    <div className="px-2 py-1 text-[14px] font-semibold border-r-2 border-black">
                        01
                    </div>

                    <div className="flex items-center gap-2 px-2 py-1">
                        <div className="text-[14px] font-semibold tracking-widest">
                        F 001 AA
                        </div>

                        <div className="flex flex-col items-center">
                        <img src={uzFlag} alt="" className="w-4 h-[10px] mb-[2px]" />
                        <div className="text-[10px] font-semibold text-blue-600 leading-none">
                            UZ
                        </div>
                        </div>
                    </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold mb-3 text-[20px]">Пассажиры</div>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between"><span>Попутчик</span><span>Я</span></div>
                  <div className="flex justify-between"><span>Кол-во</span><span>2</span></div>
                  <div className="flex justify-between"><span>Всего пассажиров</span><span>3</span></div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-2xl p-4 mb-4">
                <div className="font-semibold text-[20px] mb-4">Стоимость за поездку</div>
                <div className="flex justify-between border-t pt-4">
                  <span>Всего</span>
                  <span className="font-bold">132 000 сум</span>
                </div>
              </div>

              <button className="w-full h-[56px] bg-[#32BB78] text-white rounded-xl font-semibold hover:bg-[#2aa86e] transition flex items-center justify-center gap-2">
                <FileText size={18} />
                Скачать инвойс
              </button>
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

export default MyBookingDetails;

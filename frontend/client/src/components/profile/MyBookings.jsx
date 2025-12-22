import React, { useState } from "react";
import { X, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import walletIcon from "../../assets/icons/wallet.svg";
import userIcon from "../../assets/icons/user.svg";

const MyBookings = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");

  const bookings = [
    {
      id: 1,
      from: "FERGHANA",
      fromSub: "Ферганская область, Узбекистан",
      to: "TASHKENT",
      toSub: "Ташкентская область, Узбекистан",
      dateFrom: "Август 20, 2025 • 21:00",
      dateTo: "Август 21, 2025 • 03:00",
      price: "120 000 сум",
      passengers: "2 пассажира",
    },
    {
      id: 2,
      from: "TASHKENT",
      fromSub: "Ташкентская область, Узбекистан",
      to: "FERGHANA",
      toSub: "Ферганская область, Узбекистан",
      dateFrom: "Июнь 10, 2025 • 21:00",
      dateTo: "Июнь 11, 2025 • 03:00",
      price: "80 000 сум",
      passengers: "1 пассажир",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 pb-10 flex flex-col">

      {/* ===== Header ===== */}
      <header>
        <div className="container-wide flex items-center justify-end py-6 sm:py-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Закрыть"
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* ===== Title ===== */}
      <h1 className="text-[24px] sm:text-[32px] font-semibold text-center mb-6 sm:mb-8">
        Мои бронирования
      </h1>

      {/* ===== Tabs ===== */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-[760px] relative">

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />

          <div className="flex gap-6 sm:gap-8">
            {[
              { id: "active", label: "Активные" },
              { id: "past", label: "Прошедшие" },
              { id: "canceled", label: "Отменённые" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`
                  relative pb-3 text-[15px] sm:text-[16px] transition
                  ${tab === item.id
                    ? "text-black font-medium"
                    : "text-gray-400 hover:text-gray-600"}
                `}
              >
                {item.label}

                {tab === item.id && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-black rounded-full" />
                )}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="flex justify-center">
        <div className="w-full max-w-[760px]">

          {/* ===== Filter ===== */}
          <button className="flex items-center gap-2 mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
            <Filter size={16} className="text-gray-400" />
            Добавить фильтр
          </button>

          {/* ===== Booking cards ===== */}
          <div className="flex flex-col gap-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="border border-gray-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">

                  {/* ===== Route ===== */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 flex-1">
                    <div>
                      <div className="text-[18px] sm:text-[20px] font-semibold">{b.from}</div>
                      <div className="text-xs text-gray-500">{b.fromSub}</div>
                      <div className="text-xs text-gray-500 mt-1">{b.dateFrom}</div>
                    </div>

                    <span className="text-xl font-medium hidden md:block">→</span>
                    <span className="text-xl text-gray-400 md:hidden">↓</span>

                    <div>
                      <div className="text-[18px] sm:text-[20px] font-semibold">{b.to}</div>
                      <div className="text-xs text-gray-500">{b.toSub}</div>
                      <div className="text-xs text-gray-500 mt-1">{b.dateTo}</div>
                    </div>
                  </div>

                  {/* ===== Divider ===== */}
                  <div className="hidden md:block w-px h-16 bg-gray-200" />
                  <div className="md:hidden h-px bg-gray-200 my-2" />

                  {/* ===== Info ===== */}
                  <div className="flex flex-row md:flex-col gap-4 md:gap-2 md:min-w-[150px] justify-between md:justify-start">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <img src={walletIcon} alt="Сумма" className="w-5 h-5 opacity-70" />
                      {b.price}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <img src={userIcon} alt="Пассажиры" className="w-5 h-5 opacity-60" />
                      {b.passengers}
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

export default MyBookings;

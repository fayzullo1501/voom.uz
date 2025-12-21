import React, { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import clickIcon from "../../assets/click.svg";
import paymeIcon from "../../assets/payme.svg";
import uzumIcon from "../../assets/uzum.svg";

const BalanceTopUp = () => {
  const navigate = useNavigate();

  const formatUZS = (value) => {
    if (!value) return "";
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " сум";
  };


  const [method, setMethod] = useState("click");
  const [amount, setAmount] = useState("");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-[450px]">
        {/* ===== Title row ===== */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Назад"
            >
              <ChevronLeft size={24} className="text-gray-800" />
            </button>
          </div>

          <h1 className="flex-1 text-center text-[28px] sm:text-[32px] font-semibold">
            Пополнение
          </h1>

          <div className="w-10" />
        </div>

        {/* ===== Content ===== */}
        <div className="w-full max-w-[440px] mx-auto flex flex-col gap-8">
          {/* Детали платежа */}
          <div>
            <p className="text-sm text-gray-700 mb-3">Детали платежа</p>

            <div className="flex gap-4">
              {[
                { id: "click", icon: clickIcon, alt: "Click" },
                { id: "payme", icon: paymeIcon, alt: "Payme" },
                { id: "uzum", icon: uzumIcon, alt: "Uzum Bank" },
              ].map((item) => {
                const selected = method === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMethod(item.id)}
                    className={`w-[140px] h-[86px] rounded-2xl border flex items-center justify-center bg-white transition ${selected ? "border-black" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <img
                      src={item.icon}
                      alt={item.alt}
                      className={`h-10 transition ${selected ? "opacity-100" : "opacity-35"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Сумма платежа */}
          <div className="relative">
            <input
              value={formatUZS(amount)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, "");
                setAmount(raw);
              }}
              inputMode="numeric"
              placeholder=" "
              className="peer w-full h-[56px] px-4 pr-11 pt-4 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-300"
            />

            <label className="absolute left-4 text-gray-500 pointer-events-none transition-all duration-200 top-4 text-[15px] peer-focus:top-1 peer-focus:text-[11px] peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-[11px]">
              Сумма платежа
            </label>

            {amount && (
              <button
                onClick={() => setAmount("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                aria-label="Очистить"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Кнопка */}
          <div className="flex justify-center pt-4">
            <button className="min-w-[180px] px-10 py-3 rounded-xl text-white text-[16px] font-medium bg-[#32BB78] hover:bg-[#29a86b] transition">
              Продолжить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceTopUp;

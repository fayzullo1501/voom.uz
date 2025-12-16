import React from "react";
import { X, Plus, ArrowDown, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import logoIcon from "../../assets/logo-icon.svg";

const Balance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-6 pb-10 flex flex-col">

      {/* ===== Header (X как на Login) ===== */}
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* ===== Title ===== */}
      <h1 className="text-[28px] sm:text-[32px] font-semibold text-center mb-10">
        Мой баланс
      </h1>

      {/* ===== Content ===== */}
      <div className="flex flex-col items-center">

        {/* ===== Balance Card ===== */}
        <div
          className="
            w-full max-w-[450px]
            bg-[#32BB78]
            rounded-3xl
            px-8 py-7
            text-white
            mb-15
          "
        >
          {/* Card header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <img src={logoIcon} alt="VOOM" className="w-15 h-15" />
            </div>

            <span className=" text-[20px] opacity-90">
              Виртуальная карта
            </span>
          </div>

          {/* Balance */}
          <div className="text-[32px] font-semibold mb-6">
            125,000 UZS
          </div>

          {/* Holder */}
          <div className="text-xs opacity-80 uppercase tracking-wide">
            Держатель
          </div>
          <div className="text-sm font-medium">
            FAYZULLO ABDULAZIZOV
          </div>
        </div>

        {/* ===== Actions ===== */}
        <div className="flex gap-20">

          {/* Пополнить */}
          <div className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
              <Plus size={22} />
            </div>
            <span className="text-sm">Пополнить</span>
          </div>

          {/* Вывести */}
          <div className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
              <ArrowDown size={22} />
            </div>
            <span className="text-sm">Вывести</span>
          </div>

          {/* История */}
          <div className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
              <RotateCcw size={22} />
            </div>
            <span className="text-sm">История</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Balance;

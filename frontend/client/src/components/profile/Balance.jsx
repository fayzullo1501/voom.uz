import React, { useEffect, useState } from "react";
import { X, Plus, ArrowDown, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";

import logoIcon from "../../assets/logo-icon.svg";

const Balance = () => {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(null);
  const [holderName, setHolderName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const { data } = await axios.get("/api/balance");
        setBalance(data.balance);
        setHolderName(data.holderName);
      } catch (err) {
        console.error("Failed to load balance", err);
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, []);

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
            {loading ? "Загрузка..." : `${balance.toLocaleString("ru-RU")} UZS`}
          </div>


          {/* Holder */}
          <div className="text-xs opacity-80 uppercase tracking-wide">
            Держатель
          </div>
          <div className="text-sm font-medium">
            {loading ? "Загрузка..." : holderName}
          </div>
        </div>

        {/* ===== Actions ===== */}
        <div className="flex gap-15">

          {/* Пополнить */}
          <div onClick={() => navigate("/ru/profile/balance/top-up")} className="flex flex-col items-center gap-2 cursor-pointer">
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
          <div onClick={() => navigate("/ru/profile/balance/history")} className="flex flex-col items-center gap-2 cursor-pointer">
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

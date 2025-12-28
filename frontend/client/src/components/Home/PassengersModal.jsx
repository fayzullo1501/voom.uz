// src/components/Home/PassengersModal.jsx
import React from "react";
import { Minus, Plus } from "lucide-react";

const PassengersModal = ({ isOpen, value, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed md:absolute z-50 bg-white rounded-2xl shadow-xl p-5 w-[320px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-0 md:top-auto md:bottom-full md:translate-x-0 md:translate-y-0 md:mb-6">
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-semibold text-gray-800">Пассажиров</div>

        <div className="flex items-center gap-6">
          <button onClick={() => value > 1 && onChange(value - 1)} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${value > 1 ? "border-2 border-[#32BB78] text-[#32BB78] hover:bg-gray-100" : "border-2 border-gray-200 text-gray-300 cursor-not-allowed"}`}>
            <Minus size={18} />
          </button>

          <div className="text-[22px] font-semibold w-6 text-center">{value}</div>

          <button onClick={() => value < 8 && onChange(value + 1)} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${value < 8 ? "border-2 border-[#32BB78] text-[#32BB78] hover:bg-gray-100" : "border-2 border-gray-200 text-gray-300 cursor-not-allowed"}`}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassengersModal;

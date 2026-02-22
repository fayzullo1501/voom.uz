import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import priceImg from "../../assets/crrouteseatsprice.png";

// форматирует число: 100000 → 100 000
const formatMoney = (val) => {
  if (!val) return "";
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// получает только цифры
const cleanNumber = (val) => val.replace(/\D/g, "");

const PriceModal = ({ isOpen, onClose, onSave, initialValue }) => {
  if (!isOpen) return null;

  const [frontPrice, setFrontPrice] = useState("");
  const [backPrice, setBackPrice] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (!initialValue) {
      setFrontPrice("");
      setBackPrice("");
      return;
    }

    setFrontPrice(
      initialValue.front ? formatMoney(initialValue.front) : ""
    );

    setBackPrice(
      initialValue.back ? formatMoney(initialValue.back) : ""
    );

  }, [initialValue, isOpen]);

  const handleSave = () => {
    onSave({
      frontPrice: Number(cleanNumber(frontPrice)) || 0,
      backPrice: Number(cleanNumber(backPrice)) || 0,
    });
    onClose();
  };

  const handleInput = (value, setter) => {
    const digits = cleanNumber(value);
    setter(formatMoney(digits));
  };

  // ===== Tooltip (hover) =====
  const Info = ({ text }) => (
    <div className="relative group flex items-center">
      <div
        className="
          w-[18px] h-[18px] rounded-full bg-gray-200 text-gray-700
          flex items-center justify-center text-[11px] font-semibold
          cursor-default
        "
      >
        i
      </div>

      <div
        className=" absolute left-6 top-1 w-[200px] bg-[#000] text-white text-[12px] p-3 rounded-lg shadow opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-50"
      >
        {text}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[999] bg-[rgba(0,0,0,0.45)] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" bg-white rounded-[22px] shadow-xl  w-[90%] max-w-[780px] flex flex-col gap-6 p-6 animate-[fadeIn_.2s_ease]"
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[20px] font-semibold">
            Добавьте цену за место
          </h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-700 hover:text-black" />
          </button>
        </div>

        {/* ===== MAIN ===== */}
        <div className="flex flex-col lg:flex-row gap-6 overflow-visible">

          {/* ===== LEFT FIELD BLOCK ===== */}
          <div className="w-full lg:w-[32%] flex flex-col justify-between">
            <div className="flex flex-col gap-6">

              {/* FRONT PRICE */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[15px]">
                    Цена за переднее место
                  </p>
                  <Info text="Рекомендуем не превышать 100 000 сумов." />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={frontPrice}
                    onChange={(e) =>
                      handleInput(e.target.value, setFrontPrice)
                    }
                    placeholder="0"
                    className=" w-full h-[56px] bg-gray-100 rounded-xl px-4 pr-20 text-[16px] focus:outline-none "
                  />

                  {frontPrice && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 text-[15px]">
                      сум
                    </span>
                  )}
                </div>

                <p className="text-[12px] text-gray-500 text-right">
                  сумма за одно место
                </p>
              </div>

              {/* BACK PRICE */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[15px]">
                    Цена за заднее место
                  </p>
                  <Info text="Рекомендуем не превышать 80 000 сумов." />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={backPrice}
                    onChange={(e) =>
                      handleInput(e.target.value, setBackPrice)
                    }
                    placeholder="0"
                    className=" w-full h-[56px] bg-gray-100 rounded-xl px-4 pr-20 text-[16px] focus:outline-none "
                  />

                  {backPrice && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 text-[15px]">
                      сум
                    </span>
                  )}
                </div>

                <p className="text-[12px] text-gray-500 text-right">
                  сумма за одно место
                </p>
              </div>
            </div>

            {/* ===== SAVE ===== */}
            <button
              onClick={handleSave}
              disabled={!frontPrice && !backPrice}
              className={`
                bg-[#32BB78] text-white rounded-xl
                h-[52px] mt-6 px-6 text-[17px] font-semibold
                hover:bg-[#2aa86e]
                ${!frontPrice && !backPrice ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              Сохранить
            </button>
          </div>

          {/* ===== RIGHT IMAGE ===== */}
          <div className="w-full lg:w-[68%] flex justify-center items-end">
            <img
              src={priceImg}
              alt="Price"
              className="rounded-2xl w-full object-cover"
              style={{ height: "330px" }}
            />
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PriceModal;

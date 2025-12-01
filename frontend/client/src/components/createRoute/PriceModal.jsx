import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import priceImg from "../../assets/crrouteseats.png";

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

  const [tipFront, setTipFront] = useState(false);
  const [tipBack, setTipBack] = useState(false);

  useEffect(() => {
    if (!initialValue) return;

    const parts = initialValue.split("|").map((x) => x.trim());

    setFrontPrice(formatMoney(parts[0] || ""));
    setBackPrice(formatMoney(parts[1] || ""));
  }, [initialValue, isOpen]);

  const handleSave = () => {
    onSave({
      frontPrice: cleanNumber(frontPrice),
      backPrice: cleanNumber(backPrice),
    });
    onClose();
  };

  const Info = ({ open, toggle, text }) => (
    <div className="relative flex items-center">
      <button
        onClick={toggle}
        className="w-[18px] h-[18px] rounded-full bg-gray-200 text-gray-700 
        flex items-center justify-center text-[11px] font-semibold"
      >
        i
      </button>

      {open && (
        <div
          className="absolute left-6 top-1 w-[200px]
          bg-[#FFF4C4] text-black text-[12px]
          p-3 rounded-lg shadow z-50"
        >
          {text}
        </div>
      )}
    </div>
  );

  const handleInput = (value, setter) => {
    const digits = cleanNumber(value);
    setter(formatMoney(digits));
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-[rgba(0,0,0,0.45)] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white rounded-[22px] shadow-xl 
          w-[90%] max-w-[780px]
          flex flex-col gap-6 p-6 animate-[fadeIn_.2s_ease]
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[20px] font-semibold">Добавьте цену за место</h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-700 hover:text-black" />
          </button>
        </div>

        {/* MAIN */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT FIELD BLOCK */}
          <div className="w-full lg:w-[32%] flex flex-col justify-between">
            <div className="flex flex-col gap-6">

              {/* FRONT PRICE */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[15px]">Цена за переднее место</p>
                  <Info
                    open={tipFront}
                    toggle={() => setTipFront(!tipFront)}
                    text="Рекомендуем не превышать 100 000 сумов."
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={frontPrice}
                    onChange={(e) => handleInput(e.target.value, setFrontPrice)}
                    placeholder="0"
                    className="w-full h-[56px] bg-gray-100 rounded-xl px-4 pr-20 
                               text-[16px] focus:outline-none"
                  />

                  {/* СУМ — рядом с числом */}
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
                  <p className="font-medium text-[15px]">Цена за заднее место</p>
                  <Info
                    open={tipBack}
                    toggle={() => setTipBack(!tipBack)}
                    text="Рекомендуем не превышать 80 000 сумов."
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={backPrice}
                    onChange={(e) => handleInput(e.target.value, setBackPrice)}
                    placeholder="0"
                    className="w-full h-[56px] bg-gray-100 rounded-xl px-4 pr-20 
                               text-[16px] focus:outline-none"
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

            {/* SAVE */}
            <button
              onClick={handleSave}
              className="
                bg-[#32BB78] text-white rounded-xl 
                h-[52px] mt-6 px-6 text-[17px] font-semibold 
                hover:bg-[#2aa86e]
              "
            >
              Сохранить
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full lg:w-[68%] flex justify-center items-end">
            <img
              src={priceImg}
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

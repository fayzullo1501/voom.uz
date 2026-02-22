import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import seatsImg from "../../assets/crrouteseats.png";

const SeatsModal = ({ isOpen, onSave, onClose, initialValue }) => {
  if (!isOpen) return null;

  const [front, setFront] = useState(0);
  const [back, setBack] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    if (!initialValue) {
      setFront(0);
      setBack(0);
      return;
    }

    setFront(initialValue.front || 0);
    setBack(initialValue.back || 0);

  }, [initialValue, isOpen]);

  const inc = (val, set, max) => set(Math.min(val + 1, max));
  const dec = (val, set) => set(Math.max(val - 1, 0));

  const handleSave = () => {
    onSave({ front, back });
    onClose();
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
        className="
          absolute left-6 top-1
          w-[200px]
          bg-black text-white text-[12px]
          p-3 rounded-lg shadow
          opacity-0 pointer-events-none
          transition-opacity duration-200
          group-hover:opacity-100
          z-50
        "
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
        className="
          bg-white rounded-[22px] shadow-xl
          w-[90%] max-w-[780px]
          flex flex-col gap-6 p-6
          animate-[fadeIn_.2s_ease]
        "
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[20px] font-semibold">Добавьте места</h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-700 hover:text-black" />
          </button>
        </div>

        {/* ===== MAIN ===== */}
        <div className="flex flex-col lg:flex-row gap-6 overflow-visible">

          {/* ===== LEFT COLUMN ===== */}
          <div className="w-full lg:w-[32%] flex flex-col justify-between">

            <div className="flex flex-col gap-6">

              {/* FRONT SEAT */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-[15px]">Переднее место</p>
                  <Info text="Максимум 1 место спереди." />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => dec(front, setFront)}
                    className="w-[50px] h-[50px] bg-gray-100 rounded-xl text-xl"
                  >
                    –
                  </button>

                  <span className="text-[18px] font-semibold w-[20px] text-center">
                    {front}
                  </span>

                  <button
                    onClick={() => inc(front, setFront, 1)}
                    className="w-[50px] h-[50px] bg-gray-100 rounded-xl text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* BACK SEAT */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-[15px]">Заднее место</p>
                  <Info text="Максимум 6 места сзади." />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => dec(back, setBack)}
                    className="w-[50px] h-[50px] bg-gray-100 rounded-xl text-xl"
                  >
                    –
                  </button>

                  <span className="text-[18px] font-semibold w-[20px] text-center">
                    {back}
                  </span>

                  <button
                    onClick={() => inc(back, setBack, 6)}
                    className="w-[50px] h-[50px] bg-gray-100 rounded-xl text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* ===== SAVE BUTTON ===== */}
            <button
              onClick={handleSave}
              disabled={front === 0 && back === 0}
              className={`
                bg-[#32BB78] text-white rounded-xl
                h-[52px] mt-6 px-6 text-[17px] font-semibold
                hover:bg-[#2aa86e]
                ${front === 0 && back === 0 ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              Сохранить
            </button>
          </div>

          {/* ===== RIGHT BANNER ===== */}
          <div className="w-full lg:w-[68%] flex justify-center items-end">
            <img
              src={seatsImg}
              alt="Seats"
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

export default SeatsModal;

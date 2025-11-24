import React, { useState } from "react";
import { X } from "lucide-react";
import seatsImg from "../../assets/crrouteseats.png";

const SeatsModal = ({ isOpen, onSave, onClose }) => {
  if (!isOpen) return null;

  const [front, setFront] = useState(0);
  const [back, setBack] = useState(0);
  const [extraBack, setExtraBack] = useState(0);
  const [showExtra, setShowExtra] = useState(false);

  // tooltip states (Clickable!)
  const [tipFront, setTipFront] = useState(false);
  const [tipBack, setTipBack] = useState(false);
  const [tipExtra, setTipExtra] = useState(false);

  const inc = (val, set, max) => set(Math.min(val + 1, max));
  const dec = (val, set, min = 0) => set(Math.max(val - 1, min));

  const handleSave = () => {
    onSave({
      front,
      back,
      extraBack: showExtra ? extraBack : 0,
    });
    onClose();
  };

  // info icon component (clickable tooltip)
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
          className="absolute left-6 top-1 w-[180px]
            bg-[#FFF4C4] text-black text-[12px]
            p-2 rounded-lg shadow z-50"
        >
          {text}
        </div>
      )}
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
          flex flex-col gap-6 p-6 animate-[fadeIn_.2s_ease]
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[20px] font-semibold">Добавьте место и кол-во</h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-700 hover:text-black" />
          </button>
        </div>

        {/* MAIN BLOCK */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT COLUMN (now full height + button pinned bottom) */}
          <div className="w-full lg:w-[32%] flex flex-col h-full">

            {/* TOP PART — fields */}
            <div className="flex flex-col gap-5 flex-grow">

              {/* FRONT SEAT */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-[15px]">Переднее место</p>
                  <Info
                    open={tipFront}
                    toggle={() => setTipFront(!tipFront)}
                    text="Максимум 1 переднее место."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => dec(front, setFront)}
                    className="w-[50px] h-[50px] bg-gray-100 rounded-xl text-xl"
                  >
                    –
                  </button>

                  <span className="text-[18px] font-semibold w-[14px] text-center">
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
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-[15px]">Заднее место</p>
                  <Info
                    open={tipBack}
                    toggle={() => setTipBack(!tipBack)}
                    text="Максимум 3 заднее место."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => dec(back, setBack)}
                    className="w-[50px] h-[50px] bg-gray-100 rounded-xl text-xl"
                  >
                    –
                  </button>

                  <span className="text-[18px] font-semibold w-[14px] text-center">
                    {back}
                  </span>

                  <button
                    onClick={() => inc(back, setBack, 3)}
                    className="w-[50px] h-[50px] bg-gray-100 rounded-xl text-xl"
                  >
                    +
                  </button>

                  {!showExtra && (
                    <button
                      onClick={() => setShowExtra(true)}
                      className="text-[22px] ml-2 text-gray-700"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>

              {/* EXTRA BACK SEAT */}
              {showExtra && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-[15px]">Заднее место №2</p>
                    <Info
                      open={tipExtra}
                      toggle={() => setTipExtra(!tipExtra)}
                      text="Максимум 3 заднее место."
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => dec(extraBack, setExtraBack)}
                      className="w-[50px] h-[50px] bg-gray-100 rounded-xl text-xl"
                    >
                      –
                    </button>

                    <span className="text-[18px] font-semibold w-[14px] text-center">
                      {extraBack}
                    </span>

                    <button
                      onClick={() => inc(extraBack, setExtraBack, 3)}
                      className="w-[50px] h-[50px] bg-gray-100 rounded-xl text-xl"
                    >
                      +
                    </button>

                    <button
                      onClick={() => {
                        setShowExtra(false);
                        setExtraBack(0);
                      }}
                      className="text-[22px] text-gray-700 ml-2"
                    >
                      –
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* BOTTOM — SAVE BUTTON (always aligned with bottom of image) */}
            <button
              onClick={handleSave}
              className="
                bg-[#32BB78] text-white rounded-xl 
                h-[52px] mt-4 px-6 text-[17px] font-semibold 
                hover:bg-[#2aa86e]
              "
            >
              Сохранить
            </button>
          </div>

          {/* RIGHT IMAGE BLOCK */}
          <div className="w-full lg:w-[68%] flex justify-center items-end">
            <img
              src={seatsImg}
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

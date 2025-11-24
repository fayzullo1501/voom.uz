import React, { useState } from "react";
import { X } from "lucide-react";
import seatsImg from "../../assets/crrouteseats.png";

const PriceModal = ({ isOpen, onSave, onClose }) => {
  if (!isOpen) return null;

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [extra, setExtra] = useState("");
  const [showExtra, setShowExtra] = useState(false);

  const [tipFront, setTipFront] = useState(false);
  const [tipBack, setTipBack] = useState(false);
  const [tipExtra, setTipExtra] = useState(false);

  // форматирование только для отображения
  const format = (digits) =>
    digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "";

  // корректный ввод только цифр
  const handleInput = (setter) => (e) => {
    const clean = e.target.value.replace(/[^\d]/g, "");
    setter(clean);
  };

  const handleSave = () => {
    onSave({
      front: format(front),
      back: format(back),
      extra: showExtra ? format(extra) : "",
    });
    onClose();
  };

  const Info = ({ open, toggle }) => (
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
          Рекомендуем не превышать 100 000 сумов за место.
        </div>
      )}
    </div>
  );

  // обновлённый универсальный блок цены
  const PriceField = ({
    label,
    value,
    setter,
    tipOpen,
    tipToggle,
    controlButton,
  }) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-1">
        <p className="font-medium text-[15px]">{label}</p>
        <Info open={tipOpen} toggle={tipToggle} />
      </div>

      <div className="flex items-center gap-3 w-full">
        {/* поле всегда одинакового размера */}
        <input
          type="text"
          inputMode="numeric"
          className="w-full h-[50px] bg-gray-100 rounded-xl px-4 
          outline-none text-[16px]"
          placeholder="0"
          value={value}
          onChange={handleInput(setter)}
        />

        {/* фиксированный контейнер под + или – */}
        <div className="w-[32px] flex justify-center">
          {controlButton}
        </div>
      </div>

      {value && (
        <span className="text-[13px] text-gray-500 ml-1">
          {format(value)} сум за место
        </span>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[999] bg-[rgba(0,0,0,0.45)] 
      flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
            bg-white rounded-[22px] shadow-xl 
            w-[90%] max-w-[780px]
            p-6 flex flex-col gap-6

            max-h-[90vh]        /* ограничиваем высоту */
            overflow-y-auto     /* включаем вертикальный скролл */
            my-4                /* отступы сверху и снизу */

            animate-[fadeIn_.2s_ease]
        "
        >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[20px] font-semibold">Добавьте цену за место</h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-700 hover:text-black" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[32%] flex flex-col h-full">
            <div className="flex flex-col gap-5 flex-grow">

              {/* переднее место */}
              <PriceField
                label="Цена за переднее место"
                value={front}
                setter={setFront}
                tipOpen={tipFront}
                tipToggle={() => setTipFront(!tipFront)}
                controlButton={null}
              />

              {/* заднее место */}
              <PriceField
                label="Цена за заднее место"
                value={back}
                setter={setBack}
                tipOpen={tipBack}
                tipToggle={() => setTipBack(!tipBack)}
                controlButton={
                  !showExtra ? (
                    <button
                      onClick={() => setShowExtra(true)}
                      className="text-[22px] text-gray-700 leading-none"
                    >
                      +
                    </button>
                  ) : null
                }
              />

              {/* заднее доп. место */}
              {showExtra && (
                <PriceField
                  label="Цена за заднее место №2"
                  value={extra}
                  setter={setExtra}
                  tipOpen={tipExtra}
                  tipToggle={() => setTipExtra(!tipExtra)}
                  controlButton={
                    <button
                      onClick={() => {
                        setShowExtra(false);
                        setExtra("");
                      }}
                      className="text-[22px] text-gray-700 leading-none"
                    >
                      –
                    </button>
                  }
                />
              )}
            </div>

            <button
              onClick={handleSave}
              className="bg-[#32BB78] text-white rounded-xl 
              h-[52px] mt-4 px-6 text-[17px] font-semibold 
              hover:bg-[#2aa86e]"
            >
              Сохранить
            </button>
          </div>

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

export default PriceModal;

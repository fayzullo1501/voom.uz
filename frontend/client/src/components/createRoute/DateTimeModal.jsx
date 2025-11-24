import React, { useState } from "react";

const DateTimeModal = ({ isOpen, initialValue, onSave, onClose }) => {
  if (!isOpen) return null;

  /* === INIT VALUES === */
  let initDate = null;
  let initTime = null;

  if (initialValue) {
    const [d, t] = initialValue.split(" в ");
    initDate = d;
    initTime = t;
  }

  const [selectedDate, setSelectedDate] = useState(
    initDate ? new Date(initDate) : new Date()
  );

  const [selectedTime, setSelectedTime] = useState(initTime || "00:00");

  /* === MONTH CALCULATIONS === */
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setSelectedDate(new Date(year, month - 1, 1));
  const nextMonth = () => setSelectedDate(new Date(year, month + 1, 1));

  const selectDay = (d) =>
    setSelectedDate(new Date(year, month, d));

  /* === TIME LIST === */
  const timeSlots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      timeSlots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }

  /* === SAVE === */
  const handleSave = () => {
    const yyyy = year;
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");

    onSave(`${yyyy}-${mm}-${dd} в ${selectedTime}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-[999] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[12px] shadow-xl p-5 flex flex-col gap-5 w-[90%] max-w-[480px] animate-[fadeIn_.2s_ease]"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[18px] font-semibold">Выберите дату и время</h2>
          <button
            onClick={onClose}
            className="text-[26px] text-gray-600 hover:text-black leading-none"
          >
            ×
          </button>
        </div>

        {/* CALENDAR + TIME */}
        <div className="flex gap-6">

          {/* === CALENDAR — ШИРЕ === */}
          <div className="w-[360px]">
            {/* Month header */}
            <div className="flex items-center justify-between font-semibold mb-2">
              <button onClick={prevMonth} className="text-[18px] hover:text-black">
                ‹
              </button>

              <span className="capitalize">
                {selectedDate.toLocaleString("ru-RU", {
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <button onClick={nextMonth} className="text-[18px] hover:text-black">
                ›
              </button>
            </div>

            {/* Weekday names */}
            <div className="grid grid-cols-7 gap-[6px] mb-1">
              {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d) => (
                <div key={d} className="text-center text-[12px] text-gray-500">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-[6px]">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={i}></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;

                const isSelected =
                  d === selectedDate.getDate() &&
                  month === selectedDate.getMonth() &&
                  year === selectedDate.getFullYear();

                return (
                  <div
                    key={d}
                    onClick={() => selectDay(d)}
                    className={`
                      text-center py-[8px] rounded-[6px] text-[14px] cursor-pointer transition
                      ${
                        isSelected
                          ? "bg-[#32BB78] text-white font-semibold"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </div>

          {/* === TIME LIST — УЗКИЙ И СДВИНУТЫЙ === */}
          <div className="border-l border-gray-200 pl-4 max-h-[250px] overflow-y-auto w-[100px]">

            {/* внутренний узкий блок */}
            <div className="w-[70px] mx-auto">

              {timeSlots.map((t) => {
                const isActive = t === selectedTime;
                return (
                  <div
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`
                      text-[14px] py-[6px] rounded-[6px] cursor-pointer mb-[4px] text-center transition
                      ${
                        isActive
                          ? "bg-[#32BB78] text-white font-semibold"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    {t}
                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="mt-2">
          <button
            onClick={handleSave}
            className="bg-[#32BB78] text-white rounded-xl h-[44px] px-6 text-[15px] font-semibold hover:bg-[#2aa86e]"
          >
            Сохранить
          </button>
        </div>
      </div>

      {/* Anim */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default DateTimeModal;

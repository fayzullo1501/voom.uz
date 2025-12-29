// src/components/routes/DatePickerModal.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const months = ["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"];

const DatePickerModal = ({ isOpen, selectedDate, onSelect }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentDate, setCurrentDate] = useState(today);
  const [activeDate, setActiveDate] = useState(today);

  useEffect(() => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      d.setHours(0, 0, 0, 0);
      setCurrentDate(d);
      setActiveDate(d);
    } else {
      setCurrentDate(today);
      setActiveDate(today);
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const firstDay = new Date(year, month, 1).getDay() || 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 1; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="absolute z-50 bg-white rounded-2xl shadow-xl p-5 w-[340px] left-0 top-full mt-3">
      <div className="flex items-center justify-between mb-4">
        <button disabled={isCurrentMonth} onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${isCurrentMonth ? "opacity-0 pointer-events-none" : "hover:bg-gray-100"}`}>
          <ArrowLeft className="text-[#32BB78]" />
        </button>

        <div className="text-[22px] font-semibold capitalize">{months[month]} {year}</div>

        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
          <ArrowRight className="text-[#32BB78]" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[16px] text-gray-500 mb-2">
        {weekDays.map((d) => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, idx) => {
          if (!day) return <div key={idx} />;

          const dateObj = new Date(year, month, day);
          dateObj.setHours(0, 0, 0, 0);

          const isPast = isCurrentMonth && dateObj < today;
          const isToday = dateObj.getTime() === today.getTime();
          const isActive = activeDate && dateObj.getTime() === activeDate.getTime();

          let cls = "w-9 h-9 rounded-full text-[16px] transition flex items-center justify-center";
          if (isActive) cls += " bg-[#32BB78] text-white";
          else if (isToday) cls += " border-2 border-[#3d5b61] text-[#3d5b61]";
          else if (isPast) cls += " text-gray-300 cursor-not-allowed";
          else cls += " hover:bg-gray-100";

          return (
            <button key={idx} disabled={isPast} onClick={() => { setActiveDate(dateObj); onSelect(dateObj); }} className={cls}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePickerModal;

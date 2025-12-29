// src/components/routes/RoutesSearch.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import DatePickerModal from "./DatePickerModal";
import PassengersModal from "./PassengersModal";

const RoutesSearch = () => {
  const { t, i18n } = useTranslation("home");
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [passengers, setPassengers] = useState(1);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);

  return (
    <div className="container-wide mt-2">
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <input value={from} onChange={(e) => setFrom(e.target.value)} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-xl text-[15px] focus:outline-none" />
          <label className={`absolute left-4 transition-all duration-200 ${from ? "top-1 text-[11px]" : "top-4 text-[15px]"} peer-focus:top-1 peer-focus:text-[11px] text-gray-500`}>
            {t("hero.placeholders.from")}
          </label>
        </div>

        <button className="w-12 h-[56px] bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition">
          <ArrowLeftRight className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative flex-1">
          <input value={to} onChange={(e) => setTo(e.target.value)} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-xl text-[15px] focus:outline-none" />
          <label className={`absolute left-4 transition-all duration-200 ${to ? "top-1 text-[11px]" : "top-4 text-[15px]"} peer-focus:top-1 peer-focus:text-[11px] text-gray-500`}>
            {t("hero.placeholders.to")}
          </label>
        </div>

        <div className="relative flex-1">
          <input readOnly onClick={() => { setCalendarOpen(!calendarOpen); setPassengersOpen(false); }} value={selectedDate ? selectedDate.toLocaleDateString() : ""} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-xl text-[15px] cursor-pointer focus:outline-none" />
          <label className={`absolute left-4 transition-all duration-200 ${selectedDate ? "top-1 text-[11px]" : "top-4 text-[15px]"} peer-focus:top-1 peer-focus:text-[11px] text-gray-500`}>
            {t("hero.placeholders.when")}
          </label>

          <DatePickerModal isOpen={calendarOpen} selectedDate={selectedDate} onSelect={(date) => { setSelectedDate(date); setCalendarOpen(false); }} />
        </div>

        <div className="relative flex-1">
          <input readOnly onClick={() => { setPassengersOpen(!passengersOpen); setCalendarOpen(false); }} value={passengers} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-xl text-[15px] cursor-pointer focus:outline-none" />
          <label className="absolute left-4 top-1 text-[11px] text-gray-500">
            {t("hero.placeholders.passengers")}
          </label>

          <PassengersModal isOpen={passengersOpen} value={passengers} onChange={setPassengers} />
        </div>

        <button onClick={() => navigate(`/${i18n.language}/routes`)} className="bg-[#32BB78] text-white text-[18px] rounded-xl px-10 h-[56px] hover:bg-[#29a86b] transition">
          {t("hero.search")}
        </button>
      </div>
    </div>
  );
};

export default RoutesSearch;

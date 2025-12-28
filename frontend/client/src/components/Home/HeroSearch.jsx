// HeroSearch.jsx (ФИНАЛ)
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight } from "lucide-react";
import DatePickerModal from "./DatePickerModal";
import PassengersModal from "./PassengersModal";

const HeroSearch = () => {
  const { t } = useTranslation("home");

  const [activeTab, setActiveTab] = useState("trip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [passengers, setPassengers] = useState(1);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);

  return (
    <div className="relative bg-white w-full max-w-[1280px] rounded-[24px] shadow-lg p-5 sm:p-6 md:p-8 flex flex-col gap-5">
      <div className="flex gap-2">
        <button onClick={() => setActiveTab("trip")} className={`px-6 py-2 rounded-lg text-[18px] font-medium transition ${activeTab === "trip" ? "bg-[#32BB78] text-white" : "hover:text-gray-900"}`}>
          {t("hero.tabs.trip")}
        </button>
        <button onClick={() => setActiveTab("delivery")} className={`px-6 py-2 rounded-lg text-[18px] font-medium transition ${activeTab === "delivery" ? "bg-[#32BB78] text-white" : "hover:text-gray-900"}`}>
          {t("hero.tabs.delivery")}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[150px]">
          <input value={from} onChange={(e) => setFrom(e.target.value)} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-lg text-[15px] focus:outline-none" />
          <label className={`absolute left-4 transition-all duration-200 ${from ? "top-1 text-[11px]" : "top-4 text-[15px]"} peer-focus:top-1 peer-focus:text-[11px] text-gray-500`}>
            {t("hero.placeholders.from")}
          </label>
        </div>

        <button className="w-12 h-[56px] bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
          <ArrowLeftRight className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative flex-1 min-w-[150px]">
          <input value={to} onChange={(e) => setTo(e.target.value)} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-lg text-[15px] focus:outline-none" />
          <label className={`absolute left-4 transition-all duration-200 ${to ? "top-1 text-[11px]" : "top-4 text-[15px]"} peer-focus:top-1 peer-focus:text-[11px] text-gray-500`}>
            {t("hero.placeholders.to")}
          </label>
        </div>

        <div className="relative flex-1 min-w-[150px]">
          <input readOnly onClick={() => { setCalendarOpen(!calendarOpen); setPassengersOpen(false); }} value={selectedDate ? selectedDate.toLocaleDateString() : ""} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-lg text-[15px] cursor-pointer focus:outline-none" />
          <label className={`absolute left-4 transition-all duration-200 ${selectedDate ? "top-1 text-[11px]" : "top-4 text-[15px]"} peer-focus:top-1 peer-focus:text-[11px] text-gray-500`}>
            {t("hero.placeholders.when")}
          </label>

          <DatePickerModal
            isOpen={calendarOpen}
            selectedDate={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setCalendarOpen(false);
            }}
          />
        </div>

        <div className="relative flex-1 min-w-[150px]">
          <input readOnly onClick={() => { setPassengersOpen(!passengersOpen); setCalendarOpen(false); }} value={passengers} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-lg text-[15px] cursor-pointer focus:outline-none" />
          <label className={`absolute left-4 transition-all duration-200 top-1 text-[11px] text-gray-500`}>
            {t("hero.placeholders.passengers")}
          </label>

          <PassengersModal
            isOpen={passengersOpen}
            value={passengers}
            onChange={setPassengers}
          />
        </div>

        <button className="bg-[#32BB78] text-white rounded-lg px-8 h-[56px] hover:bg-[#29a86b] transition min-w-[120px]">
          {t("hero.search")}
        </button>
      </div>
    </div>
  );
};

export default HeroSearch;

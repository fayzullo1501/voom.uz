// HeroSearch.jsx (ФИНАЛ)
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import DatePickerModal from "./DatePickerModal";
import PassengersModal from "./PassengersModal";
import CityAutocompleteInput from "../createRoute/CityAutocompleteInput";
import { useToast } from "../../components/ui/useToast";

const HeroSearch = () => {
  const { t, i18n } = useTranslation("home");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("trip");
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [passengers, setPassengers] = useState(1);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleSwapCities = () => {
    if (!fromCity && !toCity) return;

    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const formatDateForQuery = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleSearch = () => {
    if (!fromCity) {
      showToast("Выберите город отправления", "error");
      return;
    }

    if (!toCity) {
      showToast("Выберите город назначения", "error");
      return;
    }

    if (!selectedDate) {
      showToast("Выберите дату поездки", "error");
      return;
    }

    navigate(
      `/${i18n.language}/routes?from=${fromCity._id}&to=${toCity._id}&date=${formatDateForQuery(selectedDate)}&passengers=${passengers}`
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setCalendarOpen(false);
        setPassengersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative bg-white w-full max-w-[1280px] rounded-[24px] shadow-lg overflow-visible p-5 sm:p-6 md:p-8 flex flex-col gap-5">
      <div className="flex gap-2">
        <button onClick={() => setActiveTab("trip")} className={`px-6 py-2 rounded-lg text-[18px] font-medium transition ${activeTab === "trip" ? "bg-[#32BB78] text-white" : "hover:text-gray-900"}`}>
          {t("hero.tabs.trip")}
        </button>
        <button onClick={() => setActiveTab("delivery")} className={`px-6 py-2 rounded-lg text-[18px] font-medium transition ${activeTab === "delivery" ? "bg-[#32BB78] text-white" : "hover:text-gray-900"}`}>
          {t("hero.tabs.delivery")}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex-1 min-w-[150px]">
          <CityAutocompleteInput
            label={t("hero.placeholders.from")}
            value={fromCity}
            onSelect={setFromCity}
          />
        </div>

        <button onClick={handleSwapCities} className="w-12 h-[56px] bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
          <ArrowLeftRight className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex-1 min-w-[150px]">
          <CityAutocompleteInput
            label={t("hero.placeholders.to")}
            value={toCity}
            onSelect={setToCity}
          />
        </div>

        <div className="relative flex-1 min-w-[150px]">
          <input readOnly onClick={() => { if (!calendarOpen) { setCalendarOpen(true); setPassengersOpen(false); } }} value={selectedDate ? selectedDate.toLocaleDateString() : ""} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-lg text-[15px] cursor-pointer focus:outline-none" />
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
          <input readOnly onClick={() => { if (!passengersOpen) { setPassengersOpen(true); setCalendarOpen(false); } }} value={passengers} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-lg text-[15px] cursor-pointer focus:outline-none" />
          <label className="absolute left-4 top-1 text-[11px] text-gray-500">
            {t("hero.placeholders.passengers")}
          </label>

          <PassengersModal
            isOpen={passengersOpen}
            value={passengers}
            onChange={setPassengers}
            onClose={() => setPassengersOpen(false)}
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-[#32BB78] text-white text-[18px] rounded-lg px-8 h-[56px] hover:bg-[#29a86b] transition min-w-[120px]"
        >
          {t("hero.search")}
        </button>
      </div>
    </div>
  );
};

export default HeroSearch;

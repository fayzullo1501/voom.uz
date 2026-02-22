// src/components/routes/RoutesSearch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftRight, X } from "lucide-react";
import DatePickerModal from "./DatePickerModal";
import PassengersModal from "./PassengersModal";
import CityAutocompleteInput from "../createRoute/CityAutocompleteInput";
import { useLocation } from "react-router-dom";

const RoutesSearch = ({ isMobileModal = false, onClose }) => {
  const wrapperRef = useRef(null);
  const { t, i18n } = useTranslation("home");
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const dateParam = searchParams.get("date");
  const passengersParam = searchParams.get("passengers");

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  
  const formatDateForQuery = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleSwapCities = () => {
    if (!from && !to) return;

    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);

  const handleSearch = () => {
    if (!from || !to) return;

    if (onClose) onClose();

    navigate(
      `/${i18n.language}/routes?from=${from._id}&to=${to._id}&date=${formatDateForQuery(
        selectedDate
      )}&passengers=${passengers}`
    );
  };

  useEffect(() => {
    const loadCitiesById = async () => {
      try {
        // FROM
        if (fromParam) {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cities/${fromParam}`);
          if (res.ok) {
            const data = await res.json();
            setFrom(data.city || data);
          }
        } else {
          setFrom(null);
        }

        // TO
        if (toParam) {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cities/${toParam}`);
          if (res.ok) {
            const data = await res.json();
            setTo(data.city || data);
          }
        } else {
          setTo(null);
        }

        // DATE
        if (dateParam) {
          setSelectedDate(new Date(dateParam));
        } else {
          setSelectedDate(null);
        }

        // PASSENGERS
        if (passengersParam) {
          setPassengers(Number(passengersParam));
        } else {
          setPassengers(1);
        }

      } catch (err) {
        console.error("City load error:", err);
      }
    };

    loadCitiesById();
  }, [fromParam, toParam, dateParam, passengersParam]);

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

  console.log("FROM PARAM:", fromParam);
  console.log("TO PARAM:", toParam);

  return (
    <div ref={wrapperRef} className={`${isMobileModal ? "p-4" : "container-wide mt-2"}`}>
      

      <div className={`w-full ${isMobileModal ? "space-y-4" : "flex items-center gap-2"}`}>
        {/* FROM */}
        <div className="relative flex-1">
          <CityAutocompleteInput
            label={t("hero.placeholders.from")}
            value={from}
            onSelect={setFrom}
          />
        </div>

        {/* SWAP (desktop only) */}
        {!isMobileModal && (
         <button
            onClick={handleSwapCities}
            className="w-12 h-[56px] bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition"
          >
            <ArrowLeftRight className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* TO */}
        <div className="relative flex-1">
          <CityAutocompleteInput
            label={t("hero.placeholders.to")}
            value={to}
            onSelect={setTo}
          />
        </div>

        {/* DATE */}
        <div className="relative flex-1">
          <input readOnly onClick={() => { setCalendarOpen(true); setPassengersOpen(false); }} value={selectedDate ? selectedDate.toLocaleDateString() : ""} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-xl text-[15px] cursor-pointer focus:outline-none" />
          <label className={`absolute left-4 transition-all duration-200 ${selectedDate ? "top-1 text-[11px]" : "top-4 text-[15px]"} peer-focus:top-1 peer-focus:text-[11px] text-gray-500`}>
            {t("hero.placeholders.when")}
          </label>

          <DatePickerModal isOpen={calendarOpen} selectedDate={selectedDate} onSelect={(date) => { setSelectedDate(date); setCalendarOpen(false); }} />
        </div>

        {/* PASSENGERS */}
        <div className="relative flex-1">
          <input readOnly onClick={() => { setPassengersOpen(true); setCalendarOpen(false); }} value={passengers} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-xl text-[15px] cursor-pointer focus:outline-none" />
          <label className="absolute left-4 top-1 text-[11px] text-gray-500">
            {t("hero.placeholders.passengers")}
          </label>

          <PassengersModal isOpen={passengersOpen} value={passengers} onChange={setPassengers} />
        </div>

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearch}
          disabled={!from || !to}
          className={`bg-[#32BB78] text-white text-[18px] rounded-xl h-[56px] transition ${
            isMobileModal ? "w-full" : "px-10"
          } ${!from || !to ? "opacity-50 cursor-not-allowed" : "hover:bg-[#29a86b]"}`}
        >
          {t("hero.search")}
        </button>
      </div>
    </div>
  );
};

export default RoutesSearch;

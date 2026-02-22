// src/components/routes/RoutesFilters.jsx
import React from "react";
import userVerified from "../../assets/userverified.svg";

  const RoutesFilters = ({
    routes,
    sort,
    setSort,
    timeFilters,
    toggleTime,
    verifiedOnly,
    setVerifiedOnly,
    verifiedCount
  }) => {

  const timeCounts = {
    before6: 0,
    morning: 0,
    day: 0,
    after18: 0,
  };

  (routes || [])
    .filter(route =>
      verifiedOnly
        ? route.driver?.passport?.status === "approved"
        : true
    )
    .forEach((route) => {
    const hour = new Date(route.departureAt).getHours();

    if (hour < 6) timeCounts.before6++;
    else if (hour < 12) timeCounts.morning++;
    else if (hour < 18) timeCounts.day++;
    else timeCounts.after18++;
  });
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-[20px] font-semibold">Сортировать</div>
      </div>

      <div className="space-y-5">
        {[
          ["early", "Самые ранние поездки"],
          ["cheap", "Самые дешевые поездки"],
        ].map(([value, label]) => (
          <label key={value} className="flex items-center gap-3 cursor-pointer text-[16px]">
            <input type="radio" checked={sort === value} onChange={() => setSort(value)} className="sr-only" />
            <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${sort === value ? "border-[#32BB78]" : "border-gray-300"}`}>
              {sort === value && <span className="w-2.5 h-2.5 rounded-full bg-[#32BB78]" />}
            </span>
            {label}
          </label>
        ))}
      </div>

      <div className="h-[2px] bg-gray-200 my-6" />

      <div className="text-[18px] font-semibold mb-4">Время выезда</div>
      <div className="space-y-4">
        {[
          ["before6", "До 06:00"],
          ["morning", "06:00 - 12:00"],
          ["day", "12:00 - 18:00"],
          ["after18", "После 18:00"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center justify-between text-[15px] cursor-pointer">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={timeFilters[key]} onChange={() => toggleTime(key)} className="sr-only" />
              <span className={`w-5 h-5 rounded flex items-center justify-center border-2 ${timeFilters[key] ? "bg-[#32BB78] border-[#32BB78]" : "border-gray-400"}`}>
                {timeFilters[key] && (
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10.5L8.5 14L15 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {label}
            </div>
            <span className="text-gray-700">
              {timeCounts[key]}
            </span>
          </label>
        ))}
      </div>

      <div className="h-[2px] bg-gray-200 my-6" />

      <div className="text-[18px] font-semibold mb-4">Доверие и безопасность</div>
      <label className="flex items-center justify-between text-[15px] cursor-pointer">
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={verifiedOnly} onChange={() => setVerifiedOnly(!verifiedOnly)} className="sr-only" />
          <span className={`w-5 h-5 rounded flex items-center justify-center border-2 ${verifiedOnly ? "bg-[#32BB78] border-[#32BB78]" : "border-gray-400"}`}>
            {verifiedOnly && (
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="none">
                <path d="M5 10.5L8.5 14L15 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          Профиль подтвержден
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-700">
            {verifiedCount}
          </span>
          <img src={userVerified} className="w-4 h-4" />
        </div>
      </label>
    </div>
  );
};

export default RoutesFilters;

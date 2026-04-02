import React from "react";
import uzFlag from "../../assets/flag-uz.svg";

const PlateNumber = ({ value = "", size = "md", className = "" }) => {
  const clean = value.replace(/\s+/g, "").toUpperCase();

  const region = clean.slice(0, 2);
  const rest = clean.slice(2);

  const sizes = {
    responsive: {
      wrapper:    "h-[36px] sm:h-[44px] lg:h-[50px] rounded-[6px] sm:rounded-[8px]",
      region:     "text-[14px] sm:text-[18px] lg:text-[22px]",
      center:     "text-[14px] sm:text-[18px] lg:text-[22px]",
      gap:        "gap-1.5 sm:gap-2 lg:gap-3",
      centerGap:  "gap-1.5 sm:gap-2 lg:gap-3",
      leftPad:    "pr-2 sm:pr-3 lg:pr-4",
      dot:        "w-[4px] h-[4px] sm:w-[5px] sm:h-[5px]",
      flag:       "w-4 h-2.5 sm:w-5 sm:h-3",
      uz:         "text-[9px] sm:text-[10px] lg:text-[11px]",
    },
    xs: {
      wrapper:    "h-[36px] rounded-[6px]",
      region:     "text-[14px]",
      center:     "text-[14px]",
      gap:        "gap-1.5",
      centerGap:  "gap-1.5",
      leftPad:    "pr-2",
      dot:        "w-[4px] h-[4px]",
      flag:       "w-4 h-2.5",
      uz:         "text-[9px]",
    },
    sm: {
      wrapper:    "h-[44px] rounded-[8px]",
      region:     "text-[18px]",
      center:     "text-[18px]",
      gap:        "gap-2",
      centerGap:  "gap-2",
      leftPad:    "pr-3",
      dot:        "w-[5px] h-[5px]",
      flag:       "w-5 h-3",
      uz:         "text-[10px]",
    },
    md: {
      wrapper:    "h-[65px] rounded-[10px]",
      region:     "text-[28px]",
      center:     "text-[32px]",
      gap:        "gap-4",
      centerGap:  "gap-3",
      leftPad:    "pr-5",
      dot:        "w-[6px] h-[6px]",
      flag:       "w-6 h-4",
      uz:         "text-[12px]",
    },
  };

  const s = sizes[size] || sizes.md;

  const physicalRegex = /^[A-Z][0-9]{3}[A-Z]{2}$/;
  const legalRegex = /^[0-9]{3}[A-Z]{3}$/;

  const renderCenter = () => {
    if (!rest) {
      return (
        <div className={`flex items-center ${s.centerGap}`}>
          <span className="text-gray-300">X</span>
          <span className="text-gray-300">XXX</span>
          <span className="text-gray-300">XX</span>
        </div>
      );
    }

    if (physicalRegex.test(rest)) {
      return (
        <div className={`flex items-center ${s.centerGap}`}>
          <span>{rest[0]}</span>
          <span>{rest.slice(1, 4)}</span>
          <span>{rest.slice(4)}</span>
        </div>
      );
    }

    if (legalRegex.test(rest)) {
      return (
        <div className={`flex items-center ${s.centerGap}`}>
          <span>{rest.slice(0, 3)}</span>
          <span>{rest.slice(3)}</span>
        </div>
      );
    }

    return <span>{rest}</span>;
  };

  return (
    <div className={`inline-flex items-center ${s.gap} border-[1px] border-[#123B5A] bg-white px-1 ${s.wrapper} ${className}`}>

      {/* Левая точка + регион */}
      <div className={`flex items-center gap-1.5 sm:gap-2 ${s.leftPad} font-plate h-full border-r-[1px] border-[#123B5A]`}>
        <div className={`${s.dot} bg-black rounded-full`} />
        <span className={`${s.region} ${!region ? "text-gray-300" : ""}`}>
          {region || "XX"}
        </span>
      </div>

      {/* Центр */}
      <div className={`flex items-center font-plate ${s.center}`}>
        {renderCenter()}
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-1.5 sm:gap-2 font-plate">
        <div className="flex flex-col items-center leading-none">
          <img src={uzFlag} alt="UZ" className={`${s.flag} mb-0.5`} />
          <span className={`${s.uz} font-semibold text-[#0EA5B7]`}>UZ</span>
        </div>
        <div className={`${s.dot} bg-black rounded-full`} />
      </div>

    </div>
  );
};

export default PlateNumber;

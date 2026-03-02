import React from "react";
import uzFlag from "../../assets/flag-uz.svg";

const PlateNumber = ({ value = "", size = "md", className = "" }) => {
  const clean = value.replace(/\s+/g, "").toUpperCase();

  const region = clean.slice(0, 2);
  const rest = clean.slice(2);

  const sizes = {
  responsive: {
    wrapper: "h-[44px] lg:h-[50px] px-1 lg:px-1 rounded-[8px] lg:rounded-[8px]",
    region: "text-[18px] lg:text-[22px]",
    center: "text-[18px] lg:text-[22px]",
    gap: "gap-2 lg:gap-3",
  },
  xs: {
    wrapper: "h-[44px] px-1 rounded-[8px]",
    region: "text-[18px]",
    center: "text-[18px]",
    gap: "gap-2",
  },
  sm: {
    wrapper: "h-[50px] px-2 rounded-[10px]",
    region: "text-[20px]",
    center: "text-[20px]",
    gap: "gap-3",
  },
  md: {
    wrapper: "h-[65px] px-2 rounded-[10px]",
    region: "text-[28px]",
    center: "text-[32px]",
    gap: "gap-4",
  },
};

  const s = sizes[size] || sizes.md;

  const physicalRegex = /^[A-Z][0-9]{3}[A-Z]{2}$/;
  const legalRegex = /^[0-9]{3}[A-Z]{3}$/;

  const renderCenter = () => {
    if (!rest) {
      return (
        <div className="flex items-center gap-3">
          <span>F</span>
          <span>001</span>
          <span>FA</span>
        </div>
      );
    }

    if (physicalRegex.test(rest)) {
      return (
        <div className="flex items-center gap-3">
          <span>{rest[0]}</span>
          <span>{rest.slice(1, 4)}</span>
          <span>{rest.slice(4)}</span>
        </div>
      );
    }

    if (legalRegex.test(rest)) {
      return (
        <div className="flex items-center gap-3">
          <span>{rest.slice(0, 3)}</span>
          <span>{rest.slice(3)}</span>
        </div>
      );
    }

    return <span>{rest}</span>;
  };

  return (
    <div className={`inline-flex items-center ${s.gap} border-[1px] border-[#123B5A] bg-white ${s.wrapper} ${className}`}>

      {/* Левая точка + регион */}
      <div className="flex items-center gap-2 pr-4 font-plate h-full border-r-[1px] border-[#123B5A]">
        <div className="w-[5px] h-[5px] bg-black rounded-full" />
        <span className={s.region}>{region || "01"}</span>
      </div>

      {/* Центр */}
      <div className={`flex items-center font-plate ${s.center}`}>
        {renderCenter()}
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-2 font-plate">
        <div className="flex flex-col items-center leading-none">
          <img src={uzFlag} alt="UZ" className="w-5 h-3 mb-1" />
          <span className="text-[11px] font-semibold text-[#0EA5B7]">UZ</span>
        </div>
        <div className="w-[5px] h-[5px] bg-black rounded-full" />
      </div>

    </div>
  );
};

export default PlateNumber;
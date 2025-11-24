import React from "react";
import { X, Eye, EyeOff } from "lucide-react";

const FloatingInput = ({
  label,
  type = "text",
  value,
  onChange,
  onClear,
  showPassword,
  setShowPassword,
}) => {
  return (
    <div className="relative w-full">
      
      {/* INPUT */}
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full h-[56px] px-4 pt-5 
          rounded-xl bg-gray-100 text-[15px]
          focus:outline-none focus:ring-2 focus:ring-gray-300
        "
      />

      {/* FLOATING LABEL */}
      <label
        className={`
          absolute left-4 pointer-events-none 
          transition-all text-gray-500 
          ${value ? "text-[11px] top-2" : "text-[15px] top-4"}
        `}
      >
        {label}
      </label>

      {/* CLEAR BUTTON */}
      {value && (
        <X
          className="
            absolute right-12 top-1/2 -translate-y-1/2 
            w-5 h-5 text-gray-500 cursor-pointer
          "
          onClick={onClear}
        />
      )}

      {/* PASSWORD TOGGLE */}
      {type === "password" && (
        <div
          className="
            absolute right-4 top-1/2 -translate-y-1/2 
            text-gray-500 cursor-pointer
          "
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      )}
    </div>
  );
};

export default FloatingInput;

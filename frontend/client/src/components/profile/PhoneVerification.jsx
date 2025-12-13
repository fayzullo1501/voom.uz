import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import uzFlag from "../../assets/uz-flag.svg";

const PhoneVerification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">

      {/* ===== Header (X) ===== */}
      <header>
        <div className="container-wide flex items-center justify-end">
           <button onClick={() => navigate(-1)} className=" p-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center ">
            <X className="w-6 h-6 text-gray-700 hover:text-black transition" />
          </button>
        </div>
      </header>

      {/* ===== Title ===== */}
      <h1 className="text-[28px] sm:text-[32px] font-semibold text-center mt-6">
        Подтверждение тел. номера
      </h1>

      {/* ===== Content ===== */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">

        {/* Phone block */}
        <div
          className="
            flex items-center gap-3
            px-4 py-3
            border border-gray-300
            rounded-xl
            mb-6
          "
        >
          <img
            src={uzFlag}
            alt="UZ"
            className="w-6 h-6 rounded-sm"
          />

          <span className="text-[18px] font-medium text-black">
            +998 99 996-16-96
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-[16px] max-w-[320px] mb-10">
          Мы отправим вам 6-значный код
          <br />
          по СМС для подтверждения.
        </p>

        {/* Button */}
        <button
          className="
            px-10 py-3
            rounded-xl
            bg-[#32BB78]
            text-white
            text-[17px]
            font-medium
            hover:opacity-90
            transition
          "
        >
          Отправить код
        </button>
      </div>
    </div>
  );
};

export default PhoneVerification;

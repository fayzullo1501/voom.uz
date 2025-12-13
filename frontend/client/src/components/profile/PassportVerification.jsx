import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import passportExample from "../../assets/passport-example.svg";

const PassportVerification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-12 flex flex-col">

      {/* ===== Header (X) ===== */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* ===== Title ===== */}
      <h1 className="text-[28px] sm:text-[32px] font-semibold text-center mt-6 mb-10">
        Проверить паспорт
      </h1>

      {/* ===== Content ===== */}
      <div className="flex-1 flex flex-col items-center text-center">

        {/* Passport example */}
        <img
          src={passportExample}
          alt="Passport example"
          className="w-full max-w-[360px] mb-8"
        />

        {/* Description */}
        <p className="text-[16px] text-gray-700 mb-12">
          Загрузите скан или фото паспорта
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* Select file */}
          <label
            className="
              px-8 py-3
              border border-gray-400
              rounded-xl
              text-[16px]
              font-medium
              cursor-pointer
              hover:bg-gray-50
              transition
            "
          >
            Выбрать файл
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
            />
          </label>

          {/* Submit */}
          <button
            className="
              px-10 py-3
              rounded-xl
              bg-[#32BB78]
              text-white
              text-[16px]
              font-medium
              hover:opacity-90
              transition
            "
          >
            Отправить
          </button>
        </div>

      </div>
    </div>
  );
};

export default PassportVerification;

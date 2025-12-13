import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import uzFlag from "../../assets/uz-flag.svg";


const EditProfileInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10">

      {/* ===== Header (только X) ===== */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* ===== Title ===== */}
      <h1 className="text-[36px] font-medium text-center mb-10">
        Информация о себе
      </h1>

      {/* ===== Content ===== */}
      <div className="max-w-[520px] mx-auto flex flex-col gap-5">

        {/* Имя */}
        <div className="flex flex-col gap-1 cursor-pointer">
          <span className="text-gray-500 text-[15px]">Имя</span>
          <span className="text-[18px] font-medium text-[#000]">
            Fayzullo
          </span>
        </div>

        {/* Фамилия */}
        <div className="flex flex-col gap-1 cursor-pointer">
          <span className="text-gray-500 text-[15px]">Фамилия</span>
          <span className="text-[18px] font-medium text-[#000]">
            Abdulazizov
          </span>
        </div>

        {/* Дата рождения */}
        <div className="flex flex-col gap-1 cursor-pointer">
          <span className="text-gray-500 text-[15px]">Дата рождения</span>
          <span className="text-[18px] font-medium text-[#000]">
            15 / 01 / 2000
          </span>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-[15px]">Адрес эл. почты</span>
          <span className="text-[18px] font-medium text-[#000]">
            fayzee.uz@gmail.com
          </span>
        </div>

        {/* Телефон */}
        <div className="flex flex-col gap-1 cursor-pointer">
            <span className="text-gray-500 text-[15px]">Номер телефона</span>

            <div className="flex items-center gap-2">
                <img
                src={uzFlag}
                alt="UZ"
                className="w-5 h-5 rounded-sm"
                />
                <span className="text-[18px] font-medium text-[#000]">
                +998 99 999 61 96
                </span>
            </div>
        </div>

        {/* О себе */}
        <div className="flex flex-col gap-1 cursor-pointer">
          <span className="text-gray-500 text-[15px]">О себе</span>
          <span className="text-[18px] font-medium text-[#000]">
            Новичок
          </span>
        </div>

      </div>
    </div>
  );
};

export default EditProfileInfo;

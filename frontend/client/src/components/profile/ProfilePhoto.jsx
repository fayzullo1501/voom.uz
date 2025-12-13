import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePhoto = () => {
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
      <h1 className="text-[32px] sm:text-[36px] font-semibold text-center mt-4">
        Фото профиля
      </h1>

      {/* ===== Content ===== */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2">

        {/* Avatar placeholder */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 mb-10" />

        {/* Instructions */}
        <p className="text-[18px] sm:text-[20px] font-semibold text-gray-800 leading-snug max-w-[420px]">
          Фотографируйтесь одни,
          <br />
          снимите солнечные очки
          <br />
          и смотрите прямо перед собой.
        </p>

        {/* Button */}
        <button
          className="
            mt-10 px-10 py-3 rounded-xl
            text-white text-[17px] font-medium
            bg-[#32BB78]
            hover:opacity-90
            transition
          "
        >
          Выбрать фото
        </button>
      </div>
    </div>
  );
};

export default ProfilePhoto;

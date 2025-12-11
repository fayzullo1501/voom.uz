import React from "react";
import Header from "../../components/layout/Header";
import ProfileTopBar from "./ProfileTopBar";

const ProfileMenu = () => {
  return (
    <>
      <Header />

      <div className="flex justify-center mt-6 mb-20 px-4">
        <div className="w-full max-w-[550px]">

          {/* Табы */}
          <ProfileTopBar />

          {/* ====== Аватар + имя ====== */}
          <div className="mt-10 flex items-center gap-5">
            <div
              className="relative w-24 h-24 rounded-full grid place-items-center"
              style={{
                background: "conic-gradient(#862A8A, #AA2376, #E71854)",
                padding: "4px",
              }}
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-sm text-gray-500 text-sm">
                avatar
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[22px] font-semibold leading-tight">
                  Fayzullo
                </span>

                <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[11px] flex items-center justify-center">
                  ✔
                </span>
              </div>

              <span className="mt-1 text-sm font-semibold text-[#e4006b]">
                Проверенный пользователь
              </span>
            </div>
          </div>

          {/* ====== Кнопка "Редактировать информацию о себе" ====== */}
          <button
            className=" mt-8 w-full text-left text-[16px] text-gray-700  py-3 px-3 rounded-lg border border-transparent transition hover:bg-gray-100"
          >
            Редактировать информацию о себе
          </button>

          {/* Разделитель */}
          <div className="mt-8 border-t border-gray-300" />

          {/* =================================================== */}
          {/* ==========   ПОДТВЕРДИТЕ СВОЙ ПРОФИЛЬ   ========== */}
          {/* =================================================== */}

          <div className="mt-8">
            <h3 className="font-bold text-[20px] mb-5">Подтвердите свой профиль</h3>

            {/* Фото профиля */}
            <div className="flex items-center gap-3 py-3 px-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <div className="w-8 h-8 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center">
                ✔
              </div>
              <span className="text-[16px] font-medium">Фото профиля подтверждено</span>
            </div>

            {/* Паспорт */}
            <div className="flex items-center gap-3 py-3 px-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <div className="w-8 h-8 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center">
                ✔
              </div>
              <span className="text-[16px] font-medium">Паспорт подтверждён</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 py-3 px-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <div className="w-8 h-8 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center">
                ✔
              </div>
              <span className="text-[16px] font-medium">fayzee.uz@gmail.com</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 py-3 px-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <div className="w-8 h-8 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center">
                ✔
              </div>
              <span className="text-[16px] font-medium">+998 99 996 16 96</span>
            </div>
          </div>

          {/* Разделитель */}
          <div className="mt-8 border-t border-gray-300" />

          {/* =================================================== */}
          {/* ==========   МАРШРУТЫ И БРОНИ   ========== */}
          {/* =================================================== */}

          <div className="mt-8">
            <h3 className="font-bold text-[20px] mb-5">Маршруты и брони</h3>

            <div className="flex items-center py-3 px-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <span className="text-[16px] font-medium">Мои бронирования</span>
            </div>

            <div className="flex items-center py-3 px-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <span className="text-[16px] font-medium">Мои маршруты</span>
            </div>

            <div className="flex items-center py-3 px-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <span className="text-[16px] font-medium">Служба поддержки</span>
            </div>
          </div>

          {/* Разделитель */}
          <div className="mt-8 border-t border-gray-300" />

          {/* =================================================== */}
          {/* ==========   МАШИНЫ   ========== */}
          {/* =================================================== */}

          <div className="mt-8 mb-10">
            <h3 className="font-bold text-[20px] mb-5">Машины</h3>

            <div className="flex items-center gap-3 py-3 px-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <div className="w-8 h-8 rounded-full border-2 border-gray-700 flex items-center justify-center">
                +
              </div>
              <span className="text-[16px] font-medium">Добавить машину</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileMenu;

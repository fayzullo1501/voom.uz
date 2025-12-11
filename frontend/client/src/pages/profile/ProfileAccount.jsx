import React from "react";
import Header from "../../components/layout/Header";
import ProfileTopBar from "./ProfileTopBar";

const ProfileAccount = () => {
  return (
    <>
      <Header />

      <div className="flex justify-center mt-6 mb-20 px-4">
        <div className="w-full max-w-[550px]">

          {/* Табы */}
          <ProfileTopBar />

          {/* Контент */}
          <div className="mt-10 flex flex-col gap-6">

            {/* ===== БАЛАНС ===== */}
            <div
              className="
                flex justify-between items-center text-[16px]
                py-3 px-3 rounded-lg cursor-pointer transition 
                hover:bg-gray-100
              "
            >
              <span className="text-gray-600 font-medium">Баланс</span>
              <span className="text-black font-semibold">—</span>
            </div>

            {/* ===== EMAIL ===== */}
            <div className="flex justify-between items-center text-[16px] py-3 px-3">
              <span className="text-gray-600 font-medium">Email</span>
              <span className="text-black">—</span>
            </div>

            {/* ===== СТАТУС ВОДИТЕЛЯ ===== */}
            <div className="flex justify-between items-center text-[16px] py-3 px-3">
              <span className="text-gray-600 font-medium">Статус водителя</span>
              <span className="text-black">Нет</span>
            </div>

            {/* ===== КНОПКА ВЫХОДА ===== */}
            <button
              className="
                text-red-500 text-[16px] font-medium 
                hover:text-red-600 transition mt-4
              "
            >
              Выйти
            </button>

          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileAccount;

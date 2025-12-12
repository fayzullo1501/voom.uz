import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/layout/Header";
import ProfileTopBar from "./ProfileTopBar";

import avatarPlaceholder from "../../assets/avatar-placeholder.svg";
import userVerifiedIcon from "../../assets/userverified.svg";

/* ===== Универсальная зелёная галочка ===== */
const CheckIcon = () => (
  <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path
        d="M1 6L6 11L15 1"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  return (
    <>
      <Header />

      <div className="flex justify-center mt-6 mb-20 px-4">
        <div className="w-full max-w-[550px]">

          {/* ===== Табы ===== */}
          <ProfileTopBar />

          {/* ===== Аватар + имя ===== */}
          <div className="mt-10 flex items-center gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src={avatarPlaceholder}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[36px] font-semibold leading-tight">
                  Fayzullo
                </span>
                <img
                  src={userVerifiedIcon}
                  alt="Verified"
                  className="w-7 h-7"
                />
              </div>

              <span className="mt-1 text-sm text-[#32BB78]">
                Проверенный пользователь
              </span>
            </div>
          </div>

          {/* ===== Редактировать профиль ===== */}
          <button
            onClick={() => navigate(`/${lang}/profile/edit`)}
            className="mt-8 w-full text-left text-[16px] text-gray-700 py-3 px-3 rounded-lg transition hover:bg-gray-100"
          >
            Редактировать информацию о себе
          </button>

          <div className="mt-8 border-t border-gray-300" />

          {/* =================================================== */}
          {/* ==========   ПОДТВЕРЖДЕНИЕ ПРОФИЛЯ   ========== */}
          {/* =================================================== */}

          <div className="mt-8">
            <h3 className="font-bold text-[20px] mb-5">
              Подтвердите свой профиль
            </h3>

            <div onClick={() => navigate(`/${lang}/profile/photo`)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition" >
                <CheckIcon />
                <span className="text-[16px] font-medium">
                    Фото профиля подтверждено
                </span>
            </div>

            <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">
                Паспорт подтверждён
              </span>
            </div>

            <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">
                fayzee.uz@gmail.com
              </span>
            </div>

            <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">
                +998 99 996 16 96
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-300" />

          {/* =================================================== */}
          {/* ==========   МАРШРУТЫ И БРОНИ   ========== */}
          {/* =================================================== */}

          <div className="mt-8">
            <h3 className="font-bold text-[20px] mb-5">
              Маршруты и брони
            </h3>

            <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">
                Мои бронирования
              </span>
            </div>

            <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">
                Мои маршруты
              </span>
            </div>

            <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">
                Служба поддержки
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-300" />

          {/* =================================================== */}
          {/* ==========   МАШИНЫ   ========== */}
          {/* =================================================== */}

          <div className="mt-8 mb-10">
            <h3 className="font-bold text-[20px] mb-5">Машины</h3>

            <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <div className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="#535353"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-[16px] font-medium">
                Добавить машину
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileMenu;

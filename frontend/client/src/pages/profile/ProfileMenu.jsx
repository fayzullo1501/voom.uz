import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/layout/Header";
import ProfileTopBar from "./ProfileTopBar";

import avatarPlaceholder from "../../assets/avatar-placeholder.svg";
import userVerifiedIcon from "../../assets/userverified.svg";

import { API_URL } from "../../config/api";

/* ===== Универсальная зелёная галочка (ТОЛЬКО подтверждения) ===== */
const CheckIcon = () => (
  <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultNameByLang = { ru: "Пользователь", uz: "Foydalanuvchi", en: "User" };
  const verifiedLabelByLang = { ru: "Проверенный пользователь", uz: "Tasdiqlangan foydalanuvchi", en: "Verified user" };

  /* ===== Проверка авторизации + загрузка профиля ===== */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate(`/${lang}/login`);
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate(`/${lang}/login`);
      });
  }, [lang, navigate]);

  if (loading) return null;

  const displayName =
  (user?.firstName || "").trim() ||
  defaultNameByLang[lang] ||
  defaultNameByLang.ru;
  const avatarSrc = user?.avatarUrl || user?.avatar || user?.photoUrl || user?.photo || avatarPlaceholder;

  return (
    <>
      <Header />

      <div className="flex justify-center mt-6 mb-20 px-4">
        <div className="w-full max-w-[550px]">
          {/* ===== Табы ===== */}
          <ProfileTopBar />

          {/* ===== Аватар + имя ===== */}
          <div className="mt-10 flex items-center gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = avatarPlaceholder)} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[36px] font-semibold leading-tight">{displayName}</span>

                {user?.isVerified && <img src={userVerifiedIcon} alt="Verified" className="w-7 h-7" />}
              </div>

              {user?.isVerified && <span className="mt-1 text-sm text-[#32BB78]">{verifiedLabelByLang[lang] || verifiedLabelByLang.ru}</span>}
            </div>
          </div>

          {/* ===== Редактировать профиль ===== */}
          <button onClick={() => navigate(`/${lang}/profile/edit`)} className="mt-8 w-full text-left text-[16px] text-gray-700 py-3 px-3 rounded-lg transition hover:bg-gray-100">
            Редактировать информацию о себе
          </button>

          <div className="mt-8 border-t border-gray-300" />

          {/* ===== Подтверждение профиля ===== */}
          <div className="mt-8">
            <h3 className="font-bold text-[20px] mb-5">Подтвердите свой профиль</h3>

            <div onClick={() => navigate(`/${lang}/profile/photo`)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">Фото профиля</span>
            </div>

            <div onClick={() => navigate(`/${lang}/profile/passport-verification`)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">Паспорт</span>
            </div>

            <div onClick={() => navigate(`/${lang}/profile/phone-verification`)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">+998 {user?.phone}</span>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-300" />

          {/* ===== Маршруты и брони ===== */}
          <div className="mt-8">
            <h3 className="font-bold text-[20px] mb-5">Маршруты и брони</h3>

            <div onClick={() => navigate(`/${lang}/profile/bookings`)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">Мои бронирования</span>
            </div>

            <div onClick={() => navigate(`/${lang}/profile/routes`)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">Мои маршруты</span>
            </div>

            <div onClick={() => navigate(`/${lang}/profile/chat`)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <CheckIcon />
              <span className="text-[16px] font-medium">Чат мессенджер</span>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-300" />

          {/* ===== Машины ===== */}
          <div className="mt-8 mb-10">
            <h3 className="font-bold text-[20px] mb-5">Машины</h3>

            <div onClick={() => navigate(`/${lang}/profile/transport`)} className="py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <div className="text-[18px] font-semibold leading-tight">Мои машины</div>
              <div className="text-[15px] text-gray-500 mt-1">Управление транспортом</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileMenu;

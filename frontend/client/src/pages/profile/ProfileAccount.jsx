import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import ProfileTopBar from "./ProfileTopBar";

const ProfileAccount = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = `/${lang}/login`;
  };
  return (
    <>
      <Header />

      <div className="flex justify-center mt-6 mb-20 px-4">
        <div className="w-full max-w-[550px]">

          {/* Табы */}
          <ProfileTopBar />

          {/* Контент */}
          <div className="mt-8">

            {/* ===== БАЛАНС ===== */}
            <div onClick={() => navigate(`/${lang}/profile/balance`)}  className="flex items-center gap-3 py-3 px-2 rounded-lg cursor-pointer transition hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="6" width="20" height="12" rx="2" stroke="white" strokeWidth="2" />
                  <path d="M16 12H18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="flex-1 text-[16px] font-medium">Баланс</span>
              <span className="text-black font-medium">125,000 UZS</span>
            </div>

            {/* Разделитель */}
            <div className="my-3 border-t border-gray-300" />

            {/* ===== EMAIL ===== */}
            <div className="flex items-center gap-3 py-3 px-2 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" strokeWidth="2" />
                  <path d="M3 7L12 13L21 7" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="flex-1 text-[16px] font-medium">Email</span>
              <span className="text-black">fayzee.uz@gmail.com</span>
            </div>

            {/* ===== СТАТУС ВОДИТЕЛЯ ===== */}
            <div className="flex items-center gap-3 py-3 px-2 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="7" r="3" stroke="white" strokeWidth="2" />
                  <path d="M5 21C5 16.5 19 16.5 19 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="flex-1 text-[16px] font-medium">Статус водителя</span>
              <span className="text-black">Да</span>
            </div>

            {/* ===== ВЫХОД ===== */}
            <div onClick={handleLogout} className="flex items-center gap-3 py-3 px-2 mt-2 cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 17L21 12L16 7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 12H9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[16px] font-medium text-red-500">Выйти</span>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileAccount;

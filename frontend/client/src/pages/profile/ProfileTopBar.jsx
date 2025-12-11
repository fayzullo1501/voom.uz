import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProfileTopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation("profile"); // namespace "profile"

  const isMenu = location.pathname.includes("/profile/menu");
  const isAccount = location.pathname.includes("/profile/account");

  // PC version width
  const TOTAL_WIDTH_PC = 550;
  const HALF_PC = TOTAL_WIDTH_PC / 2;

  // Mobile version width
  const TOTAL_WIDTH_MOBILE = 300;
  const HALF_MOBILE = TOTAL_WIDTH_MOBILE / 2;

  return (
    <div className="flex flex-col items-center mt-10 mb-6">

      {/* TABS */}
      <div
        className="
          flex justify-center gap-6 sm:gap-16 mb-4
        "
        style={{
          width: window.innerWidth < 640 ? TOTAL_WIDTH_MOBILE : TOTAL_WIDTH_PC,
        }}
      >
        {/* TAB: ABOUT */}
        <button
          onClick={() => navigate(`/${lang}/profile/menu`)}
          className={`
            pb-2 transition text-center
            text-[15px] sm:text-[17px] font-medium
            ${
              isMenu
                ? "text-black font-semibold"
                : "text-gray-500 hover:text-black"
            }
            w-[140px] sm:w-[275px]
          `}
        >
          {t("tabs.about")}
        </button>

        {/* TAB: ACCOUNT */}
        <button
          onClick={() => navigate(`/${lang}/profile/account`)}
          className={`
            pb-2 transition text-center
            text-[15px] sm:text-[17px] font-medium
            ${
              isAccount
                ? "text-black font-semibold"
                : "text-gray-500 hover:text-black"
            }
            w-[140px] sm:w-[275px]
          `}
        >
          {t("tabs.account")}
        </button>
      </div>

      {/* UNDERLINES */}
      <div className="relative h-[3px] w-full flex justify-center">
        {/* ABOUT underline */}
        <div
          className={`
            absolute h-[2px] bg-black transition-opacity duration-200
            ${isMenu ? "opacity-100" : "opacity-0"}
          `}
          style={{
            width: window.innerWidth < 640 ? HALF_MOBILE : HALF_PC,
            left:
              window.innerWidth < 640
                ? `calc(50% - ${HALF_MOBILE}px)`
                : `calc(50% - ${HALF_PC}px)`,
          }}
        />

        {/* ACCOUNT underline */}
        <div
          className={`
            absolute h-[2px] bg-black transition-opacity duration-200
            ${isAccount ? "opacity-100" : "opacity-0"}
          `}
          style={{
            width: window.innerWidth < 640 ? HALF_MOBILE : HALF_PC,
            left: "50%",
          }}
        />
      </div>
    </div>
  );
};

export default ProfileTopBar;

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import logo from "../../assets/logo.svg";
import plusIcon from "../../assets/plus-icon.svg";
import flagRu from "../../assets/ru-flag.svg";
import flagUz from "../../assets/uz-flag.svg";
import flagEn from "../../assets/en-flag.svg";
import menuIcon from "../../assets/menu.svg";
import closeIcon from "../../assets/close.svg";
import avatarPlaceholder from "../../assets/avatar-placeholder.svg";

const Header = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("layout");
  const { lang } = useParams();

  const currentLang = lang || i18n.language || "ru";

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const languages = [
    { code: "ru", flag: flagRu },
    { code: "uz", flag: flagUz },
    { code: "en", flag: flagEn },
  ];

  const getCurrentLangFlag = () => {
    return (
      languages.find((l) => l.code === currentLang)?.flag || flagRu
    );
  };

  // смена языка → меняем URL + i18next
  const handleLangChange = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);

    const pathParts = window.location.pathname.split("/");
    pathParts[1] = code; // заменяем язык в URL

    const newPath = pathParts.join("/");
    navigate(newPath);
  };

  const navLinks = [
    { key: "home", href: `/${currentLang}` },
    { key: "about", href: `/${currentLang}/about` },
    { key: "news", href: `/${currentLang}/news` },
    { key: "contacts", href: `/${currentLang}/contacts` }
  ];

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="container-wide flex items-center justify-between py-8">
        {/* Левая часть */}
        <div className="flex items-center gap-10">

          {/* ЛОГО */}
          <img
            src={logo}
            alt={t("header.logoAlt")}
            className="h-6 cursor-pointer"
            onClick={() => navigate(`/${currentLang}`)}
          />

          {/* НАВИГАЦИЯ (ДЕСКТОП) */}
          <nav className="hidden lg:flex items-center gap-6">

            {navLinks.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-gray-900 hover:text-gray-700 text-[17px] font-medium transition"
              >
                {t(`header.nav.${item.key}`)}
              </a>
            ))}

            {/* Языковой селектор */}
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setLangOpen(!langOpen)}
              >
                <img
                  src={getCurrentLangFlag()}
                  alt={t(`header.language.${currentLang}`)}
                  className="w-5 h-3 rounded-sm"
                />
                <span className="text-[17px] text-gray-900">
                  {t(`header.language.${currentLang}`)}
                </span>

                <svg
                  className={`w-3 h-3 text-gray-600 transition-transform ${
                    langOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </div>

              {langOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-40 z-50">
                  {languages.map((l) => (
                    <div
                      key={l.code}
                      onClick={() => handleLangChange(l.code)}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                    >
                      <img
                        src={l.flag}
                        alt={t(`header.language.${l.code}`)}
                        className="w-5 h-3 rounded-sm"
                      />
                      <span className="text-[15px]">
                        {t(`header.language.${l.code}`)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* ПРАВАЯ ЧАСТЬ (ДЕСКТОП) */}
        <div className="hidden lg:flex items-center gap-4">

          {/* Создать маршрут */}
          <button
            className="flex items-center gap-2 text-[16px] text-gray-900 hover:text-gray-700 transition font-medium"
            onClick={() => navigate(`/${currentLang}/create-route`)}
          >
            <img src={plusIcon} alt="+" className="w-4 h-4" />
            {t("header.actions.createRoute")}
          </button>

          {/* Аккаунт */}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg">
            <span className="text-[15px] font-medium">
              {t("header.profile.namePlaceholder")}
            </span>
            <img
              src={avatarPlaceholder}
              alt="avatar"
              className="w-8 h-8 rounded-full bg-gray-200"
            />
          </div>
        </div>

        {/* БУРГЕР (МОБАЙЛ) */}
        <div
          className="lg:hidden cursor-pointer z-[60]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img
            src={menuOpen ? closeIcon : menuIcon}
            alt="menu"
            className="w-7 h-7"
          />
        </div>
      </div>

      {/* Мобильное меню */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-all duration-300 ease-in-out ${
          menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } flex flex-col`}
      >

        {/* TOP */}
        <div className="flex items-center justify-between px-6 py-5">
          <img
            src={logo}
            alt={t("header.logoAlt")}
            className="h-7 cursor-pointer"
            onClick={() => {
              navigate(`/${currentLang}`);
              setMenuOpen(false);
            }}
          />
        </div>

        {/* Мобильная навигация */}
        <div className="flex flex-col items-start px-8 pt-4 gap-6">

          {navLinks.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-gray-900 text-[18px] font-medium hover:text-gray-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              {t(`header.nav.${item.key}`)}
            </a>
          ))}

          {/* Язык (мобайл) */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setLangOpen(!langOpen)}
            >
              <img
                src={getCurrentLangFlag()}
                alt={t(`header.language.${currentLang}`)}
                className="w-6 h-4 rounded-sm"
              />
              <span className="text-[17px]">
                {t(`header.language.${currentLang}`)}
              </span>

              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  langOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {langOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-40 z-50">
                {languages.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => {
                      handleLangChange(l.code);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                  >
                    <img
                      src={l.flag}
                      alt={t(`header.language.${l.code}`)}
                      className="w-5 h-3 rounded-sm"
                    />
                    <span className="text-[15px]">
                      {t(`header.language.${l.code}`)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопка + профиль */}
          <div className="flex flex-col gap-4 w-full pt-2">

            <button
              className="flex items-center gap-2 text-[16px] font-medium text-gray-900 hover:text-gray-700 transition"
              onClick={() => {
                navigate(`/${currentLang}/create-route`);
                setMenuOpen(false);
              }}
            >
              <img src={plusIcon} alt="+" className="w-4 h-4" />
              {t("header.actions.createRoute")}
            </button>

            <div className="flex items-center gap-3">
              <img
                src={avatarPlaceholder}
                alt="profile"
                className="w-10 h-10 rounded-full bg-gray-200"
              />
              <span className="text-[16px] font-medium">
                {t("header.profile.namePlaceholder")}
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* затемнение фона при открытом меню */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;

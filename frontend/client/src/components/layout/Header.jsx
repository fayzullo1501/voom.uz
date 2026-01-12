import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  const isAuth = true;

  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "ru", flag: flagRu },
    { code: "uz", flag: flagUz },
    { code: "en", flag: flagEn },
  ];

  const getCurrentLangFlag = () => languages.find((l) => l.code === currentLang)?.flag || flagRu;

  const handleLangChange = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
    const pathParts = window.location.pathname.split("/");
    pathParts[1] = code;
    navigate(pathParts.join("/"));
  };

  const navLinks = [
    { key: "home", href: `/${currentLang}` },
    { key: "about", href: `/${currentLang}/about` },
    { key: "news", href: `/${currentLang}/news` },
    { key: "contacts", href: `/${currentLang}/contacts` },
  ];

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="container-wide flex items-center justify-between py-8">
        <div className="flex items-center gap-10">
          <img src={logo} alt={t("header.logoAlt")} className="h-10 cursor-pointer" onClick={() => navigate(`/${currentLang}`)} />

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((item) => (
              <a key={item.key} href={item.href} className="text-gray-900 hover:text-gray-700 text-[17px] font-medium transition">
                {t(`header.nav.${item.key}`)}
              </a>
            ))}

            <div className="relative">
              <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setLangOpen(!langOpen)}>
                <img src={getCurrentLangFlag()} alt={t(`header.language.${currentLang}`)} className="w-5 h-3 rounded-sm" />
                <span className="text-[17px] text-gray-900">{t(`header.language.${currentLang}`)}</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </div>

              {langOpen && (
                <div className="absolute top-full left-0 mt-3 bg-white border border-gray-300 rounded-xl p-2 w-40 z-50">
                  {languages.map((l) => (
                    <div key={l.code} onClick={() => handleLangChange(l.code)} className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                      <img src={l.flag} alt={t(`header.language.${l.code}`)} className="w-5 h-3 rounded-sm" />
                      <span className="text-[15px]">{t(`header.language.${l.code}`)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button className="flex items-center gap-2 text-[16px] text-gray-900 hover:text-gray-700 transition font-medium" onClick={() => navigate(`/${currentLang}/create-route`)}>
            <img src={plusIcon} alt="+" className="w-4 h-4" />
            {t("header.actions.createRoute")}
          </button>

          <div ref={profileRef} className="relative">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-lg" onClick={() => setProfileOpen(!profileOpen)}>
              <span className="text-[15px] font-medium">{isAuth ? t("header.profile.namePlaceholder") : t("header.profile.login")}</span>
              <img src={avatarPlaceholder} alt="avatar" className="w-8 h-8 rounded-full bg-gray-200" />
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-3 bg-white border border-gray-300 rounded-2xl w-[230px] z-50 p-2">
                {!isAuth ? (
                  <>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/login`)}>{t("header.profile.login")}</div>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/register`)}>{t("header.profile.register")}</div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/profile/menu`)}>{t("header.profile.menu.profile")}</div>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/profile/bookings`)}>{t("header.profile.menu.bookings")}</div>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/profile/routes`)}>{t("header.profile.menu.routes")}</div>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/profile/chat`)}>{t("header.profile.menu.chat")}</div>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/profile/notifications`)}>{t("header.profile.menu.notifications")}</div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden cursor-pointer z-[60]" onClick={() => setMenuOpen(!menuOpen)}>
          <img src={menuOpen ? closeIcon : menuIcon} alt="menu" className="w-7 h-7" />
        </div>
      </div>

      <div className={`fixed inset-0 bg-white z-50 transform transition-all duration-300 ease-in-out ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"} flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-5">
          <img src={logo} alt={t("header.logoAlt")} className="h-10 cursor-pointer" onClick={() => { navigate(`/${currentLang}`); setMenuOpen(false); }} />
        </div>

        <div className="flex flex-col items-start px-8 pt-4 gap-6">
          {navLinks.map((item) => (
            <a key={item.key} href={item.href} className="text-gray-900 text-[18px] font-medium hover:text-gray-600 transition" onClick={() => setMenuOpen(false)}>
              {t(`header.nav.${item.key}`)}
            </a>
          ))}

          <div className="relative">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLangOpen(!langOpen)}>
              <img src={getCurrentLangFlag()} alt={t(`header.language.${currentLang}`)} className="w-6 h-4 rounded-sm" />
              <span className="text-[17px]">{t(`header.language.${currentLang}`)}</span>
            </div>

            {langOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg p-2 w-40 z-50">
                {languages.map((l) => (
                  <div key={l.code} onClick={() => { handleLangChange(l.code); setMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100">
                    <img src={l.flag} alt={t(`header.language.${l.code}`)} className="w-5 h-3 rounded-sm" />
                    <span className="text-[15px]">{t(`header.language.${l.code}`)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full">
            <div className="flex items-center gap-3 cursor-pointer mt-2" onClick={() => setMobileProfileOpen(!mobileProfileOpen)}>
              <img src={avatarPlaceholder} alt="profile" className="w-10 h-10 rounded-full bg-gray-200" />
              <span className="text-[16px] font-medium">{isAuth ? t("header.profile.namePlaceholder") : t("header.profile.login")}</span>
            </div>

            {mobileProfileOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-xl p-2 w-full z-50">
                {!isAuth ? (
                  <>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/login`)}>{t("header.profile.login")}</div>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/register`)}>{t("header.profile.register")}</div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/profile/menu`)}>{t("header.profile.menu.profile")}</div>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/profile/bookings`)}>{t("header.profile.menu.bookings")}</div>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/profile/routes`)}>{t("header.profile.menu.routes")}</div>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/profile/chat`)}>{t("header.profile.menu.chat")}</div>
                    <div className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-[15px]" onClick={() => navigate(`/${currentLang}/profile/notifications`)}>{t("header.profile.menu.notifications")}</div>
                  </>
                )}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 text-[16px] font-medium text-gray-900 hover:text-gray-700 transition mt-4" onClick={() => { navigate(`/${currentLang}/create-route`); setMenuOpen(false); }}>
            <img src={plusIcon} alt="+" className="w-4 h-4" />
            {t("header.actions.createRoute")}
          </button>
        </div>
      </div>

      {menuOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMenuOpen(false)} />}
    </header>
  );
};

export default Header;

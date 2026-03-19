import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

import logo from "../../assets/logo.svg";
import flagRu from "../../assets/ru-flag.svg";
import flagUz from "../../assets/uz-flag.svg";
import flagEn from "../../assets/en-flag.svg";

const Header = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const currentLang = lang || "ru";
  const { t, i18n } = useTranslation("layout");

  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  // sync language
  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang, i18n]);

  const languages = [
    { code: "ru", label: t("header.language.ru"), flag: flagRu },
    { code: "uz", label: t("header.language.uz"), flag: flagUz },
    { code: "en", label: t("header.language.en"), flag: flagEn }
  ];

  const current =
    languages.find((l) => l.code === currentLang) || languages[0];

  const changeLang = (code) => {
    const parts = window.location.pathname.split("/");
    parts[1] = code;
    navigate(parts.join("/"));
    setLangOpen(false);
  };

  const handleLogin = () => {
    window.location.href = `https://voom.uz/${currentLang}/login`;
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="w-full flex border border-gray-200 items-center justify-between px-10 py-6">
        
        {/* LEFT — LOGO */}
        <img
          src={logo}
          alt={t("header.logoAlt")}
          className="h-10 cursor-pointer"
          onClick={() => navigate(`/${currentLang}`)}
        />

        {/* CENTER — SEARCH */}
        <div className="flex-1 max-w-xl mx-10">
          <input
            type="text"
            placeholder={t("header.search.placeholder")}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#32BB78]"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">

          {/* LANGUAGE */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80"
            >
              <img
                src={current.flag}
                alt={t(`header.language.${currentLang}`)}
                className="w-5 h-3 object-cover"
              />
              <span className="text-sm font-medium">
                {current.label}
              </span>
              <ChevronDown size={16} />
            </div>

            {langOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-md w-40 py-2">
                {languages.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={l.flag}
                      alt={t(`header.language.${l.code}`)}
                      className="w-5 h-3 object-cover"
                    />
                    <span className="text-sm">{l.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LOGIN */}
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            {t("header.actions.login")}
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;
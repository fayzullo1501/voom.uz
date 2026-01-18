// src/pages/Settings.jsx
import { useState } from "react";
import PageHeader from "../components/layout/Header";
import { ChevronDown, Check } from "lucide-react";
import { SettingsIcon, Bell } from "lucide-react";


const Toggle = ({ enabled }) => (
  <div className={`w-11 h-6 rounded-full flex items-center transition ${enabled ? "bg-[#32BB78] justify-end" : "bg-gray-300 justify-start"}`}>
    <div className="w-5 h-5 bg-white rounded-full mx-[2px]" />
  </div>
);

const Settings = () => {
  const [section, setSection] = useState("general");
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("ru");
  const [themeOpen, setThemeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [identEnabled, setIdentEnabled] = useState(false);

  const themeLabel = theme === "system" ? "Системная" : theme === "dark" ? "Темная" : "Светлая";
  const langLabel = language === "ru" ? "Русский" : "English";

  return (
    <>
      <PageHeader title="Настройки" />

      <div className="bg-white px-8 pt-6 pb-10 h-[calc(100vh-72px)]">
        <div className="flex h-full rounded-2xl overflow-hidden">
          {/* INNER SIDEBAR */}
          <div className="w-[260px] border-r border-gray-200 p-4 flex flex-col gap-2">
            <div onClick={() => setSection("general")} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-[16px] font-medium ${section === "general" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                <SettingsIcon size={20} />
                Общее
            </div>
            <div onClick={() => setSection("notifications")} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-[16px] font-medium ${section === "notifications" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                <Bell size={20} />
                Уведомления
            </div>

          </div>

          {/* CONTENT */}
          <div className="flex-1 p-8">
            {section === "general" && (
              <div className="flex flex-col">
                {/* THEME */}
                <div className="flex items-center justify-between py-5 border-b border-gray-200 relative">
                  <div className="text-[16px] font-medium">Внешний вид</div>
                  <div onClick={() => setThemeOpen(!themeOpen)} className="flex items-center gap-2 cursor-pointer text-[15px] font-medium text-gray-700">
                    {themeLabel}
                    <ChevronDown size={18} />
                  </div>

                  {themeOpen && (
                    <div className="absolute right-0 top-[60px] w-[220px] bg-[#fff] rounded-2xl p-2 border border-gray-200 z-10">
                      {["dark", "light"].map((t) => (
                        <div key={t} onClick={() => { setTheme(t); setThemeOpen(false); }} className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer text-black hover:bg-gray-200">
                          <span>{t === "dark" ? "Темная" : "Светлая"}</span>
                          {theme === t && <Check size={18} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* LANGUAGE */}
                <div className="flex items-center justify-between py-5 border-b border-gray-200 relative">
                  <div className="text-[16px] font-medium">Язык</div>
                  <div onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 cursor-pointer text-[15px] font-medium text-gray-700">
                    {langLabel}
                    <ChevronDown size={18} />
                  </div>

                  {langOpen && (
                    <div className="absolute right-0 top-[60px] w-[220px] bg-[#fff] rounded-2xl p-2 border border-gray-200 z-10">
                      {["ru", "en"].map((l) => (
                        <div key={l} onClick={() => { setLanguage(l); setLangOpen(false); }} className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer text-black hover:bg-gray-200">
                          <span>{l === "ru" ? "Русский" : "English"}</span>
                          {language === l && <Check size={18} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {section === "notifications" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-gray-200 py-5">
                  <div className="text-[16px] font-medium">Чаты</div>
                  <div onClick={() => setChatEnabled(!chatEnabled)} className="cursor-pointer">
                    <Toggle enabled={chatEnabled} />
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="text-[16px] font-medium">Идентификация</div>
                  <div onClick={() => setIdentEnabled(!identEnabled)} className="cursor-pointer">
                    <Toggle enabled={identEnabled} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

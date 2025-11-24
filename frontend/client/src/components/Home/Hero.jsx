import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import heroBg from "../../assets/hero-bg.jpg";
import swapIcon from "../../assets/swap.svg";

const Hero = () => {
  const { t } = useTranslation("home");
  const [activeTab, setActiveTab] = useState("trip");

  return (
    <section className="bg-white">
      <div className="container-wide">

        {/* Фон */}
        <div
          className="relative bg-cover bg-center bg-no-repeat rounded-[36px] overflow-hidden"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          {/* Контент */}
          <div className="flex flex-col items-center text-center px-6 md:px-10 pt-20 md:pt-24 pb-12 md:pb-14">

            {/* Текст */}
            <div className="max-w-3xl mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                <span className="block">{t("hero.titleLine1")}</span>
                <span className="block">{t("hero.titleLine2")}</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                <span className="block">{t("hero.subtitle1")}</span>
                <span className="block">{t("hero.subtitle2")}</span>
              </p>
            </div>

            {/* Форма поиска */}
            <div className="bg-white w-full max-w-[1280px] rounded-[24px] shadow-lg p-5 sm:p-6 md:p-8 flex flex-col gap-6">

              {/* Табы */}
              <div className="flex gap-3 justify-start">
                <button
                  onClick={() => setActiveTab("trip")}
                  className={`px-6 py-2.5 rounded-lg text-[16px] font-medium transition ${
                    activeTab === "trip"
                      ? "bg-[#32BB78] text-white"
                      : "bg-transparent text-gray-800 hover:text-gray-900"
                  }`}
                >
                  {t("hero.tabs.trip")}
                </button>
                <button
                  onClick={() => setActiveTab("delivery")}
                  className={`px-6 py-2.5 rounded-lg text-[16px] font-medium transition ${
                    activeTab === "delivery"
                      ? "bg-[#32BB78] text-white"
                      : "bg-transparent text-gray-800 hover:text-gray-900"
                  }`}
                >
                  {t("hero.tabs.delivery")}
                </button>
              </div>

              {/* Поля */}
              <div className="flex flex-wrap gap-3 items-center justify-between">

                <input
                  type="text"
                  placeholder={t("hero.placeholders.from")}
                  className="flex-1 min-w-[150px] h-[56px] bg-gray-100 rounded-lg px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-200"
                />

                <button className="w-12 h-[56px] bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
                  <img src={swapIcon} alt="swap" className="w-5 h-5 opacity-70" />
                </button>

                <input
                  type="text"
                  placeholder={t("hero.placeholders.to")}
                  className="flex-1 min-w-[150px] h-[56px] bg-gray-100 rounded-lg px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-200"
                />

                <input
                  type="text"
                  placeholder={t("hero.placeholders.when")}
                  className="flex-1 min-w-[150px] h-[56px] bg-gray-100 rounded-lg px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-200"
                />

                {activeTab === "trip" && (
                  <input
                    type="text"
                    placeholder={t("hero.placeholders.passengers")}
                    className="flex-1 min-w-[150px] h-[56px] bg-gray-100 rounded-lg px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                )}

                <button className="bg-[#32BB78] text-white font-medium rounded-lg px-8 h-[56px] hover:bg-[#29a86b] transition min-w-[120px]">
                  {t("hero.search")}
                </button>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;

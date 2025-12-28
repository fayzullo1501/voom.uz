// Hero.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import heroBg from "../../assets/hero-bg.jpg";
import HeroSearch from "./HeroSearch";

const Hero = () => {
  const { t } = useTranslation("home");

  return (
    <section className="bg-white">
      <div className="container-wide">
        <div className="relative bg-cover bg-center bg-no-repeat rounded-[36px] overflow-hidden" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="flex flex-col items-center text-center px-6 md:px-10 pt-20 md:pt-24 pb-12 md:pb-14">
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
            <HeroSearch />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

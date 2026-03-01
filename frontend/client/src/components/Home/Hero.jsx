// Hero.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import heroBg from "../../assets/hero-bg.jpg";
import HeroSearch from "./HeroSearch";

const Hero = () => {
  const { t } = useTranslation("home");
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="bg-white">
      <div className="container-wide">
        <div className="relative rounded-[36px] overflow-hidden">
  
            {/* Placeholder */}
            <div
              className={`absolute inset-0 bg-gray-300 transition-opacity duration-500 ${
                loaded ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* Image */}
            <img
              src={heroBg}
              alt="hero"
              onLoad={() => setLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-10 pt-20 md:pt-24 pb-12 md:pb-14">
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

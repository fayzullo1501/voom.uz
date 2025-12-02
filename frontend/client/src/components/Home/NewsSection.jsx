import React from "react";
import { useTranslation } from "react-i18next";
import newsImg from "../../assets/hero-bg.jpg"; // временная картинка

function NewsSection() {
  const { t } = useTranslation("home");

  // Достаём массив новостей из переводов
  const newsList = t("newsSection.items", { returnObjects: true });

  return (
    <section className="bg-white">
      <div className="container-wide">

        {/* TITLE */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          {t("newsSection.title")}
        </h2>

        {/* NEWS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {newsList.map((item, index) => (
            <div key={index} className="flex flex-col cursor-pointer group">
              
              <img
                src={newsImg}
                alt={item.title}
                className="w-full h-60 object-cover rounded-2xl mb-5 
                           group-hover:opacity-90 transition"
              />

              <h3 className="text-lg sm:text-xl font-semibold mb-3 leading-snug">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                {item.desc}
              </p>

              <span className="text-gray-500 text-sm">{item.date}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default NewsSection;

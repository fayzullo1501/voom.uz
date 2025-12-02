import React from "react";
import { useTranslation } from "react-i18next";
import carBg from "../../assets/hero-bg.jpg"; 
import why1 from "../../assets/why1.jpg";
import why2 from "../../assets/why2.jpg";
import why3 from "../../assets/why3.jpg";

const WhyChooseUs = () => {
  const { t } = useTranslation("home");

  // Карточки формируем из переводов
  const cards = [
    {
      id: 1,
      title: t("why.cards.1.title"),
      description: t("why.cards.1.text"),
      image: why1
    },
    {
      id: 2,
      title: t("why.cards.2.title"),
      description: t("why.cards.2.text"),
      image: why2
    },
    {
      id: 3,
      title: t("why.cards.3.title"),
      description: t("why.cards.3.text"),
      image: why3
    }
  ];

  return (
    <section className="w-full bg-white">
      <div className="container-wide">
        {/* Заголовок */}
        <h2 className="text-3xl md:text-4xl font-semibold mb-10">
          {t("why.titleBefore")}{" "}
          <span className="text-[#29a86b]">voom</span>{" "}
          {t("why.titleAfter")}
        </h2>


        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm md:text-base opacity-90">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

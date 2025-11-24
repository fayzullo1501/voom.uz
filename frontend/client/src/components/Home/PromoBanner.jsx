import React from "react";
import defaultBg from "../../assets/hero-bg.jpg"; // фон по умолчанию

function PromoBanner({
  tag = "О платформе", // можно "Реклама" или другое
  title = "Поездки из города в город — ваш тариф",
  description = "Ознакомьтесь с сотнями междугородних маршрутов. Предложите свою цену и выберите одного из наших проверенных водителей.",
  link = "/about",
  buttonText = "Подробнее",
  image = defaultBg, // можно передавать кастомный фон
}) {
  return (
    <section className="py-20 bg-white">
      <div className="container-wide">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* контент */}
          <div className="relative z-10 px-8 sm:px-12 md:px-16 py-20 sm:py-28 text-white max-w-2xl">
            {/* тег */}
            <span className="inline-block bg-white/15 backdrop-blur-md border border-white/30 text-sm px-4 py-1 rounded-full mb-5">
              {tag}
            </span>

            {/* заголовок */}
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">
              {title}
            </h2>

            {/* описание */}
            <p className="text-base sm:text-lg text-gray-100 mb-8 leading-relaxed">
              {description}
            </p>

            {/* кнопка */}
            <a
              href={link}
              className="inline-block bg-[#32BB78] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#29a86b] transition"
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;

import React from "react";
import newsImg from "../../assets/hero-bg.jpg"; // временная картинка, потом заменишь на API или реальные изображения

function NewsSection() {
  const newsList = [
    {
      id: 1,
      title: "Manera запускает новую корпоративную платформу",
      description:
        "Агентство представило решение для бизнеса с интеграцией CRM, аналитики и автоматизацией процессов. Персональные кабинеты и гибкий дизайн уже доступны клиентам.",
      date: "5 сентября 2025",
      image: newsImg,
    },
    {
      id: 2,
      title: "Manera запускает новую корпоративную платформу",
      description:
        "Агентство представило решение для бизнеса с интеграцией CRM, аналитики и автоматизацией процессов. Персональные кабинеты и гибкий дизайн уже доступны клиентам.",
      date: "5 сентября 2025",
      image: newsImg,
    },
    {
      id: 3,
      title: "Manera запускает новую корпоративную платформу",
      description:
        "Агентство представило решение для бизнеса с интеграцией CRM, аналитики и автоматизацией процессов. Персональные кабинеты и гибкий дизайн уже доступны клиентам.",
      date: "5 сентября 2025",
      image: newsImg,
    },
  ];

  return (
    <section className=" bg-white">
      <div className="container-wide">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">Новости</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {newsList.map((item) => (
            <div key={item.id} className="flex flex-col">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-60 object-cover rounded-2xl mb-5"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-3 leading-snug">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                {item.description}
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

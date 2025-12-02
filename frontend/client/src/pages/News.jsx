import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import newsImg from "../assets/hero-bg.jpg"; // временное фото

const News = () => {
  const navigate = useNavigate();

  // временный список новостей
  const allNews = Array.from({ length: 34 }).map((_, i) => ({
    id: i + 1,
    title: "VOOM запускает новую систему безопасности",
    description:
      "Новая система повышает надежность поездок и улучшает опыт пользователей. Функции мониторинга и уведомлений теперь работают быстрее.",
    date: "12 ноября 2025",
    image: newsImg,
  }));

  const ITEMS_PER_PAGE = 9;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE);

  const paginatedNews = allNews.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Элементы пагинации
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <Header />

      <div className="container-wide py-16">

        {/* GRID 3×3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
          {paginatedNews.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/news/${item.id}`)}
              className="flex flex-col cursor-pointer group"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-60 object-cover rounded-2xl mb-5
                           group-hover:opacity-90 transition"
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

        {/* PAGINATION — новый современный стиль */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10 select-none">

            {/* В начало */}
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className={`text-xl px-2 ${
                page === 1 ? "opacity-30 cursor-not-allowed" : "hover:text-blue-600"
              }`}
            >
              «
            </button>

            {/* Назад */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`text-xl px-2 ${
                page === 1 ? "opacity-30 cursor-not-allowed" : "hover:text-blue-600"
              }`}
            >
              ‹
            </button>

            {/* НОМЕРА СТРАНИЦ */}
            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition
                  ${
                    page === num
                      ? "bg-[#32BB78] text-white font-semibold"
                      : "hover:bg-gray-200"
                  }`}
              >
                {num}
              </button>
            ))}

            {/* Вперёд */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`text-xl px-2 ${
                page === totalPages
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:text-blue-600"
              }`}
            >
              ›
            </button>

            {/* В конец */}
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className={`text-xl px-2 ${
                page === totalPages
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:text-blue-600"
              }`}
            >
              »
            </button>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
};

export default News;
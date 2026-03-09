import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import newsImg from "../../assets/hero-bg.jpg";

function NewsSection() {
  const { t } = useTranslation("home");

  const navigate = useNavigate();
  const { lang } = useParams();

  const [newsList, setNewsList] = useState([]);

  useEffect(() => {

    const fetchNews = async () => {

      try {

        const res = await fetch(`${API_URL}/api/news`);
        const data = await res.json();

        const latest = data.slice(0, 3);

        const prepared = latest.map((item) => {

          let firstImage = newsImg;
          let text = "";

          const parsed = item.content?.[lang] || item.content?.ru;

          if (parsed?.blocks?.length) {

            const imageBlock = parsed.blocks.find(
              (b) => b.type === "image"
            );

            if (imageBlock?.data?.file?.url) {
              firstImage = imageBlock.data.file.url;
            }

            text = parsed.blocks
              .map((b) => b.data?.text || "")
              .join(" ");
          }

          return {
            id: item._id,
            title: item.title?.[lang] || item.title?.ru,
            description: text,
            date: new Date(item.createdAt).toLocaleDateString(
              lang === "uz" ? "uz-UZ" : lang === "en" ? "en-US" : "ru-RU"
            ),
            image: firstImage
          };

        });

        setNewsList(prepared);

      } catch (err) {

        console.error("HOME NEWS ERROR", err);

      }

    };

    fetchNews();

  }, [lang]);

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
            <div
              key={item.id}
              onClick={() => navigate(`/${lang}/news/${item.id}`)}
              className="flex flex-col cursor-pointer group"
            >
              
              <img
                src={item.image || newsImg}
                alt={item.title}
                className="w-full h-60 object-cover rounded-2xl mb-5 
                           group-hover:opacity-90 transition"
              />

              <h3 className="text-lg sm:text-xl font-semibold mb-3 leading-snug line-clamp-2">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
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

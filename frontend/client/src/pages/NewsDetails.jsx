import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calendar, Eye, Loader2 } from "lucide-react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/SEO";
import { API_URL } from "../config/api";

const NewsDetails = () => {

  const navigate = useNavigate();
  const { id, lang } = useParams();
  const { t } = useTranslation("home");

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchNews = async () => {

      try {

        const res = await fetch(`${API_URL}/api/news/${id}`);
        const data = await res.json();

        setNews(data);

      } catch (err) {

        console.error("NEWS LOAD ERROR", err);

      } finally {

        setLoading(false);

      }

    };

    fetchNews();

  }, [id]);

  if (loading)
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-[#000] animate-spin" />
    </div>
  );

  if (!news) return null;

  const content = news.content?.[lang] || news.content?.ru;

  return (
    <>
      <SEO
        title={news.title?.[lang] || news.title?.ru}
        description={t("common.newsSeoDescription")}
        path={`/news/${id}`}
        lang={lang}
      />

      <Header />

      <div className="container-wide py-14 max-w-4xl">

        {/* TOP BAR */}

        <div className="flex items-center justify-between mb-8">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <ArrowLeft size={18} />
            {t("common.back")}
          </button>

          <div className="flex items-center gap-6 text-gray-500 text-sm">

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(news.createdAt).toLocaleDateString(
                lang === "uz" ? "uz-UZ" : lang === "en" ? "en-US" : "ru-RU"
              )}
            </div>

            <div className="flex items-center gap-2">
              <Eye size={16} />
              {news.views}
            </div>

          </div>

        </div>

        {/* TITLE */}

        <h1 className="text-3xl sm:text-4xl font-semibold mb-10 leading-tight">
          {news.title?.[lang] || news.title?.ru}
        </h1>

        {/* CONTENT */}

        <div className="space-y-6 text-gray-800 leading-relaxed text-lg">

          {content?.blocks?.map((block, index) => {

            if (block.type === "paragraph") {
              return (
                <p
                  key={index}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
              );
            }

            if (block.type === "image") {
              return (
                <img
                  key={index}
                  src={block.data?.file?.url}
                  alt=""
                  className="rounded-2xl w-full"
                />
              );
            }

            if (block.type === "header") {
              const Tag = `h${block.data.level}`;
              return (
                <Tag key={index} className="font-semibold mt-8">
                  {block.data.text}
                </Tag>
              );
            }

            return null;

          })}

        </div>

      </div>

      <Footer />
    </>
  );
};

export default NewsDetails;
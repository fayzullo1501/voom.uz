import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Eye, Loader2 } from "lucide-react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/SEO";
import { API_URL } from "../config/api";

const AdsDetails = () => {

  const navigate = useNavigate();
  const { id, lang } = useParams();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchAd = async () => {

      try {

        const res = await fetch(`${API_URL}/api/ads/${id}`);
        const data = await res.json();

        setAd(data);

      } catch (err) {

        console.error("AD LOAD ERROR", err);

      } finally {

        setLoading(false);

      }

    };

    fetchAd();

  }, [id]);

  if (loading)
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-[#000] animate-spin" />
    </div>
  );

  if (!ad) return null;

  const content = ad.content?.[lang] || ad.content?.ru;

  return (
    <>
      <SEO
        title={ad.title?.[lang] || ad.title?.ru}
        description="Реклама и предложения от партнёров VOOM"
        path={`/ads/${id}`}
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
            Назад
          </button>

          <div className="flex items-center gap-6 text-gray-500 text-sm">

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(ad.createdAt).toLocaleDateString(
                lang === "uz" ? "uz-UZ" : lang === "en" ? "en-US" : "ru-RU"
              )}
            </div>

            <div className="flex items-center gap-2">
              <Eye size={16} />
              {ad.views || 0}
            </div>

          </div>

        </div>

        {/* TITLE */}

        <h1 className="text-3xl sm:text-4xl font-semibold mb-10 leading-tight">
          {ad.title?.[lang] || ad.title?.ru}
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

            if (block.type === "list") {
              return (
                <ul key={index} className="list-disc pl-6 space-y-2">
                  {block.data.items.map((item, i) => (
                    <li
                      key={i}
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  ))}
                </ul>
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

export default AdsDetails;
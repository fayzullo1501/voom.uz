import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/layout/Header";
import { API_URL } from "../config/api";

const NewsPreview = () => {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {

        const res = await fetch(`${API_URL}/api/admin/news/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();

        setNews(data);

      } catch (err) {
        console.error("LOAD NEWS ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [id]);

  if (loading) {
    return (
      <>
        <PageHeader title="Просмотр новости" />
        <div className="p-10">Загрузка...</div>
      </>
    );
  }

  if (!news) {
    return (
      <>
        <PageHeader title="Просмотр новости" />
        <div className="p-10">Новость не найдена</div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Просмотр новости" />

      <div className="bg-white px-10 pt-8 pb-16 overflow-y-auto h-[calc(100vh-72px)]">

        <div className="max-w-[900px] mx-auto">

          {/* TITLE */}
          <h1 className="text-[36px] font-bold mb-6">
            {news.title?.ru}
          </h1>

          {/* CONTENT */}
          <div className="space-y-6">

            {news.content?.ru?.blocks?.map((block, index) => {

              if (block.type === "paragraph") {
                return (
                  <p key={index} className="text-[16px] leading-relaxed">
                    {block.data.text}
                  </p>
                );
              }

              if (block.type === "header") {
                return (
                  <h2 key={index} className="text-[24px] font-semibold">
                    {block.data.text}
                  </h2>
                );
              }

              if (block.type === "image") {
                return (
                  <img
                    key={index}
                    src={block.data.file.url}
                    alt=""
                    className="rounded-xl w-full"
                  />
                );
              }

              if (block.type === "list") {
                return (
                  <ul key={index} className="list-disc ml-6 space-y-2">
                    {block.data.items.map((item, i) => (
                      <li key={i}>
                        {typeof item === "string" ? item : item.content}
                      </li>
                    ))}
                  </ul>
                );
              }

              return null;

            })}

          </div>

        </div>

      </div>
    </>
  );
};

export default NewsPreview;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/layout/Header";

const DocsPage = () => {
  const { section, lang } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("docs");

  const sectionData = t(section, { returnObjects: true });
  const [activeId, setActiveId] = useState(null);

  if (!sectionData || !sectionData.items) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Раздел не найден</h2>
      </div>
    );
  }

  const items = Object.entries(sectionData.items);

  // scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      let currentId = null;

      items.forEach(([id]) => {
        const el = document.getElementById(id);
        if (!el) return;

        const rect = el.getBoundingClientRect();

        if (rect.top <= 120) {
          currentId = id;
        }
      });

      if (currentId) setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* HEADER */}
      <Header />

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 w-full px-10">
        
        {/* SIDEBAR */}
        <aside className="w-[300px] min-w-[300px] pr-4 border-r border-gray-200 h-[calc(100vh-64px)] sticky top-[64px] flex flex-col">
          
          {/* Sidebar Header */}
          <div className="px-5 py-4 border-b">
            <button
              onClick={() => navigate(`/${lang || "ru"}`)}
              className="text-sm text-gray-500 hover:text-black"
            >
              ← Домашняя страница
            </button>

            <h2 className="mt-3 font-semibold text-lg">
              {sectionData.title}
            </h2>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            {items.map(([id, item]) => (
              <button
                key={id}
                onClick={() => {
                  setActiveId(id);

                  const el = document.getElementById(id);
                  if (el) {
                    el.scrollIntoView({
                      behavior: "smooth",
                      block: "start"
                    });
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
                  ${
                    activeId === id
                      ? "bg-gray-100 text-black font-medium"
                      : "text-gray-500 hover:bg-gray-50 hover:text-black"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 px-12 py-8">
          <div className="max-w-3xl ml-8 space-y-16">
            
            {items.map(([id, item]) => (
              <section
                key={id}
                id={id}
                className="scroll-mt-24"
              >
                <h2 className="text-2xl font-semibold mb-4">
                  {item.label}
                </h2>

                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                <div className="mt-6 h-[1px] bg-gray-200" />
              </section>
            ))}

          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;
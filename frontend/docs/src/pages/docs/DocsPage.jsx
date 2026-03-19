import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/layout/Header";

const DocsPage = () => {
  const { section, lang } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("docs");

  const sectionData = t(section, { returnObjects: true });
  const [activeId, setActiveId] = useState(null);
  const mainRef = useRef(null);

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
    const container = mainRef.current;
    if (!container) return;

    const handleScroll = () => {
      let currentId = null;

      items.forEach(([id]) => {
        const el = document.getElementById(id);
        if (!el) return;

        const offsetTop = el.offsetTop;
        const scrollTop = container.scrollTop;

        if (offsetTop - scrollTop <= 150) {
          currentId = id;
        }
      });

      if (currentId) setActiveId(currentId);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [items]);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const el = document.getElementById(hash);

    if (el) {
      setTimeout(() => {
        container.scrollTo({
          top: el.offsetTop - 120,
          behavior: "smooth"
        });

        setActiveId(hash);
      }, 100);
    }
  }, [section, window.location.hash]);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      
      {/* HEADER */}
      <Header />

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 w-full px-10 overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-[300px] min-w-[300px] pr-4 border-r border-gray-200 flex flex-col overflow-hidden">
          
          {/* Sidebar Header */}
          <div className="px-5 py-4 border-b border-gray-200">
            <button
              onClick={() => navigate(`/${lang || "ru"}`)}
              className="text-sm text-gray-500 hover:text-black"
            >
              ← Домашняя страница
            </button>

            <h2 className="mt-3 font-semibold text-2xl">
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
                    const container = mainRef.current;

                    if (el && container) {
                      container.scrollTo({
                        top: el.offsetTop - 140,
                        behavior: "smooth"
                      });
                    }
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-base transition
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
        <main ref={mainRef} className="flex-1 px-12 py-8 overflow-y-auto">
          <div className="max-w-5xl ml-8 space-y-16">
            
            {items.map(([id, item]) => (
              <section
                key={id}
                id={id}
                className="scroll-mt-24"
              >
                <h2 className="text-2xl font-semibold mb-4">
                  {item.label}
                </h2>

               <div className="space-y-4">
                  {Array.isArray(item.content) ? (
                    item.content.map((block, idx) => {
                      if (block.type === "text") {
                        return (
                          <p
                            key={idx}
                            className="text-black leading-relaxed whitespace-pre-line"
                          >
                            {block.value}
                          </p>
                        );
                      }

                      if (block.type === "image") {
                        return (
                          <img
                            key={idx}
                            src={block.src}
                            alt={block.alt || ""}
                            className="w-full"
                          />
                        );
                      }

                      return null;
                    })
                  ) : (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  )}
                </div>

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
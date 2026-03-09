import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "../../config/api";
import defaultBg from "../../assets/about.jpg";
import { useNavigate, useParams } from "react-router-dom";

function PromoBanner() {

  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const { lang } = useParams();
  
  useEffect(() => {

    const loadAds = async () => {

      try {

        const res = await fetch(`${API_URL}/api/ads`);
        const data = await res.json();

        const prepared = data.map((ad) => {

          let image = defaultBg;

          const parsed = ad.content?.ru || ad.content?.uz || ad.content?.en;

          if (parsed?.blocks?.length) {

            const imageBlock = parsed.blocks.find(
              (b) => b.type === "image"
            );

            if (imageBlock && imageBlock.data && imageBlock.data.file) {
              image = imageBlock.data.file.url;
            }

          }

          return {
            id: ad._id,
            image
          };

        });

        setAds(prepared);

      } catch (err) {

        console.error("LOAD ADS ERROR", err);

      }

    };

    loadAds();

  }, []);

  const total = ads.length;

  const next = () => {
    setIndex((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {

    if (total <= 1) return;

    intervalRef.current = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(intervalRef.current);

  }, [total]);

  if (!ads.length) {
    return (
      <section className="pb-20 bg-white">
        <div className="container-wide">
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              backgroundImage: `url(${defaultBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "420px"
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 bg-white">

      <div className="container-wide">

        <div
          onClick={() => navigate(`/${lang}/ads/${ads[index].id}`)}
          className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[16/7] lg:aspect-[16/6] cursor-pointer"
          style={{
            backgroundImage: `url(${ads[index].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black/50" />

          {total > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-full transition"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-full transition"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {total > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">

              {Array.from({ length: Math.min(total, 3) }).map((_, i) => {

                let dotIndex = i;

                if (total > 3) {
                  dotIndex = (index + i) % total;
                }

                const active = dotIndex === index;

                return (
                  <button
                    key={i}
                    onClick={() => setIndex(dotIndex)}
                    className={`w-3 h-3 rounded-full transition ${
                      active ? "bg-white" : "bg-white/40"
                    }`}
                  />
                );

              })}

            </div>
          )}

        </div>

      </div>

    </section>
  );

}

export default PromoBanner;
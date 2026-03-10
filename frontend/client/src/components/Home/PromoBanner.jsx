import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";

function PromoBanner() {

  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const { lang } = useParams();
  
  useEffect(() => {

    const loadAds = async () => {

      try {

        const res = await fetch(`${API_URL}/api/ads`);
        const data = await res.json();

        const prepared = data.map((ad) => {

          let image = null;

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
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {

    if (total <= 1) return;

    intervalRef.current = setInterval(() => {
      next();
    }, 10000);

    return () => clearInterval(intervalRef.current);

  }, [total]);

  useEffect(() => {

    if (index === total) {

      setTimeout(() => {

        setTransition(false);
        setIndex(0);

        setTimeout(() => {
          setTransition(true);
        }, 50);

      }, 700);

    }

  }, [index, total]);

  if (!ads.length) {
    return (
      <section className="pb-20 bg-white">
        <div className="container-wide">
          <div className="relative rounded-3xl overflow-hidden aspect-[16/6] bg-gray-100" />
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 bg-white">

      <div className="container-wide">

        <div className="relative rounded-3xl overflow-hidden">
          <div
            className={`flex will-change-transform ${transition ? "transition-transform duration-700 ease-in-out" : ""}`}
            style={{
              transform: `translateX(-${index * 100}%)`
            }}
          >

            {ads.map((ad) => (
              <div
                key={ad.id}
                onClick={() => navigate(`/${lang}/ads/${ad.id}`)}
                className="min-w-full aspect-[16/6] cursor-pointer"
                style={{
                  backgroundImage: ad.image ? `url(${ad.image})` : "none",
                  backgroundColor: ad.image ? "transparent" : "#f3f4f6",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
            ))}

            <div
              key="clone"
              onClick={() => navigate(`/${lang}/ads/${ads[0].id}`)}
              className="min-w-full aspect-[16/6] cursor-pointer"
              style={{
                backgroundImage: `url(${ads[0].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />

          </div>
          <div className="absolute inset-0 pointer-events-none" />

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
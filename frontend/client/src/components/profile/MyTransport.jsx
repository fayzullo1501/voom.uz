import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import car1 from "../../assets/mycar1.jpg";
import car2 from "../../assets/mycar2.jpg";
import uzFlag from "../../assets/uz-flag.svg";

const MyTransport = () => {
  const navigate = useNavigate();
  const images = [car1, car2];
  const [index, setIndex] = useState(0);

  const prev = () => setIndex(index === 0 ? images.length - 1 : index - 1);
  const next = () => setIndex(index === images.length - 1 ? 0 : index + 1);

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">
      <header>
        <div className="container-wide flex items-center justify-end">
          <button onClick={() => navigate(-1)} className="p-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center">
            <X className="w-6 h-6 text-gray-700 hover:text-black transition" />
          </button>
        </div>
      </header>

      <h1 className="text-[32px] sm:text-[36px] font-semibold text-center mt-4">Мой транспорт</h1>

      <div className="mt-8 flex flex-col items-center">
        <div className="w-full max-w-[380px] min-h-[130px] border border-gray-200 rounded-2xl px-5 py-6 flex items-center justify-between hover:bg-gray-100 transition cursor-pointer">
          <div className="flex flex-col gap-4">
            <div className="text-[18px] font-semibold leading-tight">
              Chevrolet
              <br />
              Malibu 2 turbo
            </div>

            <div className="flex items-center gap-5 text-[14px] text-gray-700 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">2022</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-black" />
                <span className="font-medium">Черный</span>
              </div>

              <div className="flex items-center gap-2">
                <img src={uzFlag} alt="UZ" className="w-4 h-4" />
                <span className="font-medium tracking-wide">01 F 996 AA</span>
              </div>
            </div>
          </div>

          <ChevronRight className="w-6 h-6 text-black" />
        </div>

        <div className="relative mt-4 w-full max-w-[380px] h-[200px] sm:h-[220px]">
          <img src={images[index]} alt="car" className="w-full h-full object-cover rounded-2xl" />

          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/25 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/25 flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </div>

        <button onClick={() => {}} className="mt-4 text-[14px] text-red-500 cursor-pointer">
          Удалить транспорт
        </button>
      </div>
    </div>
  );
};

export default MyTransport;

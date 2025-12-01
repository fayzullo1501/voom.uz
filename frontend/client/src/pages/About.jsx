import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import bannerImg from "../assets/about-banner.jpg";

const About = () => {
  const { t } = useTranslation(["about"]);

  return (
    <>
      <Header />

      {/* Main Container */}
      <div className="w-full pb-20">

        {/* Banner */}
        <div className="w-full px-4 xl:px-20 mt-4">
          <div className="w-full h-[260px] md:h-[340px] lg:h-[420px] rounded-3xl overflow-hidden">
            <img
              src={bannerImg}
              alt="About VOOM"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="w-full px-4 xl:px-20 mt-20 grid grid-cols-1 md:grid-cols-2 gap-14">

          {/* LEFT SIDE */}
          <div className="flex flex-col gap-8 items-start text-left w-full">

            {/* Title */}
            <h1 className="text-[34px] md:text-[44px] font-bold text-gray-900 leading-[1.15]">
              voom.uz - карпулинг сервис
            </h1>

            {/* Subtitle + Button */}
            <div className="flex items-center gap-4 w-full">

              {/* Text block */}
              <div className="flex flex-col items-end text-right">
                <p className="text-[22px] text-gray-900 leading-relaxed">
                  Создаём удобную мобильность
                </p>

                <p className="mt-1 text-sm tracking-wider text-gray-400 uppercase">
                  Последние маршруты
                </p>
              </div>

              {/* Arrow Button */}
              <a
                href="#"
                className="flex items-center justify-center w-[70px] h-[70px]
                           border border-black rounded-xl hover:bg-black hover:text-white
                           transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7m0 0H9m8 0v8"
                  />
                </svg>
              </a>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6 text-[17px] leading-relaxed text-gray-800">

            <p className="font-semibold text-gray-900">
              voom помогает пассажирам, водителям и организациям улучшать мобильность и делать поездки удобнее, безопаснее и доступнее.
            </p>

            <p>
              Платформа voom создана компанией FAYKHANUR Enterprises Group LLC для развития транспортных инноваций в Узбекистане. voom объединяет решения для междугородних поездок, курьерской доставки и городского такси.
            </p>

            <ul className="list-disc ml-6 space-y-2">
              <li>
                voom intercity:
                <a href="https://voom.uz" className="underline ml-2">www.voom.uz</a>
              </li>
              <li>
                voom courier:
                <a href="https://courier.voom.uz" className="underline ml-2">courier.voom.uz</a>
              </li>
              <li>
                voom taxi:
                <a href="https://taxi.voom.uz" className="underline ml-2">taxi.voom.uz</a>
              </li>
            </ul>

            <p>
              Команда voom разрабатывает современные цифровые сервисы, улучшает качество перевозок и помогает пользователям экономить время и ресурсы. Мы стремимся сделать повседневные и дальние поездки комфортнее для каждого.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;

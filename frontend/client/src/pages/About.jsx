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
        <div className="container-wide mt-4">
          <div className="w-full h-[260px] md:h-[340px] lg:h-[420px] rounded-3xl overflow-hidden">
            <img
              src={bannerImg}
              alt="About VOOM"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="container-wide mt-20 grid grid-cols-1 md:grid-cols-2 gap-14">

          {/* LEFT SIDE */}
          <div className="flex flex-col gap-8 items-start text-left w-full">

            {/* Title */}
            <h1 className="text-[34px] md:text-[44px] font-bold text-gray-900 leading-[1.15]">
              {t("title")}
            </h1>

            {/* Subtitle + Button */}
            <div className="flex items-center gap-4 w-full">

              {/* Text block */}
              <div className="flex flex-col items-end text-right">
                <p className="text-[22px] text-gray-900 leading-relaxed">
                  {t("subtitle")}
                </p>

                <p className="mt-1 text-sm tracking-wider text-gray-400 uppercase">
                  {t("buttonLabel")}
                </p>
              </div>

              {/* Arrow Button */}
              <Link
                to="/routes"
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
              </Link>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6 text-[17px] leading-relaxed text-gray-800">

            <p className="font-semibold text-gray-900">
              {t("p1")}
            </p>

            <p>{t("p2")}</p>

            <ul className="list-disc ml-6 space-y-2">
              <li>
                {t("intercity")}
                <a href="https://voom.uz" className="underline ml-2" target="_blank">
                  www.voom.uz
                </a>
              </li>
              <li>
                {t("courier")}
                <a href="https://courier.voom.uz" className="underline ml-2" target="_blank">
                  courier.voom.uz
                </a>
              </li>
              <li>
                {t("taxi")}
                <a href="https://taxi.voom.uz" className="underline ml-2" target="_blank">
                  taxi.voom.uz
                </a>
              </li>
            </ul>

            <p>{t("p3")}</p>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;

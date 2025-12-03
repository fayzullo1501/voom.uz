import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";

import { FaInstagram, FaTelegramPlane, FaYoutube } from "react-icons/fa";

//
// FLOATING INPUT
//
const FloatingInput = ({ label, value, onChange }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="
          peer w-full h-[52px] px-4 pt-3 bg-gray-100 
          rounded-xl text-[16px] focus:outline-none
        "
      />

      <label
        className={`
          absolute left-4 text-gray-400 pointer-events-none 
          transition-all duration-200
          ${value ? "text-[11px] top-1" : "text-[16px] top-1/2 -translate-y-1/2"}
          peer-focus:text-[11px] peer-focus:top-2
        `}
      >
        {label}
      </label>
    </div>
  );
};

//
// FLOATING TEXTAREA
//
const FloatingTextarea = ({ label, value, onChange }) => {
  return (
    <div className="relative w-full">
      <textarea
        value={value}
        onChange={onChange}
        className="
          peer w-full bg-gray-100 rounded-xl px-4 pt-6 pb-3 h-[170px]
          text-[16px] resize-none focus:outline-none
        "
      />

      <label
        className={`
          absolute left-4 text-gray-400 pointer-events-none 
          transition-all duration-200
          ${value ? "text-[11px] top-2" : "text-[16px] top-6"}
          peer-focus:text-[11px] peer-focus:top-2
        `}
      >
        {label}
      </label>
    </div>
  );
};

//
// MAIN PAGE
//
const Contact = () => {
  const { t } = useTranslation("contact");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      <Header />

      <div className="w-full pb-20">

        {/* TITLE */}
        <div className="container-wide mt-16">
          <h1 className="text-[34px] md:text-[44px] font-bold text-gray-900 leading-[1.15]">
            {t("title")}
          </h1>
        </div>

        {/* MAIN CONTENT */}
        <div className="container-wide mt-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* LEFT BLOCK */}
          <div className="flex flex-col gap-6 text-left w-full">

            {/* Email */}
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[16px]">{t("emailLabel")}</p>
              <p className="text-[20px] font-medium">{t("email")}</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[16px]">{t("phoneLabel")}</p>
              <p className="text-[20px] font-medium">{t("phone")}</p>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[16px]">{t("addressLabel")}</p>

              <p className="text-[18px] leading-relaxed">
                {t("addressLine1")}<br />
                {t("addressLine2")}<br />
                {t("addressLine3")}
              </p>
            </div>

            {/* Social */}
            <div className="flex flex-col gap-3">
              <p className="text-gray-500 text-[16px]">{t("socialLabel")}</p>

              <div className="flex items-center gap-4">
                <a className="w-[40px] h-[40px] bg-gray-100 rounded-md flex items-center justify-center">
                  <FaInstagram size={20} />
                </a>

                <a className="w-[40px] h-[40px] bg-gray-100 rounded-md flex items-center justify-center">
                  <FaTelegramPlane size={20} />
                </a>

                <a className="w-[40px] h-[40px] bg-gray-100 rounded-md flex items-center justify-center">
                  <FaYoutube size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full flex flex-col gap-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatingInput
                label={t("form.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <FloatingInput
                label={t("form.phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <FloatingTextarea
              label={t("form.message")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              className="
                w-full bg-[#41B06E] text-white text-[16px] py-4 rounded-xl 
                hover:opacity-90 transition-all
              "
            >
              {t("form.submit")}
            </button>

          </div>
        </div>

        {/* MAP */}
        <div className="container-wide mt-20">
          <div className="w-full h-[400px] rounded-3xl overflow-hidden">
            <iframe
              src="https://yandex.com/map-widget/v1/?um=constructor%3A156dd88a4a4f89ae2e7f98eba52874159ad3278ae31010cfde7eed32783aa805&source=constructor"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
};

export default Contact;

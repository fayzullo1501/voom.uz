import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ArrowLeftRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";


import logo from "../../assets/logo.svg";
import bgImg from "../../assets/crroutebg.jpg";
import qrImg from "../../assets/crrouteqr.svg";

// Модалки
import DateTimeModal from "../../components/createRoute/DateTimeModal";
import SeatsModal from "../../components/createRoute/SeatsModal";
import PriceModal from "../../components/createRoute/PriceModal";
import CommentModal from "../../components/createRoute/CommentModal";

// -----------------------------
// FLOATING TEXT FIELD
// -----------------------------
const FloatingInput = ({ value, onChange, label }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="
          peer
          w-full h-[52px] px-4 pt-3 bg-gray-100 
          rounded-xl text-[16px]
          focus:outline-none
        "
      />

      <label
        className={`
          absolute left-4 text-gray-400 pointer-events-none
          transition-all duration-200
          ${value ? "text-[11px] top-1" : "text-[16px] top-1/2 -translate-y-1/2"}
          peer-focus:text-[11px] peer-focus:top-1
        `}
      >
        {label}
      </label>
    </div>
  );
};

// -----------------------------
// CLICKABLE FLOATING BUTTON FIELD
// -----------------------------
const FloatingButtonField = ({ value, label, onClick }) => {
  const hasValue = value && value.length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative w-full h-[52px] bg-gray-100
        rounded-xl px-4 text-left 
        focus:outline-none
      "
    >
      <div className="peer w-full h-full pt-3"></div>

      <label
        className={`
          absolute left-4 text-gray-400 pointer-events-none
          transition-all duration-200
          ${hasValue ? "text-[11px] top-1" : "text-[16px] top-1/2 -translate-y-1/2"}
          peer-focus:text-[11px] peer-focus:top-1
        `}
      >
        {label}
      </label>

      {hasValue && (
        <span
          className="
            absolute left-4 top-1/2 -translate-y-1/2 
            text-[16px] text-gray-900 pt-3 
            max-w-[85%] truncate text-ellipsis whitespace-nowrap
          "
        >
          {value}
        </span>
      )}
    </button>
  );
};

// -----------------------------
// MAIN PAGE
// -----------------------------
const CreateRoute = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation("createRoute");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [dateTime, setDateTime] = useState("");
  const [dateModalOpen, setDateModalOpen] = useState(false);

  const [seats, setSeats] = useState("");
  const cleanNumber = (val) => val.replace(/\D/g, "");
  const prepareSeatsForModal = (str) => {
    if (!str) return "";
    return str
      .split("|")
      .map((part) => cleanNumber(part.trim()))
      .filter(Boolean)
      .join(" | ");
  };

  const [seatsModalOpen, setSeatsModalOpen] = useState(false);

  const [price, setPrice] = useState("");
  const [priceModalOpen, setPriceModalOpen] = useState(false);

  const [comment, setComment] = useState("");
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const [agree, setAgree] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">

      {/* HEADER */}
      <header className="bg-white">
        <div className="container-wide flex items-center justify-between py-8">
          <img
            src={logo}
            alt="voom"
            className="h-6 cursor-pointer"
            onClick={() => navigate(`/${lang}`)}
          />
          <X
            className="w-6 h-6 text-gray-700 hover:text-black cursor-pointer transition"
            onClick={() => navigate(`/${lang}`)}
          />
        </div>
      </header>

      {/* MAIN */}
      <main
        className="flex items-center"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <div className="container-wide w-full">
          <div className="flex flex-col lg:flex-row justify-between w-full gap-6">

            {/* LEFT BLOCK */}
            <div className="w-full lg:w-1/2 max-w-[600px] self-center">

              <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

              <div className="flex flex-col gap-5">

                {/* MOBILE */}
                <div className="flex flex-col gap-5 lg:hidden">

                  <div className="flex gap-3 items-center">
                    <FloatingInput
                      label={t("from")}
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />

                    <button
                      type="button"
                      className="w-[52px] h-[52px] rounded-xl bg-gray-100 flex items-center justify-center"
                    >
                      <ArrowLeftRight size={20} />
                    </button>
                  </div>

                  <FloatingInput
                    label={t("to")}
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />

                  <FloatingButtonField
                    label={t("dateTime")}
                    value={dateTime}
                    onClick={() => setDateModalOpen(true)}
                  />

                  <FloatingButtonField
                    label={t("seats")}
                    value={seats}
                    onClick={() => setSeatsModalOpen(true)}
                  />

                  <FloatingButtonField
                    label={t("price")}
                    value={price}
                    onClick={() => setPriceModalOpen(true)}
                  />

                  <FloatingButtonField
                    label={t("comment")}
                    value={comment}
                    onClick={() => setCommentModalOpen(true)}
                  />

                </div>

                {/* DESKTOP */}
                <div className="hidden lg:flex flex-col gap-5">

                  <div className="flex gap-3 items-center w-full">
                    <FloatingInput
                      label={t("from")}
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />

                    <button
                      type="button"
                      className="min-w-[52px] min-h-[52px] rounded-xl bg-gray-100 flex items-center justify-center"
                    >
                      <ArrowLeftRight size={20} />
                    </button>

                    <FloatingInput
                      label={t("to")}
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <FloatingButtonField
                      label={t("dateTime")}
                      value={dateTime}
                      onClick={() => setDateModalOpen(true)}
                    />

                    <FloatingButtonField
                      label={t("seats")}
                      value={seats}
                      onClick={() => setSeatsModalOpen(true)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <FloatingButtonField
                      label={t("price")}
                      value={price}
                      onClick={() => setPriceModalOpen(true)}
                    />

                    <FloatingButtonField
                      label={t("comment")}
                      value={comment}
                      onClick={() => setCommentModalOpen(true)}
                    />
                  </div>

                </div>

                {/* AGREEMENT */}
                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <span className="text-gray-700 leading-snug">
                    {t("agreeText")}
                  </span>
                </label>

                {/* BUTTON */}
                <button
                  disabled={!agree}
                  className={`
                    w-full h-[54px] rounded-xl font-medium text-[16px]
                    text-white bg-[#32BB78]
                    transition
                    ${!agree && "opacity-50 cursor-not-allowed"}
                  `}
                >
                  {t("createBtn")}
                </button>

                {/* WARNING */}
                <div className="text-sm text-gray-700 leading-snug mt-1">
                  <b className="text-red-600">{t("important")}</b>{" "}

                  <Trans
                    t={t}
                    i18nKey="importantText"
                    components={{
                      link: (
                        <a
                          href="https://oldmy.gov.uz/ru/service/491"
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-blue-600"
                        />
                      )
                    }}
                  />

                  . {t("importantAfterLink")}
                </div>
              </div>
            </div>

            {/* RIGHT BLOCK */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div
                className="relative rounded-[32px] overflow-hidden shadow-lg w-full"
                style={{
                  maxWidth: "720px",
                  height: "100%",
                  maxHeight: "calc(100vh - 120px)"
                }}
              >
                <img src={bgImg} alt="banner" className="w-full h-full object-cover" />

                <div className="absolute left-6 right-6 bottom-6 bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row gap-4">
                  <img src={qrImg} alt="qr" className="w-[70px] h-[70px]" />
                  <div>
                    <p className="font-semibold text-[15px] leading-tight">
                      {t("bannerTitle")}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 leading-snug">
                      {t("bannerText")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* MODALS */}
      <DateTimeModal
        isOpen={dateModalOpen}
        initialValue={dateTime}
        onClose={() => setDateModalOpen(false)}
        onSave={(value) => setDateTime(value)}
      />

      <SeatsModal
        isOpen={seatsModalOpen}
        initialValue={prepareSeatsForModal(seats)}
        onClose={() => setSeatsModalOpen(false)}
        onSave={({ front, back }) => {
          const f = front > 0 ? `${front} ${front === 1 ? "место" : "места"}` : "";
          const b = back > 0 ? `${back} ${back === 1 ? "место" : "места"}` : "";
          const formatted = [f, b].filter(Boolean).join(" | ");
          setSeats(formatted);
        }}
      />

      <PriceModal
        isOpen={priceModalOpen}
        initialValue={price}
        onClose={() => setPriceModalOpen(false)}
        onSave={(value) => {
          const front = value.frontPrice ? `${value.frontPrice} сум` : "";
          const back = value.backPrice ? `${value.backPrice} сум` : "";
          const formatted = [front, back].filter(Boolean).join(" | ");
          setPrice(formatted);
        }}
      />

      <CommentModal
        isOpen={commentModalOpen}
        initialValue={comment}
        onClose={() => setCommentModalOpen(false)}
        onSave={(value) => setComment(value)}
      />

    </div>
  );
};

export default CreateRoute;
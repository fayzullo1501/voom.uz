import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ArrowLeftRight } from "lucide-react";

import logo from "../../assets/logo.svg";
import bgImg from "../../assets/crroutebg.jpg";
import qrImg from "../../assets/crrouteqr.svg";

// Модалки
import DateTimeModal from "../../components/createRoute/DateTimeModal";
import SeatsModal from "../../components/createRoute/SeatsModal";
import PriceModal from "../../components/createRoute/PriceModal";
import CommentModal from "../../components/createRoute/CommentModal";


/**
 * Текстовое поле с "плавающим" placeholder-ом
 * - текст 16px по центру, пока пусто
 * - при фокусе / наличии значения уезжает наверх как label
 */
const FloatingInput = ({ value, onChange, label }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const floated = focused || hasValue;

  return (
    <div className="relative w-full h-[52px]">
      <div className="absolute inset-0 bg-gray-100 rounded-xl px-4 flex items-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent outline-none text-[16px] ${
            floated ? "pt-3" : ""
          }`}
        />
      </div>

      <span
        className={`pointer-events-none absolute left-4 text-gray-400 transition-all duration-150 ${
          floated
            ? "top-1 text-[11px] translate-y-0"
            : "top-1/2 -translate-y-1/2 text-[16px]"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

/**
 * Кликабельное поле (для даты / мест) с таким же плавающим placeholder-ом
 */
const FloatingButtonField = ({ value, label, onClick }) => {
  const [activated, setActivated] = useState(false);
  const hasValue = value && value.length > 0;
  const floated = activated || hasValue;

  return (
    <button
      type="button"
      onClick={() => {
        setActivated(true);
        onClick && onClick();
      }}
      className="relative w-full h-[52px] bg-gray-100 rounded-xl px-4 text-left"
    >
      <span
        className={`pointer-events-none absolute left-4 text-gray-400 transition-all duration-150 ${
          floated
            ? "top-1 text-[11px] translate-y-0"
            : "top-1/2 -translate-y-1/2 text-[16px]"
        }`}
      >
        {label}
      </span>

      <div
        className={`w-full text-[16px] text-gray-900 ${
          floated ? "pt-3" : ""
        }`}
      >
        {hasValue ? value : ""}
      </div>
    </button>
  );
};

const CreateRoute = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [dateTime, setDateTime] = useState("");
  const [dateModalOpen, setDateModalOpen] = useState(false);

  const [seats, setSeats] = useState(""); // формата "1|2|2"
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
            alt="VOOM"
            className="h-6 cursor-pointer"
            onClick={() => navigate(`/${lang}`)}
          />
          <X
            className="w-6 h-6 text-gray-700 hover:text-black cursor-pointer transition"
            onClick={() => navigate(`/${lang}`)}
          />
        </div>
      </header>

      {/* MAIN: центрируем ВЕСЬ контент (левая форма + правый баннер) по вертикали */}
      <main
        className="flex items-center"
        style={{ minHeight: "calc(100vh - 96px)" }}
        >
        <div className="container-wide w-full">
          <div className="flex flex-col lg:flex-row justify-between w-full gap-6">
            {/* LEFT BLOCK */}
            <div className="w-full lg:w-1/2 max-w-[600px] self-center">
              <h1 className="text-3xl font-bold mb-8">Создать маршрут</h1>

              <div className="flex flex-col gap-5">
                {/* ------------ MOBILE VERSION ------------ */}
                <div className="flex flex-col gap-5 lg:hidden">
                  {/* Откуда + переключатель */}
                  <div className="flex gap-3 items-center">
                    <FloatingInput
                      label="Откуда"
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

                  {/* Куда */}
                  <FloatingInput
                    label="Куда"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />

                  {/* Дата и время */}
                  <FloatingButtonField
                    label="Дата и время"
                    value={dateTime}
                    onClick={() => setDateModalOpen(true)}
                  />

                  {/* Места */}
                  <FloatingButtonField
                    label="Места"
                    value={seats}
                    onClick={() => setSeatsModalOpen(true)}
                  />

                  {/* Цена */}
                  <FloatingButtonField
                    label="Цена"
                    value={price}
                    onClick={() => setPriceModalOpen(true)}
                  />


                  {/* Комментарий */}
                  <FloatingButtonField
                    label="Комментарий"
                    value={comment}
                    onClick={() => setCommentModalOpen(true)}
                  />


                </div>

                {/* ------------ DESKTOP VERSION ------------ */}
                <div className="hidden lg:flex flex-col gap-5">
                  {/* Row 1 */}
                  <div className="flex gap-3 items-center w-full">
                    <FloatingInput
                      label="Откуда"
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
                      label="Куда"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                  </div>

                  {/* Row 2 */}
                  <div className="flex gap-3">
                    <FloatingButtonField
                      label="Дата и время"
                      value={dateTime}
                      onClick={() => setDateModalOpen(true)}
                    />

                    <FloatingButtonField
                      label="Места"
                      value={seats}
                      onClick={() => setSeatsModalOpen(true)}
                    />
                  </div>

                  {/* Row 3 */}
                  <div className="flex gap-3">
                    <FloatingButtonField
                      label="Цена"
                      value={price}
                      onClick={() => setPriceModalOpen(true)}
                    />


                    <FloatingButtonField
                      label="Комментарий"
                      value={comment}
                      onClick={() => setCommentModalOpen(true)}
                    />

                  </div>
                </div>

                {/* CHECKBOX */}
                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <span className="text-gray-700 leading-snug">
                    Подтверждая, вы соглашаетесь, что полностью несёте ответственность
                    за маршрут. Платформа VOOM не является перевозчиком и не несёт
                    ответственности за действия водителей и пассажиров.
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
                  Создать маршрут
                </button>

                {/* WARNING */}
                <p className="text-sm text-gray-700 leading-snug mt-1">
                  <b className="text-red-600">Важно!</b>{" "}
                  voom рекомендует водителям зарегистрироваться как самозанятыми,
                  чтобы избежать вопросов контролирующих органов. Регистрация занимает
                  пару минут и доступна через сервис{" "}
                  <a
                    href="https://oldmy.gov.uz/ru/service/491"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    my.gov.uz
                  </a>. Консультация — по номеру <b>1242</b>.
                </p>
              </div>
            </div>

            {/* RIGHT BLOCK */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div
                className="relative rounded-[32px] overflow-hidden shadow-lg w-full"
                style={{
                    maxWidth: "720px",
                    height: "100%",
                    maxHeight: "calc(100vh - 120px)",
                }}

              >
                <img src={bgImg} alt="banner" className="w-full h-full object-cover" />

                <div className="absolute left-6 right-6 bottom-6 bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row gap-4">
                  <img src={qrImg} alt="qr" className="w-[70px] h-[70px]" />
                  <div>
                    <p className="font-semibold text-[15px] leading-tight">
                      Создавайте и управляйте маршрутами быстро!
                    </p>
                    <p className="text-gray-600 text-sm mt-1 leading-snug">
                      Сканируйте QR-код и пользуйтесь всеми функциями прямо с телефона.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Модалка даты */}
      <DateTimeModal
        isOpen={dateModalOpen}
        onClose={() => setDateModalOpen(false)}
        onSave={(value) => setDateTime(value)}
      />

      {/* Модалка мест */}
      <SeatsModal
        isOpen={seatsModalOpen}
        initialValue={seats}
        onClose={() => setSeatsModalOpen(false)}
        onSave={(value) => setSeats(value)}
      />

      <PriceModal
        isOpen={priceModalOpen}
        onClose={() => setPriceModalOpen(false)}
        onSave={(value) => {
          // value = { front, back, extra }
          // формируем красивую строку типа:
          // "100 000 / 80 000 / 80 000"
          const formatted = [
            value.front,
            value.back,
            value.extra,
          ].filter(Boolean).join(" | ");

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

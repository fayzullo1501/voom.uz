// src/pages/routes/RouteBooking.jsx
import React, { useState } from "react";
import { ChevronLeft, Wallet } from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import visaLogo from "../../assets/visa.png";
import masterLogo from "../../assets/mastercard.png";
import uzFlag from "../../assets/flag-uz.svg";


const RouteBooking = () => {
  const [activeField, setActiveField] = useState("");
  const [payType, setPayType] = useState("cash");
  const [phone, setPhone] = useState("");

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);

    let result = "";
    if (digits.length > 0) result += digits.slice(0, 2);
    if (digits.length > 2) result += " " + digits.slice(2, 5);
    if (digits.length > 5) result += " " + digits.slice(5, 7);
    if (digits.length > 7) result += " " + digits.slice(7, 9);

    return result;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container-wide pb-20 lg:pb-32">
        {/* HEADER */}
        <div className="relative flex items-center py-4 border-b border-gray-300">
          <button
            onClick={() => window.history.back()}
            className="absolute left-0 flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition lg:static lg:mr-4"
          >
            <ChevronLeft size={18} />
            <span className="hidden lg:inline ml-2 text-[15px] font-medium">
              Назад
            </span>
          </button>

          <div className="mx-auto text-[20px] lg:text-[36px] font-semibold text-center lg:text-left lg:mx-0">
            Забронировать
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 mt-6">
          {/* LEFT */}
          <div>
            <div className="text-[28px] lg:text-[32px] font-bold text-black mb-4">
              Информация для бронирования
            </div>

            <div className="flex flex-col gap-4">
              <input
                onFocus={() => setActiveField("name")}
                placeholder="Ваше Имя, Фамилия"
                className={`w-full h-[54px] rounded-xl px-4 text-[15px] outline-none border transition ${
                  activeField === "name"
                    ? "border-gray-300 border-1 text-black"
                    : "border-gray-300 text-gray-700"
                }`}
              />

              <label className="flex items-center gap-3 text-[15px] text-gray-600">
                <input type="checkbox" className="w-5 h-5 rounded-md" />
                Заказать другому человеку
              </label>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <input
                  onFocus={() => setActiveField("email")}
                  placeholder="Эл. почта (не обязательно)"
                  className={`h-[54px] rounded-xl px-4 border outline-none transition ${
                    activeField === "email"
                      ? "border-gray-300 border-1"
                      : "border-gray-300"
                  }`}
                />

                {/* PHONE */}
                <div
                  onClick={() => setActiveField("phone")}
                  className={`h-[54px] rounded-xl px-4 border flex items-center gap-2 cursor-text transition ${
                    activeField === "phone"
                      ? "border-gray-300 border-1"
                      : "border-gray-300"
                  }`}
                >
                  <img src={uzFlag} alt="UZ" className="w-5 h-5" />
                  <span className="text-[15px] text-gray-700 select-none">
                    +998
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    onFocus={() => setActiveField("phone")}
                    className="flex-1 outline-none text-[15px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <input
                  onFocus={() => setActiveField("from")}
                  placeholder="Откуда забрать"
                  className={`h-[54px] rounded-xl px-4 border outline-none transition ${
                    activeField === "from"
                      ? "border-gray-300 border-1"
                      : "border-gray-300"
                  }`}
                />
                <input
                  onFocus={() => setActiveField("to")}
                  placeholder="Куда доставить (не обязательно)"
                  className={`h-[54px] rounded-xl px-4 border outline-none transition ${
                    activeField === "to"
                      ? "border-gray-300 border-1"
                      : "border-gray-300"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <button className="h-[54px] rounded-xl px-4 border border-gray-300 flex justify-between items-center">
                  Переднее место
                  <span>›</span>
                </button>
                <button className="h-[54px] rounded-xl px-4 border border-gray-300 flex justify-between items-center">
                  Выберите кол-во мест
                  <span>›</span>
                </button>
              </div>

              <textarea
                placeholder="Заметка (не обязательное поле)"
                onFocus={() => setActiveField("message")}
                className={`h-[140px] rounded-xl px-4 py-3 border outline-none transition ${
                  activeField === "message"
                    ? "border-gray-300 border-1"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* PAYMENT */}
            <div className="mt-10">
              <div className="text-[28px] lg:text-[32px] font-bold mb-4">
                Выберите способ оплаты
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <button
                  onClick={() => setPayType("cash")}
                  className={`w-full h-[60px] rounded-xl px-5 flex items-center justify-between border transition ${
                    payType === "cash"
                      ? "border-2 border-[#32BB78] text-[#32BB78] font-semibold"
                      : "border-gray-300 text-black font-semibold"
                  }`}
                >
                  <span>Оплата наличными</span>
                  <Wallet size={20} />
                </button>

                <button
                  onClick={() => setPayType("card")}
                  className={`w-full h-[60px] rounded-xl px-5 flex items-center justify-between border transition ${
                    payType === "card"
                      ? "border-2 border-[#32BB78] text-[#32BB78] font-semibold"
                      : "border-gray-300 text-black font-semibold"
                  }`}
                >
                  <span>Банковская карта</span>
                  <div className="flex items-center gap-2">
                    <img src={masterLogo} alt="" className="h-6" />
                    <img src={visaLogo} alt="" className="h-6" />
                  </div>
                </button>
              </div>

              <div className="mt-3 text-[13px] text-gray-500">
                Оформляя это бронирование, вы принимаете{" "}
                <span className="underline cursor-pointer text-black">
                  Условия использования
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="lg:sticky lg:top-24">
              <div className="text-[28px] lg:text-[32px] font-bold text-black mb-4">
                Ваш заказ
              </div>

              <div className="border border-gray-300 rounded-xl p-4">
                <div className="font-semibold mb-3 text-[22px]">
                  Суббота, 12 Августа
                </div>

                <div className="grid grid-cols-[auto_24px_1fr] gap-3">
                  <div className="flex flex-col gap-[38px] text-[15px] font-medium">
                    <div>23:00</div>
                    <div>03:00</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-white" />
                    <div className="w-[2px] h-[52px] bg-black" />
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-white" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-[18px] font-bold">FERGHANA</div>
                      <div className="text-[14px] text-gray-500">
                        Ферганская область, Узбекистан
                      </div>
                    </div>
                    <div>
                      <div className="text-[18px] font-bold">TASHKENT</div>
                      <div className="text-[14px] text-gray-500">
                        Ташкентская область, Узбекистан
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 border border-gray-300 rounded-xl p-4">
                <div className="font-semibold mb-2 text-[22px]">
                  Стоимость за поездку
                </div>
                <div className="flex mt-6 border-t pt-5 border-gray-300 justify-between text-[18px]">
                  <span>Всего</span>
                  <span className="font-bold">132 000 сум</span>
                </div>
              </div>

              <button className="w-full h-[56px] mt-4 bg-[#32BB78] text-white rounded-xl text-[17px] font-semibold hover:bg-[#2aa86e] transition">
                Забронировать
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RouteBooking;

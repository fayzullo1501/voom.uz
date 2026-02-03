import React, { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";

import clickIcon from "../../assets/click.svg";
import paymeIcon from "../../assets/payme.svg";
import uzumIcon from "../../assets/uzum.svg";

const formatUZS = (value) => {
  if (!value) return "";
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " UZS";
};

const BalanceTopUp = () => {
  const navigate = useNavigate();

  const [method, setMethod] = useState("click");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!amount || Number(amount) < 1000) return;

    if (method !== "click") {
      alert("Данный способ оплаты пока недоступен");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/payment/click/init", {
        amount: Number(amount),
      });

      if (data?.payUrl) {
        window.location.href = data.payUrl;
      }
    } catch (e) {
      alert("Ошибка при инициализации платежа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 pb-10 flex flex-col">
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button className="p-2 rounded-full transition invisible" aria-hidden="true" tabIndex={-1}>
            <X size={24} />
          </button>
        </div>
      </header>

      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-[440px] flex items-center justify-center">
          <button onClick={() => navigate(-1)} className="absolute left-0 p-2 rounded-lg hover:bg-gray-100 transition">
            <ChevronLeft size={24} className="text-gray-800" />
          </button>

          <h1 className="text-[28px] sm:text-[32px] font-semibold text-center">Пополнение</h1>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-[440px] flex flex-col gap-8">
          <div>
            <p className="text-sm text-gray-700 mb-3">Детали платежа</p>

            <div className="flex gap-4">
              {[
                { id: "click", icon: clickIcon, disabled: false },
                { id: "payme", icon: paymeIcon, disabled: true },
                { id: "uzum", icon: uzumIcon, disabled: true },
              ].map((item) => {
                const selected = method === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!item.disabled) setMethod(item.id);
                    }}
                    disabled={item.disabled}
                    className={`w-[140px] h-[86px] rounded-2xl border flex items-center justify-center bg-white transition ${
                      selected ? "border-black" : "border-gray-200"
                    } ${item.disabled ? "opacity-90 cursor-not-allowed" : "hover:bg-gray-50"}`}
                  >
                    <img src={item.icon} className={`h-10 transition ${selected ? "opacity-100" : "opacity-35"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <input
              value={formatUZS(amount)}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              placeholder=" "
              className="peer w-full h-[56px] px-4 pr-11 pt-4 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-300"
            />

            <label className="absolute left-4 text-gray-500 pointer-events-none transition-all duration-200 top-4 text-[15px] peer-focus:top-1 peer-focus:text-[11px] peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-[11px]">
              Сумма платежа
            </label>

            {amount && (
              <button onClick={() => setAmount("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={submit}
              disabled={loading || !amount}
              className="min-w-[180px] px-10 py-3 rounded-xl text-white text-[16px] font-medium bg-[#32BB78] hover:bg-[#29a86b] transition disabled:opacity-50"
            >
              {loading ? "Переход к оплате..." : "Продолжить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceTopUp;

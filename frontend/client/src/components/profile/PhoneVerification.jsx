import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import uzFlag from "../../assets/uz-flag.svg";

import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import { useParams } from "react-router-dom";

const formatPhoneInput = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);

  const p1 = digits.slice(0, 2);
  const p2 = digits.slice(2, 5);
  const p3 = digits.slice(5, 7);
  const p4 = digits.slice(7, 9);

  return [p1, p2, p3, p4].filter(Boolean).join(" ");
};



const PhoneVerification = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const [phone, setPhone] = useState("");
  const [hasPhone, setHasPhone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/${lang}/login`);
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.phone) {
          setPhone(data.phone);
          setHasPhone(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [lang, navigate]);

  const sendCode = async () => {
    if (!phone || phone.length !== 9) return;

    const token = localStorage.getItem("token");
    setSending(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        setSending(false);
        return;
      }

      navigate(`/${lang}/profile/phone-code`, {
        state: {
          type: "phone",
          phone,
        },
      });
    } catch {
      setSending(false);
    }
  };


  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">

      {/* ===== Header (X) ===== */}
      <header>
        <div className="container-wide flex items-center justify-end">
           <button onClick={() => navigate(-1)} className=" p-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center ">
            <X className="w-6 h-6 text-gray-700 hover:text-black transition" />
          </button>
        </div>
      </header>

      {/* ===== Title ===== */}
      <h1 className="text-[28px] sm:text-[32px] font-semibold text-center mt-6 mb-10">
        Подтверждение тел. номера
      </h1>

      {/* ===== Content ===== */}
      <div className="flex-1 flex flex-col items-center text-center">

        {/* Phone block */}
        <div
          className="
            flex items-center gap-3
            px-4 py-3
            border border-gray-300
            rounded-xl
            mb-6
          "
        >
          <img
            src={uzFlag}
            alt="UZ"
            className="w-6 h-6 rounded-sm"
          />

          <div className="flex items-center gap-2">
            <span className="text-[18px] font-medium text-black select-none">
              +998
            </span>

            {hasPhone ? (
              <span className="text-[18px] font-medium text-black">
                {phone}
              </span>
            ) : (
              <input
                value={formatPhoneInput(phone)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                  setPhone(digits);
                }}
                placeholder="99 996 16 96"
                inputMode="numeric"
                className="w-[140px] text-[18px] font-medium outline-none placeholder:text-gray-400"
              />
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-[16px] max-w-[320px] mb-10">
          Мы отправим вам 4-значный код
          <br />
          по СМС для подтверждения.
        </p>

        {/* Button */}
        <button
          onClick={sendCode}
          disabled={sending}
          className="px-10 py-3 rounded-xl bg-[#32BB78] text-white text-[17px] font-medium hover:opacity-90 transition disabled:opacity-70"
        >
          {sending ? "Отправка..." : "Отправить код"}
        </button>
      </div>
    </div>
  );
};

export default PhoneVerification;

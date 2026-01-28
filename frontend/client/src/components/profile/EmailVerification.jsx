import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";

import googleIcon from "../../assets/auth/gmail.png";
import yandexIcon from "../../assets/auth/yandex.png";
import mailruIcon from "../../assets/auth/mailru.png";
import emailIcon from "../../assets/auth/gmail.png";

const getEmailIcon = (email) => {
  if (!email) return emailIcon;
  const domain = email.split("@")[1] || "";
  if (domain.includes("gmail")) return googleIcon;
  if (domain.includes("yandex")) return yandexIcon;
  if (domain.includes("mail.ru")) return mailruIcon;
  return emailIcon;
};

const EmailVerification = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const [email, setEmail] = useState("");
  const [hasEmail, setHasEmail] = useState(false);
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
        if (data.email) {
          setEmail(data.email);
          setHasEmail(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lang, navigate]);

  const sendCode = async () => {
    if (!email) return;

    const token = localStorage.getItem("token");
    setSending(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/send-email-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setSending(false);
        return;
      }

      navigate(`/${lang}/profile/phone-code`, {
        state: {
          type: "email",
          email,
        },
      });
    } catch {
      setSending(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">
      {/* Header */}
      <header>
        <div className="container-wide flex items-center justify-end">
          <button onClick={() => navigate(-1)} className="p-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center">
            <X className="w-6 h-6 text-gray-700 hover:text-black transition" />
          </button>
        </div>
      </header>

      {/* Title */}
      <h1 className="text-[28px] sm:text-[32px] font-semibold text-center mt-6 mb-10">
        Подтверждение email адреса
      </h1>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center text-center">
        {/* Email block */}
        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl mb-6">
          <img src={getEmailIcon(email)} alt="Email" className="w-6 h-6" />

          {hasEmail ? (
            <span className="text-[18px] font-medium text-black">{email}</span>
          ) : (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              type="email"
              className="text-[18px] font-medium outline-none placeholder:text-gray-400"
            />
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-[16px] max-w-[320px] mb-10">
          Мы отправим вам 6-значный код
          <br />
          на указанный адрес для подтверждения.
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

export default EmailVerification;

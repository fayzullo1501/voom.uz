import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.svg";
import { API_URL } from "../../config/api";

const formatPhoneView = (phone9) => {
  if (!phone9) return "";
  return `+998 ${phone9.slice(0, 2)} ${phone9.slice(2, 5)} ${phone9.slice(5, 7)} ${phone9.slice(7, 9)}`;
};

const RegisterConfirm = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("auth");

  const payload = location.state;

  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    if (!payload) navigate(`/${lang}/register`);
  }, [payload, navigate, lang]);

  useEffect(() => {
    if (timer === 0) return;
    const tmr = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(tmr);
  }, [timer]);

  const handleConfirm = async () => {
    if (loading) return;

    if (code.length < 4) {
      alert(t("confirm.errors.enterCode"));
      return;
    }

    try {
      setLoading(true);

      const url = payload.phone
        ? `${API_URL}/api/auth/verify-code`
        : `${API_URL}/api/auth/verify-email-code`;

      const body = payload.phone
        ? { phone: payload.phone, code }
        : { email: payload.email, code };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });


      const data = await res.json();

      if (!res.ok) {
        if (data.message === "invalid_code") {
          alert(t("confirm.errors.invalidCode"));
          return;
        }
        if (data.message === "code_expired") {
          alert(t("confirm.errors.expired"));
          return;
        }
        if (data.message === "too_many_attempts") {
          alert(t("confirm.errors.tooMany"));
          return;
        }
        alert(t("confirm.errors.general"));
        return;
      }

      navigate(`/${lang}/register/password`, {
        state: payload,
      });
    } catch {
      alert(t("errors.network"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;

    try {
      setResending(true);

      const url = payload.phone
        ? `${API_URL}/api/auth/send-code`
        : `${API_URL}/api/auth/send-email-code`;

      const body = payload.phone
        ? { phone: payload.phone }
        : { email: payload.email };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });


      if (!res.ok) {
        alert(t("confirm.errors.resendFailed"));
        return;
      }

      setTimer(60);
    } catch {
      alert(t("errors.network"));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="w-full max-w-[360px] px-4 sm:px-0 relative">

        {/* TOP BAR */}
        <div className="flex items-center justify-center mb-12 relative">
          <button onClick={() => navigate(-1)} className="absolute left-0 p-3 rounded-xl hover:bg-gray-100 transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <img src={logo} alt="VOOM" className="h-8" />
        </div>

        {/* CONTENT */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4">
            {payload?.phone ? t("confirm.titleSms") : t("confirm.titleEmail")}
          </h1>

          {payload?.phone && (
            <p className="text-black mb-8">
              {t("confirm.sentTo")} {formatPhoneView(payload.phone)}
            </p>
          )}

          {payload?.email && (
            <p className="text-black mb-8">
              {t("confirm.sentTo")} {payload.email}
            </p>
          )}


          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder={t("confirm.codePlaceholder")}
            className="w-full h-[56px] px-4 mb-6 rounded-xl text-[16px] border border-gray-300 text-left focus:outline-none focus:ring-1 focus:ring-gray-300"
          />

          {timer > 0 ? (
            <p className="text-gray-400 text-sm mb-6">
              {t("confirm.resendIn", { timer })}
            </p>
          ) : (
            <button onClick={handleResend} className="text-[#2f80ed] text-sm font-medium mb-6">
              {resending ? t("confirm.resending") : t("confirm.resend")}
            </button>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full text-white font-semibold py-3 px-8 rounded-xl bg-[#32BB78] hover:bg-[#29a86b] flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("confirm.confirmBtn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirm;
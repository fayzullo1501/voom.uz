// src/components/profile/ProfileConfirmCode.jsx
import React, { useEffect, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../config/api";
import logo from "../../assets/logo.svg";
import { useToast } from "../../components/ui/useToast";

const formatPhoneView = (phone9) => {
  if (!phone9) return "";
  return `+998 ${phone9.slice(0, 2)} ${phone9.slice(2, 5)} ${phone9.slice(5, 7)} ${phone9.slice(7, 9)}`;
};

const ProfileConfirmCode = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation("auth");
  const { showToast } = useToast();

  const payload = location.state;

  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    if (!payload) navigate(`/${lang}/profile/menu`, { replace: true });
  }, [payload, navigate, lang]);

  useEffect(() => {
    if (timer === 0) return;
    const tmr = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(tmr);
  }, [timer]);

  const handleConfirm = async () => {
    if (loading) return;

    if (code.length < 4) {
      showToast(t("confirm.errors.enterCode"), "error");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const url =
        payload.type === "phone"
        ? `${API_URL}/api/auth/profile/phone/verify`
        : `${API_URL}/api/auth/profile/email/verify`;


      const body =
        payload.type === "phone"
            ? { code } // телефон уже берётся из user
            : { email: payload.email, code };


      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "invalid_code") {
          showToast(t("confirm.errors.invalidCode"), "error");
          return;
        }
        if (data.message === "code_expired") {
          showToast(t("confirm.errors.expired"), "error");
          return;
        }
        if (data.message === "too_many_attempts") {
          showToast(t("confirm.errors.tooMany"), "error");
          return;
        }
        showToast(t("confirm.errors.general"), "error");
        return;
      }

      showToast(
        payload.type === "phone"
          ? t("confirm.successPhone")
          : t("confirm.successEmail"),
        "success"
      );

      navigate(`/${lang}/profile/menu`, { replace: true });
    } catch {
      showToast(t("errors.network"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;

    setResending(true);

    try {
      const token = localStorage.getItem("token");

      const url =
        payload.type === "phone"
          ? `${API_URL}/api/auth/send-code`
          : `${API_URL}/api/auth/send-email-code`;

      const normalizePhone9 = (value) =>
        value ? value.replace(/\D/g, "").slice(-9) : "";

      const body =
        payload.type === "phone"
          ? { phone: normalizePhone9(payload.phone) }
          : { email: payload.email };


      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        showToast(t("confirm.errors.resendFailed"), "error");
        return;
      }

      showToast(t("confirm.resendSuccess"), "success");
      setTimer(60);
    } catch {
      showToast(t("errors.network"), "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="w-full max-w-[360px] px-4 relative">
        <div className="flex items-center justify-center mb-10 relative">
          <button onClick={() => navigate(-1)} className="absolute left-0 p-3 rounded-xl hover:bg-gray-100 transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <img src={logo} alt="VOOM" className="h-8" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            {payload?.type === "phone" ? "Подтверждение телефона" : "Подтверждение почты"}
          </h1>

          {payload?.type === "phone" && (
            <p className="text-black mb-8">
              Код отправлен на {formatPhoneView(payload.phone)}
            </p>
          )}

          {payload?.type === "email" && (
            <p className="text-black mb-8">
              Код отправлен на {payload.email}
            </p>
          )}

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder={t("confirm.codePlaceholder")}
            className="w-full h-[56px] px-4 mb-6 rounded-xl text-[16px] border border-gray-300 focus:outline-none"
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

export default ProfileConfirmCode;

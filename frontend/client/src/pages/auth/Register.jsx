import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "../../components/ui/useToast";


import logo from "../../assets/logo.svg";
import googleIcon from "../../assets/auth/google.svg";
import facebookIcon from "../../assets/auth/facebook.svg";
import uzFlag from "../../assets/uz-flag.svg";
import { API_URL } from "../../config/api";

/* ===== helpers ===== */

const formatPhone = (value) => {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  digits = digits.slice(0, 9);

  let res = "+998";
  if (digits.length > 0) res += " " + digits.slice(0, 2);
  if (digits.length > 2) res += " " + digits.slice(2, 5);
  if (digits.length > 5) res += " " + digits.slice(5, 7);
  if (digits.length > 7) res += " " + digits.slice(7, 9);

  return res;
};

const getPhoneDigits = (value) => {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  return digits;
};

const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

const Register = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("auth");
  const { showToast } = useToast();


  useEffect(() => {
    if (lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const [tab, setTab] = useState("phone");
  const [phone, setPhone] = useState("+998 ");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (loading) return;

    let payload = {};

    if (tab === "phone") {
      const digits = getPhoneDigits(phone);
      if (digits.length !== 9) {
        showToast(t("errors.invalidPhone"), "error");
        return;
      }
      payload.phone = digits;
    }

    if (tab === "email") {
      if (!isEmail(email)) {
        showToast(t("errors.invalidEmail"), "error");
        return;
      }
      payload.email = email.trim().toLowerCase();
    }

    try {
      setLoading(true);

      const checkRes = await fetch(`${API_URL}/api/auth/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (checkRes.status === 409) {
        showToast(t("errors.accountExists"), "error");
        setLoading(false);
        return;
      }

      if (!checkRes.ok) {
        showToast(t("errors.checkFailed"), "error");
        setLoading(false);
        return;
      }

      if (payload.phone) {
        const smsRes = await fetch(`${API_URL}/api/auth/send-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: payload.phone }),
        });

        if (!smsRes.ok) {
          showToast(t("errors.smsFailed"), "error");
          setLoading(false);
          return;
        }
      }

      if (payload.email) {
        const emailRes = await fetch(`${API_URL}/api/auth/send-email-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: payload.email }),
        });

        if (!emailRes.ok) {
          showToast(t("errors.emailFailed"), "error");
          setLoading(false);
          return;
        }
      }

      navigate(`/${lang}/register/confirm`, { state: payload });
    } catch {
      showToast(t("errors.network"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="bg-white">
        <div className="container-wide flex items-center justify-between py-8">
          <img src={logo} alt="VOOM" className="h-10 cursor-pointer" onClick={() => navigate(`/${lang}`)} />
          <button onClick={() => navigate(`/${lang}`)} className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center">
            <X className="w-6 h-6 text-gray-700 hover:text-black transition" />
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-[360px] text-center px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-8">{t("registerTitle")}</h1>

          <div className="flex flex-col gap-4 mb-10">
            <button className="w-full h-[48px] border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition text-[15px]">
              <img src={googleIcon} className="w-5 h-5" />
              {t("loginGoogle")}
            </button>
            <button className="w-full h-[48px] border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition text-[15px]">
              <img src={facebookIcon} className="w-5 h-5" />
              {t("loginFacebook")}
            </button>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          <div className="flex border border-gray-200 bg-gray-100 rounded-xl p-1 mb-6">
            <button onClick={() => setTab("phone")} className={`flex-1 h-[44px] rounded-lg text-[15px] font-medium transition ${tab === "phone" ? "bg-white shadow text-black" : "text-gray-500"}`}>
              {t("tabs.phone")}
            </button>
            <button onClick={() => setTab("email")} className={`flex-1 h-[44px] rounded-lg text-[15px] font-medium transition ${tab === "email" ? "bg-white shadow text-black" : "text-gray-500"}`}>
              {t("tabs.email")}
            </button>
          </div>

          {tab === "phone" && (
            <div className="relative mb-8">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                <img src={uzFlag} className="w-6 h-6 object-contain" />
              </div>
              <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} className="w-full h-[56px] pl-12 pr-10 border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:ring-gray-300" />
              {phone !== "+998 " && <X size={20} onClick={() => setPhone("+998 ")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" />}
            </div>
          )}

          {tab === "email" && (
            <div className="relative mb-8">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-[56px] px-4 border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:ring-gray-300" placeholder={t("emailPlaceholder")} />
              {email && <X size={20} onClick={() => setEmail("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" />}
            </div>
          )}

          <button onClick={handleNext} disabled={loading} className="w-full text-white font-semibold py-3 px-8 rounded-xl bg-[#32BB78] hover:bg-[#29a86b] flex items-center justify-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("next")}
          </button>

          <div className="flex flex-col items-center gap-3 text-sm mt-8">
            <p className="text-gray-600 uppercase tracking-wide">
              {t("alreadyAccount")}{" "}
              <Link to={`/${lang}/login`} className="text-black underline font-medium">
                {t("loginLink")}
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 py-8 px-4">
        {t("termsFooter")}
      </footer>
    </div>
  );
};

export default Register;

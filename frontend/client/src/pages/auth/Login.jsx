// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "../../components/ui/useToast";
import { useUser } from "../../context/UserContext";


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

const Login = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("auth");
  const { showToast } = useToast();
  const { refreshUser } = useUser();


  useEffect(() => {
    if (lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const [tab, setTab] = useState("phone");
  const [phone, setPhone] = useState("+998 ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    if (!password) {
      showToast(t("password.errors.general"), "error");
      return;
    }

    payload.password = password;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "invalid_credentials") {
          showToast(t("errors.invalidCredentials"), "error");
          return;
        }
        showToast(t("errors.network"), "error");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      await refreshUser();   // 🔥 ВАЖНО

      showToast(t("success.loginSuccess"), "success");

      navigate(`/${lang}/profile/menu`);

    } catch {
      showToast(t("errors.network"));
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
        <div className="w-full max-w-[360px] px-4 sm:px-0 text-center">

          <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
            {t("title")}
          </h1>

          <div className="flex flex-col gap-4 mb-8">
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-8">

            {tab === "phone" && (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                  <img src={uzFlag} className="w-6 h-6 object-contain" />
                </div>
                <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} className="w-full h-[56px] pl-12 pr-10 border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:ring-gray-300" />
                {phone !== "+998 " && <X size={20} onClick={() => setPhone("+998 ")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" />}
              </div>
            )}

            {tab === "email" && (
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-[56px] px-4 border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:ring-gray-300" placeholder={t("emailPlaceholder")} />
                {email && <X size={20} onClick={() => setEmail("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" />}
              </div>
            )}

            <div className="relative">
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="peer w-full h-[56px] px-4 pt-4 border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:ring-gray-300" />
              <label className={`absolute left-4 pointer-events-none text-gray-500 transition-all duration-200 ${password ? "text-[11px] top-1" : "text-[15px] top-4"} peer-focus:text-[11px] peer-focus:top-1`}>
                {t("password.password")}
              </label>
              {password && (
                <>
                  <X size={20} onClick={() => setPassword("")} className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" />
                  <div onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600">
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#32BB78] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#29a86b] flex items-center justify-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("loginBtn")}
            </button>
          </form>

          <div className="flex flex-col items-center gap-3 text-sm">
            <Link to={`/${lang}/forgot-password`} className="text-gray-700 hover:text-black underline uppercase tracking-wide">
              {t("forgotPassword")}
            </Link>
            <p className="text-gray-600 uppercase tracking-wide">
              {t("noAccount")}{" "}
              <Link to={`/${lang}/register`} className="text-black underline font-medium">
                {t("createAccount")}
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

export default Login;

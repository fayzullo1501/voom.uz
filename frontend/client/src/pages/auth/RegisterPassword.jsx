// src/pages/auth/RegisterPassword.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import logo from "../../assets/logo.svg";
import { API_URL } from "../../config/api";

const RegisterPassword = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("auth");

  const payload = location.state;

  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    if (!payload) navigate(`/${lang}/register`);
  }, [payload, navigate, lang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (password.length < 6) {
      alert(t("password.errors.tooShort"));
      return;
    }

    if (password !== repeat) {
      alert(t("password.errors.notMatch"));
      return;
    }

    try {
      setLoading(true);

      const body = payload.phone
        ? { phone: payload.phone, password }
        : { email: payload.email, password };

      const res = await fetch(`${API_URL}/api/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });


      const data = await res.json();

      if (!res.ok) {
        alert(data.message || t("password.errors.general"));
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(`/${lang}/profile/menu`);
    } catch {
      alert(t("errors.network"));
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl sm:text-3xl font-semibold mb-8">
            {t("password.title")}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div className="relative">
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-300" />
              <label className={`absolute left-4 pointer-events-none text-gray-500 transition-all duration-200 ${password ? "text-[11px] top-1" : "text-[15px] top-4"} peer-focus:text-[11px] peer-focus:top-1`}>
                {t("password.password")}
              </label>
              {password && <div onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600">{showPass ? <EyeOff size={20} /> : <Eye size={20} />}</div>}
            </div>

            <div className="relative">
              <input type={showPass ? "text" : "password"} value={repeat} onChange={(e) => setRepeat(e.target.value)} className="peer w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-300" />
              <label className={`absolute left-4 pointer-events-none text-gray-500 transition-all duration-200 ${repeat ? "text-[11px] top-1" : "text-[15px] top-4"} peer-focus:text-[11px] peer-focus:top-1`}>
                {t("password.repeat")}
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full text-white font-semibold py-3 px-8 rounded-xl bg-[#32BB78] hover:bg-[#29a86b] flex items-center justify-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("password.submit")}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPassword;

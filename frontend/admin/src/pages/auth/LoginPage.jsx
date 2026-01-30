// src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import uzFlag from "../../assets/flag-uz.svg";
import { API_URL } from "../../config/api";

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 7));
  if (digits.length > 7) parts.push(digits.slice(7, 9));
  return parts.join(" ");
};

const LoginPage = () => {
  const [phoneRaw, setPhoneRaw] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (phoneRaw.length !== 9 || !password) {
      setError("Введите номер телефона и пароль");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneRaw, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Неверный номер или пароль");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard", { replace: true });
    } catch {
      setError("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[360px] px-4 text-center">
          <img src={logo} alt="VOOM" className="h-10 mx-auto mb-6" />
          <h1 className="text-[26px] font-semibold mb-8">Вход в личный кабинет</h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-5 mb-6">
            {/* PHONE */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <img src={uzFlag} alt="UZ" className="w-5 h-5 rounded-sm" />
                <span className="text-[15px] text-gray-700">+998</span>
              </div>

              <input
                type="tel"
                inputMode="numeric"
                value={formatPhone(phoneRaw)}
                onChange={(e) => setPhoneRaw(e.target.value.replace(/\D/g, ""))}
                className="w-full h-[56px] pl-[96px] pr-10 rounded-xl bg-gray-100 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-300"
              />

              {phoneRaw && (
                <X
                  size={20}
                  onClick={() => setPhoneRaw("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                />
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full h-[56px] px-4 pt-4 pr-20 rounded-xl bg-gray-100 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <label className={`absolute left-4 pointer-events-none text-gray-500 transition-all duration-200 ${password ? "text-[11px] top-1" : "text-[15px] top-4"} peer-focus:text-[11px] peer-focus:top-1`}>
                Пароль
              </label>

              {password && (
                <>
                  <X
                    size={20}
                    onClick={() => setPassword("")}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  />
                  <div
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </>
              )}
            </div>

            {error && <div className="text-[14px] text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-black text-white rounded-xl text-[17px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={22} className="animate-spin" /> : "Войти"}
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-[18px] text-gray-600">
        © 2026 Группа компаний FAYKHANUR Enterprises Group
      </footer>
    </div>
  );
};

export default LoginPage;

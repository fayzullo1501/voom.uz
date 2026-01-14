// src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();


  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* CENTER BLOCK */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[360px] px-4 text-center">
          <img src={logo} alt="VOOM" className="h-10 mx-auto mb-6" />

          <h1 className="text-[26px] font-semibold mb-8">
            Вход в личный кабинет
          </h1>

          <div className="flex flex-col gap-5 mb-6">
            {/* LOGIN */}
            <div className="relative">
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="peer w-full h-[56px] px-4 pt-4 pr-10 rounded-xl bg-gray-100 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-300"
              />

              <label className={`absolute left-4 pointer-events-none text-gray-500 transition-all duration-200 ${login ? "text-[11px] top-1" : "text-[15px] top-4"} peer-focus:text-[11px] peer-focus:top-1`}>
                Логин
              </label>

              {login && (
                <X size={20} onClick={() => setLogin("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" />
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
                  <X size={20} onClick={() => setPassword("")} className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" />
                  <div onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600">
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </>
              )}
            </div>
          </div>

          <button onClick={() => { localStorage.setItem("admin_auth", "true"); navigate("/dashboard"); }} className="w-full h-[52px] bg-black text-white rounded-xl text-[17px] font-semibold">
            Войти
          </button>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-[18px] text-gray-600">
        © 2026 Группа компаний FAYKHANUR Enterprises Group
      </footer>
    </div>
  );
};

export default LoginPage;

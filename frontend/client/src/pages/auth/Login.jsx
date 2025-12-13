import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { X, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

// Icons
import logo from "../../assets/logo.svg";
import googleIcon from "../../assets/auth/google.svg";
import facebookIcon from "../../assets/auth/facebook.svg";

const Login = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("auth");

  useEffect(() => {
    if (lang) i18n.changeLanguage(lang);
  }, [lang]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">

      {/* HEADER */}
      <header className="bg-white">
        <div className="container-wide flex items-center justify-between py-8">
          
          <img
            src={logo}
            alt="VOOM"
            className="h-10 cursor-pointer"
            onClick={() => navigate(`/${lang}`)}
          />

          <button onClick={() => navigate(`/${lang}`)} className=" p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center ">
            <X className="w-6 h-6 text-gray-700 hover:text-black transition" />
          </button>

        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-[360px] text-center px-4 sm:px-0">

            <h1 className="text-2xl sm:text-3xl font-semibold mb-8">
              {t("title")}
            </h1>

            {/* SOCIAL */}
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

            {/* FORM */}
            <form className="flex flex-col gap-5 mb-8">

              {/* EMAIL / PHONE */}
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    peer
                    w-full h-[56px] px-4 pt-4 bg-gray-100 
                    rounded-xl text-[15px]
                    focus:outline-none focus:ring-2 focus:ring-gray-300
                  "
                />

                <label
                  className={`
                    absolute left-4 pointer-events-none text-gray-500
                    transition-all duration-200
                    ${email ? "text-[11px] top-1" : "text-[15px] top-4"}
                    peer-focus:text-[11px] peer-focus:top-1
                  `}
                >
                  {t("emailOrPhone")}
                </label>

                {email.length > 0 && (
                  <X
                    size={20}
                    onClick={() => setEmail("")}
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
                  className="
                    peer
                    w-full h-[56px] px-4 pt-4 bg-gray-100 
                    rounded-xl text-[15px]
                    focus:outline-none focus:ring-2 focus:ring-gray-300
                  "
                />

                <label
                  className={`
                    absolute left-4 pointer-events-none text-gray-500
                    transition-all duration-200
                    ${password ? "text-[11px] top-1" : "text-[15px] top-4"}
                    peer-focus:text-[11px] peer-focus:top-1
                  `}
                >
                  {t("password")}
                </label>

                {password !== "" && (
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

              {/* BUTTON */}
              <button
                type="submit"
                className="bg-[#32BB78] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#29a86b]"
              >
                {t("loginBtn")}
              </button>

            </form>

            {/* LINKS */}
            <div className="flex flex-col items-center gap-3 text-sm">
              <Link
                to={`/${lang}/forgot-password`}
                className="text-gray-700 hover:text-black underline uppercase tracking-wide"
              >
                {t("forgotPassword")}
              </Link>

              <p className="text-gray-600 uppercase tracking-wide">
                {t("noAccount")}{" "}
                <Link
                  to={`/${lang}/register`}
                  className="text-black underline font-medium"
                >
                  {t("createAccount")}
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-500 py-8 px-4">
        {t("termsFooter")}
      </footer>

    </div>
  );
};

export default Login;

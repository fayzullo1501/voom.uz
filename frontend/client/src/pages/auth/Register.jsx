import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { X, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

// Images
import logo from "../../assets/logo.svg";
import googleIcon from "../../assets/auth/google.svg";
import facebookIcon from "../../assets/auth/facebook.svg";

const Register = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("auth");

  useEffect(() => {
    if (lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const [phone, setPhone] = useState("+998 ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // FORMAT PHONE
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // only digits

    // Remove repeated 998
    if (val.startsWith("998")) {
      val = val.substring(3);
    }

    // max 9 digits
    val = val.substring(0, 9);

    let formatted = "+998 ";

    if (val.length > 0) formatted += val.substring(0, 2);
    if (val.length > 2) formatted += " " + val.substring(2, 5);
    if (val.length > 5) formatted += " " + val.substring(5, 7);
    if (val.length > 7) formatted += " " + val.substring(7, 9);

    setPhone(formatted);
  };

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
              {t("registerTitle")}
            </h1>

            {/* SOCIAL */}
            <div className="flex flex-col gap-4 mb-10">
              <button className="w-full h-[48px] border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50">
                <img src={googleIcon} className="w-5 h-5" />
                {t("loginGoogle")}
              </button>

              <button className="w-full h-[48px] border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50">
                <img src={facebookIcon} className="w-5 h-5" />
                {t("loginFacebook")}
              </button>
            </div>

            <div className="border-t border-gray-200 my-8"></div>

            {/* FORM */}
            <form className="flex flex-col gap-5 mb-8">

              {/* PHONE — NO FLOATING LABEL */}
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="
                    w-full h-[56px] px-4 bg-gray-100 rounded-xl
                    text-[15px] tracking-wide
                    focus:outline-none focus:ring-2 focus:ring-gray-300
                  "
                />

                {/* Clear phone */}
                {phone.trim() !== "+998" && (
                  <X
                    size={20}
                    onClick={() => setPhone("+998 ")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  />
                )}
              </div>

              {/* EMAIL + FLOATING LABEL */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    peer
                    w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-xl
                    text-[15px]
                    focus:outline-none focus:ring-2 focus:ring-gray-300
                  "
                />

                <label
                  className={`
                    absolute left-4 text-gray-500 pointer-events-none
                    transition-all
                    ${email ? "text-[11px] top-1" : "text-[15px] top-4"}
                    peer-focus:text-[11px] peer-focus:top-1
                  `}
                >
                  {t("email")}
                </label>

                {email !== "" && (
                  <X
                    size={20}
                    onClick={() => setEmail("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  />
                )}
              </div>

              {/* PASSWORD + FLOATING LABEL */}
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    peer
                    w-full h-[56px] px-4 pt-4 bg-gray-100 rounded-xl
                    text-[15px]
                    focus:outline-none focus:ring-2 focus:ring-gray-300
                  "
                />

                <label
                  className={`
                    absolute left-4 text-gray-500 pointer-events-none
                    transition-all
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                    >
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </>
                )}
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full text-white font-semibold py-3 px-8 rounded-xl bg-[#32BB78] hover:bg-[#29a86b]"
              >
                {t("registerBtn")}
              </button>

            </form>

            {/* LINKS */}
            <div className="flex flex-col items-center gap-3 text-sm">
              <p className="text-gray-600 uppercase tracking-wide">
                {t("alreadyAccount")}{" "}
                <Link
                  to={`/${lang}/login`}
                  className="text-black underline font-medium"
                >
                  {t("loginLink")}
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

export default Register;

import React, { useState } from "react";
import { useTranslation } from "react-i18next";  // ← добавлено

function RequestForm() {
  const { t } = useTranslation("home");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    from: "",
    to: "",
    date: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert(t("request.alertAgree"));
      return;
    }
    console.log("Отправлено:", form);
    alert(t("request.alertSuccess"));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container-wide">
        <div className="bg-black text-white rounded-3xl px-10 sm:px-14 py-16 flex flex-col lg:flex-row justify-between gap-10 lg:gap-20 items-start">
          
          {/* LEFT SIDE */}
          <div className="flex-1">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              {t("request.titleLine1")} <br /> {t("request.titleLine2")}
            </h2>

            <p className="text-gray-300 text-lg max-w-md leading-relaxed">
              {t("request.subtitle")}
            </p>
          </div>

          {/* RIGHT SIDE — FORM */}
          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("request.name")}
                  className="p-4 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition"
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t("request.phone")}
                  className="p-4 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition"
                  required
                />

                <input
                  type="text"
                  name="from"
                  value={form.from}
                  onChange={handleChange}
                  placeholder={t("request.from")}
                  className="p-4 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition"
                  required
                />

                <input
                  type="text"
                  name="to"
                  value={form.to}
                  onChange={handleChange}
                  placeholder={t("request.to")}
                  className="p-4 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition"
                  required
                />

                <input
                  type="text"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder={t("request.date")}
                  className="p-4 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-[#32BB78] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#29a86b] transition"
                >
                  {t("request.submit")}
                </button>
              </div>

              {/* CHECKBOX */}
              <label className="flex items-start gap-2 text-gray-400 text-sm mt-2">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-white"
                  required
                />
                <span>
                  {t("request.agreeText")}{" "}
                  <a href="#" className="underline text-white hover:text-gray-300">
                    {t("request.privacyPolicy")}
                  </a>
                  .
                </span>
              </label>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

export default RequestForm;

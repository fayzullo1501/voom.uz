import React, { useState } from "react";

function RequestForm() {
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
      alert("Пожалуйста, подтвердите согласие на обработку данных.");
      return;
    }
    console.log("Отправлено:", form);
    alert("Заявка отправлена! Наш водитель скоро с вами свяжется.");
  };

  return (
    <section className="py-20 bg-white">
      <div className="container-wide">
        <div className="bg-black text-white rounded-3xl px-10 sm:px-14 py-16 flex flex-col lg:flex-row justify-between gap-10 lg:gap-20 items-start">
          
          {/* Левая часть */}
          <div className="flex-1">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Не нашли <br /> подходящего маршрута?
            </h2>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed">
              Оставьте заявку, и совсем скоро вам позвонит водитель по вашему маршруту.
            </p>
          </div>

          {/* Правая часть — форма */}
          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* 3 строки по 2 поля */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Имя */}
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Имя"
                  className="p-4 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition"
                  required
                />

                {/* Телефон */}
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Телефон"
                  className="p-4 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition"
                  required
                />

                {/* Откуда */}
                <input
                  type="text"
                  name="from"
                  value={form.from}
                  onChange={handleChange}
                  placeholder="Откуда"
                  className="p-4 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition"
                  required
                />

                {/* Куда */}
                <input
                  type="text"
                  name="to"
                  value={form.to}
                  onChange={handleChange}
                  placeholder="Куда"
                  className="p-4 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition"
                  required
                />

                {/* Дата */}
                <input
                  type="text"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="Дата"
                  className="p-4 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition"
                  required
                />

                {/* Кнопка отправить — теперь рядом с датой */}
                <button
                  type="submit"
                  className="w-full bg-[#32BB78] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#29a86b] transition"
                >
                  Отправить
                </button>
              </div>

              {/* Чекбокс согласия */}
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
                  Отправляя заявку, вы даёте согласие на обработку своих персональных данных в соответствии с{" "}
                  <a href="#" className="underline text-white hover:text-gray-300">
                    политикой конфиденциальности
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

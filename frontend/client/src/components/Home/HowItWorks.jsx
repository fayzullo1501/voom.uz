import React from "react";
import howImg from "../../assets/hero-bg.jpg"; // замени на нужное изображение

function HowItWorks() {
  const steps = [
    {
      title: "Введите данные для поиска",
      desc: "Укажите города отправления и назначения, а также желаемую дату поездки.",
    },
    {
      title: "Выберите понравившийся маршрут или водителя",
      desc: "Просмотрите предложения водителей и выберите подходящий по цене и времени выезда.",
    },
    {
      title: "Забронируйте место",
      desc: "Подтвердите бронирование и ожидайте подтверждения от водителя.",
    },
    {
      title: "Водитель вам позвонит. Хорошей поездки!",
      desc: "После подтверждения водитель свяжется с вами для уточнения деталей поездки.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="container-wide">
        {/* Заголовок */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-14 text-gray-900">
          Как работает платформа <span className="text-gray-900">VOOM?</span>
        </h2>

        {/* Контент */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-10">
          {/* Фото */}
          <div className="flex-1 w-full flex justify-center lg:justify-start">
            <img
              src={howImg}
              alt="Как работает VOOM"
              className="w-full max-w-[700px] h-[450px] object-cover rounded-2xl shadow-sm"
            />
          </div>

          {/* Шаги */}
          <div className="flex-1 w-full flex flex-col justify-center">
            <ol className="space-y-8">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#32BB78] text-white flex items-center justify-center text-lg font-semibold mt-1">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

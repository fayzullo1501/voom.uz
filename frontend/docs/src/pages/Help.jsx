import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  Shield,
  Map,
  Route,
  Car,
  Users,
  CarFront,
  Wallet
} from "lucide-react";

const sections = [
  {
    title: "Начало работы",
    icon: BookOpen,
    key: "start"
  },
  {
    title: "Профиль и верификация",
    icon: Shield,
    key: "profile"
  },
  {
    title: "Поездки и бронирование",
    icon: Map,
    key: "trips"
  },
  {
    title: "Создание маршрутов",
    icon: Route,
    key: "routes"
  },
  {
    title: "Водителям",
    icon: Car,
    key: "drivers"
  },
  {
    title: "Пассажирам",
    icon: Users,
    key: "passengers"
  },
  {
    title: "Мои автомобили",
    icon: CarFront,
    key: "cars"
  },
  {
    title: "Оплата и сервис",
    icon: Wallet,
    key: "payments"
  }
];

const Help = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  return (
    <div className="bg-white min-h-screen px-6 py-10">
      
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-semibold mb-8">
          Справочный центр
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.key}
                onClick={() => navigate(`/${lang || "ru"}/docs/${section.key}`)}
                className="cursor-pointer border rounded-2xl p-5 hover:shadow-md transition bg-white"
              >
                <Icon className="w-6 h-6 mb-3 text-gray-700" />

                <h3 className="font-medium text-gray-900">
                  {section.title}
                </h3>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
};

export default Help;
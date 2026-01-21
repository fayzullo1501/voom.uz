// src/pages/Dashboard.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Users, Route, Wallet, Calendar, MoreHorizontal, MoreVertical } from "lucide-react";
import PageHeader from "../components/layout/Header";
import clickLogo from "../assets/click.svg";
import paymeLogo from "../assets/payme.svg";
import uzFlag from "../assets/flag-uz.svg";

const chartData = [
  { name: "Январь", value: 120 },
  { name: "Февраль", value: 220 },
  { name: "Март", value: 260 },
  { name: "Апрель", value: 180 },
  { name: "Май", value: 210 },
  { name: "Июнь", value: 90 },
  { name: "Июль", value: 170 },
  { name: "Август", value: 300 },
  { name: "Сентябрь", value: 230 },
  { name: "Октябрь", value: 200 },
  { name: "Ноябрь", value: 140 },
  { name: "Декабрь", value: 190 },
];

const Dashboard = () => {
  return (
    <>
      <PageHeader title="Статистика" />

      <div className="px-8 pt-6 pb-10 bg-[#F9FAFB] min-h-[calc(100vh-72px)] flex flex-col overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[24px] font-semibold">Добро пожаловать Fayzullo Abdulazizov</div>
            <div className="text-[14px] text-gray-500">Администратор</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 h-[40px] px-4 rounded-xl border border-gray-300 text-[14px] bg-white">
              <Calendar size={16} />
              12 Января 2026
            </div>
            <button className="flex items-center gap-2 h-[40px] px-4 rounded-xl bg-black text-white text-[14px] font-medium hover:bg-gray-800 transition">
              <Download size={16} />
              Экспорт
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {/* LEFT / FINANCE */}
          <div className="col-span-4 bg-white rounded-2xl p-6 flex flex-col">
            <div className="flex flex-col h-full">
              {/* TOP */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[15px] font-medium">
                    <Wallet size={18} />
                    Общий баланс
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <img src={uzFlag} alt="UZ" className="h-4" />
                    UZS
                  </div>
                </div>

                <div className="text-[26px] font-semibold">123 240 590.00 сум</div>

                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[13px] font-medium">
                  +3.2%
                  <span className="text-gray-600 font-normal">чем прошлый год</span>
                </div>

                <button className="mt-4 flex items-center gap-2 bg-[#32BB78] text-white rounded-xl h-[40px] px-4 text-[14px] font-medium hover:bg-[#2aa86e] transition">
                  Скачать отчет
                </button>
              </div>

              {/* AGGREGATORS */}
              <div className="mt-auto pt-6">
                <div className="text-[15px] font-semibold mb-4">Агрегаторы</div>

                <div className="flex flex-col gap-3">
                  <div className="bg-gray-50 rounded-2xl p-4 relative">
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>

                    <img src={clickLogo} alt="Click" className="h-[26px] mb-2" />
                    <div className="text-[18px] font-semibold">100 120 590 сум</div>
                    <div className="text-[13px] text-green-600">Активный</div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 relative">
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>

                    <img src={paymeLogo} alt="Payme" className="h-[26px] mb-2" />
                    <div className="text-[18px] font-semibold">23 120 000 сум</div>
                    <div className="text-[13px] text-green-600">Активный</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-8 flex flex-col gap-6">
            {/* STATS */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <div className="text-[15px] font-medium">Пользователи</div>
                  </div>
                  <MoreHorizontal size={18} className="text-gray-400" />
                </div>
                <div className="text-[26px] font-semibold">1 000 123</div>
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[13px] font-medium">
                  +3.2%
                  <span className="text-gray-600 font-normal">чем прошлый год</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Route size={18} />
                    <div className="text-[15px] font-medium">Поездки</div>
                  </div>
                  <MoreHorizontal size={18} className="text-gray-400" />
                </div>
                <div className="text-[26px] font-semibold">1 000 123</div>
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[13px] font-medium">
                  +3.2%
                  <span className="text-gray-600 font-normal">чем прошлый год</span>
                </div>
              </div>
            </div>

            {/* CHART */}
            <div className="bg-white rounded-2xl p-6 h-[380px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-semibold">
                  <Wallet size={16} />
                  Отчет по доходам
                </div>
                <div className="flex items-center gap-4 text-[13px] text-gray-500">
                  Тякущий год
                  <MoreHorizontal size={18} />
                </div>
              </div>

              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} height={40} tickFormatter={(value) => value.slice(0, 3)} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => [`${value}`, "Маршруты"]} cursor={{ fill: "#ddddddff", radius: [8, 8, 8, 8] }} />
                    <Bar dataKey="value" radius={[8, 8, 8, 8]} fill="#32BB78" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

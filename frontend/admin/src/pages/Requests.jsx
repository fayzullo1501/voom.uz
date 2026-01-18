// src/pages/Requests.jsx
import { useState } from "react";
import Checkbox from "../components/ui/Checkbox";
import { Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import PageHeader from "../components/layout/Header";

/* based on Users.jsx :contentReference[oaicite:0]{index=0} */

/* ---------- MOCK DATA (40 REQUESTS) ---------- */
const STATUSES = ["Создан", "Принят водителем", "В пути", "Завершен", "Отменен"];
const TYPES = ["Поездка", "Доставка"];

const REQUESTS = Array.from({ length: 40 }, (_, i) => {
  const type = TYPES[i % 2];
  return {
    id: `req-${String(i + 1).padStart(4, "0")}`,
    from: i % 3 === 0 ? "Ташкент, Узбекистан" : "Фергана, Узбекистан",
    to: i % 3 === 0 ? "Фергана, Узбекистан" : "Ташкент, Узбекистан",
    type,
    tripDate: "18.01.2026 14:30",
    payload: type === "Поездка" ? `${(i % 4) + 1} пассажир(а)` : `Посылка #${i + 1}`,
    createdAt: "18.01.2026 10:12",
    status: STATUSES[i % STATUSES.length],
  };
});

const PER_PAGE = 20;

const Requests = () => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(REQUESTS.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const visible = REQUESTS.slice(start, end);

  return (
    <>
      <PageHeader title="Заявки" />

      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button onClick={() => console.log("ADD")} className="h-[42px] px-5 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition">
              Добавить
            </button>
            <button onClick={() => console.log("EDIT")} disabled className="h-[42px] px-5 rounded-lg border border-gray-600 text-gray-600 text-[14px] font-medium bg-gray-100 hover:bg-gray-200 transition">
              Изменить
            </button>
            <button onClick={() => console.log("CANCEL")} disabled className="h-[42px] px-5 rounded-lg border border-red-600 text-red-600 text-[14px] font-medium bg-red-100 hover:bg-red-200 transition">
              Отменить
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Поиск..." className="h-[42px] w-[240px] pl-10 pr-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none" />
            </div>
            <button className="h-[42px] w-[42px] flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] text-[13px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-3 w-[48px] text-left">
                    <Checkbox />
                  </th>
                  <th className="px-3 py-3 w-[56px] text-left">№</th>
                  <th className="px-3 py-3 w-[120px] text-left">ID</th>
                  <th className="px-3 py-3 w-[220px] text-left">Откуда</th>
                  <th className="px-3 py-3 w-[220px] text-left">Куда</th>
                  <th className="px-3 py-3 w-[140px] text-left">Тип</th>
                  <th className="px-3 py-3 w-[170px] text-left">Дата поездки</th>
                  <th className="px-3 py-3 w-[260px] text-left">Пассажиры / Доставка</th>
                  <th className="px-3 py-3 w-[170px] text-left">Дата создания</th>
                  <th className="px-3 py-3 w-[180px] text-left">Статус</th>
                </tr>
              </thead>

              <tbody>
                {visible.map((r, i) => (
                  <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-3 py-3">
                      <Checkbox />
                    </td>
                    <td className="px-3 py-3">{start + i + 1}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{r.id}</td>
                    <td className="px-3 py-3">{r.from}</td>
                    <td className="px-3 py-3">{r.to}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{r.type}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{r.tripDate}</td>
                    <td className="px-3 py-3">{r.payload}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{r.createdAt}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setPage(1)} disabled={page === 1} className={`p-2 ${page === 1 ? "opacity-30" : "hover:text-[#32BB78]"}`}>
              <ChevronsLeft size={20} />
            </button>

            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={`p-2 ${page === 1 ? "opacity-30" : "hover:text-[#32BB78]"}`}>
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`w-11 h-11 rounded-xl text-[16px] transition ${page === n ? "bg-[#32BB78] text-white font-semibold" : "hover:bg-gray-100"}`}>
                {n}
              </button>
            ))}

            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`p-2 ${page === totalPages ? "opacity-30" : "hover:text-[#32BB78]"}`}>
              <ChevronRight size={20} />
            </button>

            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className={`p-2 ${page === totalPages ? "opacity-30" : "hover:text-[#32BB78]"}`}>
              <ChevronsRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Requests;

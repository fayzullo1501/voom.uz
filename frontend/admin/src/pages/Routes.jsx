// src/pages/Routes.jsx
import { useState } from "react";
import Checkbox from "../components/ui/Checkbox";
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import PageHeader from "../components/layout/Header";

/* ---------- MOCK DATA (40 ROUTES) ---------- */
const ROUTES = Array.from({ length: 40 }, (_, i) => ({
  id: `route-${i + 1}`,
  driver: `Водитель ${i + 1}`,
  from: i % 2 === 0 ? "FERGHANA" : "TASHKENT",
  to: i % 2 === 0 ? "TASHKENT" : "FERGHANA",
  passengers: (i % 4) + 1,
  departDate: "13.01.2026 21:00",
  createdAt: "22.07.2025",
}));

const PER_PAGE = 20;

const Routes = () => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(ROUTES.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const visible = ROUTES.slice(start, end);

  return (
    <>
      <PageHeader title="Маршруты" />

      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">
        {/* ACTIONS */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button className="h-[42px] px-5 rounded-lg border border-red-600 text-red-600 text-[14px] font-medium bg-red-100 hover:bg-red-200 transition">
              Удалить
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

        {/* TABLE */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-[13px]">
            <thead className="bg-gray-50 text-gray-500">
                <tr>
                <th className="px-3 py-3 w-[48px] text-left">
                    <Checkbox />
                </th>
                <th className="px-3 py-3 w-[48px] text-left">№</th>
                <th className="px-3 py-3 w-[90px] text-left">ID</th>
                <th className="px-3 py-3 w-[160px] text-left">ФИО водителя</th>
                <th className="px-3 py-3 w-[120px] text-left">Откуда</th>
                <th className="px-3 py-3 w-[120px] text-left">Куда</th>
                <th className="px-3 py-3 w-[110px] text-left">Пассажиры</th>
                <th className="px-3 py-3 w-[140px] text-left">Дата выезда</th>
                <th className="px-3 py-3 w-[130px] text-left">Дата создания</th>
                <th className="px-3 py-3 w-[48px]"></th>
                </tr>
            </thead>

            <tbody>
                {visible.map((r, i) => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-3 py-3">
                    <Checkbox />
                    </td>
                    <td className="px-3 py-3">{start + i + 1}</td>
                    <td className="px-3 py-3 text-gray-600">{r.id}</td>
                    <td className="px-3 py-3 font-medium">{r.driver}</td>
                    <td className="px-3 py-3">{r.from}</td>
                    <td className="px-3 py-3">{r.to}</td>
                    <td className="px-3 py-3">{r.passengers}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{r.departDate}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{r.createdAt}</td>
                    <td className="px-3 py-3">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition">
                        <Eye size={16} />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>


        {/* PAGINATION */}
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

export default Routes;

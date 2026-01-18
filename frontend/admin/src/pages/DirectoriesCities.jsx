// src/pages/DirectoriesCities.jsx
import { useState } from "react";
import Checkbox from "../components/ui/Checkbox";
import { Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCcw } from "lucide-react";
import PageHeader from "../components/layout/Header";

/* ---------- MOCK DATA (40 CITIES) ---------- */
const CITIES = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  ru: i === 0 ? "г. Ташкент" : `Город ${i + 1}`,
  uzLat: i === 0 ? "Toshkent sh." : `City ${i + 1}`,
  uzCyr: i === 0 ? "Тошкент ш." : `Город ${i + 1}`,
  en: i === 0 ? "Tashkent c." : `City ${i + 1}`,
  region: i === 0 ? "Ташкент" : "Регион",
  country: "UZ",
  coords: "41.26465, 69.21627",
  population: `${900000 + i * 1000}`,
  priority: 110 - (i % 5) * 10,
  status: "Активен",
}));

const PER_PAGE = 20;

const DirectoriesCities = () => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(CITIES.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const visible = CITIES.slice(start, end);

  return (
    <>
      <PageHeader title="Города" />

      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button className="h-[42px] px-5 rounded-lg border border-gray-300 text-gray-700 text-[14px] font-medium hover:bg-gray-100 transition flex items-center gap-2">
              <RefreshCcw size={16} />
              Обновить
            </button>
            <button className="h-[42px] px-5 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition">
              Добавить
            </button>
            <button disabled className="h-[42px] px-5 rounded-lg border border-gray-600 text-gray-600 text-[14px] font-medium bg-gray-100 hover:bg-gray-200 transition">
              Изменить
            </button>
            <button disabled className="h-[42px] px-5 rounded-lg border border-red-600 text-red-600 text-[14px] font-medium bg-red-100 hover:bg-red-200 transition">
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

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1600px] text-[13px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-3 w-[48px] text-left">
                    <Checkbox />
                  </th>
                  <th className="px-3 py-3 w-[60px] text-left">№</th>
                  <th className="px-3 py-3 w-[180px] text-left">RU</th>
                  <th className="px-3 py-3 w-[180px] text-left">UZ LAT</th>
                  <th className="px-3 py-3 w-[180px] text-left">UZ CYR</th>
                  <th className="px-3 py-3 w-[160px] text-left">EN</th>
                  <th className="px-3 py-3 w-[260px] text-left">Регион</th>
                  <th className="px-3 py-3 w-[90px] text-left">Страна</th>
                  <th className="px-3 py-3 w-[200px] text-left">Координаты</th>
                  <th className="px-3 py-3 w-[120px] text-left">Нас.</th>
                  <th className="px-3 py-3 w-[90px] text-left">Приор.</th>
                  <th className="px-3 py-3 w-[120px] text-left">Статус</th>
                </tr>
              </thead>

              <tbody>
                {visible.map((c, i) => (
                  <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-3 py-3">
                      <Checkbox />
                    </td>
                    <td className="px-3 py-3">{start + i + 1}</td>
                    <td className="px-3 py-3">{c.ru}</td>
                    <td className="px-3 py-3">{c.uzLat}</td>
                    <td className="px-3 py-3">{c.uzCyr}</td>
                    <td className="px-3 py-3">{c.en}</td>
                    <td className="px-3 py-3">{c.region}</td>
                    <td className="px-3 py-3">{c.country}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{c.coords}</td>
                    <td className="px-3 py-3">{c.population}</td>
                    <td className="px-3 py-3">{c.priority}</td>
                    <td className="px-3 py-3">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[13px] font-medium">
                        {c.status}
                      </span>
                    </td>
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

export default DirectoriesCities;

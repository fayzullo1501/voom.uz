// src/pages/DirectoriesCarModels.jsx
import { useState } from "react";
import Checkbox from "../components/ui/Checkbox";
import { Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import PageHeader from "../components/layout/Header";

/* ---------- MOCK DATA (40 MODELS) ---------- */
const MODELS = Array.from({ length: 40 }, (_, i) => ({
  id: `model-${String(i + 1).padStart(3, "0")}`,
  brand: `Марка ${((i % 10) + 1)}`,
  model: `Модель ${i + 1}`,
  logo: "https://via.placeholder.com/40x40?text=Logo",
  createdAt: "18.01.2026",
  status: i % 4 === 0 ? "inactive" : "active",
}));

const PER_PAGE = 20;

const DirectoriesCarModels = () => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(MODELS.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const visible = MODELS.slice(start, end);

  return (
    <>
      <PageHeader title="Модели автомобилей" />

      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
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
            <table className="w-full min-w-[1100px] text-[13px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-3 w-[48px] text-left">
                    <Checkbox />
                  </th>
                  <th className="px-3 py-3 w-[60px] text-left">№</th>
                  <th className="px-3 py-3 w-[160px] text-left">ID</th>
                  <th className="px-3 py-3 w-[220px] text-left">Марка</th>
                  <th className="px-3 py-3 w-[260px] text-left">Модель</th>
                  <th className="px-3 py-3 w-[140px] text-left">Логотип</th>
                  <th className="px-3 py-3 w-[160px] text-left">Дата создания</th>
                  <th className="px-3 py-3 w-[140px] text-left">Статус</th>
                </tr>
              </thead>

              <tbody>
                {visible.map((m, i) => (
                  <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-3 py-3">
                      <Checkbox />
                    </td>
                    <td className="px-3 py-3">{start + i + 1}</td>
                    <td className="px-3 py-3 text-gray-600">{m.id}</td>
                    <td className="px-3 py-3">{m.brand}</td>
                    <td className="px-3 py-3">{m.model}</td>
                    <td className="px-3 py-3">
                      <img src={m.logo} alt={m.brand} className="h-8 w-8 object-contain" />
                    </td>
                    <td className="px-3 py-3">{m.createdAt}</td>
                    <td className="px-3 py-3">
                      {m.status === "active" ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[13px] font-medium">
                          Активный
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-[13px] font-medium">
                          Неактивный
                        </span>
                      )}
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

export default DirectoriesCarModels;

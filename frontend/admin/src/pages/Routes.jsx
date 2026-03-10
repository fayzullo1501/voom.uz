// src/pages/Routes.jsx
import { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import Checkbox from "../components/ui/Checkbox";
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import PageHeader from "../components/layout/Header";
import FilterRoutesModal from "../components/routes/FilterRoutesModal";

const PER_PAGE = 20;

const Routes = () => {
  const [page, setPage] = useState(1);
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const token = localStorage.getItem("token");

  const fetchRoutes = async () => {

      setLoading(true);

      const params = new URLSearchParams();

      if (search) params.append("search", search);

      if (filters.status) params.append("status", filters.status);
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      try {

      const res = await fetch(
        `${API_URL}/api/admin/routes?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setRoutes(data);
      setPage(1);

    } finally {
      setLoading(false);
    }
  };

  const deleteSelected = async () => {
    await fetch(`${API_URL}/api/admin/routes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids: selected }),
    });

    setSelected([]);
    fetchRoutes();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRoutes();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, filters]);

  const totalPages = Math.ceil(routes.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const visible = routes.slice(start, end);

  return (
    <>
      <PageHeader title="Маршруты" />

      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">
        {/* ACTIONS */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button
              onClick={deleteSelected}
              className="h-[42px] px-5 rounded-lg border border-red-600 text-red-600 text-[14px] font-medium bg-red-100 hover:bg-red-200 transition"
            >
              Удалить
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск..."
                className="h-[42px] w-[240px] pl-10 pr-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilter(true)}
              className="h-[42px] w-[42px] flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
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
                  <Checkbox
                    checked={selected.length === visible.length && visible.length > 0}
                    onChange={() => {
                      if (selected.length === visible.length) {
                        setSelected([]);
                      } else {
                        setSelected(visible.map((r) => r._id));
                      }
                    }}
                  />
                </th>
                <th className="px-3 py-3 w-[48px] text-left">№</th>
                <th className="px-3 py-3 w-[90px] text-left">ID</th>
                <th className="px-3 py-3 w-[160px] text-left">ФИО водителя</th>
                <th className="px-3 py-3 w-[120px] text-left">Откуда</th>
                <th className="px-3 py-3 w-[120px] text-left">Куда</th>
                <th className="px-3 py-3 w-[110px] text-left">Кол-во пассажиров</th>
                <th className="px-3 py-3 w-[140px] text-left">Дата выезда</th>
                <th className="px-3 py-3 w-[130px] text-left">Дата создания</th>
                <th className="px-3 py-3 w-[120px] text-left">Статус</th>
                <th className="px-3 py-3 w-[48px]"></th>
                </tr>
            </thead>

            <tbody>
                {loading && (
                  <tr>
                    <td colSpan={11} className="h-[240px]">
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-600">
                        <Loader2 className="w-8 h-8 text-black animate-spin" />
                        <span className="text-[14px]">Загрузка...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && visible.map((r, i) => (
                <tr key={r._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-3 py-3">
                    <Checkbox
                      checked={selected.includes(r._id)}
                      onChange={() => {
                        setSelected((prev) =>
                          prev.includes(r._id)
                            ? prev.filter((id) => id !== r._id)
                            : [...prev, r._id]
                        );
                      }}
                    />
                    </td>
                    <td className="px-3 py-3">{start + i + 1}</td>
                    <td className="px-3 py-3 text-gray-600">{r._id}</td>
                    <td className="px-3 py-3 font-medium">
                      {r.driver?.firstName} {r.driver?.lastName}
                    </td>
                    <td className="px-3 py-3">{r.fromCity?.nameRu}</td>
                    <td className="px-3 py-3">{r.toCity?.nameRu}</td>
                    <td className="px-3 py-3 text-center">{r.passengersCount}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {new Date(r.departureAt).toLocaleString("ru-RU")}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      {r.status === "active" && (
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700">
                          Активный
                        </span>
                      )}

                      {r.status === "in_progress" && (
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700">
                          В пути
                        </span>
                      )}

                      {r.status === "completed" && (
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700">
                          Завершен
                        </span>
                      )}

                      {r.status === "cancelled" && (
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700">
                          Отменен
                        </span>
                      )}
                    </td>
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
      {showFilter && (
        <FilterRoutesModal
          initialFilters={filters}
          onClose={() => setShowFilter(false)}
          onApply={(f) => {
            setFilters(f);
            setPage(1);
          }}
        />
      )}
    </>
  );
};

export default Routes;

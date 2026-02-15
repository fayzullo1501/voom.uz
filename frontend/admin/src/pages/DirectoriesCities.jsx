import { useEffect, useState } from "react";
import Checkbox from "../components/ui/Checkbox";
import { Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from "lucide-react";
import PageHeader from "../components/layout/Header";
import Pagination from "../components/ui/Pagination";


const PER_PAGE = 40;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DirectoriesCities = () => {
  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const loadCities = async (currentPage, q) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage,
        limit: PER_PAGE,
      });

      if (q) params.append("q", q);

      const res = await fetch(`${API_URL}/api/cities?${params}`);
      const data = await res.json();

      setCities(data.cities || []);
        setTotal(data.total || 0);

        if (data.page && data.page !== page) {
          setPage(data.page);
        }

    } catch (err) {
      console.error("Ошибка загрузки городов:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities(page, search);
  }, [page, search]);


  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      loadCities(1, search);
    }
  };

  const handleImport = async () => {
    try {
      setImportLoading(true);

      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/api/cities/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setPage(1);
      setSearch("");
      await loadCities(1, "");

    } catch (err) {
      console.error("Ошибка импорта:", err);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Города" />

      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">

        {/* HEADER ACTIONS */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">

            <button
              onClick={handleImport}
              disabled={importLoading}
              className="h-[42px] px-5 rounded-lg border border-gray-300 text-gray-700 text-[14px] font-medium hover:bg-gray-100 transition flex items-center gap-2"
            >
              {importLoading ? (
                <span className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></span>
              ) : (
                <Download size={16} />
              )}
              {importLoading ? "Импорт..." : "Импортировать"}
            </button>

            <button className="h-[42px] px-5 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition">
              Добавить
            </button>

            <button disabled className="h-[42px] px-5 rounded-lg border border-gray-600 text-gray-600 text-[14px] font-medium bg-gray-100">
              Изменить
            </button>

            <button disabled className="h-[42px] px-5 rounded-lg border border-red-600 text-red-600 text-[14px] font-medium bg-red-100">
              Удалить
            </button>

          </div>

          {/* SEARCH */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Поиск..."
                className="h-[42px] w-[240px] pl-10 pr-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none"
              />
            </div>
            <button className="h-[42px] w-[42px] flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1600px] text-[13px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
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
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center py-10">
                      <div className="animate-spin w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full mx-auto"></div>
                    </td>
                  </tr>
                ) : cities.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-10 text-gray-400">
                      Нет данных
                    </td>
                  </tr>
                ) : (
                  cities.map((c, i) => (
                    <tr key={c._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-3 py-3">{(page - 1) * PER_PAGE + i + 1}</td>
                      <td className="px-3 py-3">{c.nameRu}</td>
                      <td className="px-3 py-3">{c.nameUzLat}</td>
                      <td className="px-3 py-3">{c.nameUzCyr}</td>
                      <td className="px-3 py-3">{c.nameEn}</td>
                      <td className="px-3 py-3">{c.region}</td>
                      <td className="px-3 py-3">{c.country}</td>
                      <td className="px-3 py-3 whitespace-nowrap">{c.lat}, {c.lon}</td>
                      <td className="px-3 py-3">{c.population?.toLocaleString()}</td>
                      <td className="px-3 py-3">{c.priority}</td>
                      <td className="px-3 py-3">
                        <span className={`px-3 py-1 rounded-full text-[13px] font-medium ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                          {c.isActive ? "Активен" : "Неактивен"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
      </div>
    </>
  );
};

export default DirectoriesCities;

// pages/DirectoriesCarColors.jsx
import { useEffect, useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import PageHeader from "../components/layout/Header";
import Checkbox from "../components/ui/Checkbox";
import { API_URL } from "../config/api";
import AddColorModal from "../components/colors/AddColorModal";
import EditColorModal from "../components/colors/EditColorModal";
import FilterColorsModal from "../components/colors/FilterColorsModal";

const PER_PAGE = 20;

const DirectoriesCarColors = () => {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const loadColors = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: PER_PAGE,
      });

      if (search) params.append("search", search);
      if (filters.status) params.append("status", filters.status);
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);

      const res = await fetch(`${API_URL}/api/admin/colors?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();
      setItems(data.items || []);
      setTotalPages(data.totalPages || 1);
      setSelected([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColors();
  }, [page, search, filters]);

  const toggleAll = (checked) => {
    setSelected(checked ? items.map((i) => i._id) : []);
  };

  const toggleOne = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const deleteSelected = async () => {
    if (!selected.length) return;

    const ok = window.confirm("Вы уверены, что хотите удалить выбранные цвета?");
    if (!ok) return;

    await fetch(`${API_URL}/api/admin/colors`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ids: selected }),
    });

    loadColors();
  };

  const selectedColor = selected.length === 1 ? items.find((i) => i._id === selected[0]) : null;

  return (
    <>
      <PageHeader title="Цвета автомобилей" />

      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button onClick={() => setShowAdd(true)} className="h-[42px] px-5 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a]">
              Добавить
            </button>
            <button onClick={() => setShowEdit(true)} disabled={selected.length !== 1} className="h-[42px] px-5 rounded-lg border border-gray-600 text-gray-600 text-[14px] font-medium bg-gray-100 disabled:opacity-40">
              Изменить
            </button>
            <button onClick={deleteSelected} disabled={!selected.length} className="h-[42px] px-5 rounded-lg border border-red-600 text-red-600 text-[14px] font-medium bg-red-100 disabled:opacity-40">
              Удалить
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} placeholder="Поиск..." className="h-[42px] w-[240px] pl-10 pr-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none" />
            </div>
            <button onClick={() => setShowFilter(true)} className="h-[42px] w-[42px] flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full min-w-[1000px] text-[13px]">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-3 py-3 w-[48px]"><Checkbox checked={selected.length === items.length && items.length > 0} onChange={toggleAll} /></th>
                <th className="px-3 py-3 w-[60px] text-left">№</th>
                <th className="px-3 py-3 w-[160px] text-left">ID</th>
                <th className="px-3 py-3 w-[120px] text-left">Цвет</th>
                <th className="px-3 py-3 w-[120px] text-left">HEX</th>
                <th className="px-3 py-3 w-[200px] text-left">RU</th>
                <th className="px-3 py-3 w-[200px] text-left">UZ</th>
                <th className="px-3 py-3 w-[200px] text-left">EN</th>
                <th className="px-3 py-3 w-[160px] text-left">Создан</th>
                <th className="px-3 py-3 w-[140px] text-left">Статус</th>
              </tr>
            </thead>
            <tbody>
              {!loading && items.map((c, i) => (
                <tr key={c._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-3"><Checkbox checked={selected.includes(c._id)} onChange={() => toggleOne(c._id)} /></td>
                  <td className="px-3 py-3">{(page - 1) * PER_PAGE + i + 1}</td>
                  <td className="px-3 py-3 text-gray-600">{c._id}</td>
                  <td className="px-3 py-3"><div className="h-6 w-6 rounded-full border border-gray-300" style={{ backgroundColor: c.hex }} /></td>
                  <td className="px-3 py-3 font-mono">{c.hex}</td>
                  <td className="px-3 py-3">{c.nameRu}</td>
                  <td className="px-3 py-3">{c.nameUz}</td>
                  <td className="px-3 py-3">{c.nameEn}</td>
                  <td className="px-3 py-3">{new Date(c.createdAt).toLocaleDateString("ru-RU")}</td>
                  <td className="px-3 py-3">{c.status === "active" ? <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">Активный</span> : <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">Неактивный</span>}</td>
                </tr>
              ))}
              {!loading && !items.length && <tr><td colSpan={10} className="py-10 text-center text-gray-400">Ничего не найдено</td></tr>}
              {loading && <tr><td colSpan={10} className="py-10 text-center text-gray-400">Загрузка...</td></tr>}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setPage(1)} disabled={page === 1} className="p-2 opacity-50"><ChevronsLeft size={20} /></button>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 opacity-50"><ChevronLeft size={20} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`w-11 h-11 rounded-xl ${page === n ? "bg-[#32BB78] text-white font-semibold" : "hover:bg-gray-100"}`}>{n}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 opacity-50"><ChevronRight size={20} /></button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-2 opacity-50"><ChevronsRight size={20} /></button>
          </div>
        )}
      </div>

      {showAdd && <AddColorModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); loadColors(); }} />}
      {showEdit && selectedColor && <EditColorModal color={selectedColor} onClose={() => setShowEdit(false)} onSuccess={() => { setShowEdit(false); loadColors(); }} />}
      {showFilter && <FilterColorsModal initialFilters={filters} onClose={() => setShowFilter(false)} onApply={(f) => { setPage(1); setFilters(f); }} />}
    </>
  );
};

export default DirectoriesCarColors;

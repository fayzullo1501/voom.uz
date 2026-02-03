import { useEffect, useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import PageHeader from "../components/layout/Header";
import Checkbox from "../components/ui/Checkbox";
import { API_URL } from "../config/api";

import AddBrandModal from "../components/brands/AddBrandModal";
import EditBrandModal from "../components/brands/EditBrandModal";
import FilterBrandsModal from "../components/brands/FilterBrandsModal";

const PER_PAGE = 20;

const DirectoriesCarBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const loadBrands = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filters.status) params.append("status", filters.status);
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);

      const res = await fetch(`${API_URL}/api/admin/brands?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();
      setBrands(data);
      setPage(1);
      setSelected([]);
    } catch (e) {
      console.error("LOAD BRANDS ERROR", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, [search, filters]);

  const totalPages = Math.ceil(brands.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visible = brands.slice(start, start + PER_PAGE);

  const toggleAll = (checked) => {
    setSelected(checked ? visible.map((b) => b._id) : []);
  };

  const toggleOne = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const deleteSelected = async () => {
    if (!selected.length) return;

    await fetch(`${API_URL}/api/admin/brands`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ids: selected }),
    });

    loadBrands();
  };

  const selectedBrand = selected.length === 1 ? brands.find((b) => b._id === selected[0]) : null;

  return (
    <>
      <PageHeader title="Марки автомобилей" />

      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button onClick={() => setShowAdd(true)} className="h-[42px] px-5 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition">
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
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..." className="h-[42px] w-[240px] pl-10 pr-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none" />
            </div>
            <button onClick={() => setShowFilter(true)} className="h-[42px] w-[42px] flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-[13px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-3 w-[48px] text-left">
                    <Checkbox checked={selected.length === visible.length && visible.length > 0} onChange={toggleAll} />
                  </th>
                  <th className="px-3 py-3 w-[60px] text-left">№</th>
                  <th className="px-3 py-3 w-[200px] text-left">ID</th>
                  <th className="px-3 py-3 w-[260px] text-left">Название марки</th>
                  <th className="px-3 py-3 w-[140px] text-left">Логотип</th>
                  <th className="px-3 py-3 w-[160px] text-left">Дата создания</th>
                  <th className="px-3 py-3 w-[140px] text-left">Статус</th>
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  visible.map((b, i) => (
                    <tr key={b._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-3 py-3">
                        <Checkbox checked={selected.includes(b._id)} onChange={() => toggleOne(b._id)} />
                      </td>
                      <td className="px-3 py-3">{start + i + 1}</td>
                      <td className="px-3 py-3 text-gray-600">{b._id}</td>
                      <td className="px-3 py-3">{b.name}</td>
                      <td className="px-3 py-3">
                        {b.logo?.url ? <img src={b.logo.url} alt={b.name} className="h-8 w-8 object-contain" /> : "—"}
                      </td>
                      <td className="px-3 py-3">{new Date(b.createdAt).toLocaleDateString("ru-RU")}</td>
                      <td className="px-3 py-3">
                        {b.status === "active" ? (
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Активный</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">Неактивный</span>
                        )}
                      </td>
                    </tr>
                  ))}

                {!loading && !visible.length && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">Ничего не найдено</td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">Загрузка...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setPage(1)} disabled={page === 1} className="p-2 opacity-50"><ChevronsLeft size={20} /></button>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 opacity-50"><ChevronLeft size={20} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`w-11 h-11 rounded-xl ${page === n ? "bg-[#32BB78] text-white font-semibold" : "hover:bg-gray-100"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 opacity-50"><ChevronRight size={20} /></button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-2 opacity-50"><ChevronsRight size={20} /></button>
          </div>
        )}
      </div>

      {showAdd && <AddBrandModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); loadBrands(); }} />}
      {showEdit && selectedBrand && <EditBrandModal brand={selectedBrand} onClose={() => setShowEdit(false)} onSuccess={() => { setShowEdit(false); loadBrands(); }} />}
      {showFilter && <FilterBrandsModal initialFilters={filters} onClose={() => setShowFilter(false)} onApply={setFilters} />}
    </>
  );
};

export default DirectoriesCarBrands;

// src/pages/Users.jsx
import { useEffect, useState } from "react";
import Checkbox from "../components/ui/Checkbox";
import { Search, Filter, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import PageHeader from "../components/layout/Header";
import { API_URL } from "../config/api";

const PER_PAGE = 20;

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString("ru-RU");
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        }
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const totalPages = Math.ceil(users.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const visible = users.slice(start, end);

  return (
    <>
      <PageHeader title="Пользователи" />

      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">
        {/* ACTIONS */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button className="h-[42px] px-5 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition">Добавить</button>
            <button disabled className="h-[42px] px-5 rounded-lg border border-gray-600 text-gray-600 text-[14px] font-medium bg-gray-100 hover:bg-gray-200 transition">Изменить</button>
            <button disabled className="h-[42px] px-5 rounded-lg border border-red-600 text-red-600 text-[14px] font-medium bg-red-100 hover:bg-red-200 transition">Удалить</button>
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
            <table className="w-full min-w-[1000px] text-[13px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-3 w-[48px] text-left"><Checkbox /></th>
                  <th className="px-3 py-3 w-[48px] text-left">№</th>
                  <th className="px-3 py-3 w-[90px] text-left">ID</th>
                  <th className="px-3 py-3 w-[180px] text-left">ФИО</th>
                  <th className="px-3 py-3 w-[140px] text-left">Телефон</th>
                  <th className="px-3 py-3 w-[200px] text-left">Почта</th>
                  <th className="px-3 py-3 w-[110px] text-left">Роль</th>
                  <th className="px-3 py-3 w-[140px] text-left">Верифицирован</th>
                  <th className="px-3 py-3 w-[150px] text-left">Дата создания</th>
                  <th className="px-3 py-3 w-[48px]"></th>
                </tr>
              </thead>

              <tbody>
                {!loading && visible.map((u, i) => (
                  <tr key={u._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-3 py-3"><Checkbox /></td>
                    <td className="px-3 py-3">{start + i + 1}</td>
                    <td className="px-3 py-3 text-gray-600">{u._id.slice(-6)}</td>
                    <td className="px-3 py-3 font-medium">{`${u.firstName || ""} ${u.lastName || ""}`.trim() || "—"}</td>
                    <td className="px-3 py-3 whitespace-nowrap">+998 {u.phone}</td>
                    <td className="px-3 py-3">{u.email || "—"}</td>
                    <td className="px-3 py-3">{u.role}</td>
                    <td className="px-3 py-3"> {u.phoneVerified ? "Да" : "Нет"} </td>
                    <td className="px-3 py-3 whitespace-nowrap">{formatDate(u.createdAt)}</td>
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
            <button onClick={() => setPage(1)} disabled={page === 1} className={`p-2 ${page === 1 ? "opacity-30" : "hover:text-[#32BB78]"}`}><ChevronsLeft size={20} /></button>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={`p-2 ${page === 1 ? "opacity-30" : "hover:text-[#32BB78]"}`}><ChevronLeft size={20} /></button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`w-11 h-11 rounded-xl text-[16px] transition ${page === n ? "bg-[#32BB78] text-white font-semibold" : "hover:bg-gray-100"}`}>{n}</button>
            ))}

            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`p-2 ${page === totalPages ? "opacity-30" : "hover:text-[#32BB78]"}`}><ChevronRight size={20} /></button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className={`p-2 ${page === totalPages ? "opacity-30" : "hover:text-[#32BB78]"}`}><ChevronsRight size={20} /></button>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;

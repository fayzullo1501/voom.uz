// src/pages/Users.jsx
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

/* ---------- MOCK DATA (40 USERS) ---------- */
const USERS = Array.from({ length: 40 }, (_, i) => ({
  id: `id-${i + 1}`,
  name: `Пользователь ${i + 1}`,
  phone: "+998901234567",
  email: `user${i + 1}@gmail.com`,
  driver: i % 3 === 0 ? "Да" : "Нет",
  date: "22.07.2025",
}));

const PER_PAGE = 20;

const Users = () => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(USERS.length / PER_PAGE);

  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const visible = USERS.slice(start, end);

  return (
    <>
      <PageHeader title="Пользователи" />

      {/* ⬇️ СКРОЛЛИТСЯ ТОЛЬКО КОНТЕНТ */}
      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">

        {/* ACTIONS */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            {/* Добавить */}
            <button
                onClick={() => console.log("ADD")}
                className="h-[42px] px-5 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition"
            >
                Добавить
            </button>

            {/* Изменить */}
            <button
                onClick={() => console.log("EDIT")}
                disabled
                className="h-[42px] px-5 rounded-lg border border-gray-600 text-gray-600 text-[14px] font-medium hover:bg-gray-100 transition"
            >
                Изменить
            </button>

            {/* Удалить */}
            <button
                onClick={() => console.log("DELETE")}
                disabled
                className="h-[42px] px-5 rounded-lg border border-red-600 text-red-600 text-[14px] font-medium hover:bg-red-50 transition"
            >
                Удалить
            </button>
            </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
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
          <table className="w-full">
            <thead className="bg-gray-50 text-[13px] text-gray-500">
              <tr>
                <th className="px-4 py-4 w-[56px]">
                  <Checkbox />
                </th>
                <th className="px-4 py-4 text-left">№</th>
                <th className="px-4 py-4 text-left">ID</th>
                <th className="px-4 py-4 text-left">ФИО</th>
                <th className="px-4 py-4 text-left">Телефон</th>
                <th className="px-4 py-4 text-left">Почта</th>
                <th className="px-4 py-4 text-left">Водитель</th>
                <th className="px-4 py-4 text-left">Дата регистрации</th>
                <th className="px-4 py-4 w-[56px]"></th>
              </tr>
            </thead>

            <tbody>
              {visible.map((u, i) => (
                <tr
                  key={u.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-4">
                    <Checkbox />
                  </td>
                  <td className="px-4 py-4">
                    {start + i + 1}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{u.id}</td>
                  <td className="px-4 py-4 font-medium">{u.name}</td>
                  <td className="px-4 py-4">{u.phone}</td>
                  <td className="px-4 py-4">{u.email}</td>
                  <td className="px-4 py-4">{u.driver}</td>
                  <td className="px-4 py-4">{u.date}</td>
                  <td className="px-4 py-4">
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-200 transition">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">

            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className={`p-2 ${page === 1 ? "opacity-30" : "hover:text-[#32BB78]"}`}
            >
              <ChevronsLeft size={20} />
            </button>

            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`p-2 ${page === 1 ? "opacity-30" : "hover:text-[#32BB78]"}`}
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-11 h-11 rounded-xl text-[16px] transition ${
                  page === n
                    ? "bg-[#32BB78] text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`p-2 ${page === totalPages ? "opacity-30" : "hover:text-[#32BB78]"}`}
            >
              <ChevronRight size={20} />
            </button>

            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className={`p-2 ${page === totalPages ? "opacity-30" : "hover:text-[#32BB78]"}`}
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;

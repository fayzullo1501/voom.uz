// src/pages/News.jsx
import { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { useNavigate } from "react-router-dom";
import Checkbox from "../components/ui/Checkbox";
import { Search, Filter, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import PageHeader from "../components/layout/Header";

const PER_PAGE = 20;

const News = () => {
  const [page, setPage] = useState(1);
  const [news, setNews] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const totalPages = Math.ceil(news.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const visible = news.slice(start, end);

  useEffect(() => {

    const loadNews = async () => {

      try {

        const res = await fetch(`${API_URL}/api/admin/news`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();

        setNews(data);

      } catch (err) {

        console.error("LOAD NEWS ERROR", err);

      }

    };

    loadNews();

  }, []);

  const toggleSelect = (id) => {

    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }

  };
  
  return (
    <>
      <PageHeader title="Новости" />

      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/news/create")}
              className="h-[42px] px-5 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition"
            >
              Добавить
            </button>
            <button disabled={selected.length !== 1} onClick={() => navigate(`/news/edit/${selected[0]}`)} className="h-[42px] px-5 rounded-lg border border-gray-600 text-gray-600 text-[14px] font-medium bg-gray-100 hover:bg-gray-200 transition">
              Изменить
            </button>
            <button
            disabled={!selected.length}
            onClick={async () => {

              if (!confirm("Удалить выбранные новости?")) return;

              await fetch(`${API_URL}/api/admin/news`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ ids: selected })
              });

              setNews(news.filter(n => !selected.includes(n._id)));
              setSelected([]);

            }} className="h-[42px] px-5 rounded-lg border border-red-600 text-red-600 text-[14px] font-medium bg-red-100 hover:bg-red-200 transition">
              Удалить
            </button>
            <button
              disabled={!selected.length}
              onClick={async () => {

                await fetch(`${API_URL}/api/admin/news/publish`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  },
                  body: JSON.stringify({ ids: selected })
                });

                setNews(news.map(n =>
                  selected.includes(n._id)
                    ? { ...n, status: "published" }
                    : n
                ));

                setSelected([]);

              }}
              className="h-[42px] px-5 rounded-lg border border-green-600 text-green-600 text-[14px] font-medium bg-green-100 hover:bg-green-200 transition"
            >
              Опубликовать
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
            <table className="w-full min-w-[1200px] text-[13px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-3 w-[48px] text-left">
                    <Checkbox
                      checked={selected.length === news.length && news.length > 0}
                      onChange={() => {
                        if (selected.length === news.length) {
                          setSelected([]);
                        } else {
                          setSelected(news.map(n => n._id));
                        }
                      }}
                    />
                  </th>
                  <th className="px-3 py-3 w-[60px] text-left">№</th>
                  <th className="px-3 py-3 w-[80px] text-left">ID</th>
                  <th className="px-3 py-3 w-[80px] text-left">Фото</th>
                  <th className="px-3 py-3 w-[360px] text-left">Заголовок</th>
                  <th className="px-3 py-3 w-[140px] text-left">Просмотры</th>
                  <th className="px-3 py-3 w-[160px] text-left">Дата создания</th>
                  <th className="px-3 py-3 w-[160px] text-left">Статус</th>
                  <th className="px-3 py-3 w-[60px] text-center"></th>
                </tr>
              </thead>

              <tbody>
                {visible.map((n, i) => (
                  <tr key={n._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-3 py-3">
                      <Checkbox
                        checked={selected.includes(n._id)}
                        onChange={() => toggleSelect(n._id)}
                      />
                    </td>
                    <td className="px-3 py-3">{start + i + 1}</td>
                    <td className="px-3 py-3">{n._id.slice(-6)}</td>
                    <td className="px-3 py-3">
                      <img
                        src={
                          n.content?.ru?.blocks?.find(b => b.type === "image")?.data?.file?.url ||
                          "https://via.placeholder.com/48x32"
                        }
                        alt=""
                        className="w-12 h-8 object-cover rounded-md border border-gray-200"
                      />
                    </td>
                    <td className="px-3 py-3 font-medium text-gray-800">{n.title?.ru || "-"}</td>
                    <td className="px-3 py-3">{n.views || 0}</td>
                    <td className="px-3 py-3">{new Date(n.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-3">
                      <span className={`px-3 py-1 rounded-full text-[13px] font-medium ${
                        n.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                      }`}>
                        {n.status === "published" ? "Опубликован" : "Черновик"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => navigate(`/news/view/${n._id}`)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
                    >
                      <Eye size={18} className="text-gray-500" />
                    </button>
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

export default News;

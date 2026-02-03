import React, { useEffect, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";

const STATUS_MAP = {
  success: { label: "Успешно", className: "text-green-600" },
  pending: { label: "В обработке", className: "text-orange-500" },
  failed: { label: "Отменено", className: "text-red-500" },
};

const TYPE_MAP = {
  topup: "Пополнение",
  debit: "Списание",
};

const ITEMS_PER_PAGE = 20;

const formatDateTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (amount, type) => {
  const sign = type === "topup" ? "+" : "-";
  return `${sign}${amount.toLocaleString("ru-RU")} сум`;
};

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get("/api/balance/transactions");
      setItems(data);
    };
    load();
  }, []);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginatedItems = items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-white px-6 pb-10 flex flex-col">
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button className="p-2 rounded-full invisible" aria-hidden="true" tabIndex={-1}>
            <X size={24} />
          </button>
        </div>
      </header>

      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-[900px] flex items-center justify-center">
          <button onClick={() => navigate(-1)} className="absolute left-0 p-2 rounded-lg hover:bg-gray-100 transition">
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-center">История операций</h1>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-[900px]">
          {/* Header */}
          <div className="flex px-4 py-2 text-sm text-gray-500">
            <div className="w-[60px] text-center">№</div>
            <div className="w-[140px]">Тип</div>
            <div className="w-[220px]">ID транзакции</div>
            <div className="w-[180px]">Дата</div>
            <div className="w-[140px] text-right">Сумма</div>
            <div className="w-[120px] text-right">Статус</div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-2 mt-2">
            {paginatedItems.map((tx, index) => {
              const status = STATUS_MAP[tx.status] || STATUS_MAP.pending;
              const rowNumber = (page - 1) * ITEMS_PER_PAGE + index + 1;

              return (
                <div key={tx._id} className="flex items-center px-4 py-3 rounded-xl transition hover:bg-gray-50">
                  <div className="w-[60px] text-center text-sm text-gray-500">
                    {rowNumber}
                  </div>

                  <div className="w-[140px] text-sm font-medium">
                    {TYPE_MAP[tx.type] || tx.type}
                  </div>

                  <div className="w-[220px] text-sm text-gray-600 truncate" title={tx._id}>
                    {tx._id}
                  </div>

                  <div className="w-[180px] text-sm text-gray-600 whitespace-nowrap">
                    {formatDateTime(tx.createdAt)}
                  </div>

                  <div className="w-[140px] text-sm font-medium text-right">
                    {formatAmount(tx.amount, tx.type)}
                  </div>

                  <div className={`w-[120px] text-sm font-medium text-right ${status.className}`}>
                    {status.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12 select-none">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className={`text-xl px-2 ${page === 1 ? "opacity-30 cursor-not-allowed" : "hover:text-blue-600"}`}
              >
                «
              </button>

              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`text-xl px-2 ${page === 1 ? "opacity-30 cursor-not-allowed" : "hover:text-blue-600"}`}
              >
                ‹
              </button>

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition ${
                    page === num ? "bg-[#32BB78] text-white font-semibold" : "hover:bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`text-xl px-2 ${page === totalPages ? "opacity-30 cursor-not-allowed" : "hover:text-blue-600"}`}
              >
                ›
              </button>

              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className={`text-xl px-2 ${page === totalPages ? "opacity-30 cursor-not-allowed" : "hover:text-blue-600"}`}
              >
                »
              </button>
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-10">
              История операций пуста
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;

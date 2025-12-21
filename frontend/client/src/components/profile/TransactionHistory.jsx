import React from "react";
import { ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const transactions = [
  {
    type: "Пополнение",
    id: "TXN-928374",
    date: "21.12.2025",
    amount: "+150 000 сум",
    status: "Успешно",
    statusColor: "text-green-600",
  },
  {
    type: "Вывод",
    id: "TXN-928102",
    date: "19.12.2025",
    amount: "-50 000 сум",
    status: "В обработке",
    statusColor: "text-yellow-600",
  },
  {
    type: "Перевод",
    id: "TXN-927881",
    date: "18.12.2025",
    amount: "-25 000 сум",
    status: "Отменено",
    statusColor: "text-red-500",
  },
];

const TransactionHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-6 pb-10 flex flex-col">
      {/* ===== Header (место сохранено, X скрыт) ===== */}
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button
            className="p-2 rounded-full invisible"
            aria-hidden="true"
            tabIndex={-1}
          >
            <X size={24} />
          </button>
        </div>
      </header>

      {/* ===== Title row (как на Pop-up) ===== */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-[700px] flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Назад"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>

          <h1 className="text-[28px] sm:text-[32px] font-semibold text-center">
            История операций
          </h1>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="flex justify-center">
        <div className="w-full max-w-[700px]">
          {/* Table header */}
          <div className="grid grid-cols-5 gap-4 px-4 py-2 text-sm text-gray-500">
            <div>Тип</div>
            <div>ID транзакции</div>
            <div>Дата</div>
            <div className="text-right">Сумма</div>
            <div className="text-right">Статус</div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-2 mt-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-5 gap-4 items-center px-4 py-3 rounded-xl transition hover:bg-gray-50 cursor-pointer"
              >
                <div className="text-sm font-medium">{tx.type}</div>
                <div className="text-sm text-gray-600">{tx.id}</div>
                <div className="text-sm text-gray-600">{tx.date}</div>
                <div className="text-sm font-medium text-right">
                  {tx.amount}
                </div>
                <div
                  className={`text-sm font-medium text-right ${tx.statusColor}`}
                >
                  {tx.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;

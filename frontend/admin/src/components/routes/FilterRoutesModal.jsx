import { useState } from "react";
import { X } from "lucide-react";

const FilterRoutesModal = ({ initialFilters, onClose, onApply }) => {
  const [status, setStatus] = useState(initialFilters.status || "");
  const [from, setFrom] = useState(initialFilters.from || "");
  const [to, setTo] = useState(initialFilters.to || "");
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom || "");
  const [dateTo, setDateTo] = useState(initialFilters.dateTo || "");

  const apply = () => {
    onApply({ status, from, to, dateFrom, dateTo });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="bg-white w-[420px] rounded-xl p-6">

        <div className="flex items-center justify-between mb-6">
          <div className="text-[18px] font-semibold">Фильтр маршрутов</div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-[40px] border rounded-lg px-3"
          >
            <option value="">Все статусы</option>
            <option value="active">Активный</option>
            <option value="in_progress">В пути</option>
            <option value="completed">Завершен</option>
            <option value="cancelled">Отменен</option>
          </select>

          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Откуда"
            className="h-[40px] border rounded-lg px-3"
          />

          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Куда"
            className="h-[40px] border rounded-lg px-3"
          />

          <div className="flex gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-[40px] border rounded-lg px-3 w-full"
            />

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-[40px] border rounded-lg px-3 w-full"
            />
          </div>

        </div>

        <div className="flex justify-end gap-2 mt-6">

          <button
            onClick={onClose}
            className="px-4 h-[40px] border rounded-lg"
          >
            Отмена
          </button>

          <button
            onClick={apply}
            className="px-4 h-[40px] bg-[#32BB78] text-white rounded-lg"
          >
            Применить
          </button>

        </div>

      </div>

    </div>
  );
};

export default FilterRoutesModal;
//src/components/users/FilterUsersModal.jsx
import { X } from "lucide-react";
import { useState } from "react";

const FilterUsersModal = ({ initialFilters, onClose, onApply }) => {
  const [form, setForm] = useState({
    role: initialFilters?.role || "",
    verified: initialFilters?.verified ?? "",
    from: initialFilters?.from || "",
    to: initialFilters?.to || "",
  });

    const apply = () => {
    onApply(form);
    onClose();
    };

    const clear = () => {
        const empty = {
            role: "",
            verified: "",
            from: "",
            to: "",
        };

        setForm(empty);
        onApply(empty); // ← важно
        onClose();
    };



  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-[560px] rounded-2xl relative"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 pt-6">
          <h2 className="text-[22px] font-semibold text-gray-900">
            Фильтр пользователей
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-px bg-gray-200 mt-4" />

        {/* CONTENT */}
        <div className="px-8 py-6 grid grid-cols-2 gap-x-6 gap-y-4">
          {/* ROLE */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">
              Роль
            </label>
            <select
              value={form.role}
                onChange={(e) =>
                setForm({ ...form, role: e.target.value })
                }
              className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] bg-white focus:outline-none"
            >
              <option value="">Все</option>
              <option value="user">user</option>
              <option value="manager">manager</option>
              <option value="admin">admin</option>
            </select>
          </div>

          {/* VERIFIED */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">
              Верификация
            </label>
            <select
              value={form.verified}
                onChange={(e) =>
                setForm({ ...form, verified: e.target.value })
                }
              className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] bg-white focus:outline-none"
            >
              <option value="">Все</option>
              <option value="true">Верифицирован</option>
              <option value="false">Не верифицирован</option>
            </select>
          </div>

          {/* FROM */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">
              Период с
            </label>
            <input
              type="date"
              value={form.from}
                onChange={(e) =>
                setForm({ ...form, from: e.target.value })
                }
              className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none"
            />
          </div>

          {/* TO */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">
              Период по
            </label>
            <input
              type="date"
              value={form.to}
                onChange={(e) =>
                setForm({ ...form, to: e.target.value })
                }
              className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center px-8 pb-6">
            {/* ОЧИСТИТЬ */}
            <button
                onClick={clear}
                className="text-[14px] text-gray-500 hover:text-gray-800 transition"
            >
                Очистить
            </button>

            {/* ACTIONS */}
            <div className="flex gap-3">
                <button
                onClick={onClose}
                className="h-[44px] px-6 rounded-lg border border-gray-300 text-[14px] font-medium hover:bg-gray-100 transition"
                >
                Отменить
                </button>

                <button
                onClick={apply}
                className="h-[44px] px-6 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition"
                >
                Применить
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FilterUsersModal;

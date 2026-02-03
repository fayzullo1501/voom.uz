// src/components/colors/AddColorModal.jsx
import { X } from "lucide-react";
import { useState } from "react";
import { API_URL } from "../../config/api";

const AddColorModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    nameRu: "",
    nameUz: "",
    nameEn: "",
    hex: "#000000",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/admin/colors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-[560px] rounded-2xl relative">
        <div className="flex items-center justify-between px-8 pt-6">
          <h2 className="text-[22px] font-semibold text-gray-900">Добавить цвет</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <div className="h-px bg-gray-200 mt-4" />

        <div className="px-8 py-6 grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-[13px] font-medium text-gray-700">Название (RU)</label>
            <input value={form.nameRu} onChange={(e) => setForm({ ...form, nameRu: e.target.value })} className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">Название (UZ)</label>
            <input value={form.nameUz} onChange={(e) => setForm({ ...form, nameUz: e.target.value })} className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">Название (EN)</label>
            <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">Цвет</label>
            <input type="color" value={form.hex} onChange={(e) => setForm({ ...form, hex: e.target.value.toUpperCase() })} className="h-[44px] w-full rounded-lg border border-gray-300 bg-white px-2" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">HEX</label>
            <input value={form.hex} onChange={(e) => setForm({ ...form, hex: e.target.value.toUpperCase() })} className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] font-mono focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-[13px] font-medium text-gray-700">Статус</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] bg-white focus:outline-none">
              <option value="active">Активный</option>
              <option value="inactive">Неактивный</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 pb-6">
          <button onClick={onClose} disabled={loading} className="h-[44px] px-6 rounded-lg border border-gray-300 text-[14px] font-medium hover:bg-gray-100 transition">
            Отменить
          </button>

          <button onClick={submit} disabled={loading || !form.nameRu || !form.nameUz || !form.nameEn} className="h-[44px] px-6 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition flex items-center justify-center">
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddColorModal;

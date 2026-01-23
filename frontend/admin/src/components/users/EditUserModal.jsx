import { X } from "lucide-react";
import { useState } from "react";
import { API_URL } from "../../config/api";
import uzFlag from "../../assets/flag-uz.svg";

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 7));
  if (digits.length > 7) parts.push(digits.slice(7, 9));
  return parts.join(" ");
};

const EditUserModal = ({ user, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    email: user.email || "",
    role: user.role || "user",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone.replace(/\D/g, ""),
        email: form.email,
        role: form.role,
      };

      if (form.password) {
        payload.password = form.password;
      }

      const res = await fetch(`${API_URL}/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-[560px] rounded-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 pt-6">
          <h2 className="text-[22px] font-semibold text-gray-900">
            Изменить пользователя
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <div className="h-px bg-gray-200 mt-4" />

        {/* FORM */}
        <div className="px-8 py-6 grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">Имя</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Введите имя"
              className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">Фамилия</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Введите фамилию"
              className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">Телефон</label>
            <div className="flex items-center h-[44px] rounded-lg border border-gray-300 overflow-hidden">
              <div className="flex items-center gap-2 px-3">
                <img src={uzFlag} alt="UZ" className="w-5 h-5" />
                <span className="text-[14px] font-medium text-gray-700">+998</span>
              </div>
              <input
                value={formatPhone(form.phone)}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="99 123 45 67"
                className="flex-1 h-full px-3 text-[14px] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">Эл. почта</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@mail.com"
              className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">
              Новый пароль
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Оставьте пустым, если не менять"
              className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-gray-700">Роль</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="h-[44px] px-4 rounded-lg border border-gray-300 text-[14px] bg-white focus:outline-none"
            >
              <option value="user">user</option>
              <option value="manager">manager</option>
              <option value="admin">admin</option>
            </select>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 px-8 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="h-[44px] px-6 rounded-lg border border-gray-300 text-[14px] font-medium hover:bg-gray-100 transition"
          >
            Отменить
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="h-[44px] px-6 rounded-lg bg-[#32BB78] text-white text-[14px] font-medium hover:bg-[#28a96a] transition flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Сохранить"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;

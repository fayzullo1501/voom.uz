// src/components/users/UserProfileTab.jsx
import { User } from "lucide-react";

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <div className="text-[14px] text-gray-400">{label}</div>
    <div className="text-[16px] text-gray-900 border-b border-gray-300 pb-1">
      {value || "—"}
    </div>
  </div>
);

const Loader = () => (
  <div className="h-[260px] flex flex-col items-center justify-center text-gray-500 gap-3">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
    <div className="text-[15px]">Загрузка</div>
  </div>
);

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("ru-RU");
};

const UserProfileTab = ({ user }) => {
  if (!user) {
    return (
      <div className="border border-gray-200 rounded-2xl p-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <User size={18} />
        <div className="text-[18px] font-semibold text-gray-900">
          Персональные данные
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-10 gap-y-8">
        <Field label="Имя" value={user.firstName} />
        <Field label="Фамилия" value={user.lastName} />
        <Field label="Дата рождения" value={formatDate(user.birthDate)} />

        <Field label="Телефон номер" value={user.phone ? `+998 ${user.phone}` : "—"} />
        <Field label="Эл. почта" value={user.email} />
        <Field label="Роль" value={user.role} />

        <Field label="Дата регистрации" value={formatDate(user.createdAt)} />
        <Field label="Адрес проживания" value={user.address} />
        <Field label="О себе" value={user.about} />
      </div>
    </div>
  );
};

export default UserProfileTab;

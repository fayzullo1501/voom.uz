import PageHeader from "../components/layout/Header";

const Users = () => {
  return (
    <div>
      <PageHeader title="Пользователи" />

      <div className="bg-white rounded-xl p-6 shadow-sm">
        {/* здесь будет таблица пользователей */}
        Контент страницы пользователей
      </div>
    </div>
  );
};

export default Users;

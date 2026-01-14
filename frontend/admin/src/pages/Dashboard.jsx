import Header from "../components/layout/Header";

const Dashboard = () => {
  return (
    <>
      <Header title="Статистика" />

      {/* ОБЩИЕ ОТСТУПЫ КОНТЕНТА */}
      <div className="p-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          Контент статистики
        </div>
      </div>
    </>
  );
};

export default Dashboard;

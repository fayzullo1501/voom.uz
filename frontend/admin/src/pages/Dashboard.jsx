import PageHeader from "../components/layout/Header";

const Dashboard = () => {
  return (
    <div>
      <PageHeader title="Статистика" />

      <div className="bg-white rounded-xl p-6 shadow-sm">
        Контент статистики
      </div>
    </div>
  );
};

export default Dashboard;

import LoginPage from "./pages/auth/LoginPage";
import AdminLayout from "./components/layout/AdminLayout";

const App = () => {
  return (
    <AdminLayout>
      <LoginPage />
    </AdminLayout>
  );
};

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import DeviceGuard from "./components/layout/DeviceGuard";
import AdminLayout from "./components/layout/AdminLayout";
import LoginPage from "./pages/auth/LoginPage";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

const App = () => {
  const isAuth = localStorage.getItem("admin_auth") === "true";

  const protectedPage = (Page) =>
    isAuth ? (
      <AdminLayout>
        <Page />
      </AdminLayout>
    ) : (
      <Navigate to="/login" replace />
    );

  return (
    <DeviceGuard>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={protectedPage(Dashboard)} />
        <Route path="/users" element={protectedPage(Users)} />
      </Routes>
    </DeviceGuard>
  );
};

export default App;

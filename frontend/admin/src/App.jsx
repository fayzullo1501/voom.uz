// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import DeviceGuard from "./components/layout/DeviceGuard";
import AdminLayout from "./components/layout/AdminLayout";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const isAuth = localStorage.getItem("admin_auth") === "true";

  return (
    <DeviceGuard>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={isAuth ? <AdminLayout><Dashboard /></AdminLayout> : <Navigate to="/login" replace />} />
      </Routes>
    </DeviceGuard>
  );
};

export default App;

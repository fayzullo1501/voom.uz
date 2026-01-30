import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import DeviceGuard from "./components/layout/DeviceGuard";
import AdminLayout from "./components/layout/AdminLayout";
import LoginPage from "./pages/auth/LoginPage";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserDetails from "./pages/users/UserDetails";
import MRoutes from "./pages/Routes";
import Requests from "./pages/Requests";
import DirectoriesCities from "./pages/DirectoriesCities";
import DirectoriesCarBrands from "./pages/DirectoriesCarBrands";
import DirectoriesCarModels from "./pages/DirectoriesCarModels";
import DirectoriesCarColors from "./pages/DirectoriesCarColors";
import News from "./pages/News";
import Ads from "./pages/Ads";
import Settings from "./pages/Settings";

const getAuth = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return Boolean(token && user.role === "admin");
};

const App = () => {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(getAuth);

  useEffect(() => {
    setIsAuth(getAuth());
  }, [location.pathname]);

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
        <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={protectedPage(Dashboard)} />
        <Route path="/users" element={protectedPage(Users)} />
        <Route path="/users/:id" element={protectedPage(UserDetails)} />
        <Route path="/routes" element={protectedPage(MRoutes)} />
        <Route path="/requests" element={protectedPage(Requests)} />
        <Route path="/directories/cities" element={protectedPage(DirectoriesCities)} />
        <Route path="/directories/brands" element={protectedPage(DirectoriesCarBrands)} />
        <Route path="/directories/models" element={protectedPage(DirectoriesCarModels)} />
        <Route path="/directories/colors" element={protectedPage(DirectoriesCarColors)} />
        <Route path="/news" element={protectedPage(News)} />
        <Route path="/ads" element={protectedPage(Ads)} />
        <Route path="/settings" element={protectedPage(Settings)} />
      </Routes>
    </DeviceGuard>
  );
};

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import DeviceGuard from "./components/layout/DeviceGuard";
import AdminLayout from "./components/layout/AdminLayout";
import LoginPage from "./pages/auth/LoginPage";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import MRoutes from "./pages/Routes";
import Requests from "./pages/Requests";
import DirectoriesCities from "./pages/DirectoriesCities";
import DirectoriesCarBrands from "./pages/DirectoriesCarBrands";
import DirectoriesCarModels from "./pages/DirectoriesCarModels";
import DirectoriesCarColors from "./pages/DirectoriesCarColors";
import News from "./pages/News";
import Ads from "./pages/Ads";
import Settings from "./pages/Settings";

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

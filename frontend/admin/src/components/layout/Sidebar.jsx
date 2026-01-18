// src/components/layout/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, Users, Route, ClipboardList, BookOpen, LogOut, PanelLeft, ChevronDown, MapPin, Car, CarFront, Palette, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo.svg";
import logoShort from "../../assets/logo-short.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);
  const [directoriesOpen, setDirectoriesOpen] = useState(false);

  return (
    <div className={`h-screen bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[260px]"} px-4 py-6`}>
      <div>
        {/* HEADER */}
        <div className={`flex items-center mb-5 ${collapsed ? "justify-center" : "justify-between"}`} onMouseEnter={() => setHoverLogo(true)} onMouseLeave={() => setHoverLogo(false)}>
          {!collapsed && (
            <>
              <img src={logo} alt="VOOM" className="h-10 px-4" />
              <div onClick={() => setCollapsed(true)} className="h-8 w-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 transition">
                <PanelLeft size={20} />
              </div>
            </>
          )}

          {collapsed && (
            <>
              {!hoverLogo && <img src={logoShort} alt="VOOM" className="h-8" />}
              {hoverLogo && (
                <div onClick={() => setCollapsed(false)} className="h-8 w-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <PanelLeft size={20} />
                </div>
              )}
            </>
          )}
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-2">
          <div onClick={() => navigate("/dashboard")} className={`flex items-center gap-3 rounded-xl cursor-pointer transition ${collapsed ? "justify-center px-2 py-3" : "px-4 py-3"} ${pathname === "/dashboard" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
            <LayoutGrid size={22} />
            {!collapsed && <span className="text-[16px] font-medium">Главная</span>}
          </div>

          <div onClick={() => navigate("/users")} className={`flex items-center gap-3 rounded-xl cursor-pointer transition ${collapsed ? "justify-center px-2 py-3" : "px-4 py-3"} ${pathname === "/users" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
            <Users size={22} />
            {!collapsed && <span className="text-[16px] font-medium">Пользователи</span>}
          </div>

          <div onClick={() => navigate("/routes")} className={`flex items-center gap-3 rounded-xl cursor-pointer transition ${collapsed ? "justify-center px-2 py-3" : "px-4 py-3"} ${pathname === "/routes" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
            <Route size={22} />
            {!collapsed && <span className="text-[16px] font-medium">Маршруты</span>}
          </div>

          <div onClick={() => navigate("/requests")} className={`flex items-center gap-3 rounded-xl cursor-pointer transition ${collapsed ? "justify-center px-2 py-3" : "px-4 py-3"} ${pathname === "/requests" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
            <ClipboardList size={22} />
            {!collapsed && <span className="text-[16px] font-medium">Заявки</span>}
          </div>

          {/* DIRECTORIES */}
          <div>
            <div onClick={() => !collapsed && setDirectoriesOpen(!directoriesOpen)} className={`flex items-center gap-3 rounded-xl cursor-pointer transition ${collapsed ? "justify-center px-2 py-3" : "px-4 py-3"} hover:bg-gray-100`}>
              <BookOpen size={22} />
              {!collapsed && (
                <>
                  <span className="text-[16px] font-medium flex-1">Справочники</span>
                  <ChevronDown size={18} className={`transition ${directoriesOpen ? "rotate-0" : "-rotate-90"}`} />
                </>
              )}
            </div>

            {!collapsed && directoriesOpen && (
              <div className="flex flex-col gap-1 mt-1 px-4">
                <div onClick={() => navigate("/directories/cities")} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${pathname === "/directories/cities" ? "bg-gray-100 text-black" : "text-black hover:bg-gray-100"}`}>
                  <MapPin size={20} />
                  <span className="text-[16px] font-medium">Города</span>
                </div>

                <div onClick={() => navigate("/directories/brands")} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${pathname === "/directories/brands" ? "bg-gray-100 text-black" : "text-black hover:bg-gray-100"}`}>
                  <Car size={20} />
                  <span className="text-[16px] font-medium">Марки автомобилей</span>
                </div>

                <div onClick={() => navigate("/directories/models")} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${pathname === "/directories/models" ? "bg-gray-100 text-black" : "text-black hover:bg-gray-100"}`}>
                  <CarFront size={20} />
                  <span className="text-[16px] font-medium">Модели автомобилей</span>
                </div>

                <div onClick={() => navigate("/directories/colors")} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${pathname === "/directories/colors" ? "bg-gray-100 text-black" : "text-black hover:bg-gray-100"}`}>
                  <Palette size={20} />
                  <span className="text-[16px] font-medium">Цвета автомобилей</span>
                </div>
              </div>
            )}
          </div>

          {/* SETTINGS */}
          <div onClick={() => navigate("/settings")} className={`flex items-center gap-3 rounded-xl cursor-pointer transition ${ collapsed ? "justify-center px-2 py-3" : "px-4 py-3" } ${pathname === "/settings" ? "bg-gray-100" : "hover:bg-gray-100"}`} >
            <SettingsIcon size={22} />
            {!collapsed && <span className="text-[16px] font-medium">Настройки</span>}
          </div>
        </div>
      </div>

      {/* LOGOUT */}
      <div onClick={() => { localStorage.removeItem("admin_auth"); navigate("/login"); }} className={`flex items-center gap-3 rounded-xl cursor-pointer transition text-red-600 hover:bg-gray-100 ${collapsed ? "justify-center px-2 py-3" : "px-4 py-3"}`}>
        <LogOut size={22} />
        {!collapsed && <span className="text-[16px] font-medium">Выйти</span>}
      </div>
    </div>
  );
};

export default Sidebar;

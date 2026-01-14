// src/components/layout/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, Users, Route, ClipboardList, BookOpen, LogOut, PanelLeft } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo.svg";
import logoShort from "../../assets/logo-short.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);

  const menu = [
    { label: "Главная", path: "/dashboard", icon: LayoutGrid },
    { label: "Пользователи", path: "/users", icon: Users },
    { label: "Маршруты", path: "/routes", icon: Route },
    { label: "Заявки", path: "/requests", icon: ClipboardList },
    { label: "Справочники", path: "/directories", icon: BookOpen },
  ];

  return (
    <div className={`h-screen bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[260px]"} px-4 py-6`}>
      <div>
        {/* HEADER */}
        <div
          className={`flex items-center mb-5 ${collapsed ? "justify-center" : "justify-between"}`}
          onMouseEnter={() => setHoverLogo(true)}
          onMouseLeave={() => setHoverLogo(false)}
        >
          {/* EXPANDED */}
          {!collapsed && (
            <>
              <img src={logo} alt="VOOM" className="h-10 px-4 " />
              <div onClick={() => setCollapsed(true)} className="h-8 w-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 transition">
                <PanelLeft size={20} />
              </div>
            </>
          )}

          {/* COLLAPSED */}
          {collapsed && (
            <>
              {!hoverLogo && <img src={logoShort} alt="VOOM" className="h-8" />}
              {hoverLogo && (
                <div
                  onClick={() => setCollapsed(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 transition"
                >
                  <PanelLeft size={20} />
                </div>
              )}
            </>
          )}
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 rounded-xl cursor-pointer transition ${
                  collapsed ? "justify-center px-2 py-3" : "px-4 py-3"
                } ${active ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <Icon size={22} />
                {!collapsed && <span className="text-[16px] font-medium">{item.label}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* LOGOUT */}
      <div
        onClick={() => {
          localStorage.removeItem("admin_auth");
          navigate("/login");
        }}
        className={`flex items-center gap-3 rounded-xl cursor-pointer transition text-red-600 hover:bg-gray-100 ${
          collapsed ? "justify-center px-2 py-3" : "px-4 py-3"
        }`}
      >
        <LogOut size={22} />
        {!collapsed && <span className="text-[16px] font-medium">Выйти</span>}
      </div>
    </div>
  );
};

export default Sidebar;

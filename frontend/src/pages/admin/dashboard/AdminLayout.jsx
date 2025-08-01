// src/pages/admin/dashboard/AdminLayout.jsx
import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  Users as UsersIcon,
  Map as MapIcon,
  LogOut as LogoutIcon,
  LayoutDashboard as DashboardIcon
} from 'lucide-react';

import logo from '../../../assets/logo.svg';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate(`/${lang}/admin/login`);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo" onClick={() => navigate(`/${lang}/admin/dashboard`)}>
          <img src={logo} alt="VOOM" />
        </div>

        <nav className="admin-nav">
          <NavLink to={`/${lang}/admin/dashboard`} end className={({ isActive }) => isActive ? 'active-link' : ''} >
            <DashboardIcon className="nav-icon" />
            Главная
          </NavLink>

          <NavLink to={`/${lang}/admin/dashboard/users`} className={({ isActive }) => isActive ? 'active-link' : ''}>
            <UsersIcon className="nav-icon" />
            Пользователи
          </NavLink>

          <NavLink to={`/${lang}/admin/dashboard/locations`} className={({ isActive }) => isActive ? 'active-link' : ''}>
            <MapIcon className="nav-icon" />
            Локации
          </NavLink>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <LogoutIcon className="nav-icon" />
          Выйти
        </button>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

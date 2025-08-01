// src/AdminWrapper.jsx
import React from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/dashboard/AdminLayout';
import AdminHome from './pages/admin/dashboard/AdminHome';
import Users from './pages/admin/dashboard/Users';
import LocationsModule from './pages/admin/dashboard/Locations';
import UserDetails from './pages/admin/dashboard/UserDetails'; // 🔹 Новый компонент

const AdminWrapper = () => {
  const { lang } = useParams();
  const location = useLocation();

  const supportedLangs = ['ru', 'uz', 'en'];
  if (!supportedLangs.includes(lang)) {
    return <Navigate to="/ru/admin/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route path="/dashboard/*" element={
        <AdminLayout>
          <Routes>
            <Route path="" element={<AdminHome />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetails />} /> {/* 🔹 Новый маршрут */}
            <Route path="locations" element={<LocationsModule />} />
            <Route path="*" element={<Navigate to={`/${lang}/admin/dashboard`} replace />} />
          </Routes>
        </AdminLayout>
      } />

      <Route path="*" element={<Navigate to={`/${lang}/admin/dashboard`} replace />} />
    </Routes>
  );
};

export default AdminWrapper;

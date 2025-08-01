import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import i18n from './i18n';

import Header from './components/Header';
import Hero from './components/Hero';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import RegisterCodePage from './pages/register/RegisterCodePage';
import RegisterPasswordPage from './pages/register/RegisterPasswordPage';
import ForgotPage from './pages/forgot/ForgotPage';
import ForgotCodePage from './pages/forgot/ForgotCodePage';
import ForgotResetPage from './pages/forgot/ForgotResetPage';
import ProfileMenu from './pages/profile/ProfileMenu';
import ProfilePhotoUpload from './pages/profile/ProfilePhotoUpload';
import ProfileEditInfo from './pages/profile/ProfileEditInfo';
import ProfileAccount from './pages/profile/ProfileAccount';
import VerifyPhone from './pages/profile/VerifyPhone';
import AdminWrapper from './AdminWrapper';
import RoutePreviewPage from './pages/RoutePreviewPage';
import UploadPassport from './pages/profile/UploadPassport';
import CreateRoute from './pages/routes/CreateRoute';
import SearchResults from './pages/routes/SearchResults';




import './App.css';

const LangWrapper = () => {
  const { lang } = useParams();
  const location = useLocation();

  // Переключаем язык при загрузке
  useEffect(() => {
    if (['ru', 'uz', 'en'].includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  // Валидируем язык
  if (!['ru', 'uz', 'en'].includes(lang)) {
    return <Navigate to="/ru" replace />;
  }

  // Определение типов страниц
  const isAuthPage =
    location.pathname.includes('/login') ||
    location.pathname.includes('/register') ||
    location.pathname.includes('/forgot-password');

  const isAdminPage = location.pathname.includes('/admin/');
  const isPreviewPage = location.pathname.includes('/preview'); // ✅ новое условие

  return (
    <>
      {!isAuthPage && !isAdminPage && !isPreviewPage && <Header />}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/code" element={<RegisterCodePage />} />
        <Route path="/register/password" element={<RegisterPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/forgot-password/code" element={<ForgotCodePage />} />
        <Route path="/forgot-password/reset" element={<ForgotResetPage />} />
        <Route path="/profile/menu" element={<ProfileMenu />} />
        <Route path="/profile/add-photo" element={<ProfilePhotoUpload />} />
        <Route path="/profile/edit-info" element={<ProfileEditInfo />} />
        <Route path="/profile/account" element={<ProfileAccount />} />
        <Route path="/profile/upload-passport" element={<UploadPassport />} />
        <Route path="/verify-email-callback" element={<Navigate to={`/${lang}/profile/menu?email_verified=true`} />} />
        <Route path="/verify-phone" element={<VerifyPhone />} />
        <Route path="/admin/*" element={<AdminWrapper />} />
        <Route path="/preview" element={<RoutePreviewPage />} />
        <Route path="/create-route" element={<CreateRoute />} />
        <Route path="/routes" element={<SearchResults />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/:lang/*" element={<LangWrapper />} />
      <Route path="*" element={<Navigate to="/ru" replace />} />
    </Routes>
  );
};

export default App;

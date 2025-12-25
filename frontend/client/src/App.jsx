import React, { useEffect } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Home from "./pages/Home";
import About from "./pages/About";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CreateRoute from "./pages/createRoute/CreateRoute";
import ProfileMenu from "./pages/profile/ProfileMenu";
import ProfileAccount from "./pages/profile/ProfileAccount";
import EditProfileInfo from "./components/profile/EditProfileInfo";
import ProfilePhoto from "./components/profile/ProfilePhoto";
import PhoneVerification from "./components/profile/PhoneVerification";
import PassportVerification from "./components/profile/PassportVerification";
import EmailVerification from "./components/profile/EmailVerification";
import Balance from "./components/profile/Balance";
import BalanceTopUp from "./components/profile/BalanceTopUp";
import TransactionHistory from "./components/profile/TransactionHistory";
import MyBookings from "./components/profile/MyBookings";
import MyRoutes from "./components/profile/MyRoutes";
import ChatMessenger from "./components/profile/ChatMessenger";
import MyTransport from "./components/profile/MyTransport.jsx";





// Обертка, которая подхватывает язык из URL
function LangWrapper({ Component }) {
  const { i18n } = useTranslation();
  const { lang } = useParams();

  const supported = ["ru", "uz", "en"];

  useEffect(() => {
    if (supported.includes(lang)) {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage("ru");
    }
  }, [lang]);

  return <Component lang={lang} />;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <main className="flex-1">
        <Routes>

          {/* Редирект корня → /ru */}
          <Route path="/" element={<Navigate to="/ru" replace />} />

          {/* Главная */}
          <Route path="/:lang" element={<LangWrapper Component={Home} />} />
          <Route path="/:lang/about" element={<LangWrapper Component={About} />} />
          <Route path="/:lang/news" element={<LangWrapper Component={News} />} />
          <Route path="/:lang/contacts" element={<LangWrapper Component={Contact} />} />

          {/* Логин */}
          <Route path="/:lang/login" element={<LangWrapper Component={Login} />} />

          {/* Регистрация */}
          <Route path="/:lang/register" element={<LangWrapper Component={Register} />} />

          {/* Создание маршрута */}
          <Route path="/:lang/create-route" element={<LangWrapper Component={CreateRoute} />} />
          {/* Профиль - О себе */}
          <Route path="/:lang/profile/menu" element={<LangWrapper Component={ProfileMenu} />} />
          {/* Профиль - Учётная запись */}
          <Route path="/:lang/profile/account" element={<LangWrapper Component={ProfileAccount} />} />
          {/* Профиль — Редактировать информацию о себе */}
          <Route path="/:lang/profile/edit" element={<LangWrapper Component={EditProfileInfo} />} />
          {/* Профиль — Фото профиля */}
          <Route path="/:lang/profile/photo" element={<LangWrapper Component={ProfilePhoto} />}/>
          {/* Профиль — Подтвреждение тел. номера */}
          <Route path="/:lang/profile/phone-verification" element={<LangWrapper Component={PhoneVerification} />} />
          {/* Профиль — Проверка пасорта */}
          <Route path="/:lang/profile/passport-verification" element={<LangWrapper Component={PassportVerification} />} />
          {/* Профиль — Подтвреждение email адреса */}
          <Route path="/:lang/profile/email-verification" element={<LangWrapper Component={EmailVerification} />} />
          {/* Профиль — Баланс  */}
          <Route path="/:lang/profile/balance" element={<LangWrapper Component={Balance} />} />
          {/* Профиль — Пополнение баланса */}
          <Route path="/:lang/profile/balance/top-up" element={<LangWrapper Component={BalanceTopUp} />} />
          {/* Профиль — История операций */}
          <Route path="/:lang/profile/balance/history" element={<LangWrapper Component={TransactionHistory} />} />
          {/* Профиль — Мои бронирования */}
          <Route path="/:lang/profile/bookings" element={<LangWrapper Component={MyBookings} />} />
          {/* Профиль — Мои Маршруты */}
          <Route path="/:lang/profile/routes" element={<LangWrapper Component={MyRoutes} />} />
          {/* Профиль — Чат */}
          <Route path="/:lang/profile/chat" element={<LangWrapper Component={ChatMessenger} />} />
          {/* Профиль — Транспорт*/}
          <Route path="/:lang/profile/transport" element={<LangWrapper Component={MyTransport} />} />





          {/* 404 → /ru */}
          <Route path="*" element={<Navigate to="/ru" replace />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;

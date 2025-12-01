import React, { useEffect } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CreateRoute from "./pages/createRoute/CreateRoute";

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

          {/* Логин */}
          <Route path="/:lang/login" element={<LangWrapper Component={Login} />} />

          {/* Регистрация */}
          <Route path="/:lang/register" element={<LangWrapper Component={Register} />} />

          {/* Создание маршрута */}
          <Route path="/:lang/create-route" element={<LangWrapper Component={CreateRoute} />} />

          {/* 404 → /ru */}
          <Route path="*" element={<Navigate to="/ru" replace />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;

import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// pages
import Home from "./pages/Home";
import Help from "./pages/Help";
import Article from "./pages/Article";

// обёртка для языка
const LangWrapper = ({ Component }) => {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  const supported = ["ru", "uz", "en"];

  useEffect(() => {
    if (supported.includes(lang)) {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage("ru");
    }
  }, [lang]);

  return <Component />;
};

function App() {
  return (
    <Routes>

      {/* redirect */}
      <Route path="/" element={<Navigate to="/ru" replace />} />

      {/* home */}
      <Route path="/:lang" element={<LangWrapper Component={Home} />} />

      {/* help sections */}
      <Route
        path="/:lang/help/:section"
        element={<LangWrapper Component={Help} />}
      />

      {/* articles */}
      <Route
        path="/:lang/help/:section/:slug"
        element={<LangWrapper Component={Article} />}
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/ru" replace />} />

    </Routes>
  );
}

export default App;
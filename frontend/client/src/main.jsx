import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./i18n";         // 🔥 ВАЖНО: подключаем мультиязычность
import "./index.css";
import { ToastProvider } from "./components/ui/ToastProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <ToastProvider>
      <App />
    </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);

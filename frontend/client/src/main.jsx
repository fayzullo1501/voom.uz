import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import "./i18n";
import "./index.css";

import { ToastProvider } from "./components/ui/ToastProvider";
import { UserProvider } from "./context/UserContext";
import queryClient from "./lib/queryClient";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </UserProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
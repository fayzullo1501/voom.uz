// src/components/ui/ToastProvider.jsx
import { createContext, useRef, useState } from "react";
import Toast from "./Toast";

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = (message, type = "info") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed top-6 right-6 z-50 w-[360px]">
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </div>
      )}
    </ToastContext.Provider>
  );
};

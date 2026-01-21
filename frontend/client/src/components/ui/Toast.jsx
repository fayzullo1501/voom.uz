// src/components/ui/Toast.jsx
import React from "react";
import { CheckCircle2, Info, AlertTriangle, AlertOctagon, X } from "lucide-react";

const Toast = ({ type = "error", message, onClose }) => {
  const variants = {
    success: { wrap: "bg-green-50 border-green-200 text-green-900", iconWrap: "bg-green-100 text-green-600", Icon: CheckCircle2 },
    info: { wrap: "bg-blue-50 border-blue-200 text-blue-900", iconWrap: "bg-blue-100 text-blue-600", Icon: Info },
    warning: { wrap: "bg-amber-50 border-amber-200 text-amber-900", iconWrap: "bg-amber-100 text-amber-600", Icon: AlertTriangle },
    error: { wrap: "bg-red-50 border-red-200 text-red-900", iconWrap: "bg-red-100 text-red-600", Icon: AlertOctagon },
  };

  const v = variants[type] || variants.info;
  const Icon = v.Icon;

  return (
    <div className={`w-full border rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3 ${v.wrap}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${v.iconWrap}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 text-[14px] font-medium leading-5">{message}</div>
      <button type="button" onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 transition">
        <X className="w-5 h-5 opacity-70" />
      </button>
    </div>
  );
};

export default Toast;

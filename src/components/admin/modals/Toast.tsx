import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 text-xs font-bold backdrop-blur-md ${
          type === "success"
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : type === "error"
            ? "bg-red-50 border-red-500/20 text-red-400"
            : "bg-[#FFFFFF]/80 border-[#475569]/35 text-[#0F172A]"
        }`}
      >
        {type === "success" && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
        {type === "error" && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
        {type === "info" && <Info className="w-5 h-5 text-[#0F172A] shrink-0" />}
        <span>{message}</span>
        <button onClick={onClose} className="p-1 text-[#475569] hover:text-[#0F172A] ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

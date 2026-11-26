import React from "react";
import { Capacitor } from "@capacitor/core";
import { Download } from "lucide-react";

interface DownloadAppBannerProps {
  compact?: boolean;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
}

export const DownloadAppBanner: React.FC<DownloadAppBannerProps> = ({
  compact = false,
}) => {
  // Hide when already running inside the installed native Android app
  if (Capacitor.isNativePlatform()) return null;

  return (
    <div className={`w-full flex justify-center ${compact ? "mt-5" : "mt-8 pb-2"}`}>
      <a
        href="./Adv-Sikandar-Khan-App.apk"
        download="Adv-Sikandar-Khan-App.apk"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold text-sm shadow-md shadow-[#1D4ED8]/25 transition-all active:scale-[0.98] cursor-pointer"
      >
        <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Download App</span>
      </a>
    </div>
  );
};

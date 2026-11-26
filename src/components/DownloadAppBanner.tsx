import React from "react";
import { Capacitor } from "@capacitor/core";
import { Download, Smartphone, ShieldCheck, CheckCircle2 } from "lucide-react";

interface DownloadAppBannerProps {
  compact?: boolean;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
}

export const DownloadAppBanner: React.FC<DownloadAppBannerProps> = ({
  compact = false,
  onInstallPwa,
  canInstallPwa = false,
}) => {
  // Hide download prompt when already running inside the installed native Android app
  if (Capacitor.isNativePlatform()) return null;

  return (
    <section
      aria-label="Download Android Mobile App"
      className={`w-full ${
        compact ? "max-w-md mt-5" : "mt-8"
      } bg-white/95 backdrop-blur-xl border border-[#1D4ED8]/20 rounded-3xl p-5 sm:p-6 shadow-[0_12px_36px_rgba(29,78,216,0.10)]`}
    >
      <div className={`flex ${compact ? "flex-col gap-4" : "flex-col sm:flex-row items-start sm:items-center justify-between gap-5"}`}>
        <div className="flex items-center gap-4 min-w-0">
          <img
            src="./icons/icon-192.png"
            alt="Advocate Sikandar Khan App Icon"
            className="w-14 h-14 rounded-2xl shadow-md border border-[#1D4ED8]/15 shrink-0 object-cover"
          />
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] truncate">
                Adv. Sikandar Khan — Mobile App
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#1D4ED8]/20 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                Android APK
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Complete offline-ready Android app with all files, case records, PDFs &amp; entry logo bundled — installs directly like a Play Store app.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-[#1E40AF] pt-0.5">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> All Assets Bundled
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Works Offline
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> v1.0 Free
              </span>
            </div>
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-2.5 ${compact ? "w-full" : "shrink-0"}`}>
          <a
            href="./Adv-Sikandar-Khan-App.apk"
            download="Adv-Sikandar-Khan-App.apk"
            className={`${
              compact ? "flex-1" : ""
            } inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#1D4ED8]/25 transition-all active:scale-[0.98] cursor-pointer`}
          >
            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Download App (APK)</span>
          </a>

          {canInstallPwa && onInstallPwa && (
            <button
              type="button"
              onClick={onInstallPwa}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] border border-[#1D4ED8]/25 font-bold text-xs transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4" aria-hidden="true" />
              <span>Install PWA</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};


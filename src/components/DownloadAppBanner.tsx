import React, { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Download, Smartphone, Share, X } from "lucide-react";

interface DownloadAppBannerProps {
  compact?: boolean;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
}

export const DownloadAppBanner: React.FC<DownloadAppBannerProps> = ({
  compact = false,
}) => {
  const [showIosGuide, setShowIosGuide] = useState(false);

  // Hide when already running inside native Android/iOS app or installed iOS Home Screen app
  const isIosStandalone =
    typeof window !== "undefined" && Boolean((window.navigator as any).standalone);
  if (Capacitor.isNativePlatform() || isIosStandalone) return null;

  return (
    <>
      <div className={`w-full flex flex-wrap items-center justify-center gap-3 ${compact ? "mt-5" : "mt-8 pb-2"}`}>
        {/* Android APK Download Button */}
        <a
          href="./Adv-Sikandar-Khan-App.apk"
          download="Adv-Sikandar-Khan-App.apk"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold text-sm shadow-md shadow-[#1D4ED8]/25 transition-all active:scale-[0.98] cursor-pointer min-w-[150px]"
        >
          <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Android</span>
        </a>

        {/* iOS App Download Button */}
        <a
          href="./Adv-Sikandar-Khan-iOS.mobileconfig"
          download="Adv-Sikandar-Khan-iOS.mobileconfig"
          onClick={() => setShowIosGuide(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm shadow-md shadow-[#0F172A]/20 transition-all active:scale-[0.98] cursor-pointer min-w-[150px]"
        >
          <Smartphone className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>iOS</span>
        </a>
      </div>

      {/* Minimal iOS Install Helper Modal (shown only when iOS button is clicked) */}
      {showIosGuide && (
        <div
          className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowIosGuide(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white border border-[#1D4ED8]/20 rounded-3xl p-5 shadow-2xl space-y-4 text-[#0F172A]"
          >
            <div className="flex items-center justify-between">
              <h3 id="ios-install-title" className="text-base font-bold">
                Install on iPhone / iPad
              </h3>
              <button
                type="button"
                aria-label="Close iOS install instructions"
                onClick={() => setShowIosGuide(false)}
                className="p-1.5 rounded-full text-[#475569] hover:bg-[#EFF6FF] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#475569] leading-relaxed">
              <p className="font-semibold text-[#0F172A]">Option 1 — Downloaded iOS Profile:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Tap <strong>Allow</strong> when Safari asks to download the profile.</li>
                <li>Open iPhone <strong>Settings → Profile Downloaded</strong>.</li>
                <li>Tap <strong>Install</strong> to add the full-screen app to your Home Screen.</li>
              </ol>

              <div className="pt-2 border-t border-[#475569]/15">
                <p className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <Share className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
                  Option 2 — Direct from Safari:
                </p>
                <p className="mt-1">
                  Tap the <strong>Share</strong> icon in Safari → <strong>Add to Home Screen</strong> → <strong>Add</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold text-xs cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

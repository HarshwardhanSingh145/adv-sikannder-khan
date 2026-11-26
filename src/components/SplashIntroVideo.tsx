import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";

interface SplashIntroVideoProps {
  onComplete: () => void;
}

export const SplashIntroVideo: React.FC<SplashIntroVideoProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const completedRef = useRef(false);

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (Capacitor.isNativePlatform()) {
      if (Capacitor.getPlatform() === "android") {
        StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
      }
      StatusBar.show().catch(() => {});
    }
    onComplete();
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    if (Capacitor.isNativePlatform()) {
      if (Capacitor.getPlatform() === "android") {
        StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
      }
      StatusBar.hide().catch(() => {});
    }

    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        finish();
      });
    }

    // Safety fallback so splash never stalls (video is 3s)
    const fallbackTimer = setTimeout(finish, 4500);
    return () => {
      clearTimeout(fallbackTimer);
      if (Capacitor.isNativePlatform()) {
        StatusBar.show().catch(() => {});
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] w-screen h-dvh bg-black overflow-hidden"
    >
      <video
        ref={videoRef}
        src="./logo-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        className="w-full h-full object-cover object-center block"
      />

      <button
        type="button"
        onClick={finish}
        className="fixed top-4 right-4 safe-pt px-4 py-1.5 rounded-full bg-black/55 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
      >
        Skip
      </button>
    </motion.div>
  );
};

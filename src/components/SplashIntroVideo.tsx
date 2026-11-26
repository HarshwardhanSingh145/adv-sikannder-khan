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
        if (Capacitor.getPlatform() === "android") {
          StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
        }
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
      className="fixed inset-0 z-[100] w-screen h-dvh bg-[#F7F7F7] overflow-hidden"
    >
      <video
        ref={videoRef}
        src="./logo-intro.mp4"
        poster="./logo-intro-poster.jpg"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        className="w-full h-full object-cover object-center block"
      />
    </motion.div>
  );
};

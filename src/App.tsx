/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import { AdminAuthScreen } from "./components/admin/AdminAuthScreen";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { SplashIntroVideo } from "./components/SplashIntroVideo";
import { AnimatePresence, MotionConfig } from "motion/react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import Lenis from "lenis";

export default function App() {
  useEffect(() => {
    // Configure native mobile status bar & splash screen when running in Capacitor
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: "#1D4ED8" }).catch(() => {});
      SplashScreen.hide().catch(() => {});
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <AdminProvider>
          <MainLayout />
        </AdminProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}

function MainLayout() {
  const { isLoggedIn } = useAdmin();
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div
      className="min-h-screen text-[#1E40AF] font-sans relative overflow-x-hidden selection:bg-[#475569]/20 selection:text-[#0F172A]"
      id="app-root"
    >
      <AnimatePresence mode="wait">
        {showIntro ? (
          <SplashIntroVideo key="intro" onComplete={() => setShowIntro(false)} />
        ) : !isLoggedIn ? (
          <AdminAuthScreen key="auth" />
        ) : (
          <AdminDashboard key="dashboard" onClose={() => {}} />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import { AdminAuthScreen } from "./components/admin/AdminAuthScreen";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AnimatePresence } from "motion/react";
import Lenis from "lenis";

export default function App() {
  useEffect(() => {
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
    <LanguageProvider>
      <AdminProvider>
        <MainLayout />
      </AdminProvider>
    </LanguageProvider>
  );
}

function MainLayout() {
  const { isLoggedIn } = useAdmin();

  return (
    <div
      className="min-h-screen text-[#382F25] font-sans relative overflow-x-hidden selection:bg-[#706C61]/20 selection:text-[#221C16]"
      id="app-root"
    >
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <AdminAuthScreen key="auth" />
        ) : (
          <AdminDashboard key="dashboard" onClose={() => {}} />
        )}
      </AnimatePresence>
    </div>
  );
}

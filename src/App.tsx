/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import { AdminAuthScreen } from "./components/admin/AdminAuthScreen";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AnimatePresence, MotionConfig } from "motion/react";

export default function App() {
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

  return (
    <div
      className="min-h-dvh text-[#1E40AF] font-sans relative overflow-x-hidden selection:bg-[#475569]/20 selection:text-[#0F172A]"
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

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAdmin } from "../../context/AdminContext";
import { Lock, ArrowRight } from "lucide-react";
import { PremiumBackground } from "./PremiumBackground";

export function AdminAuthScreen() {
  const { loginWithPin } = useAdmin();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning ☀️");
    else if (hour < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginWithPin(pin)) {
      setError("");
    } else {
      setError("Invalid password");
      setPin("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <PremiumBackground />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="relative z-10 w-full max-w-md p-10 bg-white/85 backdrop-blur-2xl border border-[#706C61]/25 rounded-3xl shadow-[0_20px_50px_rgba(82,71,56,0.15)]"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-light tracking-tight text-[#221C16] mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-[#382F25] font-medium"
          >
            Hello, Sikander Khan 👋
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#706C61] font-semibold text-sm mt-1 mb-2"
          >
            {greeting}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[#706C61]/80 text-sm"
          >
            Welcome back to your workspace.
          </motion.p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#706C61] group-focus-within:text-[#221C16] transition-colors" />
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              className="w-full bg-white border border-[#706C61]/30 rounded-2xl pl-12 pr-4 py-4 text-[#221C16] placeholder-[#706C61]/50 focus:outline-none focus:border-[#524738] focus:ring-2 focus:ring-[#524738]/10 transition-all duration-300 shadow-inner"
              placeholder="Enter your password"
              autoFocus
            />
            {error && (
              <p className="absolute -bottom-6 left-2 text-red-600 font-semibold text-xs">{error}</p>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative group overflow-hidden rounded-2xl bg-[#524738] text-[#EFE9DC] font-medium py-4 flex items-center justify-center gap-2 shadow-lg shadow-[#524738]/20 hover:bg-[#382F25] cursor-pointer transition-colors"
          >
            <span className="relative z-10">Access Workspace</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

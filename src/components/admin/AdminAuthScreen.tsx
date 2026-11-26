import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAdmin } from "../../context/AdminContext";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { PremiumBackground } from "./PremiumBackground";

export function AdminAuthScreen() {
  const { loginWithPin, failedPinAttempts, lockoutEndTime } = useAdmin();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
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
    if (lockoutEndTime && Date.now() < lockoutEndTime) {
      const remainingSecs = Math.ceil((lockoutEndTime - Date.now()) / 1000);
      setError(`Account temporarily locked. Try again in ${remainingSecs}s.`);
      return;
    }
    if (!pin.trim()) {
      setError("Please enter your security PIN.");
      return;
    }
    if (loginWithPin(pin)) {
      setError("");
    } else {
      const remaining = Math.max(0, 2 - failedPinAttempts);
      setError(
        remaining > 0
          ? `Invalid PIN. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Too many failed attempts. Locked for 2 minutes."
      );
      setPin("");
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 min-h-dvh"
    >
      <PremiumBackground />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="relative z-10 w-full max-w-md p-7 sm:p-10 bg-white/85 backdrop-blur-2xl border border-[#706C61]/25 rounded-3xl shadow-[0_20px_50px_rgba(82,71,56,0.15)]"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl sm:text-4xl font-light tracking-tight text-[#221C16] mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-lg sm:text-xl text-[#382F25] font-medium"
          >
            Hello, Sikander Khan 👋
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#706C61] font-semibold text-sm mt-1 mb-2"
          >
            {greeting}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-[#706C61]/80 text-sm"
          >
            Welcome back to your chamber workspace.
          </motion.p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-1.5"
          >
            <label htmlFor="workspace-pin" className="block text-xs font-semibold text-[#524738] pl-1">
              Workspace Security PIN
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#706C61] group-focus-within:text-[#221C16] transition-colors" aria-hidden="true" />
              </div>
              <input
                id="workspace-pin"
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                autoComplete="current-password"
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? "workspace-pin-error" : undefined}
                className="w-full bg-white border border-[#706C61]/30 rounded-2xl pl-12 pr-12 py-4 text-[#221C16] placeholder-[#706C61]/50 focus:outline-none focus:border-[#524738] focus:ring-2 focus:ring-[#524738]/15 transition-all duration-200 shadow-inner"
                placeholder="Enter your PIN (default: 0000)"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPin((prev) => !prev)}
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#706C61] hover:text-[#221C16] transition-colors cursor-pointer"
              >
                {showPin ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            {error && (
              <p id="workspace-pin-error" role="alert" className="pl-1 text-red-600 font-semibold text-xs">
                {error}
              </p>
            )}
          </motion.div>

          <motion.button
            type="submit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative group overflow-hidden rounded-2xl bg-[#524738] text-[#EFE9DC] font-medium py-4 flex items-center justify-center gap-2 shadow-lg shadow-[#524738]/20 hover:bg-[#382F25] cursor-pointer transition-colors"
          >
            <span className="relative z-10">Access Workspace</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </motion.button>
        </form>
      </motion.div>
    </motion.main>
  );
}

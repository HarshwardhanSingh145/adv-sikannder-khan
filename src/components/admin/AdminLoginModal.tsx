import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Phone,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Scale,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { motion, AnimatePresence } from "motion/react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const {
    loginWithPin,
    failedPinAttempts,
    lockoutEndTime,
    sendForgotPinOtp,
    verifyForgotPinOtp,
    resetPinWithOtp,
    isLoggedIn,
  } = useAdmin();

  const [pinInput, setPinInput] = useState<string>("");
  const [viewMode, setViewMode] = useState<"pin" | "forgot_mobile" | "forgot_otp" | "forgot_reset" | "success">("pin");

  // Forgot PIN form states
  const [mobileInput, setMobileInput] = useState<string>("+91 9257923773");
  const [otpInput, setOtpInput] = useState<string>("");
  const [newPinInput, setNewPinInput] = useState<string>("");
  const [confirmPinInput, setConfirmPinInput] = useState<string>("");

  // Countdown timer for OTP
  const [countdown, setCountdown] = useState<number>(10);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Lockout timer ticker
  useEffect(() => {
    let interval: any;
    if (lockoutEndTime && lockoutEndTime > Date.now()) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((lockoutEndTime - Date.now()) / 1000));
        setLockoutRemaining(remaining);
        if (remaining <= 0) clearInterval(interval);
      }, 1000);
    } else {
      setLockoutRemaining(0);
    }
    return () => clearInterval(interval);
  }, [lockoutEndTime]);

  // OTP Countdown ticker
  useEffect(() => {
    let timer: any;
    if (viewMode === "forgot_otp" && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [viewMode, countdown]);

  if (!isOpen) return null;

  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 6) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      if (nextPin.length === 4 || nextPin.length === 6) {
        // Auto attempt
        setTimeout(() => {
          if (loginWithPin(nextPin)) {
            setPinInput("");
            onClose();
          }
        }, 150);
      }
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginWithPin(pinInput)) {
      setPinInput("");
      onClose();
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (sendForgotPinOtp(mobileInput)) {
      setCountdown(60);
      setViewMode("forgot_otp");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyForgotPinOtp(otpInput)) {
      setViewMode("forgot_reset");
    }
  };

  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput !== confirmPinInput) {
      alert("New Security PIN and Confirm PIN do not match!");
      return;
    }
    if (newPinInput.length < 4) {
      alert("PIN must be at least 4 digits.");
      return;
    }
    if (resetPinWithOtp(newPinInput)) {
      setViewMode("success");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="w-full max-w-md bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden text-[#221C16]"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#706C61]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#706C61] hover:text-[#221C16] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Icon & Brand Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#706C61]/35 bg-[#E2DDD0]/80 mb-3 shadow-md">
              <Scale className="w-7 h-7 text-[#221C16]" />
            </div>
            <h2 className="text-xl font-bold text-[#221C16] font-serif tracking-wider">Advocate Sikandar Khan</h2>
            <p className="text-xs text-[#524738] font-semibold mt-1">Encrypted Advocate Admin Portal</p>
          </div>

          {/* VIEW MODE 1: ENTER PIN */}
          {viewMode === "pin" && (
            <form onSubmit={handlePinSubmit} className="space-y-5">
              {lockoutRemaining > 0 ? (
                <div className="p-4 rounded-xl bg-red-50 border border-red-500/20 text-center">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2 animate-bounce" />
                  <p className="text-sm font-semibold text-red-400">Security Cooldown Engaged</p>
                  <p className="text-xs text-red-700 mt-1">
                    Too many incorrect attempts. Retry in <span className="font-bold text-red-400">{lockoutRemaining}s</span>.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#221C16]/90 mb-2">
                      Enter Security PIN
                    </label>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {[0, 1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`w-10 h-12 rounded-lg border flex items-center justify-center text-xl font-bold transition-all ${
                            pinInput.length > idx
                              ? "border-[#706C61]/35 bg-[#EFE9DC] text-black shadow-lg shadow-black/50"
                              : "border-[#706C61]/35/25 bg-[#E2DDD0]/80 text-[#706C61]/60"
                          }`}
                        >
                          {pinInput.length > idx ? "•" : ""}
                        </div>
                      ))}
                    </div>

                    <input
                      type="password"
                      maxLength={6}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="****"
                      className="w-full text-center py-2 bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-lg text-[#221C16] placeholder-white/30 focus:border-[#706C61]/35 focus:ring-1 focus:ring-white/20 text-lg tracking-widest outline-none font-semibold"
                    />
                  </div>

                  {/* On-screen Keypad */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleKeypadPress(num)}
                        className="py-3 bg-[#E2DDD0]/80 hover:bg-[#EFE9DC] border border-[#706C61]/35/25 rounded-xl text-base font-bold text-[#221C16] hover:text-black transition-all active:scale-95 shadow-md shadow-[#524738]/15"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPinInput("")}
                      className="py-3 bg-red-500/10 hover:bg-red-200 border border-red-500/20 rounded-xl text-xs font-semibold text-red-400 transition-all"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeypadPress("0")}
                      className="py-3 bg-[#E2DDD0]/80 hover:bg-[#EFE9DC] border border-[#706C61]/35/25 rounded-xl text-base font-bold text-[#221C16] hover:text-black transition-all active:scale-95 shadow-md shadow-[#524738]/15"
                    >
                      0
                    </button>
                    <button
                      type="submit"
                      className="py-3 bg-[#EFE9DC] text-black font-bold rounded-xl text-xs hover:bg-[#EFE9DC] transition-all shadow-md"
                    >
                      Login
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-[#706C61] font-semibold">
                      {failedPinAttempts > 0 && `${3 - failedPinAttempts} attempts left`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewMode("forgot_mobile")}
                      className="text-[#221C16] hover:underline font-bold"
                    >
                      Forgot Security PIN?
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* VIEW MODE 2: FORGOT PIN - MOBILE VERIFICATION */}
          {viewMode === "forgot_mobile" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-[#E2DDD0]/80 text-[#221C16] border border-[#706C61]/25 mb-2">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#221C16]">Verify Registered Mobile</h3>
                <p className="text-xs text-[#524738] font-medium mt-1">
                  Enter registered phone number to receive a 6-digit OTP code for PIN recovery.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221C16] mb-1">Registered Mobile Number</label>
                <input
                  type="text"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  placeholder="+91 98290 XXXXX"
                  className="w-full px-4 py-2.5 bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-lg text-[#221C16] placeholder-white/30 text-sm focus:border-[#706C61]/35 outline-none font-semibold"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode("pin")}
                  className="w-1/3 py-2.5 border border-[#706C61]/25 rounded-lg text-xs font-bold text-[#221C16] hover:bg-[#E2DDD0]/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-[#EFE9DC] text-black font-bold rounded-lg text-xs hover:bg-[#EFE9DC] flex items-center justify-center gap-2 shadow-md"
                >
                  Send Verification OTP
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* VIEW MODE 3: VERIFY OTP */}
          {viewMode === "forgot_otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-[#E2DDD0]/80 text-[#221C16] border border-[#706C61]/25 mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#221C16]">Enter 6-Digit OTP</h3>
                <p className="text-xs text-[#524738] font-medium mt-1">
                  Code sent to <span className="text-[#221C16] font-bold">{mobileInput}</span>.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center py-3 bg-[#E2DDD0]/80 border border-[#706C61]/35 rounded-lg text-[#221C16] text-xl tracking-[0.3em] font-bold outline-none focus:border-[#706C61]/35"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#524738] font-semibold">
                <span>
                  OTP Expiry: <strong className="text-[#221C16] font-extrabold">{countdown}s</strong>
                </span>
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={() => sendForgotPinOtp(mobileInput)}
                  className="text-[#221C16] hover:underline disabled:opacity-40 flex items-center gap-1 font-bold"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode("forgot_mobile")}
                  className="w-1/3 py-2.5 border border-[#706C61]/25 rounded-lg text-xs font-bold text-[#221C16]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-[#EFE9DC] text-black font-bold rounded-lg text-xs hover:bg-[#EFE9DC] shadow-md"
                >
                  Verify OTP
                </button>
              </div>
            </form>
          )}

          {/* VIEW MODE 4: RESET PIN */}
          {viewMode === "forgot_reset" && (
            <form onSubmit={handleResetPin} className="space-y-4">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-[#E2DDD0]/80 text-[#221C16] border border-[#706C61]/25 mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#221C16]">Create New Security PIN</h3>
                <p className="text-xs text-[#524738] font-medium mt-1">Set a new 4 or 6-digit PIN for your advocate portal.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221C16] mb-1">New Security PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="****"
                  className="w-full text-center py-2.5 bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-lg text-[#221C16] text-lg tracking-widest outline-none font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221C16] mb-1">Confirm Security PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="****"
                  className="w-full text-center py-2.5 bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-lg text-[#221C16] text-lg tracking-widest outline-none font-semibold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#EFE9DC] text-black font-bold rounded-lg text-xs hover:bg-[#EFE9DC] shadow-md"
              >
                Save New Security PIN
              </button>
            </form>
          )}

          {/* VIEW MODE 5: SUCCESS CONFIRMATION */}
          {viewMode === "success" && (
            <div className="text-center py-4 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-[#221C16]">PIN Reset Successful!</h3>
              <p className="text-xs text-[#524738] font-medium">
                Your Security PIN has been updated. You can now login to Advocate Sikandar Khan's portal.
              </p>
              <button
                onClick={() => setViewMode("pin")}
                className="w-full py-2.5 bg-[#EFE9DC] text-black font-bold rounded-lg text-xs hover:bg-[#EFE9DC] shadow-md"
              >
                Go to PIN Login
              </button>
            </div>
          )}

          {/* Security Footer Note */}
          <div className="mt-6 pt-4 border-t border-[#706C61]/20 text-center text-[10px] text-[#706C61] font-semibold flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#221C16]" />
            256-Bit Encrypted Advocate Workstation Session
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

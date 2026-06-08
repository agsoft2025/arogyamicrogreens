"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import type { User } from "@/store/authStore";
import { sendOtp, verifyOtp } from "@/lib/authApi";

/* ── Constants ──────────────────────────────────────────────── */
const OTP_LENGTH = 6;

/* ── Left brand panel illustration (SVG) ───────────────────── */
function BrandIllustration() {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-48 mx-auto"
      aria-hidden="true"
    >
      {/* Outer dashed ring */}
      <circle cx="140" cy="140" r="128" stroke="#386b00" strokeWidth="1" strokeDasharray="5 9" opacity="0.35" />
      {/* Mid ring */}
      <circle cx="140" cy="140" r="90" stroke="#386b00" strokeWidth="1" opacity="0.25" />
      {/* Background orb */}
      <circle cx="140" cy="140" r="72" fill="#1b3c2a" opacity="0.7" />

      {/* Main stem */}
      <path d="M140 200 L140 130" stroke="#a5f95b" strokeWidth="3" strokeLinecap="round" />

      {/* Left leaf */}
      <path d="M140 158 C118 148 105 130 112 112 C124 132 138 148 140 152" fill="#a5f95b" opacity="0.85" />
      {/* Right leaf */}
      <path d="M140 148 C162 138 175 120 168 102 C156 122 142 138 140 142" fill="#8adb41" opacity="0.9" />
      {/* Lower left leaf */}
      <path d="M140 175 C124 165 116 150 121 138 C130 153 138 163 140 167" fill="#c6ecd1" opacity="0.55" />

      {/* Side sprout left */}
      <path d="M100 195 L100 168" stroke="#386b00" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 180 C88 172 84 160 88 150 C95 163 99 171 100 174" fill="#386b00" opacity="0.65" />

      {/* Side sprout right */}
      <path d="M180 195 L180 168" stroke="#386b00" strokeWidth="2" strokeLinecap="round" />
      <path d="M180 180 C192 172 196 160 192 150 C185 163 181 171 180 174" fill="#386b00" opacity="0.65" />

      {/* Decorative dots */}
      <circle cx="72"  cy="108" r="3"   fill="#386b00" opacity="0.5" />
      <circle cx="208" cy="95"  r="2.5" fill="#a5f95b" opacity="0.4" />
      <circle cx="55"  cy="190" r="4"   fill="#2d4e3a" opacity="0.55" />
      <circle cx="225" cy="182" r="3"   fill="#386b00" opacity="0.45" />
      <circle cx="95"  cy="62"  r="2"   fill="#a5f95b" opacity="0.35" />
      <circle cx="196" cy="230" r="2.5" fill="#386b00" opacity="0.4" />
      <circle cx="45"  cy="140" r="2"   fill="#a5f95b" opacity="0.3" />
      <circle cx="240" cy="140" r="2"   fill="#a5f95b" opacity="0.3" />
    </svg>
  );
}

/* ── Left brand panel ───────────────────────────────────────── */
function BrandPanel() {
  return (
    <div className="hidden md:flex md:w-[42%] shrink-0 bg-[#032616] flex-col justify-between p-10 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#386b00] -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#1b3c2a] translate-y-1/3 -translate-x-1/3" />
      </div>

      {/* Top logo */}
      <div className="relative z-10">
        <span className="font-[var(--font-libre-caslon)] text-2xl font-bold text-white">
          AgriNest
        </span>
      </div>

      {/* Center illustration + headline */}
      <div className="relative z-10 text-center">
        <BrandIllustration />
        <h2 className="font-[var(--font-libre-caslon)] text-3xl font-bold text-white mt-6 leading-tight">
          Fresh Greens,<br />
          <span className="text-[#a5f95b]">Delivered Fresh</span>
        </h2>
        <p className="text-white/60 text-sm mt-3 font-[var(--font-work-sans)] leading-relaxed">
          Join thousands of health-conscious families enjoying farm-fresh microgreens delivered to their doorstep.
        </p>
      </div>

      {/* Bottom stats */}
      <div className="relative z-10 grid grid-cols-3 gap-2 text-center">
        {[
          { value: "10K+", label: "Happy Customers" },
          { value: "50+", label: "Varieties" },
          { value: "4.9★", label: "Avg. Rating" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-xl p-3">
            <p className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#a5f95b]">{stat.value}</p>
            <p className="font-[var(--font-work-sans)] text-[10px] text-white/50 uppercase tracking-wider leading-tight mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── OTP 6-box input ────────────────────────────────────────── */
interface OtpInputProps {
  value: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
}

function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, char: string) => {
    if (!/^\d*$/.test(char)) return;
    const next = [...value];
    next[idx] = char.slice(-1);
    onChange(next);
    if (char && idx < OTP_LENGTH - 1) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[idx]) {
        const next = [...value];
        next[idx] = "";
        onChange(next);
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      onChange(pasted.split(""));
      refs.current[OTP_LENGTH - 1]?.focus();
      e.preventDefault();
    }
  };

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="One-time password input">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`OTP digit ${i + 1}`}
          className={`w-11 h-12 text-center text-lg font-bold font-[var(--font-work-sans)] text-[#032616] border-2 rounded-lg outline-none transition-all
            ${value[i]
              ? "border-[#386b00] bg-[#f0f9e8]"
              : "border-[#c1c8c1] bg-white focus:border-[#386b00] focus:ring-2 focus:ring-[#386b00]/20"
            }
            disabled:opacity-50`}
        />
      ))}
    </div>
  );
}

/* ── Shared input field ─────────────────────────────────────── */
function FormInput({
  id, label, type = "text", value, onChange, placeholder, disabled, error, helper, prefix,
  autoFocus,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helper?: string;
  prefix?: React.ReactNode;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-bold text-[11px] tracking-widest uppercase text-[#424843] mb-2 font-[var(--font-work-sans)]">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 text-sm text-[#424843] font-[var(--font-work-sans)] select-none pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`w-full border rounded-xl py-3.5 text-sm font-[var(--font-work-sans)] text-[#1a1c19] placeholder:text-[#b0b5b0] outline-none transition-all
            ${prefix ? "pl-12 pr-4" : "px-4"}
            ${disabled ? "bg-[#f0f4f0] text-[#727973] cursor-not-allowed border-[#c1c8c1]" : "bg-white"}
            ${error ? "border-[#ba1a1a] ring-2 ring-[#ba1a1a]/20" : "border-[#c1c8c1] focus:border-[#386b00] focus:ring-2 focus:ring-[#386b00]/20"}
          `}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)]"
          >
            {error}
          </motion.p>
        )}
        {!error && helper && (
          <p className="mt-1.5 text-[11px] text-[#727973] font-[var(--font-work-sans)]">{helper}</p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Step 1 — Mobile Number ─────────────────────────────────── */
interface Step1Props {
  onSuccess: (mobile: string) => void;
}

function Step1({ onSuccess }: Step1Props) {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = mobile.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await sendOtp({ mobileNumber: cleaned });
      if (res.success) {
        onSuccess(cleaned);
      } else {
        setError(res.message ?? "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div>
        <h1 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
          Welcome to AgriNest
        </h1>
        <p className="text-sm text-[#424843] font-[var(--font-work-sans)] mt-1.5">
          Enter your mobile number to continue
        </p>
      </div>

      <FormInput
        id="mobile"
        label="Mobile Number"
        type="tel"
        value={mobile}
        onChange={(v) => { setMobile(v); setError(""); }}
        placeholder="8500395821"
        prefix="+91"
        error={error}
        autoFocus
      />

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? { scale: 1.01 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className="w-full bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-4 rounded-xl hover:bg-[#386b00] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <>
            <SpinnerIcon />
            Sending OTP…
          </>
        ) : (
          <>
            Continue
            <ArrowRightIcon />
          </>
        )}
      </motion.button>

      <p className="text-center text-xs text-[#727973] font-[var(--font-work-sans)]">
        By continuing, you agree to our{" "}
        <span className="text-[#032616] font-bold underline underline-offset-2 cursor-pointer">Terms</span>
        {" "}and{" "}
        <span className="text-[#032616] font-bold underline underline-offset-2 cursor-pointer">Privacy Policy</span>
      </p>
    </form>
  );
}

/* ── Step 2 — OTP + Name ────────────────────────────────────── */
interface Step2Props {
  mobileNumber: string;
  onBack: () => void;
  /** Passes full verified User and the JWT token returned by the backend */
  onSuccess: (user: User, token: string) => void;
}

function Step2({ mobileNumber, onBack, onSuccess }: Step2Props) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [nameError, setNameError] = useState("");

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleResend = async () => {
    setResending(true);
    try {
      await sendOtp({ mobileNumber });
      setResendTimer(30);
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    let valid = true;

    if (otpValue.length < OTP_LENGTH) {
      setOtpError("Please enter the 6-digit OTP.");
      valid = false;
    } else {
      setOtpError("");
    }
    if (!name.trim()) {
      setNameError("Please enter your name.");
      valid = false;
    } else {
      setNameError("");
    }
    if (!valid) return;

    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp({ mobileNumber, otp: otpValue, name: name.trim() });
      if (res.success) {
        onSuccess(res.user as User, res.token ?? "");
      } else {
        setError(res.message ?? "Invalid OTP. Please try again.");
      }
    } catch (err) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message ?? "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onBack}
          className="mt-1 p-1 rounded-lg text-[#424843] hover:text-[#032616] hover:bg-[#f0f4f0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#386b00]"
          aria-label="Go back to mobile number step"
        >
          <ArrowLeftIcon />
        </button>
        <div>
          <h1 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
            Verify your number
          </h1>
          <p className="text-sm text-[#424843] font-[var(--font-work-sans)] mt-1">
            OTP sent to{" "}
            <span className="font-bold text-[#032616]">+91 {mobileNumber}</span>
          </p>
        </div>
      </div>

      {/* Mobile (disabled) */}
      <FormInput
        id="mobile-disabled"
        label="Mobile Number"
        value={`+91 ${mobileNumber}`}
        disabled
      />

      {/* OTP boxes */}
      <div>
        <p className="font-bold text-[11px] tracking-widest uppercase text-[#424843] mb-3 font-[var(--font-work-sans)]">
          Enter OTP
        </p>
        <OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpError(""); }} disabled={loading} />
        <AnimatePresence>
          {otpError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)] text-center"
            >
              {otpError}
            </motion.p>
          )}
        </AnimatePresence>
        {/* Resend */}
        <div className="text-center mt-3">
          {resendTimer > 0 ? (
            <p className="text-xs text-[#727973] font-[var(--font-work-sans)]">
              Resend OTP in <span className="font-bold text-[#032616]">{resendTimer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-xs font-bold text-[#386b00] underline underline-offset-2 font-[var(--font-work-sans)] disabled:opacity-60 hover:text-[#032616] transition-colors"
            >
              {resending ? "Resending…" : "Resend OTP"}
            </button>
          )}
        </div>
      </div>

      {/* Name */}
      <FormInput
        id="name"
        label="Your Name"
        value={name}
        onChange={(v) => { setName(v); setNameError(""); }}
        placeholder="e.g. Ajay Kumar"
        error={nameError}
      />

      {/* Global error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-[#ba1a1a] bg-[#ffdad6] rounded-lg px-4 py-3 font-[var(--font-work-sans)]"
          >
            <AlertIcon />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? { scale: 1.01 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className="w-full bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-4 rounded-xl hover:bg-[#032616] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <>
            <SpinnerIcon />
            Verifying…
          </>
        ) : (
          <>
            Verify & Continue
            <CheckIcon />
          </>
        )}
      </motion.button>
    </form>
  );
}

/* ── Success flash ──────────────────────────────────────────── */
function SuccessFlash({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-16 h-16 rounded-full bg-[#386b00] flex items-center justify-center"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="m5 13 4 4L19 7" />
        </svg>
      </motion.div>
      <div>
        <h2 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
          Welcome, {name}!
        </h2>
        <p className="text-sm text-[#424843] font-[var(--font-work-sans)] mt-1">
          You're now logged in. Redirecting…
        </p>
      </div>
    </div>
  );
}

/* ── Main LoginModal ────────────────────────────────────────── */
export default function LoginModal() {
  const { isLoginModalOpen, redirectAfterLogin, closeLoginModal, login } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | "success">(1);
  const [mobileNumber, setMobileNumber] = useState("");
  const [verifiedName, setVerifiedName] = useState("");

  // Reset to step 1 whenever modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setStep(1);
      setMobileNumber("");
    }
  }, [isLoginModalOpen]);

  const handleStep1Success = useCallback((mobile: string) => {
    setMobileNumber(mobile);
    setStep(2);
  }, []);

  const handleStep2Success = useCallback(
    (user: User, token: string) => {
      // Capture redirectAfterLogin now — state may change by the time setTimeout fires
      const destination = redirectAfterLogin;
      setVerifiedName(user.name);
      setStep("success");
      // Pass full user so auth store persists _id, role, isMobileVerified
      login(user, token);

      // Short success flash, then navigate if a destination was set
      setTimeout(() => {
        if (destination) {
          router.push(destination);
        }
      }, 1000);
    },
    [login, redirectAfterLogin, router]
  );

  // Trap focus & close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLoginModal();
    };
    if (isLoginModalOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLoginModalOpen, closeLoginModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isLoginModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isLoginModalOpen]);

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <>
          {/* Backdrop (desktop only — on mobile the modal IS the screen) */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[199] hidden md:block bg-black/60 backdrop-blur-sm"
            onClick={closeLoginModal}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.28, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Login to AgriNest"
            className={`
              fixed z-[200]
              /* Mobile: full screen */
              inset-0 flex flex-col bg-white overflow-y-auto
              /* Desktop: centered card */
              md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
              md:w-full md:max-w-3xl md:max-h-[90vh]
              md:rounded-2xl md:shadow-2xl md:flex-row md:overflow-hidden
            `}
          >
            {/* Left brand panel (desktop only) */}
            <BrandPanel />

            {/* Right form panel */}
            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
              {/* Mobile header (visible only on mobile) */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e3dd] md:hidden">
                <span className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">
                  AgriNest
                </span>
                <button
                  onClick={closeLoginModal}
                  className="p-2 rounded-lg text-[#424843] hover:bg-[#f0f4f0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#386b00]"
                  aria-label="Close login"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Desktop close button */}
              <div className="hidden md:flex justify-end px-6 pt-5">
                <button
                  onClick={closeLoginModal}
                  className="p-2 rounded-lg text-[#424843] hover:bg-[#f0f4f0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#386b00]"
                  aria-label="Close login"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Form content */}
              <div className="flex-1 flex flex-col justify-center px-8 md:px-10 py-6 md:py-4">
                {/* Step indicator */}
                {step !== "success" && (
                  <div className="flex items-center gap-2 mb-6">
                    {[1, 2].map((s) => (
                      <div
                        key={s}
                        className={`h-1 rounded-full flex-1 transition-all duration-400 ${
                          (step === 1 && s === 1) || (step === 2 && s <= 2)
                            ? "bg-[#386b00]"
                            : "bg-[#e3e3dd]"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Animated step transitions */}
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Step1 onSuccess={handleStep1Success} />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Step2
                        mobileNumber={mobileNumber}
                        onBack={() => setStep(1)}
                        onSuccess={handleStep2Success}
                      />
                    </motion.div>
                  )}

                  {step === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SuccessFlash name={verifiedName} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Micro icons ────────────────────────────────────────────── */
function SpinnerIcon() {
  return (
    <motion.svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </motion.svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

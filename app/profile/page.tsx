"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/store/authStore";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/animations/PageTransition";
import FadeIn from "@/components/animations/FadeIn";

/* ── Helpers ───────────────────────────────────────────────── */

function formatMobile(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  return `+91 ${raw}`;
}

/* ── Section card wrapper ───────────────────────────────────── */
function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e3e3dd] p-6 shadow-sm">
      <h3 className="font-[var(--font-work-sans)] text-[11px] font-bold tracking-widest uppercase text-[#727973] mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ── Menu row (for future-linked items) ──────────────────────── */
function MenuRow({
  icon,
  label,
  sublabel,
  href,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  href?: string;
  disabled?: boolean;
}) {
  const inner = (
    <div
      className={`flex items-center gap-4 py-3 px-1 rounded-xl transition-colors group ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-[#f0f9e8] cursor-pointer"
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-[#f0f4f0] flex items-center justify-center text-[#032616] shrink-0 group-hover:bg-[#c6ecd1] transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-[var(--font-work-sans)] text-sm font-semibold text-[#1a1c19]">
          {label}
        </p>
        {sublabel && (
          <p className="font-[var(--font-work-sans)] text-xs text-[#727973] mt-0.5">
            {sublabel}
          </p>
        )}
      </div>
      {!disabled && (
        <svg
          className="w-4 h-4 text-[#727973] shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
      {disabled && (
        <span className="text-[9px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#b0b5b0] bg-[#f0f4f0] px-2 py-0.5 rounded-full">
          Soon
        </span>
      )}
    </div>
  );

  if (href && !disabled) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}

/* ── Page ───────────────────────────────────────────────────── */
export default function ProfilePage() {
  const { isAuthenticated, user, logout, openLoginModal } = useAuth();
  const router = useRouter();

  // Redirect to cart (or home) if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-[#fafaf4]">
          <div className="max-w-[680px] mx-auto px-5 md:px-8 py-10 md:py-14">

            {/* Page title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="font-[var(--font-libre-caslon)] text-[36px] md:text-[44px] font-bold text-[#032616] mb-8"
            >
              My Profile
            </motion.h1>

            <div className="space-y-5">

              {/* ── Avatar + user info card ── */}
              <FadeIn delay={0.05}>
                <div className="bg-[#032616] rounded-2xl p-6 md:p-8 flex items-center gap-5 relative overflow-hidden">
                  {/* Subtle background orb */}
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#386b00]/20 -translate-y-1/3 translate-x-1/3 pointer-events-none" />

                  {/* Avatar */}
                  <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#a5f95b] flex items-center justify-center">
                    <span className="font-[var(--font-libre-caslon)] text-2xl md:text-3xl font-bold text-[#032616]">
                      {initials}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="relative z-10 min-w-0">
                    <p className="font-[var(--font-libre-caslon)] text-2xl md:text-3xl font-bold text-white truncate">
                      {user.name}
                    </p>
                    <p className="font-[var(--font-work-sans)] text-sm text-white/60 mt-1">
                      {formatMobile(user.mobileNumber)}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-[#a5f95b]/10 border border-[#a5f95b]/30 rounded-full px-3 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a5f95b]" />
                      <span className="font-[var(--font-work-sans)] text-[10px] font-bold tracking-widest uppercase text-[#a5f95b]">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* ── Account menu ── */}
              <FadeIn delay={0.1}>
                <SectionCard title="Account">
                  <div className="divide-y divide-[#f0f4f0]">
                    <MenuRow
                      icon={<EditIcon />}
                      label="Edit Profile"
                      sublabel="Update your name and details"
                      disabled
                    />
                    <MenuRow
                      icon={<OrdersIcon />}
                      label="My Orders"
                      sublabel="Track and manage your orders"
                      href="/dashboard"
                    />
                    <MenuRow
                      icon={<AddressIcon />}
                      label="Saved Addresses"
                      sublabel="Manage delivery addresses"
                      disabled
                    />
                    <MenuRow
                      icon={<WishlistIcon />}
                      label="Wishlist"
                      sublabel="Your saved microgreens"
                      href="/wishlist"
                    />
                  </div>
                </SectionCard>
              </FadeIn>

              {/* ── Subscription ── */}
              <FadeIn delay={0.15}>
                <SectionCard title="Plans & Subscriptions">
                  <MenuRow
                    icon={<SubscriptionIcon />}
                    label="My Subscription"
                    sublabel="Manage your recurring plan"
                    disabled
                  />
                </SectionCard>
              </FadeIn>

              {/* ── Sign out ── */}
              <FadeIn delay={0.2}>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border-2 border-[#ba1a1a]/30 text-[#ba1a1a] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#ffdad6]/40 transition-colors"
                >
                  <LogoutIcon />
                  Sign Out
                </motion.button>
              </FadeIn>

              {/* ── App version ── */}
              <FadeIn delay={0.25}>
                <p className="text-center text-[11px] text-[#b0b5b0] font-[var(--font-work-sans)]">
                  AgriNest Microgreens · v1.0
                </p>
              </FadeIn>

            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}

/* ── Icons ──────────────────────────────────────────────────── */
function EditIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

function AddressIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function WishlistIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function SubscriptionIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

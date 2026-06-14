"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/store/authStore";

interface RoleGuardProps {
  /** Required role to access the wrapped content */
  role: "admin" | "user";
  children: React.ReactNode;
  /**
   * Where to redirect if role check fails for an authenticated user.
   * Defaults to "/unauthorized" (403 page).
   */
  unauthorizedRedirect?: string;
  /**
   * Where to redirect + open login modal if the user is not authenticated.
   * Defaults to "/" — the login modal will open with this as the return path.
   */
  loginRedirect?: string;
}

/**
 * RoleGuard — client-side RBAC guard.
 *
 * Usage:
 *   <RoleGuard role="admin">
 *     <AdminDashboard />
 *   </RoleGuard>
 *
 * Behaviour:
 *  • While isRestoring (session hydration in progress) → shows full-screen spinner
 *  • Not authenticated → opens login modal, redirects to loginRedirect
 *  • Authenticated but wrong role → redirects to unauthorizedRedirect (/unauthorized)
 *  • Correct role → renders children
 */
export default function RoleGuard({
  role,
  children,
  unauthorizedRedirect = "/unauthorized",
  loginRedirect = "/",
}: RoleGuardProps) {
  const { isAuthenticated, user, isRestoring, openLoginModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isRestoring) return; // wait for localStorage hydration

    if (!isAuthenticated) {
      // Open login modal with the current path as the post-login destination
      const returnPath =
        typeof window !== "undefined"
          ? window.location.pathname
          : loginRedirect;
      openLoginModal(returnPath);
      router.replace(loginRedirect);
      return;
    }

    if (user?.role !== role) {
      router.replace(unauthorizedRedirect);
    }
  }, [
    isRestoring,
    isAuthenticated,
    user,
    role,
    router,
    loginRedirect,
    unauthorizedRedirect,
    openLoginModal,
  ]);

  /* ── While session is being restored from localStorage ── */
  if (isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf4]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          className="w-8 h-8 border-[3px] border-[#032616] border-t-transparent rounded-full"
          aria-label="Loading"
        />
      </div>
    );
  }

  /* ── Not authenticated or wrong role — redirect is in flight, render nothing ── */
  if (!isAuthenticated || user?.role !== role) {
    return null;
  }

  return <>{children}</>;
}

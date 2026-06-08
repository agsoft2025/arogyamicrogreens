"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Where to redirect when not authenticated (default: "/cart") */
  redirectTo?: string;
  /** Content to show while the auth state is loading / before redirect */
  fallback?: React.ReactNode;
}

/**
 * Wraps protected page content.
 * Redirects to `redirectTo` (default "/cart") if the user is not authenticated.
 *
 * Usage:
 *   <AuthGuard>
 *     <CheckoutContent />
 *   </AuthGuard>
 */
export default function AuthGuard({
  children,
  redirectTo = "/cart",
  fallback = <AuthLoadingScreen />,
}: AuthGuardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  if (!isAuthenticated) return <>{fallback}</>;
  return <>{children}</>;
}

/* ── Minimal branded loading screen ────────────────────────── */
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-[#fafaf4] flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Spinning leaf */}
        <div className="w-12 h-12 mx-auto rounded-full bg-[#032616] flex items-center justify-center animate-pulse">
          <svg className="w-6 h-6 text-[#a5f95b]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-1 3-1c0 0-1-1-3-1s-3 2-3 2 1 0 2 .5C10 6 17 8 17 8z" />
          </svg>
        </div>
        <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">
          Checking authentication…
        </p>
      </div>
    </div>
  );
}

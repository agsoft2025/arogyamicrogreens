"use client";

import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/store/authStore";
import LoginModal from "@/components/auth/LoginModal";

/**
 * Client-side providers wrapper.
 * Kept separate so app/layout.tsx stays a Server Component (for metadata/fonts).
 *
 * Renders:
 *  - AuthProvider       — auth context for the whole app
 *  - SessionRestorer    — re-hydrates auth from localStorage on cold start
 *  - LoginModal         — global modal, lives at root so it renders above everything
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SessionRestorer />
      {children}
      <LoginModal />
    </AuthProvider>
  );
}

/**
 * Reads localStorage once on mount and restores auth state.
 * Must be a child of AuthProvider so it can call useAuth().
 * Renders nothing — purely a side-effect component.
 */
function SessionRestorer() {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return null;
}

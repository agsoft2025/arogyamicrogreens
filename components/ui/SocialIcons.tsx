"use client";

import { useId } from "react";
import { motion } from "framer-motion";

// ── Individual brand-colored icons ──────────────────────────────────────────

export function InstagramIcon({ size = 20 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `ig-grad-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Radial gradient from bottom-left (yellow) → top-right (purple) */}
        <radialGradient id={gradId} cx="30%" cy="110%" r="130%">
          <stop offset="0%" stopColor="#FCAF45" />
          <stop offset="18%" stopColor="#F77737" />
          <stop offset="36%" stopColor="#E4405F" />
          <stop offset="65%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </radialGradient>
      </defs>
      {/* Background rounded square */}
      <rect width="20" height="20" x="2" y="2" rx="5.5" fill={`url(#${gradId})`} />
      {/* Camera lens circle */}
      <circle cx="12" cy="12" r="3.5" stroke="white" strokeWidth="1.8" fill="none" />
      {/* Flash dot */}
      <circle cx="17" cy="7" r="1.1" fill="white" />
    </svg>
  );
}

export function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* Blue background */}
      <rect width="24" height="24" rx="5" fill="#1877F2" />
      {/* White f letterform */}
      <path
        d="M15.5 8H13.5C12.948 8 12.5 8.448 12.5 9V11H15.5L15 14H12.5V21H9.5V14H7.5V11H9.5V9C9.5 6.791 11.291 5 13.5 5H15.5V8Z"
        fill="white"
      />
    </svg>
  );
}

export function YouTubeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* Red rounded rect background */}
      <rect width="22" height="16" x="1" y="4" rx="4" fill="#FF0000" />
      {/* White play triangle */}
      <polygon points="10,8.5 16,12 10,15.5" fill="white" />
    </svg>
  );
}

// ── Reusable social link button ──────────────────────────────────────────────

interface SocialButtonProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** "dark" = for dark backgrounds (footer/support hub), "light" = for light backgrounds */
  variant?: "dark" | "light";
  size?: "sm" | "md";
}

export function SocialButton({
  href,
  label,
  icon,
  variant = "dark",
  size = "md",
}: SocialButtonProps) {
  const dim = size === "md" ? "w-10 h-10" : "w-9 h-9";
  const bg =
    variant === "dark"
      ? "bg-white/10 hover:bg-white/20"
      : "bg-black/5 hover:bg-black/10";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.12, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`${dim} rounded-full ${bg} flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2`}
      style={{ focusRingOffsetColor: "transparent" } as React.CSSProperties}
    >
      {icon}
    </motion.a>
  );
}

// ── Pre-built social link list ───────────────────────────────────────────────

export const AGRINEST_SOCIALS = [
  {
    label: "Follow AgriNest on Instagram",
    href: "https://www.instagram.com/agrinest.microgreens/",
    key: "instagram",
  },
  {
    label: "Follow AgriNest on Facebook",
    href: "https://www.facebook.com/profile.php?id=61590330283760",
    key: "facebook",
  },
  {
    label: "Subscribe to AgriNest on YouTube",
    href: "https://www.youtube.com/@AgriNestMicrogreens",
    key: "youtube",
  },
] as const;

type SocialKey = "instagram" | "facebook" | "youtube";

function getIcon(key: SocialKey, size: number) {
  switch (key) {
    case "instagram": return <InstagramIcon size={size} />;
    case "facebook":  return <FacebookIcon size={size} />;
    case "youtube":   return <YouTubeIcon size={size} />;
  }
}

/** Drop-in social links row. Renders all three AgriNest social buttons. */
export function AgriNestSocialRow({
  variant = "dark",
  iconSize = 20,
}: {
  variant?: "dark" | "light";
  iconSize?: number;
}) {
  return (
    <div className="flex gap-3" role="list" aria-label="AgriNest social media links">
      {AGRINEST_SOCIALS.map((s) => (
        <div key={s.key} role="listitem">
          <SocialButton
            href={s.href}
            label={s.label}
            icon={getIcon(s.key as SocialKey, iconSize)}
            variant={variant}
          />
        </div>
      ))}
    </div>
  );
}

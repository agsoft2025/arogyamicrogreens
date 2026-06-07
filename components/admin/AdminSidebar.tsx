"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "Product Catalog",
    href: "/admin/products",
    icon: <PlantIcon />,
  },
  {
    label: "Order Management",
    href: "/admin/orders",
    icon: <ShippingIcon />,
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: <GroupIcon />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <SettingsIcon />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#f4f4ee] border-r border-[#c1c8c1]/30 p-6 z-50">
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        className="mb-10"
      >
        <h1 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616] leading-tight">
          Admin Portal
        </h1>
        <p className="text-xs text-[#424843] font-[var(--font-work-sans)] mt-0.5">
          Organic Management
        </p>
      </motion.div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1" role="navigation" aria-label="Admin navigation">
        {NAV_ITEMS.map((item, i) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 + 0.1, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-[12px] tracking-wide font-[var(--font-work-sans)] transition-colors relative ${
                  active
                    ? "bg-[#a5f95b] text-[#3b7100]"
                    : "text-[#424843] hover:bg-[#e8e8e3] hover:text-[#032616]"
                }`}
              >
                <span className={active ? "text-[#3b7100]" : "text-[#424843]"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="pt-6 space-y-5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#386b00] transition-colors"
        >
          <PlusIcon />
          Add New Product
        </motion.button>

        {/* User profile */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e1e4da] shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida/AP1WRLuSsGJBhcXaMIycwMU8hFgpfH8n0JsBbg4eMA2GCpFYDAJOB-Or0B9GPZfQITR3veI1xUXLtN-fWVPbMFJv010a0pwKv1hPunKgfonMGgKxjgkgCtVA6mixxYT3vfPIJjbO914jLbIK4zazr4WhQ0iO0fLvpqEnaqw-jlGPtSa5__vXz-KD0CAcF9WjhGuviA0K-EPY4iDmDPgylwQ_qdyAyJWCHGAfxleolsS8jUg6U14a0UaYTsAk_bU"
              alt="Alex Rivera"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm font-[var(--font-work-sans)] text-[#1a1c19] truncate">
              Alex Rivera
            </p>
            <p className="text-[10px] uppercase tracking-widest text-[#424843] font-[var(--font-work-sans)]">
              Master Gardener
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Icons ─────────────────────────────── */
function DashboardIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
function PlantIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2 3.7-1.2.2-2.5.1-3.5-.6C7 11.7 6.5 10 7 9c1 0 2 .4 2.5 1.4z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.2-.1 2.4-.5 3.3-1.4.9-.9 1.3-2.2 1.1-3.4-.9 0-2.2.3-3.3.8z" />
    </svg>
  );
}
function ShippingIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
      <rect width="13" height="8" x="9" y="11" rx="1" />
      <circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
    </svg>
  );
}
function GroupIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
    </svg>
  );
}

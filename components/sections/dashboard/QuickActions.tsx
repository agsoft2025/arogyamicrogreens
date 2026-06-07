"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

interface QuickAction {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
}

const ACTIONS: QuickAction[] = [
  {
    icon: <InvoiceIcon />,
    title: "Invoices",
    subtitle: "Download billing history",
    href: "#",
  },
  {
    icon: <BuyAgainIcon />,
    title: "Buy Again",
    subtitle: "Reorder your favorites",
    href: "/products",
  },
  {
    icon: <SupportIcon />,
    title: "Need Help?",
    subtitle: "Contact harvest support",
    href: "/contact",
  },
];

export default function QuickActions() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ACTIONS.map((action, i) => (
        <FadeIn key={action.title} direction="up" delay={i * 0.1}>
          <Link href={action.href}>
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(3,38,22,0.15)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-lg p-6 flex items-center gap-4 cursor-pointer transition-shadow"
              style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.10)" }}
            >
              {/* Icon circle */}
              <div className="w-12 h-12 rounded-full bg-[#386b00]/10 flex items-center justify-center shrink-0 text-[#386b00]">
                {action.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm font-[var(--font-work-sans)] text-[#032616]">
                  {action.title}
                </h4>
                <p className="text-xs text-[#424843] font-[var(--font-work-sans)] mt-0.5">
                  {action.subtitle}
                </p>
              </div>
            </motion.div>
          </Link>
        </FadeIn>
      ))}
    </section>
  );
}

function InvoiceIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function BuyAgainIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" x2="21" y1="6" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

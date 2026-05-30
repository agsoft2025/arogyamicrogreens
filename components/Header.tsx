"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Sprout, X } from "lucide-react";
import Image from "next/image";
import Logo from "../assests/Logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [clientPathname, setClientPathname] = useState("");
  const ease = [0.22, 1, 0.36, 1] as const;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setClientPathname(pathname);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    let ticking = false;

    const updateScrolled = () => {
      ticking = false;
      const nextScrolled = window.scrollY > 12;
      setIsScrolled((current) =>
        current === nextScrolled ? current : nextScrolled
      );
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrolled);
      }
    };

    updateScrolled();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Microgreens", href: "/microgreens" },
    { label: "Subscription Plan", href: "/subscription-plan" },
    { label: "Products", href: "/products" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  return (
    <>
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-5">
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{
          opacity: 1,
          y: 0,
          boxShadow: isScrolled
            ? "0 22px 70px rgba(6, 25, 16, 0.18)"
            : "0 12px 44px rgba(6, 25, 16, 0.08)",
        }}
        transition={{ duration: 0.45, ease }}
        className="relative mx-auto flex max-w-7xl items-center justify-between overflow-hidden rounded-[1.65rem] border border-emerald-950/10 bg-[#fbfcf8]/94 px-3 py-2.5 lg:px-4"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(52,211,153,0.18),transparent_28%),linear-gradient(90deg,rgba(255,255,255,0.55),rgba(255,255,255,0.22))]" />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/50 to-transparent" />

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative z-10"
        >
          <Link
            href="/"
            className="group relative flex items-center rounded-[1.35rem] transition focus:outline-none focus:ring-2 focus:ring-emerald-700/25"
            aria-label="Agrinest home"
          >
            <span className="pointer-events-none absolute -inset-1 rounded-[1.8rem] bg-linear-to-r from-emerald-300/0 via-emerald-300/35 to-lime-200/0 opacity-0 blur-lg transition duration-500 group-hover:opacity-100" />
            <motion.span
              animate={{
                height: isScrolled ? 64 : 92,
                width: isScrolled ? 184 : 236,
                borderRadius: isScrolled ? 22 : 28,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="relative flex items-center justify-center overflow-hidden border border-emerald-950/10 bg-white/92 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_28px_rgba(6,25,16,0.08)]"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(187,247,208,0.55),transparent_36%)] opacity-80" />
              <span className="absolute -right-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full border border-emerald-200/55" />
              <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
              <Image
                src={Logo}
                alt="Agrinest logo"
                width={216}
                height={84}
                className="relative z-10 h-auto max-h-[82%] w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                priority
              />
            </motion.span>
          </Link>
        </motion.div>

        <nav className="relative z-10 hidden items-center gap-1 rounded-2xl border border-emerald-950/8 bg-white/72 p-1.5 shadow-inner shadow-white/60 lg:flex">
          {navItems.map((item, index) => {
            const isActive = clientPathname === item.href;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.35, ease }}
                className="group relative"
              >
                <Link
                  href={item.href}
                  className={`relative z-10 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 ${
                    isActive
                      ? "text-white shadow-[0_12px_30px_rgba(22,101,52,0.24)]"
                      : "text-stone-600 hover:bg-white/60 hover:text-emerald-950"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      isActive
                        ? "bg-lime-200 shadow-[0_0_14px_rgba(217,249,157,0.95)]"
                        : "bg-emerald-800/18 group-hover:bg-emerald-400"
                    }`}
                  />
                  {item.label}
                </Link>

                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    transition={{ type: "spring", stiffness: 460, damping: 38 }}
                    className="absolute inset-0 rounded-xl bg-linear-to-r from-emerald-700 via-emerald-600 to-lime-600 shadow-[0_14px_38px_rgba(22,101,52,0.28)] ring-1 ring-emerald-200/30"
                  />
                )}
              </motion.div>
            );
          })}
        </nav>

        <button
          className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-950/10 bg-white/78 text-emerald-950 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-700/25 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.div>
    </header>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-emerald-950/34"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            initial={{ opacity: 0, x: 34, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 34, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="absolute right-3 top-4 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-[#fbfcf8] p-3 shadow-[0_28px_90px_rgba(6,25,16,0.28)] sm:right-5"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(187,247,208,0.62),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(236,253,245,0.9))]" />
            <div className="relative mb-3 flex items-center justify-between rounded-[1.35rem] bg-white/76 px-4 py-3 ring-1 ring-emerald-950/8">
              <span className="text-sm font-semibold text-emerald-950">Menu</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-950 transition hover:bg-emerald-100"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="relative grid gap-2">
              {navItems.map((item, index) => {
                const isActive = clientPathname === item.href;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.04, ease }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
                        isActive
                          ? "bg-linear-to-r from-emerald-700 to-lime-600 text-white shadow-[0_12px_34px_rgba(22,101,52,0.24)]"
                          : "bg-white/72 text-stone-650 ring-1 ring-emerald-950/8 hover:bg-white hover:text-emerald-950"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`h-2 w-2 rounded-full transition ${
                            isActive
                              ? "bg-lime-100"
                              : "bg-emerald-500 group-hover:bg-emerald-700"
                          }`}
                        />
                        {item.label}
                      </span>
                      {isActive && <Sprout size={16} className="text-lime-100" />}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

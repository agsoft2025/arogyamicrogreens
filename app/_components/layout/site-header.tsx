"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import { FadeIn } from "@/app/_components/animations/fade-in";
import { primaryNavigation } from "@/app/_config/navigation";
import { useCart } from "@/app/_components/cart/cart-context";
import logo from "@/assests/Logo.png";

export function SiteHeader() {
  const { openCart, items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-[#78e08f]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="Microgreens logo"
            className="w-28 md:w-32"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav ref={navRef} aria-label="Primary navigation">
          <ul className="flex flex-wrap items-center justify-end gap-6 text-sm font-medium text-black">

            {primaryNavigation.map((item, index) => (
              <li key={item.href} className="relative">
                <FadeIn delay={0.08 * (index + 1)} distance={12}>

                  {item.children ? (
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.href ? null : item.href
                        )
                      }
                      className="flex items-center gap-1 text-md font-bold text-black transition hover:text-white"
                    >
                      {item.label}
                      <svg
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === item.href ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-md font-bold text-white/70 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )}
                </FadeIn>

                {/* Dropdown */}
                {item.children && openDropdown === item.href && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl bg-[#f3f3f3] shadow-xl border border-black/10 overflow-hidden animate-fadeIn">
                    <ul className="py-2 text-black">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setOpenDropdown(null)} // ✅ close after click
                            className="block px-5 py-3 text-sm font-medium hover:bg-[#e2bd76]"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}

            {/* Cart */}
            {/* <li>
              <FadeIn
                delay={0.08 * (primaryNavigation.length + 1)}
                distance={12}
              >
                <button
                  onClick={openCart}
                  className="relative flex h-9 w-9 items-center justify-center text-white/70 transition hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6b35] text-xs font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </button>
              </FadeIn>
            </li> */}

          </ul>
        </nav>
      </div>
    </header>
  );
}
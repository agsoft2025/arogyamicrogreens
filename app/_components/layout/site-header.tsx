"use client";

import Link from "next/link";
import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import { primaryNavigation } from "@/app/_config/navigation";
import { useCart } from "@/app/_components/cart/cart-context";
import logo from "@/assests/mg-logo-01.png";

export function SiteHeader() {
  const { openCart, items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-[#3C532B]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.18em] text-emerald-950 uppercase"
        >
          <Image src={logo} alt="Microgreens logo" className="w-1/4" priority />
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap items-center justify-end gap-5 text-sm font-medium text-white">
            {primaryNavigation.map((item, index) => (
              <li key={item.href}>
                <FadeIn delay={0.08 * (index + 1)} distance={12}>
                  <Link
                    href={item.href}
                    className="text-md font-bold !text-white/60 transition hover:!text-white/80"
                  >
                    {item.label}
                  </Link>
                </FadeIn>
              </li>
            ))}
            <li>
              <FadeIn delay={0.08 * (primaryNavigation.length + 1)} distance={12}>
                <button
                  onClick={openCart}
                  className="relative flex h-8 w-8 items-center justify-center text-white/60 transition hover:text-white/80"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6b35] text-xs font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </button>
              </FadeIn>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

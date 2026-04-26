import Link from "next/link";
import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import { primaryNavigation } from "@/app/_config/navigation";
import logo from "@/assests/mg-logo-01.png";

export function SiteHeader() {
  return (
    <FadeIn>
      <header className="border-b border-emerald-950/10 bg-[#3C532B]">
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
            </ul>
          </nav>
        </div>
      </header>
    </FadeIn>
  );
}

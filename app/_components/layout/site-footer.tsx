import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import logo from "@/assests/mg-logo-01.png";

const mgmLinks = [
  "Subscription Plans",
  "Microgreens",
  "Seeds",
  "Grow Kits",
  "Workshop",
];

const quickLinks = [
  "Fresh Insights",
  "FAQs",
  "Terms of Use",
  "Privacy Policy",
  "Shipping & Returns",
];

const socials = ["ig", "f", "yt", "in"];

export function SiteFooter() {
  return (
    <FadeIn delay={0.15}>
      <footer className="bg-[#355329] text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr_0.9fr_1.25fr] md:py-20">
          <div className="flex justify-center md:justify-start">
            <Image
              src={logo}
              alt="Microgreens Manikonda"
              className="h-auto w-44 object-contain"
            />
          </div>

          <FooterColumn title="MGM HYD" items={mgmLinks} />
          <FooterColumn title="Quick Links" items={quickLinks} />

          <div>
            <h2 className="text-base font-extrabold uppercase tracking-[0.24em]">
              Contact Us
            </h2>
            <ul className="mt-5 space-y-5 text-[17px] font-bold leading-6">
              <li className="flex gap-5">
                <span className="text-[#e2bd76]">TEL</span>
                <a href="tel:+917416417391" className="transition hover:text-[#e2bd76]">
                  +91 741 641 7391
                </a>
              </li>
              <li className="flex gap-5">
                <span className="text-[#e2bd76]">WA</span>
                <a href="tel:+918885553486" className="transition hover:text-[#e2bd76]">
                  +91 888 555 3486
                </a>
              </li>
              <li className="flex gap-5">
                <span className="text-[#e2bd76]">MAIL</span>
                <a
                  href="mailto:info@mgmhyd.com"
                  className="transition hover:text-[#e2bd76]"
                >
                  info@mgmhyd.com
                </a>
              </li>
              <li className="flex gap-5">
                <span className="text-[#e2bd76]">PIN</span>
                <address className="not-italic">
                  4th Floor, Plot No: 84,
                  <br />
                  Tanasha Nagar,
                  <br />
                  Manikonda, Hyderabad.
                  <br />
                  500089
                </address>
              </li>
              <li className="flex gap-5">
                <span className="text-[#e2bd76]">MAP</span>
                <a href="#" className="transition hover:text-[#e2bd76]">
                  Location (Click Here)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-6xl justify-center gap-3 px-6 pb-9">
          {socials.map((social) => (
            <a
              key={social}
              href="#"
              aria-label={social}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2bd76] text-sm font-extrabold uppercase text-[#1d2d19] transition hover:bg-white"
            >
              {social}
            </a>
          ))}
        </div>

        <div className="border-t border-[#203318] py-8 text-center text-sm font-semibold text-white/90">
          Copyright © 2026 MGM Hyd. All Rights Reserved.
        </div>
      </footer>
    </FadeIn>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-base font-extrabold uppercase tracking-[0.24em]">
        {title}
      </h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-sm font-extrabold uppercase tracking-[0.18em] transition hover:text-[#e2bd76]"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import logo from "@/assests/Logo.png";
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp, FaMapPin, FaMapMarkerAlt } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMailOutline } from "react-icons/io5";
import { CiMapPin } from "react-icons/ci";


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

const socials = [
  { name: "instagram", icon: FaInstagram, route: "https://www.instagram.com/mgmhyd" },
  { name: "facebook", icon: FaFacebookF, route: "https://www.facebook.com/mgmhyd" },
  { name: "youtube", icon: FaYoutube, route: "https://www.youtube.com/@mgmhyd" },
  { name: "linkedin", icon: FaLinkedinIn, route: "https://www.linkedin.com/company/microgreens-de-manikonda/" },
];
export function SiteFooter() {
  return (
    <FadeIn delay={0.15}>
      <footer className="bg-[#78e08f] text-black">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr_1.25fr] md:py-20">
          <div className="flex justify-center md:justify-start">
            <Image
              src={logo}
              alt="Microgreens Manikonda"
              className="h-auto w-44 object-contain"
            />
          </div>

          <FooterColumn title="MGM HYD" items={mgmLinks} />
          {/* <FooterColumn title="Quick Links" items={quickLinks} /> */}

          <div>
            <h2 className="text-base font-extrabold uppercase tracking-[0.24em]">
              Contact Us
            </h2>
            <ul className="mt-5 space-y-5 text-[17px] font-bold leading-6">
              <li className="flex gap-5">
                <span className="text-black">
                  <BsFillTelephoneFill />
                </span>
                <a href="tel:+917416417391" className="transition hover:text-[#e2bd76]">
                  +91 741 641 7391
                </a>
              </li>
              <li className="flex gap-5">
                <span className="text-black">
                  <FaWhatsapp />
                </span>
                <a href="tel:+918885553486" className="transition hover:text-[#e2bd76]">
                  +91 888 555 3486
                </a>
              </li>
              <li className="flex gap-5">
                <span className="text-black">
                  <IoMailOutline />
                </span>
                <a
                  href="mailto:info@mgmhyd.com"
                  className="transition hover:text-[#e2bd76]"
                >
                  info@mgmhyd.com
                </a>
              </li>
              <li className="flex gap-5">
                <span className="text-black">
                  <FaMapMarkerAlt />
                </span>
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
              {/* <li className="flex gap-5">
                <span className="text-black">
                  <FaMapPin />
                </span>
                <a
                  href="https://www.google.com/maps/place/MicroGreens+de+Manikonda/@17.4067272,78.3654684,14z/data=!4m10!1m2!2m1!1s4th+Floor,+Plot+no:+84,+above+Yes+bank,+Tanasha+Nagar,+Manikonda,+Hyderabad,+Telangana+500089!3m6!1s0x3bcb95007f048c41:0x4eb8d9d7be7614e7!8m2!3d17.4036156!4d78.3864481!15sCl00dGggRmxvb3IsIFBsb3Qgbm86IDg0LCBhYm92ZSBZZXMgYmFuaywgVGFuYXNoYSBOYWdhciwgTWFuaWtvbmRhLCBIeWRlcmFiYWQsIFRlbGFuZ2FuYSA1MDAwODkiA4gBAVpYIlY0dGggZmxvb3IgcGxvdCBubyA4NCBhYm92ZSB5ZXMgYmFuayB0YW5hc2hhIG5hZ2FyIG1hbmlrb25kYSBoeWRlcmFiYWQgdGVsYW5nYW5hIDUwMDA4OZIBDG9yZ2FuaWNfZmFybeABAA!16s%2Fg%2F11xg5v6sl0?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#e2bd76]"
                >
                  Location (Click Here)
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-6xl justify-center gap-3 px-6 pb-9">
          {socials.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.name}
                href={social.route}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff] text-[#1d2d19] transition hover:bg-white hover:scale-110"
              >
                <Icon size={18} color="#000" />
              </a>
            );
          })}
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

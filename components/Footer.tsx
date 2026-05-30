"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { BsYoutube } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
import Logo from "../assests/Logo.png";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Subscription Plan", href: "/subscription-plan" },
  { label: "Microgreen", href: "/microgreens" },
  { label: "Products", href: "/products" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function Footer() {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <footer className="relative mt-auto overflow-hidden bg-[#f0f9df] text-emerald-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(132,204,22,0.22),transparent_28%),radial-gradient(circle_at_86%_6%,rgba(52,211,153,0.18),transparent_30%),linear-gradient(135deg,#f7fee7_0%,#dcfce7_54%,#bbf7d0_100%)]" />
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-700 via-lime-500 to-emerald-700" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease }}
          className="grid gap-10 lg:grid-cols-[0.9fr_0.85fr_1.35fr]"
        >
          <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-[1.5rem] border border-emerald-900/14 bg-white p-4 shadow-[0_18px_50px_rgba(22,101,52,0.14)]"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(190,242,100,0.34),transparent_42%)]" />
              <Image
                src={Logo}
                alt="logo"
                width={124}
                height={124}
                className="relative z-10 object-contain"
              />
            </motion.div>

            <div className="flex items-center gap-3">
              <motion.a
                href="https://www.instagram.com/mgmhyd"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/12 bg-emerald-950 text-lg text-white shadow-sm transition duration-300 hover:bg-linear-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600"
                aria-label="Instagram"
              >
                <ImInstagram />
              </motion.a>

              <motion.a
                href="https://www.youtube.com/@mgmhyd"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/12 bg-emerald-950 text-lg text-white shadow-sm transition duration-300 hover:bg-red-600"
                aria-label="YouTube"
              >
                <BsYoutube />
              </motion.a>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-emerald-900/12 bg-white/70 p-5 shadow-[0_16px_46px_rgba(22,101,52,0.08)]">
            <h3 className="text-lg font-semibold text-emerald-950">Menu</h3>

            <ul className="mt-5 grid gap-2 text-sm font-medium text-emerald-900/72">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.32, delay: index * 0.035, ease }}
                >
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 transition duration-300 hover:bg-white hover:text-emerald-950 hover:shadow-sm"
                  >
                    <span className="h-2 w-2 rounded-full bg-lime-500 transition duration-300 group-hover:bg-emerald-700" />
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-950">Get In Touch</h3>

            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-650">
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-900/12 bg-white/70 p-3.5 shadow-sm">
                <MapPin size={18} className="mt-1 shrink-0 text-emerald-700" />
                <p>Chennai, Tamil Nadu</p>
              </div>

              <a
                href="tel:+910000000000"
                className="flex items-start gap-3 rounded-2xl border border-emerald-900/12 bg-white/70 p-3.5 shadow-sm transition hover:border-emerald-700/30 hover:bg-white hover:text-emerald-800"
              >
                <Phone size={18} className="mt-1 shrink-0 text-emerald-700" />
                <p>+91 0000000000</p>
              </a>

              <a
                href="https://api.whatsapp.com/send/?phone=918885553486&text=Hi&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-2xl border border-emerald-900/12 bg-white/70 p-3.5 shadow-sm transition hover:border-emerald-700/30 hover:bg-white hover:text-emerald-800"
              >
                <FaWhatsapp className="mt-1 shrink-0 text-lg text-emerald-700" />
                <p>+91 0000000000</p>
              </a>

              <a
                href="mailto:agrinestmicrogreens@gmail.com"
                className="flex items-start gap-3 rounded-2xl border border-emerald-900/12 bg-white/70 p-3.5 break-words shadow-sm transition hover:border-emerald-700/30 hover:bg-white hover:text-emerald-800"
              >
                <Mail size={18} className="mt-1 shrink-0 text-emerald-700" />
                <p>agrinestmicrogreens@gmail.com</p>
              </a>

              <div className="flex items-start gap-3 rounded-2xl border border-emerald-900/12 bg-white/70 p-3.5 shadow-sm">
                <Building2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <p>
                  5th Floor, Plot No:359, Gokul Plots, KPHB 9th Phase,
                  Hyderabad - 500085
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative border-t border-emerald-900/10 bg-emerald-950 px-6 py-4 text-center text-sm text-emerald-50/70">
        &copy; 2026 Agrinest. All rights reserved.
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Logo from "../assests/Logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [clientPathname, setClientPathname] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setClientPathname(pathname);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Microgreens", href: "/microgreens" },
    { label: "Subscription Plan", href: "/subscription-plan" },
    { label: "Products", href: "/products" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  return (
    <header className="w-full shadow-md bg-[#f4f3ee] sticky top-0 z-50 border-b border-primary">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Image
            src={Logo}
            alt="logo"
            width={120}
            height={60}
            className="object-contain"
          />
        </motion.div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-bold text-gray-700 mr-10">
          {navItems.map((item, index) => {
            const isActive = clientPathname === item.href;

            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Link
                  href={item.href}
                  className={`transition ${
                    isActive ? "text-primary" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>

                {/* underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] transition-all duration-300
                    ${isActive ? "w-full bg-primary" : "w-0 bg-primary group-hover:w-full"}
                  `}
                />
              </motion.li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white shadow-lg"
          >
            <ul className="flex flex-col px-6 py-4 gap-4 font-medium text-gray-700">
              {navItems.map((item) => {
                const isActive = clientPathname === item.href;

                return (
                  <li key={item.label} className="border-b pb-2">
                    <Link
                      href={item.href}
                      className={`block ${
                        isActive ? "text-primary font-bold" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

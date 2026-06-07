"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/animations/PageTransition";

export default function OrderSuccessPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-[#fafaf4] flex items-center justify-center px-5 py-20">
          <div className="max-w-lg w-full text-center">
            {/* Animated checkmark circle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-[#a5f95b] flex items-center justify-center mx-auto mb-8"
            >
              <motion.svg
                className="w-12 h-12 text-[#3b7100]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.path
                  d="m5 13 4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                />
              </motion.svg>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h1 className="font-[var(--font-libre-caslon)] text-[36px] md:text-[44px] font-bold text-[#032616] mb-3 leading-tight">
                Order Confirmed!
              </h1>
              <p className="text-[#424843] font-[var(--font-work-sans)] text-lg mb-2 leading-relaxed">
                Thank you for your harvest order.
              </p>
              <p className="text-[#424843] font-[var(--font-work-sans)] text-sm mb-10">
                Your fresh microgreens will be harvested and delivered within 2-3 days.
                A confirmation email is on its way.
              </p>
            </motion.div>

            {/* Order number */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="bg-[#f4f4ee] border border-[#e3e3dd] rounded-xl p-5 mb-8"
            >
              <p className="text-xs font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#727973] mb-1">
                Order Number
              </p>
              <p className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
                #AGN-{Math.floor(100000 + Math.random() * 900000)}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/products">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-8 py-4 rounded-lg cursor-pointer hover:bg-[#386b00] transition-colors"
                >
                  Continue Shopping
                </motion.span>
              </Link>
              <Link href="/dashboard">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block border-2 border-[#032616] text-[#032616] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-8 py-4 rounded-lg cursor-pointer hover:bg-[#032616] hover:text-white transition-colors"
                >
                  Track Your Order
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}

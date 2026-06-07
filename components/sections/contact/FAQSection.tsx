"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

const faqs = [
  {
    q: "How long do microgreens last?",
    a: "Our microgreens are harvested same-day and stay fresh for 7-10 days when refrigerated properly in our eco-friendly packaging.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes! You can pause or cancel your subscription at any time through your dashboard with no hidden fees or penalties.",
  },
  {
    q: "Do you offer wholesale?",
    a: "We partner with local restaurants and chefs. Please use the contact form to request our wholesale price sheet.",
  },
  {
    q: "Are workshops beginner-friendly?",
    a: "Absolutely! Our 'Micro-Roots' workshop is designed specifically for beginners starting their first indoor grow kit.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(true); // start open to match design

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-lg border border-[#c1c8c1] hover:border-[#386b00] transition-colors cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center gap-4 p-6">
        <h4 className="font-bold text-[11px] tracking-widest uppercase text-[#032616] font-[var(--font-work-sans)]">
          {q}
        </h4>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 text-[#386b00]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#424843] font-[var(--font-work-sans)] leading-relaxed px-6 pb-6">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section className="bg-[#f4f4ee] py-24 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <span className="font-bold text-[11px] tracking-widest uppercase text-[#386b00] font-[var(--font-work-sans)]">
            Questions?
          </span>
          <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616] mt-2">
            Frequently Asked Questions
          </h2>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeIn className="text-center mt-14">
          <p className="text-[#424843] font-[var(--font-work-sans)] mb-5">
            Didn&apos;t find what you&apos;re looking for?
          </p>
          <motion.a
            href="#"
            whileHover={{ gap: "10px" }}
            className="inline-flex items-center gap-1.5 text-[#386b00] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] border-b border-[#386b00] pb-0.5 hover:text-[#032616] hover:border-[#032616] transition-colors"
          >
            View Full Help Center
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
        </FadeIn>
      </div>
    </section>
  );
}

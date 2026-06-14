"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

const faqs = [
  {
    q: "What Are Microgreens?",
    a: "Microgreens are tender young greens harvested shortly after germination, typically within 7–14 days. Packed with vibrant flavor, color, and nutrients, these miniature greens offer a natural way to enhance your daily diet. Research suggests that certain microgreens can contain significantly higher concentrations of vitamins, minerals, and antioxidants compared to their mature plant counterparts."
  },
  {
    q: "Are Microgreens and Sprouts Different?",
    a: "Yes. Sprouts are harvested just a few days after germination and consumed whole. Microgreens are allowed to grow a little longer, developing their first leaves before harvest. This gives them a more vibrant taste, appealing texture, and greater versatility in meals."
  },
  {
    q: "Why are microgreens considered nutritious?",
    a: "Microgreens are harvested at an early growth stage when plants contain concentrated levels of vitamins, minerals, and antioxidants. They are a simple way to add nutrition to everyday meals."
  },
  {
    q: "How Should I Store Microgreens?",
    a: "Keep them refrigerated in their original container and avoid washing until you're ready to consume them for maximum freshness."
  },
  {
    q: "What Are the Health Benefits of Microgreens?",
    a: "Microgreens are packed with vitamins, minerals, antioxidants, and essential nutrients that support immunity, heart health, digestion, and overall wellness."
  },
  {
    q: "Can I Eat Microgreens Every Day?",
    a: "Absolutely! When sourced from trusted growers and consumed as part of a balanced diet, microgreens make a nutritious addition to your daily meals."
  },
  {
    q: "What Is the Recommended Daily Serving of Microgreens?",
    a: "A handful of fresh microgreens can be easily added to your daily meals. The ideal amount may differ from person to person based on their dietary preferences and health goals."
  },
  {
    q: "Are There Any Side Effects of Eating Microgreens?",
    a: "For most people, microgreens are a safe and healthy addition to everyday meals. As with any fresh produce, proper handling and moderation are recommended."
  },
  {
    q: "What is a microgreens subscription?",
    a: "A subscription allows you to receive fresh microgreens at regular intervals without reordering every time."
  },
  {
    q: "Do You Offer Subscription Plans?",
    a: "Yes! We offer flexible subscription plans with regular deliveries so you can enjoy fresh microgreens throughout the week."
  }
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  /*
    FIX: Start closed (false) instead of open.
    The open state was true before, meaning items started expanded.
    Collapsing them left the CSS Grid row at its expanded height.
  */
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      /*
        No fixed height or min-height anywhere on this card.
        Height is always driven purely by its own content.
      */
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
            key="answer"
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
  /*
    THE FIX:
    Old layout: CSS Grid `grid-cols-2`
      - Grid pairs items into shared rows.
      - Row height = tallest item in that row (locked until the next reflow).
      - When the taller item collapses, the row stays at the old height,
        leaving an empty white rectangle.

    New layout: Two independent flex columns (flex-1 each)
      - Each column is its own flex container with flex-col + gap-4.
      - Collapsing an item in the left column ONLY affects the left column.
      - Right column is completely independent — no shared rows at all.
      - Height always matches actual content, zero whitespace gaps.

    On mobile (< md): columns stack into a single column via flex-wrap + w-full.
  */
  const leftCol  = faqs.filter((_, i) => i % 2 === 0);
  const rightCol = faqs.filter((_, i) => i % 2 === 1);

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

        {/* Two independent flex columns */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto items-start">

          {/* Left column — indices 0, 2, 4, 6, 8 */}
          <div className="flex flex-col gap-4 flex-1 w-full">
            {leftCol.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i * 2} />
            ))}
          </div>

          {/* Right column — indices 1, 3, 5, 7, 9 */}
          <div className="flex flex-col gap-4 flex-1 w-full">
            {rightCol.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i * 2 + 1} />
            ))}
          </div>

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

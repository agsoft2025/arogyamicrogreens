"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    title: "Harvested Daily",
    desc: "Handpicked and harvested daily for maximum nutrient retention.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: "Chemical Free",
    desc: "No pesticides, no herbicides. 100% natural, hydroponically grown.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Same Day Delivery",
    desc: "From our farm to your kitchen in less than 4 hours.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
    title: "Nutrient Rich",
    desc: "Up to 40x more concentrated nutrients than mature vegetables.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#e1e4da] py-24 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616]">
            Why Choose <span className="text-[#386b00]">AgriNest?</span>
          </h2>
          <p className="text-[#444841] mt-2 font-[var(--font-work-sans)]">The highest standards for your health</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              whileHover={{ y: -6 }}
              className="bg-[#fafaf4] p-8 rounded-xl text-center cursor-default"
              style={{ boxShadow: "0 4px 12px rgba(27,60,42,0.1)" }}
            >
              <div className="w-16 h-16 bg-[#a5f95b] rounded-full flex items-center justify-center mx-auto mb-6 text-[#3b7100]">
                {f.icon}
              </div>
              <h3 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616] mb-3">{f.title}</h3>
              <p className="text-sm text-[#727973] font-[var(--font-work-sans)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

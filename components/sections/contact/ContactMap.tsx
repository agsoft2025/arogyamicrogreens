"use client";

import { motion } from "framer-motion";

const EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.456574175598!2d78.381271!3d17.485705199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9226d5a3711b%3A0x85a5713c364d6a46!2sGayathri%20Arcade%2C%20Gokul%20Plots%2C%20Plot%20no-669%2C%20above%20Bharath%20bazar%2C%20Kukatpally%20Housing%20Board%20Colony%2C%20Venkata%20Ramana%20Colony%2C%20Hafeezpet%2C%20Hyderabad%2C%20Telangana%20500085!5e0!3m2!1sen!2sin!4v1783845107472!5m2!1sen!2sin"

export default function ContactMap() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-12 md:py-16 bg-[#fafaf4]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-6">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase font-[var(--font-work-sans)] text-[#386b00] mb-2">
            Find Us
          </p>
          <h2 className="font-[var(--font-libre-caslon)] text-2xl md:text-3xl font-bold text-[#032616]">
            Visit AgriNest
          </h2>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-[#e3e3dd] shadow-sm">
          <iframe
            src={EMBED_SRC}
            width="100%"
            height="500"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="AgriNest location on Google Maps"
            className="w-full min-h-[450px] md:min-h-[500px] lg:min-h-[560px]"
          />
        </div>

        <p className="mt-4 text-sm text-[#727973] font-[var(--font-work-sans)] flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#386b00] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <a
            href="https://maps.app.goo.gl/GpYKKqiprnEjVQA97"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#032616] hover:text-[#386b00] transition-colors font-medium underline-offset-2"
          >
            Open in Google Maps
          </a>
        </p>
      </motion.div>
    </section>
  );
}

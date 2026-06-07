"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

const testimonials = [
  {
    name: "Priya S.",
    quote: "The microgreens are so fresh and crisp. My kids love them in salads!",
    avatar: "https://lh3.googleusercontent.com/aida/AP1WRLvH1qu8NwksDgqHtKti7i_fhVqU6T0Rw3_ibOEms8bGnRIK-8r7din3MV1fMQnu72POkE6-_-Il-Cw0zHKmS-BdlAeIWc5u5RKJVVGoF6Jd6nXw_HSMckSyTLj5dQfGK6JtXW-PomiKzdLJYadAd7kNldxSJmaX2xuyv3jcrSGONyUVKtvv-2gseDOpszMLBI-Vhg1hXIjkFVy0nbvU2yNt4JZNUGo4hwDzlMMRCi_H6bKf6ei0rgs2WA",
  },
  {
    name: "Rohit M.",
    quote: "Best quality and super fast delivery. Will definitely subscribe!",
    avatar: "https://lh3.googleusercontent.com/aida/AP1WRLv_fwC99gTSFfGvEPnO_sV2whsRwOSS16vowepNMQp1D7xQk4gEcRbhdccCu7XDlpYWOs11EGk2z1WJYYfRS_Oqtd06HOC_a5VENCcYjOdFgHp8ZH3vhhJe-tUIOhrtNaLhc0XpGKOlil2RW96H9poRPaK-eZEIf2fdOOEox03QQkWASX5vqKqJJHWlkZUrjlmtjocoSsOLr6xibp1uTN_EBhYrzfAEgsJQaGACHOXtcxmKQdmEMrd85g",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5 text-[#386b00]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: testimonials */}
          <div>
            <FadeIn>
              <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616] mb-8">
                Loved by 1,200+ Happy Customers
              </h2>
            </FadeIn>

            <div className="space-y-5">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.55 }}
                  className="bg-white p-6 rounded-xl flex gap-4 border border-[#eeeee9]"
                  style={{ boxShadow: "0 4px 12px rgba(27,60,42,0.08)" }}
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <StarRating />
                    <p className="text-[#424843] italic my-2 text-sm font-[var(--font-work-sans)]">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="font-bold text-xs text-[#032616] font-[var(--font-work-sans)]">— {t.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: image grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/AP1WRLsn5x7kIQ-r1YQwtHOMn40Lx9yXE7ur5008cEVMz5MGptx6vmyICNpGSk8vUlJA46veHtotvp6OwFub18qYlhJVvNhyZvfLcg0k6LNZqvCXFojiqs51MBTn4-jAc8RvRYiyrDAnX6UKqkyCKHcfz1b61BftcTjcPMI2DZC8oQEfQ8_RDftxCVGNsn3fFZB3WL9eZMPuCZxISJbGHzsyBVGaTBM_vHwG-SVTRmib2a0g1hTLRk8pgjlCGA"
              alt="Woman preparing microgreen salad"
              className="rounded-xl h-full object-cover min-h-[280px]"
            />
            <div className="space-y-4">
              <img
                src="https://lh3.googleusercontent.com/aida/AP1WRLtamm19D66mxYAZOg_A5Ju5dnNEvClGQxJN8DgKO_J0U1CNb0c_OlifwOqWf5x5OS0mHBTUlE1z5MYRAC9c4MilEqhNw2zxhRWbTNybqrfKlDdzk14JURuv4a5XZE5fXKavqwzCmmQRFuwQOnuklP_3tnILpz73tbSkFvWtKVmtAevtNUOuM8-yBS0yNKa3R3n2XDczsYU27UON5n906fSjhSloKXe3bhJL1xKyRHKfAyxIKyaBlQhNs0Q"
                alt="Hydroponic farm with LED lights"
                className="rounded-xl h-[calc(50%-8px)] w-full object-cover min-h-[130px]"
              />
              <img
                src="https://lh3.googleusercontent.com/aida/AP1WRLtHBLjR5jD1GwIhmoBILMuoEuaihQ25j7Dd_vvUHbyibOeTfYTIxtRv7D_BqU8Gyy9K4avz_i9HDw_ntBZsHv4mc568DjHP3Ypo8qhpvXBuVyPfXljGM7PGfOrJWo2IYfF5ctm9qoAFW9gyl1Cghus8wvApUBjndF_fMI5of9VahVQPwmlIaqSviiiRWoTf7qi3YFbHiu04rsU5OyzcUsdT1c1Ic7hC3jpZWRlHmfuteyzRttZJt1AW4p0"
                alt="Microgreen containers on wooden table"
                className="rounded-xl h-[calc(50%-8px)] w-full object-cover min-h-[130px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import FadeIn from "@/components/animations/FadeIn";

export default function SubscriptionCTA() {
  const router = useRouter();

  const handleViewPlans = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push("/subscription");
  };

  return (
    <section className="px-5 md:px-16 py-20">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn>
          <div className="bg-[#032616] rounded-2xl px-10 md:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            {/* Decorative leaf watermark */}
            <div className="absolute -right-16 -bottom-16 opacity-[0.07] pointer-events-none select-none">
              <svg className="w-72 h-72 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-1 3-1c0 0-1-1-3-1s-3 2-3 2 1 0 2 .5C10 6 17 8 17 8z" />
              </svg>
            </div>

            {/* Left text */}
            <div className="relative z-10 max-w-xl">
              <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-white mb-3">
                Start Your Organic Journey Today
              </h2>
              <p className="text-white/75 font-[var(--font-work-sans)] leading-relaxed">
                Get 20% off your first month when you sign up for any subscription plan this week.
              </p>
            </div>

            {/* Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              {/* View All Plans — client-side navigation, scrolls to top */}
              <motion.button
                onClick={handleViewPlans}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#386b00] text-white px-8 py-4 rounded-lg font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#a5f95b] hover:text-[#032616] transition-colors whitespace-nowrap"
              >
                View All Plans
              </motion.button>

              {/* Chat With an Expert — opens WhatsApp */}
              <motion.a
                href="https://wa.me/918500395821"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, backgroundColor: "#f4f4ee" }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-[#032616] px-8 py-4 rounded-lg font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L.073 23.927a.75.75 0 0 0 .918.918l6.073-1.459A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 0 1-4.932-1.342l-.354-.21-3.658.879.894-3.658-.21-.354A9.714 9.714 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                </svg>
                Chat With an Expert
              </motion.a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

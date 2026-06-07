"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import FadeIn from "@/components/animations/FadeIn";

const products = [
  {
    name: "Sunflower Microgreens",
    price: "₹1,079",
    originalPrice: "₹1,329",
    badge: "20% OFF",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLujAlBPvdLc_hsmGprqAO_OvxUsoCup9ovMJSiRSGWJGRQL2C9AHfimcuqO-ydJDtJ6dzECCJgoLQhg9xlHgiWsAO81P7uuFxdnX0bRuhxhhYkYT4mDhxOrZ0WuuHTplijxe5JVmJrkQaNVZSawvW3YWm8g4FqFN1l1aN-9alUxfTHfkkFqL7Uw42vdNbBfuzM4mi6SEQb6oVSINQsyF0huW0nDYM27qfb6G3XnMbXK4XVLrPfQeDhVIbw",
  },
  {
    name: "Red Amaranth",
    price: "₹1,199",
    originalPrice: "₹1,399",
    badge: "15% OFF",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLvl4WezmUrsv1-jRppDQoRNKdDC1R8oAbHufywtmWlyEXEbv1McdDSZ6NNuk9KIHPTz2rrWoIcEQoK4c-iFKSDXvDP3SN4eU-CSLix3o89yN7niNdpuOIusyzkp9pq_1zXHClj2DPyhwkIcoAwjttIyS2yqI-VlAVTWjwQp-QR0hrYfSWEimli17zgnIvbwCqFkxDtVOFDMbxlVJrsPqn1PP47v94fftg-9Xnbg10bc3bY3iXHc0Wq1SuE",
  },
  {
    name: "Pea Shoots",
    price: "₹899",
    badge: "HOT",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLtSBew55tdBC2F1diP_X5mV_Kl2Bh0WAQ69xpDoxKG9Pfx6rEehgxDK73n2Y5ka9orXo4ALpXtBirCEY76oOo5F1VcGiKH7XLMZvrDiEaiSLV8P-2DXDDmWsJ1T_IqJ8o2xUb4HfEEfGCfPXlHkB2Dczmnj5dgPb7cztdxyombYIuDD3-gkXtdFeSROUMQAM6nunfwFopjk_v1t9NJp-mB-zOKGO9es6GBqHCQbyRpFehBcC1_kZa-OCRY",
  },
  {
    name: "Broccoli Microgreens",
    price: "₹1,099",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLvoerMy0DfJ8pYFOZ0kQSrIetQeL9NRc-w67VIQT9G8rp6dRohfmKZDAArshYdRJ2W0U3nYQnXuzrXT75yGQ5jnKI00n7ZvxNrB5UiEdNBa5tiKp-o1D79j247lUVzZ81Oqz5qt7n5qtJHmbvjwlPtqdpadQnhC6Jl_Ho8iQK_0XQTtr2UIqbuVzmUUTPK9AdgpSlgf_1pcUeWpPPaKpisxqjnhBJhH57E3XLkU02i7NvuzRHbPboKTcFw",
  },
];

export default function FeaturedMicrogreens() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section id="featured" className="py-24 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616]">
                Featured Microgreens
              </h2>
              <p className="text-[#424843] mt-1 font-[var(--font-work-sans)]">Selected harvests of the week</p>
            </div>
            <div className="flex gap-2">
              {["left", "right"].map((dir) => (
                <motion.button
                  key={dir}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scroll(dir as "left" | "right")}
                  className="w-10 h-10 border border-[#727973] rounded-full flex items-center justify-center hover:bg-[#eeeee9] transition-colors text-[#1a1c19]"
                >
                  {dir === "left" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </FadeIn>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 hide-scroll"
        >
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

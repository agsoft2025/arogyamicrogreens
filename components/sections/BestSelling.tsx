"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

const products = [
  {
    name: "Sunflower Microgreens",
    price: "₹1,079",
    rating: "4.9",
    reviews: "320",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLtyWK6YiaB0Ly4TLOp5PiyxA0CH7y7ZERvv6ANHLBDbDxZiiHfU1VBchiwPik87QPYA_fjQhn3Wq14GvL_sD0yi1aRs731NS9gcFItsQ3_RaLScA0OQi9SesQ87wTi1j7j-YeX7m7nUshxTCpGxiTBecnJaSnxF90NHbNV5D9hk_ZEm0UCLwXzIxlPyOE85o9s8oS9AUf6IfnsilQfOqLRcb2T2ESunXPaINAXb7OqTPmMpJRXhhETAbzY",
  },
  {
    name: "Red Amaranth",
    price: "₹1,199",
    rating: "4.8",
    reviews: "245",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLtDiImIBTiuLaNeRYv9xx1Xjx7KWd0tUdsqbQ5KEDlmvJOFlMSFXoi1GTLHZekDqZ_vZQpF6M7ip6YK2BsXTv1Uaz3X10fK3hqW5jmGLFTNKhIfYqgX_mR1Rn-ofCE_E0XvuORIhV13EQ9GfX2lAGgsi8vYPj1vVbtwTxy0JENJq5X8DIDv6GlojrHCGAk-SsjPS9lHFBBHb7t-X5JuBVNSyRn5jD37qf1vdOMH2fU5kqKi-s8XFj4t1v0",
  },
  {
    name: "Pea Shoots",
    price: "₹899",
    rating: "4.9",
    reviews: "410",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLs0TPsYPjI2wFDImv0yF9bGyB1GgctdPQvvztQsDFyx5n-7H-7gCQvwkZEsZ1OQR2DY-8u62UPoajcVE-DXAiHzBTY-pxvI7TB1tfGiEqxqC7pJ8iHx0gbigYbPMD0sC1dk4Kaq0GQssxz_NtCCThlaGRqiZbGgw6MJPWubZaKEO5JGu_6_pk5Naarit4UckFKJxmRI6MIV5r1Uw3vQRwBq4i6pjU32-Yu3uXFNdP4rxJQiqon9IpmumS4",
  },
  {
    name: "Broccoli Greens",
    price: "₹1,099",
    rating: "4.8",
    reviews: "275",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLt8Mozm1LaOngYt0fY9BB1Ymg8Zi5zvpVlDYFJcVaRttaxnFix6sj1ixgSLSldDkhoYzCCN7a9Cv6ljDDXxAzFSkSEW1V-QN3qeHznMzJt2bw-6FBiNhUsGLEDrabXT2zBDgVoNAVtgXqGt8b3_bK9745oMxn1S1bhG5np9-wZu-mpL0dMr6fWLtIMPpO_oWc-Pmttu6u35OXyZlX7vB4SAjidWXzaa2o9EbGzmT-w_fjvCUIOBUYD8",
  },
  {
    name: "Radish Microgreens",
    price: "₹949",
    rating: "4.9",
    reviews: "182",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLvI5gViGAusSLbMSzcW2RiCthw1sLCVDW_Wotkb58M27ZpjMAif-yCL-QQXU0OB9d0Vxl5qTFJQdm-YjIFu6KnvcoxLfqNiS3VCmh5dkDtUDLm3PO-mxM4nLooHJEVEtQDmJG0ZmvodAu23jAqPvuPfwYCQ4H_f_zbrYOBwJjjhBepp-J-ZkGDj3FdiHwzWj5z_94RhABrQ8JcRYGaXGMXJfDHGlShenXuYuFcFdIHxMdmBuRIY2XHJEic",
  },
];

export default function BestSelling() {
  return (
    <section id="best-selling" className="py-24 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn className="text-center mb-12">
          <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616]">
            Best Selling Microgreens
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="aspect-square bg-[#eeeee9] rounded-xl mb-3 overflow-hidden relative">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Quick view ${p.name}`}
                >
                  <svg className="w-4 h-4 text-[#032616]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                </motion.button>
              </div>

              <div className="flex items-center gap-1 mb-1">
                <svg className="w-3.5 h-3.5 text-[#386b00]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="text-[11px] font-bold text-[#424843] font-[var(--font-work-sans)]">
                  {p.rating} ({p.reviews})
                </span>
              </div>

              <h3 className="font-bold text-xs tracking-wide text-[#032616] truncate font-[var(--font-work-sans)]">{p.name}</h3>

              <div className="flex justify-between items-center mt-2">
                <p className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">{p.price}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#386b00] text-white px-3 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-[#032616] transition-colors font-[var(--font-work-sans)]"
                >
                  Quick Add
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

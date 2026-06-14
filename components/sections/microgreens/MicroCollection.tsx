"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

const smoothEase = [0.25, 0.4, 0.25, 1] as const;

interface NutrientBarProps {
  level: string;
  percent: number;
}

function NutrientBar({ level, percent }: NutrientBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)]">
          Nutrient Density
        </span>
        <span className="font-bold text-[11px] tracking-widest uppercase text-[#386b00] font-[var(--font-work-sans)]">
          {level}
        </span>
      </div>
      <div className="h-1.5 w-full bg-[#eeeee9] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="h-full bg-[#386b00] rounded-full"
        />
      </div>
    </div>
  );
}

interface AddToCartButtonProps {
  label?: string;
  dark?: boolean;
  subscribe?: boolean;
}

function AddToCartButton({ label = "Add to Basket", dark = false, subscribe = false }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`w-full py-3.5 rounded-lg font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] flex items-center justify-center gap-2 transition-colors ${
        added
          ? "bg-[#032616] text-white"
          : dark
          ? "bg-[#032616] text-white hover:opacity-90"
          : "bg-[#386b00] text-white hover:bg-[#032616]"
      }`}
    >
      {added ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="m5 13 4 4L19 7" />
          </svg>
          Added
        </>
      ) : subscribe ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Subscribe &amp; Save
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {label}
        </>
      )}
    </motion.button>
  );
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: smoothEase },
  }),
};

export default function MicroCollection() {
  return (
    <section className="px-5 md:px-16 py-24 max-w-[1280px] mx-auto">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616] mb-1">
              The Micro Collection
            </h2>
            <p className="text-[#424843] font-[var(--font-work-sans)]">
              Freshly harvested every Tuesday and Friday morning.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-full border border-[#032616] text-[#032616] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#032616] hover:text-white transition-colors"
            >
              Filter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-full bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)]"
            >
              Newest Arrivals
            </motion.button>
          </div>
        </div>
      </FadeIn>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Card 1 — Classic Sunflower (4 cols) */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ y: -8, boxShadow: "0 16px 32px rgba(3,38,22,0.12)" }}
          className="md:col-span-4 bg-white rounded-xl border border-[#e3e3dd] overflow-hidden group cursor-pointer"
          style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.08)" }}
        >
          <div className="aspect-[4/3] bg-[#f4f4ee] overflow-hidden relative">
            <motion.img
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5 }}
              src="https://lh3.googleusercontent.com/aida/AP1WRLtfesoFMDSe53KXX_BnwpjdkYcFme2qISitmGK2vX0bSkz89-WjlIxdrH_FcgJ319Y_xT6BMCFzGJ0qPdfaAVnezagLPLj7VQ_ojxdUZDC4ot563pQfpQpG4bkrlXD5HmP6bulMwvVXuYuYVhvsTJEu-pvcZCMlxwJzuqURBdEpbeYVh6EXrIctipxx7Jbw0jl68LyGNv-ZjjLXiuq-LdmCzPpUreiE76heTYgdTxkksg7p3VW1K2LeL6E"
              alt="Classic Sunflower Microgreens"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-[#a5f95b] text-[#3b7100] px-3 py-1 rounded-full font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)]">
              Bestseller
            </span>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
                Classic Sunflower
              </h3>
              <span className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#386b00]">₹699</span>
            </div>
            <p className="text-[#424843] text-sm italic mb-5 font-[var(--font-work-sans)]">
              Nutty, crunchy, and refreshing.
            </p>
            <div className="mb-6">
              <NutrientBar level="High" percent={85} />
            </div>
            <AddToCartButton />
          </div>
        </motion.div>

        {/* Card 2 — China Rose Radish (8 cols, horizontal) */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ y: -8, boxShadow: "0 16px 32px rgba(3,38,22,0.12)" }}
          className="md:col-span-8 bg-white rounded-xl border border-[#e3e3dd] overflow-hidden flex flex-col md:flex-row group cursor-pointer"
          style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.08)" }}
        >
          <div className="md:w-1/2 bg-[#f4f4ee] overflow-hidden relative min-h-[280px] md:min-h-0">
            <motion.img
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5 }}
              src="https://lh3.googleusercontent.com/aida/AP1WRLsVdBfG8chbYdA6zqC8wqqQp3pF68OM4tsWNhxCB--KbfLEzT_VxbbNnwjkbKO7_TosWDSISn9leGWNiszpn-vFHaY6Sr6JBYAy8VFrDCUrsNykUD_g1_wjAZITj2rXUVmGh3cACMwVSv8OKHFpXPP7OglYhUu2cLM0NqovcIxvoTKgqCn75kW2-HNnWagt1GCOuKh4jnV7DpyFpWrand9CV8LvkjzP7QU3qUSrxjy1ZFb8gPRjkB-Y89o"
              alt="China Rose Radish Microgreens"
              className="w-full h-full object-cover absolute inset-0"
            />
            <span className="absolute top-4 left-4 bg-[#032616] text-white px-3 py-1 rounded-full font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] z-10">
              Flavor Pop
            </span>
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
                China Rose Radish
              </h3>
              <span className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#386b00] ml-2 shrink-0">₹749</span>
            </div>
            <p className="text-[#424843] mb-6 font-[var(--font-work-sans)] leading-relaxed">
              A spicy, peppery kick that transforms any dish. These beautiful magenta-stemmed greens
              are packed with Vitamin A, B6, and C, along with significant levels of Iron and
              Magnesium.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-7">
              {[
                { label: "Flavor", value: "Peppery" },
                { label: "Vitamins", value: "A, B6, C" },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="bg-[#eeeee9] p-3 rounded-lg border border-[#c1c8c1] text-center"
                >
                  <p className="font-bold text-[10px] tracking-widest uppercase text-[#386b00] font-[var(--font-work-sans)]">
                    {chip.label}
                  </p>
                  <p className="font-bold text-[#032616] mt-0.5 font-[var(--font-work-sans)]">
                    {chip.value}
                  </p>
                </div>
              ))}
            </div>
            <AddToCartButton dark />
          </div>
        </motion.div>

        {/* Card 3 — Vital Broccoli (4 cols) */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ y: -8, boxShadow: "0 16px 32px rgba(3,38,22,0.12)" }}
          className="md:col-span-4 bg-white rounded-xl border border-[#e3e3dd] overflow-hidden group cursor-pointer"
          style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.08)" }}
        >
          <div className="aspect-[4/3] bg-[#f4f4ee] overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5 }}
              src="https://lh3.googleusercontent.com/aida/AP1WRLv5ynUmPSpzqOAcGlDFYfI5B3j6wTD8X5efKub7EO4UyiQaE-1mayURaD6gxOh8W7tOI6wfgznBvt5WMAQQDh3AbAGqWZAmHHp9LjiYFM_AyHVr0tlybIceUG97ED4Kj1WGKsI127q-8LSG0am7TBOrgOecuV6VsBS4cSwNhaAE_TZ0HUO8xmMTxTJkWj02xcF5tyU2DU7YzD6OpgNbrrUWctSZhfcAeF0TuFKoKVrrf1AjRfYZXe6jEtI"
              alt="Vital Broccoli Microgreens"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">Vital Broccoli</h3>
              <span className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#386b00]">₹849</span>
            </div>
            <p className="text-[#424843] text-sm italic mb-5 font-[var(--font-work-sans)]">
              Mild, earthy, and high in Sulforaphane.
            </p>
            <div className="mb-6">
              <NutrientBar level="Extreme" percent={100} />
            </div>
            <AddToCartButton />
          </div>
        </motion.div>

        {/* Card 4 — Sweet Pea Shoots (4 cols) */}
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ y: -8, boxShadow: "0 16px 32px rgba(3,38,22,0.12)" }}
          className="md:col-span-4 bg-white rounded-xl border border-[#e3e3dd] overflow-hidden group cursor-pointer"
          style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.08)" }}
        >
          <div className="aspect-[4/3] bg-[#f4f4ee] overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5 }}
              src="https://lh3.googleusercontent.com/aida/AP1WRLt5HUTZt0un9aAyRbbU3pyKX3y79CxbmX4_kD8kVNcZWMZMo_YVOLstUPbWzjZiYLIUep_CZZS-QzDKE0zcMmbWqYLQgsYfC8Sso9rhnUX26TRDgcfZMvOcwdMwCdyRqEp06EfQnsj5COtLNb_BKlPxvQjqkq6KK8h4Zh_9RDxsSSvVej107f2gSR9BmoA87eRgUgfs8xz1hllExO8t5GTWJL1eO8rOMh432vResBoN9NIDRCJP1SnIEXQ"
              alt="Sweet Pea Shoots Microgreens"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">Sweet Pea Shoots</h3>
              <span className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#386b00]">₹649</span>
            </div>
            <p className="text-[#424843] text-sm italic mb-5 font-[var(--font-work-sans)]">
              Sweet, tender, and elegant tendrils.
            </p>
            <div className="mb-6">
              <NutrientBar level="High" percent={80} />
            </div>
            <AddToCartButton />
          </div>
        </motion.div>

        {/* Card 5 — AgriNest Signature Mix (4 cols, featured) */}
        <motion.div
          custom={4}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ y: -8, boxShadow: "0 16px 32px rgba(56,107,0,0.2)" }}
          className="md:col-span-4 bg-white rounded-xl border-2 border-[#386b00] overflow-hidden group cursor-pointer"
          style={{ boxShadow: "0 4px 12px rgba(56,107,0,0.12)" }}
        >
          <div className="aspect-[4/3] bg-[#f4f4ee] overflow-hidden relative">
            <motion.img
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5 }}
              src="https://lh3.googleusercontent.com/aida/AP1WRLsuOwGxHwMWvBRc8PnBIpMDHEU-tsk5lEj93aNsQj-vCJG5DsAakpXB07GtrFne5tcjK_R07BaU3XZ042uLQtusz7prbQbJlKWk8SsQbE_-_JS1RYfPv1hwVfg1pRdE9Kgot29t_JMMECqeyos_eY6JL8oYesPiTkAjh5P3-Xt_ghkVmZGxthBySPOlmwPsVEa3XGoiHKQ-GJ0DUpE5gKQtvlv7opPzmP9adhF0_P5ygQpyqzBa0litZ0U"
              alt="AgriNest Signature Mix"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 right-4 bg-[#386b00] text-white px-3 py-1 rounded-full font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)]">
              Subscriber Choice
            </span>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
                AgriNest Signature Mix
              </h3>
              <span className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#386b00] ml-2 shrink-0">₹999</span>
            </div>
            <p className="text-[#424843] text-sm italic mb-5 font-[var(--font-work-sans)]">
              Balanced, colorful, and diverse profile.
            </p>
            <div className="mb-6">
              <NutrientBar level="Maximum" percent={100} />
            </div>
            <AddToCartButton subscribe />
          </div>
        </motion.div>

      </div>
    </section>
  );
}

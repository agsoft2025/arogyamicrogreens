"use client";

import { motion } from "framer-motion";
import homebg from "../assests/homepagebg.webp";
import Image from "next/image";
import tray from "@/assests/Tray Image.webp";
import MicrogreenTray from "@/components/MicrogreenTray";
import { Activity, BatteryCharging, HeartPulse, Leaf, ShieldCheck, Sparkles } from "lucide-react";

const points = [
  "Packed with concentrated nutrients for maximum benefit",
  "Rich in antioxidants that help protect and repair the body",
  "Supports immunity, energy, and overall wellness",
  "Convenient to include in daily meals without extra effort",
  "Freshly harvested for better taste, freshness, and nutrition",
  "Supports a healthy lifestyle with clean and naturally grown greens"
];

const benefitIcons = [
  Leaf,
  ShieldCheck,
  HeartPulse,
  Activity,
  Sparkles,
  BatteryCharging,
];

export default function Home() {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="overflow-hidden bg-[#fbfcf8]">
      <section className="relative isolate min-h-[94vh] overflow-hidden bg-[#102f1d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(132,204,22,0.26),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(16,185,129,0.3),transparent_32%),linear-gradient(180deg,#164e2f_0%,#0f2f1d_62%,#071a10_100%)]" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:72px_72px]"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-lime-300/22 blur-2xl"
        />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-[#fbfcf8] to-transparent" />

        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="relative z-10 mx-auto max-w-full px-6 pt-10 md:pt-24 text-center text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:pt-28 sm:text-4xl lg:text-[clamp(2.5rem,4.1vw,3.75rem)] xl:whitespace-nowrap"
        >
          Fresh Microgreens,{" "}
          <span className="bg-linear-to-r from-emerald-200 via-lime-200 to-white bg-clip-text text-transparent">
            Grown Naturally
          </span>{" "}
          for Your Daily Health
        </motion.h1>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-16 pt-7 text-center sm:pt-8 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 58, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.18, ease }}
            className="relative w-full max-w-6xl px-0 sm:px-2 lg:max-w-7xl"
          >
            <div className="absolute -inset-4 rounded-[3rem] bg-emerald-300/12 blur-2xl sm:-inset-6" />
            <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-white/16 bg-white/10 p-2 shadow-[0_34px_120px_rgba(0,0,0,0.42)] sm:rounded-[3rem] sm:p-3">
              <div
                aria-hidden
                className="absolute top-0 z-20 h-full w-1/3 translate-x-[135%] rotate-12 bg-linear-to-r from-transparent via-white/14 to-transparent"
              />
              <div className="relative h-[20rem] overflow-hidden rounded-[1.5rem] sm:h-[30rem] sm:rounded-[2.35rem] lg:h-[34rem] xl:h-[38rem]">
                <motion.div
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1.03 }}
                  transition={{ duration: 1.4, delay: 0.35, ease }}
                  whileHover={{ scale: 1.055 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={homebg}
                    alt="Fresh microgreens growing naturally"
                    fill
                    priority
                    sizes="(min-width: 1280px) 1152px, 100vw"
                    className="object-cover"
                  />
                </motion.div>
                <motion.div
                  aria-hidden
                  initial={{ x: "-45%", opacity: 0 }}
                  animate={{ x: "135%", opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.6, delay: 0.65, ease }}
                  className="absolute top-0 z-20 h-full w-1/3 rotate-12 bg-linear-to-r from-transparent via-white/22 to-transparent"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,18,10,0.08)_0%,rgba(3,18,10,0.46)_100%),radial-gradient(circle_at_50%_0%,rgba(217,249,157,0.22),transparent_42%)]" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40, y: 24, rotate: 6 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -10, 0],
                rotate: [-2, 1, -2],
              }}
              transition={{
                opacity: { duration: 0.9, delay: 0.45, ease },
                x: { duration: 0.9, delay: 0.45, ease },
                y: { duration: 5.5, delay: 0.45, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5.5, delay: 0.45, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -bottom-8 right-8 hidden w-64 overflow-hidden rounded-[1.75rem] border border-white/18 bg-white/18 p-2 shadow-[0_28px_80px_rgba(0,0,0,0.34)] md:block lg:right-12 lg:w-80 xl:right-20"
            >
              <Image
                src={tray}
                alt="Microgreen tray"
                width={420}
                height={280}
                className="rounded-[1.25rem] object-cover"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fbfcf8] py-10 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(52,211,153,0.28),transparent_30%),radial-gradient(circle_at_88%_22%,rgba(163,230,53,0.22),transparent_28%),linear-gradient(90deg,rgba(255,255,255,0.5),rgba(236,253,245,0.42))]" />
        <div className="absolute left-1/2 top-0 h-px w-[min(80rem,90vw)] -translate-x-1/2 bg-linear-to-r from-transparent via-emerald-900/15 to-transparent" />
        <div
          aria-hidden
          className="absolute -right-32 top-20 h-80 w-80 rounded-full border border-emerald-900/10"
        />
        <div
          aria-hidden
          className="absolute -left-24 bottom-16 h-72 w-72 rounded-full bg-emerald-200/36 blur-2xl"
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-end gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.65, ease }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
                <Sparkles size={16} />
                Why Microgreens
              </span>
              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-emerald-950 md:text-6xl">
                Small greens. Big everyday impact.
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.65, delay: 0.1, ease }}
              className="max-w-2xl text-lg leading-8 text-stone-600 lg:ml-auto"
            >
              A cleaner, fresher way to add color, crunch, and concentrated
              nutrition to the meals you already enjoy.
            </motion.p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {points.map((item, index) => {
              const Icon = benefitIcons[index];

              return (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 34, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, delay: index * 0.06, ease }}
                  whileHover={{ y: -8, scale: 1.015 }}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-emerald-950/8 bg-white/90 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.06)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(187,247,208,0.34),transparent_34%)] opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: -8, scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 360, damping: 18 }}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-900/10 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white"
                    >
                      <Icon size={22} />
                    </motion.div>

                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700/70">
                          Benefit {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px flex-1 bg-linear-to-r from-emerald-700/20 to-transparent" />
                      </div>
                      <p className="text-left text-base leading-7 text-stone-700">
                        {item}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Microgreen 40x */}
      <MicrogreenTray />
    </div>
  );
}

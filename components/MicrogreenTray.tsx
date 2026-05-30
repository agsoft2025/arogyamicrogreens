"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import badges from "@/assests/Badges banner.png";
import tray from "@/assests/Tray Image.webp";

const MicrogreenTray = () => {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative overflow-hidden bg-[#d9f99d] px-6 py-10 md:py-24 text-emerald-950 sm:py-28 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(22,163,74,0.48),transparent_34%),radial-gradient(circle_at_86%_14%,rgba(132,204,22,0.52),transparent_32%),radial-gradient(circle_at_58%_88%,rgba(16,185,129,0.4),transparent_38%),linear-gradient(135deg,#dcfce7_0%,#bef264_42%,#86efac_72%,#4ade80_100%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(20,83,45,0.38)_1px,transparent_1px),linear-gradient(90deg,rgba(20,83,45,0.38)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
            <span className="text-primary">Microgreens</span> contain up to{" "}
            <span className="text-primary">40x</span> more nutrients than mature
            vegetables - tiny greens with{" "}
            <span className="text-primary">powerful health benefits</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 p-3 shadow-[0_30px_110px_rgba(22,101,52,0.22)] sm:rounded-[2.5rem]">
            <div
              aria-hidden
              className="absolute top-0 z-20 h-full w-1/4 translate-x-[135%] rotate-12 bg-linear-to-r from-transparent via-white/18 to-transparent"
            />

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.45rem] sm:rounded-[2rem]">
              <Image
                src={tray}
                alt="Fresh microgreens growing in a tray"
                fill
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="scale-[1.02] object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,20,11,0.02)_0%,rgba(4,20,11,0.34)_100%)]" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            whileHover={{ rotate: 0, y: -6 }}
            className="relative mx-auto -mt-10 w-[88%] overflow-hidden rounded-[1.4rem] border border-white/70 bg-white p-2 shadow-[0_22px_70px_rgba(15,23,42,0.14)] sm:w-[76%] sm:rounded-[1.8rem]"
          >
            <Image
              src={badges}
              alt="Microgreen quality and nutrition badges"
              sizes="(min-width: 1024px) 38vw, 88vw"
              className="h-auto w-full rounded-[1rem] object-cover sm:rounded-[1.35rem]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MicrogreenTray;

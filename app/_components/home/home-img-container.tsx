"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import microBg from "@/assests/micro-bg-01.png";

export function HomeImgContainer() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative w-full overflow-hidden bg-[#edf7ef]"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-1/2 -translate-y-1/2 bg-[#71AC43]/15 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.08, 1],
                opacity: [0.45, 0.72, 0.45],
              }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative w-full"
        animate={reduceMotion ? undefined : { scale: [1, 1.025, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={microBg}
          alt="Fresh microgreens growing in a tray"
          preload
          placeholder="blur"
          sizes="100vw"
          className="relative z-10 h-auto w-full"
        />
      </motion.div>
    </motion.div>
  );
}

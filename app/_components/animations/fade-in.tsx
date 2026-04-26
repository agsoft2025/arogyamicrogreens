"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "motion/react";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  distance = 24,
}: FadeInProps) {
  const reduceMotion = useReducedMotion();
  const hiddenState = reduceMotion ? { opacity: 0 } : { opacity: 0, y: distance };
  const visibleState = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hiddenState}
      whileInView={visibleState}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

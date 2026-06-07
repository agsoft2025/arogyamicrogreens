"use client";

import { useRef, type RefObject } from "react";
import { motion, useInView } from "framer-motion";

const SEGMENTS = [
  { label: "Organic Greens", pct: 78, color: "#1b3c2a" },
  { label: "Herb Blends", pct: 14, color: "#a5f95b" },
  { label: "Specialty Sets", pct: 8, color: "#386b00" },
];

const R = 70;
const CX = 100;
const CY = 100;
const STROKE = 28;
const CIRC = 2 * Math.PI * R;

function buildSegments() {
  let offset = 0;
  return SEGMENTS.map((seg) => {
    const dashLen = (seg.pct / 100) * CIRC;
    const gap = CIRC - dashLen;
    const result = { ...seg, dashLen, gap, offset };
    offset += (seg.pct / 100) * 360;
    return result;
  });
}

const segments = buildSegments();

export default function CategoryDonut() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as RefObject<Element>, { once: true, margin: "-60px" });

  let cumulativeOffset = 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e3e3dd] h-full flex flex-col">
      <div className="mb-5">
        <h3 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#1a1c19]">
          Category Performance
        </h3>
        <p className="text-[12px] text-[#727973] font-[var(--font-work-sans)] mt-0.5">
          Sales breakdown by type
        </p>
      </div>

      {/* Donut */}
      <div ref={ref} className="flex items-center justify-center flex-1">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Background ring */}
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="#f4f4ee"
              strokeWidth={STROKE}
            />

            {/* Segments */}
            {segments.map((seg, i) => {
              const startOffset = -(cumulativeOffset / 360) * CIRC - CIRC / 4;
              const element = (
                <motion.circle
                  key={seg.label}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={STROKE}
                  strokeDashoffset={startOffset}
                  initial={{
                    strokeDasharray: `0 ${CIRC}`,
                  }}
                  animate={{
                    strokeDasharray: inView
                      ? `${seg.dashLen - 2} ${seg.gap + 2}`
                      : `0 ${CIRC}`,
                  }}
                  transition={{ duration: 0.8, delay: i * 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                />
              );
              cumulativeOffset += seg.pct;
              return element;
            })}

            {/* Center text */}
            <text
              x={CX}
              y={CY - 10}
              textAnchor="middle"
              fontSize="26"
              fontWeight="bold"
              fill="#032616"
              fontFamily="var(--font-libre-caslon)"
            >
              78%
            </text>
            <text
              x={CX}
              y={CY + 12}
              textAnchor="middle"
              fontSize="10"
              fill="#727973"
              fontFamily="var(--font-work-sans)"
              fontWeight="600"
            >
              Organic
            </text>
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 mt-4">
        {SEGMENTS.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: seg.color }}
              />
              <span className="text-[12px] text-[#424843] font-[var(--font-work-sans)]">
                {seg.label}
              </span>
            </div>
            <span className="text-[12px] font-bold text-[#1a1c19] font-[var(--font-work-sans)]">
              {seg.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, type RefObject } from "react";
import { motion, useInView } from "framer-motion";

const DATASETS = {
  D: [5200, 4800, 6100, 5500, 7200, 6400, 8100, 7300, 6900, 8500, 7800, 9200, 8700, 9800, 10200, 9500, 11000, 10400, 9800, 11500, 10900, 12300, 11700, 10800, 12600, 11900, 13200, 12500, 11800, 14000, 13400],
  W: [38000, 42000, 39000, 45000, 48000, 44000, 52000, 49000, 55000, 51000, 58000, 54000],
  M: [48290, 42000, 55000, 51000, 67000, 60000, 72000, 65000, 81000, 75000, 92000, 88000],
};

const X_LABELS: Record<"D" | "W" | "M", string[]> = {
  D: ["Oct 01", "Oct 08", "Oct 15", "Oct 22", "Oct 31"],
  W: ["Aug", "Sep", "Oct", "Nov"],
  M: ["Q1", "Q2", "Q3", "Q4"],
};

type Granularity = "D" | "W" | "M";

function buildPath(data: number[], w: number, h: number, padX = 40, padY = 30) {
  const max = Math.max(...data);
  const min = Math.min(...data) * 0.9;
  const xStep = (w - padX * 2) / (data.length - 1);
  const pts = data.map((v, i) => ({
    x: padX + i * xStep,
    y: padY + (1 - (v - min) / (max - min)) * (h - padY * 2),
  }));

  // Smooth cubic bezier
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1].x + xStep * 0.4;
    const cp1y = pts[i - 1].y;
    const cp2x = pts[i].x - xStep * 0.4;
    const cp2y = pts[i].y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i].x} ${pts[i].y}`;
  }
  return { d, pts };
}

function buildAreaPath(linePath: string, pts: { x: number; y: number }[], w: number, h: number, padX: number) {
  const lastPt = pts[pts.length - 1];
  const firstPt = pts[0];
  return `${linePath} L ${lastPt.x} ${h} L ${firstPt.x} ${h} Z`;
}

export default function SalesGrowthChart() {
  const [granularity, setGranularity] = useState<Granularity>("W");
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as RefObject<Element>, { once: true, margin: "-60px" });

  const W = 600;
  const H = 220;
  const padX = 40;
  const padY = 30;

  const data = DATASETS[granularity];
  const { d: linePath, pts } = buildPath(data, W, H, padX, padY);
  const areaPath = buildAreaPath(linePath, pts, W, H, padX);
  const xLabels = X_LABELS[granularity];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e3e3dd] h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#1a1c19]">
            Sales Growth
          </h3>
          <p className="text-[12px] text-[#727973] font-[var(--font-work-sans)] mt-0.5">
            Monthly Recurring Revenue
          </p>
        </div>
        <div className="flex gap-1 bg-[#f4f4ee] rounded-lg p-1">
          {(["D", "W", "M"] as Granularity[]).map((g) => (
            <motion.button
              key={g}
              onClick={() => setGranularity(g)}
              whileTap={{ scale: 0.93 }}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-md font-[var(--font-work-sans)] transition-colors ${
                granularity === g
                  ? "bg-[#032616] text-white shadow-sm"
                  : "text-[#424843] hover:text-[#032616]"
              }`}
            >
              {g}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[200px]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b3c2a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1b3c2a" stopOpacity="0" />
            </linearGradient>
            <clipPath id="chartClip">
              <motion.rect
                x="0"
                y="0"
                height={H}
                initial={{ width: 0 }}
                animate={{ width: inView ? W : 0 }}
                transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
              />
            </clipPath>
          </defs>

          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((f, i) => (
            <line
              key={i}
              x1={padX}
              y1={padY + f * (H - padY * 2)}
              x2={W - padX}
              y2={padY + f * (H - padY * 2)}
              stroke="#e3e3dd"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#salesGradient)" clipPath="url(#chartClip)" />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#1b3c2a"
            strokeWidth="2.5"
            strokeLinecap="round"
            clipPath="url(#chartClip)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: inView ? 1 : 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
          />

          {/* Dots at key points */}
          {pts
            .filter((_, i) => i === 0 || i === pts.length - 1 || i === Math.floor(pts.length / 2))
            .map((pt, i) => (
              <motion.circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="4"
                fill="white"
                stroke="#1b3c2a"
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
                transition={{ delay: 1, duration: 0.3 }}
              />
            ))}

          {/* X-axis labels */}
          {xLabels.map((label, i) => {
            const x = padX + (i / (xLabels.length - 1)) * (W - padX * 2);
            return (
              <text
                key={label}
                x={x}
                y={H - 6}
                textAnchor="middle"
                fontSize="10"
                fill="#9ca8a3"
                fontFamily="var(--font-work-sans)"
                fontWeight="600"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

type OrderStatus = "delivered" | "cancelled" | "processing" | "in_transit";

interface Order {
  id: string;
  date: string;
  items: number;
  status: OrderStatus;
  total: string;
}

const ORDERS: Order[] = [
  { id: "#AN-8231", date: "Oct 12, 2024", items: 3, status: "delivered",  total: "₹3,529" },
  { id: "#AN-7944", date: "Sep 28, 2024", items: 1, status: "delivered",  total: "₹1,499" },
  { id: "#AN-7652", date: "Sep 14, 2024", items: 5, status: "cancelled",  total: "₹5,329" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  delivered:  "bg-[#386b00]/10 text-[#386b00]",
  cancelled:  "bg-[#ba1a1a]/10 text-[#ba1a1a]",
  processing: "bg-[#f4f4ee] text-[#424843]",
  in_transit: "bg-[#a5f95b]/30 text-[#3b7100]",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  delivered:  "Delivered",
  cancelled:  "Cancelled",
  processing: "Processing",
  in_transit: "In Transit",
};

export default function RecentOrders() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <FadeIn direction="up" delay={0.1}>
      <div
        className="bg-white rounded-xl p-6 md:p-8 border border-[#c1c8c1]/30 h-full"
        style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.08)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
            Recent Orders
          </h3>
          <Link href="/dashboard">
            <motion.span
              whileHover={{ x: 2 }}
              className="flex items-center gap-1 font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#386b00] hover:underline cursor-pointer"
            >
              View All
              <ArrowIcon />
            </motion.span>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-left min-w-[480px]" ref={ref}>
            <thead>
              <tr className="border-b border-[#e3e3dd]">
                {["Order ID", "Date", "Items", "Status", "Total"].map((col) => (
                  <th
                    key={col}
                    className={`py-3 font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843] ${
                      col === "Total" ? "text-right" : ""
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e3dd]/60">
              {ORDERS.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: 0.45,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className="hover:bg-[#f4f4ee] transition-colors group cursor-pointer"
                >
                  <td className="py-4 font-bold text-sm font-[var(--font-work-sans)] text-[#032616]">
                    {order.id}
                  </td>
                  <td className="py-4 text-sm font-[var(--font-work-sans)] text-[#424843]">
                    {order.date}
                  </td>
                  <td className="py-4 text-sm font-[var(--font-work-sans)] text-[#424843]">
                    {order.items} {order.items === 1 ? "Item" : "Items"}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest font-[var(--font-work-sans)] ${STATUS_STYLES[order.status]}`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="py-4 text-sm font-[var(--font-work-sans)] text-[#032616] font-bold text-right">
                    {order.total}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </FadeIn>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

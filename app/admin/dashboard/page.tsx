"use client";

import { motion } from "framer-motion";
import MetricCard from "@/components/admin/MetricCard";
import SalesGrowthChart from "@/components/admin/SalesGrowthChart";
import CategoryDonut from "@/components/admin/CategoryDonut";
import TopCustomersTable from "@/components/admin/TopCustomersTable";
import ChurnAnalysis from "@/components/admin/ChurnAnalysis";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Metric Cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        <MetricCard
          iconBg="rgba(56,107,0,0.1)"
          icon={<MRRIcon />}
          label="Monthly Recurring Revenue"
          value="₹40,24,160"
          badge="+12.5%"
          badgeColor="green"
          note="+₹4,50,000 from last month"
          delay={0}
        />
        <MetricCard
          iconBg="rgba(3,38,22,0.1)"
          icon={<CACIcon />}
          label="Customer Acquisition Cost"
          value="₹1,535"
          badge="+4.2%"
          badgeColor="red"
          note="Target: Under ₹1,250"
          delay={0.1}
        />
        <MetricCard
          iconBg="#a5f95b"
          icon={<AOVIcon />}
          label="Avg. Order Value"
          value="₹5,349"
          badge="+8.1%"
          badgeColor="green"
          note="Premium sets driving growth"
          delay={0.2}
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.div
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <SalesGrowthChart />
        </motion.div>
        <motion.div
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <CategoryDonut />
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.div
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <TopCustomersTable />
        </motion.div>
        <motion.div
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <ChurnAnalysis />
        </motion.div>
      </div>
    </div>
  );
}

/* ── Metric Icons ─────────────── */
function MRRIcon() {
  return (
    <svg className="w-5 h-5 text-[#386b00]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function CACIcon() {
  return (
    <svg className="w-5 h-5 text-[#032616]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function AOVIcon() {
  return (
    <svg className="w-5 h-5 text-[#3b7100]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

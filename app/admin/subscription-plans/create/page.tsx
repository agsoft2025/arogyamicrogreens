"use client";

export const dynamic = 'force-static';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createPlan, PlanFeature, IconType, ButtonStyle, PlanStatus } from "@/services/subscription-plan.api";
import PlanForm, { PlanFormData } from "../_components/PlanForm";

const EMPTY_FORM: PlanFormData = {
  tier: "",
  name: "",
  tagline: "",
  price: "",
  period: "",
  buttonStyle: "primary",
  badge: "",
  featured: false,
  displayOrder: 0,
  status: "active",
  category: "microgreens",
  features: [],
};

export default function CreateSubscriptionPlanPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PlanFormData) => {
    setSaving(true);
    setError(null);
    try {
      await createPlan({
        ...data,
        buttonStyle: data.buttonStyle as ButtonStyle,
        status: data.status as PlanStatus,
        features: data.features as PlanFeature[],
      });
      router.push("/admin/subscription-plans?created=1");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message ?? "Failed to create plan");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6 max-w-2xl">
      {/* Breadcrumb */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <nav className="flex items-center gap-1.5 text-[12px] font-[var(--font-work-sans)] text-[#727973] mb-4" aria-label="Breadcrumb">
          <Link href="/admin/dashboard" className="hover:text-[#032616] transition-colors">Dashboard</Link>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
          <Link href="/admin/subscription-plans" className="hover:text-[#032616] transition-colors">Subscription Plans</Link>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
          <span className="text-[#1a1c19] font-bold">Create</span>
        </nav>

        <h1 className="font-[var(--font-libre-caslon)] text-[28px] md:text-[32px] font-bold text-[#032616] leading-tight">
          Add New Plan
        </h1>
        <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
          Create a new subscription tier that will appear on the pricing page.
        </p>
      </motion.header>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-[#ffdad6] text-[#ba1a1a] text-sm font-[var(--font-work-sans)] rounded-xl px-5 py-3.5"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <PlanForm
        initialData={EMPTY_FORM}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel="Create Plan"
        onCancel={() => router.push("/admin/subscription-plans")}
      />
    </div>
  );
}

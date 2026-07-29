"use client";

export const dynamic = 'force-static';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  getPlanById,
  updatePlan,
  SubscriptionPlan,
  PlanFeature,
  ButtonStyle,
  PlanStatus,
} from "@/api/subscription-plan.api";
import PlanForm, { PlanFormData } from "../../_components/PlanForm";

export default function EditSubscriptionPlanPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getPlanById(id)
      .then((data) => setPlan(data))
      .catch((err: unknown) => {
        const e = err as { message?: string };
        setLoadError(e?.message ?? "Failed to load plan");
      })
      .finally(() => setLoadingPlan(false));
  }, [id]);

  const handleSubmit = async (data: PlanFormData) => {
    setSaving(true);
    setSaveError(null);
    try {
      await updatePlan(id, {
        ...data,
        buttonStyle: data.buttonStyle as ButtonStyle,
        status: data.status as PlanStatus,
        features: data.features as PlanFeature[],
      });
      router.push("/admin/subscription-plans?updated=1");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setSaveError(e?.message ?? "Failed to update plan");
      setSaving(false);
    }
  };

  const initialData: PlanFormData | null = plan
    ? {
        tier: plan.tier,
        name: plan.name,
        tagline: plan.tagline,
        price: plan.price,
        period: plan.period,
        buttonStyle: plan.buttonStyle,
        badge: plan.badge,
        featured: plan.featured,
        displayOrder: plan.displayOrder,
        status: plan.status,
        category: plan.category ?? "microgreens",
        features: plan.features.map((f) => ({ ...f })),
      }
    : null;

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
          <span className="text-[#1a1c19] font-bold">Edit</span>
        </nav>

        <h1 className="font-[var(--font-libre-caslon)] text-[28px] md:text-[32px] font-bold text-[#032616] leading-tight">
          {plan ? `Edit — ${plan.name}` : "Edit Plan"}
        </h1>
        <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
          Update this subscription plan's details and features.
        </p>
      </motion.header>

      {/* Load error */}
      {!loadingPlan && loadError && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#ffdad6] flex items-center justify-center">
            <svg className="w-7 h-7 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <p className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616]">Could not load plan</p>
          <p className="text-sm text-[#727973] font-[var(--font-work-sans)]">{loadError}</p>
          <Link href="/admin/subscription-plans">
            <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="inline-block text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors cursor-pointer"
            >
              Back to Plans
            </motion.span>
          </Link>
        </div>
      )}

      {/* Loading skeleton */}
      {loadingPlan && (
        <div className="bg-white rounded-xl border border-[#e3e3dd] p-8 space-y-5 animate-pulse"
          style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.06)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-24 bg-[#f0f4f0] rounded" />
              <div className="h-11 bg-[#f0f4f0] rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Save error */}
      <AnimatePresence>
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-[#ffdad6] text-[#ba1a1a] text-sm font-[var(--font-work-sans)] rounded-xl px-5 py-3.5"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            {saveError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form — only render once we have data */}
      {!loadingPlan && !loadError && initialData && (
        <PlanForm
          initialData={initialData}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Save Changes"
          onCancel={() => router.push("/admin/subscription-plans")}
        />
      )}
    </div>
  );
}

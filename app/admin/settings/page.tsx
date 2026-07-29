"use client";

export const dynamic = 'force-static';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getReviewSettings, updateReviewSettings } from "@/api/review-settings.api";
import { invalidateReviewSettingsCache } from "@/hooks/useReviewSettings";
import type { ReviewSettings } from "@/types/review-settings.types";

/* ── Default / loading skeleton values ───────────────────────── */

const DEFAULTS: Omit<ReviewSettings, "_id" | "updatedAt"> = {
  reviewsEnabled: true,
  showRatingOnCards: true,
  showRatingOnDetailPage: true,
  showReviewCount: true,
  minimumRatingToShow: 0,
};

/* ── Page ─────────────────────────────────────────────────────── */

export default function AdminSettingsPage() {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Load current settings */
  useEffect(() => {
    getReviewSettings()
      .then((s) => {
        setForm({
          reviewsEnabled: s.reviewsEnabled,
          showRatingOnCards: s.showRatingOnCards,
          showRatingOnDetailPage: s.showRatingOnDetailPage,
          showReviewCount: s.showReviewCount,
          minimumRatingToShow: s.minimumRatingToShow,
        });
      })
      .catch(() => setError("Failed to load settings. Using defaults."))
      .finally(() => setLoading(false));
  }, []);

  function toggle(key: keyof typeof DEFAULTS) {
    if (typeof form[key] !== "boolean") return;
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateReviewSettings(form);
      invalidateReviewSettingsCache();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf4]">
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#386b00] mb-1 font-[var(--font-work-sans)]">
            Admin Portal
          </p>
          <h1 className="font-[var(--font-libre-caslon)] text-3xl font-bold text-[#032616]">
            Settings
          </h1>
          <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
            Manage global application configuration.
          </p>
        </motion.div>

        {/* ── Review Settings Card ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="bg-white rounded-2xl border border-[#e3e3dd] overflow-hidden shadow-sm"
        >
          {/* Card header */}
          <div className="px-8 py-6 border-b border-[#f0f4f0]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#edf7e0] flex items-center justify-center shrink-0">
                <StarIcon className="w-5 h-5 text-[#386b00]" />
              </div>
              <div>
                <h2 className="font-bold text-[#1a1c19] font-[var(--font-work-sans)] text-base">
                  Customer Review Settings
                </h2>
                <p className="text-xs text-[#727973] font-[var(--font-work-sans)] mt-0.5">
                  Control how ratings and reviews appear across the storefront.
                </p>
              </div>
            </div>
          </div>

          {/* Skeleton */}
          {loading && (
            <div className="px-8 py-6 space-y-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="space-y-1.5">
                    <div className="h-4 bg-[#e3e3dd] rounded w-48" />
                    <div className="h-3 bg-[#e3e3dd] rounded w-64" />
                  </div>
                  <div className="w-11 h-6 bg-[#e3e3dd] rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* Settings rows */}
          {!loading && (
            <div className="divide-y divide-[#f0f4f0]">
              <ToggleRow
                label="Enable Reviews"
                description="Master switch. Turning this off hides all star ratings across the entire storefront."
                checked={form.reviewsEnabled}
                onChange={() => toggle("reviewsEnabled")}
                accent
              />

              {/* Sub-settings — visually dimmed when master is off */}
              <div className={`transition-opacity duration-300 ${form.reviewsEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                <ToggleRow
                  label="Show Ratings on Product Cards"
                  description="Display the star rating on product listing cards (shop grid, microgreens collection, search results)."
                  checked={form.showRatingOnCards}
                  onChange={() => toggle("showRatingOnCards")}
                />
                <ToggleRow
                  label="Show Ratings on Detail Pages"
                  description="Display the star rating on individual product and microgreen detail pages."
                  checked={form.showRatingOnDetailPage}
                  onChange={() => toggle("showRatingOnDetailPage")}
                />
                <ToggleRow
                  label="Show Review Count"
                  description='Display the number of reviews alongside the star rating, e.g. "4.8 (124)".'
                  checked={form.showReviewCount}
                  onChange={() => toggle("showReviewCount")}
                />
              </div>

              {/* Minimum rating threshold */}
              <div className={`px-8 py-5 transition-opacity duration-300 ${form.reviewsEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1a1c19] font-[var(--font-work-sans)]">
                      Minimum Rating to Display
                    </p>
                    <p className="text-xs text-[#727973] font-[var(--font-work-sans)] mt-0.5 leading-relaxed">
                      Products with a rating below this threshold will not show the rating widget.
                      Set to <strong>0</strong> to show all ratings.
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={form.minimumRatingToShow}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!isNaN(v) && v >= 0 && v <= 5) {
                          setForm((prev) => ({ ...prev, minimumRatingToShow: v }));
                          setSaved(false);
                        }
                      }}
                      className="w-20 px-3 py-2 rounded-lg border border-[#e3e3dd] text-sm font-bold text-[#1a1c19] font-[var(--font-work-sans)] text-center focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors"
                    />
                    <span className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                      0 – 5 stars
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-8 py-5 bg-[#fafaf4] border-t border-[#f0f4f0] flex items-center justify-between gap-4">
            {/* Status message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-[#ba1a1a] font-[var(--font-work-sans)] flex items-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  {error}
                </motion.p>
              )}
              {saved && !error && (
                <motion.p
                  key="saved"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-[#386b00] font-[var(--font-work-sans)] flex items-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Settings saved successfully.
                </motion.p>
              )}
              {!saved && !error && <span />}
            </AnimatePresence>

            <motion.button
              onClick={handleSave}
              disabled={saving || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#0a3d20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                "Save Settings"
              )}
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

/* ── ToggleRow ─────────────────────────────────────────────────── */

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  accent = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  accent?: boolean;
}) {
  return (
    <div className="px-8 py-5 flex items-start justify-between gap-6">
      <div className="min-w-0">
        <p className={`text-sm font-bold font-[var(--font-work-sans)] ${accent ? "text-[#032616]" : "text-[#1a1c19]"}`}>
          {label}
        </p>
        <p className="text-xs text-[#727973] font-[var(--font-work-sans)] mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#386b00]/50 ${
          checked ? (accent ? "bg-[#386b00]" : "bg-[#386b00]") : "bg-[#d4ddd0]"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────────── */

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

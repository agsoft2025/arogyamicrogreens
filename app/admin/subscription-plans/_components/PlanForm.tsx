"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IconType, PlanCategory } from "@/api/subscription-plan.api";

export interface PlanFormData {
  tier: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  buttonStyle: "primary" | "secondary";
  badge: string;
  featured: boolean;
  displayOrder: number;
  status: "active" | "inactive";
  category: PlanCategory;
  features: { text: string; highlight: boolean; iconType: IconType }[];
}

interface PlanFormProps {
  initialData: PlanFormData;
  onSubmit: (data: PlanFormData) => Promise<void>;
  saving: boolean;
  submitLabel: string;
  onCancel: () => void;
}

const EMPTY_FEATURE = (): { text: string; highlight: boolean; iconType: IconType } => ({
  text: "",
  highlight: false,
  iconType: "none",
});

export default function PlanForm({
  initialData,
  onSubmit,
  saving,
  submitLabel,
  onCancel,
}: PlanFormProps) {
  const [form, setForm] = useState<PlanFormData>({ ...initialData, features: initialData.features.map((f) => ({ ...f })) });
  const [errors, setErrors] = useState<Partial<Record<keyof PlanFormData | `feature_${number}`, string>>>({});
  // Raw string for displayOrder — lets the user clear the field while editing
  const [rawDisplayOrder, setRawDisplayOrder] = useState(String(initialData.displayOrder));

  const setField = <K extends keyof PlanFormData>(key: K, value: PlanFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const addFeature = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, EMPTY_FEATURE()] }));
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    setErrors((prev) => {
      const n = { ...prev };
      delete n[`feature_${index}` as `feature_${number}`];
      return n;
    });
  };

  const setFeatureField = (
    index: number,
    key: keyof { text: string; highlight: boolean; iconType: IconType },
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((f, i) =>
        i === index ? { ...f, [key]: value } : f
      ),
    }));
    const errKey = `feature_${index}` as `feature_${number}`;
    if (errors[errKey]) setErrors((prev) => { const n = { ...prev }; delete n[errKey]; return n; });
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.tier.trim()) errs.tier = "Tier label is required";
    if (!form.name.trim()) errs.name = "Plan name is required";
    if (!form.tagline.trim()) errs.tagline = "Tagline is required";
    if (!form.price.trim()) errs.price = "Price is required";
    if (!form.period.trim()) errs.period = "Period is required";
    form.features.forEach((f, i) => {
      if (!f.text.trim()) errs[`feature_${i}` as `feature_${number}`] = "Feature text is required";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3.5 py-2.5 rounded-lg border text-sm font-[var(--font-work-sans)] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#386b00]/30 ${
      hasError
        ? "border-red-400 focus:border-red-400"
        : "border-[#d4ddd0] focus:border-[#386b00]"
    }`;

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-[#e3e3dd] p-8 space-y-6"
      style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.06)" }}
      noValidate
    >
      {/* ── Core Fields ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Tier Label" error={errors.tier} required>
          <input
            type="text"
            value={form.tier}
            onChange={(e) => setField("tier", e.target.value)}
            placeholder="e.g. Entry Level"
            className={inputClass(!!errors.tier)}
          />
        </Field>

        <Field label="Plan Name" error={errors.name} required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g. Weekly Plan"
            className={inputClass(!!errors.name)}
          />
        </Field>
      </div>

      <Field label="Tagline" error={errors.tagline} required>
        <input
          type="text"
          value={form.tagline}
          onChange={(e) => setField("tagline", e.target.value)}
          placeholder="e.g. Perfect for solo health enthusiasts"
          className={inputClass(!!errors.tagline)}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Price" error={errors.price} required hint="Include currency symbol, e.g. ₹1,599">
          <input
            type="text"
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            placeholder="₹1,599"
            className={inputClass(!!errors.price)}
          />
        </Field>

        <Field label="Period" error={errors.period} required hint="e.g. /week or /month">
          <input
            type="text"
            value={form.period}
            onChange={(e) => setField("period", e.target.value)}
            placeholder="week"
            className={inputClass(!!errors.period)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Badge Text" hint="Leave empty for no badge">
          <input
            type="text"
            value={form.badge}
            onChange={(e) => setField("badge", e.target.value)}
            placeholder="e.g. Most Popular"
            className={inputClass(false)}
          />
        </Field>

        <Field label="Display Order" hint="Lower numbers appear first">
          <input
            type="number"
            value={rawDisplayOrder}
            min={0}
            onChange={(e) => {
              setRawDisplayOrder(e.target.value);
              const parsed = parseInt(e.target.value, 10);
              setField("displayOrder", isNaN(parsed) ? 0 : Math.max(0, parsed));
            }}
            onBlur={() => setRawDisplayOrder(String(form.displayOrder))}
            onWheel={(e) => e.currentTarget.blur()}
            className={inputClass(false)}
          />
        </Field>
      </div>

      <Field label="Category" required>
        <select
          value={form.category}
          onChange={(e) => setField("category", e.target.value as PlanCategory)}
          className={inputClass(false)}
        >
          <option value="microgreens">Microgreens Subscription Plans</option>
          <option value="microgreens-meal">Microgreens &amp; Meal Subscription Plans</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Button Style">
          <select
            value={form.buttonStyle}
            onChange={(e) => setField("buttonStyle", e.target.value as "primary" | "secondary")}
            className={inputClass(false)}
          >
            <option value="primary">Primary (dark green)</option>
            <option value="secondary">Secondary (bright green)</option>
          </select>
        </Field>

        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => setField("status", e.target.value as "active" | "inactive")}
            className={inputClass(false)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
      </div>

      {/* ── Checkboxes ── */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setField("featured", !form.featured)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              form.featured ? "bg-[#386b00] border-[#386b00]" : "border-[#c1c8c1] hover:border-[#386b00]"
            }`}
          >
            {form.featured && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path d="m5 13 4 4L19 7" />
              </svg>
            )}
          </div>
          <div>
            <span className="text-sm font-bold font-[var(--font-work-sans)] text-[#1a1c19]">Featured Plan</span>
            <p className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)]">Only one plan can be featured at a time</p>
          </div>
        </label>
      </div>

      <div className="border-t border-[#f4f4ee]" />

      {/* ── Features ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616]">Features</h3>
            <p className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-0.5">
              Features shown on the plan card
            </p>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={addFeature}
            className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-4 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
            </svg>
            Add Feature
          </motion.button>
        </div>

        <AnimatePresence initial={false}>
          {form.features.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)] text-center py-6 border-2 border-dashed border-[#e3e3dd] rounded-xl"
            >
              No features yet. Click "Add Feature" to add one.
            </motion.p>
          )}

          {form.features.map((feat, i) => {
            const errKey = `feature_${i}` as `feature_${number}`;
            return (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mb-3 bg-[#fafaf4] rounded-xl border border-[#e3e3dd] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <div>
                      <input
                        type="text"
                        value={feat.text}
                        onChange={(e) => setFeatureField(i, "text", e.target.value)}
                        placeholder="Feature text, e.g. Free Delivery"
                        className={inputClass(!!errors[errKey])}
                      />
                      {errors[errKey] && (
                        <p className="text-[#ba1a1a] text-xs font-[var(--font-work-sans)] mt-1">{errors[errKey]}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div
                          onClick={() => setFeatureField(i, "highlight", !feat.highlight)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                            feat.highlight ? "bg-[#386b00] border-[#386b00]" : "border-[#c1c8c1] hover:border-[#386b00]"
                          }`}
                        >
                          {feat.highlight && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path d="m5 13 4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[11px] font-bold font-[var(--font-work-sans)] text-[#424843]">Highlighted</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold font-[var(--font-work-sans)] text-[#424843]">Icon:</span>
                        <select
                          value={feat.iconType}
                          onChange={(e) => setFeatureField(i, "iconType", e.target.value as IconType)}
                          className="text-[11px] font-[var(--font-work-sans)] border border-[#e3e3dd] rounded-lg px-2.5 py-1.5 bg-white outline-none focus:border-[#386b00] transition-colors"
                        >
                          <option value="none">• Bullet</option>
                          <option value="star">⭐ Star</option>
                          <option value="gift">🎁 Gift</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => removeFeature(i)}
                    className="p-2 text-[#9ca8a3] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded-lg transition-colors shrink-0 mt-0.5"
                    aria-label={`Remove feature ${i + 1}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Form Actions ── */}
      <div className="flex gap-3 pt-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
          onClick={onCancel}
          disabled={saving}
          className="flex-1 py-3.5 rounded-xl border border-[#e3e3dd] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#f4f4ee] transition-colors disabled:opacity-50"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: saving ? 1 : 1.01 }} whileTap={{ scale: saving ? 1 : 0.97 }}
          disabled={saving}
          className="flex-[2] py-3.5 rounded-xl bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#4a8a00] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <motion.svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </motion.svg>
              Saving…
            </>
          ) : submitLabel}
        </motion.button>
      </div>
    </motion.form>
  );
}

/* ── Helper components ── */

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843] mb-1.5">
        {label}{required && <span className="text-[#ba1a1a] ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-1">{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)] mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

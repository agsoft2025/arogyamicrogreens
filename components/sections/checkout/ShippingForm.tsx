"use client";

import { motion } from "framer-motion";

export interface ShippingData {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
}

export interface ShippingErrors {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  zip?: string;
}

interface ShippingFormProps {
  data: ShippingData;
  errors: ShippingErrors;
  onChange: (field: keyof ShippingData, value: string) => void;
}

export default function ShippingForm({ data, errors, onChange }: ShippingFormProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
      className="bg-white rounded-xl p-6 border border-[#c1c8c1]/30"
      style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.10)" }}
    >
      {/* Section header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2.5">
          <LocationIcon />
          <h2 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
            Shipping Address
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#386b00] hover:underline"
        >
          Change
        </motion.button>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Full Name"
          value={data.fullName}
          error={errors.fullName}
          placeholder="Julianna Veldon"
          onChange={(v) => onChange("fullName", v)}
        />
        <Field
          label="Phone Number"
          value={data.phone}
          error={errors.phone}
          placeholder="+1 (555) 000-1234"
          onChange={(v) => onChange("phone", v)}
        />
        <div className="md:col-span-2">
          <Field
            label="Street Address"
            value={data.street}
            error={errors.street}
            placeholder="482 Green Harvest Lane, Organic Valley"
            onChange={(v) => onChange("street", v)}
          />
        </div>
        <Field
          label="City / State"
          value={data.city}
          error={errors.city}
          placeholder="Portland, OR"
          onChange={(v) => onChange("city", v)}
        />
        <Field
          label="Zip Code"
          value={data.zip}
          error={errors.zip}
          placeholder="97201"
          onChange={(v) => onChange("zip", v)}
        />
      </div>
    </motion.section>
  );
}

function Field({
  label,
  value,
  error,
  placeholder,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  error?: string;
  placeholder: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`border rounded-lg px-3 py-3 bg-transparent text-sm font-[var(--font-work-sans)] text-[#1a1c19] placeholder:text-[#c1c8c1] outline-none transition-colors ${
          error
            ? "border-[#ba1a1a] focus:border-[#ba1a1a]"
            : "border-[#c1c8c1] focus:border-[#032616]"
        }`}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#ba1a1a] text-xs font-[var(--font-work-sans)]"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

function LocationIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#386b00] shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

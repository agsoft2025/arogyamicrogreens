"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SavedAddress } from "@/api/user.api";

export interface ShippingData {
  fullName: string;
  phone: string;
  street: string;       // → addressLine1
  addressLine2: string; // optional second line
  city: string;
  state: string;        // e.g. "Maharashtra"
  zip: string;          // → postalCode
  country: string;      // e.g. "India"
}

export interface ShippingErrors {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface ShippingFormProps {
  data: ShippingData;
  errors: ShippingErrors;
  onChange: (field: keyof ShippingData, value: string) => void;
  savedAddresses?: SavedAddress[];
  onSelectSaved?: (address: SavedAddress) => void;
}

export default function ShippingForm({
  data,
  errors,
  onChange,
  savedAddresses = [],
  onSelectSaved,
}: ShippingFormProps) {
  const hasSaved = savedAddresses.length > 0;

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
      </div>

      {/* Saved address picker */}
      <AnimatePresence>
        {hasSaved && onSelectSaved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5"
          >
            <p className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843] mb-2">
              Saved Addresses
            </p>
            <div className="flex flex-col gap-2">
              {savedAddresses.map((addr) => (
                <motion.button
                  key={addr._id}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectSaved(addr)}
                  className="text-left w-full border border-[#c1c8c1] hover:border-[#386b00] rounded-lg px-4 py-3 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {addr.label && (
                        <span className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#386b00] mr-2">
                          {addr.label}
                        </span>
                      )}
                      {addr.isDefault && (
                        <span className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#727973]">
                          Default
                        </span>
                      )}
                      <p className="text-sm font-semibold text-[#1a1c19] font-[var(--font-work-sans)] mt-0.5">
                        {addr.fullName} · {addr.phone}
                      </p>
                      <p className="text-xs text-[#424843] font-[var(--font-work-sans)]">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ""},{" "}
                        {addr.city}, {addr.state} – {addr.postalCode},{" "}
                        {addr.country}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider font-[var(--font-work-sans)] text-[#386b00] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                      Use →
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#e3e3dd]" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#9ca8a3] font-[var(--font-work-sans)]">
                Or enter new address
              </span>
              <div className="flex-1 h-px bg-[#e3e3dd]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Full Name"
          value={data.fullName}
          error={errors.fullName}
          placeholder="Ravi Kumar"
          onChange={(v) => onChange("fullName", v)}
        />
        <Field
          label="Phone Number"
          value={data.phone}
          error={errors.phone}
          placeholder="+91 98765 43210"
          onChange={(v) => onChange("phone", v)}
        />
        <div className="md:col-span-2">
          <Field
            label="Street Address / Flat, Building"
            value={data.street}
            error={errors.street}
            placeholder="Flat 4B, Sunrise Apartments, MG Road"
            onChange={(v) => onChange("street", v)}
          />
        </div>
        <div className="md:col-span-2">
          <Field
            label="Address Line 2 (optional)"
            value={data.addressLine2}
            placeholder="Near City Mall, Landmark"
            onChange={(v) => onChange("addressLine2", v)}
          />
        </div>
        <Field
          label="City"
          value={data.city}
          error={errors.city}
          placeholder="Hyderabad"
          onChange={(v) => onChange("city", v)}
        />
        <Field
          label="State"
          value={data.state}
          error={errors.state}
          placeholder="Telangana"
          onChange={(v) => onChange("state", v)}
        />
        <Field
          label="PIN Code"
          value={data.zip}
          error={errors.zip}
          placeholder="500032"
          onChange={(v) => onChange("zip", v)}
        />
        <Field
          label="Country"
          value={data.country}
          error={errors.country}
          placeholder="India"
          onChange={(v) => onChange("country", v)}
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

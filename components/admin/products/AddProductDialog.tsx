"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createProduct, updateProduct } from "@/api/product.api";
import type { CreateProductPayload, Product, ProductCategory, ProductStatus } from "@/types/product.types";
import type { ApiError } from "@/api/axios";
import FeaturedToggle from "@/components/admin/FeaturedToggle";
import ProductBenefitsInput from "./ProductBenefitsInput";
import ProductTagsInput from "./ProductTagsInput";
import ProductImageUploader from "./ProductImageUploader";
import { buildServerUrl } from "@/api/upload.api";

/* ── Helpers ─────────────────────────────────────────────────── */

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const WEIGHT_UNITS = ["g", "kg", "ml", "litre", "oz", "lb"];
const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "active",   label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft",    label: "Draft" },
];

/* ── Form state ──────────────────────────────────────────────── */

interface FormValues {
  name: string;
  slug: string;
  slugManual: boolean;
  sku: string;
  category: ProductCategory | "";
  price: string;
  salePrice: string;
  stock: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  /** New uploads from ProductImageUploader (URLs returned by upload API) */
  newImages: string[];
  /** Featured URL — may point to an existing image or a new upload */
  featuredImage: string;
  weight: string;
  weightUnit: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  status: ProductStatus;
  tags: string[];
  seoMetaTitle: string;
  seoMetaDescription: string;
}

interface FormErrors {
  name?: string;
  slug?: string;
  sku?: string;
  category?: string;
  price?: string;
  stock?: string;
  [key: string]: string | undefined;
}

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "product",    label: "Product" },
  { value: "microgreen", label: "Microgreen" },
];

const BLANK_FORM: FormValues = {
  name: "",
  slug: "",
  slugManual: false,
  sku: "",
  category: "",
  price: "",
  salePrice: "",
  stock: "",
  shortDescription: "",
  description: "",
  benefits: [],
  newImages: [],
  featuredImage: "",
  weight: "",
  weightUnit: "g",
  isFeatured: false,
  isBestSeller: false,
  status: "draft",
  tags: [],
  seoMetaTitle: "",
  seoMetaDescription: "",
};

function productToForm(p: Product): FormValues {
  return {
    name: p.name,
    slug: p.slug,
    slugManual: true, // keep existing slug; don't auto-regenerate
    sku: p.sku,
    category: p.category,
    price: String(p.price),
    salePrice: p.salePrice != null ? String(p.salePrice) : "",
    stock: String(p.stock),
    shortDescription: p.shortDescription ?? "",
    description: p.description ?? "",
    benefits: p.benefits ?? [],
    newImages: [],                       // new uploads start empty
    featuredImage: p.featuredImage ?? "",
    weight: p.weight != null ? String(p.weight) : "",
    weightUnit: p.weightUnit ?? "g",
    isFeatured: p.isFeatured,
    isBestSeller: p.isBestSeller,
    status: p.status,
    tags: p.tags ?? [],
    seoMetaTitle: p.seo?.metaTitle ?? "",
    seoMetaDescription: p.seo?.metaDescription ?? "",
  };
}

/* ── Props ───────────────────────────────────────────────────── */

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** "create" (default) or "edit" */
  mode?: "create" | "edit";
  /** Required when mode === "edit" */
  initialProduct?: Product;
}

/* ── Sub-component helpers ───────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-4">
      {children}
    </p>
  );
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-bold tracking-widest uppercase text-[#424843] mb-1.5 font-[var(--font-work-sans)]"
    >
      {children}
      {required && <span className="text-[#ba1a1a] ml-1">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-1 text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)]"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

const inputCls = (error?: string) =>
  `w-full border rounded-lg px-3 py-2.5 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white placeholder:text-[#b0b8b0] outline-none transition-colors ${
    error
      ? "border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30"
      : "border-[#e3e3dd] focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30"
  }`;

const textareaCls = (error?: string) =>
  `w-full border rounded-lg px-3 py-2.5 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white placeholder:text-[#b0b8b0] outline-none transition-colors resize-none ${
    error
      ? "border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30"
      : "border-[#e3e3dd] focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30"
  }`;

/* ── ExistingImagesGrid ──────────────────────────────────────── */

/**
 * Displays images that already exist on a product (edit mode).
 * Allows removing images and setting the featured image.
 */
function ExistingImagesGrid({
  images,
  featuredImage,
  onRemove,
  onSetFeatured,
}: {
  images: string[];
  featuredImage: string;
  onRemove: (url: string) => void;
  onSetFeatured: (url: string) => void;
}) {
  if (images.length === 0) return null;
  return (
    <div className="mb-4">
      <p className="text-[11px] font-bold tracking-widest uppercase text-[#9ca8a3] font-[var(--font-work-sans)] mb-2">
        Current Images ({images.length})
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <AnimatePresence initial={false}>
          {images.map((url) => {
            const isFeatured = url === featuredImage;
            return (
              <motion.div
                key={url}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-xl overflow-hidden border-2 ${
                  isFeatured
                    ? "border-[#386b00] shadow-sm shadow-[#386b00]/10"
                    : "border-[#e3e3dd]"
                }`}
              >
                <div className="aspect-square bg-[#f4f4ee]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={buildServerUrl(url)}
                    alt="Product image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>

                {isFeatured && (
                  <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-[#386b00] text-white text-[9px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] px-2 py-0.5 rounded-full">
                    ★ Featured
                  </div>
                )}

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-end justify-between p-2 gap-1 opacity-0 hover:opacity-100">
                  {!isFeatured && (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.93 }}
                      onClick={() => onSetFeatured(url)}
                      className="flex-1 text-[10px] font-bold font-[var(--font-work-sans)] bg-white/90 text-[#032616] rounded-md py-1 px-1.5 hover:bg-white transition-colors"
                    >
                      Set Featured
                    </motion.button>
                  )}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemove(url)}
                    aria-label="Remove image"
                    className="p-1.5 bg-[#ba1a1a]/90 text-white rounded-md hover:bg-[#ba1a1a] transition-colors shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Main Dialog ─────────────────────────────────────────────── */

export default function AddProductDialog({
  open,
  onClose,
  onSuccess,
  mode = "create",
  initialProduct,
}: AddProductDialogProps) {
  const isEdit = mode === "edit";
  const formId = isEdit ? "edit-product-form" : "add-product-form";

  const [form, setForm]           = useState<FormValues>(BLANK_FORM);
  const [errors, setErrors]       = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [seoOpen, setSeoOpen]     = useState(false);

  /**
   * Existing images (from initialProduct) tracked separately from new uploads.
   * This lets us show current images, allow removal, and merge with new uploads
   * at submit time without interfering with the uploader's internal state.
   */
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // Ref so the uploader's onFeaturedImageChange closure always reads fresh value
  const featuredImageRef = useRef(form.featuredImage);
  useEffect(() => { featuredImageRef.current = form.featuredImage; }, [form.featuredImage]);

  /* ── Reset/populate form when dialog opens ── */
  useEffect(() => {
    if (!open) return;
    if (isEdit && initialProduct) {
      setForm(productToForm(initialProduct));
      setExistingImages([...(initialProduct.images ?? [])]);
    } else {
      setForm(BLANK_FORM);
      setExistingImages([]);
    }
    setErrors({});
    setSubmitError("");
    setSeoOpen(false);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── ESC to close ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, submitting, onClose]);

  /* ── Prevent body scroll ── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* ── Generic field setter ── */
  const set = useCallback(<K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !prev.slugManual) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
    if (errors[key as string]) {
      setErrors((prev) => { const n = { ...prev }; delete n[key as string]; return n; });
    }
  }, [errors]);

  /* ── Existing image management ── */
  const handleRemoveExisting = useCallback((url: string) => {
    setExistingImages((prev) => {
      const next = prev.filter((u) => u !== url);
      // If the removed image was featured, reassign to first remaining or clear
      setForm((f) => {
        if (f.featuredImage !== url) return f;
        const nextFeatured = next[0] ?? "";
        return { ...f, featuredImage: nextFeatured };
      });
      return next;
    });
  }, []);

  const handleSetExistingFeatured = useCallback((url: string) => {
    setForm((prev) => ({ ...prev, featuredImage: url }));
  }, []);

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.slug.trim()) e.slug = "Slug is required.";
    else if (!/^[a-z0-9-]+$/.test(form.slug))
      e.slug = "Slug can only contain lowercase letters, numbers, and hyphens.";
    if (!form.sku.trim()) e.sku = "SKU is required.";
    if (!form.category) e.category = "Category is required.";
    if (!form.price) e.price = "Price is required.";
    else if (isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = "Price must be a valid positive number.";
    if (form.salePrice && (isNaN(Number(form.salePrice)) || Number(form.salePrice) < 0))
      e.salePrice = "Sale price must be a valid positive number.";
    if (!form.stock && form.stock !== "0") e.stock = "Stock quantity is required.";
    else if (isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Stock must be 0 or more.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Build the full images list (existing + new uploads) ── */
  const getAllImages = (): string[] => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const url of [...existingImages, ...form.newImages]) {
      if (!seen.has(url)) { seen.add(url); result.push(url); }
    }
    return result;
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    const allImages = getAllImages();

    const payload: CreateProductPayload = {
      name:             form.name.trim(),
      slug:             form.slug.trim(),
      sku:              form.sku.trim(),
      category:         form.category as ProductCategory,
      price:            Number(form.price),
      salePrice:        form.salePrice ? Number(form.salePrice) : undefined,
      stock:            Number(form.stock),
      shortDescription: form.shortDescription.trim() || undefined,
      description:      form.description.trim() || undefined,
      benefits:         form.benefits.filter(Boolean),
      images:           allImages,
      featuredImage:    form.featuredImage || undefined,
      weight:           form.weight ? Number(form.weight) : undefined,
      weightUnit:       form.weight ? form.weightUnit : undefined,
      isFeatured:       form.isFeatured,
      isBestSeller:     form.isBestSeller,
      status:           form.status,
      tags:             form.tags,
      seo:
        form.seoMetaTitle || form.seoMetaDescription
          ? {
              metaTitle:       form.seoMetaTitle || undefined,
              metaDescription: form.seoMetaDescription || undefined,
            }
          : undefined,
    };

    setSubmitting(true);
    try {
      let res;
      if (isEdit && initialProduct) {
        res = await updateProduct(initialProduct._id, payload);
      } else {
        res = await createProduct(payload);
      }
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setSubmitError(res.message ?? `Failed to ${isEdit ? "update" : "create"} product.`);
      }
    } catch (err) {
      const apiErr = err as ApiError;
      setSubmitError(apiErr?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Title / button copy ── */
  const dialogTitle  = isEdit ? "Edit Product" : "Add New Product";
  const dialogSubtitle = isEdit
    ? "Update the product details below."
    : "Fill in the details below to add a product to your catalog.";
  const submitLabel  = isEdit ? "Save Changes" : "Create Product";
  const loadingLabel = isEdit ? "Saving…" : "Creating…";
  const ariaLabel    = isEdit ? `Edit product ${initialProduct?.name ?? ""}` : "Add new product";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm hidden md:block"
            onClick={submitting ? undefined : onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.28, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            className={`
              fixed z-[301] bg-white flex flex-col
              inset-0
              md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
              md:w-full md:max-w-3xl md:max-h-[92vh]
              md:rounded-2xl md:shadow-2xl
            `}
          >
            {/* ── Sticky Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e3dd] shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  {isEdit && (
                    <span className="text-[9px] font-bold tracking-widest uppercase bg-[#386b00]/10 text-[#386b00] px-2 py-0.5 rounded-full font-[var(--font-work-sans)]">
                      Editing
                    </span>
                  )}
                  <h2 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">
                    {dialogTitle}
                  </h2>
                </div>
                <p className="text-[12px] text-[#727973] font-[var(--font-work-sans)] mt-0.5">
                  {dialogSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={submitting ? undefined : onClose}
                aria-label="Close dialog"
                disabled={submitting}
                className="p-2 rounded-lg text-[#727973] hover:bg-[#f4f4ee] hover:text-[#032616] transition-colors focus:outline-none focus:ring-2 focus:ring-[#386b00] disabled:opacity-40"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Scrollable Form Body ── */}
            <form
              id={formId}
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto"
              noValidate
            >
              <div className="px-6 py-6 space-y-8">

                {/* ── Section 1: Basic Information ── */}
                <section>
                  <SectionLabel>Basic Information</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <FieldLabel htmlFor="pf-name" required>Product Name</FieldLabel>
                      <input
                        id="pf-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Broccoli Microgreens"
                        className={inputCls(errors.name)}
                      />
                      <FieldError message={errors.name} />
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel htmlFor="pf-slug" required>Slug (URL)</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca8a3] text-sm font-[var(--font-work-sans)] pointer-events-none select-none">
                          /products/
                        </span>
                        <input
                          id="pf-slug"
                          type="text"
                          value={form.slug}
                          onChange={(e) => {
                            set("slug", e.target.value.toLowerCase());
                            setForm((p) => ({ ...p, slugManual: true }));
                          }}
                          placeholder="broccoli-microgreens"
                          className={`${inputCls(errors.slug)} pl-[88px]`}
                        />
                      </div>
                      {!isEdit && (
                        <p className="mt-1 text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                          Auto-generated from name. You can edit it manually.
                        </p>
                      )}
                      <FieldError message={errors.slug} />
                    </div>

                    <div>
                      <FieldLabel htmlFor="pf-sku" required>SKU</FieldLabel>
                      <input
                        id="pf-sku"
                        type="text"
                        value={form.sku}
                        onChange={(e) => set("sku", e.target.value.toUpperCase())}
                        placeholder="MG-BR-001"
                        className={inputCls(errors.sku)}
                      />
                      <FieldError message={errors.sku} />
                    </div>

                    <div>
                      <FieldLabel htmlFor="pf-category" required>Category</FieldLabel>
                      <div className="relative">
                        <select
                          id="pf-category"
                          value={form.category}
                          onChange={(e) => set("category", e.target.value as ProductCategory | "")}
                          className={`w-full appearance-none border rounded-lg px-3 py-2.5 pr-8 text-sm font-[var(--font-work-sans)] bg-white outline-none transition-colors ${
                            errors.category
                              ? "border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30 text-[#1a1c19]"
                              : "border-[#e3e3dd] focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 text-[#1a1c19]"
                          } ${!form.category ? "text-[#b0b8b0]" : ""}`}
                        >
                          <option value="" disabled>Select Category</option>
                          {CATEGORY_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727973] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                      <FieldError message={errors.category} />
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#f0f4f0]" />

                {/* ── Section 2: Pricing & Inventory ── */}
                <section>
                  <SectionLabel>Pricing &amp; Inventory</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <FieldLabel htmlFor="pf-price" required>Price (₹)</FieldLabel>
                      <input id="pf-price" type="number" min="0" step="0.01"
                        value={form.price} onChange={(e) => set("price", e.target.value)}
                        placeholder="0.00" className={inputCls(errors.price)} />
                      <FieldError message={errors.price} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="pf-saleprice">Sale Price (₹)</FieldLabel>
                      <input id="pf-saleprice" type="number" min="0" step="0.01"
                        value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)}
                        placeholder="Optional" className={inputCls(errors.salePrice)} />
                      <FieldError message={errors.salePrice} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="pf-stock" required>Stock Qty</FieldLabel>
                      <input id="pf-stock" type="number" min="0" step="1"
                        value={form.stock} onChange={(e) => set("stock", e.target.value)}
                        placeholder="0" className={inputCls(errors.stock)} />
                      <FieldError message={errors.stock} />
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#f0f4f0]" />

                {/* ── Section 3: Description ── */}
                <section>
                  <SectionLabel>Description</SectionLabel>
                  <div className="space-y-4">
                    <div>
                      <FieldLabel htmlFor="pf-shortdesc">Short Description</FieldLabel>
                      <textarea id="pf-shortdesc" rows={2} value={form.shortDescription}
                        onChange={(e) => set("shortDescription", e.target.value)}
                        placeholder="A brief one-liner shown in product cards…"
                        className={textareaCls()} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="pf-desc">Full Description</FieldLabel>
                      <textarea id="pf-desc" rows={5} value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="Detailed product description…"
                        className={textareaCls()} />
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#f0f4f0]" />

                {/* ── Section 4: Benefits ── */}
                <section>
                  <SectionLabel>Benefits</SectionLabel>
                  <ProductBenefitsInput
                    value={form.benefits}
                    onChange={(b) => set("benefits", b)}
                  />
                </section>

                <div className="h-px bg-[#f0f4f0]" />

                {/* ── Section 5: Images ── */}
                <section>
                  <SectionLabel>Product Images</SectionLabel>
                  <p className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)] mb-3">
                    {isEdit
                      ? "Manage existing images below. Drag and drop or click to add more."
                      : "Drag and drop or click to upload. Images are uploaded immediately. The first image is automatically set as featured — hover any image to change it."}
                  </p>

                  {/* Existing images (edit mode only) */}
                  {isEdit && (
                    <ExistingImagesGrid
                      images={existingImages}
                      featuredImage={form.featuredImage}
                      onRemove={handleRemoveExisting}
                      onSetFeatured={handleSetExistingFeatured}
                    />
                  )}

                  {/* New upload section */}
                  {isEdit && (
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#9ca8a3] font-[var(--font-work-sans)] mb-2 mt-2">
                      Add New Images
                    </p>
                  )}
                  <ProductImageUploader
                    images={form.newImages}
                    featuredImage={form.featuredImage}
                    onImagesChange={(urls) => set("newImages", urls)}
                    onFeaturedImageChange={(url) => {
                      // In edit mode: only auto-update featured if not already set
                      if (!featuredImageRef.current) {
                        set("featuredImage", url);
                      } else if (!isEdit) {
                        // In create mode: always sync
                        set("featuredImage", url);
                      }
                    }}
                  />
                </section>

                <div className="h-px bg-[#f0f4f0]" />

                {/* ── Section 6: Physical Details ── */}
                <section>
                  <SectionLabel>Physical Details</SectionLabel>
                  <div className="grid grid-cols-2 gap-4 max-w-xs">
                    <div>
                      <FieldLabel htmlFor="pf-weight">Weight</FieldLabel>
                      <input id="pf-weight" type="number" min="0" step="0.01"
                        value={form.weight} onChange={(e) => set("weight", e.target.value)}
                        placeholder="e.g. 250" className={inputCls()} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="pf-weightunit">Unit</FieldLabel>
                      <div className="relative">
                        <select id="pf-weightunit" value={form.weightUnit}
                          onChange={(e) => set("weightUnit", e.target.value)}
                          className="w-full appearance-none border border-[#e3e3dd] rounded-lg px-3 py-2.5 pr-8 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors"
                        >
                          {WEIGHT_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727973] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#f0f4f0]" />

                {/* ── Section 7: Status & Visibility ── */}
                <section>
                  <SectionLabel>Status &amp; Visibility</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <FieldLabel htmlFor="pf-status">Product Status</FieldLabel>
                      <div className="relative">
                        <select id="pf-status" value={form.status}
                          onChange={(e) => set("status", e.target.value as ProductStatus)}
                          className="w-full appearance-none border border-[#e3e3dd] rounded-lg px-3 py-2.5 pr-8 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors"
                        >
                          {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727973] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-widest uppercase text-[#424843] mb-2 font-[var(--font-work-sans)]">
                        Featured Product
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <FeaturedToggle
                          enabled={form.isFeatured}
                          onToggle={() => set("isFeatured", !form.isFeatured)}
                        />
                        <span className="text-sm text-[#424843] font-[var(--font-work-sans)]">
                          {form.isFeatured ? "Featured on storefront" : "Not featured"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-widest uppercase text-[#424843] mb-2 font-[var(--font-work-sans)]">
                        Best Seller
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <FeaturedToggle
                          enabled={form.isBestSeller}
                          onToggle={() => set("isBestSeller", !form.isBestSeller)}
                        />
                        <span className="text-sm text-[#424843] font-[var(--font-work-sans)]">
                          {form.isBestSeller ? "Shown in Best Selling section" : "Not a best seller"}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#f0f4f0]" />

                {/* ── Section 8: Tags ── */}
                <section>
                  <SectionLabel>Tags</SectionLabel>
                  <ProductTagsInput
                    value={form.tags}
                    onChange={(t) => set("tags", t)}
                  />
                  <p className="mt-2 text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                    Press Enter or comma to add a tag. Backspace to remove the last one.
                  </p>
                </section>

                <div className="h-px bg-[#f0f4f0]" />

                {/* ── Section 9: SEO (collapsible) ── */}
                <section>
                  <button
                    type="button"
                    onClick={() => setSeoOpen((v) => !v)}
                    className="flex items-center gap-2 w-full text-left"
                    aria-expanded={seoOpen}
                  >
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] flex-1">
                      SEO Settings
                    </p>
                    <span className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                      {seoOpen ? "Hide" : "Expand"}
                    </span>
                    <motion.svg
                      animate={{ rotate: seoOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4 text-[#9ca8a3]"
                      fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </motion.svg>
                  </button>

                  <AnimatePresence initial={false}>
                    {seoOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-4">
                          <div>
                            <FieldLabel htmlFor="pf-seo-title">Meta Title</FieldLabel>
                            <input id="pf-seo-title" type="text" value={form.seoMetaTitle}
                              onChange={(e) => set("seoMetaTitle", e.target.value)}
                              placeholder="60 characters recommended" maxLength={60}
                              className={inputCls()} />
                            <p className="mt-1 text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                              {form.seoMetaTitle.length}/60 characters
                            </p>
                          </div>
                          <div>
                            <FieldLabel htmlFor="pf-seo-desc">Meta Description</FieldLabel>
                            <textarea id="pf-seo-desc" rows={3} value={form.seoMetaDescription}
                              onChange={(e) => set("seoMetaDescription", e.target.value)}
                              placeholder="160 characters recommended" maxLength={160}
                              className={textareaCls()} />
                            <p className="mt-1 text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                              {form.seoMetaDescription.length}/160 characters
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>

                <div className="h-2" />
              </div>
            </form>

            {/* ── Sticky Footer ── */}
            <div className="px-6 py-4 border-t border-[#e3e3dd] bg-[#fafaf4]/80 shrink-0 flex flex-col gap-3">
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-[#ffdad6] text-[#ba1a1a] text-sm font-[var(--font-work-sans)] rounded-lg px-4 py-3"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                    </svg>
                    {submitError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-end gap-3">
                <motion.button type="button" whileTap={{ scale: 0.97 }}
                  onClick={submitting ? undefined : onClose} disabled={submitting}
                  className="px-5 py-2.5 border border-[#e3e3dd] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#f4f4ee] transition-colors disabled:opacity-50"
                >
                  Cancel
                </motion.button>

                <motion.button type="submit" form={formId}
                  whileHover={!submitting ? { scale: 1.02 } : {}}
                  whileTap={!submitting ? { scale: 0.97 } : {}}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] rounded-lg hover:bg-[#4a8a00] transition-colors disabled:opacity-70 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <motion.svg className="w-4 h-4"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </motion.svg>
                      {loadingLabel}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      {submitLabel}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

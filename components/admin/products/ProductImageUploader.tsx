"use client";

/**
 * components/admin/products/ProductImageUploader.tsx
 *
 * Drag-and-drop / click-to-upload image uploader for the Add Product dialog.
 * Each file is uploaded immediately to POST /api/v1/uploads/images.
 * The returned absolute URLs are passed up via onImagesChange / onFeaturedImageChange.
 *
 * Props keep the same interface as the old URL-paste version so AddProductDialog
 * doesn't need to change.
 */

import { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useImageUpload } from "@/hooks/useImageUpload";
import type { UploadItem } from "@/types/upload.types";

/* ── Props ───────────────────────────────────────────────────── */

interface ProductImageUploaderProps {
  /** Current images array from form state (uploaded URLs) */
  images: string[];
  /** Current featured image URL from form state */
  featuredImage: string;
  /** Called whenever the images list changes */
  onImagesChange: (images: string[]) => void;
  /** Called whenever the featured image changes */
  onFeaturedImageChange: (url: string) => void;
}

/* ── Component ───────────────────────────────────────────────── */

export default function ProductImageUploader({
  onImagesChange,
  onFeaturedImageChange,
}: ProductImageUploaderProps) {
  const upload = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  /* Sync uploadedUrls → parent form state */
  useEffect(() => {
    onImagesChange(upload.uploadedUrls);
  }, [upload.uploadedUrls]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync featuredUrl → parent form state */
  useEffect(() => {
    onFeaturedImageChange(upload.featuredUrl);
  }, [upload.featuredUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  /* File selection */
  const handleFiles = useCallback(
    (files: FileList | File[] | null) => {
      if (!files || files.length === 0) return;
      upload.addFiles(Array.from(files));
    },
    [upload]
  );

  /* Drag & drop handlers */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const hasItems = upload.items.length > 0;

  return (
    <div className="space-y-4">

      {/* ── Drop zone ──────────────────────────────────────────── */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        animate={{
          borderColor: isDragging ? "#386b00" : "#e3e3dd",
          backgroundColor: isDragging ? "#f0f9e8" : "#fafaf4",
        }}
        transition={{ duration: 0.15 }}
        className="relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#386b00] hover:bg-[#f0f9e8] transition-colors select-none"
        role="button"
        tabIndex={0}
        aria-label="Upload product images"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
      >
        {/* Upload icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
          isDragging ? "bg-[#386b00]" : "bg-[#e8f4de]"
        }`}>
          <svg
            className={`w-6 h-6 transition-colors ${isDragging ? "text-white" : "text-[#386b00]"}`}
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-[#032616] font-[var(--font-work-sans)]">
            {isDragging ? "Drop images here" : "Drag & drop images"}
          </p>
          <p className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-0.5">
            or{" "}
            <span className="text-[#386b00] font-bold underline-offset-2 hover:underline">
              click to browse
            </span>
          </p>
        </div>

        <p className="text-[11px] text-[#b0b8b0] font-[var(--font-work-sans)]">
          PNG, JPG, WEBP, GIF · Max 2 MB per image · Up to 10 images
        </p>

        {upload.isUploading && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white border border-[#e3e3dd] rounded-lg px-2.5 py-1 shadow-sm">
            <SpinnerIcon className="w-3.5 h-3.5 text-[#386b00] animate-spin" />
            <span className="text-[11px] font-bold text-[#386b00] font-[var(--font-work-sans)]">
              Uploading…
            </span>
          </div>
        )}
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        onClick={(e) => {
          // Allow re-selecting the same file after removal
          (e.target as HTMLInputElement).value = "";
        }}
      />

      {/* ── Image grid ─────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {hasItems && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <AnimatePresence initial={false}>
                {upload.items.map((item) => (
                  <ImageCard
                    key={item.id}
                    item={item}
                    isFeatured={
                      item.status === "success" &&
                      item.serverUrl === upload.featuredUrl
                    }
                    onSetFeatured={() => {
                      if (item.serverUrl) upload.setFeaturedUrl(item.serverUrl);
                    }}
                    onRemove={() => upload.removeItem(item.id)}
                    onRetry={() => upload.retryItem(item.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Upload summary line ─────────────────────────────────── */}
      <AnimatePresence>
        {upload.items.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)]"
          >
            {upload.uploadedUrls.length} of {upload.items.length} image
            {upload.items.length !== 1 ? "s" : ""} uploaded
            {upload.items.some((i) => i.status === "error") && (
              <span className="text-[#ba1a1a] ml-1.5">
                · {upload.items.filter((i) => i.status === "error").length} failed
              </span>
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── ImageCard sub-component ─────────────────────────────────── */

interface ImageCardProps {
  item: UploadItem;
  isFeatured: boolean;
  onSetFeatured: () => void;
  onRemove: () => void;
  onRetry: () => void;
}

function ImageCard({ item, isFeatured, onSetFeatured, onRemove, onRetry }: ImageCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
      className={`relative rounded-xl overflow-hidden border-2 transition-colors ${
        isFeatured
          ? "border-[#386b00] shadow-md shadow-[#386b00]/10"
          : item.status === "error"
          ? "border-[#ffdad6]"
          : "border-[#e3e3dd]"
      }`}
    >
      {/* Image preview */}
      <div className="aspect-square bg-[#f4f4ee]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.previewUrl}
          alt={item.file.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── Uploading overlay — progress ring ── */}
      {item.status === "uploading" && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
          <ProgressRing progress={item.progress} />
          <span className="text-[11px] font-bold text-white font-[var(--font-work-sans)]">
            {item.progress}%
          </span>
        </div>
      )}

      {/* ── Error overlay ── */}
      {item.status === "error" && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 p-2">
          <svg className="w-6 h-6 text-[#ffb4ab]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="text-[10px] text-white text-center font-[var(--font-work-sans)] leading-tight px-1">
            {item.error ?? "Upload failed"}
          </p>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onRetry(); }}
            className="text-[10px] font-bold font-[var(--font-work-sans)] bg-white/90 text-[#032616] rounded-lg px-3 py-1 hover:bg-white transition-colors"
          >
            Retry
          </motion.button>
        </div>
      )}

      {/* ── Success: featured badge + hover actions ── */}
      {item.status === "success" && (
        <>
          {isFeatured && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#386b00] text-white text-[9px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] px-2 py-0.5 rounded-full shadow-sm">
              <StarIcon className="w-2.5 h-2.5" />
              Featured
            </div>
          )}

          {/* Hover action overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-end justify-between p-2 gap-1 opacity-0 hover:opacity-100">
            {!isFeatured && (
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={(e) => { e.stopPropagation(); onSetFeatured(); }}
                className="flex items-center gap-1 flex-1 text-[10px] font-bold font-[var(--font-work-sans)] bg-white/90 text-[#032616] rounded-md py-1 px-1.5 hover:bg-white transition-colors"
              >
                <StarIcon className="w-3 h-3 shrink-0" />
                Set Featured
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              aria-label={`Remove ${item.file.name}`}
              className="p-1.5 bg-[#ba1a1a]/90 text-white rounded-md hover:bg-[#ba1a1a] transition-colors shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </>
      )}

      {/* Error-state dismiss button (in addition to overlay Retry) */}
      {item.status === "error" && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label={`Remove ${item.file.name}`}
          className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
}

/* ── Progress ring (SVG) ─────────────────────────────────────── */

function ProgressRing({ progress }: { progress: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
      <circle
        cx="24" cy="24" r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="3.5"
      />
      <circle
        cx="24" cy="24" r={radius}
        fill="none"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.2s ease" }}
      />
    </svg>
  );
}

/* ── Icon helpers ────────────────────────────────────────────── */

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

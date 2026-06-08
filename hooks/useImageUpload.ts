/**
 * hooks/useImageUpload.ts
 *
 * Manages a queue of image uploads against POST /api/v1/uploads/images.
 * Each file is uploaded individually so per-file progress can be shown.
 *
 * Usage:
 *   const upload = useImageUpload();
 *   upload.addFiles(files);          // triggers immediate upload
 *   upload.removeItem(id);           // remove any item (cancels if uploading)
 *   upload.retryItem(id);            // retry a failed item
 *   upload.setFeaturedUrl(url);      // mark a server URL as featured
 *   upload.uploadedUrls              // all successfully uploaded absolute URLs
 *   upload.featuredUrl               // current featured URL
 *   upload.isUploading               // true if any upload is active
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  uploadSingleImage,
  buildServerUrl,
  validateImageFiles,
} from "@/api/upload.api";
import type { UploadItem } from "@/types/upload.types";

/* ── Hook return type ────────────────────────────────────────── */

export interface UseImageUploadReturn {
  items: UploadItem[];
  addFiles: (files: File[]) => void;
  removeItem: (id: string) => void;
  retryItem: (id: string) => void;
  featuredUrl: string;
  setFeaturedUrl: (url: string) => void;
  /** All successfully uploaded absolute URLs in insertion order */
  uploadedUrls: string[];
  /** True when at least one item is uploading */
  isUploading: boolean;
  /** Reset everything (call on dialog close) */
  reset: () => void;
}

/* ── Internal helpers ────────────────────────────────────────── */

function makeId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/* ── Hook ────────────────────────────────────────────────────── */

export function useImageUpload(): UseImageUploadReturn {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [featuredUrl, setFeaturedUrlState] = useState<string>("");

  // AbortControllers keyed by item ID so we can cancel in-flight uploads
  const abortRefs = useRef<Map<string, AbortController>>(new Map());

  // Revoke object URLs on unmount to avoid memory leaks
  const previewUrls = useRef<Set<string>>(new Set());
  useEffect(() => {
    return () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  /* Internal: update a single item by ID */
  const updateItem = useCallback(
    (id: string, patch: Partial<UploadItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      );
    },
    []
  );

  /* Internal: run the actual XHR upload for one item */
  const runUpload = useCallback(
    async (id: string, file: File) => {
      // Create a fresh AbortController for this upload
      const controller = new AbortController();
      abortRefs.current.set(id, controller);

      updateItem(id, { status: "uploading", progress: 0, error: undefined });

      try {
        const uploaded = await uploadSingleImage(file, {
          onProgress: (percent) => updateItem(id, { progress: percent }),
          signal: controller.signal,
        });

        const fullUrl = buildServerUrl(uploaded.url);

        updateItem(id, {
          status: "success",
          progress: 100,
          serverUrl: fullUrl,
        });

        // Auto-set first successfully uploaded image as featured
        setFeaturedUrlState((prev) => (prev === "" ? fullUrl : prev));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed. Please retry.";
        updateItem(id, { status: "error", progress: 0, error: message });
      } finally {
        abortRefs.current.delete(id);
      }
    },
    [updateItem]
  );

  /* addFiles — validate, create items, start uploads immediately */
  const addFiles = useCallback(
    (files: File[]) => {
      // Client-side pre-flight validation
      const validationErrors = validateImageFiles(files);
      const validFiles = files.filter(
        (f) => !validationErrors.find((e) => e.file === f)
      );

      // Create items for invalid files too so we can show the error
      const newItems: UploadItem[] = files.map((file) => {
        const validationError = validationErrors.find((e) => e.file === file);
        const previewUrl = URL.createObjectURL(file);
        previewUrls.current.add(previewUrl);

        return {
          id: makeId(),
          file,
          previewUrl,
          status: validationError ? "error" : "uploading",
          progress: 0,
          error: validationError?.message,
        };
      });

      setItems((prev) => [...prev, ...newItems]);

      // Start uploads for valid files
      newItems.forEach((item) => {
        if (validFiles.includes(item.file)) {
          runUpload(item.id, item.file);
        }
      });
    },
    [runUpload]
  );

  /* removeItem — cancel if uploading, revoke preview URL, remove from list */
  const removeItem = useCallback(
    (id: string) => {
      // Abort any in-progress upload
      const controller = abortRefs.current.get(id);
      if (controller) {
        controller.abort();
        abortRefs.current.delete(id);
      }

      setItems((prev) => {
        const item = prev.find((i) => i.id === id);
        if (item) {
          URL.revokeObjectURL(item.previewUrl);
          previewUrls.current.delete(item.previewUrl);

          // If this was the featured image, clear or reassign
          if (item.serverUrl) {
            setFeaturedUrlState((curr) => {
              if (curr !== item.serverUrl) return curr;
              // Pick the next available success item
              const remaining = prev.filter(
                (i) => i.id !== id && i.status === "success" && i.serverUrl
              );
              return remaining[0]?.serverUrl ?? "";
            });
          }
        }
        return prev.filter((i) => i.id !== id);
      });
    },
    []
  );

  /* retryItem — re-run upload for a failed item */
  const retryItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const item = prev.find((i) => i.id === id);
        if (!item || item.status !== "error") return prev;
        // Kick off upload (state will be updated inside runUpload)
        runUpload(id, item.file);
        return prev;
      });
    },
    [runUpload]
  );

  const setFeaturedUrl = useCallback((url: string) => {
    setFeaturedUrlState(url);
  }, []);

  const reset = useCallback(() => {
    // Cancel all in-flight
    abortRefs.current.forEach((ctrl) => ctrl.abort());
    abortRefs.current.clear();
    // Revoke all preview URLs
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current.clear();
    setItems([]);
    setFeaturedUrlState("");
  }, []);

  const uploadedUrls = items
    .filter((i) => i.status === "success" && i.serverUrl)
    .map((i) => i.serverUrl as string);

  const isUploading = items.some((i) => i.status === "uploading");

  return {
    items,
    addFiles,
    removeItem,
    retryItem,
    featuredUrl,
    setFeaturedUrl,
    uploadedUrls,
    isUploading,
    reset,
  };
}

"use client";

import { useState, useEffect } from "react";
import { getReviewSettings } from "@/api/review-settings.api";
import type { ReviewSettings } from "@/types/review-settings.types";

/* ── Module-level cache so all component instances share one fetch ── */

const DEFAULT_SETTINGS: ReviewSettings = {
  _id: "",
  reviewsEnabled: true,
  showRatingOnCards: true,
  showRatingOnDetailPage: true,
  showReviewCount: true,
  minimumRatingToShow: 0,
  updatedAt: "",
};

let _cache: ReviewSettings | null = null;
let _promise: Promise<ReviewSettings> | null = null;

function fetchOnce(): Promise<ReviewSettings> {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;
  _promise = getReviewSettings()
    .then((s) => {
      _cache = s;
      _promise = null;
      return s;
    })
    .catch(() => {
      _promise = null;
      return DEFAULT_SETTINGS;
    });
  return _promise;
}

/** Invalidate cache — call after admin saves new settings */
export function invalidateReviewSettingsCache(): void {
  _cache = null;
  _promise = null;
}

/* ── Hook ─────────────────────────────────────────────────────── */

export function useReviewSettings() {
  const [settings, setSettings] = useState<ReviewSettings>(
    _cache ?? DEFAULT_SETTINGS
  );
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) {
      setSettings(_cache);
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchOnce().then((s) => {
      if (!cancelled) {
        setSettings(s);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  /**
   * Helper: should the rating widget be shown for a given product rating?
   * Checks all relevant settings flags.
   */
  function shouldShowRating(
    rating: number | undefined,
    context: "card" | "detail"
  ): boolean {
    if (!settings.reviewsEnabled) return false;
    if (context === "card" && !settings.showRatingOnCards) return false;
    if (context === "detail" && !settings.showRatingOnDetailPage) return false;
    if (!rating || rating <= 0) return false;
    if (rating < settings.minimumRatingToShow) return false;
    return true;
  }

  return { settings, loading, shouldShowRating };
}

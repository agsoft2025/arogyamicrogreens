"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/store/authStore";
import {
  getProductReviews,
  getMyReview,
  submitReview,
  editReview,
} from "@/services/review.api";
import type { Review, ReviewsPage } from "@/types/review.types";

/* ── Star components ─────────────────────────────────────────── */

function StarIcon({ filled, half = false }: { filled: boolean; half?: boolean }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      {half ? (
        <>
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="url(#half-fill)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </>
      ) : (
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
}

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#386b00]">
      {Array.from({ length: max }, (_, i) => (
        <StarIcon key={i} filled={i < Math.floor(value)} />
      ))}
    </div>
  );
}

/** Interactive star picker for the form */
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          className={`transition-colors ${
            display >= star ? "text-[#386b00]" : "text-[#d0d7d0]"
          }`}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              fill={display >= star ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </motion.button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold font-[var(--font-work-sans)] text-[#386b00]">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
}

/* ── Single review card ──────────────────────────────────────── */

function ReviewCard({ review, isOwn = false }: { review: Review; isOwn?: boolean }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-xl border p-5 ${
        isOwn
          ? "border-[#386b00]/30 bg-[#f4fbea]"
          : "border-[#e3e3dd] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-full bg-[#032616] text-white text-[12px] font-bold font-[var(--font-work-sans)] flex items-center justify-center shrink-0">
              {review.userName.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-bold text-[#032616] font-[var(--font-work-sans)] leading-none">
                {review.userName}
                {isOwn && (
                  <span className="ml-2 text-[9px] tracking-widest uppercase bg-[#386b00] text-white px-1.5 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </p>
              <p className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-0.5">{date}</p>
            </div>
          </div>
          <StarRating value={review.rating} />
        </div>
      </div>

      {review.title && (
        <p className="font-bold text-sm text-[#1a1c19] font-[var(--font-work-sans)] mt-3 mb-1">
          {review.title}
        </p>
      )}
      {review.body && (
        <p className="text-sm text-[#424843] font-[var(--font-work-sans)] leading-relaxed">
          {review.body}
        </p>
      )}
    </motion.div>
  );
}

/* ── Review form ─────────────────────────────────────────────── */

function ReviewForm({
  productId,
  existingReview,
  onSuccess,
}: {
  productId: string;
  existingReview: Review | null;
  onSuccess: (review: Review) => void;
}) {
  const [rating, setRating]   = useState(existingReview?.rating ?? 0);
  const [title, setTitle]     = useState(existingReview?.title ?? "");
  const [body, setBody]       = useState(existingReview?.body ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState("");
  const [isEditing, setIsEditing] = useState(!existingReview);

  // Sync when existingReview prop changes
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setTitle(existingReview.title ?? "");
      setBody(existingReview.body ?? "");
      setIsEditing(false);
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    setError("");
    setSubmitting(true);
    try {
      let review: Review;
      if (existingReview) {
        review = await editReview(existingReview._id, { rating, title: title.trim(), body: body.trim() });
      } else {
        review = await submitReview({ productId, rating, title: title.trim(), body: body.trim() });
      }
      onSuccess(review);
      setIsEditing(false);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Failed to submit review.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Show the existing review card with an Edit button
  if (existingReview && !isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#424843] font-[var(--font-work-sans)]">
            Your Review
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsEditing(true)}
            className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#386b00] hover:underline"
          >
            Edit
          </motion.button>
        </div>
        <ReviewCard review={existingReview} isOwn />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-[11px] font-bold tracking-widest uppercase text-[#424843] font-[var(--font-work-sans)] mb-2">
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </p>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div>
        <label
          htmlFor="review-title"
          className="block text-[11px] font-bold tracking-widest uppercase text-[#424843] font-[var(--font-work-sans)] mb-1.5"
        >
          Title <span className="text-[#9ca8a3] font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="Sum it up in a few words…"
          className="w-full border border-[#e3e3dd] rounded-lg px-3 py-2.5 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white placeholder:text-[#b0b8b0] outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="review-body"
          className="block text-[11px] font-bold tracking-widest uppercase text-[#424843] font-[var(--font-work-sans)] mb-1.5"
        >
          Review <span className="text-[#9ca8a3] font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id="review-body"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={2000}
          placeholder="What did you like or dislike? How did you use this product?"
          className="w-full border border-[#e3e3dd] rounded-lg px-3 py-2.5 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white placeholder:text-[#b0b8b0] outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors resize-none"
        />
        <p className="text-right text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-1">
          {body.length}/2000
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[12px] text-[#ba1a1a] font-[var(--font-work-sans)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        {existingReview && (
          <motion.button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2.5 rounded-lg text-sm font-bold font-[var(--font-work-sans)] border border-[#e3e3dd] text-[#424843] hover:border-[#386b00] hover:text-[#386b00] transition-colors disabled:opacity-50"
          >
            Cancel
          </motion.button>
        )}
        <motion.button
          type="submit"
          disabled={submitting || rating === 0}
          whileHover={submitting || rating === 0 ? {} : { scale: 1.02 }}
          whileTap={submitting || rating === 0 ? {} : { scale: 0.97 }}
          className="px-6 py-2.5 rounded-lg text-sm font-bold font-[var(--font-work-sans)] bg-[#032616] text-white hover:bg-[#386b00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {submitting ? "Submitting…" : existingReview ? "Update Review" : "Submit Review"}
        </motion.button>
      </div>
    </form>
  );
}

/* ── Main ReviewSection ──────────────────────────────────────── */

export default function ReviewSection({ productId }: { productId: string }) {
  const { isAuthenticated, openLoginModal } = useAuth();

  const [page, setPage]                   = useState(1);
  const [data, setData]                   = useState<ReviewsPage | null>(null);
  const [loading, setLoading]             = useState(true);
  const [myReview, setMyReview]           = useState<Review | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadReviews = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const result = await getProductReviews(productId, p, 5);
      setData(result);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const loadMyReview = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const r = await getMyReview(productId);
      setMyReview(r);
    } catch {
      // silently ignore — user may not be authenticated yet
    }
  }, [productId, isAuthenticated]);

  useEffect(() => { loadReviews(1); }, [loadReviews]);
  useEffect(() => { loadMyReview(); }, [loadMyReview]);

  const handleReviewSuccess = useCallback((review: Review) => {
    setMyReview(review);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
    loadReviews(1); // refresh the list
  }, [loadReviews]);

  const total      = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // Reviews excluding the current user's own (shown separately above)
  const otherReviews = (data?.reviews ?? []).filter(
    (r) => !myReview || r._id !== myReview._id
  );

  return (
    <section className="mt-16 pt-12 border-t border-[#e3e3dd]">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
              Customer Reviews
            </h2>
            {total > 0 && (
              <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
                {total} review{total !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Submit success toast */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 flex items-center gap-2 bg-[#d4f4a0] text-[#386b00] text-sm font-[var(--font-work-sans)] rounded-xl px-4 py-3"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="m5 13 4 4L19 7" />
              </svg>
              Your review has been {myReview ? "updated" : "submitted"}. Thank you!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Write / edit review section */}
        <div className="mb-10 bg-[#fafaf4] rounded-2xl border border-[#e3e3dd] p-6">
          {isAuthenticated ? (
            <ReviewForm
              productId={productId}
              existingReview={myReview}
              onSuccess={handleReviewSuccess}
            />
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-[#424843] font-[var(--font-work-sans)] mb-4">
                Sign in to share your experience with this product.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openLoginModal()}
                className="px-6 py-2.5 rounded-lg text-sm font-bold font-[var(--font-work-sans)] bg-[#032616] text-white hover:bg-[#386b00] transition-colors"
              >
                Log in to Write a Review
              </motion.button>
            </div>
          )}
        </div>

        {/* Reviews list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-[#e3e3dd] bg-white p-5 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e3e3dd]" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-24 bg-[#e3e3dd] rounded" />
                    <div className="h-3 w-16 bg-[#e3e3dd] rounded" />
                  </div>
                </div>
                <div className="h-3 w-20 bg-[#e3e3dd] rounded" />
                <div className="h-3 w-full bg-[#e3e3dd] rounded" />
                <div className="h-3 w-4/5 bg-[#e3e3dd] rounded" />
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <div className="text-center py-10 text-[#9ca8a3] font-[var(--font-work-sans)] text-sm">
            No reviews yet — be the first!
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {otherReviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  disabled={page <= 1}
                  onClick={() => loadReviews(page - 1)}
                  className="px-4 py-2 rounded-lg border border-[#e3e3dd] text-sm font-bold font-[var(--font-work-sans)] text-[#424843] hover:bg-[#f4f4ee] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </motion.button>
                <span className="text-sm font-[var(--font-work-sans)] text-[#727973]">
                  {page} / {totalPages}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  disabled={page >= totalPages}
                  onClick={() => loadReviews(page + 1)}
                  className="px-4 py-2 rounded-lg border border-[#e3e3dd] text-sm font-bold font-[var(--font-work-sans)] text-[#424843] hover:bg-[#f4f4ee] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/**
 * lib/imageUtils.ts
 *
 * Centralized image URL helpers for the Agrinest frontend.
 *
 * The backend stores image paths as relative URLs:
 *   "/uploads/images/timestamp-uuid.png"
 *
 * For display in the browser these must be prefixed with the server origin.
 * Set NEXT_PUBLIC_API_BASE_URL to the backend root, e.g.:
 *   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
 *
 * NOTE: These helpers are for display only.
 * Do NOT use them before sending paths to the backend — the backend expects
 * relative paths ("/uploads/images/...") not absolute URLs.
 */

const PLACEHOLDER = "/images/placeholder-product.jpg";

/**
 * Derive the server root URL from the environment variable.
 * Strips a trailing /api/v1 suffix if present so that both forms work:
 *   "http://localhost:5000"          →  "http://localhost:5000"
 *   "http://localhost:5000/api/v1"   →  "http://localhost:5000"
 */
function getServerRoot(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";
  return base.replace(/\/api\/v1\/?$/, "");
}

/**
 * Convert a relative image path to an absolute URL for rendering in the browser.
 *
 * Handles all cases safely:
 *   - undefined / null / ""         → placeholder image
 *   - Already absolute ("http://…") → returned as-is
 *   - Relative ("/uploads/…")       → "http://localhost:5000/uploads/…"
 *   - Relative without leading slash → leading slash added automatically
 *
 * @param src         The raw image path from an API response
 * @param placeholder Custom fallback image path (default: "/images/placeholder-product.jpg")
 */
export function getProductImageUrl(
  src: string | undefined | null,
  placeholder = PLACEHOLDER
): string {
  if (!src) return placeholder;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const root = getServerRoot();
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${root}${path}`;
}

/**
 * Pick the best image from a product object and return its display URL.
 * Prefers featuredImage, falls back to images[0], then placeholder.
 *
 * @param product  Any object with optional featuredImage / images fields
 * @param placeholder Custom fallback (default: "/images/placeholder-product.jpg")
 */
export function getProductThumbnailUrl(
  product: {
    featuredImage?: string | null;
    images?: string[] | null;
  },
  placeholder = PLACEHOLDER
): string {
  const src = product.featuredImage ?? product.images?.[0];
  return getProductImageUrl(src, placeholder);
}

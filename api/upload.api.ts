/**
 * api/upload.api.ts
 *
 * Upload API client for POST /api/v1/uploads/images.
 *
 * Cannot use apiClient (axios.ts) because that always sets
 * Content-Type: application/json and JSON.stringify()s the body.
 * Multipart/form-data uploads require the browser to set the
 * Content-Type with the correct boundary, so we use raw XHR
 * which also gives us upload progress events.
 *
 * Backend contract (from upload.middleware.ts + upload.routes.ts):
 *   - Field name : "images"  (imageUpload.array('images', 10))
 *   - Max files  : 10
 *   - Max size   : 2 MB per file (TWO_MB = 2 * 1024 * 1024)
 *   - Allowed    : image/* only
 *   - Auth       : requireAdmin — Bearer token required
 *
 * Response data[n].url is a relative path: "/uploads/images/..."
 * Use buildServerUrl() to get the absolute URL for display/storage.
 */

import type { UploadedFile, UploadResponse } from "@/types/upload.types";

/* ── Helpers ─────────────────────────────────────────────────── */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

/** Strip /api/v1 suffix to get the server root (for static assets) */
export function getServerRoot(): string {
  return API_BASE.replace(/\/api\/v1\/?$/, "");
}

/**
 * Convert a relative upload path to a full absolute URL.
 * e.g. "/uploads/images/abc.jpg" → "http://localhost:3000/uploads/images/abc.jpg"
 */
export function buildServerUrl(relativePath: string): string {
  if (relativePath.startsWith("http")) return relativePath;
  const root = getServerRoot();
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${root}${path}`;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("agrinest_session");
    if (!raw) return null;
    const session = JSON.parse(raw) as { token?: string };
    return session.token ?? null;
  } catch {
    return null;
  }
}

/* ── Core upload function ────────────────────────────────────── */

export interface UploadSingleOptions {
  /** Called with 0–100 as the upload progresses */
  onProgress?: (percent: number) => void;
  /** AbortSignal to cancel the upload */
  signal?: AbortSignal;
}

/**
 * Upload a single image file to POST /api/v1/uploads/images.
 *
 * Uploads one file at a time so the caller can track per-file progress.
 * Returns the UploadedFile entry from response.data[0].
 *
 * Throws a plain Error with a user-friendly message on failure.
 */
export function uploadSingleImage(
  file: File,
  options: UploadSingleOptions = {}
): Promise<UploadedFile> {
  const { onProgress, signal } = options;

  return new Promise<UploadedFile>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Respect AbortSignal
    const onAbort = () => {
      xhr.abort();
      reject(new Error("Upload cancelled."));
    };
    if (signal) {
      if (signal.aborted) {
        reject(new Error("Upload cancelled."));
        return;
      }
      signal.addEventListener("abort", onAbort, { once: true });
    }

    // Upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    // Completion
    xhr.addEventListener("load", () => {
      if (signal) signal.removeEventListener("abort", onAbort);

      let body: UploadResponse | null = null;
      try {
        body = JSON.parse(xhr.responseText) as UploadResponse;
      } catch {
        reject(new Error("Unexpected server response. Please try again."));
        return;
      }

      if (xhr.status === 201 && body?.success && body.data?.length > 0) {
        resolve(body.data[0]);
      } else {
        // Use backend error message when available
        const msg =
          body?.message ??
          (xhr.status === 413
            ? "Image size must be below 2 MB"
            : xhr.status === 401 || xhr.status === 403
            ? "You don't have permission to upload images."
            : `Upload failed (${xhr.status}). Please try again.`);
        reject(new Error(msg));
      }
    });

    // Network error
    xhr.addEventListener("error", () => {
      if (signal) signal.removeEventListener("abort", onAbort);
      reject(new Error("Network error. Please check your connection."));
    });

    // Timeout
    xhr.addEventListener("timeout", () => {
      if (signal) signal.removeEventListener("abort", onAbort);
      reject(new Error("Upload timed out. Please try again."));
    });

    // Build FormData — field name "images" as required by backend
    const formData = new FormData();
    formData.append("images", file);

    xhr.open("POST", `${API_BASE}/uploads/images`);
    xhr.timeout = 60_000; // 60s timeout

    // Auth header (requireAdmin)
    const token = getStoredToken();
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    // Do NOT set Content-Type — browser sets multipart/form-data + boundary automatically
    xhr.send(formData);
  });
}

/* ── Client-side validation (pre-flight) ─────────────────────── */

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export interface FileValidationError {
  file: File;
  message: string;
}

/**
 * Validate files client-side before uploading.
 * Returns an array of errors (empty = all valid).
 */
export function validateImageFiles(files: File[]): FileValidationError[] {
  const errors: FileValidationError[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      errors.push({ file, message: `"${file.name}" is not an image file.` });
    } else if (file.size > MAX_SIZE_BYTES) {
      errors.push({
        file,
        message: `"${file.name}" exceeds the 2 MB size limit.`,
      });
    }
  }

  return errors;
}

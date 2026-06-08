/**
 * types/upload.types.ts
 *
 * TypeScript types derived from the backend uploads module.
 *
 * Backend: POST /api/v1/uploads/images
 *   - Field name  : "images"  (multipart/form-data array, max 10)
 *   - Max size    : 2 MB per file
 *   - Allowed     : any image/* mimetype
 *   - Auth        : Bearer token (admin only)
 *
 * Response shape (201):
 *   { success: true, message: string, data: UploadedFile[] }
 *
 * Error shape (400):
 *   { success: false, message: string }
 */

/* ── Server response shapes ──────────────────────────────────── */

/** One entry in the upload response `data` array */
export interface UploadedFile {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  /** Relative path, e.g. "/uploads/images/timestamp-uuid.jpg" */
  url: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: UploadedFile[];
}

/* ── Client-side upload item (tracks one file in the queue) ──── */

export type UploadStatus = "uploading" | "success" | "error";

export interface UploadItem {
  /** Unique client-side ID (crypto.randomUUID or timestamp) */
  id: string;
  /** Original File object selected by the user */
  file: File;
  /** Object URL for immediate preview (revoke on unmount) */
  previewUrl: string;
  status: UploadStatus;
  /** 0–100 */
  progress: number;
  /** Full absolute URL after successful upload (serverRoot + relative path) */
  serverUrl?: string;
  /** Human-readable error message when status === "error" */
  error?: string;
}

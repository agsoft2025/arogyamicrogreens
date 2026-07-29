import apiClient from "./axios";

export interface PublicStats {
  customerCount: number;
  varietyCount: number;
  avgRating: number;
  reviewCount: number;
}

// Module-level cache — shared across all callers, 5-minute TTL
let _cache: PublicStats | null = null;
let _cachedAt = 0;
let _inflight: Promise<PublicStats> | null = null;
const TTL_MS = 5 * 60 * 1000;

export function invalidateStatsCache(): void {
  _cache = null;
  _cachedAt = 0;
  _inflight = null;
}

export async function getPublicStats(): Promise<PublicStats> {
  const now = Date.now();
  if (_cache && now - _cachedAt < TTL_MS) return _cache;
  if (_inflight) return _inflight;

  _inflight = apiClient
    .get<{ success: boolean; data: PublicStats }>("/stats")
    .then((res) => {
      _cache = res.data.data;
      _cachedAt = Date.now();
      _inflight = null;
      return _cache;
    })
    .catch((err) => {
      _inflight = null;
      throw err;
    });

  return _inflight;
}

/** Format a raw count for display, e.g. 12500 → "12K+" */
export function formatStatCount(n: number): string {
  if (n >= 1_000_000) return `${Math.floor(n / 100_000) / 10}M+`;
  if (n >= 1_000)     return `${Math.floor(n / 1_000)}K+`;
  return `${n}+`;
}

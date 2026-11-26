/**
 * Thin, failure-tolerant wrapper around localStorage.
 * Everything the app saves goes through here, under versioned keys.
 */
export const STORAGE_KEYS = {
  active: 'drg.v2.active-mission',
  runs: 'drg.v2.runs',
  roster: 'drg.v2.roster',
} as const;

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable – the app keeps working in memory */
  }
}

/** Ask the browser not to evict our data (helps on iPad Safari). */
export async function requestPersistentStorage(): Promise<void> {
  try {
    await navigator.storage?.persist?.();
  } catch {
    /* not supported */
  }
}

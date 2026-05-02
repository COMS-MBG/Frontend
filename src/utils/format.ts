// ── Number Formatting Utilities ─────────────────────────────
// Centralised formatters to eliminate duplication across row components.

/** Format a number with Indonesian locale separators (e.g. 1.000) */
export function formatNum(val: number): string {
  return val.toLocaleString('id-ID')
}

/** Format a decimal with fixed digits (default 1 → "27.3") */
export function formatDec(val: number, digits = 1): string {
  return val.toFixed(digits)
}

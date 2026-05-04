// ── Formatting Utilities ────────────────────────────────────
// Centralised formatters to eliminate duplication across components.

/** Format a number with Indonesian locale separators (e.g. 1.000) */
export function formatNum(val: number): string {
  return val.toLocaleString('id-ID')
}

/** Format a decimal with fixed digits (default 1 → "27.3") */
export function formatDec(val: number, digits = 1): string {
  return val.toFixed(digits)
}

/** Format currency IDR (e.g. "Rp 250.000.000") */
export function formatRupiah(val: number): string {
  return 'Rp\u00A0' + val.toLocaleString('id-ID')
}

/** Short currency for chart axis (e.g. "Rp 80jt") */
export function formatRupiahShort(val: number): string {
  return `Rp\u00A0${(val / 1_000_000).toFixed(0)}jt`
}

/** Format ISO date string to Indonesian locale (e.g. "4 Mei 2026") */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

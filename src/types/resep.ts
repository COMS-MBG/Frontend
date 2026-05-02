// ── Resep (Recipe) Domain Types ─────────────────────────────

/**
 * Variant for the recipe status badge.
 * Mirrors the allowed values in ResepTable.vue for full compatibility.
 */
export type ResepStatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'default'

/** Narrowed status strings used across all recipe data. */
export type ResepStatus = 'Lengkap' | 'Sesuai Standar'

/**
 * A single ingredient reference inside a recipe.
 * `bahanId` links to BahanItem.id; `gram` is the required amount.
 */
export interface ResepBahan {
  bahanId: number
  gram: number
}

/**
 * Full recipe entity used by the store and view layer.
 * Includes pre-computed nutrition values so the view never
 * recalculates from raw bahan data on every render.
 */
export interface ResepItem {
  id: number
  nama: string
  /** Ingredient list — links to BahanItem via bahanId */
  bahanList: ResepBahan[]
  status: ResepStatus
  statusVariant: ResepStatusVariant
  kalori: number
  protein: number
  karbohidrat: number
  lemak: number
  image?: string
  createdAt?: string
}

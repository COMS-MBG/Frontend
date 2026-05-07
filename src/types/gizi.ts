// ── Gizi Domain Types ──────────────────────────────────────

/** Single ingredient row in the recipe form */
export interface BahanItemData {
  id: string
  bahanId: string | number | null
  gram: number | string
}

/** Error state for a single ingredient row */
export interface BahanError {
  bahanId?: string
  gram?: string
}

/** Typed errors for the recipe form — replaces `any` */
export interface ResepFormErrors {
  nama?: string
  bahanList?: BahanError[]
}

/** Macro nutrient value with percentage */
export interface MacroNutrient {
  val: number
  percent: number
}

/** Stat variant for NutritionStatCard */
export type StatVariant = 'default' | 'success' | 'danger' | 'warning' | 'primary'

/** Single nutrition stat entry */
export interface NutritionStat {
  label: string
  value: number
  unit: string
  icon: string
  status: string
  variant: StatVariant
}

/** Full nutrition result from calculation */
export interface NutritionResult {
  calories: number
  protein: MacroNutrient
  karbo: MacroNutrient
  lemak: MacroNutrient
  stats: NutritionStat[]
}

// ── Master Bahan Domain Types ──────────────────────────────

/** Status bahan baku */
export type BahanStatus = 'aktif' | 'nonaktif'

/** Single ingredient master data item */
export interface BahanItem {
  id: number
  nama: string
  satuan: 'kg' | 'liter' | 'pcs'
  kalori: number
  protein: number
  karbohidrat: number
  lemak: number
  status: BahanStatus
  image?: string
}

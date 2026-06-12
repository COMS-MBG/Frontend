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

/** Full nutrition result from calculation */
export interface NutritionResult {
  calories: number
  protein: MacroNutrient
  karbo: MacroNutrient
  lemak: MacroNutrient
}




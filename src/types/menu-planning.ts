// ── Menu Planning Types (matches MenuResource.php + MenuRequest.php) ──

/** Status computed by backend via Menu::computeStatus() */
export type StatusPublikasi = 'planned' | 'scheduled' | 'published' | 'archived'

/** Recipe nested inside a menu item (from MenuResource) */
export interface MenuItemRecipe {
  id: number
  name: string
  total_calorie: number
  total_protein: number
}

/** Single recipe entry in a day group (from MenuResource items.*.recipes[]) */
export interface MenuDayRecipe {
  menu_item_id: number
  meal_time: string | null
  meal_time_label: string | null
  order: number
  recipe: MenuItemRecipe | null
}

/** Grouped day data from MenuResource items[] */
export interface MenuItemDay {
  day_of_week: number
  day_name: string
  date: string
  recipes: MenuDayRecipe[]
}

/** Full menu data shape returned by GET /api/admin-sppg/menus/{id} */
export interface Menu {
  id: number
  name: string
  week_start: string
  week_end: string
  notes: string | null
  status: StatusPublikasi
  status_label: string
  week_range_label: string
  items: MenuItemDay[]
  created_at: string | null
  updated_at: string | null
}

/** Editable day item used in the store for local editing */
export interface EditableDayItem {
  dayOfWeek: number
  dayName: string
  date: string
  recipeId: number | null
}

/** Single item payload for create/update request body */
export interface MenuItemPayload {
  day_of_week: number
  menu_date: string
  recipe_id: number
  order?: number
}

/** Request payload for POST/PUT /api/admin-sppg/menus */
export interface MenuForm {
  name: string
  week_start: string
  week_end: string
  notes?: string
  items: MenuItemPayload[]
}

/** API paginated list response shape */
export interface MenuListResponse {
  success: boolean
  message: string
  data: Menu[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

/** Mutation response wrapper (store/update) */
export interface MenuMutationResponse {
  success: boolean
  message: string
  data: Menu
}

/** Simple success response for delete */
export interface MenuDeleteResponse {
  success: boolean
  message: string
}

/** Status display configuration for badges */
export const MENU_STATUS_CONFIG: Record<StatusPublikasi, { label: string; variant: 'neutral' | 'warning' | 'success' | 'info' }> = {
  planned:   { label: 'Menu Direncanakan', variant: 'neutral' },
  scheduled: { label: 'Menu Dijadwalkan',  variant: 'warning' },
  published: { label: 'Menu Ditampilkan',  variant: 'success' },
  archived:  { label: 'Menu Selesai',      variant: 'info' },
}

/** Day of week mapping — matches backend MenuItem::getDayNameAttribute */
export const DAY_NAMES: Record<number, string> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
}

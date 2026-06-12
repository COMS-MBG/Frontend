/**
 * types/stock.ts — TypeScript interfaces untuk fitur Stok Bahan Baku
 *
 * Berkoresponden dengan model backend:
 *   - StockItem      (stock_items)
 *   - StockMinimum   (stock_minimum)
 *   - StockTransaction (stock_transactions)
 */

// ─────────────────────────────────────────────────────────────
// ENUMS / LITERALS
// ─────────────────────────────────────────────────────────────

export type StockUnit = 'kg' | 'liter' | 'gram' | 'ml' | 'pcs'
export type StorageType = 'dry' | 'chilled' | 'frozen'
export type StockStatus = 'pending' | 'available' | 'low' | 'empty' | 'expired' | 'rejected'
export type TransactionType = 'in' | 'out'
export type ReferenceType = 'purchase' | 'menu_publish'

// ─────────────────────────────────────────────────────────────
// CORE ENTITIES
// ─────────────────────────────────────────────────────────────

/** Satu batch pembelian bahan baku */
export interface StockItem {
  id: number
  sppg_id: number
  ingredient_id: number
  batch_number: string | null
  quantity: number
  unit: StockUnit
  price_per_unit: number
  purchase_date: string        // YYYY-MM-DD
  expiry_date: string          // YYYY-MM-DD
  supplier: string
  storage_type: StorageType
  storage_location: string | null
  sku: string | null
  notes: string | null
  status: StockStatus
  approved_by: number | null
  approved_at: string | null
  proof_document: string | null
  created_by: number
  created_at: string
  updated_at: string

  // Relasi (eager-loaded)
  ingredient?: { id: number; name: string }
  creator?: { id: number; name: string }
  approver?: { id: number; name: string }
}

/** Ringkasan agregat stok per bahan baku (dari GET /stocks) */
export interface StockSummary {
  ingredient_id: number
  ingredient_name: string
  total_quantity: number
  unit: StockUnit
  minimum_quantity: number
  status: 'available' | 'low' | 'empty'
  has_expired: boolean
  batch_count: number
}

/** Detail stok per 1 bahan (dari GET /stocks/{ingredient_id}) */
export interface StockDetail {
  ingredient: { id: number; name: string }
  minimum_quantity: number
  unit: StockUnit
  batches: StockItem[]
}

/** Entitas stok minimum per bahan */
export interface StockMinimum {
  id: number
  sppg_id: number
  ingredient_id: number
  minimum_quantity: number
  unit: StockUnit
  created_at: string
  updated_at: string
}

/** Transaksi stok (log immutable) */
export interface StockTransaction {
  id: number
  sppg_id: number
  stock_item_id: number
  ingredient_id: number
  transaction_type: TransactionType
  quantity: number
  quantity_before: number
  quantity_after: number
  reference_type: ReferenceType
  reference_id: number
  notes: string
  created_by: number
  created_at: string

  // Relasi
  ingredient?: { id: number; name: string }
  stock_item?: Pick<StockItem, 'id' | 'batch_number'>
  creator?: { id: number; name: string }
}

// ─────────────────────────────────────────────────────────────
// FORM PAYLOADS
// ─────────────────────────────────────────────────────────────

/** Payload form pengajuan stok baru */
export interface StockStoreForm {
  ingredient_id: number | null
  quantity: number | ''
  unit: StockUnit
  price_per_unit: number | ''
  purchase_date: string
  expiry_date: string
  supplier: string
  storage_type: StorageType
  storage_location: string
  sku: string
  notes: string
  proof_document: File | null
}

/** Payload set/update stok minimum */
export interface StockMinimumForm {
  minimum_quantity: number | ''
  unit: StockUnit
}

// ─────────────────────────────────────────────────────────────
// API RESPONSE SHAPES
// ─────────────────────────────────────────────────────────────

export interface StockSummaryResponse {
  success: boolean
  data: StockSummary[]
}

export interface StockDetailResponse {
  success: boolean
  data: StockDetail
}

export interface StockItemResponse {
  success: boolean
  message: string
  data: StockItem
}

export interface StockTransactionListResponse {
  success: boolean
  data: StockTransaction[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface StockCheckMenuResponse {
  success: boolean
  sufficient: boolean
  shortages: Array<{
    ingredient_id: number
    ingredient_name: string
    needed: number
    available: number
    unit: StockUnit
    shortage: number
  }>
}

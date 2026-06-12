/**
 * api/stock.api.ts — Pure HTTP layer untuk fitur Stok Bahan Baku
 *
 * Base: GET /api/admin-sppg/stocks
 * Semua endpoint memerlukan Sanctum session auth.
 */
import api from '@/api/axios'
import type {
  StockSummaryResponse,
  StockDetailResponse,
  StockItemResponse,
  StockTransactionListResponse,
  StockCheckMenuResponse,
  StockMinimumForm,
} from '@/types/stock'

const BASE = '/admin-sppg/stocks'

// ─────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────

/**
 * Ringkasan stok agregat per bahan baku.
 * GET /api/admin-sppg/stocks
 */
export async function getStockSummary(): Promise<StockSummaryResponse> {
  const { data } = await api.get<StockSummaryResponse>(BASE)
  return data
}

/**
 * Detail batch per 1 bahan baku.
 * GET /api/admin-sppg/stocks/{ingredient_id}
 */
export async function getStockDetail(ingredientId: number): Promise<StockDetailResponse> {
  const { data } = await api.get<StockDetailResponse>(`${BASE}/${ingredientId}`)
  return data
}

/**
 * Daftar pengajuan stok berstatus pending (untuk approval queue).
 * GET /api/admin-sppg/stocks/pending
 */
export async function getStockPending(): Promise<StockSummaryResponse> {
  // Backend returns array of StockItem (not summary), reuse generic response
  const { data } = await api.get<{ success: boolean; data: any[] }>(`${BASE}/pending`)
  return data as any
}

/**
 * Seluruh riwayat transaksi stok SPPG (paginated).
 * GET /api/admin-sppg/stocks/transactions
 */
export async function getStockTransactions(params?: {
  page?: number
  per_page?: number
}): Promise<StockTransactionListResponse> {
  const { data } = await api.get<StockTransactionListResponse>(`${BASE}/transactions`, { params })
  return data
}

/**
 * Riwayat transaksi per batch.
 * GET /api/admin-sppg/stocks/{id}/transactions
 */
export async function getBatchTransactions(stockItemId: number): Promise<{ success: boolean; data: any[] }> {
  const { data } = await api.get<{ success: boolean; data: any[] }>(`${BASE}/${stockItemId}/transactions`)
  return data
}

/**
 * Simulasi cek kecukupan stok untuk menu.
 * GET /api/admin-sppg/stocks/check-menu/{menu_id}
 */
export async function checkMenuStock(menuId: number): Promise<StockCheckMenuResponse> {
  const { data } = await api.get<StockCheckMenuResponse>(`${BASE}/check-menu/${menuId}`)
  return data
}

// ─────────────────────────────────────────────────────────────
// MUTATE
// ─────────────────────────────────────────────────────────────

/**
 * Ajukan penambahan stok baru (multipart/form-data karena ada file upload).
 * POST /api/admin-sppg/stocks
 */
export async function createStockItem(formData: FormData): Promise<StockItemResponse> {
  const { data } = await api.post<StockItemResponse>(BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/**
 * Edit pengajuan stok (hanya jika status: pending).
 * PUT /api/admin-sppg/stocks/{id}
 */
export async function updateStockItem(id: number, formData: FormData): Promise<StockItemResponse> {
  // PUT tidak support multipart langsung di beberapa backend; gunakan POST + _method
  formData.append('_method', 'PUT')
  const { data } = await api.post<StockItemResponse>(`${BASE}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/**
 * Hapus pengajuan stok (hanya jika status: pending).
 * DELETE /api/admin-sppg/stocks/{id}
 */
export async function deleteStockItem(id: number): Promise<{ success: boolean; message: string }> {
  const { data } = await api.delete<{ success: boolean; message: string }>(`${BASE}/${id}`)
  return data
}

/**
 * Approve pengajuan stok → batch masuk.
 * POST /api/admin-sppg/stocks/{id}/approve
 */
export async function approveStockItem(id: number): Promise<StockItemResponse> {
  const { data } = await api.post<StockItemResponse>(`${BASE}/${id}/approve`)
  return data
}

/**
 * Reject pengajuan stok.
 * POST /api/admin-sppg/stocks/{id}/reject
 */
export async function rejectStockItem(id: number): Promise<StockItemResponse> {
  const { data } = await api.post<StockItemResponse>(`${BASE}/${id}/reject`)
  return data
}

/**
 * Set/update stok minimum per bahan baku.
 * PUT /api/admin-sppg/stocks/minimum/{ingredient_id}
 */
export async function setStockMinimum(
  ingredientId: number,
  payload: StockMinimumForm,
): Promise<{ success: boolean; message: string; data: any }> {
  const { data } = await api.put(`${BASE}/minimum/${ingredientId}`, payload)
  return data
}

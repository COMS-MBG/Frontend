/**
 * stores/stock.store.ts — Stok Bahan Baku (Pinia)
 *
 * Mengelola reactive state untuk:
 *   - Summary stok per bahan baku
 *   - Detail batch per bahan
 *   - Riwayat transaksi (paginated)
 *   - Pending approval queue
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getStockSummary,
  getStockDetail,
  getStockPending,
  getStockTransactions,
  getBatchTransactions,
  createStockItem,
  updateStockItem,
  deleteStockItem,
  approveStockItem,
  rejectStockItem,
  setStockMinimum,
} from '@/api/stock.api'
import type {
  StockSummary,
  StockDetail,
  StockItem,
  StockTransaction,
  StockMinimumForm,
} from '@/types/stock'

export const useStockStore = defineStore('stock', () => {
  // ── State ──────────────────────────────────────────────────
  const summaries = ref<StockSummary[]>([])
  const pendingItems = ref<StockItem[]>([])
  const currentDetail = ref<StockDetail | null>(null)
  const transactions = ref<StockTransaction[]>([])
  const batchTransactions = ref<StockTransaction[]>([])

  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  const transactionPagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
  })

  // ── Actions: READ ──────────────────────────────────────────

  async function fetchSummary(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await getStockSummary()
      summaries.value = res.data as unknown as StockSummary[]
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat ringkasan stok.'
    } finally {
      isLoading.value = false
    }
  }

  /** Silent refresh — tidak trigger skeleton */
  async function silentRefresh(): Promise<void> {
    try {
      const res = await getStockSummary()
      summaries.value = res.data as unknown as StockSummary[]
    } catch {
      // Silent
    }
  }

  async function fetchDetail(ingredientId: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await getStockDetail(ingredientId)
      currentDetail.value = res.data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat detail stok.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPending(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await getStockPending()
      pendingItems.value = res.data as unknown as StockItem[]
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat pengajuan pending.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTransactions(page = 1): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await getStockTransactions({ page, per_page: 15 })
      transactions.value = res.data
      transactionPagination.value = {
        currentPage: res.meta.current_page,
        lastPage: res.meta.last_page,
        perPage: res.meta.per_page,
        total: res.meta.total,
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat riwayat transaksi.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchBatchTransactions(stockItemId: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await getBatchTransactions(stockItemId)
      batchTransactions.value = res.data as StockTransaction[]
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat transaksi batch.'
    } finally {
      isLoading.value = false
    }
  }

  // ── Actions: MUTATE ────────────────────────────────────────

  async function createStock(formData: FormData): Promise<boolean> {
    isSubmitting.value = true
    error.value = null
    try {
      await createStockItem(formData)
      silentRefresh()
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal mengajukan stok baru.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateStock(id: number, formData: FormData): Promise<boolean> {
    isSubmitting.value = true
    error.value = null
    try {
      await updateStockItem(id, formData)
      silentRefresh()
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memperbarui pengajuan stok.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteStock(id: number): Promise<boolean> {
    isSubmitting.value = true
    error.value = null
    try {
      await deleteStockItem(id)
      silentRefresh()
      // Remove from pending list if present
      pendingItems.value = pendingItems.value.filter(i => i.id !== id)
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal menghapus pengajuan stok.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function approveStock(id: number): Promise<boolean> {
    isSubmitting.value = true
    error.value = null
    try {
      await approveStockItem(id)
      pendingItems.value = pendingItems.value.filter(i => i.id !== id)
      silentRefresh()
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal menyetujui pengajuan stok.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function rejectStock(id: number): Promise<boolean> {
    isSubmitting.value = true
    error.value = null
    try {
      await rejectStockItem(id)
      pendingItems.value = pendingItems.value.filter(i => i.id !== id)
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal menolak pengajuan stok.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateMinimum(ingredientId: number, payload: StockMinimumForm): Promise<boolean> {
    isSubmitting.value = true
    error.value = null
    try {
      await setStockMinimum(ingredientId, payload)
      silentRefresh()
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memperbarui stok minimum.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  function resetState(): void {
    summaries.value = []
    pendingItems.value = []
    currentDetail.value = null
    transactions.value = []
    batchTransactions.value = []
    isLoading.value = false
    isSubmitting.value = false
    error.value = null
  }

  return {
    // State
    summaries,
    pendingItems,
    currentDetail,
    transactions,
    batchTransactions,
    isLoading,
    isSubmitting,
    error,
    transactionPagination,

    // Actions
    fetchSummary,
    silentRefresh,
    fetchDetail,
    fetchPending,
    fetchTransactions,
    fetchBatchTransactions,
    createStock,
    updateStock,
    deleteStock,
    approveStock,
    rejectStock,
    updateMinimum,
    resetState,
  }
})

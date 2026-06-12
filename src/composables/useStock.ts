/**
 * composables/useStock.ts — Composable untuk fitur Stok Bahan Baku
 *
 * Bridge antara StockView/Components dengan stock.store.ts.
 * Menyediakan reactive state, RBAC checks, dan action wrappers.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStockStore } from '@/stores/stock.store'
import { useAuth } from '@/composables/useAuth'
import type { StockMinimumForm } from '@/types/stock'

export function useStock() {
  const store = useStockStore()
  const { checkPermission } = useAuth()

  const {
    summaries,
    pendingItems,
    currentDetail,
    transactions,
    batchTransactions,
    isLoading,
    isSubmitting,
    error,
    transactionPagination,
  } = storeToRefs(store)

  // ── RBAC ─────────────────────────────────────────────────
  const canRead    = computed(() => checkPermission('stock.read'))
  const canCreate  = computed(() => checkPermission('stock.create'))
  const canUpdate  = computed(() => checkPermission('stock.update'))
  const canDelete  = computed(() => checkPermission('stock.delete'))
  const canApprove = computed(() => checkPermission('stock.approve'))

  // ── Computed Stats ────────────────────────────────────────
  const totalBahan       = computed(() => summaries.value.length)
  const lowStockCount    = computed(() => summaries.value.filter(s => s.status === 'low').length)
  const emptyStockCount  = computed(() => summaries.value.filter(s => s.status === 'empty').length)
  const expiredCount     = computed(() => summaries.value.filter(s => s.has_expired).length)
  const pendingCount     = computed(() => pendingItems.value.length)

  // ── Action Delegates ──────────────────────────────────────
  function fetchSummary()                                     { return store.fetchSummary() }
  function fetchDetail(ingredientId: number)                  { return store.fetchDetail(ingredientId) }
  function fetchPending()                                     { return store.fetchPending() }
  function fetchTransactions(page?: number)                   { return store.fetchTransactions(page) }
  function fetchBatchTransactions(stockItemId: number)        { return store.fetchBatchTransactions(stockItemId) }
  function createStock(formData: FormData)                    { return store.createStock(formData) }
  function updateStock(id: number, formData: FormData)        { return store.updateStock(id, formData) }
  function deleteStock(id: number)                            { return store.deleteStock(id) }
  function approveStock(id: number)                           { return store.approveStock(id) }
  function rejectStock(id: number)                            { return store.rejectStock(id) }
  function updateMinimum(id: number, p: StockMinimumForm)     { return store.updateMinimum(id, p) }
  function resetState()                                       { return store.resetState() }

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

    // Computed Stats
    totalBahan,
    lowStockCount,
    emptyStockCount,
    expiredCount,
    pendingCount,

    // RBAC
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    canApprove,

    // Actions
    fetchSummary,
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
}

import * as financeApi from '@/api/superadmin-finance.api'
import { ref, computed } from 'vue'
import type { FinancialReport } from '@/types/superadmin-finance'

/**
 * Composable for the Super Admin Finance management.
 * NOTE: Backend financial-reports endpoints are currently stubs.
 */
export function useSuperAdminFinance() {
  const reports      = ref<FinancialReport[]>([])
  const isLoading    = ref(false)
  const isSubmitting = ref(false)
  const error        = ref<string | null>(null)

  const meta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })

  // ── UI Controls ────────────────────────────────────────────────
  const searchQuery  = ref('')
  const statusFilter = ref('all')

  // ── Computed ───────────────────────────────────────────────────
  const isEmpty = computed(() => !isLoading.value && reports.value.length === 0)

  // ── Build params ───────────────────────────────────────────────
  function _buildParams(page = 1): Record<string, string | number | undefined> {
    return {
      page,
      per_page: meta.value.per_page,
      search: searchQuery.value || undefined,
      status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
    }
  }

  // ── Fetch ──────────────────────────────────────────────────────
  async function fetchReports(page = 1, silent = false): Promise<void> {
    if (!silent) isLoading.value = true
    error.value = null
    try {
      const res = await financeApi.getFinancialReports(_buildParams(page))
      reports.value = res.data
      meta.value = res.meta
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data keuangan.'
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  // ── CRUD ───────────────────────────────────────────────────────

  async function deleteReport(id: number | string): Promise<void> {
    isSubmitting.value = true
    error.value = null
    try {
      await financeApi.deleteFinancialReport(id)
      await fetchReports(meta.value.current_page, true)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal menghapus laporan keuangan.'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function approveReport(id: number | string): Promise<void> {
    isSubmitting.value = true
    error.value = null
    try {
      await financeApi.approveFinancialReport(id)
      await fetchReports(meta.value.current_page, true)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal menyetujui laporan keuangan.'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function rejectReport(id: number | string): Promise<void> {
    isSubmitting.value = true
    error.value = null
    try {
      await financeApi.rejectFinancialReport(id)
      await fetchReports(meta.value.current_page, true)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal menolak laporan keuangan.'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  // ── Toolbar ────────────────────────────────────────────────────
  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  function setStatusFilter(filter: string): void {
    statusFilter.value = filter
  }

  return {
    reports,
    isLoading,
    isSubmitting,
    error,
    meta,
    searchQuery,
    statusFilter,
    isEmpty,

    fetchReports,
    deleteReport,
    approveReport,
    rejectReport,
    setSearchQuery,
    setStatusFilter,
  }
}

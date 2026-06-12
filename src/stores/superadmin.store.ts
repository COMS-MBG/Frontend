import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import type { SppgItem, SppgDetailResponse } from '@/types/superadmin-sppg'
import type { DashboardStats } from '@/types/superadmin-dashboard'

/**
 * Global shared state for the Super Admin area.
 * Stores cross-feature data (selected SPPG, dashboard stats, etc.)
 */
export const useSuperAdminStore = defineStore('superAdmin', () => {
  // ── State ──────────────────────────────────────────────────────
  const dashboardStats   = ref<DashboardStats | null>(null)
  const sppgList         = ref<SppgItem[]>([]) as Ref<SppgItem[]>
  const selectedSppg     = ref<SppgDetailResponse | null>(null)
  const isLoading        = ref(false)
  const error            = ref<string | null>(null)

  // ── Pagination (server-driven) ─────────────────────────────────
  const meta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })

  // ── UI Controls ────────────────────────────────────────────────
  const searchQuery    = ref('')
  const statusFilter   = ref('all')
  const rowsPerPage    = ref(10)

  // ── Getters ────────────────────────────────────────────────────
  const totalItems = computed(() => meta.value.total)
  const filteredItems = computed(() => sppgList.value)

  // ── Toolbar Actions ────────────────────────────────────────────
  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  function setStatusFilter(filter: string): void {
    statusFilter.value = filter
  }

  function setRowsPerPage(num: number): void {
    rowsPerPage.value = num
  }

  // ── State mutation helpers (called by composables) ─────────────
  function setDashboardStats(stats: DashboardStats): void {
    dashboardStats.value = stats
  }

  function setSppgList(items: SppgItem[], pagination: typeof meta.value): void {
    sppgList.value = items
    meta.value = pagination
  }

  function setSelectedSppg(detail: SppgDetailResponse | null): void {
    selectedSppg.value = detail
  }

  function setLoading(loading: boolean): void {
    isLoading.value = loading
  }

  function setError(err: string | null): void {
    error.value = err
  }

  /** Build query params from current toolbar state */
  function buildParams(page = 1): Record<string, string | number | undefined> {
    return {
      page,
      per_page: rowsPerPage.value,
      search: searchQuery.value || undefined,
      status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
    }
  }

  // ── Expose ─────────────────────────────────────────────────────
  return {
    // State
    dashboardStats,
    sppgList,
    selectedSppg,
    isLoading,
    error,
    meta,

    // UI Controls
    searchQuery,
    statusFilter,
    rowsPerPage,

    // Getters
    totalItems,
    filteredItems,

    // Toolbar Actions
    setSearchQuery,
    setStatusFilter,
    setRowsPerPage,
    buildParams,

    // State mutation helpers
    setDashboardStats,
    setSppgList,
    setSelectedSppg,
    setLoading,
    setError,
  }
})

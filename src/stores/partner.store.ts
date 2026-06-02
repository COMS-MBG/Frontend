import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import { partnerApi } from '@/api/partner.api'
import type {
  Partner,
  PartnerSummary,
  PartnerListMeta,
} from '@/types/partner'

export const usePartnerStore = defineStore('partner', () => {
  // ── State ──────────────────────────────────────────────────
  const items       = ref<Partner[]>([]) as Ref<Partner[]>
  const isLoading   = ref(false)
  const error       = ref<string | null>(null)

  // ── Pagination State (server-driven) ───────────────────────
  const meta = ref<PartnerListMeta>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  })

  // ── UI State (Table Controls) ──────────────────────────────
  const searchQuery    = ref('')
  const selectedBentuk = ref('all')
  const selectedStatus = ref('all')
  const rowsPerPage    = ref(10)

  // ── Summary State (from server) ────────────────────────────
  const summary = ref<PartnerSummary>({
    total_schools: 0,
    total_public: 0,
    total_private: 0,
    total_sma: 0,
    total_smk: 0,
    total_portion_count: 0,
  })

  // ── Getters ────────────────────────────────────────────────
  const totalItems = computed(() => meta.value.total)

  const getById = computed(
    () => (id: string): Partner | undefined =>
      items.value.find(i => i.id === id),
  )

  // Items are already filtered by the server — expose directly
  const filteredItems = computed(() => items.value)

  // ── Actions (Toolbar) ──────────────────────────────────────
  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  function setBentukFilter(filter: string): void {
    selectedBentuk.value = filter
  }

  function setStatusFilter(filter: string): void {
    selectedStatus.value = filter
  }

  // Set default values when resetting the toolbar, status parameter defaults to 'all'
  function setRowsPerPage(num: number): void {
    rowsPerPage.value = num
  }

  function resetToolbar(): void {
    searchQuery.value = ''
    selectedBentuk.value = 'all'
    selectedStatus.value = 'all'
    rowsPerPage.value = 10
  }

  // ── Actions (API) ──────────────────────────────────────────

  /** Build query params from current toolbar state */
  function _buildParams(page = 1): Record<string, string | number | undefined> {
    return {
      page,
      per_page: rowsPerPage.value,
      search:   searchQuery.value || undefined,
      school_type: selectedBentuk.value !== 'all' ? selectedBentuk.value : undefined,
      ownership_status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
    }
  }

  /** Fetch partner list from API with current filters/pagination */
  async function fetchItems(page = 1, silent = false): Promise<void> {
    if (!silent) {
      isLoading.value = true
    }
    error.value     = null

    try {
      const res = await partnerApi.getAll(_buildParams(page))
      items.value = res.data
      meta.value  = res.meta
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data partner.'
    } finally {
      if (!silent) {
        isLoading.value = false
      }
    }
  }

  /** Fetch summary statistics from API */
  async function fetchSummary(): Promise<void> {
    try {
      const res = await partnerApi.getSummary()
      summary.value = res.data
    } catch {
      // Summary fetch is non-critical — silently fail
    }
  }

  /** Create a new partner via API, then refresh list + summary silently */
  async function createItem(payload: Omit<Partner, 'id' | 'created_at' | 'updated_at'>): Promise<Partner> {
    const res = await partnerApi.create(payload)
    await Promise.all([fetchItems(meta.value.current_page, true), fetchSummary()])
    return res.data
  }

  /** Update a partner via API, then refresh list + summary silently */
  async function updateItem(id: string, payload: Partial<Partner>): Promise<Partner> {
    const res = await partnerApi.update(id, payload)
    await Promise.all([fetchItems(meta.value.current_page, true), fetchSummary()])
    return res.data
  }

  /** Delete a partner via API, then refresh list + summary silently */
  async function deleteItem(id: string): Promise<void> {
    await partnerApi.delete(id)
    await Promise.all([fetchItems(meta.value.current_page, true), fetchSummary()])
  }

  /** Refresh everything after import silently */
  async function refreshAfterImport(): Promise<void> {
    await Promise.all([fetchItems(1, true), fetchSummary()])
  }

  // ── Expose ─────────────────────────────────────────────────
  return {
    // State
    items,
    isLoading,
    error,
    meta,

    // Summary
    summary,

    // UI Controls
    searchQuery,
    selectedBentuk,
    selectedStatus,
    rowsPerPage,

    // Getters
    totalItems,
    getById,
    filteredItems,

    // Actions (Toolbar)
    setSearchQuery,
    setBentukFilter,
    setStatusFilter,
    setRowsPerPage,
    resetToolbar,

    // Actions (API)
    fetchItems,
    fetchSummary,
    createItem,
    updateItem,
    deleteItem,
    refreshAfterImport,
  }
})

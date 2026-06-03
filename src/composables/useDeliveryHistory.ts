import { ref, computed, onUnmounted } from 'vue'
import { historyApi } from '@/api/distribution.api'
import type { DeliveryHistory, DistributionAnalytics, DeliveryHistoryFilters, DeliveryHistoryListMeta } from '@/types/deliveryHistory'
import { getStartOfMonthISO, getTodayISO } from '@/utils/deliveryHistory'

export function useDeliveryHistory() {
  // State
  const histories = ref<DeliveryHistory[]>([])
  const selectedHistory = ref<DeliveryHistory | null>(null)
  const analytics = ref<DistributionAnalytics | null>(null)
  const hasInitialized = ref(false)

  const filters = ref<DeliveryHistoryFilters>({
    date_from: getStartOfMonthISO(),
    date_to: getTodayISO(),
  })

  const meta = ref<DeliveryHistoryListMeta>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  })

  const isLoading = ref(false)
  const isAnalyticsLoading = ref(false)
  const error = ref<string | null>(null)
  const analyticsError = ref(false)

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  // Computed
  const hasData = computed(() => histories.value.length > 0)

  const dateRange = computed({
    get(): string[] {
      return [filters.value.date_from, filters.value.date_to]
    },
    set(val: string[] | null) {
      // 1. If range is completely cleared, reset filters and trigger API
      if (!val || val.length === 0 || (!val[0] && !val[1])) {
        filters.value.date_from = ''
        filters.value.date_to = ''

        meta.value.current_page = 1
        if (debounceTimeout) clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
          refreshData(1, true)
        }, 200)
        return
      }

      // 2. If range selection is complete (both start and end dates are present)
      if (val.length === 2 && val[0] && val[1]) {
        filters.value.date_from = val[0]
        filters.value.date_to = val[1]

        meta.value.current_page = 1
        if (debounceTimeout) clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
          refreshData(1, true)
        }, 200)
        return
      }

      // 3. If in the middle of range selection (e.g. only start date chosen), do nothing.
      // This prevents firing API requests without parameters in the middle of selection.
    }
  })

  // API Actions
  async function fetchHistories(page = 1, silent = false) {
    if (!silent) isLoading.value = true
    error.value = null
    try {
      const res = await historyApi.getAll({
        page,
        per_page: meta.value.per_page,
        date_from: filters.value.date_from || undefined,
        date_to: filters.value.date_to || undefined,
      })
      histories.value = res.data
      meta.value = {
        current_page: res.meta.current_page,
        last_page: res.meta.last_page,
        total: res.meta.total,
        per_page: meta.value.per_page,
      }
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat riwayat pengiriman.'
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  async function fetchAnalytics(silent = false) {
    if (!silent) isAnalyticsLoading.value = true
    analyticsError.value = false
    try {
      const res = await historyApi.getAnalytics({
        date_from: filters.value.date_from || undefined,
        date_to: filters.value.date_to || undefined,
      })
      analytics.value = res.data
    } catch {
      // Keep stale analytics on failure (Stale-While-Revalidate)
      analyticsError.value = true
    } finally {
      if (!silent) isAnalyticsLoading.value = false
    }
  }

  // Orchestrator helper to refresh both table & analytics in parallel
  async function refreshData(page = 1, silent = false) {
    await Promise.all([
      fetchHistories(page, silent),
      fetchAnalytics(silent)
    ])
    hasInitialized.value = true
  }

  // UI Actions
  function openDetail(item: DeliveryHistory) {
    selectedHistory.value = item
  }

  // Close details modal
  function closeDetail() {
    selectedHistory.value = null
  }

  function changePage(page: number) {
    meta.value.current_page = page
    // Pagination navigation uses silent refetch (silent = true) for smooth UX without table flashing
    fetchHistories(page, true)
  }

  function changePerPage(perPage: number) {
    meta.value.per_page = perPage
    meta.value.current_page = 1
    // Changing per page count only refetches histories table silently. 
    // Analytics is not affected by pagination/per-page controls.
    fetchHistories(1, true)
  }

  function setDateRange(val: string[] | null) {
    dateRange.value = val
  }

  onUnmounted(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout)
  })

  return {
    histories,
    selectedHistory,
    analytics,
    dateRange,
    meta,
    isLoading,
    isAnalyticsLoading,
    hasInitialized,
    error,
    analyticsError,
    hasData,

    refreshData,
    openDetail,
    closeDetail,
    setDateRange,
    changePage,
    changePerPage,
  }
}

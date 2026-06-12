import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toDistributionItem } from '@/utils/distribution'
import type {
  DeliverySchedule,
  DistributionItem,
  AvailableCourier,
  PaginationMeta,
  OptimizedRoute,
} from '@/types/distribution'

/**
 * Distribution Store — THIN STATE LAYER
 *
 * ✅ Global reactive state
 * ✅ Computed getters
 * ✅ Simple state setters
 *
 * ❌ NO API calls
 * ❌ NO orchestration
 * ❌ NO WebSocket logic
 * ❌ NO business logic
 *
 * All orchestration is handled by useDistribution() composable.
 */
export const useDistributionStore = defineStore('distribution', () => {
  // ── Raw State ──────────────────────────────────────────
  const schedules = ref<DeliverySchedule[]>([])
  const summarySchedules = ref<DeliverySchedule[]>([]) // global unpaginated dataset for KPI metrics
  const selectedSchedule = ref<DeliverySchedule | null>(null)
  const availableCouriers = ref<AvailableCourier[]>([])
  const optimizedRoute = ref<OptimizedRoute | null>(null)

  const pagination = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    total: 0,
  })

  const filters = ref({
    page: 1,
    per_page: 10,
    status: '' as string,
    courier_id: undefined as number | undefined,
    school_id: undefined as number | undefined,
  })

  const searchQuery = ref('')
  const isLoading = ref(false)
  const isDetailLoading = ref(false)
  const isSubmitting = ref(false)
  const isOptimizing = ref(false)
  const error = ref<string | null>(null)

  // ── Derived State ──────────────────────────────────────
  /** Flat items for DistributionRow/Table components */
  const items = computed<DistributionItem[]>(() =>
    schedules.value.map(toDistributionItem),
  )

  /** Client-side filtered items based on search query */
  const filteredItems = computed<DistributionItem[]>(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return items.value
    return items.value.filter(item =>
      item.sekolah.toLowerCase().includes(q) ||
      item.kurir.toLowerCase().includes(q) ||
      (item.kendaraan && item.kendaraan.toLowerCase().includes(q)),
    )
  })

  // ── Summary Getters ────────────────────────────────────
  // Computed from global unfiltered summarySchedules — ignores pagination/filter shifts
  const totalToday = computed(() => summarySchedules.value.length)

  const inProgressCount = computed(() =>
    summarySchedules.value.filter(s => s.status === 'delivering').length,
  )

  const onTimeRate = computed(() => {
    const total = summarySchedules.value.length
    if (total === 0) return 0
    const onTime = summarySchedules.value.filter(
      s => s.status === 'confirmed' || s.status === 'delivered',
    ).length
    return Math.round((onTime / total) * 100 * 10) / 10
  })

  // ── Reset ──────────────────────────────────────────────
  function resetState(): void {
    schedules.value = []
    summarySchedules.value = []
    selectedSchedule.value = null
    availableCouriers.value = []
    optimizedRoute.value = null
    pagination.value = { current_page: 1, last_page: 1, total: 0 }
    filters.value = {
      page: 1,
      per_page: 10,
      status: '',
      courier_id: undefined,
      school_id: undefined,
    }
    searchQuery.value = ''
    isLoading.value = false
    isDetailLoading.value = false
    isSubmitting.value = false
    isOptimizing.value = false
    error.value = null
  }

  return {
    // state
    schedules,
    summarySchedules,
    selectedSchedule,
    availableCouriers,
    optimizedRoute,
    pagination,
    filters,
    searchQuery,
    isLoading,
    isDetailLoading,
    isSubmitting,
    isOptimizing,
    error,
    // derived
    items,
    filteredItems,
    // summary getters
    totalToday,
    inProgressCount,
    onTimeRate,
    // reset
    resetState,
  }
})

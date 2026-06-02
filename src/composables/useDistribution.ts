import { storeToRefs } from 'pinia'
import { useDistributionStore } from '@/stores/distribution.store'
import { scheduleApi, spatialApi } from '@/api/distribution.api'
import { useToast } from '@/composables/useToast'
import type {
  CreateSchedulePayload,
  UpdateSchedulePayload,
} from '@/types/distribution'

/**
 * useDistribution — PRIMARY ORCHESTRATION COMPOSABLE
 *
 * Responsibilities:
 * - Bridges store ↔ API ↔ UI
 * - All async operations (fetch, CRUD, workflow)
 * - Toast feedback for success/error
 * - Filter/search/pagination helpers
 * - Route optimization flow
 *
 * Components MUST use this composable instead of importing the store directly.
 */
export function useDistribution() {
  const store = useDistributionStore()
  const toast = useToast()

  const {
    schedules,
    summarySchedules,
    selectedSchedule,
    availableCouriers,
    optimizedRoute,
    items,
    filteredItems,
    pagination,
    filters,
    searchQuery,
    isLoading,
    isDetailLoading,
    isSubmitting,
    isOptimizing,
    error,
    totalToday,
    inProgressCount,
    onTimeRate,
  } = storeToRefs(store)

  // ── Build Params Helper ────────────────────────────────
  function buildParams() {
    return {
      page: store.filters.page,
      per_page: store.filters.per_page,
      ...(store.filters.status ? { status: store.filters.status } : {}),
      ...(store.filters.courier_id ? { courier_id: store.filters.courier_id } : {}),
      ...(store.filters.school_id ? { school_id: store.filters.school_id } : {}),
    }
  }

  // ── Fetch Operations ───────────────────────────────────

  /** Initial page load — shows skeleton loader */
  async function fetchSchedules(): Promise<void> {
    store.isLoading = true
    store.error = null

    try {
      const res = await scheduleApi.getAll(buildParams())
      store.schedules = res.data
      store.pagination = res.meta
      
      // Load summary schedules once on page load
      await fetchSummarySchedules()
    } catch (err: unknown) {
      store.error =
        err instanceof Error ? err.message : 'Gagal memuat jadwal pengiriman.'
    } finally {
      store.isLoading = false
    }
  }

  /** Silent refresh after mutations — no skeleton flicker */
  async function silentRefresh(): Promise<void> {
    try {
      const [res, summaryRes] = await Promise.all([
        scheduleApi.getAll(buildParams()),
        scheduleApi.getAll({ per_page: 1000 })
      ])
      store.schedules = res.data
      store.pagination = res.meta
      store.summarySchedules = summaryRes.data
    } catch {
      // Silent — don't override existing error
    }
  }

  /** Fetch global unpaginated/unfiltered schedules for stats calculation */
  async function fetchSummarySchedules(): Promise<void> {
    try {
      const res = await scheduleApi.getAll({ per_page: 1000 })
      store.summarySchedules = res.data
    } catch {
      // Silent
    }
  }

  /** Fetch single schedule detail for DetailModal */
  async function fetchSchedule(id: number): Promise<void> {
    store.isDetailLoading = true
    store.error = null

    try {
      const res = await scheduleApi.getOne(id)
      store.selectedSchedule = res.data
    } catch (err: unknown) {
      store.error =
        err instanceof Error ? err.message : 'Gagal memuat detail jadwal.'
    } finally {
      store.isDetailLoading = false
    }
  }

  /** Fetch available couriers for dropdown */
  async function fetchCouriers(): Promise<void> {
    try {
      const res = await scheduleApi.getAvailableCouriers()
      store.availableCouriers = res.data
    } catch {
      // Silent
    }
  }

  // ── CRUD Mutations ─────────────────────────────────────

  async function createSchedule(payload: CreateSchedulePayload): Promise<boolean> {
    store.isSubmitting = true
    store.error = null

    try {
      await scheduleApi.create(payload)
      toast.success('Jadwal pengiriman berhasil dibuat.')
      silentRefresh()
      return true
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal membuat jadwal.'
      store.error = msg
      toast.error(msg)
      return false
    } finally {
      store.isSubmitting = false
    }
  }

  async function updateSchedule(id: number, payload: UpdateSchedulePayload): Promise<boolean> {
    store.isSubmitting = true
    store.error = null

    try {
      await scheduleApi.update(id, payload)
      toast.success('Jadwal pengiriman berhasil diperbarui.')
      silentRefresh()
      return true
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengupdate jadwal.'
      store.error = msg
      toast.error(msg)
      return false
    } finally {
      store.isSubmitting = false
    }
  }

  async function deleteSchedule(id: number): Promise<boolean> {
    store.isSubmitting = true
    store.error = null

    try {
      await scheduleApi.destroy(id)
      toast.success('Jadwal pengiriman berhasil dihapus.')
      silentRefresh()
      return true
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus jadwal.'
      store.error = msg
      toast.error(msg)
      return false
    } finally {
      store.isSubmitting = false
    }
  }

  // ── Workflow Actions ───────────────────────────────────

  async function submitTask(id: number): Promise<boolean> {
    store.isSubmitting = true
    try {
      await scheduleApi.submitTask(id)
      toast.success('Tugas berhasil dikirim ke kurir.')
      silentRefresh()
      return true
    } catch {
      toast.error('Gagal mengirim tugas. Silakan coba lagi.')
      return false
    } finally {
      store.isSubmitting = false
    }
  }

  async function acceptTask(id: number): Promise<boolean> {
    store.isSubmitting = true
    try {
      await scheduleApi.acceptTask(id)
      toast.success('Tugas berhasil diterima.')
      silentRefresh()
      return true
    } catch {
      toast.error('Gagal menerima tugas.')
      return false
    } finally {
      store.isSubmitting = false
    }
  }

  async function confirmDelivery(id: number, notes?: string): Promise<boolean> {
    store.isSubmitting = true
    try {
      await scheduleApi.confirmDelivery(id, notes)
      toast.success('Pengiriman berhasil dikonfirmasi.')
      silentRefresh()
      return true
    } catch {
      toast.error('Gagal mengonfirmasi pengiriman.')
      return false
    } finally {
      store.isSubmitting = false
    }
  }

  async function requestRevision(id: number, notes: string): Promise<boolean> {
    store.isSubmitting = true
    try {
      await scheduleApi.requestRevision(id, notes)
      toast.success('Permintaan revisi berhasil dikirim ke kurir.')
      silentRefresh()
      return true
    } catch {
      toast.error('Gagal mengirim permintaan revisi.')
      return false
    } finally {
      store.isSubmitting = false
    }
  }

  // ── Route Optimization ─────────────────────────────────

  async function optimizeRoute(): Promise<void> {
    store.isOptimizing = true
    store.error = null

    try {
      const depotRes = await spatialApi.getDepotLocation()
      const depot = depotRes.data

      const origin = {
        lat: depot.latitude ?? -6.914744,
        lng: depot.longitude ?? 107.609810,
      }

      const waypoints = store.schedules
        .filter(s => s.status !== 'confirmed' && s.status !== 'rejected')
        .map(s => {
          if (!s.school) return null
          return {
            lat: s.school.latitude ?? 0,
            lng: s.school.longitude ?? 0,
            school_id: String(s.school.id),
            name: s.school.name ?? undefined,
          }
        })
        .filter(Boolean) as { lat: number; lng: number; school_id: string; name?: string }[]

      if (waypoints.length === 0) {
        store.error = 'Tidak ada sekolah aktif untuk optimasi rute.'
        toast.warning('Tidak ada sekolah aktif untuk optimasi rute.')
        return
      }

      const res = await spatialApi.optimizeRoute({ origin, waypoints })
      store.optimizedRoute = res.data
      toast.success('Rute berhasil dioptimasi.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengoptimasi rute.'
      store.error = msg
      toast.error(msg)
    } finally {
      store.isOptimizing = false
    }
  }

  // ── Filter / Search / Pagination ───────────────────────

  function setFilter(key: keyof typeof store.filters, value: string | number | undefined): void {
    if (key === 'page') {
      store.filters.page = value as number
    } else {
      ;(store.filters as Record<string, unknown>)[key] = value
      store.filters.page = 1
    }
    fetchSchedules()
  }

  function setPage(newPage: number): void {
    store.filters.page = newPage
    fetchSchedules()
  }

  function setPerPage(newPerPage: number): void {
    store.filters.per_page = newPerPage
    store.filters.page = 1
    fetchSchedules()
  }

  function setSearchQuery(query: string): void {
    store.searchQuery = query
  }

  // ── Return ─────────────────────────────────────────────
  return {
    // reactive state (from store)
    schedules,
    summarySchedules,
    selectedSchedule,
    availableCouriers,
    optimizedRoute,
    items,
    filteredItems,
    pagination,
    filters,
    searchQuery,
    isLoading,
    isDetailLoading,
    isSubmitting,
    isOptimizing,
    error,

    // summary getters
    totalToday,
    inProgressCount,
    onTimeRate,

    // fetch
    fetchSchedules,
    silentRefresh,
    fetchSchedule,
    fetchSummarySchedules,
    fetchCouriers,

    // CRUD
    createSchedule,
    updateSchedule,
    deleteSchedule,

    // workflow
    submitTask,
    acceptTask,
    confirmDelivery,
    requestRevision,

    // route
    optimizeRoute,

    // filter/search/pagination
    setFilter,
    setPage,
    setPerPage,
    setSearchQuery,

    // reset
    resetState: store.resetState,
  }
}

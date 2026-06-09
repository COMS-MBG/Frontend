import { useSuperAdminStore } from '@/stores/superadmin.store'
import * as sppgApi from '@/api/superadmin-sppg.api'
import { ref, computed } from 'vue'
import type { SppgPartner, SppgEmployee } from '@/types/superadmin-sppg'
import { getSchools } from '@/api/superadmin-school.api'
import type { SchoolItem } from '@/types/superadmin-school'

/**
 * Composable for Super Admin SPPG management.
 * Handles CRUD + activate/deactivate + nested partners & employees.
 */
export function useSuperAdminSppg() {
  const store = useSuperAdminStore()

  // ── Local UI state ─────────────────────────────────────────────
  const isSubmitting    = ref(false)
  const partners        = ref<SppgPartner[]>([])
  const employees       = ref<SppgEmployee[]>([])
  const menus           = ref<unknown[]>([])
  const isLoadingDetail = ref(false)
  const isLoadingMenus  = ref(false)
  const unassignedSchools   = ref<SchoolItem[]>([])
  const isLoadingUnassigned = ref(false)

  // ── Computed from store ────────────────────────────────────────
  const sppgList      = computed(() => store.filteredItems)
  const isLoading     = computed(() => store.isLoading)
  const error         = computed(() => store.error)
  const meta          = computed(() => store.meta)
  const selectedSppg  = computed(() => store.selectedSppg)
  const searchQuery   = computed(() => store.searchQuery)
  const statusFilter  = computed(() => store.statusFilter)
  const rowsPerPage   = computed(() => store.rowsPerPage)

  // ── Fetch list ─────────────────────────────────────────────────
  async function fetchSppgs(page = 1, silent = false): Promise<void> {
    if (!silent) store.setLoading(true)
    store.setError(null)
    try {
      const res = await sppgApi.getSppgs(store.buildParams(page))
      store.setSppgList(res.data, res.meta)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal memuat data SPPG.')
    } finally {
      if (!silent) store.setLoading(false)
    }
  }

  // ── Fetch detail ───────────────────────────────────────────────
  async function fetchSppgDetail(id: number | string): Promise<void> {
    isLoadingDetail.value = true
    try {
      const res = await sppgApi.getSppg(id)
      store.setSelectedSppg(res)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal memuat detail SPPG.')
    } finally {
      isLoadingDetail.value = false
    }
  }

  // ── CRUD ───────────────────────────────────────────────────────
  async function createSppg(payload: Record<string, unknown>): Promise<void> {
    isSubmitting.value = true
    store.setError(null)
    try {
      await sppgApi.createSppg(payload)
      await fetchSppgs(1, true)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal menambahkan SPPG.')
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateSppg(id: number | string, payload: Record<string, unknown>): Promise<void> {
    isSubmitting.value = true
    store.setError(null)
    try {
      await sppgApi.updateSppg(id, payload)
      await fetchSppgs(store.meta.current_page, true)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal memperbarui SPPG.')
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteSppg(id: number | string): Promise<void> {
    isSubmitting.value = true
    store.setError(null)
    try {
      await sppgApi.deleteSppg(id)
      await fetchSppgs(store.meta.current_page, true)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal menghapus SPPG.')
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  // ── Activate / Deactivate ──────────────────────────────────────
  async function activateSppg(id: number | string): Promise<void> {
    isSubmitting.value = true
    store.setError(null)
    try {
      await sppgApi.activateSppg(id)
      await fetchSppgs(store.meta.current_page, true)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal mengaktifkan SPPG.')
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function deactivateSppg(id: number | string): Promise<void> {
    isSubmitting.value = true
    store.setError(null)
    try {
      await sppgApi.deactivateSppg(id)
      await fetchSppgs(store.meta.current_page, true)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal menonaktifkan SPPG.')
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  // ── Partners (nested under SPPG) ──────────────────────────────
  async function fetchPartners(sppgId: number | string): Promise<void> {
    try {
      const res = await sppgApi.getSppgPartners(sppgId)
      partners.value = res.data
    } catch (err: unknown) {
      partners.value = []
      store.setError(err instanceof Error ? err.message : 'Gagal memuat kemitraan.')
    }
  }

  async function assignSchool(sppgId: number | string, schoolId: string): Promise<boolean> {
    isSubmitting.value = true
    store.setError(null)
    try {
      await sppgApi.assignSchool(sppgId, schoolId)
      return true
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal memasangkan sekolah.')
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function detachSchool(sppgId: number | string, schoolId: string): Promise<boolean> {
    isSubmitting.value = true
    store.setError(null)
    try {
      await sppgApi.detachSchool(sppgId, schoolId)
      return true
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal memutuskan kemitraan sekolah.')
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  // ── Employees (nested under SPPG) ─────────────────────────────
  async function fetchEmployees(sppgId: number | string): Promise<void> {
    try {
      const res = await sppgApi.getEmployees(sppgId)
      employees.value = res.data
    } catch (err: unknown) {
      employees.value = []
      store.setError(err instanceof Error ? err.message : 'Gagal memuat daftar pegawai.')
    }
  }

  async function createEmployee(sppgId: number | string, payload: Record<string, unknown>): Promise<void> {
    isSubmitting.value = true
    store.setError(null)
    try {
      await sppgApi.createEmployee(sppgId, payload)
      await fetchEmployees(sppgId)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal menambahkan pegawai.')
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateEmployee(sppgId: number | string, id: number | string, payload: Record<string, unknown>): Promise<void> {
    isSubmitting.value = true
    store.setError(null)
    try {
      await sppgApi.updateEmployee(sppgId, id, payload)
      await fetchEmployees(sppgId)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal memperbarui pegawai.')
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteEmployee(sppgId: number | string, id: number | string): Promise<void> {
    isSubmitting.value = true
    store.setError(null)
    try {
      await sppgApi.deleteEmployee(sppgId, id)
      await fetchEmployees(sppgId)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal menghapus pegawai.')
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  // ── Menus (nested under SPPG) ──────────────────────────────────
  async function fetchMenus(sppgId: number | string): Promise<void> {
    isLoadingMenus.value = true
    try {
      const res = await sppgApi.getSppgMenus(sppgId)
      menus.value = res.data
    } catch {
      menus.value = []
    } finally {
      isLoadingMenus.value = false
    }
  }

  // ── Unassigned Schools ──────────────────────────────────────────
  async function fetchUnassignedSchools(): Promise<void> {
    isLoadingUnassigned.value = true
    try {
      const res = await getSchools({ without_sppg: 1, per_page: 100 })
      unassignedSchools.value = res.data
    } catch (err: unknown) {
      unassignedSchools.value = []
      throw err
    } finally {
      isLoadingUnassigned.value = false
    }
  }

  // ── Toolbar delegates ──────────────────────────────────────────
  function setSearchQuery(query: string): void {
    store.setSearchQuery(query)
  }

  function setStatusFilter(filter: string): void {
    store.setStatusFilter(filter)
  }

  function setRowsPerPage(num: number): void {
    store.setRowsPerPage(num)
  }

  return {
    // State
    sppgList,
    isLoading,
    isSubmitting,
    isLoadingDetail,
    isLoadingMenus,
    unassignedSchools,
    isLoadingUnassigned,
    error,
    meta,
    selectedSppg,
    partners,
    employees,
    menus,
    searchQuery,
    statusFilter,
    rowsPerPage,

    // Actions
    fetchSppgs,
    fetchSppgDetail,
    createSppg,
    updateSppg,
    deleteSppg,
    activateSppg,
    deactivateSppg,

    // Partners
    fetchPartners,
    assignSchool,
    detachSchool,
    fetchUnassignedSchools,

    // Employees
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,

    // Menus
    fetchMenus,

    // Toolbar
    setSearchQuery,
    setStatusFilter,
    setRowsPerPage,
  }
}

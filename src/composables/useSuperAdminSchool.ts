import * as schoolApi from '@/api/superadmin-school.api'
import { ref, computed } from 'vue'
import type { SchoolItem } from '@/types/superadmin-school'

/**
 * Composable for the Super Admin School management.
 * Handles CRUD + import + client-side filtering and pagination.
 */
export function useSuperAdminSchool() {
  const allSchools   = ref<SchoolItem[]>([])
  const isLoading    = ref(false)
  const isSubmitting = ref(false)
  const error        = ref<string | null>(null)

  // ── Pagination & Filter State ─────────────────────────────────
  const currentPage  = ref(1)
  const perPageVal   = ref(10)
  const searchQuery  = ref('')
  const statusFilter = ref('all') // 'all' | 'mapped' | 'unmapped'

  // ── Computed Stats (Database-Wide) ─────────────────────────────
  const totalItems = computed(() => allSchools.value.length)
  const mappedCount = computed(() => allSchools.value.filter(s => s.is_mapped).length)
  const unmappedCount = computed(() => allSchools.value.filter(s => !s.is_mapped).length)

  // ── Client-Side Filtering ─────────────────────────────────────
  const filteredSchools = computed(() => {
    let list = allSchools.value

    // 1. Search Query Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter(s =>
        s.school_name.toLowerCase().includes(q) ||
        (s.npsn && s.npsn.toLowerCase().includes(q)) ||
        (s.city && s.city.toLowerCase().includes(q))
      )
    }

    // 2. Status Filter
    if (statusFilter.value === 'mapped') {
      list = list.filter(s => s.is_mapped)
    } else if (statusFilter.value === 'unmapped') {
      list = list.filter(s => !s.is_mapped)
    }

    return list
  })

  // ── Client-Side Pagination ────────────────────────────────────
  const displayedSchools = computed(() => {
    const start = (currentPage.value - 1) * perPageVal.value
    const end = start + perPageVal.value
    return filteredSchools.value.slice(start, end)
  })

  const isEmpty = computed(() => !isLoading.value && filteredSchools.value.length === 0)

  const meta = computed(() => {
    const total = filteredSchools.value.length
    const perPage = perPageVal.value
    return {
      current_page: currentPage.value,
      last_page: Math.ceil(total / perPage) || 1,
      per_page: perPage,
      total: total,
    }
  })

  // ── Fetch ──────────────────────────────────────────────────────
  async function fetchSchools(page = 1, silent = false): Promise<void> {
    currentPage.value = page
    if (!silent) isLoading.value = true
    error.value = null
    try {
      // Fetch all schools (using a large limit like 1000)
      const res = await schoolApi.getSchools({ per_page: 1000 })
      allSchools.value = res.data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data sekolah.'
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  // ── CRUD ───────────────────────────────────────────────────────
  async function createSchool(payload: Record<string, unknown>): Promise<void> {
    isSubmitting.value = true
    error.value = null
    try {
      await schoolApi.createSchool(payload)
      await fetchSchools(1, true)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal menambahkan sekolah.'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateSchool(id: string, payload: Record<string, unknown>): Promise<void> {
    isSubmitting.value = true
    error.value = null
    try {
      await schoolApi.updateSchool(id, payload)
      await fetchSchools(currentPage.value, true)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memperbarui sekolah.'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteSchool(id: string): Promise<void> {
    isSubmitting.value = true
    error.value = null
    try {
      await schoolApi.deleteSchool(id)
      // Check if we need to adjust current page after deletion
      const nextTotal = filteredSchools.value.length - 1
      const maxPages = Math.ceil(nextTotal / perPageVal.value) || 1
      const newPage = currentPage.value > maxPages ? maxPages : currentPage.value
      await fetchSchools(newPage, true)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal menghapus sekolah.'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function importSchools(file: File): Promise<{ success: boolean; imported_count: number; errors: { row: number; message: string }[] }> {
    isSubmitting.value = true
    error.value = null
    try {
      const res = await schoolApi.importSchools(file)
      await fetchSchools(1, true)
      return { success: res.success, imported_count: res.imported_count, errors: res.errors }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal mengimpor sekolah.'
      return { success: false, imported_count: 0, errors: [] }
    } finally {
      isSubmitting.value = false
    }
  }

  // ── Toolbar ────────────────────────────────────────────────────
  function setSearchQuery(query: string): void {
    searchQuery.value = query
    currentPage.value = 1 // Reset pagination to page 1 on search
  }

  function setStatusFilter(filter: string): void {
    statusFilter.value = filter
    currentPage.value = 1 // Reset pagination to page 1 on filter change
  }

  function setPerPage(num: number): void {
    perPageVal.value = num
    currentPage.value = 1 // Reset pagination to page 1 on page size change
  }

  return {
    schools: displayedSchools,
    isLoading,
    isSubmitting,
    error,
    meta,
    searchQuery,
    statusFilter,
    totalItems,
    isEmpty,
    mappedCount,
    unmappedCount,

    fetchSchools,
    createSchool,
    updateSchool,
    deleteSchool,
    importSchools,
    setSearchQuery,
    setStatusFilter,
    setPerPage,
  }
}

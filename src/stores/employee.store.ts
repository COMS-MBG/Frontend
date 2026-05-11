import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import Fuse from 'fuse.js'  
import { useAuthStore } from '@/stores/auth.store'
import type { Employee, EmployeeRole } from '@/types/employee'

export const useEmployeeStore = defineStore('employee', () => {
  // ── State ──────────────────────────────────────────────────
  const items       = ref<Employee[]>([]) as Ref<Employee[]>
  const isLoading   = ref(false)
  const error       = ref<string | null>(null)

  // ── UI State (Table Controls) ──────────────────────────────
  const searchQuery  = ref('')
  const selectedRole = ref('all')
  const rowsPerPage  = ref(10)

  // ── Auth (resolved once at setup) ──────────────────────────
  const auth = useAuthStore()

  // ── Fuzzy Search Setup ─────────────────────────────────────
  const fuseInstance = computed(() => {
    return new Fuse(items.value, {
      keys: ['nama', 'nrp', 'departemen'],
      threshold: 0.3,
    })
  })

  // ── Getters ────────────────────────────────────────────────
  const totalItems  = computed(() => items.value.length)
  const activeCount = computed(() => items.value.filter(e => e.isActive).length)
  const adminCount  = computed(() => items.value.filter(e => e.role === 'Admin').length)

  const getById = computed(
    () => (id: number): Employee | undefined =>
      items.value.find(i => i.id === id),
  )

  const filteredItems = computed(() => {
    let result = items.value

    // 1. Role Filter
    if (selectedRole.value !== 'all') {
      result = result.filter(e => e.role === selectedRole.value)
    }

    // 2. Fuzzy Search
    if (searchQuery.value.trim()) {
      // Need to search on the filtered result if role is active
      const localFuse = new Fuse(result, {
        keys: ['nama', 'nrp', 'departemen'],
        threshold: 0.3,
      })
      result = localFuse.search(searchQuery.value).map(res => res.item)
    }

    return result
  })

  // ── Access Logic (derived from auth store, using RBAC permissions) ──
  const canAdd = computed(() => {
    return auth.hasPermission('employee.create')
  })

  const canEdit = computed(() => {
    return auth.hasPermission('employee.edit')
  })

  const canDelete = computed(() => {
    return auth.hasPermission('employee.delete')
  })

  // ── Actions (Toolbar) ──────────────────────────────────────
  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  function setRoleFilter(filter: string): void {
    selectedRole.value = filter
  }

  function setRowsPerPage(num: number): void {
    rowsPerPage.value = num
  }

  // ── Actions (Data) ─────────────────────────────────────────

  /** Bulk-load data */
  function setItems(data: Employee[]): void {
    items.value = data
  }

  /** Append a new employee. */
  function addItem(item: Employee): void {
    items.value.push(item)
  }

  /** Replace an existing employee matched by id. */
  function updateItem(updated: Employee): void {
    const index = items.value.findIndex(i => i.id === updated.id)
    if (index !== -1) items.value[index] = updated
  }

  /** Remove an employee by id. */
  function deleteItem(id: number): void {
    items.value = items.value.filter(i => i.id !== id)
  }

  /** Toggle active status. */
  function toggleStatus(id: number): void {
    const item = items.value.find(i => i.id === id)
    if (item) item.isActive = !item.isActive
  }

  /** Change employee role. */
  function changeRole(id: number, role: EmployeeRole): void {
    const item = items.value.find(i => i.id === id)
    if (item) item.role = role
  }

  /** Fetch items from API (placeholder for future integration). */
  async function fetchItems(): Promise<void> {
    isLoading.value = true
    error.value     = null

    try {
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data karyawan.'
    } finally {
      isLoading.value = false
    }
  }

  // ── Expose ─────────────────────────────────────────────────
  return {
    items,
    isLoading,
    error,
    searchQuery,
    selectedRole,
    rowsPerPage,
    totalItems,
    activeCount,
    adminCount,
    getById,
    filteredItems,
    canAdd,
    canEdit,
    canDelete,
    setSearchQuery,
    setRoleFilter,
    setRowsPerPage,
    setItems,
    addItem,
    updateItem,
    deleteItem,
    toggleStatus,
    changeRole,
    fetchItems,
  }
})

/**
 * stores/employee.store.ts — Employee Management (Pinia)
 *
 * Single source of truth for employee data + access control.
 * Built on the Composition-API store style (consistent with auth.ts).
 *
 * Data flow:  View  →  store action  →  (future: API service layer)
 */
import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { Employee, EmployeeRole } from '@/types/employee'

export const useEmployeeStore = defineStore('employee', () => {
  // ── State ──────────────────────────────────────────────────
  const items     = ref<Employee[]>([]) as Ref<Employee[]>
  const isLoading = ref(false)
  const error     = ref<string | null>(null)

  // ── Auth (resolved once at setup) ──────────────────────────
  const auth = useAuthStore()

  // ── Getters ────────────────────────────────────────────────
  const totalItems  = computed(() => items.value.length)
  const activeCount = computed(() => items.value.filter(e => e.isActive).length)
  const adminCount  = computed(() => items.value.filter(e => e.role === 'Admin').length)

  const getById = computed(
    () => (id: number): Employee | undefined =>
      items.value.find(i => i.id === id),
  )

  // ── Access Logic (derived from auth store) ─────────────────
  const canAdd = computed(() => {
    return auth.userRole?.toLowerCase() === 'admin'
  })

  const canEdit = computed(() => {
    const role = auth.userRole?.toLowerCase()
    return role === 'admin' || role === 'operator'
  })

  const canDelete = computed(() => {
    return auth.userRole?.toLowerCase() === 'admin'
  })

  // ── Actions ────────────────────────────────────────────────

  /** Bulk-load data (used with dummy / imported data). */
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
      // Future: const { data } = await api.get('/employees')
      // items.value = data
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
    totalItems,
    activeCount,
    adminCount,
    getById,
    canAdd,
    canEdit,
    canDelete,
    setItems,
    addItem,
    updateItem,
    deleteItem,
    toggleStatus,
    changeRole,
    fetchItems,
  }
})

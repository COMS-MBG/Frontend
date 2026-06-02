import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getEmployees,
  getEmployee,
  createEmployee as apiCreate,
  updateEmployee as apiUpdate,
  deleteEmployee as apiDelete,
  getAssignRoleOptions,
  assignRole as apiAssignRole,
} from '@/api/employee.api'
import type {
  Employee,
  EmployeeCreateForm,
  EmployeeUpdateForm,
  AssignRolePayload,
  AssignRoleOption,
} from '@/types/employee'

export const useEmployeeStore = defineStore('employee', () => {
  // ── State ──────────────────────────────────────────────────
  const employees = ref<Employee[]>([])
  const selectedEmployee = ref<Employee | null>(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  })
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)
  const filters = ref({
    search: '',
    role_id: '' as string,
    page: 1,
  })

  // ── Assign Role State ──────────────────────────────────────
  const assignRoleOptions = ref<AssignRoleOption[]>([])

  // ── Getters ────────────────────────────────────────────────
  const activeCount = computed(
    () => employees.value.filter((e) => e.status === 'active').length,
  )

  const roleCount = computed(() => {
    const roles = new Set(
      employees.value
        .map((e) => e.role?.name)
        .filter((r) => r && r !== 'Tanpa Akses'),
    )
    return roles.size
  })

  // ── Actions ────────────────────────────────────────────────

  async function fetchEmployees(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const res = await getEmployees({
        page: filters.value.page,
        search: filters.value.search || undefined,
        role_id: filters.value.role_id ? Number(filters.value.role_id) : undefined,
      })
      employees.value = res.data
      pagination.value = {
        currentPage: res.current_page,
        lastPage: res.last_page,
        perPage: res.per_page,
        total: res.total,
      }
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal memuat data karyawan.'
    } finally {
      isLoading.value = false
    }
  }

  /** Silent refresh — re-fetches without triggering skeleton loader */
  async function silentRefresh(): Promise<void> {
    try {
      const res = await getEmployees({
        page: filters.value.page,
        search: filters.value.search || undefined,
        role_id: filters.value.role_id ? Number(filters.value.role_id) : undefined,
      })
      employees.value = res.data
      pagination.value = {
        currentPage: res.current_page,
        lastPage: res.last_page,
        perPage: res.per_page,
        total: res.total,
      }
    } catch {
      // Silent — don't override existing error
    }
  }

  async function fetchEmployee(id: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      selectedEmployee.value = await getEmployee(id)
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal memuat detail karyawan.'
    } finally {
      isLoading.value = false
    }
  }

  async function createEmployee(payload: EmployeeCreateForm): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await apiCreate(payload)
      // Await silent refresh so data is loaded before modals close/show success
      await silentRefresh()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal membuat karyawan baru.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateEmployee(
    id: number,
    payload: EmployeeUpdateForm,
  ): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      const res = await apiUpdate(id, payload)
      selectedEmployee.value = res.employee
      // Await silent refresh so data is loaded before modals close/show success
      await silentRefresh()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal mengupdate karyawan.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteEmployee(id: number): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await apiDelete(id)
      // Await silent refresh so data is loaded before modals close/show success
      await silentRefresh()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal menghapus karyawan.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function fetchAssignRoleOptions(id: number): Promise<void> {
    error.value = null

    try {
      const res = await getAssignRoleOptions(id)
      assignRoleOptions.value = res.roles
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal memuat opsi role.'
    }
  }

  async function assignRole(
    id: number,
    payload: AssignRolePayload,
  ): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      const res = await apiAssignRole(id, payload)
      selectedEmployee.value = res.employee
      // Await silent refresh so data is loaded before modals close/show success
      await silentRefresh()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal mengassign role.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  function setFilter(key: 'search' | 'role_id' | 'page', value: string | number): void {
    if (key === 'page') {
      filters.value.page = value as number
    } else {
      filters.value[key] = value as string
      filters.value.page = 1
    }
    fetchEmployees()
  }

  function resetState(): void {
    employees.value = []
    selectedEmployee.value = null
    pagination.value = { currentPage: 1, lastPage: 1, perPage: 10, total: 0 }
    isLoading.value = false
    isSubmitting.value = false
    error.value = null
    filters.value = { search: '', role_id: '', page: 1 }
    assignRoleOptions.value = []
  }

  return {
    employees, selectedEmployee, pagination,
    isLoading, isSubmitting, error, filters, assignRoleOptions,
    activeCount, roleCount,
    fetchEmployees, fetchEmployee, createEmployee, updateEmployee,
    deleteEmployee, fetchAssignRoleOptions, assignRole,
    setFilter, resetState,
  }
})

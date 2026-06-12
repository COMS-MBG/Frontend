import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useEmployeeStore } from '@/stores/employee.store'
import { useAuth } from '@/composables/useAuth'
import type { EmployeeCreateForm, EmployeeUpdateForm, AssignRolePayload } from '@/types/employee'

/**
 * Composable wrapper for the employee store.
 * Provides reactive state, actions, and RBAC-driven permission checks.
 */
export function useEmployee() {
  const store = useEmployeeStore()
  const { checkPermission } = useAuth()

  const {
    employees, selectedEmployee, pagination,
    isLoading, isSubmitting, error, filters, assignRoleOptions,
  } = storeToRefs(store)

  const hasEmployees = computed(() => employees.value.length > 0)
  const isEmpty = computed(() => !isLoading.value && employees.value.length === 0)
  const activeCount = computed(() => store.activeCount)
  const roleCount = computed(() => store.roleCount)

  const canCreate = computed(() => checkPermission('employee.create'))
  const canUpdate = computed(() => checkPermission('employee.update'))
  const canDelete = computed(() => checkPermission('employee.delete'))
  const canAssignRole = computed(() => checkPermission('employee.update'))

  function fetchEmployees() { return store.fetchEmployees() }
  function fetchEmployee(id: number) { return store.fetchEmployee(id) }
  function createEmployee(payload: EmployeeCreateForm) { return store.createEmployee(payload) }
  function updateEmployee(id: number, payload: EmployeeUpdateForm) { return store.updateEmployee(id, payload) }
  function deleteEmployee(id: number) { return store.deleteEmployee(id) }
  function fetchAssignRoleOptions(id: number) { return store.fetchAssignRoleOptions(id) }
  function assignRole(id: number, payload: AssignRolePayload) { return store.assignRole(id, payload) }
  function setFilter(key: 'search' | 'role_id' | 'page', value: string | number) { store.setFilter(key, value) }
  function resetState() { store.resetState() }

  return {
    employees, selectedEmployee, pagination,
    isLoading, isSubmitting, error, filters, assignRoleOptions,
    activeCount, roleCount, hasEmployees, isEmpty,
    canCreate, canUpdate, canDelete, canAssignRole,
    fetchEmployees, fetchEmployee, createEmployee, updateEmployee,
    deleteEmployee, fetchAssignRoleOptions, assignRole,
    setFilter, resetState,
  }
}

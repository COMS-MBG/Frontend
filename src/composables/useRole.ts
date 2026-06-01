import { storeToRefs } from 'pinia'
import { useRoleStore } from '@/stores/role.store'
import { useAuthStore } from '@/stores/auth.store'
import type { RoleMutationPayload } from '@/api/role.api'

/**
 * Composable for Role CRUD orchestration.
 * Bridges UI ↔ Store and provides RBAC permission checks.
 */
export function useRole() {
  const store = useRoleStore()
  const auth = useAuthStore()

  // ── Reactive state (destructured from store) ────────────────
  const {
    items,
    filteredItems,
    isLoading,
    isSubmitting,
    error,
    meta,
    searchQuery,
    totalItems,
    usedRolesCount,
    totalPermissionCount,
    allPermissions,
  } = storeToRefs(store)

  // ── RBAC ────────────────────────────────────────────────────
  const canCreate = auth.hasPermission('employee.update')
  const canUpdate = auth.hasPermission('employee.update')
  const canDelete = auth.hasPermission('employee.update')

  // ── Delegated Actions ──────────────────────────────────────
  async function fetchRoles(): Promise<void> {
    await store.fetchItems()
  }

  async function createRole(payload: RoleMutationPayload): Promise<boolean> {
    return store.createItem(payload)
  }

  async function updateRole(id: number, payload: RoleMutationPayload): Promise<boolean> {
    return store.updateItem(id, payload)
  }

  async function deleteRole(id: number): Promise<boolean> {
    return store.deleteItem(id)
  }

  function setSearchQuery(query: string): void {
    store.setSearchQuery(query)
  }

  function resetState(): void {
    store.resetState()
  }

  return {
    // State
    items,
    filteredItems,
    isLoading,
    isSubmitting,
    error,
    meta,
    searchQuery,
    totalItems,
    usedRolesCount,
    totalPermissionCount,
    allPermissions,

    // RBAC
    canCreate,
    canUpdate,
    canDelete,

    // Actions
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    setSearchQuery,
    resetState,
  }
}

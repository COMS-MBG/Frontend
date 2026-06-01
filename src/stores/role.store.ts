import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import { roleApi } from '@/api/role.api'
import type { Role, Permission } from '@/types/access'
import type { RoleMutationPayload } from '@/api/role.api'

export const useRoleStore = defineStore('role', () => {
  // ── State ──────────────────────────────────────────────────
  const items       = ref<Role[]>([]) as Ref<Role[]>
  const isLoading   = ref(false)
  const isSubmitting = ref(false)
  const error       = ref<string | null>(null)

  // ── Pagination State (server-driven) ───────────────────────
  const meta = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 100,
  })

  // ── Permissions Catalog (all available) ────────────────────
  const allPermissions = ref<Record<string, Record<string, Permission[]>>>({})

  // ── UI State ───────────────────────────────────────────────
  const searchQuery = ref('')

  // ── Getters ────────────────────────────────────────────────
  const totalItems = computed(() => meta.value.total)

  const filteredItems = computed(() => {
    const q = searchQuery.value.toLowerCase()
    if (!q) return items.value
    return items.value.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q),
    )
  })

  const usedRolesCount = computed(() =>
    items.value.filter((r) => (r.employees_count ?? 0) > 0).length,
  )

  const totalPermissionCount = computed(() => {
    let count = 0
    for (const features of Object.values(allPermissions.value)) {
      for (const perms of Object.values(features)) {
        count += perms.length
      }
    }
    return count
  })

  // ── Actions (Toolbar) ──────────────────────────────────────
  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  // ── Actions (API) ──────────────────────────────────────────

  /** Fetch roles + permissions catalog from backend */
  async function fetchItems(silent = false): Promise<void> {
    if (!silent) isLoading.value = true
    error.value = null

    try {
      const [rolesRes, permsRes] = await Promise.all([
        roleApi.getAll({ per_page: 100 }),
        roleApi.getPermissions(),
      ])

      items.value = rolesRes.data
      meta.value = {
        current_page: rolesRes.current_page,
        last_page: rolesRes.last_page,
        total: rolesRes.total,
        per_page: rolesRes.per_page,
      }
      allPermissions.value = permsRes
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data role.'
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  /** Create a new role via API, then refresh list in background */
  async function createItem(payload: RoleMutationPayload): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await roleApi.create(payload)
      // Silent refresh in the background (non-blocking so modals close instantly)
      fetchItems(true)
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal membuat role baru.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  /** Update a role via API, then refresh list in background */
  async function updateItem(id: number, payload: RoleMutationPayload): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await roleApi.update(id, payload)
      // Silent refresh in the background (non-blocking so modals close instantly)
      fetchItems(true)
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memperbarui role.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  /** Delete a role via API, then refresh list in background */
  async function deleteItem(id: number): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await roleApi.delete(id)
      // Silent refresh in the background (non-blocking so modals close instantly)
      fetchItems(true)
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal menghapus role.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  function resetState(): void {
    items.value = []
    allPermissions.value = {}
    searchQuery.value = ''
    error.value = null
  }

  // ── Expose ─────────────────────────────────────────────────
  return {
    // State
    items,
    isLoading,
    isSubmitting,
    error,
    meta,
    allPermissions,

    // UI Controls
    searchQuery,

    // Getters
    totalItems,
    filteredItems,
    usedRolesCount,
    totalPermissionCount,

    // Actions
    setSearchQuery,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    resetState,
  }
})

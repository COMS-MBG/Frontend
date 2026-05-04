import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { FeatureAccess, RoleKey, PermissionAction, FeaturePermission } from '@/types/access'
export const useAccessStore = defineStore('access', () => {
  // ── State ──────────────────────────────────────────────────
  const features     = ref<FeatureAccess[]>([]) as Ref<FeatureAccess[]>
  const roles        = ref<RoleKey[]>([])
  const selectedRole = ref<RoleKey>('Admin')
  const isLoading    = ref(false)
  const error        = ref<string | null>(null)

  // ── Auth (resolved once at setup) ──────────────────────────
  const auth = useAuthStore()

  // ── Getters ────────────────────────────────────────────────

  /**
   * Permissions for the currently selected role.
   * Returns structured objects preserving the FeaturePermission shape
   * so components can iterate actions via PERMISSION_ACTIONS constant.
   */
  const currentPermissions = computed<{
    id: string
    name: string
    icon: string
    permissions: FeaturePermission
  }[]>(() =>
    features.value.map(f => ({
      id: f.id,
      name: f.name,
      icon: f.icon,
      permissions: f.permissions[selectedRole.value],
    }))
  )

  /** Total number of enabled permissions for the selected role. */
  const enabledCount = computed(() =>
    features.value.reduce((sum, f) => {
      const p = f.permissions[selectedRole.value]
      return sum + (p.view ? 1 : 0) + (p.create ? 1 : 0) + (p.edit ? 1 : 0) + (p.delete ? 1 : 0)
    }, 0)
  )

  /** Total possible permissions (features × 4 actions). */
  const totalPermissions = computed(() => features.value.length * 4)

  /** Whether the current user can edit permissions. */
  const canEditPermissions = computed(() => {
    return auth.userRole?.toLowerCase() === 'admin'
  })

  // ── Actions ────────────────────────────────────────────────

  /**
   * Initialize store with data.
   * Currently seeds from dummy data; swap to fetchPermissions() when API is ready.
   */
  async function initialize(): Promise<void> {
    if (features.value.length > 0) return

    isLoading.value = true
    try {
      // API_PLACEHOLDER: Replace with actual API call
      // const { data } = await accessService.getPermissions()
      const { featureAccessDummy, availableRoles } = await import('@/data/access.dummy')
      features.value = featureAccessDummy
      roles.value = availableRoles
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data hak akses.'
    } finally {
      isLoading.value = false
    }
  }

  /** Select a role to view/edit its permissions. */
  function selectRole(role: RoleKey): void {
    selectedRole.value = role
  }

  /** Toggle a single permission for the selected role. */
  function togglePermission(featureId: string, action: PermissionAction): void {
    const feature = features.value.find(f => f.id === featureId)
    if (!feature) return

    const perms = feature.permissions[selectedRole.value]
    perms[action] = !perms[action]
  }

  /** Set all permissions for the selected role on a feature. */
  function setAllPermissions(featureId: string, enabled: boolean): void {
    const feature = features.value.find(f => f.id === featureId)
    if (!feature) return

    const perms = feature.permissions[selectedRole.value]
    perms.view = enabled
    perms.create = enabled
    perms.edit = enabled
    perms.delete = enabled
  }

  // ── Expose ─────────────────────────────────────────────────
  return {
    features,
    roles,
    selectedRole,
    isLoading,
    error,
    currentPermissions,
    enabledCount,
    totalPermissions,
    canEditPermissions,
    initialize,
    selectRole,
    togglePermission,
    setAllPermissions,
  }
})
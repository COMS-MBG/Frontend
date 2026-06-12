import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { getRoles, getPermissions, updateRole } from '@/api/access.api'
import { FEATURE_META } from '@/types/access'
import type {
  Role,
  Permission,
  PermissionAction,
  FeatureAccessRow,
} from '@/types/access'

export const useAccessStore = defineStore('access', () => {
  // ── State ──────────────────────────────────────────────────
  const roles = ref<Role[]>([])
  const allPermissions = ref<Record<string, Record<string, Permission[]>>>({})
  const selectedRoleId = ref<number | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  // ── Auth ───────────────────────────────────────────────────
  const auth = useAuthStore()

  // ── Getters ────────────────────────────────────────────────

  /** The currently selected role object. */
  const selectedRole = computed<Role | null>(() =>
    roles.value.find((r) => r.id === selectedRoleId.value) ?? null,
  )

  /** The display name of the selected role. */
  const selectedRoleName = computed(() => selectedRole.value?.name ?? '—')

  /** Build the permission matrix for the selected role. */
  const currentPermissions = computed<FeatureAccessRow[]>(() => {
    if (!selectedRole.value) return []

    const rolePermSlugs = new Set(
      selectedRole.value.permissions.map((p) => p.slug),
    )
    const rolePermMap = new Map(
      selectedRole.value.permissions.map((p) => [p.slug, p.id]),
    )

    const rows: FeatureAccessRow[] = []

    // Iterate all permissions grouped by module → feature
    for (const [, features] of Object.entries(allPermissions.value)) {
      for (const [feature, perms] of Object.entries(features)) {
        const meta = FEATURE_META[feature] ?? {
          label: feature.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          icon: 'settings',
        }

        const permissionIds: Record<PermissionAction, number | null> = {
          read: null,
          create: null,
          update: null,
          delete: null,
        }

        const flags: Record<PermissionAction, boolean> = {
          read: false,
          create: false,
          update: false,
          delete: false,
        }

        for (const p of perms) {
          const action = p.action as PermissionAction
          if (action in permissionIds) {
            permissionIds[action] = p.id
            flags[action] = rolePermSlugs.has(p.slug)
          }
        }

        rows.push({
          module: perms[0]?.module ?? '',
          feature,
          label: meta.label,
          icon: meta.icon,
          permissions: flags,
          permissionIds,
        })
      }
    }

    return rows
  })

  /** Count of enabled permissions for the selected role. */
  const enabledCount = computed(() =>
    currentPermissions.value.reduce((sum, row) => {
      const p = row.permissions
      return sum + (p.read ? 1 : 0) + (p.create ? 1 : 0) + (p.update ? 1 : 0) + (p.delete ? 1 : 0)
    }, 0),
  )

  /** Total possible permission slots. */
  const totalPermissions = computed(() => currentPermissions.value.length * 4)

  /** Total unique features (rows). */
  const totalFeatures = computed(() => currentPermissions.value.length)

  /** Whether current auth user can edit permissions. */
  const canEditPermissions = computed(() =>
    auth.hasRole('super_admin', 'pemilik'),
  )

  // ── Actions ────────────────────────────────────────────────

  /** Fetch roles and permissions from backend. */
  async function initialize(): Promise<void> {
    if (roles.value.length > 0 && Object.keys(allPermissions.value).length > 0) return

    isLoading.value = true
    error.value = null

    try {
      const [rolesRes, permsRes] = await Promise.all([
        getRoles(),
        getPermissions(),
      ])

      roles.value = rolesRes.data
      allPermissions.value = permsRes

      if (roles.value.length > 0 && !selectedRoleId.value) {
        const firstRole = roles.value[0]
        if (firstRole) {
          selectedRoleId.value = firstRole.id
        }
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data hak akses.'
    } finally {
      isLoading.value = false
    }
  }

  /** Select a role to view/edit. */
  function selectRole(roleId: number): void {
    selectedRoleId.value = roleId
  }

  /** Toggle a single permission for the selected role and persist to backend. */
  async function togglePermission(
    feature: string,
    action: PermissionAction,
  ): Promise<void> {
    if (!selectedRole.value) return

    const row = currentPermissions.value.find((r) => r.feature === feature)
    if (!row) return

    const permId = row.permissionIds[action]
    if (!permId) return

    const roleIdx = roles.value.findIndex((r) => r.id === selectedRoleId.value)
    if (roleIdx === -1) return

    const role = roles.value[roleIdx]
    if (!role) return

    const wasEnabled = role.permissions.some((p) => p.id === permId)

    // Optimistic toggle: mutate the source-of-truth (roles ref)
    if (wasEnabled) {
      role.permissions = role.permissions.filter((p) => p.id !== permId)
    } else {
      // Find the full permission object from allPermissions
      let permObj: Permission | null = null
      for (const features of Object.values(allPermissions.value)) {
        for (const perms of Object.values(features)) {
          const found = perms.find((p) => p.id === permId)
          if (found) { permObj = found; break }
        }
        if (permObj) break
      }
      if (permObj) {
        role.permissions = [...role.permissions, permObj]
      }
    }

    // Build the new permission IDs list from the (now mutated) role
    const newPermIds = role.permissions.map((p) => p.id)

    isSaving.value = true
    error.value = null

    try {
      const res = await updateRole(role.id, {
        name: role.name,
        description: role.description ?? undefined,
        permissions: newPermIds,
      })

      // Sync with fresh data from backend, preserve employees_count
      const freshRole = res.role
      freshRole.employees_count = role.employees_count
      roles.value[roleIdx] = freshRole
    } catch (err: unknown) {
      // Revert optimistic toggle
      if (wasEnabled) {
        // Re-add the permission
        let permObj: Permission | null = null
        for (const features of Object.values(allPermissions.value)) {
          for (const perms of Object.values(features)) {
            const found = perms.find((p) => p.id === permId)
            if (found) { permObj = found; break }
          }
          if (permObj) break
        }
        if (permObj) role.permissions = [...role.permissions, permObj]
      } else {
        role.permissions = role.permissions.filter((p) => p.id !== permId)
      }
      error.value = err instanceof Error ? err.message : 'Gagal menyimpan perubahan.'
    } finally {
      isSaving.value = false
    }
  }

  // ── Expose ─────────────────────────────────────────────────
  return {
    roles,
    selectedRoleId,
    selectedRole,
    selectedRoleName,
    isLoading,
    isSaving,
    error,
    currentPermissions,
    enabledCount,
    totalPermissions,
    totalFeatures,
    canEditPermissions,
    initialize,
    selectRole,
    togglePermission,
  }
})
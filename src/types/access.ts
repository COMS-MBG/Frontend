export type RoleKey = 'Admin' | 'Operator' | 'Viewer'

/** Individual permission flags for a single feature. */
export interface FeaturePermission {
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

/** A feature row in the permission matrix. */
export interface FeatureAccess {
  id: string
  name: string
  icon: string
  permissions: Record<RoleKey, FeaturePermission>
}

/** Keys of permission actions (used to iterate columns). */
export type PermissionAction = keyof FeaturePermission

export const PERMISSION_ACTIONS: { key: PermissionAction; label: string }[] = [
  { key: 'view',   label: 'VIEW'   },
  { key: 'create', label: 'CREATE' },
  { key: 'edit',   label: 'EDIT'   },
  { key: 'delete', label: 'DELETE' },
]
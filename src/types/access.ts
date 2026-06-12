// ── RBAC Access Types ──────────────────────────────────────

/** Backend Permission model fields. */
export interface Permission {
  id: number
  name: string
  slug: string
  module: string
  feature: string
  action: PermissionAction
  created_at: string
  updated_at: string
  pivot?: { role_id: number; permission_id: number }
}

/** Backend Role model with nested permissions. */
export interface Role {
  id: number
  name: string
  slug: string
  description: string | null
  sppg_id: number | null
  employees_count?: number
  permissions: Permission[]
  created_at: string
  updated_at: string
}

/** The 4 CRUD actions stored in permissions table. */
export type PermissionAction = 'read' | 'create' | 'update' | 'delete'

/** Permission flags for a single feature within a specific role. */
export interface FeaturePermission {
  read: boolean
  create: boolean
  update: boolean
  delete: boolean
}

/** A feature row in the permission matrix (built client-side). */
export interface FeatureAccessRow {
  module: string
  feature: string
  label: string
  icon: string
  permissions: FeaturePermission
  /** The permission IDs that are enabled for this feature. */
  permissionIds: Record<PermissionAction, number | null>
}

/** Column definitions for the permission table. */
export const PERMISSION_ACTIONS: { key: PermissionAction; label: string }[] = [
  { key: 'read',   label: 'READ'   },
  { key: 'create', label: 'CREATE' },
  { key: 'update', label: 'UPDATE' },
  { key: 'delete', label: 'DELETE' },
]

/** Label + icon mapping for known features. */
export const FEATURE_META: Record<string, { label: string; icon: string }> = {
  // Dashboard
  dashboard:           { label: 'Dashboard',           icon: 'dashboard' },
  // Employee
  employee:            { label: 'Karyawan',            icon: 'badge' },
  // Partner
  partner:             { label: 'Mitra / Partner',     icon: 'handshake' },
  // School
  school:              { label: 'Sekolah',             icon: 'school' },
  // Nutrition
  ingredients:         { label: 'Bahan Baku',          icon: 'egg_alt' },
  recipes:             { label: 'Resep',               icon: 'menu_book' },
  menus:               { label: 'Menu',                icon: 'restaurant_menu' },
  // Distribution
  distribution:        { label: 'Distribusi',          icon: 'local_shipping' },
  delivery_schedule:   { label: 'Jadwal Pengiriman',   icon: 'calendar_month' },
  // Report
  report:              { label: 'Laporan',             icon: 'analytics' },
}
import type { User, RoleName } from '@/types/auth'

// Get all permission names from a user's roles.
function getAllPermissions(user: User): string[] {
  return user.roles
    .flatMap(role => role.permissions)
    .map(p => p.name)
}

export function hasRole(user: User | null, role: string): boolean {
  if (!user) return false
  return user.roles.some(r => r.name === role)
}

export function hasAnyRole(user: User | null, roles: string[]): boolean {
  if (!user) return false
  return roles.some(role => user.roles.some(r => r.name === role))
}

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false
  return getAllPermissions(user).includes(permission)
}

export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  if (!user) return false
  const userPerms = getAllPermissions(user)
  return permissions.some(perm => userPerms.includes(perm))
}

export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  if (!user) return false
  const userPerms = getAllPermissions(user)
  return permissions.every(perm => userPerms.includes(perm))
}

// Check if the user is a super admin.

export function isSuperAdmin(user: User | null): boolean {
  return hasRole(user, 'super_admin')
}

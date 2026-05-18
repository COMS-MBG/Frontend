import api from '@/api/axios'
import type { Role, Permission } from '@/types/access'

const ROLES_BASE = '/admin-sppg/roles'
const PERMISSIONS_BASE = '/admin-sppg/permissions'

/**
 * Fetch paginated roles list with permissions + employee count.
 * GET /api/admin-sppg/roles
 */
export async function getRoles(): Promise<{
  data: Role[]
  current_page: number
  last_page: number
  total: number
}> {
  const { data } = await api.get(ROLES_BASE, { params: { per_page: 100 } })
  return data
}

/**
 * Fetch a single role with permissions and employees.
 * GET /api/admin-sppg/roles/{id}
 */
export async function getRole(id: number): Promise<Role> {
  const { data } = await api.get<Role>(`${ROLES_BASE}/${id}`)
  return data
}

/**
 * Update a role and sync its permissions.
 * PUT /api/admin-sppg/roles/{id}
 */
export async function updateRole(
  id: number,
  payload: { name: string; description?: string; permissions: number[] },
): Promise<{ message: string; role: Role }> {
  const { data } = await api.put(`${ROLES_BASE}/${id}`, payload)
  return data
}

/**
 * Fetch all permissions grouped by module → feature.
 * GET /api/admin-sppg/permissions
 */
export async function getPermissions(): Promise<
  Record<string, Record<string, Permission[]>>
> {
  const { data } = await api.get(PERMISSIONS_BASE)
  return data
}

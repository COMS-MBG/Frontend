import api from '@/api/axios'
import type { Role, Permission } from '@/types/access'

const BASE = '/admin-sppg/roles'
const PERMISSIONS_BASE = '/admin-sppg/permissions'

// ── Types ────────────────────────────────────────────────────────────────────

export interface RoleListResponse {
  data: Role[]
  current_page: number
  last_page: number
  total: number
  per_page: number
}

export interface RoleMutationPayload {
  name: string
  description?: string
  permissions?: number[]
}

export interface RoleMutationResponse {
  message: string
  role: Role
}

// ── API ──────────────────────────────────────────────────────────────────────

export const roleApi = {
  /**
   * Fetch paginated roles list with permissions + employee count.
   * GET /api/admin-sppg/roles
   */
  async getAll(params?: Record<string, string | number | undefined>): Promise<RoleListResponse> {
    const { data } = await api.get(BASE, { params })
    return data
  },

  /**
   * Fetch a single role with permissions and employees.
   * GET /api/admin-sppg/roles/{id}
   */
  async getOne(id: number): Promise<Role> {
    const { data } = await api.get<Role>(`${BASE}/${id}`)
    return data
  },

  /**
   * Create a new role and sync permissions.
   * POST /api/admin-sppg/roles
   */
  async create(payload: RoleMutationPayload): Promise<RoleMutationResponse> {
    const { data } = await api.post(BASE, payload)
    return data
  },

  /**
   * Update a role and sync permissions.
   * PUT /api/admin-sppg/roles/{id}
   */
  async update(id: number, payload: RoleMutationPayload): Promise<RoleMutationResponse> {
    const { data } = await api.put(`${BASE}/${id}`, payload)
    return data
  },

  /**
   * Delete a role.
   * DELETE /api/admin-sppg/roles/{id}
   */
  async delete(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(`${BASE}/${id}`)
    return data
  },

  /**
   * Fetch all permissions grouped by module → feature.
   * GET /api/admin-sppg/permissions
   */
  async getPermissions(): Promise<Record<string, Record<string, Permission[]>>> {
    const { data } = await api.get(PERMISSIONS_BASE)
    return data
  },
}

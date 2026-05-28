import api from '@/api/axios'
import type {
  Menu,
  MenuListResponse,
  MenuMutationResponse,
  MenuDeleteResponse,
  MenuForm,
} from '@/types/menu-planning'

const BASE = '/admin-sppg/nutrition/menus'

/**
 * Fetch paginated menu list with optional filters.
 * GET /api/admin-sppg/nutrition/menus
 */
export async function getMenus(params?: {
  page?: number
  per_page?: number
  search?: string
  status?: string
}): Promise<MenuListResponse> {
  const { data } = await api.get<MenuListResponse>(BASE, { params })
  return data
}

/**
 * Fetch a single menu by ID (with items + recipes).
 * GET /api/admin-sppg/nutrition/menus/{id}
 */
export async function getMenu(id: number): Promise<Menu> {
  const { data } = await api.get<{ success: boolean; data: Menu }>(`${BASE}/${id}`)
  return data.data
}

/**
 * Create a new menu plan.
 * POST /api/admin-sppg/nutrition/menus
 */
export async function createMenu(payload: MenuForm): Promise<MenuMutationResponse> {
  const { data } = await api.post<MenuMutationResponse>(BASE, payload)
  return data
}

/**
 * Update an existing menu plan.
 * PUT /api/admin-sppg/nutrition/menus/{id}
 */
export async function updateMenu(id: number, payload: MenuForm): Promise<MenuMutationResponse> {
  const { data } = await api.put<MenuMutationResponse>(`${BASE}/${id}`, payload)
  return data
}

/**
 * Delete a menu plan.
 * DELETE /api/admin-sppg/nutrition/menus/{id}
 */
export async function deleteMenu(id: number): Promise<MenuDeleteResponse> {
  const { data } = await api.delete<MenuDeleteResponse>(`${BASE}/${id}`)
  return data
}

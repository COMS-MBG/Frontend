import api from '@/api/axios'
import type { AdminDashboardResponse } from '@/types/admin-dashboard'

const BASE = '/admin-sppg'

/** GET /api/admin-sppg/dashboard */
export async function getAdminDashboardStats(): Promise<AdminDashboardResponse> {
  const { data } = await api.get<AdminDashboardResponse>(`${BASE}/dashboard`)
  return data
}

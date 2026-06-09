import api from '@/api/axios'
import type { DashboardStats, DashboardStatsResponse } from '@/types/superadmin-dashboard'

// Re-export types for backward compatibility during migration
export type { DashboardStats, DashboardStatsResponse } from '@/types/superadmin-dashboard'

// ── API ──────────────────────────────────────────────────────────────────────

const BASE = '/super-admin'

/** GET /api/super-admin/dashboard */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const { data } = await api.get<DashboardStatsResponse>(`${BASE}/dashboard`)
  return data
}

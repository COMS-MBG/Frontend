// ── Super Admin Dashboard Types ─────────────────────────────────────────────

export interface DashboardStats {
  total_sppg: number
  total_sppg_active: number
  total_sppg_inactive: number
  total_partners: number
  total_daily_portions: number
}

export interface DashboardStatsResponse {
  success: boolean
  data: DashboardStats
}

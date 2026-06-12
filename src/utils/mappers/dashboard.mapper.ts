import type { DashboardStats } from '@/types/superadmin-dashboard'

/**
 * Scalable dashboard mapper structure.
 * Placeholder for future dashboard stats transformation logic.
 */
export function mapDashboardStats(raw: unknown): DashboardStats {
  if (!raw || typeof raw !== 'object') {
    return {} as DashboardStats
  }
  const r = raw as Record<string, any>
  return {
    total_sppg: Number(r.total_sppg ?? 0),
    total_sppg_active: Number(r.total_sppg_active ?? 0),
    total_sppg_inactive: Number(r.total_sppg_inactive ?? 0),
    total_partners: Number(r.total_partners ?? 0),
    total_daily_portions: Number(r.total_daily_portions ?? 0),
  }
}

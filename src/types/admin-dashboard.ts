import type { StockSummary } from './stock'

export interface AdminDashboardData {
  schedules: {
    in_order: number
    delivering: number
    delivered: number
    revision_required: number
    confirmed: number
    rejected: number
  }
  history_this_month: {
    total_deliveries: number
    total_distance_km: number
    avg_duration_minutes: number | null
  }
  active_couriers: number
  pending_confirmation: Array<{
    id: number
    courier_name: string | null
    school_name: string | null
    arrived_at: string | null
  }>
  resources: {
    total_couriers: number
    total_schools: number
    total_portions: number
  }
  staff_completeness: {
    nutritionist_registered: boolean
    logistics_admin_registered: boolean
    is_complete: boolean
  }
  stock_alerts: StockSummary[]
  generated_at: string
}

export interface AdminDashboardResponse {
  success: boolean
  data: AdminDashboardData
}

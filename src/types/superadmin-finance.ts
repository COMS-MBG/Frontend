// ── Super Admin Finance Types ───────────────────────────────────────────────

export interface FinancialReport {
  id: number
  sppg_id: number
  sppg_name: string
  period: string
  total_income: number
  total_expense: number
  net_income: number
  status: 'submitted' | 'approved' | 'rejected' | 'pending'
  submitted_at: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface FinanceListResponse {
  success: boolean
  data: FinancialReport[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

export interface FinanceDetailResponse {
  success: boolean
  data: FinancialReport
}

export interface FinanceMutationResponse {
  success: boolean
  message: string
  data: FinancialReport
}

export interface FinanceDeleteResponse {
  success: boolean
  message: string
}

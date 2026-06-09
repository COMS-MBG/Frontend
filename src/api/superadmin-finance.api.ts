import api from '@/api/axios'
import type {
  FinancialReport,
  FinanceListResponse,
  FinanceDetailResponse,
  FinanceMutationResponse,
  FinanceDeleteResponse,
} from '@/types/superadmin-finance'

// Re-export types for backward compatibility during migration
export type {
  FinancialReport,
  FinanceListResponse,
  FinanceDetailResponse,
  FinanceMutationResponse,
  FinanceDeleteResponse,
} from '@/types/superadmin-finance'

// ── API ──────────────────────────────────────────────────────────────────────
// NOTE: Backend financial-reports endpoints are currently stubs.
// These wrappers are ready for when the backend is fully implemented.

const BASE = '/super-admin/financial-reports'

/** GET /api/super-admin/financial-reports — List with filters & pagination */
export async function getFinancialReports(params?: Record<string, string | number | undefined>): Promise<FinanceListResponse> {
  const { data } = await api.get<FinanceListResponse>(BASE, { params })
  return data
}

/** GET /api/super-admin/financial-reports/{id} — Detail */
export async function getFinancialReport(id: number | string): Promise<FinanceDetailResponse> {
  const { data } = await api.get<FinanceDetailResponse>(`${BASE}/${id}`)
  return data
}

/** POST /api/super-admin/financial-reports — Create */
export async function createFinancialReport(payload: Record<string, unknown>): Promise<FinanceMutationResponse> {
  const { data } = await api.post<FinanceMutationResponse>(BASE, payload)
  return data
}

/** PUT /api/super-admin/financial-reports/{id} — Update */
export async function updateFinancialReport(id: number | string, payload: Record<string, unknown>): Promise<FinanceMutationResponse> {
  const { data } = await api.put<FinanceMutationResponse>(`${BASE}/${id}`, payload)
  return data
}

/** DELETE /api/super-admin/financial-reports/{id} — Delete */
export async function deleteFinancialReport(id: number | string): Promise<FinanceDeleteResponse> {
  const { data } = await api.delete<FinanceDeleteResponse>(`${BASE}/${id}`)
  return data
}

/** POST /api/super-admin/financial-reports/{id}/approve — Approve */
export async function approveFinancialReport(id: number | string): Promise<FinanceMutationResponse> {
  const { data } = await api.post<FinanceMutationResponse>(`${BASE}/${id}/approve`)
  return data
}

/** POST /api/super-admin/financial-reports/{id}/reject — Reject */
export async function rejectFinancialReport(id: number | string): Promise<FinanceMutationResponse> {
  const { data } = await api.post<FinanceMutationResponse>(`${BASE}/${id}/reject`)
  return data
}

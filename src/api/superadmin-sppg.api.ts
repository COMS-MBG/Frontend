import api from '@/api/axios'
import type {
  SppgItem,
  SppgListResponse,
  SppgDetailResponse,
  SppgMutationResponse,
  SppgDeleteResponse,
  SppgPartner,
  SppgPartnersResponse,
  SppgMenusResponse,
  CapacityOverviewResponse,
  SppgEmployee,
  SppgEmployeeListResponse,
  SppgEmployeeMutationResponse,
} from '@/types/superadmin-sppg'
import {
  mapSppgItem,
  mapSppgPartner,
  mapSppgEmployee,
} from '@/utils/mappers/sppg.mapper'

// Re-export types for backward compatibility during migration
export type {
  SppgItem,
  SppgListResponse,
  SppgDetailResponse,
  SppgMutationResponse,
  SppgDeleteResponse,
  SppgPartner,
  SppgPartnersResponse,
  SppgMenusResponse,
  CapacityOverviewResponse,
  SppgEmployee,
  SppgEmployeeListResponse,
  SppgEmployeeMutationResponse,
} from '@/types/superadmin-sppg'

// ── API ──────────────────────────────────────────────────────────────────────

const BASE = '/super-admin/sppg'

/** GET /api/super-admin/sppg — List with filters & pagination */
export async function getSppgs(params?: Record<string, string | number | undefined>): Promise<SppgListResponse> {
  const { data } = await api.get<SppgListResponse>(BASE, { params })
  return {
    ...data,
    data: (data.data || []).map(mapSppgItem),
  }
}

/** GET /api/super-admin/sppg/{id} — Detail SPPG + capacity */
export async function getSppg(id: number | string): Promise<SppgDetailResponse> {
  const { data } = await api.get<SppgDetailResponse>(`${BASE}/${id}`)
  return {
    ...data,
    data: mapSppgItem(data.data),
  }
}

/** POST /api/super-admin/sppg — Register SPPG directly */
export async function createSppg(payload: Record<string, unknown>): Promise<SppgMutationResponse> {
  const { data } = await api.post<SppgMutationResponse>(BASE, payload)
  return {
    ...data,
    data: mapSppgItem(data.data),
  }
}

/** PUT /api/super-admin/sppg/{id} — Update SPPG */
export async function updateSppg(id: number | string, payload: Record<string, unknown>): Promise<SppgMutationResponse> {
  const { data } = await api.put<SppgMutationResponse>(`${BASE}/${id}`, payload)
  return {
    ...data,
    data: mapSppgItem(data.data),
  }
}

/** DELETE /api/super-admin/sppg/{id} — Soft delete SPPG */
export async function deleteSppg(id: number | string): Promise<SppgDeleteResponse> {
  const { data } = await api.delete<SppgDeleteResponse>(`${BASE}/${id}`)
  return data
}

/** POST /api/super-admin/sppg/{id}/activate — Activate SPPG + its users */
export async function activateSppg(id: number | string): Promise<SppgDeleteResponse> {
  const { data } = await api.post<SppgDeleteResponse>(`${BASE}/${id}/activate`)
  return data
}

/** POST /api/super-admin/sppg/{id}/deactivate — Deactivate SPPG + its users */
export async function deactivateSppg(id: number | string): Promise<SppgDeleteResponse> {
  const { data } = await api.post<SppgDeleteResponse>(`${BASE}/${id}/deactivate`)
  return data
}

/** GET /api/super-admin/sppg/{id}/partners — List partners with distance */
export async function getSppgPartners(id: number | string): Promise<SppgPartnersResponse> {
  const { data } = await api.get<SppgPartnersResponse>(`${BASE}/${id}/partners`)
  return {
    ...data,
    data: (data.data || []).map(mapSppgPartner),
  }
}

/** GET /api/super-admin/sppg/{id}/menus — List menus */
export async function getSppgMenus(id: number | string): Promise<SppgMenusResponse> {
  const { data } = await api.get<SppgMenusResponse>(`${BASE}/${id}/menus`)
  return data
}

/** POST /api/super-admin/sppg/{sppgId}/assign-school — Attach school to SPPG */
export async function assignSchool(sppgId: number | string, schoolId: string): Promise<SppgDeleteResponse> {
  const { data } = await api.post<SppgDeleteResponse>(`${BASE}/${sppgId}/assign-school`, { school_id: schoolId })
  return data
}

/** DELETE /api/super-admin/sppg/{sppgId}/schools/{schoolId} — Detach school */
export async function detachSchool(sppgId: number | string, schoolId: string): Promise<SppgDeleteResponse> {
  const { data } = await api.delete<SppgDeleteResponse>(`${BASE}/${sppgId}/schools/${schoolId}`)
  return data
}

/** GET /api/super-admin/sppg/capacity-overview — Overcapacity SPPGs */
export async function getCapacityOverview(): Promise<CapacityOverviewResponse> {
  const { data } = await api.get<CapacityOverviewResponse>(`${BASE}/capacity-overview`)
  return {
    ...data,
    data: (data.data || []).map(mapSppgItem),
  }
}

// ── Employee CRUD (nested under SPPG) ────────────────────────────────────────

/** GET /api/super-admin/sppg/{sppgId}/employees */
export async function getEmployees(sppgId: number | string, params?: Record<string, string | number | undefined>): Promise<SppgEmployeeListResponse> {
  const { data } = await api.get<SppgEmployeeListResponse>(`${BASE}/${sppgId}/employees`, { params })
  return data
}

/** POST /api/super-admin/sppg/{sppgId}/employees */
export async function createEmployee(sppgId: number | string, payload: Record<string, unknown>): Promise<SppgEmployeeMutationResponse> {
  const { data } = await api.post<SppgEmployeeMutationResponse>(`${BASE}/${sppgId}/employees`, payload)
  return data
}

/** PUT /api/super-admin/sppg/{sppgId}/employees/{id} */
export async function updateEmployee(sppgId: number | string, id: number | string, payload: Record<string, unknown>): Promise<SppgEmployeeMutationResponse> {
  const { data } = await api.put<SppgEmployeeMutationResponse>(`${BASE}/${sppgId}/employees/${id}`, payload)
  return data
}

/** DELETE /api/super-admin/sppg/{sppgId}/employees/{id} */
export async function deleteEmployee(sppgId: number | string, id: number | string): Promise<SppgDeleteResponse> {
  const { data } = await api.delete<SppgDeleteResponse>(`${BASE}/${sppgId}/employees/${id}`)
  return data
}

import api from '@/api/axios'
import type {
  SchoolItem,
  SchoolListResponse,
  SchoolDetailResponse,
  SchoolMutationResponse,
  SchoolDeleteResponse,
  SchoolImportResponse,
} from '@/types/superadmin-school'
import {
  mapSchoolItem,
  mapPayloadToBackend,
} from '@/utils/mappers/school.mapper'

// Re-export types for backward compatibility during migration
export type {
  SchoolItem,
  SchoolListResponse,
  SchoolDetailResponse,
  SchoolMutationResponse,
  SchoolDeleteResponse,
  SchoolImportResponse,
} from '@/types/superadmin-school'

// ── API ──────────────────────────────────────────────────────────────────────

const BASE = '/super-admin/schools'

/** GET /api/super-admin/schools — List with filters & pagination */
export async function getSchools(params?: Record<string, string | number | undefined>): Promise<SchoolListResponse> {
  const { data } = await api.get<SchoolListResponse>(BASE, { params })
  return {
    ...data,
    data: (data.data || []).map(mapSchoolItem),
  }
}

/** GET /api/super-admin/schools/{id} — Detail */
export async function getSchool(id: string): Promise<SchoolDetailResponse> {
  const { data } = await api.get<SchoolDetailResponse>(`${BASE}/${id}`)
  return {
    ...data,
    data: mapSchoolItem(data.data),
  }
}

/** POST /api/super-admin/schools — Create */
export async function createSchool(payload: Record<string, unknown>): Promise<SchoolMutationResponse> {
  const backendPayload = mapPayloadToBackend(payload)
  const { data } = await api.post<SchoolMutationResponse>(BASE, backendPayload)
  return {
    ...data,
    data: mapSchoolItem(data.data),
  }
}

/** PUT /api/super-admin/schools/{id} — Update */
export async function updateSchool(id: string, payload: Record<string, unknown>): Promise<SchoolMutationResponse> {
  const backendPayload = mapPayloadToBackend(payload)
  const { data } = await api.put<SchoolMutationResponse>(`${BASE}/${id}`, backendPayload)
  return {
    ...data,
    data: mapSchoolItem(data.data),
  }
}

/** DELETE /api/super-admin/schools/{id} — Delete */
export async function deleteSchool(id: string): Promise<SchoolDeleteResponse> {
  const { data } = await api.delete<SchoolDeleteResponse>(`${BASE}/${id}`)
  return data
}

/** POST /api/super-admin/schools/import — Import CSV/XLSX */
export async function importSchools(file: File): Promise<SchoolImportResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post<SchoolImportResponse>(`${BASE}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60_000,
  })
  return data
}

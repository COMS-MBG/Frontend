import type { SchoolItem } from '@/types/superadmin-school'

/**
 * Maps raw backend school data to frontend SchoolItem type.
 */
export function mapSchoolItem(raw: unknown): SchoolItem {
  if (!raw || typeof raw !== 'object') {
    return {} as SchoolItem
  }
  const r = raw as Record<string, any>
  return {
    id: String(r.id),
    npsn: r.npsn || null,
    school_name: r.name || r.school_name || '',
    school_type: r.school_level || r.school_type || '',
    ownership_status: r.ownership_status || '',
    address: r.address || '',
    district: r.district || '',
    city: r.city || '',
    province: r.province || '',
    latitude: r.coordinates?.lat ?? Number(r.latitude) ?? 0,
    longitude: r.coordinates?.lng ?? Number(r.longitude) ?? 0,
    portion_count: Number(r.student_count ?? r.portion_count) ?? 0,
    data_source: r.data_source || '',
    sppg_id: r.sppg_id || null,
    sppg_name: r.sppg?.name || r.sppg_name || null,
    is_mapped: r.sppg_id !== null && r.sppg_id !== undefined,
    created_at: r.created_at || '',
    updated_at: r.updated_at || '',
  }
}

/**
 * Maps school payload to the structure expected by the backend.
 */
export function mapPayloadToBackend(payload: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...payload }
  if (payload.school_name !== undefined) {
    result.name = payload.school_name
    delete result.school_name
  }
  if (payload.school_type !== undefined) {
    result.school_level = payload.school_type
    delete result.school_type
  }
  if (payload.portion_count !== undefined) {
    result.student_count = payload.portion_count
    delete result.portion_count
  }
  return result
}

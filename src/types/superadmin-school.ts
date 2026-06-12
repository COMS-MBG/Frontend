// ── Super Admin School Types ────────────────────────────────────────────────

export interface SchoolItem {
  id: string
  npsn: string | null
  school_name: string
  school_type: string
  ownership_status: string
  address: string
  district: string
  city: string
  province: string
  latitude: number
  longitude: number
  portion_count: number
  data_source: string
  sppg_id: number | null
  sppg_name: string | null
  is_mapped: boolean
  created_at: string
  updated_at: string
}

export interface SchoolListResponse {
  success: boolean
  data: SchoolItem[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

export interface SchoolDetailResponse {
  success: boolean
  data: SchoolItem
}

export interface SchoolMutationResponse {
  success: boolean
  message: string
  data: SchoolItem
}

export interface SchoolDeleteResponse {
  success: boolean
  message: string
}

export interface SchoolImportResponse {
  success: boolean
  message: string
  imported_count: number
  errors: { row: number; message: string }[]
}

// ── Typed Payloads (TYPE-02) ────────────────────────────────────────────────

export interface SchoolCreatePayload {
  school_name: string
  npsn?: string | null
  school_type: string
  ownership_status: string
  address: string
  district: string
  city: string
  province: string
  latitude: number
  longitude: number
  portion_count: number
  data_source?: string
}

export interface SchoolUpdatePayload extends Partial<SchoolCreatePayload> {
  sppg_id?: number | null
}

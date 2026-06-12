// ── Partner Types ──────────────────────────────────────────

export type PartnerBentuk = 'SD' | 'SMP' | 'SMA' | 'SMK' | 'MI' | 'MTs' | 'MA' | 'MAK'
export type PartnerStatus = 'public' | 'private'

export interface Partner {
  id: string
  school_name: string
  npsn: string | null
  school_type: PartnerBentuk
  ownership_status: PartnerStatus
  address: string | null
  district: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  portion_count: number
  sppg_id?: string | null
  created_at?: string
  updated_at?: string
}

export interface PartnerSummary {
  total_schools: number
  total_public: number
  total_private: number
  total_sma: number
  total_smk: number
  total_portion_count: number
}

export interface PartnerListMeta {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

export interface PartnerListResponse {
  success: boolean
  data: Partner[]
  meta: PartnerListMeta
}

export interface PartnerSummaryResponse {
  success: boolean
  data: PartnerSummary
}

export interface PartnerDetailResponse {
  success: boolean
  data: Partner
}

export interface PartnerMutationResponse {
  success: boolean
  message: string
  data: Partner
}

export interface PartnerDeleteResponse {
  success: boolean
  message: string
}

export interface PartnerImportResult {
  created: number
  updated: number
  skipped: number
  errors: string[]
  total: number
}

export interface PartnerImportResponse {
  success: boolean
  message: string
  data: PartnerImportResult
}

/** Payload for CSV import preview row */
export interface PartnerImportRow {
  school_name: string
  npsn: string
  school_type: string
  ownership_status: string
  address: string
  district: string
  city: string
  latitude: string
  longitude: string
  portion_count: number
}

// ── Partner Types ──────────────────────────────────────────

export type PartnerBentuk = 'SD' | 'SMP' | 'SMA' | 'SMK' | 'MI' | 'MTs' | 'MA' | 'MAK'
export type PartnerStatus = 'Negeri' | 'Swasta'

export interface Partner {
  id: string
  nama_sekolah: string
  npsn: string | null
  bentuk: PartnerBentuk
  status: PartnerStatus
  alamat: string | null
  kecamatan: string | null
  kabupaten_kota: string | null
  latitude: number | null
  longitude: number | null
  jumlah_porsi: number
  sppg_id?: string | null
  created_at?: string
  updated_at?: string
}

export interface PartnerSummary {
  total_schools: number
  total_negeri: number
  total_swasta: number
  total_sma: number
  total_smk: number
  total_porsi: number
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
  nama_sekolah: string
  npsn: string
  bentuk: string
  status: string
  alamat: string
  kecamatan: string
  kabupaten_kota: string
  latitude: string
  longitude: string
  jumlah_porsi: number
}

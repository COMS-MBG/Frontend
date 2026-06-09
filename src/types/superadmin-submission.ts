// ── Super Admin Submission Types ────────────────────────────────────────────

export interface DraftPartner {
  id?: number
  school_name: string
  npsn: string | null
  level: string
  school_status: string
  address: string
  city: string
  district: string
  latitude: number | null
  longitude: number | null
  jumlah_porsi: number
  data_source?: string
}

export interface SppgDraft {
  id: number
  submission_number: string
  submitted_by: number
  source: string
  form1_data: Record<string, unknown> | null
  form2_data: Record<string, unknown> | null
  form3_data: Record<string, unknown> | null
  latitude: number | null
  longitude: number | null
  confirmed_latitude: number | null
  confirmed_longitude: number | null
  point_status: 'green' | 'yellow' | 'red' | null
  map_confirmed: boolean
  status: 'draft' | 'registered'
  submitted_at: string | null
  created_at: string
  updated_at: string
  partners: DraftPartner[]
}

export interface SubmissionListResponse {
  success: boolean
  data: SppgDraft[]
}

export interface SubmissionDetailResponse {
  success: boolean
  data: SppgDraft
}

export interface SubmissionMutationResponse {
  success: boolean
  message: string
  data: SppgDraft
}

export interface SubmissionDeleteResponse {
  success: boolean
  message: string
}

export interface SubmissionSubmitResponse {
  success: boolean
  message: string
  data: unknown
}

// ── Super Admin SPPG Types ──────────────────────────────────────────────────

export interface SppgItem {
  id: number
  name: string
  address: string
  region?: {
    district?: string
    city?: string
    province?: string
  }
  city?: string
  province?: string
  latitude: number
  longitude: number
  capacity: number
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
  total_partners?: number
  total_portions?: number
  phone?: string | null
  email?: string | null
  owner?: { id: number; name: string } | null
}

export interface SppgListResponse {
  success: boolean
  data: SppgItem[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
  stats: Record<string, number>
}

export interface SppgDetailResponse {
  success: boolean
  data: SppgItem
  capacity: {
    current: number
    max: number
    available: number
    percentage: number
    is_full: boolean
    is_critical: boolean
  }
}

export interface SppgMutationResponse {
  success: boolean
  message: string
  data: SppgItem
}

export interface SppgDeleteResponse {
  success: boolean
  message: string
}

export interface SppgPartner {
  id: string | number
  school_name: string
  npsn: string | null
  school_type: string
  ownership_status: string
  address: string
  district: string
  city: string
  latitude: number
  longitude: number
  portion_count: number
  distance_km: number
  estimated_minutes: number | null
  distance_status: 'safe' | 'review'
}

export interface SppgPartnersResponse {
  success: boolean
  data: SppgPartner[]
}

export interface SppgMenusResponse {
  success: boolean
  data: unknown[]
}

export interface CapacityOverviewResponse {
  success: boolean
  data: SppgItem[]
  total: number
}

export interface SppgEmployee {
  id: number
  name: string
  email: string
  phone: string | null
  position: string
  is_active: boolean
}

export interface SppgEmployeeListResponse {
  success: boolean
  data: SppgEmployee[]
  meta: { current_page: number; last_page: number; total: number }
}

export interface SppgEmployeeMutationResponse {
  success: boolean
  message: string
  data: SppgEmployee
}

// ── Typed Payloads (TYPE-02) ────────────────────────────────────────────────

export interface SppgCreatePayload {
  name: string
  address: string
  latitude: number
  longitude: number
  capacity: number
  phone?: string | null
  email?: string | null
}

export interface SppgUpdatePayload extends Partial<SppgCreatePayload> {
  status?: 'active' | 'inactive' | 'pending'
}

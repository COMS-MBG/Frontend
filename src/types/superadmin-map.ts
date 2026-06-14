// ── Super Admin Map Types ───────────────────────────────────────────────────

// ── Existing Layer Types ────────────────────────────────────────────────────

export interface SppgLayerPartner {
  id: number
  school_name: string
  latitude: number
  longitude: number
  portion_count: number
}

export interface SppgLayer {
  id: number
  name: string
  latitude: number
  longitude: number
  status: string
  capacity: number
  partners: SppgLayerPartner[]
}

export interface SubmissionLayerPartner {
  id: number
  school_name: string
  latitude: number | null
  longitude: number | null
  jumlah_porsi: number
  data_source: string
}

export interface SubmissionLayer {
  id: string
  submission_number: string
  latitude: number
  longitude: number
  confirmed_latitude: number | null
  confirmed_longitude: number | null
  point_status: string
  map_confirmed: boolean
  status: string
  source?: string          // 'internal' | 'public' | 'external'
  needs_geocode?: boolean  // true jika koordinat diambil dari form1_data (geocoding belum tersimpan di kolom utama)
  partners: SubmissionLayerPartner[]
}

export interface KMeansRecommendationSchool {
  id: number
  name: string
  latitude: number
  longitude: number
  distance_km: number
  duration_min: number
}

export interface KMeansRecommendation {
  latitude: number
  longitude: number
  school_count: number
  schools: KMeansRecommendationSchool[]
}

export interface GeoValidationResult {
  sppg_id: number
  sppg_name: string
  partners: {
    school_id: string
    school_name: string
    distance_km: number
    status: 'safe' | 'review'
  }[]
}

export interface SchoolLayerItem {
  id: number
  school_name: string
  npsn: string | null
  school_type: string
  ownership_status: string
  district: string | null
  city: string
  latitude: number
  longitude: number
  portion_count: number
  sppg_id: number | null
  sppg_name: string | null
  status: 'served' | 'unserved' | 'takeover_candidate'
  road_distance_km: number | null
}

export interface MapDataResponse {
  success: boolean
  sppg_layers: SppgLayer[]
  submission_layers: SubmissionLayer[]
  recommendations: KMeansRecommendation[]
  schools: SchoolLayerItem[]
}

// ── New Spatial Endpoint Types ──────────────────────────────────────────────

/** Nominatim geocode result item */
export interface GeocodeResult {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  boundingbox: string[]
}

/** POST /map/validate-point response body */
export interface PointValidationResponse {
  status: 'green' | 'yellow' | 'red'
  conflicts: string[]
}

/** POST /map/suggest-shift response body (null when shift < 0.5 km) */
export interface SuggestShiftResponse {
  latitude: number
  longitude: number
  distance_meters: number
}

/** POST /map/confirm-point/{id} response body */
export interface ConfirmPointResponse {
  success: boolean
  message: string
  point_status: 'green' | 'yellow' | 'red'
  conflicts: string[]
  address_updated?: boolean
  address_data?: {
    address: string | null
    district: string | null
    city: string | null
    province: string | null
    raw: string | null
  } | null
  partners_added?: number
  partners_added_names?: string[]
  partners_out_of_range?: {
    id: number
    school_name: string
    distance_km: number
    duration_min: number
  }[]
  out_of_range_warning?: string | null
  data: SubmissionLayer & { partners: SubmissionLayerPartner[] }
}

// ── Request Param Types ─────────────────────────────────────────────────────

export interface ValidatePointParams {
  latitude: number
  longitude: number
  draft_id?: string
  partners?: Record<string, unknown>[]
}

export interface SuggestShiftParams {
  latitude: number
  longitude: number
  draft_id?: string
  partners?: Record<string, unknown>[]
}

export interface ConfirmPointParams {
  latitude: number
  longitude: number
  capacity?: number
}

import api from '@/api/axios'
import type {
  SppgLayer,
  SppgLayerPartner,
  SubmissionLayer,
  SubmissionLayerPartner,
  KMeansRecommendation,
  KMeansRecommendationSchool,
  GeoValidationResult,
  SchoolLayerItem,
  MapDataResponse,
  GeocodeResult,
  PointValidationResponse,
  SuggestShiftResponse,
  ConfirmPointResponse,
  ValidatePointParams,
  SuggestShiftParams,
  ConfirmPointParams,
} from '@/types/superadmin-map'

// Re-export types for backward compatibility during migration
export type {
  SppgLayer,
  SppgLayerPartner,
  SubmissionLayer,
  SubmissionLayerPartner,
  KMeansRecommendation,
  KMeansRecommendationSchool,
  GeoValidationResult,
  SchoolLayerItem,
  MapDataResponse,
  GeocodeResult,
  PointValidationResponse,
  SuggestShiftResponse,
  ConfirmPointResponse,
  ValidatePointParams,
  SuggestShiftParams,
  ConfirmPointParams,
} from '@/types/superadmin-map'

// ── API Functions ────────────────────────────────────────────────────────────

const BASE = '/super-admin/map'

/** GET /api/super-admin/map/data — All GIS layers in one single call */
export async function getMapData(): Promise<MapDataResponse> {
  const { data } = await api.get<MapDataResponse>(`${BASE}/data`, {
    timeout: 120_000 // 120 seconds for heavy GIS calculations
  })
  return data
}

/** POST /api/super-admin/map/geocode — Search address via Nominatim */
export async function geocode(query: string): Promise<GeocodeResult[]> {
  const { data } = await api.post<{ success: boolean; data: GeocodeResult[] }>(
    `${BASE}/geocode`,
    { query }
  )
  return data.data ?? []
}

/** POST /api/super-admin/map/validate-point — Validate coordinates against active SPPGs */
export async function validatePoint(params: ValidatePointParams): Promise<PointValidationResponse> {
  const { data } = await api.post<{ success: boolean; data: PointValidationResponse }>(
    `${BASE}/validate-point`,
    params
  )
  return data.data
}

/** POST /api/super-admin/map/suggest-shift — Get optimal centroid shift suggestion */
export async function suggestShift(params: SuggestShiftParams): Promise<SuggestShiftResponse | null> {
  const { data } = await api.post<{ success: boolean; data: SuggestShiftResponse | null }>(
    `${BASE}/suggest-shift`,
    params
  )
  return data.data ?? null
}

/** POST /api/super-admin/map/confirm-point/{submissionId} — Lock coordinates + auto-recommend partners */
export async function confirmPoint(submissionId: string, params: ConfirmPointParams): Promise<ConfirmPointResponse> {
  const { data } = await api.post<ConfirmPointResponse>(
    `${BASE}/confirm-point/${submissionId}`,
    params
  )
  return data
}

import * as mapApi from '@/api/superadmin-map.api'
import { ref } from 'vue'
import type {
  SppgLayer,
  SubmissionLayer,
  KMeansRecommendation,
  SchoolLayerItem,
  GeocodeResult,
  PointValidationResponse,
  SuggestShiftResponse,
  ConfirmPointResponse,
} from '@/types/superadmin-map'

/**
 * Composable for the Super Admin Map / Recommendation Spatial view.
 * Fetches all map layers (SPPG, submissions, KMeans recommendations, schools) in a single call.
 * Provides interactive GIS actions: geocoding, point validation, centroid shift, and confirmation.
 */
export function useSuperAdminMap() {
  // ── Layer data ────────────────────────────────────────────────────────────
  const sppgLayers       = ref<SppgLayer[]>([])
  const submissionLayers = ref<SubmissionLayer[]>([])
  const recommendations  = ref<KMeansRecommendation[]>([])
  const schools          = ref<SchoolLayerItem[]>([])
  const isLoading        = ref(false)
  const error            = ref<string | null>(null)

  // ── Interactive GIS state ─────────────────────────────────────────────────
  const isProcessingAction = ref(false)
  const geocodeResults     = ref<GeocodeResult[]>([])
  const validationResult   = ref<PointValidationResponse | null>(null)
  const suggestedShift     = ref<SuggestShiftResponse | null>(null)

  /** Fetch all GIS layers for map display */
  async function fetchMapData(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await mapApi.getMapData()
      sppgLayers.value       = res.sppg_layers || []
      submissionLayers.value = res.submission_layers || []
      recommendations.value  = res.recommendations || []
      schools.value          = res.schools || []
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data peta.'
    } finally {
      isLoading.value = false
    }
  }

  /** Search an address via Nominatim geocoding (through backend proxy) */
  async function searchAddress(query: string): Promise<void> {
    if (!query.trim()) {
      geocodeResults.value = []
      return
    }
    isProcessingAction.value = true
    try {
      geocodeResults.value = await mapApi.geocode(query)
    } catch (err: unknown) {
      geocodeResults.value = []
      error.value = err instanceof Error ? err.message : 'Gagal melakukan geocoding.'
    } finally {
      isProcessingAction.value = false
    }
  }

  /** Validate a coordinate against active SPPGs and takeover rules */
  async function runValidation(lat: number, lng: number, draftId?: string): Promise<void> {
    isProcessingAction.value = true
    validationResult.value = null
    try {
      validationResult.value = await mapApi.validatePoint({
        latitude: lat,
        longitude: lng,
        draft_id: draftId,
      })
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memvalidasi titik.'
    } finally {
      isProcessingAction.value = false
    }
  }

  /** Get centroid shift suggestion for optimal position */
  async function runSuggestShift(lat: number, lng: number, draftId?: string): Promise<void> {
    isProcessingAction.value = true
    suggestedShift.value = null
    try {
      suggestedShift.value = await mapApi.suggestShift({
        latitude: lat,
        longitude: lng,
        draft_id: draftId,
      })
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal mendapatkan saran geser titik.'
    } finally {
      isProcessingAction.value = false
    }
  }

  /** Confirm draft coordinates and auto-assign recommended partner schools */
  async function submitConfirmPoint(
    draftId: string,
    lat: number,
    lng: number,
    capacity?: number
  ): Promise<ConfirmPointResponse | null> {
    isProcessingAction.value = true
    error.value = null
    try {
      const result = await mapApi.confirmPoint(draftId, {
        latitude: lat,
        longitude: lng,
        capacity,
      })
      if (result.success) {
        // Refresh map data to reflect changes
        await fetchMapData()
        return result
      }
      error.value = result.message || 'Gagal mengonfirmasi titik.'
      return null
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = e.response?.data?.message || e.message || 'Gagal mengonfirmasi titik.'
      return null
    } finally {
      isProcessingAction.value = false
    }
  }

  /** Clear interactive states (useful when deselecting a draft) */
  function clearInteractiveState(): void {
    geocodeResults.value = []
    validationResult.value = null
    suggestedShift.value = null
  }

  return {
    // Layer data
    sppgLayers,
    submissionLayers,
    recommendations,
    schools,
    isLoading,
    error,

    // Interactive GIS state
    isProcessingAction,
    geocodeResults,
    validationResult,
    suggestedShift,

    // Actions
    fetchMapData,
    searchAddress,
    runValidation,
    runSuggestShift,
    submitConfirmPoint,
    clearInteractiveState,
  }
}

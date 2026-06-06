/**
 * routing.api.ts — Pure HTTP communication layer for OSRM routing.
 *
 * Responsibility: endpoint mapping + raw request/response only.
 * NO business logic. NO data transformation. NO reactive state.
 */

const OSRM_BASE = 'https://router.project-osrm.org'

/** Raw OSRM API response shape (subset we care about) */
export interface OsrmRawResponse {
  code: string
  message?: string
  routes: Array<{
    geometry: {
      coordinates: Array<[number, number]> // [lng, lat] from OSRM
    }
    distance: number // meters
    duration: number // seconds
  }>
}

/**
 * Fetches a raw driving route from the OSRM public API.
 *
 * Coordinates use OSRM convention: longitude first, latitude second.
 * Returns the raw JSON response — transformation is handled by the utils layer.
 */
export async function getOsrmRoute(
  startLng: number,
  startLat: number,
  endLng: number,
  endLat: number
): Promise<OsrmRawResponse> {
  const url = `${OSRM_BASE}/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`OSRM API error: Status ${response.status}`)
  }

  return response.json()
}

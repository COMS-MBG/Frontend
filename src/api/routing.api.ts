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

/**
 * Fetches a multi-waypoint road-snapped route from OSRM.
 * Used after route optimization to get the actual road geometry
 * for the ordered waypoints returned by the backend optimizer.
 *
 * @param waypoints Array of {lat, lng} in visit order (origin first)
 * @returns Array of [lat, lng] Leaflet-compatible coordinates following actual roads
 */
export async function getOsrmRouteMulti(
  waypoints: Array<{ lat: number; lng: number }>
): Promise<[number, number][]> {
  if (waypoints.length < 2) return []

  // Build coordinate string: lng,lat;lng,lat;... (OSRM convention)
  const coordStr = waypoints.map(p => `${p.lng},${p.lat}`).join(';')
  const url = `${OSRM_BASE}/route/v1/driving/${coordStr}?overview=full&geometries=geojson`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`OSRM status ${response.status}`)

    const data: OsrmRawResponse = await response.json()
    const route = data.routes?.[0]
    if (!route) throw new Error('No route returned from OSRM')

    // OSRM returns [lng, lat] — convert to Leaflet's [lat, lng]
    return route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
  } catch (err) {
    console.warn('[OSRM Multi] Fallback to straight lines:', err)
    // Fallback: straight-line connections between waypoints
    return waypoints.map(p => [p.lat, p.lng])
  }
}

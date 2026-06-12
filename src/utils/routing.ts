/**
 * routing.ts — Pure stateless utilities for OSRM route data.
 *
 * Responsibility: coordinate transformation, cache key generation.
 * NO API calls. NO reactive state. NO side effects.
 */

import type { OsrmRouteResult, RouteCacheKey } from '@/types/routing'
import type { OsrmRawResponse } from '@/api/routing.api'

/**
 * Generates a unique cache key for a pair of coordinates.
 * Format: "lng1,lat1;lng2,lat2" — deterministic for the same input.
 */
export function buildCacheKey(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): RouteCacheKey {
  return `${startLng.toFixed(6)},${startLat.toFixed(6)};${endLng.toFixed(6)},${endLat.toFixed(6)}`
}

/**
 * Transforms a raw OSRM API response into Leaflet-compatible route data.
 *
 * - Validates the response structure
 * - Converts OSRM GeoJSON [lng, lat] → Leaflet [lat, lng]
 * - Converts distance (m → km) and duration (s → min)
 */
export function transformOsrmResponse(data: OsrmRawResponse): OsrmRouteResult {
  if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
    throw new Error(`OSRM routing failed: ${data.message || 'No route found'}`)
  }

  const route = data.routes[0]
  if (!route || !route.geometry || !route.geometry.coordinates) {
    throw new Error('OSRM route contains no geometry coordinates')
  }

  // Convert OSRM GeoJSON [lng, lat] to Leaflet [lat, lng]
  const coordinates: Array<[number, number]> = route.geometry.coordinates.map(
    (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
  )

  return {
    coordinates,
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60
  }
}

/** OSRM route result for a single origin→destination pair */
export interface OsrmRouteResult {
  coordinates: Array<[number, number]> // [lat, lng] pairs for Leaflet polylines
  distanceKm: number
  durationMin: number
}

/** Cache key generator */
export type RouteCacheKey = string // Format: "lng1,lat1;lng2,lat2"

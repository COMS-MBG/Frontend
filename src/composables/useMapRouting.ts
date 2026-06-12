import { ref, onUnmounted } from 'vue'
import { getOsrmRoute } from '@/api/routing.api'
import { buildCacheKey, transformOsrmResponse } from '@/utils/routing'
import type { OsrmRouteResult, RouteCacheKey } from '@/types/routing'

/**
 * Composable for OSRM road route fetching and caching.
 */
export function useMapRouting() {
  const isRouteFetching = ref(false)
  const osrmCache = new Map<RouteCacheKey, OsrmRouteResult>()

  /**
   * Fetches a road route between two points, checking cache first.
   */
  async function fetchRoadRoute(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ): Promise<OsrmRouteResult | null> {
    const key = buildCacheKey(fromLat, fromLng, toLat, toLng)
    if (osrmCache.has(key)) {
      return osrmCache.get(key)!
    }

    try {
      const raw = await getOsrmRoute(fromLng, fromLat, toLng, toLat)
      const result = transformOsrmResponse(raw)
      osrmCache.set(key, result)
      return result
    } catch (err) {
      console.error('OSRM route fetch failed:', err)
      return null
    }
  }

  // Clean up cache on unmount to prevent memory leaks (PERF-02)
  onUnmounted(() => {
    osrmCache.clear()
  })

  return {
    isRouteFetching,
    fetchRoadRoute,
    clearRouteCache: () => osrmCache.clear(),
  }
}

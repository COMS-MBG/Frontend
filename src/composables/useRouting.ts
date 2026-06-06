import { ref } from 'vue'
import type { DistributionItem } from '@/types/distribution'
import type { OsrmRouteResult, RouteCacheKey } from '@/types/routing'
import { getOsrmRoute } from '@/api/routing.api'
import { buildCacheKey, transformOsrmResponse } from '@/utils/routing'

// Global cache (persists across component mounts)
const routeCache = new Map<RouteCacheKey, OsrmRouteResult>()

// Concurrency rate limiter
async function limitConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = []
  const executing: Promise<void>[] = []

  for (const [index, task] of tasks.entries()) {
    const p = task().then(
      value => ({ status: 'fulfilled' as const, value }),
      reason => ({ status: 'rejected' as const, reason })
    )
    results.push(null as any) // placeholder

    const e: Promise<void> = p.then((res) => {
      results[index] = res
      executing.splice(executing.indexOf(e), 1)
    })
    executing.push(e)

    if (executing.length >= limit) {
      await Promise.race(executing)
    }
  }

  await Promise.all(executing)
  return results
}

export function useRouting() {
  const isRoutingLoading = ref(false)
  const routingWarning = ref<string | null>(null)
  const hasFallbackRoutes = ref(false)
  
  // Maps itemId -> Route Result for active view items
  const itemRoutes = ref<Record<number, OsrmRouteResult>>({})

  async function fetchRoutesForItems(
    center: [number, number],
    items: DistributionItem[]
  ): Promise<void> {
    if (items.length === 0) {
      itemRoutes.value = {}
      routingWarning.value = null
      hasFallbackRoutes.value = false
      return
    }

    isRoutingLoading.value = true
    routingWarning.value = null
    hasFallbackRoutes.value = false

    const tasks: (() => Promise<{ itemId: number; key: RouteCacheKey; route: OsrmRouteResult }>)[] = []

    items.forEach((item) => {
      if (!item.lat || !item.lng) return

      const key = buildCacheKey(center[0], center[1], item.lat, item.lng)

      if (routeCache.has(key)) {
        itemRoutes.value[item.id] = routeCache.get(key)!
      } else {
        tasks.push(async () => {
          const rawResponse = await getOsrmRoute(center[1], center[0], item.lng, item.lat)
          const route = transformOsrmResponse(rawResponse)
          return { itemId: item.id, key, route }
        })
      }
    })

    if (tasks.length > 0) {
      try {
        // Limit concurrency to 5 concurrent requests to avoid rate limits
        const results = await limitConcurrency(tasks, 5)

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const { itemId, key, route } = result.value
            routeCache.set(key, route)
            itemRoutes.value[itemId] = route
          }
        })
      } catch (error) {
        console.error('Error fetching routes:', error)
      }
    }

    // Check if any active items are missing routes (either failed to fetch or skipped)
    let missingCount = 0
    items.forEach((item) => {
      if (!item.lat || !item.lng) return
      if (!itemRoutes.value[item.id]) {
        missingCount++
      }
    })

    if (missingCount > 0) {
      hasFallbackRoutes.value = true
      routingWarning.value = `Gagal memuat rute jalan untuk ${missingCount} sekolah. Menggunakan rute garis lurus.`
    } else {
      hasFallbackRoutes.value = false
      routingWarning.value = null
    }

    isRoutingLoading.value = false
  }

  function getRouteForItem(itemId: number): OsrmRouteResult | null {
    return itemRoutes.value[itemId] || null
  }

  function clearCache(): void {
    routeCache.clear()
    itemRoutes.value = {}
  }

  return {
    isRoutingLoading,
    routingWarning,
    hasFallbackRoutes,
    fetchRoutesForItems,
    getRouteForItem,
    clearCache
  }
}

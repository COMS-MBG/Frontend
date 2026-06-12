import { ref, onUnmounted } from 'vue'
import { getEcho } from '@/utils/echo'
import { useDistributionStore } from '@/stores/distribution.store'
import type { ScheduleStatus } from '@/types/distribution'

/**
 * useDistributionWebSocket — manages real-time WebSocket subscriptions.
 *
 * Channels:
 *  - presence-distribution.map        → courier GPS pings
 *  - presence-distribution.operations → delivery status changes
 *
 * Automatically disconnects when the consuming component unmounts.
 */
export function useDistributionWebSocket() {
  const store = useDistributionStore()
  const isConnected = ref(false)

  function connect(): void {
    if (isConnected.value) return

    try {
      const echo = getEcho()

      // ── Channel 1: Live courier GPS updates ──────────────
      echo
        .join('distribution.map')
        .listen('.distribution.courier.location', (payload: {
          schedule_id: number
          courier_id: number
          latitude: number
          longitude: number
          speed_kmh: number | null
          heading_degrees: number | null
          recorded_at: string
        }) => {
          const schedule = store.schedules.find(s => s.id === payload.schedule_id)
          if (schedule) {
            schedule.latest_location = {
              latitude: payload.latitude,
              longitude: payload.longitude,
              recorded_at: payload.recorded_at,
            }
          }
        })

      // ── Channel 2: Delivery status transitions ───────────
      echo
        .join('distribution.operations')
        .listen('.distribution.status.updated', (payload: {
          schedule_id: number
          status: ScheduleStatus
          courier_id: number
          school_id: number
          departed_at: string | null
          arrived_at: string | null
          confirmed_at: string | null
        }) => {
          // Optimistic local update — patch status in-place
          const schedule = store.schedules.find(s => s.id === payload.schedule_id)
          if (schedule) {
            schedule.status = payload.status
            if (payload.departed_at) schedule.departed_at = payload.departed_at
            if (payload.arrived_at) schedule.arrived_at = payload.arrived_at
          }
        })

      isConnected.value = true
    } catch {
      console.warn('[Distribution] WebSocket connection failed — falling back to HTTP polling.')
    }
  }

  function disconnect(): void {
    if (!isConnected.value) return

    try {
      const echo = getEcho()
      echo.leave('distribution.map')
      echo.leave('distribution.operations')
    } catch {
      // Ignore — already disconnected
    }

    isConnected.value = false
  }

  // Auto-cleanup when consuming component unmounts
  onUnmounted(() => disconnect())

  return {
    isConnected,
    connect,
    disconnect,
  }
}

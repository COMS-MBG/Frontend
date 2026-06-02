import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import type { ChannelAuthorizationCallback } from 'pusher-js'
import api, { BASE_URL } from '@/api/axios'

  // ── Expose Pusher globally (required by Laravel Echo internals) ──────────────
  ; (window as unknown as Record<string, unknown>).Pusher = Pusher

// ── Singleton Echo Instance ──────────────────────────────────────────────────

let echoInstance: Echo<'reverb'> | null = null

/**
 * Get or create the Laravel Echo instance.
 *
 * Uses `pusher-js` under the hood but points at our Laravel Reverb server.
 * Channel auth requests are routed through our existing Axios instance so that
 * Sanctum session cookies and CSRF tokens are sent automatically.
 */
export function getEcho(): Echo<'reverb'> {
  if (echoInstance) return echoInstance

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT),
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,

    // Custom authorizer — uses our Axios instance for Sanctum cookie auth
    authorizer: (channel: { name: string }) => ({
      authorize: (socketId: string, callback: ChannelAuthorizationCallback) => {
        api
          .post(`${BASE_URL}/broadcasting/auth`, {
            socket_id: socketId,
            channel_name: channel.name,
          })
          .then((response) => {
            callback(null, response.data)
          })
          .catch((err: unknown) => {
            callback(err instanceof Error ? err : new Error(String(err)), null)
          })
      },
    }),
  })

  return echoInstance
}

/**
 * Disconnect and dispose the Echo instance.
 * Call this when the user logs out or the component using real-time
 * features unmounts.
 */
export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
  }
}

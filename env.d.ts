/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// ── Vue Router Meta Type Augmentation ──────────────────────────────────────────
import type { RoleName } from '@/types/auth'

declare module 'vue-router' {
  interface RouteMeta {
    /** Route requires authenticated user */
    requiresAuth?: boolean
    /** Route is only for guests (unauthenticated users) */
    guestOnly?: boolean
    /** Roles allowed to access this route (checked by route guard) */
    roles?: RoleName[]
    /** Active sidebar menu item override */
    activeMenu?: string
  }
}

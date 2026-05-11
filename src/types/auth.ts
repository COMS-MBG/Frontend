// ── Role Names ─────────────────────────────────────────────────────────────────

export type RoleName =
  | 'super_admin'
  | 'pemilik'
  | 'manajer'
  | 'ahli_gizi'
  | 'admin_logistik'
  | 'kurir'
  | 'karyawan_operasional'

// ── Permission ─────────────────────────────────────────────────────────────────

export interface Permission {
  id: number
  name: string
}

// ── Role ───────────────────────────────────────────────────────────────────────

export interface Role {
  id: number
  name: RoleName
  permissions: Permission[]
}

// ── User ───────────────────────────────────────────────────────────────────────

/** Full user profile returned by the API */
export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  profile_picture: string | null
  is_active: boolean
  sppg_id: number | null
  email_verified_at: string | null
  created_at: string
  updated_at: string
  roles: Role[]
}

// ── Auth Request Payloads ──────────────────────────────────────────────────────

/** Payload sent on login */
export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

// ── Auth Response Shapes ───────────────────────────────────────────────────────
// Cookie-based auth: NO token in responses. Session cookie is httpOnly.

/** Successful login response */
export interface LoginResponse {
  success: true
  message: string
  user: User
}

/** Failed login response (invalid credentials) */
export interface LoginErrorResponse {
  success: false
  message: string
}

/** Successful logout response */
export interface LogoutResponse {
  success: true
  message: string
}

/** Authenticated user response */
export interface UserResponse {
  success: true
  user: User
}

/** Laravel validation error response (422) */
export interface ValidationErrorResponse {
  message: string
  errors: Record<string, string[]>
}

// ── Auth State ─────────────────────────────────────────────────────────────────

/** Shape of the Pinia auth store state */
export interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

// ── Backward Compatibility Aliases ─────────────────────────────────────────────

/** @deprecated Use LoginRequest instead */
export type LoginPayload = LoginRequest

/** @deprecated Use UserResponse instead */
export type ProfileResponse = UserResponse

// ── Role Names ─────────────────────────────────────────────────────────────────

export type RoleName =
  | 'super_admin'
  | 'pemilik'
  | 'manajer'
  | 'ahli-gizi'
  | 'admin-logistik'
  | 'kurir'
  | 'admin-sppg'
  | 'karyawan_operasional'

// ── SPPG ───────────────────────────────────────────────────────────────────────

export interface UserSppg {
  id: number
  name: string
  status: string
}

// ── User ───────────────────────────────────────────────────────────────────────

/**
 * User profile as returned by AuthUserResource.
 *
 * RBAC shape (flat — NOT Spatie):
 *  - role_type : 'super_admin' | 'sppg_user'
 *  - role_name : display label from employee.role.name
 *  - permissions: flat string[] slugs  e.g. ["partner.read", "employee.create"]
 */
export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  profile_picture: string | null
  is_active: boolean
  role_type: string
  role_name: string
  sppg: UserSppg | null
  permissions: string[]
}

// ── Auth Request Payloads ──────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

// ── Auth Response Shapes ───────────────────────────────────────────────────────

export interface LoginResponse {
  success: true
  message: string
  user: User
}

export interface LoginErrorResponse {
  success: false
  message: string
}

export interface LogoutResponse {
  success: true
  message: string
}

export interface UserResponse {
  success: true
  user: User
}

export interface ValidationErrorResponse {
  message: string
  errors: Record<string, string[]>
}

// ── Auth State ─────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

// ── Backward Compatibility ─────────────────────────────────────────────────────

/** @deprecated Use LoginRequest instead */
export type LoginPayload = LoginRequest

/** @deprecated Use UserResponse instead */
export type ProfileResponse = UserResponse

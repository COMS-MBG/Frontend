// ── Employee Types ──────────────────────────────────────────

/** Employee status values as stored in the backend database. */
export type EmployeeStatus = 'active' | 'inactive'

/** Position/jabatan struktural karyawan (matches Employee::POSITIONS). */
export type EmployeePosition =
  | 'pemilik'
  | 'manajer'
  | 'ahli_gizi'
  | 'admin_logistik'
  | 'kurir'
  | 'karyawan_operasional'

/** Nested role object returned when role relation is loaded. */
export interface EmployeeRole {
  id: number | null
  name: string
  slug: string | null
}

/** Nested user object returned when user relation is loaded. */
export interface EmployeeUser {
  id: number
  name: string
  email: string
}

/**
 * Full employee data shape returned by GET /api/admin-sppg/employees.
 * Matches EmployeeResource.php exactly.
 */
export interface Employee {
  id: number
  name: string
  nik: string | null
  position: EmployeePosition
  phone: string | null
  address: string | null
  joined_at: string | null
  status: EmployeeStatus
  photo: string | null
  sppg_id: number | null
  has_account: boolean
  user: EmployeeUser | null
  role: EmployeeRole
  base_salary: number | null
  created_at: string | null
  updated_at: string | null
}

/**
 * Payload shape for creating a new employee (POST /employees).
 * Matches StoreEmployeeRequest validation rules.
 */
export interface EmployeeCreateForm {
  name: string
  nik: string
  position: EmployeePosition | string
  phone: string
  address: string
  joined_at: string
  status: EmployeeStatus
  role_id: number | null
}

/**
 * Payload shape for updating an employee (PUT /employees/{id}).
 * All fields are optional (matches 'sometimes' rules).
 */
export type EmployeeUpdateForm = Partial<EmployeeCreateForm>

/**
 * Payload shape for POST /employees/{id}/assign-role.
 * Backend validates role_id as required + exists:roles,id.
 */
export interface AssignRolePayload {
  role_id: number
}

/**
 * Response shape for GET /employees/{id}/assign-role.
 * Returns the employee and a list of all available roles.
 */
export interface AssignRoleOptionsResponse {
  employee: Employee
  roles: AssignRoleOption[]
}

/** Single role option in the assign-role dropdown. */
export interface AssignRoleOption {
  id: number
  name: string
  slug: string
  description: string | null
  sppg_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

/**
 * Paginated list response from GET /employees.
 * Laravel's default paginate() format — NOT wrapped in {success, data, meta}.
 */
export interface EmployeeListResponse {
  current_page: number
  data: Employee[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}

/**
 * Mutation response wrapper (store/update/assign-role).
 * Shape: { message, employee }.
 */
export interface EmployeeMutationResponse {
  message: string
  employee: Employee
}

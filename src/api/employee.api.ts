import api from '@/api/axios'
import type {
  EmployeeListResponse,
  EmployeeMutationResponse,
  EmployeeCreateForm,
  EmployeeUpdateForm,
  AssignRoleOptionsResponse,
  AssignRolePayload,
  Employee,
} from '@/types/employee'

const BASE = '/admin-sppg/employees'

/**
 * Fetch paginated employee list with optional filters.
 * GET /api/admin-sppg/employees
 */
export async function getEmployees(params?: {
  page?: number
  per_page?: number
  search?: string
  role_id?: number
  position?: string
}): Promise<EmployeeListResponse> {
  const { data } = await api.get<EmployeeListResponse>(BASE, { params })
  return data
}

/**
 * Fetch a single employee by ID.
 * GET /api/admin-sppg/employees/{id}
 */
export async function getEmployee(id: number): Promise<Employee> {
  const { data } = await api.get<Employee>(`${BASE}/${id}`)
  return data
}

/**
 * Create a new employee.
 * POST /api/admin-sppg/employees
 */
export async function createEmployee(
  payload: EmployeeCreateForm,
): Promise<EmployeeMutationResponse> {
  const { data } = await api.post<EmployeeMutationResponse>(BASE, payload)
  return data
}

/**
 * Update an existing employee by ID.
 * PUT /api/admin-sppg/employees/{id}
 */
export async function updateEmployee(
  id: number,
  payload: EmployeeUpdateForm,
): Promise<EmployeeMutationResponse> {
  const { data } = await api.put<EmployeeMutationResponse>(`${BASE}/${id}`, payload)
  return data
}

/**
 * Delete an employee by ID.
 * DELETE /api/admin-sppg/employees/{id}
 */
export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`)
}

/**
 * Get available role options + employee data for the assign-role modal.
 * GET /api/admin-sppg/employees/{id}/assign-role
 */
export async function getAssignRoleOptions(
  id: number,
): Promise<AssignRoleOptionsResponse> {
  const { data } = await api.get<AssignRoleOptionsResponse>(`${BASE}/${id}/assign-role`)
  return data
}

/**
 * Assign a role to an employee.
 * POST /api/admin-sppg/employees/{id}/assign-role
 */
export async function assignRole(
  id: number,
  payload: AssignRolePayload,
): Promise<EmployeeMutationResponse> {
  const { data } = await api.post<EmployeeMutationResponse>(
    `${BASE}/${id}/assign-role`,
    payload,
  )
  return data
}

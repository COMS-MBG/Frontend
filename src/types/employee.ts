// ── Employee Types ──────────────────────────────────────────

export type EmployeeRole = 'Admin' | 'Operator' | 'Viewer'

export interface Employee {
  id: number
  nama: string
  nrp: string
  jabatan: string
  departemen: string
  email: string
  role: EmployeeRole
  isActive: boolean
  image?: string
}

export type FinanceKategori = 'Distribusi' | 'Operasional' | 'Logistik'
export type FinanceStatus = 'Approved' | 'Pending'

export interface FinanceItem {
  id: string
  tanggal: string          // ISO date string
  kategori: FinanceKategori
  deskripsi: string
  jumlah: number           // amount in IDR
  status: FinanceStatus
}

export interface FinanceStats {
  totalAnggaran: number
  totalRealisasi: number
  sisa: number
  efisiensi: number        // percentage 0-100
}

export interface FinanceFilters {
  search: string
  kategori: string         // '' = all
  dateRange: [string, string] | null
}

export const FINANCE_CATEGORY_COLORS: Record<FinanceKategori, string> = {
  Distribusi: '#1a56db', // primary
  Operasional: '#22c55e', // success
  Logistik: '#f59e0b',    // warning
}

export const FINANCE_CATEGORY_VARIANTS: Record<FinanceKategori, 'primary' | 'success' | 'warning'> = {
  Distribusi: 'primary',
  Operasional: 'success',
  Logistik: 'warning',
}

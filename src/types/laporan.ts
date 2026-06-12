export type ReportStatus = 'delivered' | 'delayed' | 'in_transit' | 'cancelled'

export interface ReportItem {
  id: number
  sekolah: string
  tanggal: string       // ISO date string
  status: ReportStatus
  durasi: string        // e.g. "45 menit"
  keterangan: string
}

export interface ReportStats {
  totalDistribusi: number
  totalSekolah: number
  keterlambatan: number
  efisiensi: number     // percentage 0-100
}

export interface ReportFilters {
  dateRange: [string, string] | null
  search: string
}

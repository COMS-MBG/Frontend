import { defineStore } from 'pinia'
import type { ReportItem, ReportStats, ReportFilters } from '@/types/laporan'

export const useLaporanStore = defineStore('laporan', {
  state: () => ({
    reports: [] as ReportItem[],
    stats: {
      totalDistribusi: 0,
      totalSekolah: 0,
      keterlambatan: 0,
      efisiensi: 0,
    } as ReportStats,
    filters: {
      dateRange: null,
      search: '',
    } as ReportFilters,
    loading: false,
    page: 1,
    limit: 10,
  }),

  getters: {
    filteredReports: (s) => {
      const q = s.filters.search.toLowerCase()
      return s.reports.filter((r) => {
        const matchSearch =
          !q ||
          r.sekolah.toLowerCase().includes(q) ||
          r.keterangan.toLowerCase().includes(q)

        const matchDate =
          !s.filters.dateRange ||
          (r.tanggal >= s.filters.dateRange[0] &&
            r.tanggal <= s.filters.dateRange[1])

        return matchSearch && matchDate
      })
    },

    paginatedReports(): ReportItem[] {
      const start = (this.page - 1) * this.limit
      return this.filteredReports.slice(start, start + this.limit)
    },

    totalPages(): number {
      return Math.max(1, Math.ceil(this.filteredReports.length / this.limit))
    },
  },

  actions: {
    setFilter(payload: Partial<ReportFilters>) {
      Object.assign(this.filters, payload)
      this.page = 1
    },

    setPage(page: number) {
      this.page = page
    },

    async fetchReports() {
      this.loading = true
      // Mock API delay
      await new Promise((res) => setTimeout(res, 600))

      this.reports = [
        { id: 1, sekolah: 'SDN 012 Kebon Gedang', tanggal: '2026-05-04', status: 'delivered', durasi: '35 menit', keterangan: 'Diterima lengkap' },
        { id: 2, sekolah: 'SMPN 2 Bandung', tanggal: '2026-05-04', status: 'in_transit', durasi: '50 menit', keterangan: 'Sedang dalam pengiriman' },
        { id: 3, sekolah: 'SDN 054 Cicadas', tanggal: '2026-05-04', status: 'delayed', durasi: '1 jam 15 menit', keterangan: 'Terlambat akibat kemacetan' },
        { id: 4, sekolah: 'SDN 001 Dago', tanggal: '2026-05-03', status: 'delivered', durasi: '28 menit', keterangan: 'Diterima baik' },
        { id: 5, sekolah: 'SMPN 5 Cibiru', tanggal: '2026-05-03', status: 'delivered', durasi: '42 menit', keterangan: 'Porsi lengkap' },
        { id: 6, sekolah: 'SDN 023 Antapani', tanggal: '2026-05-03', status: 'cancelled', durasi: '-', keterangan: 'Sekolah libur mendadak' },
        { id: 7, sekolah: 'SDN 017 Buah Batu', tanggal: '2026-05-02', status: 'delivered', durasi: '38 menit', keterangan: 'Tepat waktu' },
        { id: 8, sekolah: 'SMPN 8 Ujung Berung', tanggal: '2026-05-02', status: 'delayed', durasi: '1 jam 5 menit', keterangan: 'Kendala armada' },
        { id: 9, sekolah: 'SDN 031 Arcamanik', tanggal: '2026-05-02', status: 'delivered', durasi: '30 menit', keterangan: 'Diterima lengkap' },
        { id: 10, sekolah: 'SDN 045 Cibeunying', tanggal: '2026-05-01', status: 'delivered', durasi: '33 menit', keterangan: 'Semua porsi diterima' },
        { id: 11, sekolah: 'SMPN 12 Gedebage', tanggal: '2026-05-01', status: 'in_transit', durasi: '55 menit', keterangan: 'Dalam perjalanan ke lokasi' },
        { id: 12, sekolah: 'SDN 008 Batununggal', tanggal: '2026-05-01', status: 'delivered', durasi: '40 menit', keterangan: 'Tepat waktu, diterima baik' },
      ]
      this.loading = false
    },

    async fetchStats() {
      // Mock API delay
      await new Promise((res) => setTimeout(res, 300))

      this.stats = {
        totalDistribusi: 148,
        totalSekolah: 56,
        keterlambatan: 7,
        efisiensi: 94.2,
      }
    },
  },
})

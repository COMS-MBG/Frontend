import { defineStore } from 'pinia'
import type { FinanceItem, FinanceStats, FinanceFilters, FinanceKategori } from '@/types/finance'
import { FINANCE_CATEGORY_COLORS } from '@/types/finance'

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    reports: [] as FinanceItem[],
    stats: {
      totalAnggaran: 0,
      totalRealisasi: 0,
      sisa: 0,
      efisiensi: 0,
    } as FinanceStats,
    filters: {
      search: '',
      kategori: '',
      dateRange: null,
    } as FinanceFilters,
    loading: false,
    error: null as string | null,
    page: 1,
    limit: 10,
  }),

  getters: {
    filteredReports: (s) => {
      const q = s.filters.search.toLowerCase()
      return s.reports.filter((r) => {
        const matchSearch =
          !q ||
          r.deskripsi.toLowerCase().includes(q) ||
          r.kategori.toLowerCase().includes(q)

        const matchKategori =
          !s.filters.kategori || r.kategori === s.filters.kategori

        const matchDate =
          !s.filters.dateRange ||
          (r.tanggal >= s.filters.dateRange[0] &&
            r.tanggal <= s.filters.dateRange[1])

        return matchSearch && matchKategori && matchDate
      })
    },

    paginatedReports(): FinanceItem[] {
      const start = (this.page - 1) * this.limit
      return this.filteredReports.slice(start, start + this.limit)
    },

    totalPages(): number {
      return Math.max(1, Math.ceil(this.filteredReports.length / this.limit))
    },

    /** Aggregate spending per category — drives both charts */
    categoryTotals(): Record<FinanceKategori, number> {
      const totals: Record<FinanceKategori, number> = {
        Distribusi: 0,
        Operasional: 0,
        Logistik: 0,
      }
      for (const r of this.reports) {
        totals[r.kategori] += r.jumlah
      }
      return totals
    },

    /** Chart-ready: ordered labels */
    chartLabels(): FinanceKategori[] {
      return ['Distribusi', 'Operasional', 'Logistik']
    },

    /** Chart-ready: ordered data values */
    chartData(): number[] {
      return this.chartLabels.map((k) => this.categoryTotals[k])
    },

    /** Chart-ready: ordered colors */
    chartColors(): string[] {
      return this.chartLabels.map((k) => FINANCE_CATEGORY_COLORS[k])
    },
  },

  actions: {
    setFilter(payload: Partial<FinanceFilters>) {
      Object.assign(this.filters, payload)
      this.page = 1
    },

    setPage(page: number) {
      this.page = page
    },

    async fetchReports() {
      this.loading = true
      this.error = null
      try {
        // Mock API delay — replace with real axios call
        await new Promise((res) => setTimeout(res, 600))

        this.reports = [
          { id: 'FIN-001', tanggal: '2026-05-04', kategori: 'Distribusi',   deskripsi: 'Pengiriman batch SDN 012 Kebon Gedang',         jumlah: 2_450_000, status: 'Approved' },
          { id: 'FIN-002', tanggal: '2026-05-04', kategori: 'Operasional',  deskripsi: 'Biaya tenaga kerja dapur pusat',                 jumlah: 8_500_000, status: 'Approved' },
          { id: 'FIN-003', tanggal: '2026-05-04', kategori: 'Logistik',     deskripsi: 'Pembelian bahan baku minggu ke-1',                jumlah: 15_200_000, status: 'Pending' },
          { id: 'FIN-004', tanggal: '2026-05-03', kategori: 'Distribusi',   deskripsi: 'Sewa armada tambahan rute Cibiru',                jumlah: 3_750_000, status: 'Approved' },
          { id: 'FIN-005', tanggal: '2026-05-03', kategori: 'Operasional',  deskripsi: 'Maintenance peralatan masak',                     jumlah: 1_200_000, status: 'Approved' },
          { id: 'FIN-006', tanggal: '2026-05-03', kategori: 'Logistik',     deskripsi: 'Packaging & labeling porsi',                      jumlah: 4_600_000, status: 'Pending' },
          { id: 'FIN-007', tanggal: '2026-05-02', kategori: 'Distribusi',   deskripsi: 'BBM armada distribusi harian',                    jumlah: 1_850_000, status: 'Approved' },
          { id: 'FIN-008', tanggal: '2026-05-02', kategori: 'Operasional',  deskripsi: 'Listrik & air dapur produksi',                    jumlah: 2_300_000, status: 'Approved' },
          { id: 'FIN-009', tanggal: '2026-05-01', kategori: 'Logistik',     deskripsi: 'Cold storage rental Mei 2026',                    jumlah: 6_000_000, status: 'Approved' },
          { id: 'FIN-010', tanggal: '2026-05-01', kategori: 'Distribusi',   deskripsi: 'Pengiriman batch SMPN 5 Cibiru',                  jumlah: 2_100_000, status: 'Approved' },
          { id: 'FIN-011', tanggal: '2026-05-01', kategori: 'Operasional',  deskripsi: 'Gaji staf QC & Hygiene',                          jumlah: 5_400_000, status: 'Pending' },
          { id: 'FIN-012', tanggal: '2026-04-30', kategori: 'Logistik',     deskripsi: 'Pembelian bahan baku minggu ke-4 April',           jumlah: 14_800_000, status: 'Approved' },
        ]
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Gagal memuat data transaksi'
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        await new Promise((res) => setTimeout(res, 300))

        this.stats = {
          totalAnggaran: 250_000_000,
          totalRealisasi: 168_150_000,
          sisa: 81_850_000,
          efisiensi: 67.3,
        }
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Gagal memuat statistik'
      }
    },
  },
})


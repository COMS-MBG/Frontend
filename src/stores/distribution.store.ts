import { defineStore } from 'pinia'
import type { DistributionItem, DeliveryStatus } from '@/types/distribution'

export const useDistributionStore = defineStore('distribution', {
  state: () => ({
    items: [] as DistributionItem[],
    query: '' as string,
    date: '' as string, // ISO string for filter
    isLoading: false,
    page: 1,
    limit: 10,
  }),

  getters: {
    filtered: (s) => {
      const q = s.query.toLowerCase()
      return s.items.filter(i =>
        !q || i.sekolah.toLowerCase().includes(q) || i.kurir.toLowerCase().includes(q)
      )
    },
    paginated: (s): DistributionItem[] => {
      const allFiltered = s.items.filter(i => {
        const q = s.query.toLowerCase()
        return !q || i.sekolah.toLowerCase().includes(q) || i.kurir.toLowerCase().includes(q)
      })
      const start = (s.page - 1) * s.limit
      return allFiltered.slice(start, start + s.limit)
    },
    totalPages(s): number {
      const allFiltered = s.items.filter(i => {
        const q = s.query.toLowerCase()
        return !q || i.sekolah.toLowerCase().includes(q) || i.kurir.toLowerCase().includes(q)
      })
      return Math.ceil(allFiltered.length / s.limit)
    },
    totalToday: (s) => s.items.length,
    inProgressCount: (s) => s.items.filter(i => i.status === 'in_progress').length,
    onTimeRate: () => 94.2, // static for now (UI only)
  },

  actions: {
    setQuery(newQuery: string) {
      this.query = newQuery
      this.page = 1 // reset to first page on search
    },
    setPage(page: number) {
      this.page = page
    },
    setItems(data: DistributionItem[]) {
      this.items = data
    },
    updateStatus(id: number, status: DeliveryStatus) {
      const item = this.items.find(i => i.id === id)
      if (item) item.status = status
    },
    async startDelivery(id: number) {
      this.isLoading = true
      // mock API delay
      await new Promise(res => setTimeout(res, 500))
      this.updateStatus(id, 'in_progress')
      this.isLoading = false
    }
  }
})

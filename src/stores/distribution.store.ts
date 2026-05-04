import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import type { DistributionItem, DeliveryStatus } from '@/types/distribution'

export const useDistributionStore = defineStore('distribution', () => {
  // ── State ───────────────────────────────────────────────
  const items = ref<DistributionItem[]>([])
  const searchQuery = ref<string>('')
  const selectedDateFilter = ref<string>('')
  const isLoading = ref<boolean>(false)
  const page = ref<number>(1)
  const limit = ref<number>(10)

  // ── Fuzzy Search Setup ──────────────────────────────────
  const fuseInstance = computed(() => {
    return new Fuse(items.value, {
      keys: ['sekolah', 'kurir', 'kendaraan', 'status'],
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true
    })
  })

  // ── Getters ─────────────────────────────────────────────
  const filtered = computed(() => {
    if (!searchQuery.value.trim()) {
      return items.value
    }
    return fuseInstance.value.search(searchQuery.value).map(result => result.item)
  })

  const paginated = computed(() => {
    const allFiltered = filtered.value
    const start = (page.value - 1) * limit.value
    return allFiltered.slice(start, start + limit.value)
  })

  const totalPages = computed(() => {
    const allFiltered = filtered.value
    return Math.ceil(allFiltered.length / limit.value)
  })

  const totalToday = computed(() => items.value.length)
  const inProgressCount = computed(() => items.value.filter(i => i.status === 'in_progress').length)
  const onTimeRate = computed(() => 94.2) // static for now

  // ── Actions ─────────────────────────────────────────────
  function setSearchQuery(newQuery: string) {
    searchQuery.value = newQuery
    page.value = 1
  }

  function setDateFilter(newDate: string) {
    selectedDateFilter.value = newDate
    page.value = 1
  }

  function setPage(newPage: number) {
    page.value = newPage
  }

  function setLimit(newLimit: number) {
    limit.value = newLimit
    page.value = 1
  }

  function setItems(data: DistributionItem[]) {
    items.value = data
  }

  function updateStatus(id: number, status: DeliveryStatus) {
    const item = items.value.find(i => i.id === id)
    if (item) item.status = status
  }

  async function startDelivery(id: number) {
    isLoading.value = true
    await new Promise(res => setTimeout(res, 500))
    updateStatus(id, 'in_progress')
    isLoading.value = false
  }

  return {
    // state
    items, searchQuery, selectedDateFilter, isLoading, page, limit,
    // getters
    filtered, paginated, totalPages, totalToday, inProgressCount, onTimeRate,
    // actions
    setSearchQuery, setDateFilter, setPage, setLimit, setItems, updateStatus, startDelivery
  }
})

/**
 * stores/resep.store.ts — Master Data Resep (Pinia)
 *
 * Single source of truth for all recipe data.
 * Built on the generic CRUD factory — no boilerplate duplication.
 *
 * Data flow:  View  →  store action  →  (future: API service layer)
 *
 * API integration:
 *   Uncomment the `await api.get(…)` block inside fetchItems()
 *   and remove `setItems(resepDummy)` from the view's onMounted.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import { createCrudStore } from './createCrudStore'
import type { ResepItem } from '@/types/resep'

/** Base CRUD operations */
const useBaseResepStore = createCrudStore<ResepItem>(
  'resep-crud',
  'Gagal memuat data resep.',
)

export const useResepStore = defineStore('resep', () => {
  const crud = useBaseResepStore()

  // ── Toolbar State ──────────────────────────────────────────
  const searchQuery = ref('')
  const rowsPerPage = ref(10)

  function setSearchQuery(value: string): void {
    searchQuery.value = value
  }

  function setRowsPerPage(value: number): void {
    rowsPerPage.value = value
  }

  // ── Fuzzy Search Setup ─────────────────────────────────────
  // Memoized Fuse instance, only rebuilds when crud.items change.
  const fuseInstance = computed(() => {
    return new Fuse(crud.items, {
      keys: ['nama'],
      threshold: 0.3,
    })
  })

  // ── Filtered Data Getter ───────────────────────────────────
  const filteredRecipes = computed(() => {
    if (!searchQuery.value.trim()) {
      return crud.items
    }
    return fuseInstance.value.search(searchQuery.value).map(result => result.item)
  })

  function resetToolbar(): void {
    searchQuery.value = ''
    rowsPerPage.value = 10
  }

  return {
    // CRUD delegates
    items: computed(() => crud.items),
    isLoading: computed(() => crud.isLoading),
    error: computed(() => crud.error),
    totalItems: computed(() => crud.totalItems),
    getById: crud.getById,
    setItems: crud.setItems,
    addItem: crud.addItem,
    updateItem: crud.updateItem,
    deleteItem: crud.deleteItem,
    fetchItems: crud.fetchItems,

    // Toolbar logic
    searchQuery,
    rowsPerPage,
    setSearchQuery,
    setRowsPerPage,
    filteredRecipes,
    resetToolbar,
  }
})

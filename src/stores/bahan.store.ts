/**
 * stores/bahan.store.ts — Master Bahan Baku (Pinia)
 *
 * Single source of truth for all ingredient data.
 * Built on the generic CRUD factory — no boilerplate duplication.
 *
 * Data flow:  View  →  store action  →  (future: API service layer)
 *
 * API integration:
 *   Uncomment the `await api.get(…)` block inside fetchItems()
 *   and remove `setItems(bahanDummy)` from the view's onMounted.
 *
 * Toolbar state (search & filter) is centralised here so that
 * any component in the tree can read/write without prop-drilling.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import { createCrudStore } from './createCrudStore'
import type { BahanItem } from '@/types/gizi'

/** Base CRUD operations (items, isLoading, error, etc.) */
const useBaseBahanStore = createCrudStore<BahanItem>(
  'bahan-crud',
  'Gagal memuat data bahan.',
)

/**
 * Composite store that wraps the CRUD factory
 * and adds toolbar-specific UI state.
 */
export const useBahanStore = defineStore('bahan', () => {
  // ── Re-export CRUD store ──────────────────────────────────
  const crud = useBaseBahanStore()

  // ── Toolbar UI state (centralised) ────────────────────────
  const searchQuery = ref('')
  const rowsPerPage = ref(10)

  /** Update search query from toolbar */
  function setSearchQuery(value: string): void {
    searchQuery.value = value
  }

  /** Update rows per page from toolbar */
  function setRowsPerPage(value: number): void {
    rowsPerPage.value = value
  }

  /** Reset search to default */
  function resetToolbar(): void {
    searchQuery.value = ''
    rowsPerPage.value = 10
  }

  // ── Fuzzy Search Setup ─────────────────────────────────────
  // Memoized Fuse instance, only rebuilds when crud.items change.
  const fuseInstance = computed(() => {
    return new Fuse(crud.items, {
      keys: ['nama'], // Fuzzy search on 'nama'
      threshold: 0.3,
    })
  })

  // ── Filtered Data Getter ───────────────────────────────────
  const filteredItems = computed(() => {
    if (!searchQuery.value.trim()) {
      return crud.items
    }
    return fuseInstance.value.search(searchQuery.value).map(result => result.item)
  })

  return {
    // ── CRUD (delegated with computed to keep reactivity) ──
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

    // ── Toolbar state ──
    searchQuery,
    rowsPerPage,
    setSearchQuery,
    setRowsPerPage,
    filteredItems,
    resetToolbar,
  }
})

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
 */
import { createCrudStore } from './createCrudStore'
import type { BahanItem } from '@/types/gizi'

export const useBahanStore = createCrudStore<BahanItem>(
  'bahan',
  'Gagal memuat data bahan.',
)

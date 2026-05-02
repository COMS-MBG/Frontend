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
import { createCrudStore } from './createCrudStore'
import type { ResepItem } from '@/types/resep'

export const useResepStore = createCrudStore<ResepItem>(
  'resep',
  'Gagal memuat data resep.',
)

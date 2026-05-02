/**
 * stores/createCrudStore.ts — Generic CRUD Store Factory
 *
 * Eliminates the 95% code duplication between bahan.store.ts and resep.store.ts.
 * Each domain store becomes a one-liner that passes its type + error message.
 *
 * Uses the Composition-API store style (consistent with auth.ts).
 */
import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'

/**
 * Creates a Pinia store with standard CRUD operations for any entity
 * that has a numeric `id` field.
 *
 * @param storeId   - Unique Pinia store identifier (e.g. 'bahan', 'resep')
 * @param errorMsg  - Fallback error message for failed API calls
 */
export function createCrudStore<T extends { id: number }>(
  storeId: string,
  errorMsg: string,
) {
  return defineStore(storeId, () => {
    // ── State ──────────────────────────────────────────────────
    const items     = ref<T[]>([]) as Ref<T[]>
    const isLoading = ref(false)
    const error     = ref<string | null>(null)

    // ── Getters ────────────────────────────────────────────────

    /** Total number of items in the store. */
    const totalItems = computed(() => items.value.length)

    /** Look up a single item by its primary key. */
    const getById = computed(
      () => (id: number): T | undefined =>
        items.value.find(i => i.id === id),
    )

    // ── Actions ────────────────────────────────────────────────

    /** Bulk-load data (used with dummy / imported data). */
    function setItems(data: T[]): void {
      items.value = data
    }

    /** Append a new item (optimistic — API call goes here later). */
    function addItem(item: T): void {
      items.value.push(item)
    }

    /** Replace an existing item matched by id. */
    function updateItem(updated: T): void {
      const index = items.value.findIndex(i => i.id === updated.id)
      if (index !== -1) items.value[index] = updated
    }

    /** Remove an item by id. */
    function deleteItem(id: number): void {
      items.value = items.value.filter(i => i.id !== id)
    }

    /**
     * Fetch all items from the API.
     *
     * TODO: each consuming store should override or extend this
     * once the backend endpoint is available.
     */
    async function fetchItems(): Promise<void> {
      isLoading.value = true
      error.value     = null

      try {
        // ── Future API hook ────────────────────────────────────
        // Override in the consuming store or inject an API service.
      } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : errorMsg
      } finally {
        isLoading.value = false
      }
    }

    // ── Expose ─────────────────────────────────────────────────
    return {
      items,
      isLoading,
      error,
      totalItems,
      getById,
      setItems,
      addItem,
      updateItem,
      deleteItem,
      fetchItems,
    }
  })
}

import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'

/**
 * Composable for client-side pagination.
 * Eliminates duplicated pagination logic across views.
 *
 * @param sourceItems  - Reactive array (or computed) of items to paginate
 * @param itemsPerPage - Number of items per page (non-reactive constant)
 */
export function usePagination<T>(
  sourceItems: Ref<T[]> | ComputedRef<T[]>,
  itemsPerPage: number,
) {
  const page = ref(1)

  const totalItems = computed(() => sourceItems.value.length)

  const paginatedItems = computed(() => {
    const start = (page.value - 1) * itemsPerPage
    return sourceItems.value.slice(start, start + itemsPerPage)
  })

  /** Reset to page 1 when the source data changes. */
  watch(sourceItems, () => {
    page.value = 1
  })

  /** Guard: clamp page to valid range. */
  watch(page, (val) => {
    if (val < 1) page.value = 1
  })

  return {
    page,
    perPage: itemsPerPage,
    totalItems,
    paginatedItems,
  }
}

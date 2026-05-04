import { ref, computed, watch, isRef, type Ref, type ComputedRef } from 'vue'

/**
 * Composable for client-side pagination.
 * Eliminates duplicated pagination logic across views.
 *
 * @param sourceItems  - Reactive array (or computed) of items to paginate
 * @param initialOrRefPerPage - Number of items per page (or reactive Ref)
 */
export function usePagination<T>(
  sourceItems: Ref<T[]> | ComputedRef<T[]>,
  initialOrRefPerPage: number | Ref<number>,
) {
  const page = ref(1)
  const perPage = isRef(initialOrRefPerPage) ? initialOrRefPerPage : ref(initialOrRefPerPage)

  const totalItems = computed(() => sourceItems.value.length)

  const paginatedItems = computed(() => {
    const start = (page.value - 1) * perPage.value
    return sourceItems.value.slice(start, start + perPage.value)
  })

  /** Reset to page 1 when the source data or perPage changes. */
  watch([sourceItems, perPage], () => {
    page.value = 1
  })

  /** Guard: clamp page to valid range. */
  watch(page, (val) => {
    if (val < 1) page.value = 1
  })

  return {
    page,
    perPage,
    totalItems,
    paginatedItems,
  }
}

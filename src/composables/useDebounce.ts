/**
 * composables/useDebounce.ts — Debounced Ref
 *
 * Returns a reactive ref whose value is synced from `source`
 * with a configurable delay.  Useful for search inputs that
 * should only trigger filtering after the user stops typing.
 *
 * Usage:
 *   const search = ref('')
 *   const debouncedSearch = useDebounce(search, 300)
 */
import { ref, watch, onUnmounted, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(source, (newVal) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debounced.value = newVal
    }, delay)
  })

  onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })

  return debounced
}

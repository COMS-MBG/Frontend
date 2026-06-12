<template>
  <BaseTableToolbar
    :search-value="localSearch"
    @update:search-value="onSearchInput"
    :show-search="true"
    :show-filter="false"
    :show-import="false"
    :show-export="false"
    :show-per-page="false"
    :show-add="canCreate"
    add-label="Tambah Bahan"
    search-placeholder="Cari bahan..."
    @add="$emit('add')"
  />
</template>

<script setup lang="ts">
/**
 * BahanToolbar.vue — Thin domain wrapper around BaseTableToolbar
 *
 * Now driven by props/emits from parent view (not directly from store).
 * Debounced search emits to parent, which calls setFilter().
 */
import { ref, watch } from 'vue'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import { useDebounce } from '@/composables/useDebounce'

const props = defineProps<{
  searchValue?: string
  canCreate?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:search-value', val: string): void
  (e: 'add'): void
}>()

// ── Local state (synced → parent via emit) ────────────────────
const localSearch = ref(props.searchValue ?? '')

// ── Debounced search → parent (300ms) ─────────────────────────
const debouncedSearch = useDebounce(localSearch, 300)

watch(debouncedSearch, (newVal) => {
  emit('update:search-value', newVal)
})

// ── Sync from parent (e.g. reset) ─────────────────────────────
watch(() => props.searchValue, (v) => {
  if (v !== undefined) localSearch.value = v
})

function onSearchInput(val: string) {
  localSearch.value = val
}
</script>

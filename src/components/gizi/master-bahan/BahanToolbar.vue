<template>
  <BaseTableToolbar
    :search-value="localSearch"
    @update:search-value="onSearchInput"
    :per-page-value="bahanStore.rowsPerPage"
    @update:per-page-value="bahanStore.setRowsPerPage"
    :show-search="true"
    :show-filter="false"
    :show-import="false"
    :show-export="false"
    :show-per-page="true"
    :show-add="true"
    add-label="Tambah Bahan"
    search-placeholder="Cari bahan..."
    @add="$emit('add')"
  />
</template>

<script setup lang="ts">
/**
 * BahanToolbar.vue — Thin domain wrapper around BaseTableToolbar
 *
 * Responsibilities:
 *  1. Sync search with Pinia store (debounced search)
 *  2. Emit add events to the parent view
 *
 * All layout, styling, and responsive behavior is handled
 * by the reusable BaseTableToolbar component.
 */
import { ref, watch, onUnmounted, computed } from 'vue'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import { useBahanStore } from '@/stores/bahan.store'
import { useDebounce } from '@/composables/useDebounce'


// Only emits if we have other actions, but currently none.
// We can remove defineEmits if we don't have custom emits from this wrapper anymore.

const props = defineProps<{
  perPage?: number
}>()

const emit = defineEmits<{
  (e: 'update:perPage', val: number): void
  (e: 'add'): void
}>()

// ── Store ─────────────────────────────────────────────────────
const bahanStore = useBahanStore()

// ── Local state (synced → Pinia) ──────────────────────────────
const localSearch = ref(bahanStore.searchQuery)

// ── Debounced search → Pinia (300ms) ──────────────────────────
const debouncedSearch = useDebounce(localSearch, 300)

watch(debouncedSearch, (newVal) => {
  bahanStore.setSearchQuery(newVal)
})

// ── Sync back from Pinia (e.g. resetToolbar) ─────────────────
watch(() => bahanStore.searchQuery, (v) => { localSearch.value = v })

function onSearchInput(val: string) {
  localSearch.value = val
}
</script>

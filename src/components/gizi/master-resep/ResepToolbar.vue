<template>
  <BaseTableToolbar
    :search-value="localSearch"
    @update:search-value="onSearchInput"
    :per-page-value="resepStore.rowsPerPage"
    @update:per-page-value="resepStore.setRowsPerPage"
    :show-search="true"
    :show-filter="false"
    :show-import="false"
    :show-export="false"
    :show-per-page="true"
    :show-add="true"
    add-label="Tambah Resep"
    search-placeholder="Cari resep..."
    @add="$emit('add')"
  />
</template>

<script setup lang="ts">
/**
 * ResepToolbar.vue — Thin domain wrapper around BaseTableToolbar
 *
 * Responsibilities:
 *  1. Sync search with Pinia store (debounced search via useDebounce)
 *  2. Sync rowsPerPage with Pinia store
 *  3. Emit add events to the parent view
 *
 * All layout, styling, and responsive behavior is handled
 * by the reusable BaseTableToolbar component.
 */
import { ref, watch } from 'vue'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import { useResepStore } from '@/stores/resep.store'
import { useDebounce } from '@/composables/useDebounce'

const emit = defineEmits<{
  (e: 'add'): void
}>()

// ── Store ─────────────────────────────────────────────────────
const resepStore = useResepStore()

// ── Local state (synced → Pinia) ──────────────────────────────
const localSearch = ref(resepStore.searchQuery)

// ── Debounced search → Pinia (300ms) ──────────────────────────
const debouncedSearch = useDebounce(localSearch, 300)

watch(debouncedSearch, (newVal) => {
  resepStore.setSearchQuery(newVal)
})

// ── Sync back from Pinia (e.g. resetToolbar) ─────────────────
watch(() => resepStore.searchQuery, (v) => { localSearch.value = v })

function onSearchInput(val: string) {
  localSearch.value = val
}
</script>

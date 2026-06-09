<template>
  <BaseTableToolbar
    :search-value="localSearch"
    @update:search-value="onSearchInput"
    :show-search="true"
    :show-filter="true"
    :filter-value="filterValue"
    :filter-options="statusOptions"
    filter-placeholder="Status"
    :show-import="false"
    :show-export="false"
    :show-add="true"
    :show-per-page="true"
    :per-page-value="perPageValue"
    add-label="Tambah SPPG"
    search-placeholder="Cari SPPG..."
    @update:filter-value="onFilterChange"
    @update:per-page-value="$emit('update:perPageValue', $event)"
    @add="$emit('add')"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import { useDebounce } from '@/composables/useDebounce'

const props = withDefaults(defineProps<{
  searchValue?: string
  filterValue?: string | number | null
  perPageValue?: number
}>(), {
  searchValue: '',
  filterValue: 'all',
  perPageValue: 10,
})

const emit = defineEmits<{
  (e: 'update:search-value', val: string): void
  (e: 'update:filter-value', val: string): void
  (e: 'update:perPageValue', val: number): void
  (e: 'add'): void
}>()

const localSearch = ref(props.searchValue ?? '')
const debouncedSearch = useDebounce(localSearch, 300)

watch(debouncedSearch, (newVal) => {
  emit('update:search-value', newVal)
})

watch(() => props.searchValue, (v) => {
  if (v !== undefined) localSearch.value = v
})

function onSearchInput(val: string) {
  localSearch.value = val
}

function onFilterChange(val: string | number | null) {
  emit('update:filter-value', String(val ?? 'all'))
}

const statusOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Nonaktif', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
]
</script>

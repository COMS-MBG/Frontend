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
    :show-add="false"
    search-placeholder="Cari laporan..."
    @update:filter-value="onFilterChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import { useDebounce } from '@/composables/useDebounce'

const props = withDefaults(defineProps<{
  searchValue?: string
  filterValue?: string | number | null
}>(), {
  searchValue: '',
  filterValue: 'all',
})

const emit = defineEmits<{
  (e: 'update:search-value', val: string): void
  (e: 'update:filter-value', val: string): void
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
  { label: 'Pending', value: 'pending' },
  { label: 'Disetujui', value: 'approved' },
  { label: 'Ditolak', value: 'rejected' },
  { label: 'Disubmit', value: 'submitted' },
]
</script>

<template>
  <BaseTableToolbar
    :search-value="localSearch"
    @update:search-value="onSearchInput"
    :show-search="true"
    :show-filter="false"
    :show-import="false"
    :show-export="false"
    :show-per-page="true"
    :per-page-value="perPageValue"
    :per-page-options="perPageOptions"
    @update:per-page-value="onPerPageChange"
    :show-add="canCreate"
    add-label="Tambah Resep"
    search-placeholder="Cari resep..."
    @add="$emit('add')"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import { useDebounce } from '@/composables/useDebounce'
import type { SelectOption } from '@/types/form'

const props = withDefaults(defineProps<{
  searchValue?: string
  canCreate?: boolean
  perPageValue?: number
}>(), {
  searchValue: '',
  canCreate: false,
  perPageValue: 10,
})

const emit = defineEmits<{
  (e: 'update:search-value', val: string): void
  (e: 'update:per-page-value', val: number): void
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

const perPageOptions: SelectOption[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
]

function onPerPageChange(val: number) {
  emit('update:per-page-value', val)
}
</script>

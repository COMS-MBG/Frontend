<template>
  <BaseTableToolbar
    :search-value="localSearch"
    @update:search-value="onSearchInput"
    :show-search="true"
    :show-filter="false"
    :show-per-page="false"
    :show-import="false"
    :show-export="false"
    :show-add="canCreate"
    add-label="Tambah Karyawan"
    search-placeholder="Cari nama karyawan..."
    @add="$emit('add')"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounce } from '@/composables/useDebounce'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'

defineProps<{
  searchValue: string
  roleValue: string
  canCreate: boolean
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'update:searchValue', value: string): void
  (e: 'update:roleValue', value: string): void
}>()

const localSearch = ref('')
const debouncedSearch = useDebounce(localSearch, 300)

watch(debouncedSearch, (newVal) => emit('update:searchValue', newVal))

function onSearchInput(val: string) {
  localSearch.value = val
}
</script>

<style scoped lang="scss">
.filter-group {
  display: flex;
  align-items: center;
  gap: $space-2;
  margin-left: $space-3;

  :deep(.app-select) {
    min-width: 140px;
  }
}
</style>
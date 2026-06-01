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
    add-label="Tambah Role"
    search-placeholder="Cari role..."
    @add="$emit('add')"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounce } from '@/composables/useDebounce'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'

defineProps<{
  searchValue: string
  canCreate: boolean
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'update:searchValue', value: string): void
}>()

const localSearch = ref('')
const debouncedSearch = useDebounce(localSearch, 300)

watch(debouncedSearch, (newVal) => emit('update:searchValue', newVal))

function onSearchInput(val: string) {
  localSearch.value = val
}
</script>

<style scoped lang="scss">
</style>

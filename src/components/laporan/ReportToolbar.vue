<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useLaporanStore } from '@/stores/laporan.store'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'

const store = useLaporanStore()
const localQuery = ref(store.filters.search)
let timeoutId: number | null = null

watch(localQuery, (val) => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = window.setTimeout(() => {
    store.setFilter({ search: val })
  }, 400)
})

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})

function onSearchInput(val: string) {
  localQuery.value = val
}
</script>

<template>
  <BaseTableToolbar
    :search-value="localQuery"
    @update:search-value="onSearchInput"
    :show-search="true"
    :show-filter="false"
    :show-per-page="false"
    :show-add="false"
    :show-import="false"
    :show-export="false"
    search-placeholder="Cari sekolah atau keterangan..."
  />
</template>

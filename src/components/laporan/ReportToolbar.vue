<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useLaporanStore } from '@/stores/laporan.store'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import BaseFilterDate from '@/components/common/BaseFilterDate.vue'
import type { SelectOption } from '@/types/form'

const store = useLaporanStore()
const localQuery = ref(store.filters.search)
const localDateRange = ref<string[]>(store.filters.dateRange ? [...store.filters.dateRange] : [])
let timeoutId: number | null = null

const perPageOptions: SelectOption[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
]

watch(localQuery, (val) => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = window.setTimeout(() => {
    store.setFilter({ search: val })
  }, 400)
})

watch(localDateRange, (val) => {
  if (val && val.length === 2 && val[0] && val[1]) {
    store.setFilter({ dateRange: [val[0], val[1]] })
  } else {
    store.setFilter({ dateRange: null })
  }
})

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})

function onSearchInput(val: string) {
  localQuery.value = val
}

function onPerPageChange(val: number) {
  store.setLimit(val)
}
</script>

<template>
  <BaseTableToolbar
    :search-value="localQuery"
    @update:search-value="onSearchInput"
    :show-search="true"
    :show-filter="false"
    :show-per-page="true"
    :per-page-value="store.limit"
    :per-page-options="perPageOptions"
    @update:per-page-value="onPerPageChange"
    :show-add="false"
    :show-import="false"
    :show-export="false"
    search-placeholder="Cari sekolah atau keterangan..."
  >
    <template #right-prepend>
      <BaseFilterDate 
        v-model="localDateRange" 
        :range="true"
        placeholder="Rentang Tanggal" 
        class="report-date-filter"
      />
    </template>
  </BaseTableToolbar>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.report-date-filter {
  width: 250px;
}
</style>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '@/stores/finance.store'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import BaseFilterDate from '@/components/common/BaseFilterDate.vue'
import type { SelectOption } from '@/types/form'

const store = useFinanceStore()
const localQuery = ref(store.filters.search)
const localKategori = ref(store.filters.kategori)
const localDateRange = ref<string[]>(store.filters.dateRange ? [...store.filters.dateRange] : [])
let timeoutId: number | null = null

const kategoriOptions: SelectOption[] = [
  { label: 'Semua Kategori', value: '' },
  { label: 'Distribusi', value: 'Distribusi' },
  { label: 'Operasional', value: 'Operasional' },
  { label: 'Logistik', value: 'Logistik' },
]

watch(localQuery, (val) => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = window.setTimeout(() => {
    store.setFilter({ search: val })
  }, 400)
})

watch(localKategori, (val) => {
  store.setFilter({ kategori: val ?? '' })
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

function onFilterChange(val: string | number | null) {
  localKategori.value = String(val ?? '')
}

const perPageOptions: SelectOption[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
]

function onPerPageChange(val: number) {
  store.setLimit(val)
}
</script>

<template>
  <BaseTableToolbar
    :search-value="localQuery"
    @update:search-value="onSearchInput"
    :filter-value="localKategori"
    :filter-options="kategoriOptions"
    filter-placeholder="Filter kategori"
    @update:filter-value="onFilterChange"
    :show-search="true"
    :show-filter="true"
    :show-per-page="true"
    :per-page-value="store.limit"
    :per-page-options="perPageOptions"
    @update:per-page-value="onPerPageChange"
    :show-add="false"
    :show-import="false"
    :show-export="false"
    search-placeholder="Cari deskripsi atau kategori..."
  >
    <template #right-prepend>
      <BaseFilterDate 
        v-model="localDateRange" 
        :range="true"
        placeholder="Rentang Tanggal" 
        class="finance-date-filter"
      />
    </template>
  </BaseTableToolbar>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.finance-date-filter {
  width: 250px;
}
</style>

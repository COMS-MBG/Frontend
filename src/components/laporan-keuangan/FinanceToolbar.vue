<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '@/stores/finance.store'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import BaseFilterDate from '@/components/common/BaseFilterDate.vue'
import type { SelectOption } from '@/types/form'

const store = useFinanceStore()
const localQuery = ref(store.filters.search)
const localKategori = ref(store.filters.kategori)
const localStartDate = ref(store.filters.dateRange?.[0] ?? '')
const localEndDate = ref(store.filters.dateRange?.[1] ?? '')
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

watch([localStartDate, localEndDate], ([start, end]) => {
  if (start && end) {
    store.setFilter({ dateRange: [start, end] })
  } else if (!start && !end) {
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
    :show-per-page="false"
    :show-add="false"
    :show-import="false"
    :show-export="false"
    search-placeholder="Cari deskripsi atau kategori..."
  >
    <template #left-append>
      <div class="finance-filters">
        <div class="filter-box">
          <BaseFilterDate v-model="localStartDate" placeholder="Mulai Tanggal" />
        </div>
        <div class="filter-box">
          <BaseFilterDate v-model="localEndDate" placeholder="Sampai Tanggal" />
        </div>
      </div>
    </template>
  </BaseTableToolbar>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.finance-filters {
  display: flex;
  align-items: center;
  gap: $space-3;
  margin-left: $space-3;
  flex-wrap: wrap;

  .filter-box {
    width: 160px;
  }
}
</style>

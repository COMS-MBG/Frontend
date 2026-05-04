<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '@/stores/finance.store'
import BaseInput from '@/components/common/BaseInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
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
</script>

<template>
  <div class="finance-toolbar">
    <div class="finance-toolbar__controls">
      <div class="filter-box">
        <BaseFilterDate v-model="localStartDate" placeholder="Mulai Tanggal" />
      </div>
      <div class="filter-box">
        <BaseFilterDate v-model="localEndDate" placeholder="Sampai Tanggal" />
      </div>
      <div class="filter-box">
        <AppSelect
          v-model="localKategori"
          :options="kategoriOptions"
          placeholder="Filter kategori"
          aria-label="Filter kategori"
        />
      </div>
      <div class="search-box">
        <BaseInput
          v-model="localQuery"
          placeholder="Cari deskripsi atau kategori..."
          aria-label="Cari transaksi"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.finance-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &__controls {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-wrap: wrap;
    justify-content: flex-end;

    .filter-box {
      width: 180px;
    }

    .search-box {
      width: 260px;
      max-width: 100%;
    }
  }
}
</style>

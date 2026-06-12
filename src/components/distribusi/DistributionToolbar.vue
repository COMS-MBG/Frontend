<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDistribution } from '@/composables/useDistribution'
import { useDebounce } from '@/composables/useDebounce'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import type { SelectOption } from '@/types/form'

const { filters, setSearchQuery, setPerPage, setFilter } = useDistribution()

// ── Search State & Debounce ───────────────────────────
const localSearch = ref('')
const debouncedSearch = useDebounce(localSearch, 300)

watch(debouncedSearch, (newVal) => {
  setSearchQuery(newVal)
})

function onSearchInput(val: string) {
  localSearch.value = val
}

// ── Show Entries Filter ───────────────────────────────
const perPageOptions: SelectOption[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '25', value: 25 },
]

function onPerPageChange(val: number) {
  setPerPage(val)
}

// ── Status Filter ─────────────────────────────────────
const statusOptions: SelectOption[] = [
  { label: 'Semua Status', value: '' },
  { label: 'Menunggu', value: 'in_order' },
  { label: 'Diterima', value: 'accepted' },
  { label: 'Di Perjalanan', value: 'delivering' },
  { label: 'Terkirim', value: 'delivered' },
  { label: 'Dikonfirmasi', value: 'confirmed' },
  { label: 'Ditolak', value: 'rejected' },
  { label: 'Revisi Bukti', value: 'revision_required' },
]

const selectedStatus = ref('')

function onStatusChange(val: string | number | null) {
  const strVal = String(val ?? '')
  selectedStatus.value = strVal
  setFilter('status', strVal || undefined)
}
</script>

<template>
  <BaseTableToolbar
    :search-value="localSearch"
    @update:search-value="onSearchInput"
    :show-search="true"
    :show-filter="true"
    :show-per-page="true"
    :per-page-value="filters.per_page"
    :per-page-options="perPageOptions"
    @update:per-page-value="onPerPageChange"
    :show-add="false"
    :show-import="false"
    :show-export="false"
    search-placeholder="Cari sekolah atau kurir..."
  >
    <!-- Status Filter -->
    <template #filter>
      <AppSelect
        :model-value="selectedStatus"
        :options="statusOptions"
        placeholder="Semua Status"
        @update:model-value="onStatusChange"
      />
    </template>
  </BaseTableToolbar>
</template>

<template>
  <BaseTableToolbar
    :search-value="localSearch"
    @update:search-value="onSearchInput"
    :show-search="true"
    :show-filter="false"
    :show-per-page="true"
    :per-page-value="store.rowsPerPage"
    :per-page-options="perPageOptions"
    @update:per-page-value="onPerPageChange"
    :show-add="true"
    :show-import="true"
    :show-export="false"
    add-label="Tambah Partner"
    import-label="Import CSV"
    search-placeholder="Cari nama sekolah, kecamatan..."
    @add="$emit('add')"
    @import="$emit('import')"
  >
    <!-- Bentuk + Status filters on the left side -->
    <template #left-append>
      <div class="filter-group">
        <AppSelect
          :model-value="store.selectedBentuk"
          :options="bentukOptions"
          placeholder="Semua Bentuk"
          @update:model-value="onBentukChange"
        />
        <AppSelect
          :model-value="store.selectedStatus"
          :options="statusOptions"
          placeholder="Semua Status"
          @update:model-value="onStatusChange"
        />
      </div>
    </template>
  </BaseTableToolbar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePartnerStore } from '@/stores/partner.store'
import { useDebounce } from '@/composables/useDebounce'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import type { SelectOption } from '@/types/form'

defineEmits<{
  (e: 'add'): void
  (e: 'import'): void
}>()

const store = usePartnerStore()

// ── Search State & Debounce ───────────────────────────
const localSearch = ref(store.searchQuery)
const debouncedSearch = useDebounce(localSearch, 300)

watch(debouncedSearch, (newVal) => store.setSearchQuery(newVal))
watch(() => store.searchQuery, (val) => localSearch.value = val)

function onSearchInput(val: string) {
  localSearch.value = val
}

// ── Bentuk Filter ─────────────────────────────────────
const bentukOptions: SelectOption[] = [
  { label: 'Semua Bentuk', value: 'all' },
  { label: 'SMA', value: 'SMA' },
  { label: 'SMK', value: 'SMK' },
  { label: 'MA', value: 'MA' },
  { label: 'SD', value: 'SD' },
  { label: 'SMP', value: 'SMP' },
]

function onBentukChange(val: string | number | null) {
  store.setBentukFilter(String(val ?? 'all'))
}

// ── Status Filter ─────────────────────────────────────
const statusOptions: SelectOption[] = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Negeri', value: 'Negeri' },
  { label: 'Swasta', value: 'Swasta' },
]

function onStatusChange(val: string | number | null) {
  store.setStatusFilter(String(val ?? 'all'))
}

// ── Rows Per Page ─────────────────────────────────────
const perPageOptions: SelectOption[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
]

function onPerPageChange(val: number) {
  store.setRowsPerPage(val)
}
</script>

<style scoped lang="scss">
.filter-group {
  display: flex;
  align-items: center;
  gap: $space-2;
  margin-left: $space-3;

  :deep(.app-select) {
    min-width: 130px;
  }
}

@include mobile {
  .filter-group {
    margin-left: 0;
    width: 100%;
    flex-direction: column;

    :deep(.app-select) {
      width: 100%;
    }
  }
}
</style>

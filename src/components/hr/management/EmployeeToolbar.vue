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
    :show-add="store.canAdd"
    :show-import="false"
    :show-export="false"
    add-label="Tambah Karyawan"
    search-placeholder="Cari nama, NRP, atau departemen..."
    @add="$emit('add')"
  >
    <!-- Role Filter on the left side, right after the search input -->
    <template #left-append>
      <div class="filter-group">
        <AppSelect
          :model-value="store.selectedRole"
          :options="filterOptions"
          placeholder="Semua Role"
          @update:model-value="onFilterChange"
        />
      </div>
    </template>
  </BaseTableToolbar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEmployeeStore } from '@/stores/employee.store'
import { useDebounce } from '@/composables/useDebounce'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import type { SelectOption } from '@/types/form'

const emit = defineEmits<{
  (e: 'add'): void
}>()

const store = useEmployeeStore()

// ── Search State & Debounce ───────────────────────────
const localSearch = ref(store.searchQuery)
const debouncedSearch = useDebounce(localSearch, 300)

watch(debouncedSearch, (newVal) => store.setSearchQuery(newVal))
watch(() => store.searchQuery, (val) => localSearch.value = val)

function onSearchInput(val: string) {
  localSearch.value = val
}

// ── Role Filter ───────────────────────────────────────
const filterOptions: SelectOption[] = [
  { label: 'Semua Role', value: 'all' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Operator', value: 'Operator' },
  { label: 'Viewer', value: 'Viewer' },
]

function onFilterChange(val: string | number | null) {
  store.setRoleFilter(String(val ?? 'all'))
}

// ── Show Entries Filter ───────────────────────────────
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
@use '@/assets/styles/abstracts/variables' as *;

.filter-group {
  display: flex;
  align-items: center;
  gap: $space-2;
  margin-left: $space-3;

  .filter-label {
    font-size: $text-sm;
    color: $color-text-secondary;
    font-weight: 500;
    white-space: nowrap;
  }

  /* Fixed width to ensure dropdowns don't grow unpredictably */
  :deep(.app-select) {
    min-width: 120px;
  }
}
</style>
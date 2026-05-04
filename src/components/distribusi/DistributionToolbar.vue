<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDistributionStore } from '@/stores/distribution.store'
import { useDebounce } from '@/composables/useDebounce'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import BaseFilterDate from '@/components/common/BaseFilterDate.vue'
import type { SelectOption } from '@/types/form'

const store = useDistributionStore()

// ── Search State & Debounce ───────────────────────────
const localSearch = ref(store.searchQuery)
const debouncedSearch = useDebounce(localSearch, 300)

watch(debouncedSearch, (newVal) => {
  store.setSearchQuery(newVal)
})

watch(() => store.searchQuery, (val) => {
  localSearch.value = val
})

function onSearchInput(val: string) {
  localSearch.value = val
}

// ── Show Entries Filter ───────────────────────────────
const perPageOptions: SelectOption[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
]

function onPerPageChange(val: number) {
  store.setLimit(val)
}

// ── Upload Action ─────────────────────────────────────
const isUploading = ref(false)
const onUploadCsv = async () => {
  if (isUploading.value) return
  isUploading.value = true
  // Mock upload delay
  await new Promise(res => setTimeout(res, 800))
  isUploading.value = false
}
</script>

<template>
  <BaseTableToolbar
    :search-value="localSearch"
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
    search-placeholder="Cari sekolah atau kurir..."
  >
    <!-- Filter Date on the left side, right after the search input -->
    <template #left-append>
      <div class="filter-box">
        <BaseFilterDate 
          v-model="store.selectedDateFilter" 
          aria-label="Filter Tanggal"
        />
      </div>
    </template>

    <!-- Custom Primary Upload Button -->
    <template #right-append>
      <button 
        class="btn-primary btn-with-icon toolbar-btn" 
        @click="onUploadCsv"
        :disabled="isUploading"
      >
        <span v-if="isUploading" class="material-symbols-outlined is-spinning">sync</span>
        <span v-else class="material-symbols-outlined">upload_file</span>
        {{ isUploading ? 'Mengunggah...' : 'Unggah CSV' }}
      </button>
    </template>
  </BaseTableToolbar>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.filter-box {
  display: flex;
  align-items: center;
  margin-left: $space-3;
}
</style>

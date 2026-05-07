<script setup lang="ts">
import { useDistributionStore } from '@/stores/distribution.store'
import DistributionRow from './DistributionRow.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'

const store = useDistributionStore()

const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NAMA SEKOLAH', align: 'left' },
  { label: 'KEBUTUHAN PORSI', align: 'left' },
  { label: 'ESTIMASI JARAK (KM)', align: 'left' },
  { label: 'KURIR/ARMADA', align: 'left' },
  { label: 'STATUS', align: 'left' },
  { label: 'AKSI', align: 'left' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'text', width: '120px' },
  { type: 'text', width: '80px' },
  { type: 'text', width: '80px' },
  { type: 'avatar-text' },
  { type: 'badge' },
  { type: 'text', width: '120px' },
]
</script>

<template>
  <div class="distribution-table-container">
    <BaseTableSkeleton
      v-if="store.isLoading"
      :rows="5"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <div v-else class="base-table-wrapper">
      <table class="base-table">
      <thead>
        <tr>
          <th>NAMA SEKOLAH</th>
          <th>KEBUTUHAN PORSI</th>
          <th>ESTIMASI JARAK (KM)</th>
          <th>KURIR/ARMADA</th>
          <th>STATUS</th>
          <th>AKSI</th>
        </tr>
      </thead>
      <tbody>
        <DistributionRow 
          v-for="item in store.paginated" 
          :key="item.id" 
          :item="item" 
        />
        <tr v-if="store.paginated.length === 0">
          <td colspan="6" class="text-center">Data tidak ditemukan</td>
        </tr>
      </tbody>
    </table>
    
    <!-- Pagination Controls -->
    <div v-if="store.totalPages > 1 && !store.isLoading" class="pagination-controls">
      <button 
        class="btn-secondary btn-sm" 
        :disabled="store.page === 1"
        @click="store.setPage(store.page - 1)"
      >
        Prev
      </button>
      <span class="page-info">Halaman {{ store.page }} dari {{ store.totalPages }}</span>
      <button 
        class="btn-secondary btn-sm" 
        :disabled="store.page === store.totalPages"
        @click="store.setPage(store.page + 1)"
      >
        Next
      </button>
    </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.pagination-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: $space-4;
  padding: $space-4;
  border-top: 1px solid $color-border-light;
  background-color: $color-bg-surface;

  .page-info {
    font-size: $text-base;
    font-weight: 500;
    color: $color-text-secondary;
  }
}
</style>

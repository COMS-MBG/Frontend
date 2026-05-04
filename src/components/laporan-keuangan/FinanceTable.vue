<script setup lang="ts">
import { useFinanceStore } from '@/stores/finance.store'
import FinanceRow from './FinanceRow.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'

const store = useFinanceStore()

const skeletonHeaders: SkeletonHeader[] = [
  { label: 'TANGGAL', align: 'left' },
  { label: 'KATEGORI', align: 'left' },
  { label: 'DESKRIPSI', align: 'left' },
  { label: 'JUMLAH', align: 'right' },
  { label: 'STATUS', align: 'left' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'text', width: '100px' },
  { type: 'badge' },
  { type: 'text', width: '180px' },
  { type: 'text', width: '120px', align: 'right' },
  { type: 'badge' },
]
</script>

<template>
  <div class="finance-table-container">
    <BaseTableSkeleton
      v-if="store.loading"
      :rows="5"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <div v-else class="base-table-wrapper">
      <table class="base-table">
        <thead>
          <tr>
            <th>TANGGAL</th>
            <th>KATEGORI</th>
            <th>DESKRIPSI</th>
            <th class="th-right">JUMLAH</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <FinanceRow
            v-for="item in store.paginatedReports"
            :key="item.id"
            :item="item"
          />
          <tr v-if="store.paginatedReports.length === 0">
            <td colspan="5" class="empty-cell">
              <BaseEmptyState
                icon="receipt_long"
                title="Tidak Ada Transaksi"
                description="Belum ada data transaksi keuangan yang sesuai dengan filter Anda."
                :actionLabel="undefined"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="store.totalPages > 1" class="pagination-wrapper">
        <BasePagination
          :model-value="store.page"
          :total="store.filteredReports.length"
          :per-page="store.limit"
          item-label="transaksi"
          @update:model-value="store.setPage($event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.th-right {
  text-align: right;
}

.pagination-wrapper {
  padding: $space-4;
  border-top: 1px solid $color-border-light;
  background-color: $color-bg-surface;
}

.empty-cell {
  padding: 0 !important;
  border-bottom: none;

  :deep(.base-empty-state) {
    box-shadow: none;
    border-radius: 0;
    background-color: transparent;
  }
}
</style>

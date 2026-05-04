<script setup lang="ts">
import { useLaporanStore } from '@/stores/laporan.store'
import ReportRow from './ReportRow.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'

const store = useLaporanStore()

const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NAMA SEKOLAH', align: 'left' },
  { label: 'TANGGAL', align: 'left' },
  { label: 'STATUS', align: 'left' },
  { label: 'DURASI', align: 'left' },
  { label: 'KETERANGAN', align: 'left' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'text', width: '140px' },
  { type: 'text', width: '100px' },
  { type: 'badge' },
  { type: 'text', width: '80px' },
  { type: 'text', width: '160px' },
]
</script>

<template>
  <div class="report-table-container">
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
            <th>NAMA SEKOLAH</th>
            <th>TANGGAL</th>
            <th>STATUS</th>
            <th>DURASI</th>
            <th>KETERANGAN</th>
          </tr>
        </thead>
        <tbody>
          <ReportRow
            v-for="item in store.paginatedReports"
            :key="item.id"
            :item="item"
          />
          <tr v-if="store.paginatedReports.length === 0">
            <td colspan="5" class="text-center">Data tidak ditemukan</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div v-if="store.totalPages > 1" class="pagination-wrapper">
        <BasePagination
          v-model="store.page"
          :total="store.filteredReports.length"
          :per-page="store.limit"
          item-label="laporan"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pagination-wrapper {
  padding: $space-4;
  border-top: 1px solid $color-border-light;
  background-color: $color-bg-surface;
}
</style>

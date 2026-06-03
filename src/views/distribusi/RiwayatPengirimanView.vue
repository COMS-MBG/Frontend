<script setup lang="ts">
import { onMounted } from 'vue'
import { useDeliveryHistory } from '@/composables/useDeliveryHistory'
import PageHeader from '@/components/common/PageHeader.vue'
import DeliveryHistoryAnalyticsCards from '@/components/distribusi/history/DeliveryHistoryAnalyticsCards.vue'
import DeliveryHistoryToolbar from '@/components/distribusi/history/DeliveryHistoryToolbar.vue'
import DeliveryHistoryTable from '@/components/distribusi/history/DeliveryHistoryTable.vue'
import DeliveryHistoryDetailModal from '@/components/distribusi/history/DeliveryHistoryDetailModal.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'

import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'

const {
  histories,
  selectedHistory,
  analytics,
  dateRange,
  meta,
  isLoading,
  hasInitialized,
  error,
  analyticsError,
  hasData,
  
  refreshData,
  openDetail,
  closeDetail,
  setDateRange,
  changePage,
  changePerPage
} = useDeliveryHistory()

const skeletonHeaders: SkeletonHeader[] = [
  { label: 'TANGGAL SELESAI', align: 'left' },
  { label: 'KURIR', align: 'left' },
  { label: 'SEKOLAH TUJUAN', align: 'left' },
  { label: 'KENDARAAN', align: 'left' },
  { label: 'DURASI PERJALANAN', align: 'left' },
  { label: 'JARAK TEMPUH', align: 'left' },
  { label: 'AKSI', align: 'left' }
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'text', width: '120px' },
  { type: 'avatar-text' },
  { type: 'avatar-text' },
  { type: 'text', width: '90px' },
  { type: 'text', width: '100px' },
  { type: 'text', width: '80px' },
  { type: 'text', width: '80px' }
]

onMounted(() => {
  // Load initial data (table + analytics)
  refreshData(1)
})
</script>

<template>
  <div class="riwayat-pengiriman-view">
    <PageHeader
      title="Riwayat Pengiriman"
      subtitle="Lihat riwayat perjalanan pengiriman makanan oleh kurir."
      :breadcrumb="['Distribusi', 'Riwayat Pengiriman']"
    />
    
    <!-- Analytics Cards (Silent background loader will not trigger flashing card loading screen) -->
    <DeliveryHistoryAnalyticsCards
      :analytics="analytics"
      :analytics-error="analyticsError"
    />
    
    <!-- Filter Toolbar -->
    <DeliveryHistoryToolbar
      :date-range="dateRange"
      @update:date-range="setDateRange"
      :per-page="meta.per_page"
      @update:per-page="changePerPage"
    />
    
    <!-- Initial Loading State -->
    <BaseTableSkeleton
      v-if="isLoading && !hasInitialized"
      :rows="meta.per_page"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />
    
    <!-- Error State (Only show if there's an error AND no stale data remains on screen) -->
    <BaseEmptyState
      v-else-if="error && !hasData"
      icon="error"
      title="Gagal Memuat Data"
      :description="error"
      action-label="Coba Lagi"
      action-icon="refresh"
      @action="refreshData(meta.current_page)"
    />
    
    <!-- Empty State -->
    <BaseEmptyState
      v-else-if="histories.length === 0"
      icon="history"
      title="Tidak ada riwayat pengiriman"
      description="Belum ada pengiriman yang diselesaikan untuk filter tanggal yang dipilih."
    />
    
    <!-- Content Section -->
    <template v-else>
      <DeliveryHistoryTable
        :histories="histories"
        :meta="meta"
        @view-detail="openDetail"
        @change-page="changePage"
      />
    </template>

    <!-- Details View Modal -->
    <DeliveryHistoryDetailModal
      :is-open="!!selectedHistory"
      :history="selectedHistory"
      @close="closeDetail"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.riwayat-pengiriman-view {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}
</style>

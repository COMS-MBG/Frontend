<script setup lang="ts">
import type { DeliveryHistory, DeliveryHistoryListMeta } from '@/types/deliveryHistory'
import DeliveryHistoryRow from './DeliveryHistoryRow.vue'
import BasePagination from '@/components/common/BasePagination.vue'

defineProps<{
  histories: DeliveryHistory[]
  meta: DeliveryHistoryListMeta
}>()

defineEmits<{
  (e: 'view-detail', history: DeliveryHistory): void
  (e: 'change-page', page: number): void
}>()
</script>

<template>
  <div class="base-table-wrapper">
    <table class="base-table">
      <caption class="sr-only">Riwayat Pengiriman Makanan</caption>
      <thead>
        <tr>
          <th>TANGGAL SELESAI</th>
          <th>KURIR</th>
          <th>SEKOLAH TUJUAN</th>
          <th>KENDARAAN</th>
          <th>DURASI PERJALANAN</th>
          <th>JARAK TEMPUH</th>
          <th>AKSI</th>
        </tr>
      </thead>
      <tbody>
        <DeliveryHistoryRow
          v-for="history in histories"
          :key="history.id"
          :history="history"
          @view-detail="$emit('view-detail', history)"
        />
      </tbody>
    </table>

    <!-- Pagination Controls (Inside the wrapper card) -->
    <div v-if="meta.total > meta.per_page" class="pagination-controls">
      <BasePagination
        :model-value="meta.current_page"
        :total="meta.total"
        :per-page="meta.per_page"
        item-label="riwayat"
        @update:model-value="page => $emit('change-page', page)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.pagination-controls {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border-light;
  background-color: $color-bg-surface;
}

// Accessibility utility
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useDistribution } from '@/composables/useDistribution'
import DistributionRow from './DistributionRow.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import ConfirmActionModal from '@/components/common/ConfirmActionModal.vue'
import { revisionNotesSchema } from '@/validation/distribution.schema'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'

const {
  filteredItems,
  isLoading,
  pagination,
  filters,
  setPage,
  submitTask,
  confirmDelivery,
  requestRevision,
  isSubmitting,
  fetchSchedule,
} = useDistribution()

const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NAMA SEKOLAH', align: 'left' },
  { label: 'KURIR/ARMADA', align: 'left' },
  { label: 'KENDARAAN', align: 'left' },
  { label: 'WAKTU JADWAL', align: 'left' },
  { label: 'STATUS', align: 'left' },
  { label: 'AKSI', align: 'left' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'text', width: '120px' },
  { type: 'avatar-text' },
  { type: 'text', width: '80px' },
  { type: 'text', width: '100px' },
  { type: 'badge' },
  { type: 'text', width: '120px' },
]

// ── Modal states & active schedule tracking ───────────────
const activeScheduleId = ref<number | null>(null)
const showSubmitModal = ref(false)
const showConfirmModal = ref(false)
const showRevisionModal = ref(false)

function onOpenSubmit(id: number) {
  activeScheduleId.value = id
  showSubmitModal.value = true
}

function onOpenConfirm(id: number) {
  activeScheduleId.value = id
  showConfirmModal.value = true
}

function onOpenRevision(id: number) {
  activeScheduleId.value = id
  showRevisionModal.value = true
}

async function onSubmitConfirm() {
  if (activeScheduleId.value === null) return
  const success = await submitTask(activeScheduleId.value)
  if (success) {
    showSubmitModal.value = false
  }
}

async function onConfirmConfirm() {
  if (activeScheduleId.value === null) return
  const success = await confirmDelivery(activeScheduleId.value)
  if (success) {
    showConfirmModal.value = false
  }
}

async function onRevisionConfirm(notes: string) {
  if (activeScheduleId.value === null) return
  const success = await requestRevision(activeScheduleId.value, notes)
  if (success) {
    showRevisionModal.value = false
  }
}
</script>

<template>
  <div class="distribution-table-container">
    <BaseTableSkeleton
      v-if="isLoading"
      :rows="5"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <template v-else>
      <!-- Empty State -->
      <BaseEmptyState
        v-if="filteredItems.length === 0"
        icon="local_shipping"
        title="Belum ada jadwal pengiriman"
        description="Data pengiriman akan muncul di sini setelah jadwal dibuat."
      />

      <!-- Table -->
      <div v-else class="base-table-wrapper">
        <table class="base-table">
          <caption class="sr-only">Daftar Jadwal Pengiriman</caption>
          <thead>
            <tr>
              <th>NAMA SEKOLAH</th>
              <th>KURIR/ARMADA</th>
              <th>KENDARAAN</th>
              <th>WAKTU JADWAL</th>
              <th>STATUS</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            <DistributionRow
              v-for="item in filteredItems"
              :key="item.id"
              :item="item"
              @submit="onOpenSubmit"
              @confirm="onOpenConfirm"
              @revision="onOpenRevision"
              @view-detail="fetchSchedule"
            />
          </tbody>
        </table>

        <!-- Server-Side Pagination Controls -->
        <div v-if="pagination.total > filters.per_page" class="pagination-controls">
          <BasePagination
            :model-value="pagination.current_page"
            :total="pagination.total"
            :per-page="filters.per_page"
            item-label="jadwal"
            @update:model-value="setPage"
          />
        </div>
      </div>
    </template>

    <!-- ── Confirmation Modals (Single Instances) ── -->

    <!-- Submit Task Confirmation -->
    <ConfirmActionModal
      v-model="showSubmitModal"
      title="Kirim Tugas ke Kurir"
      message="Apakah Anda yakin ingin mengirimkan tugas pengiriman ini ke kurir? Kurir akan menerima notifikasi setelah tugas dikirim."
      icon="send"
      variant="primary"
      confirm-label="Kirim Tugas"
      confirm-icon="send"
      :is-submitting="isSubmitting"
      @confirm="onSubmitConfirm"
    />

    <!-- Confirm Delivery -->
    <ConfirmActionModal
      v-model="showConfirmModal"
      title="Konfirmasi Pengiriman"
      message="Apakah Anda yakin ingin mengonfirmasi bahwa pengiriman ini telah berhasil diterima oleh sekolah?"
      icon="verified"
      variant="success"
      confirm-label="Konfirmasi"
      confirm-icon="verified"
      :is-submitting="isSubmitting"
      @confirm="onConfirmConfirm"
    />

    <!-- Request Revision (with notes input + Zod schema) -->
    <ConfirmActionModal
      v-model="showRevisionModal"
      title="Minta Revisi Pengiriman"
      message="Berikan catatan revisi untuk kurir agar bukti pengiriman diperbaiki."
      icon="edit_note"
      variant="warning"
      confirm-label="Kirim Revisi"
      confirm-icon="edit_note"
      :is-submitting="isSubmitting"
      :show-input="true"
      input-label="Catatan Revisi"
      input-placeholder="Contoh: Mohon kirim ulang foto bukti pengiriman yang lebih jelas..."
      :require-input="true"
      :min-input-length="10"
      :schema="revisionNotesSchema"
      @confirm="onRevisionConfirm"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.pagination-controls {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border-light;
  background-color: $color-bg-surface;
}

// Visually hidden but accessible to screen readers
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

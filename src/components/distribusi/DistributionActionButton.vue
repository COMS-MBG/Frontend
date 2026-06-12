<script setup lang="ts">
import type { ScheduleStatus } from '@/types/distribution'
import { useDistribution } from '@/composables/useDistribution'

const props = defineProps<{
  id: number
  status: ScheduleStatus
}>()

const emit = defineEmits<{
  (e: 'submit', id: number): void
  (e: 'confirm', id: number): void
  (e: 'revision', id: number): void
}>()

const { isSubmitting, fetchSchedule } = useDistribution()

function handleViewDetail() {
  fetchSchedule(props.id)
}
</script>

<template>
  <div class="distribution-action">
    <!-- in_order: Admin can submit task to courier -->
    <button
      v-if="status === 'in_order'"
      class="btn-primary btn-sm"
      :disabled="isSubmitting"
      @click="emit('submit', id)"
      aria-label="Kirim Tugas"
    >
      <span class="material-symbols-outlined">send</span>
      Kirim Tugas
    </button>

    <!-- accepted: Courier accepted, awaiting departure -->
    <span v-else-if="status === 'accepted'" class="distribution-action__text distribution-action__text--info" role="status">
      <span class="material-symbols-outlined">check_circle</span>
      Diterima Kurir
    </span>

    <!-- delivering: In transit -->
    <span v-else-if="status === 'delivering'" class="distribution-action__text distribution-action__text--active" role="status">
      <span class="material-symbols-outlined">local_shipping</span>
      Sedang Dikirim
    </span>

    <!-- delivered: Admin can confirm or request revision -->
    <div v-else-if="status === 'delivered'" class="distribution-action__group">
      <button
        class="btn-success btn-sm"
        :disabled="isSubmitting"
        @click="emit('confirm', id)"
        aria-label="Konfirmasi"
      >
        <span class="material-symbols-outlined">verified</span>
        Konfirmasi
      </button>
      <button
        class="btn-warning btn-sm"
        :disabled="isSubmitting"
        @click="emit('revision', id)"
        aria-label="Minta Revisi"
      >
        <span class="material-symbols-outlined">edit_note</span>
        Revisi
      </button>
    </div>

    <!-- confirmed: Done — view report -->
    <button
      v-else-if="status === 'confirmed'"
      class="distribution-action__link-btn"
      type="button"
      @click="handleViewDetail"
      aria-label="Lihat Laporan"
    >
      <span class="material-symbols-outlined">description</span>
      Lihat Laporan
    </button>

    <!-- rejected: Rejected by courier -->
    <span v-else-if="status === 'rejected'" class="distribution-action__text distribution-action__text--danger" role="status">
      <span class="material-symbols-outlined">cancel</span>
      Ditolak
    </span>

    <!-- revision_required: Waiting for courier to resubmit -->
    <span v-else-if="status === 'revision_required'" class="distribution-action__text distribution-action__text--warning" role="status">
      <span class="material-symbols-outlined">pending</span>
      Menunggu Revisi
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.distribution-action {
  &__group {
    display: flex;
    gap: $space-2;
    flex-wrap: wrap;
  }

  &__text {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: $text-sm;
    font-weight: 500;

    .material-symbols-outlined {
      font-size: 16px;
    }

    &--info    { color: $color-text-secondary; }
    &--active  { color: $color-primary; }
    &--danger  { color: $color-danger; }
    &--warning { color: $color-warning; }
  }

  // Semantic button replacing <a href="#">
  &__link-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: $text-sm;
    font-weight: 500;
    color: $color-primary;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: $font-body;

    &:hover {
      text-decoration: underline;
    }

    .material-symbols-outlined {
      font-size: 16px;
    }
  }

  .btn-sm {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    .material-symbols-outlined {
      font-size: 16px;
    }
  }
}
</style>

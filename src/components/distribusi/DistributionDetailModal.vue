<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import DistributionStatusBadge from './DistributionStatusBadge.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import { formatDateTime } from '@/utils/format'
import { getVehicleLabel } from '@/utils/distribution'
import type { DeliverySchedule } from '@/types/distribution'

const props = defineProps<{
  modelValue: boolean
  schedule: DeliverySchedule | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const courierName = computed(() => props.schedule?.courier?.name ?? 'Belum Ditugaskan')
const schoolName = computed(() => props.schedule?.school?.name ?? 'Sekolah Tidak Diketahui')
const schoolAddress = computed(() => props.schedule?.school?.address ?? '—')
</script>

<template>
  <BaseModal v-model="open" title="Detail Pengiriman" size="md">
    <div v-if="schedule" class="detail-modal">
      <!-- Status -->
      <div class="detail-modal__header">
        <DistributionStatusBadge :status="schedule.status" />
        <span v-if="schedule.scheduled_at" class="detail-modal__date">
          {{ formatDateTime(schedule.scheduled_at) }}
        </span>
      </div>

      <!-- School Info -->
      <div class="detail-modal__section">
        <h4 class="detail-modal__section-title">
          <span class="material-symbols-outlined">school</span>
          Sekolah Tujuan
        </h4>
        <p class="detail-modal__value">{{ schoolName }}</p>
        <p class="detail-modal__sub">{{ schoolAddress }}</p>
      </div>

      <!-- Courier Info -->
      <div class="detail-modal__section">
        <h4 class="detail-modal__section-title">
          <span class="material-symbols-outlined">person</span>
          Kurir
        </h4>
        <div class="detail-modal__courier">
          <UserAvatar :name="courierName" size="md" />
          <div>
            <p class="detail-modal__value">{{ courierName }}</p>
            <p class="detail-modal__sub">{{ getVehicleLabel(schedule.vehicle_type) }}
              <template v-if="schedule.vehicle_plate"> · {{ schedule.vehicle_plate }}</template>
            </p>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="detail-modal__section">
        <h4 class="detail-modal__section-title">
          <span class="material-symbols-outlined">timeline</span>
          Timeline
        </h4>
        <ul class="detail-modal__timeline">
          <li v-if="schedule.scheduled_at">
            <strong>Dijadwalkan:</strong> {{ formatDateTime(schedule.scheduled_at) }}
          </li>
          <li v-if="schedule.departed_at">
            <strong>Berangkat:</strong> {{ formatDateTime(schedule.departed_at) }}
          </li>
          <li v-if="schedule.arrived_at">
            <strong>Tiba:</strong> {{ formatDateTime(schedule.arrived_at) }}
          </li>
          <li v-if="schedule.confirmation?.confirmed_at">
            <strong>Dikonfirmasi:</strong> {{ formatDateTime(schedule.confirmation.confirmed_at) }}
            <span v-if="schedule.confirmation.confirmed_by"> oleh {{ schedule.confirmation.confirmed_by }}</span>
          </li>
        </ul>
      </div>

      <!-- Proof Photo -->
      <div v-if="schedule.proof?.photo_url" class="detail-modal__section">
        <h4 class="detail-modal__section-title">
          <span class="material-symbols-outlined">photo_camera</span>
          Bukti Pengiriman
        </h4>
        <img :src="schedule.proof.photo_url" alt="Bukti Pengiriman" class="detail-modal__proof-img" />
      </div>

      <!-- Rejection Info -->
      <div v-if="schedule.rejection" class="detail-modal__section detail-modal__section--danger">
        <h4 class="detail-modal__section-title">
          <span class="material-symbols-outlined">warning</span>
          Alasan Penolakan
        </h4>
        <p class="detail-modal__value">{{ schedule.rejection.reason }}</p>
      </div>

      <!-- Revision Notes -->
      <div v-if="schedule.revision_notes" class="detail-modal__section detail-modal__section--warning">
        <h4 class="detail-modal__section-title">
          <span class="material-symbols-outlined">edit_note</span>
          Catatan Revisi
        </h4>
        <p class="detail-modal__value">{{ schedule.revision_notes }}</p>
      </div>

      <!-- Delivery Notes -->
      <div v-if="schedule.delivery_notes" class="detail-modal__section">
        <h4 class="detail-modal__section-title">
          <span class="material-symbols-outlined">notes</span>
          Catatan Pengiriman
        </h4>
        <p class="detail-modal__value">{{ schedule.delivery_notes }}</p>
      </div>
    </div>

    <template #footer>
      <button class="btn-secondary" type="button" @click="open = false">Tutup</button>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.detail-modal {
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
  }

  &__date {
    font-size: $text-sm;
    color: $color-text-muted;
  }

  &__section {
    padding: $space-4;
    background-color: $color-bg-subtle;
    border-radius: $radius-md;

    &--danger {
      background-color: $color-danger-bg;
    }

    &--warning {
      background-color: $color-warning-bg;
    }
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    font-weight: 700;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 $space-3 0;

    .material-symbols-outlined {
      font-size: 1.1rem;
    }
  }

  &__courier {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__value {
    font-size: $text-base;
    font-weight: 500;
    color: $color-text-primary;
    margin: 0;
  }

  &__sub {
    font-size: $text-sm;
    color: $color-text-muted;
    margin: $space-1 0 0 0;
  }

  &__timeline {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $space-2;

    li {
      font-size: $text-sm;
      color: $color-text-secondary;

      strong {
        color: $color-text-primary;
        font-weight: 600;
        margin-right: $space-1;
      }
    }
  }

  &__proof-img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: $radius-md;
    border: 1px solid $color-border;
  }
}
</style>

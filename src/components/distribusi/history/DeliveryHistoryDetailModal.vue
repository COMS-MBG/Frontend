<script setup lang="ts">
import type { DeliveryHistory } from '@/types/deliveryHistory'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import {
  formatDuration,
  formatDistance,
  formatVehicleType,
  formatConfirmationDate
} from '@/utils/deliveryHistory'

defineProps<{
  isOpen: boolean
  history: DeliveryHistory | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <BaseModal
    :model-value="isOpen"
    @update:model-value="emit('close')"
    title="Detail Riwayat Pengiriman"
    size="lg"
  >
    <div v-if="history" class="delivery-detail">
      <!-- Top Overview Panel -->
      <div class="detail-header-panel">
        <div class="school-info">
          <span class="label">Sekolah Tujuan</span>
          <h3>{{ history.school_name }}</h3>
          <p class="address"><span class="material-symbols-outlined icon">location_on</span> {{ history.school_address }}</p>
        </div>
        <div class="status-info">
          <span class="label">Status Pengiriman</span>
          <BaseBadge variant="success" text="TERKIRIM &amp; DIKONFIRMASI" />
        </div>
      </div>

      <div class="detail-grid">
        <!-- Delivery Agent Card -->
        <div class="detail-card">
          <div class="card-header">
            <span class="material-symbols-outlined header-icon">badge</span>
            <h4>Informasi Kurir &amp; Armada</h4>
          </div>
          <div class="card-body">
            <div class="info-row align-center">
              <UserAvatar :name="history.courier_name" size="md" />
              <div>
                <div class="info-value text-bold">{{ history.courier_name }}</div>
                <div class="info-label">Nama Kurir</div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="info-grid">
              <div class="info-col">
                <span class="info-label">Jenis Kendaraan</span>
                <span class="info-value font-medium">{{ formatVehicleType(history.vehicle_type) }}</span>
              </div>
              <div class="info-col">
                <span class="info-label">Plat Nomor</span>
                <span class="info-value monospace font-bold">{{ history.vehicle_plate || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Speed & Distance Card -->
        <div class="detail-card">
          <div class="card-header">
            <span class="material-symbols-outlined header-icon">speed</span>
            <h4>Waktu &amp; Jarak Tempuh</h4>
          </div>
          <div class="card-body flex-column justify-between">
            <div class="info-grid cols-2 gap-y-4">
              <div class="info-col">
                <span class="info-label">Waktu Berangkat</span>
                <span class="info-value">{{ history.departed_at ? formatConfirmationDate(history.departed_at) : '-' }}</span>
              </div>
              <div class="info-col">
                <span class="info-label">Waktu Tiba</span>
                <span class="info-value">{{ history.arrived_at ? formatConfirmationDate(history.arrived_at) : '-' }}</span>
              </div>
              <div class="info-col">
                <span class="info-label">Durasi Perjalanan</span>
                <span class="info-value font-bold text-primary">{{ formatDuration(history.duration_minutes) }}</span>
              </div>
              <div class="info-col">
                <span class="info-label">Jarak Tempuh</span>
                <span class="info-value font-bold text-success">{{ formatDistance(history.distance_km) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Logs Panel -->
      <div class="detail-card full-width mt-6">
        <div class="card-header">
          <span class="material-symbols-outlined header-icon">verified</span>
          <h4>Log Konfirmasi Admin</h4>
        </div>
        <div class="card-body">
          <div class="info-grid cols-3">
            <div class="info-col">
              <span class="info-label">Dikonfirmasi Oleh</span>
              <span class="info-value font-medium">{{ history.confirmed_by || '-' }}</span>
            </div>
            <div class="info-col">
              <span class="info-label">Tanggal Konfirmasi</span>
              <span class="info-value">{{ formatConfirmationDate(history.confirmed_at) }}</span>
            </div>
            <div class="info-col">
              <span class="info-label">Tanggal Selesai</span>
              <span class="info-value">{{ formatConfirmationDate(history.created_at) }}</span>
            </div>
          </div>
          <div class="divider"></div>
          <div class="notes-container">
            <span class="info-label">Catatan Konfirmasi / Pengiriman</span>
            <p class="notes-text">{{ history.notes || 'Tidak ada catatan khusus yang disertakan.' }}</p>
          </div>
        </div>
      </div>

      <!-- Proof Photo Section -->
      <div v-if="history.proof_photo_url" class="proof-photo-section mt-6">
        <h4 class="section-title">
          <span class="material-symbols-outlined">photo_library</span>
          <span>Foto Bukti Pengiriman</span>
        </h4>
        <div class="proof-photo-frame">
          <img :src="history.proof_photo_url" alt="Bukti Penerimaan Sekolah" class="proof-photo-img" />
          <div class="proof-photo-overlay">
            <span class="material-symbols-outlined">zoom_in</span>
            <a :href="history.proof_photo_url" target="_blank" class="download-link">Buka Gambar Penuh</a>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="modal-actions">
        <button type="button" class="btn-primary" @click="emit('close')">
          Tutup Detail
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.delivery-detail {
  display: flex;
  flex-direction: column;
  color: $color-text-primary;
  font-family: $font-body;
}

.detail-header-panel {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: $space-4 $space-5;
  background-color: $color-bg-subtle;
  border-radius: $radius-lg;
  border-left: 4px solid $color-success;
  margin-bottom: $space-6;
  gap: $space-4;

  .school-info {
    flex: 1;

    h3 {
      font-size: $text-lg;
      font-weight: 700;
      margin: $space-1 0;
    }

    .address {
      font-size: $text-sm;
      color: $color-text-muted;
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0;

      .icon {
        font-size: 1.1rem;
        color: $color-danger;
      }
    }
  }

  .status-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $space-2;
  }

  .label {
    font-size: $text-xs;
    font-weight: 600;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: $space-6;
}

.detail-card {
  background-color: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3 $space-4;
    border-bottom: 1px solid $color-border-light;
    background-color: $color-bg-subtle;

    .header-icon {
      font-size: 1.25rem;
      color: $color-primary;
    }

    h4 {
      font-size: $text-sm;
      font-weight: 700;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .card-body {
    padding: $space-4;
  }
}

.info-row {
  display: flex;
  gap: $space-3;

  &.align-center {
    align-items: center;
  }
}

.info-grid {
  display: grid;
  gap: $space-4;

  &.cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  &.cols-3 {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  &.gap-y-4 {
    row-gap: $space-4;
  }
}

.info-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: $text-xs;
  color: $color-text-muted;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: $text-sm;
  color: $color-text-primary;

  &.text-bold {
    font-weight: 700;
  }

  &.font-medium {
    font-weight: 500;
  }

  &.font-bold {
    font-weight: 700;
  }

  &.text-primary {
    color: $color-primary;
  }

  &.text-success {
    color: $color-success;
  }

  &.monospace {
    font-family: monospace;
    font-size: $text-sm;
  }
}

.divider {
  height: 1px;
  background-color: $color-border-light;
  margin: $space-4 0;
}

.notes-container {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  .notes-text {
    font-size: $text-sm;
    color: $color-text-secondary;
    background-color: $color-bg-subtle;
    border-radius: $radius-md;
    padding: $space-3;
    margin: 0;
    line-height: 1.5;
    border-left: 3px solid $color-border;
  }
}

.proof-photo-section {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  .section-title {
    font-size: $text-sm;
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    gap: $space-2;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    .material-symbols-outlined {
      color: $color-primary;
      font-size: 1.25rem;
    }
  }
}

.proof-photo-frame {
  position: relative;
  border-radius: $radius-lg;
  overflow: hidden;
  border: 1px solid $color-border;
  background-color: $color-bg-subtle;
  max-height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    .proof-photo-overlay {
      opacity: 1;
    }
  }

  .proof-photo-img {
    max-width: 100%;
    max-height: 380px;
    object-fit: contain;
  }
}

.proof-photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: $space-2;
  opacity: 0;
  transition: opacity $transition-base;

  .material-symbols-outlined {
    font-size: 2rem;
    color: #ffffff;
  }

  .download-link {
    color: #ffffff;
    font-size: $text-sm;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid #ffffff;
    border-radius: $radius-md;
    padding: 0.375rem $space-3;
    transition: all $transition-fast;

    &:hover {
      background-color: #ffffff;
      color: $color-text-primary;
    }
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.full-width {
  grid-column: 1 / -1;
}

.mt-6 {
  margin-top: $space-6;
}

@media (max-width: 768px) {
  .detail-header-panel {
    flex-direction: column;
    align-items: stretch;

    .status-info {
      align-items: flex-start;
      margin-top: $space-2;
    }
  }
}
</style>

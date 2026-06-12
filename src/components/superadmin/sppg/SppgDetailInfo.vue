<template>
  <div class="sppg-detail-info">
    <div class="info-grid">
      <!-- Card 1: Data SPPG -->
      <BaseCard class="info-card">
        <template #header>
          <div class="card-title">
            <span class="material-symbols-outlined icon">domain</span>
            <h3>Data SPPG</h3>
          </div>
        </template>
        <div class="card-body">
          <div class="detail-row">
            <span class="label">Nama SPPG</span>
            <span class="value">{{ sppg.name }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Alamat Lengkap</span>
            <span class="value">{{ sppg.address || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Kecamatan</span>
            <span class="value">{{ sppg.region?.district || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Kota/Kabupaten</span>
            <span class="value">{{ sppg.city || sppg.region?.city || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Provinsi</span>
            <span class="value">{{ sppg.province || sppg.region?.province || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Koordinat</span>
            <span class="value value--mono">{{ sppg.latitude.toFixed(6) }}, {{ sppg.longitude.toFixed(6) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Nomor Telepon</span>
            <span class="value">{{ sppg.phone || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Alamat Email</span>
            <span class="value">{{ sppg.email || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Pemilik SPPG</span>
            <span class="value">{{ sppg.owner?.name || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status Operasional</span>
            <span class="value">
              <BaseBadge :variant="sppg.status === 'active' ? 'success' : sppg.status === 'inactive' ? 'danger' : 'warning'">
                {{ sppg.status === 'active' ? 'Aktif' : sppg.status === 'inactive' ? 'Nonaktif' : 'Pending' }}
              </BaseBadge>
            </span>
          </div>
          <div class="detail-row">
            <span class="label">Tanggal Dibuat</span>
            <span class="value">{{ formatDate(sppg.created_at) }}</span>
          </div>
        </div>
      </BaseCard>

      <!-- Card 2: Kapasitas & Beban Kerja -->
      <BaseCard class="info-card">
        <template #header>
          <div class="card-title">
            <span class="material-symbols-outlined icon">bar_chart</span>
            <h3>Beban Kapasitas</h3>
          </div>
        </template>
        <div class="card-body">
          <div class="capacity-progress-section">
            <div class="progress-info">
              <span class="percentage">{{ capacity.percentage.toFixed(1) }}%</span>
              <span class="label">Kapasitas Terpakai</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar">
                <div class="progress-bar-fill" :class="capacityStatusClass" :style="{ width: `${Math.min(capacity.percentage, 100)}%` }" />
              </div>
            </div>
            <div class="capacity-status-indicator">
              <BaseBadge :variant="capacityBadgeVariant">
                {{ capacityStatusText }}
              </BaseBadge>
            </div>
          </div>

          <div class="detail-row">
            <span class="label">Total Kapasitas Maksimal</span>
            <span class="value highlight">{{ capacity.max.toLocaleString('id-ID') }} Porsi</span>
          </div>
          <div class="detail-row">
            <span class="label">Beban Porsi Saat Ini</span>
            <span class="value highlight">{{ capacity.current.toLocaleString('id-ID') }} Porsi</span>
          </div>
          <div class="detail-row">
            <span class="label">Sisa Kapasitas Tersedia</span>
            <span class="value highlight" :class="{ 'value--danger': capacity.available < 0 }">
              {{ capacity.available.toLocaleString('id-ID') }} Porsi
            </span>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SppgItem, SppgDetailResponse } from '@/types/superadmin-sppg'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const props = defineProps<{
  sppg: SppgItem
  capacity: SppgDetailResponse['capacity']
}>()

const capacityBadgeVariant = computed(() => {
  if (props.capacity.percentage >= 95) return 'danger'
  if (props.capacity.percentage >= 80) return 'warning'
  return 'success'
})

const capacityStatusClass = computed(() => {
  if (props.capacity.percentage >= 95) return 'bg-danger'
  if (props.capacity.percentage >= 80) return 'bg-warning'
  return 'bg-success'
})

const capacityStatusText = computed(() => {
  if (props.capacity.percentage >= 95) return 'Beban Kritis (Overcapacity)'
  if (props.capacity.percentage >= 80) return 'Peringatan Beban Tinggi'
  return 'Kapasitas Aman (Normal)'
})

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return '—'
  }
}
</script>

<style scoped lang="scss">
.sppg-detail-info {
  width: 100%;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-6;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.info-card {
  height: 100%;
}

.card-title {
  display: flex;
  align-items: center;
  gap: $space-2;

  .icon {
    font-size: 1.25rem;
    color: $color-primary;
  }

  h3 {
    margin: 0;
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-primary;
  }
}

.card-body {
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $color-border-light;
  padding-bottom: $space-3;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .label {
    font-size: $text-sm;
    color: $color-text-muted;
  }

  .value {
    font-size: $text-sm;
    font-weight: 500;
    color: $color-text-primary;
    text-align: right;

    &--mono {
      font-family: $font-mono;
      color: $color-text-secondary;
    }

    &.highlight {
      font-weight: 600;
    }

    &.value--danger {
      color: $color-danger;
    }
  }
}

// Capacity Progress CSS
.capacity-progress-section {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  padding: $space-4;
  background: $color-bg-subtle;
  border-radius: $radius-md;
  border: 1px solid $color-border-light;
  margin-bottom: $space-2;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  .percentage {
    font-size: $text-2xl;
    font-weight: 800;
    color: $color-text-primary;
  }

  .label {
    font-size: $text-xs;
    color: $color-text-muted;
  }
}

.progress-bar-wrap {
  width: 100%;
}

.progress-bar {
  height: 8px;
  background: $color-border;
  border-radius: $radius-pill;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: $radius-pill;
  transition: width $transition-smooth;

  &.bg-success {
    background-color: $color-success;
  }

  &.bg-warning {
    background-color: $color-warning;
  }

  &.bg-danger {
    background-color: $color-danger;
  }
}

.capacity-status-indicator {
  display: flex;
  justify-content: flex-start;
}
</style>

<template>
  <div class="sa-dashboard-stats">
    <!-- Card 1: SPPG Count -->
    <div class="kpi-card">
      <div class="kpi-card__top">
        <div class="kpi-icon icon-blue">
          <span class="material-symbols-outlined">domain</span>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">SPPG Terdaftar</span>
          <span class="kpi-value">{{ stats.total_sppg }}</span>
        </div>
      </div>
      <div class="kpi-card__bottom">
        <span class="tag-status status-active">{{ stats.total_sppg_active }} Aktif</span>
        <span class="tag-status status-inactive">{{ stats.total_sppg_inactive }} Nonaktif</span>
      </div>
    </div>

    <!-- Card 2: Porsi Makanan Harian -->
    <div class="kpi-card">
      <div class="kpi-card__top">
        <div class="kpi-icon icon-purple">
          <span class="material-symbols-outlined">restaurant</span>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Porsi Harian</span>
          <span class="kpi-value">{{ stats.total_daily_portions.toLocaleString('id-ID') }}</span>
        </div>
      </div>
      <div class="kpi-card__bottom">
        <span class="sub-text">Porsi makan bergizi gratis / hari</span>
      </div>
    </div>

    <!-- Card 3: Cakupan Sekolah Terlayani -->
    <div class="kpi-card">
      <div class="kpi-card__top">
        <div class="kpi-icon icon-green">
          <span class="material-symbols-outlined">school</span>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Cakupan Kemitraan</span>
          <span class="kpi-value">{{ coverage.served }} / {{ coverage.served + coverage.unserved }}</span>
        </div>
      </div>
      <div class="kpi-card__bottom flex-col">
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" :style="{ width: `${coverage.percentage}%` }"></div>
        </div>
        <span class="progress-label">{{ coverage.percentage }}% Sekolah Terlayani</span>
      </div>
    </div>

    <!-- Card 4: Antrean Draf Lokasi -->
    <div class="kpi-card" :class="{ 'has-alert': drafts.total > 0 }">
      <div class="kpi-card__top">
        <div class="kpi-icon icon-orange" :class="{ 'pulse-bg': drafts.total > 0 }">
          <span class="material-symbols-outlined">assignment</span>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Draf Menunggu</span>
          <span class="kpi-value">{{ drafts.total }}</span>
        </div>
      </div>
      <div class="kpi-card__bottom">
        <span class="sub-text alert-text" v-if="drafts.total > 0">Butuh konfirmasi lokasi GIS</span>
        <span class="sub-text" v-else>Semua titik pengajuan bersih</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardStats } from '@/types/superadmin-dashboard'

defineProps<{
  stats: DashboardStats
  coverage: {
    served: number
    unserved: number
    percentage: number
  }
  drafts: {
    total: number
    lastUpdated: string
    latestName: string
  }
}>()
</script>

<style scoped lang="scss">
.sa-dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-4;
  margin-bottom: $space-6;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.kpi-card {
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-4 $space-5;
  box-shadow: $shadow-sm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: $space-3-5;
  transition: transform $transition-fast, border-color $transition-fast;

  &:hover {
    transform: translateY(-2px);
    border-color: $color-primary-muted;
  }

  &.has-alert {
    border-color: rgba($color-warning, 0.4);
    background: rgba($color-warning, 0.01);
  }

  &__top {
    display: flex;
    align-items: center;
    gap: $space-4;
  }

  .kpi-icon {
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    .material-symbols-outlined {
      font-size: 1.5rem;
    }

    &.icon-blue { background: var(--color-primary); }
    &.icon-purple { background: var(--color-purple); }
    &.icon-green { background: var(--color-success); }
    &.icon-orange { background: var(--color-warning); }
  }

  .kpi-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .kpi-label {
    font-size: 10px;
    font-weight: 800;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .kpi-value {
    font-size: $text-xl;
    font-weight: 800;
    color: $color-text-primary;
    line-height: 1.1;
  }

  &__bottom {
    display: flex;
    align-items: center;
    gap: $space-3;
    border-top: 1px solid $color-border-light;
    padding-top: $space-3;

    &.flex-col {
      flex-direction: column;
      align-items: stretch;
      gap: $space-2;
    }

    .sub-text {
      font-size: 11px;
      color: $color-text-muted;

      &.alert-text {
        color: $color-warning-dark;
        font-weight: 600;
      }
    }
  }

  // Tags
  .tag-status {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: $radius-sm;

    &.status-active {
      background: $color-success-subtle;
      color: $color-success-dark;
    }

    &.status-inactive {
      background: $color-danger-bg;
      color: $color-danger-darker;
    }
  }

  // Progress Bar for Served school
  .progress-bar-wrap {
    width: 100%;
    height: 6px;
    background: $color-bg-subtle;
    border-radius: $radius-sm;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--color-success);
    border-radius: $radius-sm;
    transition: width 0.6s ease-in-out;
  }

  .progress-label {
    font-size: 10px;
    font-weight: 600;
    color: $color-text-secondary;
  }
}

.pulse-bg {
  animation: pulse-orange 2s infinite;
}

@keyframes pulse-orange {
  0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
}
</style>

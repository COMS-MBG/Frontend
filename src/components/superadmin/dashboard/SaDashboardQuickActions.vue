<template>
  <BaseCard class="sa-dashboard-card quick-actions-card">
    <template #header>
      <div class="sa-card-header">
        <span class="material-symbols-outlined header-icon">bolt</span>
        <h3>Quick Actions</h3>
      </div>
    </template>
    <div class="quick-actions-grid">
      <BaseCard
        class="action-item-card"
        hoverable
        clickable
        @click="$emit('navigate', 'super-admin-submission')"
        aria-label="Pengajuan SPPG Baru"
      >
        <div class="action-item-card__inner">
          <span class="material-symbols-outlined action-icon action-icon--purple">add_circle</span>
          <div class="action-text">
            <h4>Pengajuan SPPG Baru</h4>
            <p>Inisiasi & draf SPPG baru</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        class="action-item-card"
        hoverable
        clickable
        @click="$emit('navigate', 'super-admin-sppg')"
        aria-label="Kelola SPPG"
      >
        <div class="action-item-card__inner">
          <span class="material-symbols-outlined action-icon action-icon--blue">domain</span>
          <div class="action-text">
            <h4>Kelola SPPG</h4>
            <p>Kelola kapasitas & status SPPG</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        class="action-item-card"
        hoverable
        clickable
        @click="$emit('navigate', 'super-admin-map')"
        aria-label="Buka Map Rekomendasi"
      >
        <div class="action-item-card__inner">
          <span class="material-symbols-outlined action-icon action-icon--green">map</span>
          <div class="action-text">
            <h4>Map Rekomendasi</h4>
            <p>Visualisasi spasial & Rekomendasi Lokasi</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/components/common/BaseCard.vue'

defineEmits<{
  (e: 'navigate', routeName: string): void
}>()
</script>

<style scoped lang="scss">
.sa-dashboard-card {
  background: $color-bg-surface;
  border-radius: $radius-lg;
  box-shadow: $shadow-xs;
  overflow: hidden;
  border: 1px solid $color-border;
  display: flex;
  flex-direction: column;
}

.sa-card-header {
  display: flex;
  align-items: center;
  gap: $space-2;
  border-bottom: 1px solid $color-border-light;
  padding: $space-4 $space-5;

  .header-icon {
    font-size: 1.2rem;
    color: $color-primary;
  }

  h3 {
    font-size: $text-sm;
    font-weight: 700;
    color: $color-text-primary;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.quick-actions-card {
  height: 250px;

  .quick-actions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $space-3;
    padding: $space-5;
    flex-grow: 1;
    align-items: center;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      padding: $space-4;
    }
  }

  .action-item-card {
    border: 1px solid $color-border-light;
    border-radius: $radius-lg;
    background: $color-bg-surface;
    cursor: pointer;
    transition: all $transition-base;
    box-shadow: none;

    &:hover {
      border-color: $color-primary;
      transform: translateY(-2px);
      box-shadow: $shadow-sm;
    }

    &__inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: $space-4 $space-3;
      gap: $space-2-5;
    }

    .action-icon {
      font-size: 2rem;

      &--purple {
        color: $color-purple;
      }
      &--blue {
        color: $color-primary;
      }
      &--green {
        color: $color-success;
      }
    }

    .action-text {
      h4 {
        font-size: $text-xs;
        font-weight: 600;
        color: $color-text-primary;
        margin: 0 0 2px 0;
      }
      p {
        font-size: 10px;
        color: $color-text-muted;
        margin: 0;
        line-height: 1.3;
      }
    }
  }
}
</style>

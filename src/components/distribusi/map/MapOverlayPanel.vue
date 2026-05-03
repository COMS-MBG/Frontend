<script setup lang="ts">
import { useDistributionSummary } from '@/composables/useDistributionSummary'

const { inProgressCount } = useDistributionSummary()
</script>

<template>
  <div class="map-overlay">
    <div class="map-overlay__section">
      <h4>STATUS ARMADA AKTIF</h4>
      <div class="map-overlay__stat">
        <span class="dot dot--active"></span> Aktif
        <span class="value">{{ inProgressCount }} Unit</span>
      </div>
      <div class="map-overlay__stat">
        <span class="dot dot--standby"></span> Siaga
        <span class="value">2 Unit</span>
      </div>
    </div>
    
    <div class="map-overlay__section">
      <h4>METRIK CLUSTERING</h4>
      <div class="map-overlay__progress">
        <div class="progress-header">
          <span>EFISIENSI RUTE</span>
          <span>88%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 88%"></div>
        </div>
      </div>
      <button class="map-overlay__btn" aria-label="Optimasi Rute AI">
        ✨ Optimasi Rute AI
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.map-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__section {
    h4 {
      margin: 0 0 12px 0;
      font-size: 0.75rem;
      color: $color-text-muted;
      letter-spacing: 0.5px;
    }
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 0.875rem;
    font-weight: 500;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      
      &--active { background: $color-primary; }
      &--standby { background: #f59e0b; }
    }

    .value {
      margin-left: auto;
      font-weight: 600;
    }
  }

  &__progress {
    margin-bottom: 16px;

    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .progress-bar {
      height: 6px;
      background: $color-bg-subtle;
      border-radius: 999px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: $color-primary;
        border-radius: 999px;
      }
    }
  }

  &__btn {
    width: 100%;
    padding: 10px;
    background: $color-primary;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: var(--color-primary-dark, #1e3a8a);
    }
  }
}
</style>

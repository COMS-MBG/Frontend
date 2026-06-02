<script setup lang="ts">
import { useDistribution } from '@/composables/useDistribution'

const { inProgressCount, isOptimizing, optimizeRoute } = useDistribution()
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
      <button 
        class="map-overlay__btn" 
        :disabled="isOptimizing"
        @click="optimizeRoute"
        aria-label="Optimasi Rute AI"
      >
        <template v-if="isOptimizing">
          Mengoptimasi...
        </template>
        <template v-else>
          Optimasi Rute AI
        </template>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.map-overlay {
  position: absolute;
  top: $space-5;
  right: $space-5;
  width: 280px;
  background-color: $color-bg-overlay;
  backdrop-filter: blur(8px);
  border-radius: $radius-lg;
  padding: $space-4;
  box-shadow: $shadow-lg;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__section {
    h4 {
      margin: 0 0 $space-3 0;
      font-size: $text-xs;
      color: $color-text-muted;
      letter-spacing: 0.5px;
    }
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-2;
    font-size: $text-base;
    font-weight: 500;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: $radius-pill;
      
      &--active { background-color: $color-primary; }
      &--standby { background-color: $color-warning; }
    }

    .value {
      margin-left: auto;
      font-weight: 600;
    }
  }

  &__progress {
    margin-bottom: $space-4;

    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: $text-xs;
      font-weight: 600;
      margin-bottom: 0.375rem;
    }

    .progress-bar {
      height: 6px;
      background-color: $color-bg-subtle;
      border-radius: $radius-pill;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background-color: $color-primary;
        border-radius: $radius-pill;
      }
    }
  }

  &__btn {
    width: 100%;
    padding: 0.625rem;
    background-color: $color-primary;
    color: white;
    border: none;
    border-radius: $radius-md;
    font-weight: 600;
    cursor: pointer;
    transition: background-color $transition-base;

    &:hover {
      background-color: $color-primary-dark;
    }
  }
}
</style>



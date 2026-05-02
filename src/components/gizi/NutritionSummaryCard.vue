<template>
  <BaseCard class="nutrition-summary-card" padding="none">
    <div class="ns-header">
      <div>
        <p class="subtitle">TOTAL ENERGI</p>
        <div class="calories">
          <span class="val">{{ totalCalories }}</span>
          <span class="unit">KCAL</span>
        </div>
      </div>
      <div class="icon-wrapper">
        <span class="material-symbols-outlined">bolt</span>
      </div>
    </div>

    <div class="ns-body">
      <div class="macro-item">
        <div class="macro-label">
          <span class="dot" style="background-color: #10b981;"></span>
          PROTEIN
        </div>
        <div class="macro-value">
          <strong>{{ protein.val }}g</strong> <span class="percent">({{ protein.percent }}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: protein.percent + '%', backgroundColor: '#10b981' }"></div>
        </div>
      </div>

      <div class="macro-item">
        <div class="macro-label">
          <span class="dot" style="background-color: #3b82f6;"></span>
          KARBOHIDRAT
        </div>
        <div class="macro-value">
          <strong>{{ karbohidrat.val }}g</strong> <span class="percent">({{ karbohidrat.percent }}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: karbohidrat.percent + '%', backgroundColor: '#3b82f6' }"></div>
        </div>
      </div>

      <div class="macro-item">
        <div class="macro-label">
          <span class="dot" style="background-color: #6b7280;"></span>
          LEMAK
        </div>
        <div class="macro-value">
          <strong>{{ lemak.val }}g</strong> <span class="percent">({{ lemak.percent }}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: lemak.percent + '%', backgroundColor: '#6b7280' }"></div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/components/common/BaseCard.vue'

defineProps<{
  totalCalories: number | string
  protein: { val: number | string, percent: number | string }
  karbohidrat: { val: number | string, percent: number | string }
  lemak: { val: number | string, percent: number | string }
}>()
</script>

<style scoped lang="scss">
.ns-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: $space-5 $space-6;

  .subtitle {
    font-size: $text-xs;
    font-weight: 700;
    color: $color-text-muted;
    letter-spacing: 0.05em;
    margin-bottom: $space-1;
  }

  .calories {
    display: flex;
    align-items: baseline;
    gap: $space-1;
    
    .val {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1;
      color: $color-text-primary;
    }
    
    .unit {
      font-size: $text-md;
      font-weight: 700;
      color: $color-text-muted;
    }
  }

  .icon-wrapper {
    color: $color-border;
    
    .material-symbols-outlined {
      font-size: 4rem;
    }
  }
}

.ns-body {
  padding: 0 $space-6 $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.macro-item {
  position: relative;
  
  .macro-label {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-xs;
    font-weight: 700;
    color: $color-text-primary;
    margin-bottom: $space-2;
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
  }

  .macro-value {
    position: absolute;
    right: 0;
    top: 0;
    font-size: $text-sm;
    color: $color-text-primary;

    .percent {
      color: $color-text-muted;
    }
  }

  .progress-bar {
    height: 8px;
    background-color: $color-bg-subtle;
    border-radius: $radius-pill;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      border-radius: $radius-pill;
    }
  }
}
</style>

<template>
  <div class="menu-planning__summary">
    <StatCard 
      label="Energi" 
      icon="bolt" 
      :value="formatNum(summary.totalKalori) + ' kcal'" 
      icon-variant="orange" 
    />
    <StatCard 
      label="Protein" 
      icon="fitness_center" 
      :value="formatDec(summary.totalProtein) + ' g'" 
      icon-variant="blue" 
    />
    <StatCard 
      label="Karbo" 
      icon="grain" 
      :value="formatDec(summary.totalKarbo) + ' g'" 
      icon-variant="green" 
    />
    <StatCard 
      label="Lemak" 
      icon="water_drop" 
      :value="formatDec(summary.totalLemak) + ' g'" 
      icon-variant="purple" 
    />
  </div>
</template>

<script setup lang="ts">
import StatCard from '@/components/common/StatCard.vue'
import { useNutritionSummary } from '@/composables/useNutritionSummary'
import { formatNum, formatDec } from '@/utils/format'

const summary = useNutritionSummary()
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.menu-planning__summary {
  :deep(.stat-card) {
    padding: $space-4 $space-5; // Smaller padding than default
  }
  
  :deep(.stat-card__value) {
    font-size: 1.75rem; // Scale down the hero text
    margin-bottom: 0;
  }
  
  :deep(.stat-card__icon) {
    font-size: 1.25rem; // Slightly smaller icon
  }
}
</style>

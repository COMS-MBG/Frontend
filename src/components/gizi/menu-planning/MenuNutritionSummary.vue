<template>
  <div class="menu-planning__summary">
    <StatCard 
      label="Energi" 
      icon="bolt" 
      :value="formatNum(summary.totalKalori) + ' kcal'" 
      icon-variant="orange"
      variant="horizontal"
    />
    <StatCard 
      label="Protein" 
      icon="fitness_center" 
      :value="formatDec(summary.totalProtein) + ' g'" 
      icon-variant="blue"
      variant="horizontal"
    />
    <StatCard 
      label="Karbo" 
      icon="grain" 
      :value="formatDec(summary.totalKarbo) + ' g'" 
      icon-variant="green"
      variant="horizontal"
    />
    <StatCard 
      label="Lemak" 
      icon="water_drop" 
      :value="formatDec(summary.totalLemak) + ' g'" 
      icon-variant="purple"
      variant="horizontal"
    />
  </div>
</template>

<script setup lang="ts">
import StatCard from '@/components/common/StatCard.vue'
import { useNutritionSummary } from '@/composables/useNutritionSummary'
import { formatNum, formatDec } from '@/utils/format'

const summary = useNutritionSummary()
</script>

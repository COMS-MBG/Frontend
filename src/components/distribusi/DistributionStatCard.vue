<script setup lang="ts">
import { useDistributionSummary } from '@/composables/useDistributionSummary'
import StatCard from '@/components/common/StatCard.vue'

const { totalToday, inProgressCount, onTimeRate } = useDistributionSummary()
</script>

<template>
  <div class="distribution__stats">
    <StatCard
      label="TOTAL PENGIRIMAN HARI INI"
      icon="local_shipping"
      :value="totalToday"
      subtitle="Sekolah"
      iconVariant="blue"
    />
    <StatCard
      label="ARMADA SEDANG BERGERAK"
      icon="route"
      :value="inProgressCount"
      subtitle="Unit"
      iconVariant="orange"
    />
    <StatCard
      label="ESTIMASI TIBA TEPAT WAKTU"
      icon="timer"
      :value="onTimeRate + '%'"
      subtitle="Sangat Baik"
      iconVariant="green"
    />
  </div>
</template>

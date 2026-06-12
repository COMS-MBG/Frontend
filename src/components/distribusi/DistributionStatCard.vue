<script setup lang="ts">
import { computed } from 'vue'
import { useDistribution } from '@/composables/useDistribution'
import StatCard from '@/components/common/StatCard.vue'
import { getOnTimeSubtitle } from '@/utils/distribution'

const { totalToday, inProgressCount, onTimeRate } = useDistribution()

/** Dynamic subtitle based on actual on-time percentage */
const onTimeSubtitle = computed(() => getOnTimeSubtitle(onTimeRate.value))
</script>

<template>
  <div class="distribution__stats">
    <StatCard
      label="TOTAL PENGIRIMAN HARI INI"
      icon="local_shipping"
      :value="totalToday"
      subtitle="Sekolah"
      variant="horizontal"
      iconVariant="blue"
    />
    <StatCard
      label="ARMADA SEDANG BERGERAK"
      icon="route"
      :value="inProgressCount"
      subtitle="Unit"
      variant="horizontal"
      iconVariant="orange"
    />
    <StatCard
      label="ESTIMASI TIBA TEPAT WAKTU"
      icon="timer"
      :value="onTimeRate + '%'"
      :subtitle="onTimeSubtitle"
      variant="horizontal"
      iconVariant="green"
    />
  </div>
</template>

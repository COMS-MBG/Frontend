<script setup lang="ts">
import type { DistributionAnalytics } from '@/types/deliveryHistory'
import StatCard from '@/components/common/StatCard.vue'
import { formatDistance, formatDuration } from '@/utils/deliveryHistory'

defineProps<{
  analytics: DistributionAnalytics | null
  analyticsError: boolean
}>()
</script>

<template>
  <div class="delivery-history__stats">
    <StatCard
      label="Total Pengiriman"
      icon="local_shipping"
      :value="analyticsError ? '-' : (analytics?.total_deliveries ?? '-')"
      subtitle="Pengiriman Selesai"
      variant="horizontal"
      iconVariant="blue"
    />
    <StatCard
      label="Total Jarak Tempuh"
      icon="route"
      :value="analyticsError ? '-' : (analytics?.total_distance_km !== undefined && analytics.total_distance_km !== null ? formatDistance(analytics.total_distance_km) : '-')"
      subtitle="Jarak Kumulatif"
      variant="horizontal"
      iconVariant="green"
    />
    <StatCard
      label="Rerata Durasi Tiba"
      icon="timer"
      :value="analyticsError ? '-' : (analytics?.avg_duration_minutes !== undefined && analytics.avg_duration_minutes !== null ? formatDuration(Math.round(analytics.avg_duration_minutes)) : '-')"
      subtitle="Rata-rata Durasi"
      variant="horizontal"
      iconVariant="orange"
    />
    <StatCard
      label="Kurir Aktif Terlibat"
      icon="group"
      :value="analyticsError ? '-' : (analytics?.deliveries_per_courier ? Object.keys(analytics.deliveries_per_courier).length : '-')"
      subtitle="Personel Kurir"
      variant="horizontal"
      iconVariant="purple"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.delivery-history__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: $space-6;
  margin-bottom: $space-6;
}
</style>

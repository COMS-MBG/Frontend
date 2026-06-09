<template>
  <div class="sa-school-stats">
    <StatCard label="Total Sekolah" icon="school" :value="totalItems" icon-variant="blue" variant="horizontal" />
    <StatCard label="Sudah Dipetakan" icon="where_to_vote" :value="mappedCount" icon-variant="green" variant="horizontal" />
    <StatCard label="Belum Dipetakan" icon="location_off" :value="unmappedCount" icon-variant="orange" variant="horizontal" />
  </div>
</template>

<script setup lang="ts">
import StatCard from '@/components/common/StatCard.vue'

defineProps<{
  totalItems: number
  mappedCount: number
  unmappedCount: number
}>()
</script>

<style scoped lang="scss">
.sa-school-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $space-4;
  margin-bottom: $space-6;
}
</style>

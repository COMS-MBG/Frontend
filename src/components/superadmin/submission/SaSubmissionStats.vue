<template>
  <div class="sa-submission-stats">
    <StatCard label="Total Draft" icon="edit_note" :value="draftCount" icon-variant="orange" variant="horizontal" />
    <StatCard label="Sudah Terdaftar" icon="how_to_reg" :value="registeredCount" icon-variant="green" variant="horizontal" />
    <StatCard label="Total Pengajuan" icon="assignment" :value="totalCount" icon-variant="blue" variant="horizontal" />
  </div>
</template>

<script setup lang="ts">
import StatCard from '@/components/common/StatCard.vue'

defineProps<{
  draftCount: number
  registeredCount: number
  totalCount: number
}>()
</script>

<style scoped lang="scss">
.sa-submission-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $space-4;
  margin-bottom: $space-6;
}
</style>

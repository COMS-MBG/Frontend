<template>
  <BaseCard class="sa-rec-list-card">
    <div class="sa-rec-header">
      <h4>Analisis Pengajuan SPPG</h4>
      <p class="subtitle">Lokasi optimal pembangunan SPPG baru berdasarkan konsentrasi sekolah belum terlayani</p>
    </div>
    <div v-if="recommendations.length === 0" class="sa-rec-empty">
      <span class="material-symbols-outlined">check_circle</span>
      <p>Tidak ada rekomendasi SPPG baru saat ini. Semua sekolah terlayani dengan baik.</p>
    </div>
    <div v-else class="sa-rec-list">
      <div
        v-for="(rec, idx) in recommendations"
        :key="idx"
        class="sa-rec-item"
        :class="{ 'sa-rec-item--selected': selectedRecIndex === idx }"
        @click="$emit('select-rec', rec, idx)"
      >
        <div class="sa-rec-item__title">
          <span class="material-symbols-outlined">add_location_alt</span>
          <strong>Rekomendasi SPPG #{{ idx + 1 }}</strong>
        </div>
        <div class="sa-rec-item__details">
          <div class="detail-badge">
            <span class="material-symbols-outlined">school</span>
            {{ rec.school_count }} Sekolah
          </div>
          <div class="detail-badge">
            <span class="material-symbols-outlined">restaurant</span>
            {{ getRecommendationPortions(rec).toLocaleString() }} Porsi
          </div>
        </div>
        <div class="sa-rec-item__coords">
          {{ rec.latitude.toFixed(6) }}, {{ rec.longitude.toFixed(6) }}
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/components/common/BaseCard.vue'
import type { KMeansRecommendation, SchoolLayerItem } from '@/types/superadmin-map'

const props = defineProps<{
  recommendations: KMeansRecommendation[]
  selectedRecIndex: number | null
  schools: SchoolLayerItem[]
}>()

defineEmits<{
  (e: 'select-rec', rec: KMeansRecommendation, idx: number): void
}>()

function getRecommendationPortions(rec: KMeansRecommendation): number {
  return rec.schools.reduce((sum, recSchool) => {
    const mainSchool = props.schools.find(s => s.id === recSchool.id)
    return sum + (mainSchool?.portion_count || 0)
  }, 0)
}
</script>

<style scoped lang="scss">
.sa-rec-list-card {
  padding: $space-4;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.sa-rec-header {
  margin-bottom: $space-3;

  h4 {
    font-size: $text-sm;
    font-weight: 600;
    margin: 0 0 $space-1 0;
    color: $color-text-primary;
  }

  .subtitle {
    font-size: $text-xs;
    color: $color-text-muted;
    margin: 0;
    line-height: 1.3;
  }
}

.sa-rec-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-6;
  text-align: center;
  color: $color-text-muted;

  span { font-size: 2rem; color: $color-success; margin-bottom: $space-2; }
  p { font-size: $text-xs; margin: 0; }
}

.sa-rec-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 380px;
  overflow-y: auto;
}

.sa-rec-item {
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $space-3;
  cursor: pointer;
  transition: all $transition-base;
  background: $color-bg-surface;

  &:hover {
    border-color: $color-primary;
    background: $color-bg-subtle;
  }

  &--selected {
    border-color: var(--color-purple);
    background: rgba(139, 92, 246, 0.05);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: $text-sm;
    color: $color-text-primary;
    margin-bottom: $space-2;

    span { font-size: 1.15rem; color: var(--color-purple); }
  }

  &__details {
    display: flex;
    gap: $space-2;
    margin-bottom: $space-2;
  }

  &__coords {
    font-family: monospace;
    font-size: 10px;
    color: $color-text-faint;
  }
}

.detail-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: $color-bg-subtle;
  padding: 2px 6px;
  border-radius: $radius-sm;
  font-size: 10px;
  color: $color-text-secondary;
  border: 1px solid $color-border;

  span { font-size: 10px; }
}
</style>

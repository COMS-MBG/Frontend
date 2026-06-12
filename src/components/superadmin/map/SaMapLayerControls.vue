<template>
  <div class="sa-map-page__controls">
    <label class="sa-map-page__control">
      <input
        type="checkbox"
        :checked="showSppgLayer"
        @change="$emit('update:showSppgLayer', ($event.target as HTMLInputElement).checked)"
      />
      <span class="material-symbols-outlined icon-sppg">warehouse</span>
      SPPG Aktif ({{ sppgCount }})
    </label>
    <label class="sa-map-page__control">
      <input
        type="checkbox"
        :checked="showSchoolLayer"
        @change="$emit('update:showSchoolLayer', ($event.target as HTMLInputElement).checked)"
      />
      <span class="material-symbols-outlined icon-school">school</span>
      Sekolah ({{ schoolCount }})
    </label>
    <label class="sa-map-page__control">
      <input
        type="checkbox"
        :checked="showRecommendationLayer"
        @change="$emit('update:showRecommendationLayer', ($event.target as HTMLInputElement).checked)"
      />
      <span class="material-symbols-outlined icon-recommendation">add_location_alt</span>
      Rekomendasi ({{ recommendationCount }})
    </label>
    <label class="sa-map-page__control">
      <input
        type="checkbox"
        :checked="showSubmissionLayer"
        @change="$emit('update:showSubmissionLayer', ($event.target as HTMLInputElement).checked)"
      />
      <span class="material-symbols-outlined icon-submission">location_on</span>
      Pengajuan ({{ submissionCount }})
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showSppgLayer: boolean
  showSchoolLayer: boolean
  showRecommendationLayer: boolean
  showSubmissionLayer: boolean
  sppgCount: number
  schoolCount: number
  recommendationCount: number
  submissionCount: number
}>()

defineEmits<{
  (e: 'update:showSppgLayer', val: boolean): void
  (e: 'update:showSchoolLayer', val: boolean): void
  (e: 'update:showRecommendationLayer', val: boolean): void
  (e: 'update:showSubmissionLayer', val: boolean): void
}>()
</script>

<style scoped lang="scss">
.sa-map-page {
  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: $space-4;
    padding: $space-3 $space-4;
    border-bottom: 1px solid $color-border;
  }

  &__control {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    color: $color-text-secondary;
    cursor: pointer;

    input[type="checkbox"] {
      accent-color: $color-primary;
      cursor: pointer;
    }

    .material-symbols-outlined {
      font-size: 1.15rem;

      &.icon-sppg {
        color: var(--color-primary);
      }
      &.icon-school {
        color: var(--color-success);
      }
      &.icon-recommendation {
        color: var(--color-purple);
      }
      &.icon-submission {
        color: var(--color-success);
      }
    }
  }
}
</style>

<template>
  <div v-if="suggestedShift" class="sa-gis-panel__section">
    <label class="sa-gis-panel__label">Saran Posisi Optimal</label>
    <div class="sa-shift-suggestion">
      <div class="sa-shift-suggestion__info">
        <span class="material-symbols-outlined">assistant_direction</span>
        <div>
          <p class="sa-shift-suggestion__text">
            Geser <strong>{{ suggestedShift.distance_meters }}m</strong> ke titik centroid optimal
          </p>
          <p class="sa-shift-suggestion__coords">
            {{ suggestedShift.latitude.toFixed(6) }}, {{ suggestedShift.longitude.toFixed(6) }}
          </p>
        </div>
      </div>
      <button
        class="sa-gis-panel__btn sa-gis-panel__btn--shift"
        @click="$emit('apply-shift')"
        :disabled="isProcessingAction"
      >
        <span class="material-symbols-outlined">swap_calls</span>
        Gunakan Titik Optimal
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SuggestShiftResponse } from '@/types/superadmin-map'

defineProps<{
  suggestedShift: SuggestShiftResponse | null
  isProcessingAction: boolean
}>()

defineEmits<{
  (e: 'apply-shift'): void
}>()
</script>

<style scoped lang="scss">
.sa-gis-panel {
  &__section {
    margin-bottom: $space-3;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: $space-1;
    font-size: $text-xs;
    font-weight: 600;
    color: $color-text-secondary;
    margin-bottom: $space-1;
    text-transform: uppercase;
    letter-spacing: 0.04em;

    .material-symbols-outlined { font-size: 14px; }
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    width: 100%;
    padding: $space-2 $space-3;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-body;
    border: none;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-base;

    .material-symbols-outlined { font-size: 18px; }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--shift {
      background: $color-bg-subtle;
      color: var(--color-purple);
      border: 1px solid var(--color-primary-muted);

      &:hover:not(:disabled) {
        background: var(--color-purple-subtle);
        border-color: var(--color-purple);
      }
    }
  }
}

.sa-shift-suggestion {
  background: var(--color-purple-subtle);
  border: 1px solid var(--color-primary-muted);
  border-radius: $radius-md;
  padding: $space-3;

  &__info {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    margin-bottom: $space-3;

    .material-symbols-outlined { font-size: 20px; color: var(--color-purple); flex-shrink: 0; }
  }

  &__text {
    font-size: $text-xs;
    color: $color-text-secondary;
    margin: 0 0 2px;
    line-height: 1.4;
  }

  &__coords {
    font-family: $font-mono;
    font-size: 10px;
    color: $color-text-faint;
    margin: 0;
  }
}
</style>

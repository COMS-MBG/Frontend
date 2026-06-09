<template>
  <div class="sa-gis-panel__section">
    <label class="sa-gis-panel__label">Status Validasi</label>
    <div v-if="isProcessingAction && !validationResult" class="sa-gis-panel__loading-mini">
      <span class="sa-map-page__route-spinner"></span>
      Memvalidasi titik…
    </div>
    <template v-else-if="validationResult">
      <div
        class="sa-validation-badge"
        :style="badgeStyle"
      >
        <span class="sa-validation-badge__dot"></span>
        <strong>{{ validationStatusLabel }}</strong>
        <span class="sa-validation-badge__status">({{ validationResult.status.toUpperCase() }})</span>
      </div>
      <div v-if="validationResult.conflicts.length" class="sa-validation-conflicts">
        <div
          v-for="(conflict, ci) in validationResult.conflicts"
          :key="ci"
          class="sa-validation-conflicts__item"
        >
          <span class="material-symbols-outlined">warning</span>
          {{ conflict }}
        </div>
      </div>
      <div v-else class="sa-validation-ok">
        <span class="material-symbols-outlined">check_circle</span>
        Tidak ada konflik. Lokasi aman untuk SPPG baru.
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import type { PointValidationResponse } from '@/types/superadmin-map'

const props = defineProps<{
  validationResult: PointValidationResponse | null
  isProcessingAction: boolean
}>()

const validationStatusColor = computed(() => {
  if (!props.validationResult) return null
  const map: Record<string, string> = {
    green: 'var(--color-success)',
    yellow: 'var(--color-warning)',
    red: 'var(--color-danger)'
  }
  return map[props.validationResult.status] ?? null
})

const badgeStyle = computed<CSSProperties>(() => ({
  '--badge-color': validationStatusColor.value ?? ''
}))

const validationStatusLabel = computed(() => {
  if (!props.validationResult) return ''
  const map: Record<string, string> = {
    green: 'Aman',
    yellow: 'Perlu Peninjauan',
    red: 'Konflik'
  }
  return map[props.validationResult.status] ?? ''
})
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

  &__loading-mini {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: $space-2;
    font-size: $text-xs;
    color: $color-text-muted;
  }
}

.sa-validation-badge {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-3;
  background: $color-bg-subtle;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  font-size: $text-sm;

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--badge-color);
    box-shadow: 0 0 6px var(--badge-color);
    flex-shrink: 0;
  }

  strong {
    color: $color-text-primary;
  }

  &__status {
    font-size: $text-xs;
    color: $color-text-muted;
    margin-left: auto;
  }
}

.sa-validation-conflicts {
  margin-top: $space-2;
  display: flex;
  flex-direction: column;
  gap: $space-1;

  &__item {
    display: flex;
    align-items: flex-start;
    gap: $space-1;
    padding: $space-1 $space-2;
    background: rgba(#f59e0b, 0.08);
    border-radius: $radius-sm;
    font-size: 10px;
    color: #92400e;
    line-height: 1.4;

    .material-symbols-outlined { font-size: 12px; color: var(--color-warning); flex-shrink: 0; margin-top: 1px; }
  }
}

.sa-validation-ok {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2;
  font-size: $text-xs;
  color: var(--color-success);
  margin-top: $space-1;

  .material-symbols-outlined { font-size: 16px; }
}

.sa-map-page__route-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(124, 58, 237, 0.3);
  border-top-color: var(--color-purple);
  border-radius: 50%;
  animation: sa-route-spin 0.8s linear infinite;
}

@keyframes sa-route-spin {
  to { transform: rotate(360deg); }
}
</style>

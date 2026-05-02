<template>
  <div class="nutrition-stat-card">
    <div class="icon-wrapper" :class="`icon-${variant}`">
      <span class="material-symbols-outlined">{{ icon }}</span>
    </div>
    <div class="stat-content">
      <div class="stat-label">{{ label }}</div>
      <div class="stat-val-unit">
        <span class="val">{{ value }}</span>
        <span class="unit">{{ unit }}</span>
      </div>
      <div v-if="status" class="stat-status" :class="`status-${variant}`">
        {{ status }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  unit: string
  icon: string
  status?: string
  variant?: 'success' | 'danger' | 'warning' | 'primary' | 'default'
}>()
</script>

<style scoped lang="scss">
.nutrition-stat-card {
  background-color: $color-bg-surface;
  border-radius: $radius-lg;
  padding: $space-4;
  box-shadow: $shadow-xs;
  border: 1px solid $color-border;
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-sm;
  
  .material-symbols-outlined {
    font-size: 1.25rem;
  }

  &.icon-success { color: $color-success; }
  &.icon-danger { color: $color-danger; }
  &.icon-warning { color: $color-warning; }
  &.icon-primary { color: $color-primary; }
  &.icon-default { color: $color-text-secondary; }
}

.stat-label {
  font-size: $text-xs;
  font-weight: 700;
  color: $color-text-muted;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: $space-1;
}

.stat-val-unit {
  display: flex;
  align-items: baseline;
  gap: 2px;
  
  .val {
    font-size: $text-xl;
    font-weight: 800;
    color: $color-text-primary;
  }
  
  .unit {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-text-primary;
  }
}

.stat-status {
  font-size: 0.65rem;
  font-weight: 600;
  margin-top: $space-1;
  
  &.status-success { color: $color-success; }
  &.status-danger { color: $color-danger; }
  &.status-warning { color: $color-warning; }
  &.status-primary { color: $color-primary; }
  &.status-default { color: $color-text-muted; }
}
</style>

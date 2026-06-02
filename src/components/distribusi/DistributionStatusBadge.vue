<script setup lang="ts">
import { computed } from 'vue'
import type { ScheduleStatus } from '@/types/distribution'
import { getStatusInfo } from '@/utils/distribution'

const props = defineProps<{
  status: ScheduleStatus
}>()

const statusInfo = computed(() => getStatusInfo(props.status))
</script>

<template>
  <span class="status-badge" :class="`status-badge--${statusInfo.variant}`">
    <span class="material-symbols-outlined status-badge__icon">{{ statusInfo.icon }}</span>
    {{ statusInfo.label }}
  </span>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: $space-1 $space-3;
  border-radius: $radius-pill;
  font-size: $text-sm;
  font-weight: 600;
  white-space: nowrap;

  &__icon {
    font-size: 14px;
    vertical-align: middle;
  }

  // ── Variant classes using design system tokens ─────────
  &--warning {
    background-color: $color-warning-bg;
    color: $color-warning;
  }

  &--info {
    background-color: $color-info-bg;
    color: $color-info;
  }

  &--danger {
    background-color: $color-danger-bg;
    color: $color-danger;
  }

  &--primary {
    background-color: $color-primary-light;
    color: $color-primary;
  }

  &--success {
    background-color: $color-success-bg;
    color: $color-success;
  }
}
</style>

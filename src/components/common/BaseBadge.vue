<template>
  <span class="base-badge" :class="`base-badge--${variant}`">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
}>(), {
  variant: 'default'
})
</script>

<style scoped lang="scss">
.base-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: $font-body;
  letter-spacing: 0.02em;
  white-space: nowrap;
  line-height: 1.4;
  box-shadow: $shadow-xs;

  &--success {
    background-color: $color-success;
    color: $color-text-inverse;
  }

  &--warning {
    background-color: $color-warning;
    color: $color-text-inverse;
  }

  &--danger {
    background-color: $color-danger;
    color: $color-text-inverse;
  }

  &--info {
    background-color: $color-primary;
    color: $color-text-inverse;
  }

  &--default {
    background-color: $color-bg-subtle;
    color: $color-text-muted;
  }
}
</style>

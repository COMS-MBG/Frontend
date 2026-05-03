<template>
  <button 
    class="base-button" 
    :class="[`btn-${variant}`, size ? `btn-${size}` : '', { 'is-fullwidth': fullWidth, 'is-outline': outline }]"
    v-bind="$attrs"
  >
    <span v-if="icon" class="material-symbols-outlined btn-icon">{{ icon }}</span>
    <span class="btn-text"><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  outline?: boolean
  icon?: string
}>()
</script>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  padding: $space-3 $space-4;
  border-radius: $radius-md;
  font-family: $font-body;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &.is-fullwidth {
    width: 100%;
  }

  &.btn-sm {
    padding: $space-2 $space-3;
    font-size: 0.75rem;
    border-radius: $radius-sm;

    .btn-icon {
      font-size: 1rem;
    }
  }

  /* Default / Primary */
  &.btn-primary {
    background-color: $color-primary;
    color: $color-text-inverse;
    box-shadow: $shadow-btn;

    &:hover { background-color: $color-primary-dark; }
  }

  /* Secondary */
  &.btn-secondary {
    background-color: $color-bg-subtle;
    color: $color-text-primary;
    border-color: $color-border;

    &:hover { background-color: $color-border; }
  }
  
  /* Dark */
  &.btn-dark {
    background-color: $color-text-secondary;
    color: $color-text-inverse;
    
    &:hover { background-color: $color-text-primary; }
  }

  /* Outline variant */
  &.is-outline.btn-primary {
    background-color: transparent;
    color: $color-primary;
    border-color: $color-primary;
    box-shadow: none;

    &:hover {
      background-color: $color-primary-subtle;
    }
  }

  &.is-outline.btn-secondary {
    background-color: transparent;
    border-style: dashed;
    color: $color-text-primary;
    border-color: $color-border;

    &:hover {
      border-color: $color-primary;
      color: $color-primary;
      background-color: $color-primary-subtle;
    }
  }

  .btn-icon {
    font-size: 1.25rem;
  }
}
</style>

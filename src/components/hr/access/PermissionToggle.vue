<template>
  <label
    class="perm-toggle"
    :class="{
      'perm-toggle--active': modelValue,
      'perm-toggle--disabled': disabled,
    }"
  >
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', !modelValue)"
      :aria-label="label"
    >
    <span class="perm-toggle__slider"></span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  disabled?: boolean
  label?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style scoped lang="scss">
.perm-toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $color-bg-muted;
    border-radius: $radius-pill;
    transition: background-color $transition-fast;

    &::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background-color: $color-text-inverse;
      border-radius: 50%;
      transition: transform $transition-fast;
      box-shadow: $shadow-xs;
    }
  }

  input:checked + &__slider {
    background-color: $color-success;
  }

  input:checked + &__slider::before {
    transform: translateX(18px);
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
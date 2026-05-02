<template>
  <div class="base-select-wrapper">
    <select
      :id="id"
      :value="modelValue"
      @change="onChange"
      class="base-select"
      :class="{ 'is-invalid': error }"
      v-bind="$attrs"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <span class="material-symbols-outlined select-icon">expand_more</span>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import type { SelectOption } from '@/types/form'

const props = defineProps<{
  modelValue: string | number | null
  options: SelectOption[]
  id?: string
  placeholder?: string
  error?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  
  if (!value) {
    emit('update:modelValue', null)
    return
  }
  
  // Find option to preserve its type (number vs string)
  const option = props.options.find(o => String(o.value) === value)
  emit('update:modelValue', option ? option.value : value)
}
</script>

<style scoped lang="scss">
.base-select-wrapper {
  position: relative;
  width: 100%;

  .select-icon {
    position: absolute;
    right: $space-3;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: $color-text-muted;
  }
}

.base-select {
  width: 100%;
  padding: $space-2 $space-8 $space-2 $space-3;
  font-family: $font-body;
  font-size: $text-sm;
  color: $color-text-primary;
  background-color: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  appearance: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: $color-primary;
  }

  &:focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
  }

  &.is-invalid {
    border-color: $color-danger;
    &:focus { box-shadow: 0 0 0 3px rgba($color-danger, 0.1); }
  }
}
</style>

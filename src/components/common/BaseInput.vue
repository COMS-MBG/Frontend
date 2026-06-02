<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="computedId" class="base-label">{{ label }}</label>
    <input
      :id="computedId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :autofocus="autofocus"
      :aria-invalid="!!error"
      :aria-describedby="error ? errorId : undefined"
      @input="onInput"
      class="base-input"
      :class="{ 'is-invalid': !!error }"
      v-bind="$attrs"
    />
    <p v-if="error && !isInFormGroup" :id="errorId" class="error-text">{{ error }}</p>
  </div>
</template>

<script lang="ts">
let inputIdCounter = 0
</script>

<script setup lang="ts">
import { computed, inject } from 'vue'

defineOptions({ inheritAttrs: false })

const isInFormGroup = inject('isInFormGroup', false)

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  type?: string
  id?: string
  label?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  autofocus?: boolean
}>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  autofocus: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

// SSR-safe unique ID (no Math.random)
const computedId = computed(() => props.id || `input-${++inputIdCounter}`)
const errorId = computed(() => `${computedId.value}-error`)

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const rawValue = target.value
  
  if (props.type === 'number') {
    if (rawValue === '') {
      emit('update:modelValue', null)
    } else {
      const parsed = Number(rawValue)
      emit('update:modelValue', isNaN(parsed) ? null : parsed)
    }
  } else {
    emit('update:modelValue', rawValue)
  }
}
</script>

<style scoped lang="scss">
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: $space-1;
  width: 100%;
}

.base-label {
  font-size: $text-sm;
  font-weight: 600;
  color: $color-text-primary;
  margin-bottom: 2px;
}

.base-input {
  width: 100%;
  padding: $space-2 $space-3;
  font-family: $font-body;
  font-size: $text-sm;
  color: $color-text-primary;
  background-color: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  transition: all 0.2s ease;

  &::placeholder {
    color: $color-text-muted;
  }

  &:hover:not(:disabled) {
    border-color: $color-primary;
  }

  &:focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
  }

  &:disabled {
    background-color: $color-bg-subtle;
    color: $color-text-muted;
    cursor: not-allowed;
  }

  &.is-invalid {
    border-color: $color-danger;
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($color-danger, 0.1);
    }
  }
}

.error-text {
  margin: 0;
  font-size: $text-xs;
  color: $color-danger;
  font-weight: 500;
}
</style>

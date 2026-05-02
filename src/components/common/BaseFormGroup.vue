<template>
  <div 
    class="form-group" 
    :class="{ 
      'has-error': !!error,
      'has-disabled': disabled
    }"
  >
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="required-mark" aria-hidden="true">*</span>
    </label>
    
    <div class="form-control-wrapper">
      <slot
        :id="inputId"
        :describedby="describedById"
        :invalid="!!error"
      />
    </div>
    
    <div v-if="error" :id="errorId" class="error-message" role="alert">
      {{ error }}
    </div>
    <div v-else-if="helpText" :id="helpId" class="help-text">
      {{ helpText }}
    </div>
  </div>
</template>

<script lang="ts">
// Module-scope counter — each component instance gets a unique ID
let idCounter = 0
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label?: string
  id?: string
  required?: boolean
  error?: string
  helpText?: string
  disabled?: boolean
}>()

// SSR-safe unique ID (no Math.random)
const uniqueId = `fg-${++idCounter}`
const inputId = computed(() => props.id || uniqueId)

const errorId = computed(() => `${inputId.value}-error`)
const helpId = computed(() => `${inputId.value}-help`)

const describedById = computed(() => {
  if (props.error) return errorId.value
  if (props.helpText) return helpId.value
  return undefined
})
</script>

<style scoped lang="scss">
.form-group {
  margin-bottom: $space-4;

  &.has-error {
    .form-label {
      color: $color-danger;
    }
  }

  &.has-disabled {
    opacity: 0.7;
    .form-label {
      color: $color-text-muted;
      cursor: not-allowed;
    }
  }

  .form-label {
    display: block;
    margin-bottom: $space-2;
    font-size: $text-sm;
    font-weight: 500;
    color: $color-text-primary;
    transition: color 0.2s ease;

    .required-mark {
      color: $color-danger;
      margin-left: $space-1;
    }
  }

  .form-control-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .error-message {
    margin-top: $space-1;
    font-size: $text-xs;
    color: $color-danger;
    font-weight: 500;
  }

  .help-text {
    margin-top: $space-1;
    font-size: $text-xs;
    color: $color-text-secondary;
  }
}
</style>

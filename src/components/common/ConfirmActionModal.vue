<template>
  <BaseModal v-model="open" :title="title" size="sm" @close="onCancel">
    <div class="confirm-action">
      <!-- Icon -->
      <div class="confirm-action__icon-wrap" :class="`confirm-action__icon-wrap--${variant}`">
        <span class="material-symbols-outlined confirm-action__icon" :class="`confirm-action__icon--${variant}`">
          {{ icon }}
        </span>
      </div>

      <!-- Message -->
      <p class="confirm-action__message">
        <slot><span v-html="message"></span></slot>
      </p>

      <!-- Optional Notes Input -->
      <div v-if="showInput" class="confirm-action__input-group">
        <label :for="inputId" class="confirm-action__label">{{ inputLabel }}</label>
        <textarea
          :id="inputId"
          ref="textareaRef"
          v-model="internalNotes"
          class="confirm-action__textarea"
          :class="{ 'confirm-action__textarea--invalid': showValidationError }"
          :placeholder="inputPlaceholder"
          :rows="3"
        />
        <div class="confirm-action__input-feedback">
          <span v-if="showValidationError" class="confirm-action__error-text">
            {{ validationErrorMessage }}
          </span>
          <span v-else></span>
          <span 
            class="confirm-action__char-count" 
            :class="{ 'confirm-action__char-count--invalid': showValidationError }"
          >
            {{ internalNotes.trim().length }}/{{ minInputLength || 0 }}
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn-secondary" type="button" @click="onCancel" :disabled="isSubmitting">
        Batal
      </button>
      <button
        :class="[confirmBtnClass, 'btn-with-icon']"
        type="button"
        :disabled="isConfirmDisabled"
        @click="onConfirm"
      >
        <span v-if="isSubmitting" class="material-symbols-outlined confirm-action__spinner">progress_activity</span>
        <span v-else class="material-symbols-outlined" style="font-size: 1.1rem">{{ confirmIcon }}</span>
        {{ confirmLabel }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { z } from 'zod'
import type { ZodTypeAny } from 'zod'

let idCounter = 0

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  icon?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  confirmLabel?: string
  confirmIcon?: string
  isSubmitting?: boolean
  /** Show a textarea input for notes */
  showInput?: boolean
  inputLabel?: string
  inputPlaceholder?: string
  /** Require notes to be filled before confirming */
  requireInput?: boolean
  /** Minimum character length for input if shown/required */
  minInputLength?: number
  /** Optional custom Zod schema for input validation */
  schema?: ZodTypeAny
}>(), {
  title: 'Konfirmasi',
  message: 'Apakah Anda yakin?',
  icon: 'help',
  variant: 'primary',
  confirmLabel: 'Konfirmasi',
  confirmIcon: 'check',
  isSubmitting: false,
  showInput: false,
  inputLabel: 'Catatan',
  inputPlaceholder: 'Masukkan catatan...',
  requireInput: false,
  minInputLength: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', notes: string): void
  (e: 'cancel'): void
}>()

const inputId = `confirm-action-input-${++idCounter}`

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const internalNotes = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// Reset notes when modal opens and auto-focus the textarea
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    internalNotes.value = ''
    if (props.showInput) {
      nextTick(() => textareaRef.value?.focus())
    }
  }
})

// Dynamic fallback schema based on props if no custom schema is provided
const validationSchema = computed<ZodTypeAny>(() => {
  if (props.schema) return props.schema

  let s = z.string()
  if (props.requireInput) {
    const minLen = props.minInputLength || 1
    s = s.refine(
      (val) => val.trim().length >= minLen,
      { message: `Catatan harus minimal ${minLen} karakter.` }
    )
  } else if (props.minInputLength > 0) {
    s = s.refine(
      (val) => val.trim().length === 0 || val.trim().length >= props.minInputLength,
      { message: `Catatan harus minimal ${props.minInputLength} karakter.` }
    )
  }
  return s
})

const validationResult = computed(() => {
  if (!props.showInput) return { success: true, error: null }
  return validationSchema.value.safeParse(internalNotes.value)
})

const showValidationError = computed(() => {
  if (!props.showInput) return false
  const len = internalNotes.value.trim().length
  if (len === 0) return false
  return !validationResult.value.success
})

const validationErrorMessage = computed(() => {
  if (validationResult.value.success || !validationResult.value.error) return ''
  return validationResult.value.error.issues[0]?.message || 'Input tidak valid.'
})

const isConfirmDisabled = computed(() => {
  if (props.isSubmitting) return true
  if (props.showInput) {
    return !validationResult.value.success
  }
  return false
})

const confirmBtnClass = computed(() => {
  const map: Record<string, string> = {
    primary: 'btn-primary',
    success: 'btn-success',
    warning: 'btn-warning',
    danger: 'btn-danger',
  }
  return map[props.variant] || 'btn-primary'
})

function onCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

function onConfirm() {
  emit('confirm', internalNotes.value.trim())
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.confirm-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: $space-4;
  padding: $space-2 0;

  &__icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &--primary { background-color: $color-primary-light; }
    &--success { background-color: $color-success-bg; }
    &--warning { background-color: $color-warning-bg; }
    &--danger  { background-color: $color-danger-bg; }
  }

  &__icon {
    font-size: 1.75rem;
    font-variation-settings: 'FILL' 1;

    &--primary { color: $color-primary; }
    &--success { color: $color-success; }
    &--warning { color: $color-warning; }
    &--danger  { color: $color-danger; }
  }

  &__message {
    font-size: $text-base;
    color: $color-text-secondary;
    line-height: 1.6;
    margin: 0;
  }

  &__input-group {
    width: 100%;
    text-align: left;
  }

  &__label {
    display: block;
    font-size: $text-sm;
    font-weight: 600;
    color: $color-text-primary;
    margin-bottom: $space-2;
  }

  &__textarea {
    width: 100%;
    padding: $space-3;
    font-family: $font-body;
    font-size: $text-sm;
    color: $color-text-primary;
    background-color: $color-bg-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    resize: vertical;
    transition: border-color $transition-base, box-shadow $transition-base;
    min-height: 80px;

    &::placeholder {
      color: $color-text-muted;
    }

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px $color-primary-muted;
    }

    &--invalid {
      border-color: $color-danger;
      &:focus {
        border-color: $color-danger;
        box-shadow: 0 0 0 3px $color-danger-bg;
      }
    }
  }

  &__input-feedback {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: $space-1;
    font-size: $text-xs;
  }

  &__error-text {
    color: $color-danger;
    font-weight: 500;
  }

  &__char-count {
    color: $color-text-muted;
    font-weight: 500;
    margin-left: auto;

    &--invalid {
      color: $color-danger;
    }
  }

  &__spinner {
    animation: spin 1s linear infinite;
    font-size: 1.1rem;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

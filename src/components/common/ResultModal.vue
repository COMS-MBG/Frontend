<template>
  <BaseModal v-model="open" :title="title" size="sm" @close="onClose">
    <div class="result-modal">
      <!-- Icon -->
      <div class="result-modal__icon-wrap" :class="`result-modal__icon-wrap--${variant}`">
        <span class="material-symbols-outlined result-modal__icon">{{ iconName }}</span>
      </div>

      <!-- Headline -->
      <h4 class="result-modal__headline">{{ headline }}</h4>

      <!-- Message -->
      <p v-if="message" class="result-modal__message">{{ message }}</p>
    </div>

    <template #footer>
      <button class="btn-primary" type="button" @click="onClose">
        {{ closeLabel }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  headline: string
  message?: string
  variant?: 'success' | 'error' | 'info' | 'warning'
  closeLabel?: string
}>(), {
  title: 'Berhasil',
  variant: 'success',
  closeLabel: 'Tutup',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const iconName = computed(() => {
  switch (props.variant) {
    case 'success': return 'check_circle'
    case 'error':   return 'error'
    case 'warning': return 'warning'
    case 'info':    return 'info'
    default:        return 'check_circle'
  }
})

function onClose() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped lang="scss">
.result-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: $space-3;
  padding: $space-4 0;

  &__icon-wrap {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: resultPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &--success {
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    }
    &--error {
      background: linear-gradient(135deg, #fecaca, #fca5a5);
    }
    &--warning {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
    }
    &--info {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    }
  }

  &__icon {
    font-size: 2rem;
    font-variation-settings: 'FILL' 1;

    .result-modal__icon-wrap--success & { color: #059669; }
    .result-modal__icon-wrap--error &   { color: #dc2626; }
    .result-modal__icon-wrap--warning & { color: #d97706; }
    .result-modal__icon-wrap--info &    { color: #2563eb; }
  }

  &__headline {
    font-family: $font-heading;
    font-size: $text-lg;
    font-weight: 700;
    color: $color-text-primary;
    margin: 0;
  }

  &__message {
    font-size: $text-sm;
    color: $color-text-muted;
    line-height: 1.5;
    margin: 0;
    max-width: 320px;
  }
}

@keyframes resultPop {
  0%   { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>

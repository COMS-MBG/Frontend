<template>
  <BaseModal v-model="open" :title="title" size="sm" @close="onCancel">
    <div class="confirm-delete">
      <!-- Danger Icon -->
      <div class="confirm-delete__icon-wrap">
        <span class="material-symbols-outlined confirm-delete__icon">warning</span>
      </div>

      <!-- Message -->
      <p class="confirm-delete__message">
        <slot>
          Apakah Anda yakin ingin menghapus
          <strong>{{ itemName }}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </slot>
      </p>
    </div>

    <template #footer>
      <button class="btn-secondary" type="button" @click="onCancel" :disabled="isSubmitting">
        Batal
      </button>
      <button class="btn-danger btn-with-icon" type="button" :disabled="isSubmitting" @click="onConfirm">
        <span v-if="isSubmitting" class="material-symbols-outlined confirm-delete__spinner">progress_activity</span>
        <span v-else class="material-symbols-outlined" style="font-size: 1.1rem">delete</span>
        {{ confirmLabel }}
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
  itemName?: string
  confirmLabel?: string
  isSubmitting?: boolean
}>(), {
  title: 'Konfirmasi Hapus',
  itemName: '',
  confirmLabel: 'Hapus',
  isSubmitting: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function onCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}
</script>

<style scoped lang="scss">
.confirm-delete {
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
    background-color: $color-danger-bg;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    font-size: 1.75rem;
    color: $color-danger;
    font-variation-settings: 'FILL' 1;
  }

  &__message {
    font-size: $text-base;
    color: $color-text-secondary;
    line-height: 1.6;
    margin: 0;

    strong {
      color: $color-text-primary;
      font-weight: 700;
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

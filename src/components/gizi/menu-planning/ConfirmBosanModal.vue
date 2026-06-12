<template>
  <BaseModal v-model="open" :title="title" size="sm" @close="onCancel">
    <div class="confirm-bosan">
      <!-- Warning Icon -->
      <div class="confirm-bosan__icon-wrap">
        <span class="material-symbols-outlined confirm-bosan__icon">warning</span>
      </div>

      <!-- Message -->
      <p class="confirm-bosan__message">
        <slot>
          Terdapat <strong>pengulangan resep menu</strong> dalam minggu ini.
          <br /><br />
          Apakah Anda yakin ingin tetap menyimpan perubahan ini?
        </slot>
      </p>
    </div>

    <template #footer>
      <button class="btn-secondary" type="button" @click="onCancel" :disabled="isSubmitting">
        Batal
      </button>
      <button class="btn-warning btn-with-icon" type="button" :disabled="isSubmitting" @click="onConfirm">
        <span v-if="isSubmitting" class="material-symbols-outlined confirm-bosan__spinner">progress_activity</span>
        <span v-else class="material-symbols-outlined" style="font-size: 1.1rem">save</span>
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
  confirmLabel?: string
  isSubmitting?: boolean
}>(), {
  title: 'Konfirmasi Anti-Bosan',
  confirmLabel: 'Tetap Simpan',
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
@use '@/assets/styles/abstracts/variables' as *;

.confirm-bosan {
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
    background-color: $color-warning-bg;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    font-size: 1.75rem;
    color: $color-warning;
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

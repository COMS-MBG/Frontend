<template>
  <BaseModal
    :model-value="isOpen"
    @update:model-value="val => !val && $emit('update:isOpen', false)"
    title="Hapus Sekolah Mitra"
    size="sm"
  >
    <div class="delete-confirmation" v-if="partner">
      <div class="icon-wrapper">
        <div class="icon-warning">
          <span class="material-symbols-outlined">warning</span>
        </div>
      </div>
      <h4 class="message">
        Apakah Anda yakin ingin menghapus <span class="highlight-name">{{ partner.nama_sekolah }}</span>?
      </h4>
      <p class="sub-message">
        Data yang dihapus tidak dapat dikembalikan. Seluruh informasi sekolah mitra ini akan dihilangkan dari sistem.
      </p>
    </div>

    <template #footer>
      <div class="modal-actions">
        <button
          type="button"
          class="btn-secondary"
          @click="$emit('update:isOpen', false)"
          :disabled="isDeleting"
        >
          Batal
        </button>
        <button
          type="button"
          class="btn-danger"
          @click="onConfirm"
          :disabled="isDeleting"
        >
          <span v-if="isDeleting" class="material-symbols-outlined spinning">sync</span>
          Ya, Hapus Data
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import type { Partner } from '@/types/partner'

const props = defineProps<{
  isOpen: boolean
  partner: Partner | null
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', val: boolean): void
  (e: 'confirm'): void
}>()

const toast  = useToast()
const isDeleting = ref(false)

async function onConfirm(): Promise<void> {
  if (!props.partner || isDeleting.value) return
  isDeleting.value = true

  try {
    emit('confirm')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped lang="scss">
.delete-confirmation {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: $space-4 $space-2 $space-2;

  .icon-wrapper {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-bottom: $space-6;

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: $color-danger;
      opacity: 0.1;
      border-radius: 50%;
      transform: scale(1.4);
      animation: pulse-danger 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .icon-warning {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: $color-danger-bg;
    color: $color-danger;
    box-shadow: $shadow-sm;

    span { font-size: $text-hero; }
  }

  .message {
    font-size: $text-lg;
    font-weight: 500;
    line-height: 1.5;
    color: $color-text-primary;
    margin-bottom: $space-3;
    max-width: 320px;

    .highlight-name {
      display: inline-block;
      font-weight: 700;
      color: $color-text-primary;
      background: $color-bg-subtle;
      padding: 2px $space-2;
      border-radius: $radius-sm;
      margin-top: $space-1;
    }
  }

  .sub-message {
    font-size: $text-sm;
    line-height: 1.5;
    color: $color-text-secondary;
    max-width: 280px;
  }
}

.modal-actions {
  display: flex;
  gap: $space-3;
  width: 100%;

  .btn-secondary,
  .btn-danger {
    flex: 1;
  }
}

@keyframes pulse-danger {
  0%   { transform: scale(1);   opacity: 0.15; }
  50%  { transform: scale(1.6); opacity: 0.05; }
  100% { transform: scale(1);   opacity: 0.15; }
}

.spinning {
  animation: spin 1s linear infinite;
  font-size: 1rem;
}

@keyframes spin { 100% { transform: rotate(360deg); } }
</style>

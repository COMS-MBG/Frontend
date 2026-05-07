<template>
  <BaseModal
    :model-value="store.isDeleteModalOpen"
    @update:model-value="val => !val && store.closeModal()"
    title="Hapus Bahan Baku"
    size="sm"
  >
    <div class="delete-confirmation" v-if="store.selectedIngredient">
      <div class="icon-wrapper">
        <div class="icon-warning">
          <span class="material-symbols-outlined">warning</span>
        </div>
      </div>
      <h4 class="message">
        Apakah Anda yakin ingin menghapus bahan baku <span class="highlight-name">{{ store.selectedIngredient.nama }}</span>?
      </h4>
      <p class="sub-message">Data yang dihapus tidak dapat dikembalikan. Pastikan bahan ini tidak sedang digunakan pada resep aktif.</p>
    </div>

    <template #footer>
      <div class="modal-actions">
        <button
          type="button"
          class="btn-secondary"
          @click="store.closeModal()"
          :disabled="store.loading"
        >
          Batal
        </button>
        <button
          type="button"
          class="btn-danger"
          @click="handleDelete"
          :disabled="store.loading"
        >
          <span v-if="store.loading" class="material-symbols-outlined spinning">sync</span>
          Ya, Hapus Data
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue'
import { useBahanStore } from '@/stores/bahan.store'

const store = useBahanStore()

const handleDelete = async () => {
  await store.deleteIngredient()
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

    span {
      font-size: 36px;
    }
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

  // Both buttons stretch equally for visual balance
  .btn-secondary,
  .btn-danger {
    flex: 1;
  }
}

@keyframes pulse-danger {
  0% {
    transform: scale(1);
    opacity: 0.15;
  }
  50% {
    transform: scale(1.6);
    opacity: 0.05;
  }
  100% {
    transform: scale(1);
    opacity: 0.15;
  }
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}
</style>

<template>
  <BaseModal
    :model-value="store.isFormModalOpen"
    @update:model-value="val => !val && store.closeModal()"
    :title="modalTitle"
    size="lg"
  >
    <BahanForm
      v-if="store.isFormModalOpen"
      :initial-data="store.selectedIngredient"
      :loading="store.loading"
      :submit-text="store.modalMode === 'create' ? 'Simpan Bahan' : 'Simpan Perubahan'"
      @submit="handleSubmit"
      @cancel="store.closeModal()"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BahanForm from './BahanForm.vue'
import { useBahanStore } from '@/stores/bahan.store'
import type { BahanItem } from '@/types/gizi'

const store = useBahanStore()

const modalTitle = computed(() => {
  return store.modalMode === 'create' ? 'Tambah Bahan Baku' : 'Edit Bahan Baku'
})

const handleSubmit = async (data: Omit<BahanItem, 'id'>) => {
  if (store.modalMode === 'create') {
    await store.createIngredient(data)
  } else if (store.selectedIngredient) {
    await store.updateIngredient(store.selectedIngredient.id, data)
  }
}
</script>

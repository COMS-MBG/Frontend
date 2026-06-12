<template>
  <BaseModal
    :model-value="isOpen"
    @update:model-value="val => !val && $emit('close')"
    :title="modalTitle"
    size="lg"
  >
    <BahanForm
      v-if="isOpen"
      :initial-data="initialData"
      :loading="isSubmitting"
      :submit-text="initialData ? 'Simpan Perubahan' : 'Simpan Bahan'"
      @submit="$emit('submit', $event)"
      @cancel="$emit('close')"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BahanForm from './BahanForm.vue'
import type { Ingredient, IngredientForm } from '@/types/ingredient'

const props = defineProps<{
  isOpen: boolean
  initialData: Ingredient | null
  isSubmitting: boolean
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: IngredientForm): void
}>()

const modalTitle = computed(() =>
  props.initialData ? 'Edit Bahan Baku' : 'Tambah Bahan Baku',
)
</script>

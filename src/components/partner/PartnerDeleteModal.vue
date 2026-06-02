<template>
  <ConfirmDeleteModal
    :model-value="isOpen"
    @update:model-value="val => $emit('update:isOpen', val)"
    title="Hapus Sekolah Mitra"
    :item-name="partner?.school_name ?? ''"
    confirm-label="Hapus"
    :is-submitting="isSubmitting"
    @confirm="onConfirm"
    @cancel="$emit('update:isOpen', false)"
  />
</template>

<script setup lang="ts">
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import type { Partner } from '@/types/partner'

const props = defineProps<{
  isOpen: boolean
  partner: Partner | null
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', val: boolean): void
  (e: 'confirm'): void
}>()

async function onConfirm(): Promise<void> {
  if (!props.partner || props.isSubmitting) return
  emit('confirm')
}
</script>

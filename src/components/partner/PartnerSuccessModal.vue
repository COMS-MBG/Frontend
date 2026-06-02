<template>
  <ResultModal
    :model-value="isOpen"
    @update:model-value="val => $emit('update:isOpen', val)"
    :title="title"
    :headline="headline"
    :message="message"
    variant="success"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ResultModal from '@/components/common/ResultModal.vue'

const props = defineProps<{
  isOpen: boolean
  mode: 'create' | 'edit' | 'delete'
  partnerName?: string | null
}>()

defineEmits<{
  (e: 'update:isOpen', val: boolean): void
}>()

const title = computed(() => {
  if (props.mode === 'create') return 'Partner Ditambahkan'
  if (props.mode === 'edit') return 'Partner Diperbarui'
  return 'Partner Dihapus'
})

const headline = computed(() => {
  if (props.mode === 'create') return 'Berhasil Ditambahkan!'
  if (props.mode === 'edit') return 'Berhasil Diperbarui!'
  return 'Berhasil Dihapus!'
})

const message = computed(() => {
  const name = props.partnerName || ''
  if (props.mode === 'create') {
    return `Sekolah mitra "${name}" telah berhasil ditambahkan ke daftar sekolah mitra.`
  }
  if (props.mode === 'edit') {
    return `Sekolah mitra "${name}" telah berhasil diperbarui.`
  }
  return `Sekolah mitra "${name}" telah berhasil dihapus dari sistem.`
})
</script>

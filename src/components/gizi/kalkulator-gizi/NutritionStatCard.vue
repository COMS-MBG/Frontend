<template>
  <StatCard
    :label="label"
    :icon="icon"
    :value="formattedValue"
    :subtitle="status"
    variant="default"
    :icon-variant="mappedIconVariant"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '@/components/common/StatCard.vue'
import type { StatVariant } from '@/types/gizi'

const props = defineProps<{
  label: string
  value: string | number
  unit: string
  icon: string
  status?: string
  variant?: StatVariant
}>()

const formattedValue = computed(() => `${props.value} ${props.unit}`)

/** Map domain StatVariant → StatCard iconVariant */
const mappedIconVariant = computed(() => {
  switch (props.variant) {
    case 'success': return 'green'
    case 'danger':  return 'orange'
    case 'warning': return 'orange'
    case 'primary': return 'blue'
    default:        return 'purple'
  }
})
</script>

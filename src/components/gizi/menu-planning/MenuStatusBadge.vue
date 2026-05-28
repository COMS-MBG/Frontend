<template>
  <BaseBadge :variant="badgeVariant" :text="config.label" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import { type StatusPublikasi, MENU_STATUS_CONFIG } from '@/types/menu-planning'

const props = defineProps<{
  status: StatusPublikasi
}>()

const config = computed(() => MENU_STATUS_CONFIG[props.status])

/**
 * Map internal variant to BaseBadge variant.
 * 'neutral' → 'default', 'info' → 'info', rest pass-through.
 */
const badgeVariant = computed(() => {
  const v = config.value.variant
  return v === 'neutral' ? 'default' : v
})
</script>

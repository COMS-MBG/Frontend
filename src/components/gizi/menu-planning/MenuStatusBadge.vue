<template>
  <BaseBadge :variant="config.variant === 'neutral' ? 'default' : config.variant" :text="config.label" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import { type StatusPublikasi, MENU_STATUS_CONFIG } from '@/types/menu-planning'

const props = defineProps<{
  status: StatusPublikasi
}>()

const config = computed(() => MENU_STATUS_CONFIG[props.status])
</script>

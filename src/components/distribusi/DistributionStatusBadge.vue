<script setup lang="ts">
import { computed } from 'vue'
import type { DeliveryStatus } from '@/types/distribution'
import { getStatusColor } from '@/utils/distribution'

const props = defineProps<{
  status: DeliveryStatus
}>()

const statusInfo = computed(() => getStatusColor(props.status))
</script>

<template>
  <span 
    class="badge" 
    :style="{ backgroundColor: statusInfo.hex + '22', color: statusInfo.hex }"
  >
    {{ statusInfo.label }}
  </span>
</template>



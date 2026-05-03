<script setup lang="ts">
import type { DeliveryStatus } from '@/types/distribution'
import { useDistributionStore } from '@/stores/distribution.store'

const props = defineProps<{
  id: number
  status: DeliveryStatus
}>()

const store = useDistributionStore()

const handleAction = () => {
  if (props.status === 'pending') {
    store.startDelivery(props.id)
  }
}
</script>

<template>
  <div class="distribution-action">
    <button 
      v-if="status === 'pending'" 
      class="btn-primary btn-sm"
      @click="handleAction"
      aria-label="Mulai Pengiriman"
    >
      📍 Mulai Pengiriman
    </button>
    <span v-else-if="status === 'in_progress'" class="distribution-action__text">
      Dalam perjalanan
    </span>
    <a 
      v-else-if="status === 'completed'" 
      href="#" 
      class="distribution-action__link"
      @click.prevent
    >
      Lihat Detail Laporan
    </a>
  </div>
</template>

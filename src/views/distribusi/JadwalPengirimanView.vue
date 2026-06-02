<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useDistribution } from '@/composables/useDistribution'
import { useDistributionWebSocket } from '@/composables/useDistributionWebSocket'
import DistributionToolbar from '@/components/distribusi/DistributionToolbar.vue'
import DistributionStatCard from '@/components/distribusi/DistributionStatCard.vue'
import DistributionTable from '@/components/distribusi/DistributionTable.vue'
import DistributionMap from '@/components/distribusi/map/DistributionMap.vue'
import DistributionDetailModal from '@/components/distribusi/DistributionDetailModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'

// Composable — single entry point for all distribution logic
const { fetchSchedules, selectedSchedule } = useDistribution()

// WebSocket — auto-disconnects on unmount via composable lifecycle
const { connect } = useDistributionWebSocket()

// Detail modal
const showDetailModal = ref(false)

// Open detail modal when a schedule is fetched/selected
watch(selectedSchedule, (newSchedule) => {
  if (newSchedule) {
    showDetailModal.value = true
  }
})

// Clear selected schedule state when modal is closed
watch(showDetailModal, (isOpen) => {
  if (!isOpen) {
    selectedSchedule.value = null
  }
})

onMounted(() => {
  fetchSchedules()
  connect()
})
</script>

<template>
  <div class="distribution-page">
    <PageHeader
      title="Jadwal Pengiriman"
      subtitle="Tracking Pengiriman Makanan"
      :breadcrumb="['Distribusi', 'Jadwal Pengiriman']"
    />

    <DistributionStatCard />
    <DistributionToolbar />
    <DistributionTable />
    <DistributionMap />

    <!-- Detail Modal -->
    <DistributionDetailModal
      v-model="showDetailModal"
      :schedule="selectedSchedule"
    />
  </div>
</template>
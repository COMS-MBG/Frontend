<script setup lang="ts">
import { onMounted } from 'vue'
import { useDistributionStore } from '@/stores/distribution.store'
import DistributionToolbar from '@/components/distribusi/DistributionToolbar.vue'
import DistributionStatCard from '@/components/distribusi/DistributionStatCard.vue'
import DistributionTable from '@/components/distribusi/DistributionTable.vue'
import DistributionMap from '@/components/distribusi/map/DistributionMap.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const store = useDistributionStore()

onMounted(() => {
  store.setItems([
    {
      id: 1,
      sekolah: 'SDN 012 Kebon Gedang',
      porsi: 450,
      jarakKm: 4.2,
      kurir: 'Bpk. Ahmad',
      kendaraan: 'Motor',
      status: 'pending',
      lat: -6.9213,
      lng: 107.6321
    },
    {
      id: 2,
      sekolah: 'SMPN 2 Bandung',
      porsi: 820,
      jarakKm: 2.8,
      kurir: 'Bpk. Doni',
      kendaraan: 'Mobil L300',
      status: 'in_progress',
      lat: -6.9147,
      lng: 107.6105
    },
    {
      id: 3,
      sekolah: 'SDN 054 Cicadas',
      porsi: 310,
      jarakKm: 5.1,
      kurir: 'Bpk. Rendi',
      kendaraan: 'Motor',
      status: 'completed',
      lat: -6.9032,
      lng: 107.6432
    }
  ])
})
</script>

<template>
  <div class="distribution-page">
    <PageHeader 
      title="Jadwal Pengiriman"
      subtitle="Tracking Pengiriman Makanan"
      :breadcrumb="['Distribusi', 'Jadwal Pengiriman']"
    >
      <!-- Actions moved to DistributionToolbar -->
    </PageHeader>

    <DistributionStatCard />
    <DistributionToolbar />
    <DistributionTable />
    <DistributionMap />
  </div>
</template>
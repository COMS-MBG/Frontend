<script setup lang="ts">
import { useLaporanStore } from '@/stores/laporan.store'
import StatCard from '@/components/common/StatCard.vue'

const store = useLaporanStore()
</script>

<template>
  <div class="laporan__stats">
    <StatCard
      label="TOTAL DISTRIBUSI HARI INI"
      icon="local_shipping"
      :value="store.stats.totalDistribusi"
      subtitle="Pengiriman"
      iconVariant="blue"
    />
    <StatCard
      label="SEKOLAH TERLAYANI"
      icon="school"
      :value="store.stats.totalSekolah"
      subtitle="Institusi"
      iconVariant="green"
    />
    <StatCard
      label="KETERLAMBATAN"
      icon="warning"
      :value="store.stats.keterlambatan"
      subtitle="Pengiriman terlambat"
      iconVariant="orange"
    />
    <StatCard
      label="EFISIENSI"
      icon="speed"
      :value="store.stats.efisiensi + '%'"
      subtitle="Sangat Baik"
      iconVariant="purple"
    />
  </div>
</template>

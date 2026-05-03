<script setup lang="ts">
import SpatialMap from '@/components/distribusi/spatial/SpatialMap.vue'
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<template>
  <div class="spatial-page">
    <PageHeader 
      title="Peta Spasial & Analitik"
      subtitle="Analisis Area Distribusi & Simulasi Blind Spot"
      :breadcrumb="['Distribusi', 'Peta Spasial']"
    />
    
    <div class="spatial-content">
      <SpatialMap />
    </div>
  </div>
</template>

<style scoped lang="scss">
.spatial-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.spatial-content {
  flex: 1;
  position: relative;
  z-index: 1;
}
</style>
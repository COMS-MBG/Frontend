<script setup lang="ts">
import { inject, onMounted, onUnmounted, watch, type Ref } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { useSpatialStore } from '@/stores/spatial.store'

const map = inject<Ref<L.Map | null>>('spatialMap')
const store = useSpatialStore()

let clusterGroup: L.MarkerClusterGroup | null = null
let sppgLayer: L.LayerGroup | null = null

import { sppgIcon, schoolIcon, createClusterIcon } from '@/utils/leafletIcons'

onMounted(() => {
  if (!map?.value) return

  // 1. Render SPPG (Hubs) - Always visible, no clustering needed
  sppgLayer = L.layerGroup()
  store.sppgLocations.forEach(sppg => {
    L.marker([sppg.lat, sppg.lng], { icon: sppgIcon })
      .bindPopup(`<strong>${sppg.name}</strong><br>Pusat Distribusi (SPPG)`)
      .addTo(sppgLayer!)
  })
  sppgLayer.addTo(map.value)

  // 2. Render Schools using MarkerCluster for performance
  clusterGroup = L.markerClusterGroup({
    chunkedLoading: true, // Prevents freezing during load of massive datasets
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    iconCreateFunction: (cluster) => createClusterIcon(cluster.getChildCount(), 'blue')
  })

  // Batch rendering markers
  const markers = store.schools.map(school => {
    return L.marker([school.lat, school.lng], { icon: schoolIcon })
      .bindPopup(`<strong>${school.name}</strong><br>${school.students} Siswa<br>Jarak: ${school.distanceKm} km`)
  })
  
  clusterGroup.addLayers(markers)
  map.value.addLayer(clusterGroup)
})

onUnmounted(() => {
  if (map?.value) {
    if (clusterGroup) map.value.removeLayer(clusterGroup)
    if (sppgLayer) map.value.removeLayer(sppgLayer)
  }
})
</script>

<template>
  <!-- Renderless Layer Component -->
</template>

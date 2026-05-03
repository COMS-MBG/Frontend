<script setup lang="ts">
import { inject, onMounted, onUnmounted, type Ref } from 'vue'
import L from 'leaflet'
import { useSpatialStore } from '@/stores/spatial.store'

const map = inject<Ref<L.Map | null>>('spatialMap')
const store = useSpatialStore()

let simulationLayer: L.LayerGroup | null = null

import { proposedSppgIcon, schoolIcon } from '@/utils/leafletIcons'

onMounted(() => {
  if (!map?.value || !store.simulationResult || !store.selectedSchool) return

  simulationLayer = L.layerGroup()
  const { proposedSppg, polygon } = store.simulationResult
  const school = store.selectedSchool

  // 1. Draw Coverage Polygon
  L.polygon(polygon as L.LatLngExpression[], {
    color: '#10b981',
    fillColor: '#10b981',
    fillOpacity: 0.15,
    weight: 2,
    dashArray: '5, 10'
  }).addTo(simulationLayer)

  // 2. Draw Target School
  L.marker([school.lat, school.lng], { icon: schoolIcon }).addTo(simulationLayer)

  // 3. Draw Proposed SPPG
  L.marker([proposedSppg.lat, proposedSppg.lng], { icon: proposedSppgIcon })
    .bindPopup('<strong>Lokasi Rekomendasi SPPG Baru</strong>')
    .addTo(simulationLayer)

  // 4. Draw Route Line (SPPG -> School)
  L.polyline([[proposedSppg.lat, proposedSppg.lng], [school.lat, school.lng]], {
    color: '#10b981',
    weight: 3,
    dashArray: '8, 8',
    opacity: 0.8
  }).addTo(simulationLayer)

  simulationLayer.addTo(map.value)

  // Fit bounds to polygon
  map.value.fitBounds(L.polygon(polygon as L.LatLngExpression[]).getBounds(), {
    padding: [50, 50],
    animate: true,
    duration: 1
  })
})

onUnmounted(() => {
  if (map?.value && simulationLayer) {
    map.value.removeLayer(simulationLayer)
  }
})
</script>

<template>
  <!-- Renderless Layer Component -->
</template>

<style>
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
</style>

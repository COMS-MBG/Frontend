<script setup lang="ts">
import { inject, onMounted, onUnmounted, watch, type Ref } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'
import { useSpatialStore } from '@/stores/spatial.store'

const map = inject<Ref<L.Map | null>>('spatialMap')
const store = useSpatialStore()

let sppgLayer: L.LayerGroup | null = null
let blindSpotCluster: L.MarkerClusterGroup | null = null

import { sppgIcon, getBlindSpotIcon, createClusterIcon } from '@/utils/leafletIcons'

onMounted(() => {
  if (!map?.value) return

  // Render SPPG
  sppgLayer = L.layerGroup()
  store.sppgLocations.forEach(sppg => {
    L.marker([sppg.lat, sppg.lng], { icon: sppgIcon })
      .bindPopup(`<strong>${sppg.name}</strong>`)
      .addTo(sppgLayer!)
    
    // Add 5km radius circle
    L.circle([sppg.lat, sppg.lng], {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      radius: 5000, // 5km
      weight: 2,
      dashArray: '5, 10'
    }).addTo(sppgLayer!)
  })
  sppgLayer.addTo(map.value)

  // Render Blind Spots
  blindSpotCluster = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: 40,
    iconCreateFunction: (cluster) => createClusterIcon(cluster.getChildCount(), 'red')
  })

  const markers = store.blindSpots.map(school => {
    const marker = L.marker([school.lat, school.lng], { icon: getBlindSpotIcon(false) })
    ;(marker as any).schoolId = school.id // Attach ID for later lookup
    
    marker.on('click', () => {
      store.selectSchool(school.id)
    })
    
    return marker
  })
  
  blindSpotCluster.addLayers(markers)
  map.value.addLayer(blindSpotCluster)
})

// Watch selected school to pulse marker and pan
watch(() => store.selectedSchool, (newSchool, oldSchool) => {
  if (!map?.value || !blindSpotCluster) return

  // Find markers via Leaflet's internal layer array to avoid duplicate memory maps
  const layers = blindSpotCluster.getLayers() as L.Marker[]

  // Reset old marker
  if (oldSchool) {
    const oldMarker = layers.find((m: any) => m.schoolId === oldSchool.id)
    if (oldMarker) oldMarker.setIcon(getBlindSpotIcon(false))
  }

  // Highlight new marker
  if (newSchool) {
    const newMarker = layers.find((m: any) => m.schoolId === newSchool.id)
    if (newMarker) {
      newMarker.setIcon(getBlindSpotIcon(true))
      
      // Smooth pan
      map.value.flyTo([newSchool.lat, newSchool.lng], 14, {
        animate: true,
        duration: 1
      })
    }
  }
})

onUnmounted(() => {
  if (map?.value) {
    if (blindSpotCluster) map.value.removeLayer(blindSpotCluster)
    if (sppgLayer) map.value.removeLayer(sppgLayer)
  }
})
</script>

<template>
  <!-- Renderless Layer Component -->
</template>

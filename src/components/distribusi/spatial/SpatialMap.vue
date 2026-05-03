<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide, shallowRef } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useSpatialStore } from '@/stores/spatial.store'

import MapToolbar from './MapToolbar.vue'
import MapLeftPanel from './MapLeftPanel.vue'
import MapRightPanel from './MapRightPanel.vue'
import SimulationPanel from './SimulationPanel.vue'

import MapMarkersLayer from './MapMarkersLayer.vue'
import BlindSpotLayer from './BlindSpotLayer.vue'
import SimulationLayer from './SimulationLayer.vue'

const store = useSpatialStore()
const mapContainer = ref<HTMLElement | null>(null)
const map = shallowRef<L.Map | null>(null)

// Initialize map ONCE
onMounted(() => {
  store.seedData() // Load mock data

  if (!mapContainer.value) return

  // Setup Leaflet
  const m = L.map(mapContainer.value, {
    center: [-6.9200, 107.6300], // Bandung center
    zoom: 12,
    zoomControl: false,
    preferCanvas: true // CRITICAL: GPU acceleration for large datasets
  })

  // Add CartoDB Positron base layer (clean light map)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(m)

  // Zoom control at bottom right
  L.control.zoom({ position: 'bottomright' }).addTo(m)

  map.value = m
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})

// Provide map instance to layer components
provide('spatialMap', map)
</script>

<template>
  <div class="spatial-map-container">
    <!-- UI Overlay Controls -->
    <MapToolbar />
    <MapLeftPanel />
    <MapRightPanel />
    <SimulationPanel />

    <!-- Leaflet Root -->
    <div ref="mapContainer" class="map-root"></div>

    <!-- Data Layers (Renderless components that attach to map) -->
    <template v-if="map">
      <MapMarkersLayer v-if="store.mode === 'default'" />
      <BlindSpotLayer v-if="store.mode === 'blind'" />
      <SimulationLayer v-if="store.mode === 'simulation'" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.spatial-map-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 80px); /* Adjust based on navbar */
  min-height: 600px;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.map-root {
  width: 100%;
  height: 100%;
  z-index: 1; /* Underneath panels */
}
</style>

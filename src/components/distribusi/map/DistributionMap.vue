<script setup lang="ts">
import { onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { useDistributionStore } from '@/stores/distribution.store'
import MapOverlayPanel from './MapOverlayPanel.vue'
import { getStatusColor } from '@/utils/distribution'

const store = useDistributionStore()
let map: L.Map | null = null
let markerCluster: L.MarkerClusterGroup | null = null
let polylineGroup: L.LayerGroup | null = null

onMounted(() => {
  map = L.map('distribution-map', { zoomControl: false, preferCanvas: true }).setView([-6.9213, 107.6321], 13)
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  markerCluster = L.markerClusterGroup({
    disableClusteringAtZoom: 15,
    maxClusterRadius: 40,
  })
  map.addLayer(markerCluster)

  polylineGroup = L.layerGroup().addTo(map)

  renderMapFeatures()
})

watch(() => store.filtered, () => {
  renderMapFeatures()
}, { deep: true })

function renderMapFeatures() {
  if (!map || !markerCluster || !polylineGroup) return

  markerCluster.clearLayers()
  polylineGroup.clearLayers()

  const center: [number, number] = [-6.9200, 107.6300]
  const allBounds: [number, number][] = [center]

  // Center Kitchen Pin
  const centerIcon = L.divIcon({
    className: 'leaflet-custom-icon',
    html: `<div class="pin center-pin"><span class="material-symbols-outlined">store</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  })
  const centerMarker = L.marker(center, { icon: centerIcon }).bindPopup('<b>Pusat Operasional (Dapur)</b>')
  markerCluster.addLayer(centerMarker)

  // Batching arrays for performance
  const markers: L.Marker[] = []
  
  store.filtered.forEach(item => {
    allBounds.push([item.lat, item.lng])
    
    // Solid Route Lines (Google Maps Style)
    const routeCoords: [number, number][] = [center, [item.lat, item.lng]]
    
    // Outer outline (glow)
    L.polyline(routeCoords, { color: '#60a5fa', weight: 7, opacity: 0.4 }).addTo(polylineGroup!)
    // Inner line
    L.polyline(routeCoords, { color: '#2563eb', weight: 3, opacity: 0.9 }).addTo(polylineGroup!)

    // Destination Pin
    const statusInfo = getStatusColor(item.status)
    const pinIcon = L.divIcon({
      className: 'leaflet-custom-icon',
      html: `<div class="pin bg-${statusInfo.class}"><span class="material-symbols-outlined">school</span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    })
    
    markers.push(
      L.marker([item.lat, item.lng], { icon: pinIcon })
       .bindPopup(`<strong>${item.sekolah}</strong><br>Status: ${statusInfo.label}`)
    )

    // Car Tracker for active fleets
    if (item.status === 'in_progress') {
      const fraction = 0.55 // Car is 55% of the way there
      const fleetLat = center[0] + (item.lat - center[0]) * fraction
      const fleetLng = center[1] + (item.lng - center[1]) * fraction

      const carIcon = L.divIcon({
        className: 'leaflet-custom-icon',
        html: `<div class="car-tracker"><span class="material-symbols-outlined">local_shipping</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })

      markers.push(
        L.marker([fleetLat, fleetLng], { icon: carIcon })
         .bindPopup(`<strong>Armada: ${item.kurir}</strong><br>Menuju: ${item.sekolah}`)
      )
    }
  })

  // Add all markers in bulk to cluster
  markerCluster.addLayers(markers)

  if (allBounds.length > 1) {
    map.fitBounds(allBounds, { padding: [60, 60] })
  }
}
</script>

<template>
  <div class="map-card">
    <div class="map-card__header">
      <h3 class="title">Analisis Spasial Jangkauan</h3>
      <span class="badge-live">
        <span class="pulse-dot"></span> LIVE TRACKING
      </span>
    </div>
    <div class="map-card__body">
      <div class="distribution__map-wrapper">
        <div id="distribution-map" class="map-view"></div>
        <MapOverlayPanel />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.map-card {
  background-color: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-md;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-4 $space-5;
    border-bottom: 1px solid $color-border-light;
    background-color: #fafafa;

    .title {
      margin: 0;
      font-size: 1.125rem;
      color: $color-text-primary;
      font-weight: 700;
      font-family: $font-heading;
    }

    .badge-live {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: $color-success;
      color: white;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      box-shadow: 0 0 10px rgba($color-success, 0.4);

      .pulse-dot {
        width: 6px;
        height: 6px;
        background-color: white;
        border-radius: 50%;
        animation: blink 1.5s infinite;
      }
    }
  }

  &__body {
    position: relative;
    padding: 0;
  }
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

.distribution__map-wrapper {
  position: relative;
  height: 550px;
  width: 100%;
}

.map-view {
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Deep classes for injected Leaflet elements */
:deep(.pin) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
  color: white;
  border: 2px solid white;
  
  span {
    transform: rotate(45deg);
    font-size: 16px;
  }

  &.center-pin { 
    background-color: $color-text-primary; 
    width: 36px;
    height: 36px;
    span { font-size: 18px; }
  }
  &.bg-success { background-color: $color-success; }
  &.bg-primary { background-color: $color-primary; }
  &.bg-warning { background-color: $color-warning; }
}

:deep(.car-tracker) {
  background-color: white;
  border: 2px solid $color-primary;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
  color: $color-primary;

  span { 
    font-size: 20px; 
    /* Slightly animate the car bouncing to look active */
    animation: car-bounce 1s infinite alternate ease-in-out;
  }
}

@keyframes car-bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-2px); }
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}
:deep(.leaflet-popup-content) {
  font-family: $font-body;
  font-size: 0.875rem;
}
</style>

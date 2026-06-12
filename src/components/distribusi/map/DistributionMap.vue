<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { useDistribution } from '@/composables/useDistribution'
import { useRouting } from '@/composables/useRouting'
import { spatialApi } from '@/api/distribution.api'
import MapOverlayPanel from './MapOverlayPanel.vue'
import { getStatusInfo } from '@/utils/distribution'
import type { DistributionItem } from '@/types/distribution'

const { items, optimizedRoute } = useDistribution()
const {
  isRoutingLoading,
  routingWarning,
  fetchRoutesForItems,
  getRouteForItem
} = useRouting()

let map: L.Map | null = null
let markerCluster: L.MarkerClusterGroup | null = null
let polylineGroup: L.LayerGroup | null = null

const depotCenter = ref<[number, number]>([-6.914744, 107.609810])
let activeRenderId = 0

onMounted(async () => {
  // Initialize map centered at current depotCenter default
  map = L.map('distribution-map', { zoomControl: false, preferCanvas: true }).setView(depotCenter.value, 13)
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

  // Retrieve actual depot location from API
  try {
    const depotRes = await spatialApi.getDepotLocation()
    if (depotRes?.data) {
      depotCenter.value = [depotRes.data.latitude, depotRes.data.longitude]
      map.setView(depotCenter.value, 13)
    }
  } catch (err) {
    console.error('Gagal mengambil lokasi depot dari API:', err)
  }

  await renderMapFeatures()
})

watch([items, optimizedRoute], async () => {
  await renderMapFeatures()
}, { deep: true })

async function renderMapFeatures() {
  activeRenderId++
  const renderId = activeRenderId

  if (!map || !markerCluster || !polylineGroup) return

  const center = depotCenter.value
  const allBounds: [number, number][] = [center]

  // If there's no backend-optimized route, batch fetch real-road routes from OSRM
  if (!optimizedRoute.value || !optimizedRoute.value.geojson) {
    await fetchRoutesForItems(center, items.value)
  }

  // Abort rendering if a newer render execution has started
  if (renderId !== activeRenderId) return

  // Clear previous layers
  markerCluster.clearLayers()
  polylineGroup.clearLayers()

  // Center Kitchen Pin
  const centerIcon = L.divIcon({
    className: 'leaflet-custom-icon',
    html: `<div class="pin center-pin"><span class="material-symbols-outlined">store</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  })
  const centerMarker = L.marker(center, { icon: centerIcon }).bindPopup('<b>Pusat Operasional (Dapur)</b>')
  markerCluster.addLayer(centerMarker)

  const markers: L.Marker[] = []

  // Draw Route Lines
  if (optimizedRoute.value && optimizedRoute.value.geojson) {
    // Render optimized multi-stop route
    L.geoJSON(optimizedRoute.value.geojson, {
      style: { color: '#60a5fa', weight: 9, opacity: 0.25, lineCap: 'round', lineJoin: 'round' }
    }).addTo(polylineGroup)

    L.geoJSON(optimizedRoute.value.geojson, {
      style: { color: '#2563eb', weight: 5, opacity: 0.8, lineCap: 'round', lineJoin: 'round' }
    }).addTo(polylineGroup)

    const coords = optimizedRoute.value.geojson.coordinates
    coords.forEach((coord: [number, number]) => {
      allBounds.push([coord[1], coord[0]])
    })
  } else {
    // Render OSRM-based road routes per destination
    items.value.forEach((item: DistributionItem) => {
      const route = getRouteForItem(item.id)
      if (route) {
        L.polyline(route.coordinates, {
          color: '#60a5fa',
          weight: 9,
          opacity: 0.25,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(polylineGroup!)

        L.polyline(route.coordinates, {
          color: '#2563eb',
          weight: 5,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(polylineGroup!)

        route.coordinates.forEach((coord) => {
          allBounds.push(coord)
        })
      } else {
        // Fallback straight line
        const routeCoords: [number, number][] = [center, [item.lat, item.lng]]
        L.polyline(routeCoords, {
          color: '#ef4444',
          weight: 3,
          opacity: 0.8,
          dashArray: '6 6',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(polylineGroup!)

        allBounds.push([item.lat, item.lng])
      }
    })
  }

  // Draw markers & trackers
  items.value.forEach((item: DistributionItem) => {
    allBounds.push([item.lat, item.lng])

    // Destination Pin
    const statusInfo = getStatusInfo(item.status)
    const pinIcon = L.divIcon({
      className: 'leaflet-custom-icon',
      html: `<div class="pin bg-${statusInfo.variant}"><span class="material-symbols-outlined">school</span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    })
    
    markers.push(
      L.marker([item.lat, item.lng], { icon: pinIcon })
       .bindPopup(`<strong>${item.sekolah}</strong><br>Alamat: ${item.alamat || '-'}<br>Status: ${statusInfo.label}`)
    )

    // Fleet Tracker for delivering schedules
    if (item.status === 'delivering') {
      let fleetLat = center[0]
      let fleetLng = center[1]
      let usingRealGps = false

      if (item.latestLocation) {
        fleetLat = item.latestLocation.latitude
        fleetLng = item.latestLocation.longitude
        usingRealGps = true
      } else {
        // Safe interpolation fallback along OSRM route if GPS is missing
        const route = getRouteForItem(item.id)
        if (route && route.coordinates.length > 0) {
          const midIndex = Math.floor(route.coordinates.length * 0.55)
          const targetCoord = route.coordinates[midIndex]
          if (targetCoord) {
            fleetLat = targetCoord[0]
            fleetLng = targetCoord[1]
          }
        } else {
          // Crow-flight interpolation fallback
          const fraction = 0.55
          fleetLat = center[0] + (item.lat - center[0]) * fraction
          fleetLng = center[1] + (item.lng - center[1]) * fraction
        }
      }

      const carIcon = L.divIcon({
        className: 'leaflet-custom-icon',
        html: `<div class="car-tracker"><span class="material-symbols-outlined">local_shipping</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })

      const locationTimeStr = item.latestLocation
        ? new Date(item.latestLocation.recorded_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : ''

      const popupContent = `
        <strong>Armada: ${item.kurir}</strong><br>
        Menuju: ${item.sekolah}<br>
        <span class="text-xs text-slate-500" style="display: block; margin-top: 4px; font-size: 0.75rem; color: #64748b;">
          ${usingRealGps ? `🛰️ GPS Terakhir: ${locationTimeStr}` : '⚠️ Lokasi Estimasi'}
        </span>
      `

      markers.push(
        L.marker([fleetLat, fleetLng], { icon: carIcon })
         .bindPopup(popupContent)
      )
    }
  })

  // Add all markers in bulk to cluster
  markerCluster.addLayers(markers)

  if (allBounds.length > 1) {
    map.fitBounds(allBounds, { padding: [60, 60] })
  }
}

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="map-card">
    <div class="map-card__header">
      <h3 class="title">Analisis Spasial Jangkauan</h3>
      <div class="header-actions">
        <transition name="fade">
          <span v-if="isRoutingLoading" class="routing-loading-indicator">
            <span class="spinner"></span> Menghitung rute...
          </span>
        </transition>
        <span class="badge-live">
          <span class="pulse-dot"></span> LIVE TRACKING
        </span>
      </div>
    </div>
    <div class="map-card__body">
      <!-- Routing Warning Banner -->
      <transition name="fade">
        <div v-if="routingWarning" class="routing-warning-banner">
          <span class="material-symbols-outlined text-warning">warning</span>
          <span class="warning-text">{{ routingWarning }}</span>
        </div>
      </transition>

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
    background-color: $color-bg-surface;

    .title {
      margin: 0;
      font-size: 1.125rem;
      color: $color-text-primary;
      font-weight: 700;
      font-family: $font-heading;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: $space-4;
    }

    .routing-loading-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8125rem;
      color: $color-text-secondary;
      font-weight: 500;

      .spinner {
        width: 14px;
        height: 14px;
        border: 2px solid $color-border;
        border-top-color: $color-primary;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
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
        background-color: $color-bg-surface;
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

.routing-warning-banner {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: $space-2;
  background-color: rgba(#1e293b, 0.85);
  backdrop-filter: blur(8px);
  color: #f8fafc;
  padding: 10px $space-4;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: auto;

  .text-warning {
    color: #f59e0b;
  }

  span.material-symbols-outlined {
    font-size: 1.25rem;
  }

  .warning-text {
    font-size: 0.8125rem;
    font-weight: 600;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
  box-shadow: $shadow-sm;
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
  &.bg-info    { background-color: $color-info; }
  &.bg-danger  { background-color: $color-danger; }
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
  box-shadow: $shadow-md;
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
  border-radius: $radius-lg;
  box-shadow: $shadow-lg;
}
:deep(.leaflet-popup-content) {
  font-family: $font-body;
  font-size: $text-base;
}
</style>

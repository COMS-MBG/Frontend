<template>
  <div class="sa-dashboard-card map-widget-card">
    <div class="map-widget-card__header">
      <div class="header-title">
        <span class="material-symbols-outlined header-icon">map</span>
        <h3>Peta Sebaran SPPG & Draf Pengajuan</h3>
      </div>
      <div class="header-meta">
        <span class="badge badge--success">{{ sppgs.length }} SPPG</span>
        <span class="badge badge--warning">{{ drafts.length }} Draf</span>
      </div>
    </div>
    
    <div class="map-widget-card__body">
      <div ref="mapContainer" class="dashboard-mini-map"></div>
      
      <!-- Floating Map Legend Overlay -->
      <div class="map-legend-overlay">
        <div class="legend-item">
          <span class="legend-marker sppg-marker-dot"></span>
          <span class="legend-text">SPPG Aktif</span>
        </div>
        <div class="legend-item">
          <span class="legend-marker draft-marker-dot"></span>
          <span class="legend-text">Draf Pengajuan Baru (Menunggu Konfirmasi)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SppgItem } from '@/types/superadmin-sppg'
import type { SppgDraft } from '@/types/superadmin-submission'

const props = defineProps<{
  sppgs: SppgItem[]
  drafts: SppgDraft[]
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markerGroup: L.LayerGroup | null = null

// Custom marker icons using divIcon to comply with Flat Premium Design
const sppgIcon = L.divIcon({
  html: `<div class="map-marker-icon marker-sppg"><span class="material-symbols-outlined">warehouse</span></div>`,
  className: 'custom-div-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
})

const draftIcon = L.divIcon({
  html: `<div class="map-marker-icon marker-draft"><span class="material-symbols-outlined">add_location_alt</span><div class="pulse-ring-yellow"></div></div>`,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

function initMap() {
  if (!mapContainer.value) return

  // Initialize Leaflet Map
  map = L.map(mapContainer.value, {
    center: [-6.9200, 107.6300], // Center on Bandung area by default
    zoom: 11,
    zoomControl: true,
    preferCanvas: true
  })

  // Voyager Tile Layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  markerGroup = L.layerGroup().addTo(map)
  renderMarkers()
}

function renderMarkers() {
  if (!map || !markerGroup) return
  markerGroup.clearLayers()

  const bounds: L.LatLngTuple[] = []

  // 1. Render SPPGs
  props.sppgs.forEach(s => {
    if (s.latitude && s.longitude) {
      const latLng: L.LatLngTuple = [s.latitude, s.longitude]
      bounds.push(latLng)

      const popupHtml = `
        <div class="sa-map-popup mini-popup">
          <h6>${s.name}</h6>
          <p class="address">${s.address}</p>
          <div class="popup-grid">
            <div><strong>Porsi:</strong> ${s.total_portions?.toLocaleString('id-ID') || 0}</div>
            <div><strong>Kapasitas:</strong> ${s.capacity?.toLocaleString('id-ID') || 0}</div>
          </div>
          <span class="status-tag status-${s.status}">${s.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
        </div>
      `

      L.marker(latLng, { icon: sppgIcon })
        .bindPopup(popupHtml)
        .addTo(markerGroup!)
    }
  })

  // 2. Render Draft Submissions
  props.drafts.forEach(d => {
    const lat = d.confirmed_latitude ?? d.latitude
    const lng = d.confirmed_longitude ?? d.longitude

    if (lat && lng) {
      const latLng: L.LatLngTuple = [lat, lng]
      bounds.push(latLng)

      const popupHtml = `
        <div class="sa-map-popup mini-popup">
          <h6>Draf Pengajuan SPPG</h6>
          <p class="nomer">${d.submission_number}</p>
          <div class="popup-grid">
            <div><strong>Mitra:</strong> ${d.partners?.length ?? 0} sekolah</div>
            <div><strong>Sumber:</strong> ${d.source}</div>
          </div>
          <span class="status-tag status-draft">Menunggu Konfirmasi</span>
        </div>
      `

      L.marker(latLng, { icon: draftIcon })
        .bindPopup(popupHtml)
        .addTo(markerGroup!)
    }
  })

  // Zoom to fit markers if there are any
  if (bounds.length > 0) {
    try {
      map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30] })
    } catch (e) {
      console.warn('Failed to fit bounds:', e)
    }
  }
}

// Watchers to redraw markers when data changes
watch([() => props.sppgs, () => props.drafts], () => {
  renderMarkers()
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    initMap()
    setTimeout(() => {
      map?.invalidateSize()
    }, 400)
  })
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
  markerGroup = null
})
</script>

<style scoped lang="scss">
.map-widget-card {
  display: flex;
  flex-direction: column;
  height: 420px;
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-4 $space-5;
    background: $color-bg-subtle;
    border-bottom: 1px solid $color-border;

    .header-title {
      display: flex;
      align-items: center;
      gap: $space-2;

      .header-icon {
        color: $color-primary;
        font-size: 1.25rem;
      }

      h3 {
        margin: 0;
        font-size: $text-sm;
        font-weight: 700;
        color: $color-text-primary;
      }
    }

    .header-meta {
      display: flex;
      gap: $space-2;
      
      .badge {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: $radius-sm;
        font-weight: 600;

        &--success {
          background: rgba($color-success, 0.1);
          color: $color-success-dark;
          border: 1px solid rgba($color-success, 0.2);
        }

        &--warning {
          background: rgba($color-warning, 0.1);
          color: $color-warning-dark;
          border: 1px solid rgba($color-warning, 0.2);
        }
      }
    }
  }

  &__body {
    flex-grow: 1;
    position: relative;
    height: calc(100% - 50px);
  }
}

.map-legend-overlay {
  position: absolute;
  bottom: $space-3;
  left: $space-3;
  background: var(--color-bg-overlay);
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $space-2-5 $space-3-5;
  box-shadow: $shadow-sm;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: $space-2;
  pointer-events: none;
  backdrop-filter: blur(4px);

  .legend-item {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  .legend-marker {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    border: 1px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

    &.sppg-marker-dot {
      background: $color-primary;
    }

    &.draft-marker-dot {
      background: $color-warning;
    }
  }

  .legend-text {
    font-size: 10px;
    font-weight: 700;
    color: $color-text-secondary;
  }
}

.dashboard-mini-map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

// Custom Marker styling in scss
:deep(.map-marker-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border: 2px solid white;

  .material-symbols-outlined {
    font-size: 16px;
  }

  &.marker-sppg {
    background: $color-primary;
  }

  &.marker-draft {
    background: $color-warning;
  }
}

:deep(.pulse-ring-yellow) {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid rgba($color-warning, 0.6);
  animation: pulse-ring 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  pointer-events: none;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 1; }
  80%, 100% { transform: scale(1.6); opacity: 0; }
}

:deep(.sa-map-popup.mini-popup) {
  padding: $space-1;
  h6 {
    margin: 0 0 $space-1 0;
    font-size: $text-sm;
    font-weight: 700;
    color: $color-text-primary;
  }
  .address {
    margin: 0 0 $space-2 0;
    font-size: 11px;
    color: $color-text-muted;
    line-height: 1.3;
  }
  .nomer {
    font-family: $font-mono;
    font-size: 11px;
    color: $color-primary-dark;
    font-weight: 600;
    margin: 0 0 $space-2 0;
  }
  .popup-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2px;
    font-size: 11px;
    color: $color-text-secondary;
    margin-bottom: $space-2;
  }
  .status-tag {
    display: inline-block;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 600;
    border-radius: $radius-sm;

    &.status-active {
      background: $color-success-subtle;
      color: $color-success-dark;
    }
    &.status-inactive {
      background: $color-danger-bg;
      color: $color-danger-darker;
    }
    &.status-draft {
      background: $color-warning-subtle;
      color: $color-warning-dark;
    }
  }
}
</style>

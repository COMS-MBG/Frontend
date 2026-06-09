import { ref, watch, shallowRef, nextTick, onUnmounted, type Ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type {
  KMeansRecommendation,
  SppgLayer,
  SubmissionLayer,
  SchoolLayerItem,
  PointValidationResponse,
  SuggestShiftResponse,
} from '@/types/superadmin-map'
import { MAP_COLORS } from '@/utils/mapConstants'
import type { OsrmRouteResult } from '@/types/routing'

// Leaflet Frontend Haversine Helper
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function useMapRenderer(options: {
  sppgLayers: Ref<SppgLayer[]>
  schools: Ref<SchoolLayerItem[]>
  recommendations: Ref<KMeansRecommendation[]>
  submissionLayers: Ref<SubmissionLayer[]>
  draftLatLng: Ref<{ lat: number; lng: number } | null>
  validationResult: Ref<PointValidationResponse | null>
  suggestedShift: Ref<SuggestShiftResponse | null>
  fetchRoadRoute: (fromLat: number, fromLng: number, toLat: number, toLng: number) => Promise<OsrmRouteResult | null>
  onSelectSppg: (sppg: SppgLayer) => void
  onSelectRec: (rec: KMeansRecommendation, idx: number) => void
}) {
  const {
    sppgLayers,
    schools,
    recommendations,
    submissionLayers,
    draftLatLng,
    validationResult,
    suggestedShift,
    fetchRoadRoute,
    onSelectSppg,
    onSelectRec,
  } = options

  const mapContainer = ref<HTMLElement | null>(null)
  const map = shallowRef<L.Map | null>(null)

  const showSppgLayer = ref(true)
  const showSchoolLayer = ref(true)
  const showRecommendationLayer = ref(true)
  const showSubmissionLayer = ref(true)
  const isRouteFetching = ref(false)

  let sppgLayerGroup: L.LayerGroup | null = null
  let schoolLayerGroup: L.LayerGroup | null = null
  let recommendationLayerGroup: L.LayerGroup | null = null
  let submissionLayerGroup: L.LayerGroup | null = null
  let connectionLayerGroup: L.LayerGroup | null = null
  let interactiveLayerGroup: L.LayerGroup | null = null

  let draftMarker: L.Marker | null = null
  let draftRadiusCircle: L.Circle | null = null

  // ── Custom Marker Icons ─────────────────────────────────────────────────────
  const activeSppgIcon = L.divIcon({
    html: `<div class="map-marker-icon marker-sppg"><span class="material-symbols-outlined">warehouse</span></div>`,
    className: 'custom-div-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  })

  const servedSchoolIcon = L.divIcon({
    html: `<div class="map-marker-icon marker-school-served"><span class="material-symbols-outlined">school</span></div>`,
    className: 'custom-div-icon',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  })

  const unservedSchoolIcon = L.divIcon({
    html: `<div class="map-marker-icon marker-school-unserved"><span class="material-symbols-outlined">school</span></div>`,
    className: 'custom-div-icon',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  })

  const takeoverSchoolIcon = L.divIcon({
    html: `<div class="map-marker-icon marker-school-takeover"><span class="material-symbols-outlined">school</span></div>`,
    className: 'custom-div-icon',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  })

  const recommendationIcon = L.divIcon({
    html: `<div class="map-marker-icon marker-recommendation"><span class="material-symbols-outlined">add_location_alt</span><div class="pulse-ring"></div></div>`,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  })

  // Proposed Draft Icons by validation status (green, yellow, red, grey)
  const proposedGreenIcon = L.divIcon({
    html: `<div class="map-marker-icon marker-proposed-green"><span class="material-symbols-outlined">check_circle</span><div class="pulse-ring-green"></div></div>`,
    className: 'custom-div-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  })

  const proposedYellowIcon = L.divIcon({
    html: `<div class="map-marker-icon marker-proposed-yellow"><span class="material-symbols-outlined">pending_actions</span><div class="pulse-ring-amber"></div></div>`,
    className: 'custom-div-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  })

  const proposedRedIcon = L.divIcon({
    html: `<div class="map-marker-icon marker-proposed-red"><span class="material-symbols-outlined">warning</span><div class="pulse-ring-red-small"></div></div>`,
    className: 'custom-div-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  })

  const proposedGreyIcon = L.divIcon({
    html: `<div class="map-marker-icon marker-proposed-grey"><span class="material-symbols-outlined">help</span></div>`,
    className: 'custom-div-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  })

  // Interactive Draft Marker A Icons by validation status
  const draftIconGreen = L.divIcon({
    html: `<div class="map-marker-icon marker-draft-green"><span class="material-symbols-outlined">pin_drop</span><div class="pulse-ring-green"></div></div>`,
    className: 'custom-div-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  })

  const draftIconYellow = L.divIcon({
    html: `<div class="map-marker-icon marker-draft-yellow"><span class="material-symbols-outlined">pin_drop</span><div class="pulse-ring-amber"></div></div>`,
    className: 'custom-div-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  })

  const draftIconRed = L.divIcon({
    html: `<div class="map-marker-icon marker-draft-red"><span class="material-symbols-outlined">report</span><div class="pulse-ring-red"></div></div>`,
    className: 'custom-div-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  })

  const draftIconGrey = L.divIcon({
    html: `<div class="map-marker-icon marker-draft-grey"><span class="material-symbols-outlined">pin_drop</span></div>`,
    className: 'custom-div-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  })

  function getRecommendationPortions(rec: KMeansRecommendation): number {
    return rec.schools.reduce((sum, recSchool) => {
      const mainSchool = schools.value.find((s) => s.id === recSchool.id)
      return sum + (mainSchool?.portion_count || 0)
    }, 0)
  }

  // ── Polyline Routing Drawing ────────────────────────────────────────────────
  async function drawRoadRoutes(
    center: { lat: number; lng: number },
    destinations: Array<{ lat: number; lng: number }>,
    color: string
  ) {
    if (!map.value || !connectionLayerGroup) return
    connectionLayerGroup.clearLayers()
    isRouteFetching.value = true

    const CONCURRENCY = 4
    const results: Array<OsrmRouteResult | null> = new Array(destinations.length).fill(null)
    let cursor = 0

    async function worker() {
      while (cursor < destinations.length) {
        const idx = cursor++
        const dest = destinations[idx]
        if (dest) {
          results[idx] = await fetchRoadRoute(center.lat, center.lng, dest.lat, dest.lng)
        }
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, destinations.length) }, () => worker())
    )

    destinations.forEach((dest, idx) => {
      const route = results[idx]
      if (route) {
        L.polyline(route.coordinates, {
          color,
          weight: 8,
          opacity: 0.2,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(connectionLayerGroup!)
        L.polyline(route.coordinates, {
          color,
          weight: 4,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(connectionLayerGroup!)
      } else {
        L.polyline([[center.lat, center.lng], [dest.lat, dest.lng]], {
          color,
          weight: 3,
          opacity: 0.7,
          dashArray: '6, 6',
        }).addTo(connectionLayerGroup!)
      }
    })

    isRouteFetching.value = false
  }

  // ── Render Layers ───────────────────────────────────────────────────────────
  function renderLayers() {
    if (!map.value) return

    if (!sppgLayerGroup || !schoolLayerGroup || !recommendationLayerGroup || !submissionLayerGroup || !connectionLayerGroup || !interactiveLayerGroup) {
      sppgLayerGroup = L.layerGroup().addTo(map.value)
      schoolLayerGroup = L.layerGroup().addTo(map.value)
      recommendationLayerGroup = L.layerGroup().addTo(map.value)
      submissionLayerGroup = L.layerGroup().addTo(map.value)
      connectionLayerGroup = L.layerGroup().addTo(map.value)
      interactiveLayerGroup = L.layerGroup().addTo(map.value)
    } else {
      sppgLayerGroup.clearLayers()
      schoolLayerGroup.clearLayers()
      recommendationLayerGroup.clearLayers()
      submissionLayerGroup.clearLayers()
      connectionLayerGroup.clearLayers()
    }

    // 1. Render Active SPPGs
    sppgLayers.value.forEach((sppg) => {
      const popupHtml = `
        <div class="sa-map-popup">
          <h5>${sppg.name}</h5>
          <p><strong>Kapasitas:</strong> ${sppg.capacity.toLocaleString()} porsi</p>
          <p><strong>Jumlah Mitra:</strong> ${sppg.partners.length} sekolah</p>
          <p><strong>Status:</strong> <span class="badge badge--success">${sppg.status}</span></p>
        </div>
      `
      const marker = L.marker([sppg.latitude, sppg.longitude], { icon: activeSppgIcon })
        .bindPopup(popupHtml)
      marker.on('click', () => onSelectSppg(sppg))
      sppgLayerGroup?.addLayer(marker)

      L.circle([sppg.latitude, sppg.longitude], {
        color: MAP_COLORS.SPPG_ROUTE,
        fillColor: MAP_COLORS.SPPG_ROUTE,
        fillOpacity: 0.04,
        radius: 5000,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(sppgLayerGroup!)
    })

    // 2. Render Schools
    schools.value.forEach((school) => {
      let icon = servedSchoolIcon
      let statusText = 'Terlayani (&le; 5km)'
      let statusClass = 'badge--success'

      if (school.status === 'unserved') {
        icon = unservedSchoolIcon
        statusText = 'Belum Terlayani'
        statusClass = 'badge--danger'
      } else if (school.status === 'takeover_candidate') {
        icon = takeoverSchoolIcon
        statusText = 'Kandidat Takeover (&gt; 5km)'
        statusClass = 'badge--warning'
      }

      const popupHtml = `
        <div class="sa-map-popup">
          <h5>${school.school_name}</h5>
          <p><strong>NPSN:</strong> ${school.npsn || '-'}</p>
          <p><strong>Kebutuhan:</strong> ${school.portion_count.toLocaleString()} porsi</p>
          <p><strong>Status:</strong> <span class="badge ${statusClass}">${statusText}</span></p>
          ${school.sppg_name ? `<p><strong>SPPG Pendukung:</strong> ${school.sppg_name} (${school.road_distance_km?.toFixed(2)} km)</p>` : ''}
          <p><strong>Kecamatan:</strong> ${school.district || '-'}</p>
        </div>
      `
      const marker = L.marker([school.latitude, school.longitude], { icon }).bindPopup(popupHtml)
      schoolLayerGroup?.addLayer(marker)
    })

    // 3. Render KMeans Recommendations
    recommendations.value.forEach((rec, idx) => {
      const totalPortions = getRecommendationPortions(rec)
      const popupHtml = `
        <div class="sa-map-popup">
          <h5>Rekomendasi SPPG Baru #${idx + 1}</h5>
          <p><strong>Kecamatan Terdekat:</strong> ${rec.schools[0]?.name || '-'}</p>
          <p><strong>Kebutuhan Total:</strong> ${totalPortions.toLocaleString()} porsi</p>
          <p><strong>Melayani:</strong> ${rec.school_count} sekolah sekitar</p>
        </div>
      `
      const marker = L.marker([rec.latitude, rec.longitude], { icon: recommendationIcon })
        .bindPopup(popupHtml)
      marker.on('click', () => onSelectRec(rec, idx))
      recommendationLayerGroup?.addLayer(marker)
    })

    // 4. Render Submissions (Proposed Drafts)
    submissionLayers.value.forEach((draft) => {
      // Safely parse lat & lng as float numbers
      const lat = draft.map_confirmed && draft.confirmed_latitude
        ? parseFloat(String(draft.confirmed_latitude))
        : parseFloat(String(draft.latitude))
      const lng = draft.map_confirmed && draft.confirmed_longitude
        ? parseFloat(String(draft.confirmed_longitude))
        : parseFloat(String(draft.longitude))

      // Skip invalid coordinates
      if (isNaN(lat) || isNaN(lng)) return

      let statusClass = 'badge--warning'
      if (draft.status === 'approved') statusClass = 'badge--success'
      else if (draft.status === 'rejected') statusClass = 'badge--danger'

      const popupHtml = `
        <div class="sa-map-popup">
          <h5>Pengajuan SPPG (${draft.submission_number})</h5>
          <p><strong>Status Pengajuan:</strong> <span class="badge ${statusClass}">${draft.status}</span></p>
          <p><strong>Status Titik:</strong> <span class="badge badge--info">${(draft.point_status || 'Belum Validasi').toUpperCase()}</span></p>
          <p><strong>Jumlah Mitra Draft:</strong> ${draft.partners.length} sekolah</p>
          <p><strong>Konfirmasi Lokasi:</strong> ${draft.map_confirmed ? 'Sudah Konfirmasi' : 'Belum Konfirmasi'}</p>
        </div>
      `
      
      // Icon mapping:
      // - Draft Belum Konfirmasi: proposedYellowIcon (yellow, pending_actions)
      // - Draft Sudah Konfirmasi: proposedGreenIcon (green, check_circle) or red/yellow based on point_status
      let icon = proposedYellowIcon // Default to yellow (unconfirmed)
      if (draft.map_confirmed) {
        icon = proposedGreenIcon
        if (draft.point_status === 'yellow') icon = proposedYellowIcon
        else if (draft.point_status === 'red') icon = proposedRedIcon
      }

      const marker = L.marker([lat, lng], { icon }).bindPopup(popupHtml)
      submissionLayerGroup?.addLayer(marker)
    })
  }

  function renderInteractiveLayers() {
    if (!map.value || !interactiveLayerGroup || !draftLatLng.value) return
    interactiveLayerGroup.clearLayers()
    draftMarker = null
    draftRadiusCircle = null

    let draftIcon = draftIconGrey
    if (validationResult.value) {
      if (validationResult.value.status === 'green') draftIcon = draftIconGreen
      else if (validationResult.value.status === 'yellow') draftIcon = draftIconYellow
      else if (validationResult.value.status === 'red') draftIcon = draftIconRed
    }

    draftMarker = L.marker([draftLatLng.value.lat, draftLatLng.value.lng], {
      icon: draftIcon,
      draggable: false,
      zIndexOffset: 1000,
    })

    const valStatus = validationResult.value ? validationResult.value.status.toUpperCase() : ''
    const valColor = validationResult.value
      ? validationResult.value.status === 'green'
        ? 'var(--color-success)'
        : validationResult.value.status === 'yellow'
          ? 'var(--color-warning)'
          : 'var(--color-danger)'
      : ''

    draftMarker.bindPopup(`
      <div class="sa-map-popup">
        <h5>📍 Titik Asal Pengajuan (A)</h5>
        <p><strong>Koordinat:</strong> ${draftLatLng.value.lat.toFixed(6)}, ${draftLatLng.value.lng.toFixed(6)}</p>
        ${validationResult.value ? `<p><strong>Status Spasial:</strong> <span style="font-weight:bold;color:${valColor}">${valStatus}</span></p>` : ''}
      </div>
    `)
    interactiveLayerGroup.addLayer(draftMarker)

    draftRadiusCircle = L.circle([draftLatLng.value.lat, draftLatLng.value.lng], {
      color: MAP_COLORS.RADIUS_CIRCLE,
      fillColor: MAP_COLORS.RADIUS_CIRCLE,
      fillOpacity: 0.04,
      radius: 5000,
      weight: 1.5,
      dashArray: '4, 4',
    })
    interactiveLayerGroup.addLayer(draftRadiusCircle)

    if (suggestedShift.value) {
      const { latitude: optLat, longitude: optLng } = suggestedShift.value

      const optimalMarkerIcon = L.divIcon({
        html: `<div class="map-marker-icon marker-optimal"><span class="material-symbols-outlined">verified</span><div class="pulse-ring-green"></div></div>`,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      })

      const optMarker = L.marker([optLat, optLng], {
        icon: optimalMarkerIcon,
        zIndexOffset: 1001,
      })

      optMarker.bindPopup(`
        <div class="sa-map-popup">
          <h5>✅ Titik Optimal Rekomendasi (A.1)</h5>
          <p><strong>Koordinat:</strong> ${optLat.toFixed(6)}, ${optLng.toFixed(6)}</p>
          <p><strong>Saran Pergeseran:</strong> ${suggestedShift.value.distance_meters}m</p>
        </div>
      `)
      interactiveLayerGroup.addLayer(optMarker)

      const connectionLine = L.polyline(
        [[draftLatLng.value.lat, draftLatLng.value.lng], [optLat, optLng]],
        {
          color: MAP_COLORS.SHIFT_LINE,
          weight: 3,
          dashArray: '6, 6',
          opacity: 0.8,
        }
      )
      interactiveLayerGroup.addLayer(connectionLine)

      const optRadiusCircle = L.circle([optLat, optLng], {
        color: MAP_COLORS.OPTIMAL_RADIUS_CIRCLE,
        fillColor: MAP_COLORS.OPTIMAL_RADIUS_CIRCLE,
        fillOpacity: 0.04,
        radius: 5000,
        weight: 1.5,
        dashArray: '4, 4',
      })
      interactiveLayerGroup.addLayer(optRadiusCircle)

      const optSchools = schools.value.filter((school) => {
        const dist = getHaversineDistance(optLat, optLng, school.latitude, school.longitude)
        return dist <= 5.0
      })

      optSchools.forEach((school) => {
        L.polyline([[optLat, optLng], [school.latitude, school.longitude]], {
          color: MAP_COLORS.OPT_SCHOOL_LINE,
          weight: 2,
          opacity: 0.7,
        }).addTo(interactiveLayerGroup!)
      })
    }
  }

  function removeInteractiveLayers() {
    if (interactiveLayerGroup) interactiveLayerGroup.clearLayers()
    draftMarker = null
    draftRadiusCircle = null
  }

  function fitMapBounds() {
    if (!map.value) return
    const group = L.featureGroup()
    sppgLayers.value.forEach((sppg) => group.addLayer(L.marker([sppg.latitude, sppg.longitude])))
    recommendations.value.forEach((rec) => group.addLayer(L.marker([rec.latitude, rec.longitude])))
    if (group.getLayers().length > 0) {
      map.value.fitBounds(group.getBounds().pad(0.15))
    } else {
      map.value.setView([-6.92, 107.63], 12)
    }
  }

  function initializeMap(container: HTMLElement) {
    const m = L.map(container, {
      center: [-6.92, 107.63],
      zoom: 12,
      zoomControl: false,
      preferCanvas: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(m)

    L.control.zoom({ position: 'bottomright' }).addTo(m)

    map.value = m
    renderLayers()
    fitMapBounds()

    nextTick(() => {
      m.invalidateSize()
    })
  }

  // Watchers to toggle layers on and off
  watch(showSppgLayer, (val) => {
    if (!map.value || !sppgLayerGroup) return
    if (val) map.value.addLayer(sppgLayerGroup)
    else map.value.removeLayer(sppgLayerGroup)
  })

  watch(showSchoolLayer, (val) => {
    if (!map.value || !schoolLayerGroup) return
    if (val) map.value.addLayer(schoolLayerGroup)
    else map.value.removeLayer(schoolLayerGroup)
  })

  watch(showRecommendationLayer, (val) => {
    if (!map.value || !recommendationLayerGroup) return
    if (val) map.value.addLayer(recommendationLayerGroup)
    else map.value.removeLayer(recommendationLayerGroup)
  })

  watch(showSubmissionLayer, (val) => {
    if (!map.value || !submissionLayerGroup) return
    if (val) map.value.addLayer(submissionLayerGroup)
    else map.value.removeLayer(submissionLayerGroup)
  })

  // Watch state changes to redraw interactive elements
  watch([draftLatLng, suggestedShift, validationResult], () => {
    renderInteractiveLayers()
  }, { deep: true })

  // Watch state changes of layers data to redraw them when updated
  watch([sppgLayers, schools, recommendations, submissionLayers], () => {
    renderLayers()
  }, { deep: true })

  onUnmounted(() => {
    if (map.value) {
      map.value.remove()
      map.value = null
    }
    sppgLayerGroup = null
    schoolLayerGroup = null
    recommendationLayerGroup = null
    submissionLayerGroup = null
    connectionLayerGroup = null
    interactiveLayerGroup = null
    draftMarker = null
    draftRadiusCircle = null
  })

  return {
    mapContainer,
    map,
    showSppgLayer,
    showSchoolLayer,
    showRecommendationLayer,
    showSubmissionLayer,
    isRouteFetching,
    initializeMap,
    renderLayers,
    renderInteractiveLayers,
    removeInteractiveLayers,
    fitMapBounds,
    drawRoadRoutes,
  }
}

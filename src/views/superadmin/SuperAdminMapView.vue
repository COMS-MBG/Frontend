<script setup lang="ts">
import { onMounted, ref, computed, watch, shallowRef, nextTick } from 'vue'
import { useSuperAdminMap } from '@/composables/useSuperAdminMap'
import { useToast } from '@/composables/useToast'
import { useMapRouting } from '@/composables/useMapRouting'
import { useMapRenderer } from '@/composables/useMapRenderer'
import { useMapInteraction } from '@/composables/useMapInteraction'

import PageHeader from '@/components/common/PageHeader.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseLoadingOverlay from '@/components/common/BaseLoadingOverlay.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import SaMapLayerControls from '@/components/superadmin/map/SaMapLayerControls.vue'
import SaMapLegend from '@/components/superadmin/map/SaMapLegend.vue'
import SaMapDraftControlPanel from '@/components/superadmin/map/SaMapDraftControlPanel.vue'
import SaMapRecommendationList from '@/components/superadmin/map/SaMapRecommendationList.vue'
import ConfirmActionModal from '@/components/common/ConfirmActionModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'

const {
  sppgLayers,
  submissionLayers,
  recommendations,
  schools,
  isLoading,
  error,
  fetchMapData,
  isProcessingAction,
  geocodeResults,
  validationResult,
  suggestedShift,
  searchAddress,
  runValidation,
  runSuggestShift,
  submitConfirmPoint,
  clearInteractiveState,
} = useSuperAdminMap()

const toast = useToast()

// 1. Routing Composable
const { isRouteFetching, fetchRoadRoute } = useMapRouting()

// Dummy refs to connect useMapInteraction and useMapRenderer circular dependency
const interactionMap = shallowRef<L.Map | null>(null)
const renderLayersDummy = ref<() => void>(() => {})
const renderInteractiveLayersDummy = ref<() => void>(() => {})
const removeInteractiveLayersDummy = ref<() => void>(() => {})
const fitMapBoundsDummy = ref<() => void>(() => {})
const drawRoadRoutesDummy = ref<(
  center: { lat: number; lng: number },
  destinations: Array<{ lat: number; lng: number }>,
  color: string
) => Promise<void>>(async () => {})


// 2. Interaction Composable
const interaction = useMapInteraction({
  map: interactionMap,
  schools,
  submissionLayers,
  suggestedShift,
  validationResult,
  error,
  runValidation,
  runSuggestShift,
  submitConfirmPoint,
  clearInteractiveState,
  renderLayers: () => renderLayersDummy.value(),
  renderInteractiveLayers: () => renderInteractiveLayersDummy.value(),
  removeInteractiveLayers: () => removeInteractiveLayersDummy.value(),
  fitMapBounds: () => fitMapBoundsDummy.value(),
  drawRoadRoutes: (center, dest, color) => drawRoadRoutesDummy.value(center, dest, color),
  toast,
})

const {
  selectedRecIndex,
  selectedSppgId,
  selectedDraftId,
  draftCapacity,
  draftLatLng,
  isConfirmModalOpen,
  confirmModalTitle,
  confirmModalMessage,
  confirmModalVariant,
  confirmModalIcon,
  isResultModalOpen,
  resultModalTitle,
  resultModalHeadline,
  resultModalMessage,
  resultModalVariant,
  selectedDraft,
  unconfirmedDrafts,
  selectRecommendation,
  selectSppg,
  selectDraft,
  deselectDraft,
  selectGeocodeResult,
  applySuggestedShift,
  handleConfirmPoint,
  proceedConfirmPoint,
} = interaction

// 3. Renderer Composable
const renderer = useMapRenderer({
  sppgLayers,
  schools,
  recommendations,
  submissionLayers,
  draftLatLng,
  validationResult,
  suggestedShift,
  fetchRoadRoute,
  onSelectSppg: (sppg) => selectSppg(sppg),
  onSelectRec: (rec, idx) => selectRecommendation(rec, idx),
})

const {
  mapContainer,
  map,
  showSppgLayer,
  showSchoolLayer,
  showRecommendationLayer,
  showSubmissionLayer,
  initializeMap,
} = renderer

// Bind real renderer properties to interaction dummy controllers
watch(map, (newMap) => {
  interactionMap.value = newMap
})
renderLayersDummy.value = renderer.renderLayers
renderInteractiveLayersDummy.value = renderer.renderInteractiveLayers
removeInteractiveLayersDummy.value = renderer.removeInteractiveLayers
fitMapBoundsDummy.value = renderer.fitMapBounds
drawRoadRoutesDummy.value = renderer.drawRoadRoutes

const isLegendCollapsed = ref(false)
const showError = computed(() => !!error.value)

onMounted(async () => {
  await fetchMapData()
  if (mapContainer.value) {
    initializeMap(mapContainer.value)
  }
})
</script>

<template>
  <div class="sa-map-page">
    <PageHeader
      title="Map Rekomendasi"
      subtitle="Visualisasi sebaran SPPG, pengajuan, dan rekomendasi optimal pembangunan SPPG baru"
      :breadcrumb="['Super Admin', 'Map Rekomendasi']"
      class="mb-6"
    />

    <!-- Map & Sidebar Layout -->
    <div class="sa-map-layout">
      <!-- Main Map Area -->
      <BaseCard class="sa-map-page__map-card">
        <BaseLoadingOverlay :show="isLoading" />
        <BaseAlert :show="showError" variant="error" :message="error ?? ''" />

        <!-- Route fetching indicator -->
        <transition name="fade">
          <div v-if="isRouteFetching" class="sa-map-page__route-loading">
            <span class="sa-map-page__route-spinner"></span>
            Menghitung rute jalan…
          </div>
        </transition>

        <!-- Controls Header -->
        <SaMapLayerControls
          v-model:showSppgLayer="showSppgLayer"
          v-model:showSchoolLayer="showSchoolLayer"
          v-model:showRecommendationLayer="showRecommendationLayer"
          v-model:showSubmissionLayer="showSubmissionLayer"
          :sppgCount="sppgLayers.length"
          :schoolCount="schools.length"
          :recommendationCount="recommendations.length"
          :submissionCount="submissionLayers.length"
        />

        <!-- Map Wrapper with Overlay Legend -->
        <div class="sa-map-page__map-wrapper">
          <!-- Leaflet Container -->
          <div class="sa-map-page__map-container" ref="mapContainer" id="super-admin-map"></div>

          <!-- Floating Map Legend Overlay -->
          <SaMapLegend v-model:isCollapsed="isLegendCollapsed" />
        </div>
      </BaseCard>

      <!-- Sidebar Panel -->
      <div class="sa-map-sidebar">
        <!-- GIS Interactive Control Panel -->
        <SaMapDraftControlPanel
          :unconfirmedDrafts="unconfirmedDrafts"
          :selectedDraftId="selectedDraftId"
          :selectedDraft="selectedDraft"
          :draftLatLng="draftLatLng"
          :isProcessingAction="isProcessingAction"
          :validationResult="validationResult"
          :suggestedShift="suggestedShift"
          :geocodeResults="geocodeResults"
          v-model:draftCapacity="draftCapacity"
          @select-draft="selectDraft"
          @deselect-draft="deselectDraft"
          @search-geocode="searchAddress"
          @select-geocode="selectGeocodeResult"
          @apply-shift="applySuggestedShift"
          @confirm-point="handleConfirmPoint"
        />

        <!-- List Rekomendasi KMeans -->
        <SaMapRecommendationList
          :recommendations="recommendations"
          :selectedRecIndex="selectedRecIndex"
          :schools="schools"
          @select-rec="selectRecommendation"
        />
      </div>
    </div>

    <!-- Modal Peringatan Validasi Spasial -->
    <ConfirmActionModal
      v-model="isConfirmModalOpen"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :variant="confirmModalVariant"
      :icon="confirmModalIcon"
      confirm-label="Ya, Konfirmasi"
      @confirm="proceedConfirmPoint"
    />

    <!-- Modal Hasil Konfirmasi -->
    <ResultModal
      v-model="isResultModalOpen"
      :title="resultModalTitle"
      :headline="resultModalHeadline"
      :message="resultModalMessage"
      :variant="resultModalVariant"
    />
  </div>
</template>

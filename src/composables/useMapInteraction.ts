import { ref, computed, nextTick, type Ref } from 'vue'
import type {
  KMeansRecommendation,
  SppgLayer,
  SubmissionLayer,
  SchoolLayerItem,
  PointValidationResponse,
  SuggestShiftResponse,
  GeocodeResult,
  ConfirmPointResponse,
} from '@/types/superadmin-map'

export function useMapInteraction(options: {
  map: Ref<any>
  schools: Ref<SchoolLayerItem[]>
  submissionLayers: Ref<SubmissionLayer[]>
  suggestedShift: Ref<SuggestShiftResponse | null>
  validationResult: Ref<PointValidationResponse | null>
  error: Ref<string | null>
  runValidation: (lat: number, lng: number, id?: string) => Promise<void>
  runSuggestShift: (lat: number, lng: number, id?: string) => Promise<void>
  submitConfirmPoint: (draftId: string, lat: number, lng: number, capacity?: number) => Promise<ConfirmPointResponse | null>
  clearInteractiveState: () => void
  renderLayers: () => void
  renderInteractiveLayers: () => void
  removeInteractiveLayers: () => void
  fitMapBounds: () => void
  drawRoadRoutes: (center: { lat: number; lng: number }, destinations: Array<{ lat: number; lng: number }>, color: string) => Promise<void>
  toast: any
}) {
  const {
    map,
    schools,
    submissionLayers,
    suggestedShift,
    validationResult,
    error,
    runValidation,
    runSuggestShift,
    submitConfirmPoint,
    clearInteractiveState,
    renderLayers,
    renderInteractiveLayers,
    removeInteractiveLayers,
    fitMapBounds,
    drawRoadRoutes,
    toast,
  } = options

  // ── Reactive states ────────────────────────────────────────────────────────
  const selectedRecIndex = ref<number | null>(null)
  const selectedSppgId = ref<number | null>(null)
  const selectedDraftId = ref<string | null>(null)
  const draftCapacity = ref(3000)
  const draftLatLng = ref<{ lat: number; lng: number } | null>(null)

  // ── GIS Alert Modals State ──────────────────────────────────────────────────
  const isConfirmModalOpen = ref(false)
  const confirmModalTitle = ref('Konfirmasi Lokasi')
  const confirmModalMessage = ref('')
  const confirmModalVariant = ref<'primary' | 'success' | 'warning' | 'danger'>('primary')
  const confirmModalIcon = ref('help')
  const isConfirmingOptimal = ref(false)

  // ── GIS Result Modal State ──────────────────────────────────────────────────
  const isResultModalOpen = ref(false)
  const resultModalTitle = ref('Berhasil')
  const resultModalHeadline = ref('')
  const resultModalMessage = ref('')
  const resultModalVariant = ref<'success' | 'error' | 'info' | 'warning'>('success')

  // ── Computed values ─────────────────────────────────────────────────────────
  const selectedDraft = computed<SubmissionLayer | null>(() => {
    if (!selectedDraftId.value) return null
    return submissionLayers.value.find((d) => String(d.id) === String(selectedDraftId.value)) ?? null
  })

  const unconfirmedDrafts = computed(() =>
    submissionLayers.value.filter((d) => !d.map_confirmed)
  )

  // ── Actions ─────────────────────────────────────────────────────────────────
  function selectRecommendation(rec: KMeansRecommendation, idx: number) {
    selectedRecIndex.value = idx
    selectedSppgId.value = null

    if (!map.value) return
    map.value.flyTo([rec.latitude, rec.longitude], 13.5, { animate: true, duration: 1.2 })

    const destinations = rec.schools.map((s) => ({ lat: s.latitude, lng: s.longitude }))
    drawRoadRoutes({ lat: rec.latitude, lng: rec.longitude }, destinations, '#8b5cf6')
  }

  function selectSppg(sppg: SppgLayer) {
    selectedSppgId.value = sppg.id
    selectedRecIndex.value = null

    if (!map.value) return
    map.value.flyTo([sppg.latitude, sppg.longitude], 13.5, { animate: true, duration: 1.2 })

    const destinations = sppg.partners.map((p) => ({ lat: p.latitude, lng: p.longitude }))
    drawRoadRoutes({ lat: sppg.latitude, lng: sppg.longitude }, destinations, '#2563eb')
  }

  async function triggerValidationAndShift() {
    if (!draftLatLng.value) return
    const { lat, lng } = draftLatLng.value
    const id = selectedDraftId.value ?? undefined
    await Promise.all([
      runValidation(lat, lng, id),
      runSuggestShift(lat, lng, id),
    ])
  }

  function selectDraft(draft: SubmissionLayer) {
    selectedDraftId.value = String(draft.id)
    selectedRecIndex.value = null
    selectedSppgId.value = null
    clearInteractiveState()

    const lat = draft.confirmed_latitude ?? draft.latitude
    const lng = draft.confirmed_longitude ?? draft.longitude
    draftLatLng.value = { lat, lng }
    draftCapacity.value = 3000

    nextTick(() => {
      map.value?.invalidateSize()
      if (map.value) {
        map.value.flyTo([lat, lng], 14, { animate: true, duration: 1.0 })
      }
    })

    renderInteractiveLayers()
    triggerValidationAndShift()
  }

  function deselectDraft() {
    selectedDraftId.value = null
    draftLatLng.value = null
    clearInteractiveState()
    removeInteractiveLayers()

    nextTick(() => {
      map.value?.invalidateSize()
    })
  }

  function selectGeocodeResult(result: GeocodeResult) {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    draftLatLng.value = { lat, lng }

    if (map.value) {
      map.value.flyTo([lat, lng], 15, { animate: true, duration: 1.0 })
    }

    renderInteractiveLayers()
    triggerValidationAndShift()
  }

  function applySuggestedShift() {
    if (!suggestedShift.value) return
    const { latitude, longitude } = suggestedShift.value
    draftLatLng.value = { lat: latitude, lng: longitude }

    if (map.value) {
      map.value.flyTo([latitude, longitude], 15, { animate: true, duration: 0.8 })
    }

    toast.success(`Titik digeser ke posisi optimal (${suggestedShift.value.distance_meters}m).`)
    triggerValidationAndShift()
  }

  async function handleConfirmPoint(useOptimal = false) {
    if (!selectedDraftId.value || !draftLatLng.value) return

    let status = 'green'
    if (!useOptimal && validationResult.value) {
      status = validationResult.value.status
    }

    isConfirmingOptimal.value = useOptimal

    if (useOptimal) {
      confirmModalTitle.value = 'Konfirmasi Titik Optimal'
      confirmModalMessage.value =
        'Apakah Anda yakin ingin mengonfirmasi dan menimpa lokasi draf dengan Titik Optimal Rekomendasi (A.1)? Koordinat draf dan daftar mitra sekolah akan otomatis diperbarui.'
      confirmModalVariant.value = 'success'
      confirmModalIcon.value = 'verified'
      isConfirmModalOpen.value = true
    } else if (status === 'yellow') {
      confirmModalTitle.value = 'Mitra Bersinggungan'
      confirmModalMessage.value =
        'Ada mitra bersinggungan di lokasi pengajuan ini. Apakah Anda yakin ingin melanjutkan konfirmasi titik draf asal (A)?'
      confirmModalVariant.value = 'warning'
      confirmModalIcon.value = 'warning'
      isConfirmModalOpen.value = true
    } else if (status === 'red') {
      confirmModalTitle.value = 'Konflik Wilayah Kritis'
      confirmModalMessage.value =
        'Titik pengajuan memiliki konflik wilayah kritis dengan SPPG aktif lain. Apakah Anda yakin ingin mengonfirmasi paksa titik asal (A) ini?'
      confirmModalVariant.value = 'danger'
      confirmModalIcon.value = 'report'
      isConfirmModalOpen.value = true
    } else {
      confirmModalTitle.value = 'Konfirmasi Lokasi Draf'
      confirmModalMessage.value =
        'Apakah Anda yakin ingin mengonfirmasi lokasi titik asal (A) untuk draf pengajuan ini? Sekolah mitra terdekat dalam jangkauan akan otomatis direkomendasikan.'
      confirmModalVariant.value = 'primary'
      confirmModalIcon.value = 'check_circle'
      isConfirmModalOpen.value = true
    }
  }

  async function proceedConfirmPoint() {
    isConfirmModalOpen.value = false
    if (!selectedDraftId.value || !draftLatLng.value) return

    let lat = draftLatLng.value.lat
    let lng = draftLatLng.value.lng

    if (isConfirmingOptimal.value && suggestedShift.value) {
      lat = suggestedShift.value.latitude
      lng = suggestedShift.value.longitude
    }

    const result = await submitConfirmPoint(
      selectedDraftId.value,
      lat,
      lng,
      draftCapacity.value
    )

    if (result) {
      resultModalTitle.value = 'Berhasil'
      resultModalHeadline.value = 'Lokasi Draf Berhasil Dikonfirmasi'

      const messageParts: string[] = ['Koordinat lokasi draf pengajuan telah berhasil disimpan.']

      if (result.address_data?.address) {
        messageParts.push(`📍 Alamat Terkini:\n${result.address_data.address}`)
      }

      if (result.partners_added && result.partners_added > 0 && result.partners_added_names) {
        messageParts.push(
          `✅ ${result.partners_added} Mitra Rekomendasi Baru Ditambahkan:\n• ` +
            result.partners_added_names.join('\n• ')
        )
      }

      if (result.partners_out_of_range && result.partners_out_of_range.length > 0) {
        messageParts.push(
          `⚠️ Peringatan Mitra di Luar Radius (5km/30mnt):\n• ` +
            result.partners_out_of_range
              .map((p: any) => `${p.school_name} (${p.distance_km} km, ${p.duration_min} mnt)`)
              .join('\n• ')
        )
      }

      resultModalMessage.value = messageParts.join('\n\n')
      resultModalVariant.value = 'success'
      isResultModalOpen.value = true

      deselectDraft()
      renderLayers()
      fitMapBounds()
    } else {
      resultModalTitle.value = 'Gagal'
      resultModalHeadline.value = 'Gagal Mengonfirmasi Lokasi'
      resultModalMessage.value =
        error.value || 'Terjadi kesalahan sistem saat mencoba mengonfirmasi koordinat lokasi draf.'
      resultModalVariant.value = 'error'
      isResultModalOpen.value = true
    }
  }

  return {
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
  }
}

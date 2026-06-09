<template>
  <BaseCard class="sa-gis-panel">
    <div class="sa-gis-panel__header">
      <h4>
        <span class="material-symbols-outlined">tune</span>
        Konfirmasi Lokasi Draft
      </h4>
      <p class="subtitle">Pilih draft pengajuan, validasi lokasi, dan konfirmasi koordinat SPPG baru</p>
    </div>

    <!-- Draft Selector -->
    <div class="sa-gis-panel__section">
      <AppSelect
        label="Pilih Draft Pengajuan"
        :model-value="selectedDraftId"
        :options="draftOptions"
        placeholder="— Pilih Draft —"
        @update:model-value="handleDraftSelectChange"
      />
    </div>

    <!-- Interactive Controls (visible when draft is selected) -->
    <template v-if="selectedDraft && draftLatLng">
      <!-- Geocoding Search -->
      <SaMapGeocodeSearch
        :geocodeResults="geocodeResults"
        :resetTrigger="selectedDraftId"
        @search-geocode="$emit('search-geocode', $event)"
        @select-geocode="$emit('select-geocode', $event)"
      />

      <!-- Current Coordinates Display -->
      <div class="sa-gis-panel__section">
        <label class="sa-gis-panel__label">Koordinat Saat Ini</label>
        <div class="sa-gis-panel__coords">
          <span class="material-symbols-outlined">my_location</span>
          {{ draftLatLng.lat.toFixed(6) }}, {{ draftLatLng.lng.toFixed(6) }}
        </div>
      </div>

      <!-- Validation Status -->
      <SaMapValidationStatus
        :validationResult="validationResult"
        :isProcessingAction="isProcessingAction"
      />

      <!-- Centroid Shift Suggestion -->
      <SaMapCentroidShift
        :suggestedShift="suggestedShift"
        :isProcessingAction="isProcessingAction"
        @apply-shift="$emit('apply-shift')"
      />

      <!-- Capacity Input -->
      <div class="sa-gis-panel__section">
        <label class="sa-gis-panel__label">Kapasitas SPPG (Porsi)</label>
        <input
          type="number"
          class="sa-gis-panel__input"
          :value="draftCapacity"
          @input="handleCapacityInput"
          min="1"
          placeholder="3000"
        />
      </div>

      <!-- Confirm Button -->
      <div class="sa-gis-panel__section sa-gis-panel__section--actions">
        <template v-if="suggestedShift">
          <button
            class="sa-gis-panel__btn sa-gis-panel__btn--confirm-a1"
            @click="$emit('confirm-point', true)"
            :disabled="isProcessingAction"
          >
            <template v-if="isProcessingAction">
              <span class="sa-map-page__route-spinner"></span>
              Memproses…
            </template>
            <template v-else>
              <span class="material-symbols-outlined">verified</span>
              Konfirmasi Titik Optimal (A.1)
            </template>
          </button>
          
          <button
            class="sa-gis-panel__btn sa-gis-panel__btn--confirm-a"
            @click="$emit('confirm-point', false)"
            :disabled="isProcessingAction"
          >
            <span class="material-symbols-outlined">pin_drop</span>
            Konfirmasi Titik Asal (A)
          </button>
        </template>
        
        <template v-else>
          <button
            class="sa-gis-panel__btn sa-gis-panel__btn--confirm"
            @click="$emit('confirm-point', false)"
            :disabled="isProcessingAction"
          >
            <template v-if="isProcessingAction">
              <span class="sa-map-page__route-spinner"></span>
              Memproses…
            </template>
            <template v-else>
              <span class="material-symbols-outlined">check_circle</span>
              Konfirmasi Lokasi & Rekomendasikan Mitra
            </template>
          </button>
        </template>

        <p v-if="validationResult?.status === 'red'" class="sa-gis-panel__hint sa-gis-panel__hint--danger">
          Peringatan: Lokasi Asal memiliki konflik kritis (Merah). Hubungi SPPG terkait atau gunakan Titik Optimal (A.1).
        </p>
        <p v-else-if="validationResult?.status === 'yellow'" class="sa-gis-panel__hint sa-gis-panel__hint--warning">
          Peringatan: Lokasi Asal memiliki konflik sedang (Kuning). Pertimbangkan menggunakan Titik Optimal (A.1).
        </p>

        <button
          class="sa-gis-panel__btn sa-gis-panel__btn--cancel"
          @click="$emit('deselect-draft')"
        >
          Batal
        </button>
      </div>
    </template>

    <!-- Empty state when no draft selected -->
    <div v-else class="sa-gis-panel__empty">
      <span class="material-symbols-outlined">touch_app</span>
      <p>Pilih draft pengajuan di atas untuk memulai proses validasi dan konfirmasi lokasi.</p>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import SaMapGeocodeSearch from './SaMapGeocodeSearch.vue'
import SaMapValidationStatus from './SaMapValidationStatus.vue'
import SaMapCentroidShift from './SaMapCentroidShift.vue'
import type { SelectOption } from '@/types/form'
import type {
  SubmissionLayer,
  GeocodeResult,
  PointValidationResponse,
  SuggestShiftResponse,
} from '@/types/superadmin-map'

const props = defineProps<{
  unconfirmedDrafts: SubmissionLayer[]
  selectedDraftId: string | null
  selectedDraft: SubmissionLayer | null
  draftLatLng: { lat: number; lng: number } | null
  isProcessingAction: boolean
  validationResult: PointValidationResponse | null
  suggestedShift: SuggestShiftResponse | null
  geocodeResults: GeocodeResult[]
  draftCapacity: number
}>()

const emit = defineEmits<{
  (e: 'update:draftCapacity', val: number): void
  (e: 'select-draft', draft: SubmissionLayer): void
  (e: 'deselect-draft'): void
  (e: 'search-geocode', query: string): void
  (e: 'select-geocode', result: GeocodeResult): void
  (e: 'apply-shift'): void
  (e: 'confirm-point', useOptimal?: boolean): void
}>()

const draftOptions = computed<SelectOption[]>(() =>
  props.unconfirmedDrafts.map(draft => ({
    label: `${draft.submission_number} — ${draft.partners.length} mitra`,
    value: String(draft.id)
  }))
)

function handleDraftSelectChange(val: string | number | null) {
  if (val) {
    const draft = props.unconfirmedDrafts.find(d => String(d.id) === String(val))
    if (draft) {
      emit('select-draft', draft)
    }
  } else {
    emit('deselect-draft')
  }
}

function handleCapacityInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  emit('update:draftCapacity', val)
}
</script>

<style scoped lang="scss">
.sa-gis-panel {
  padding: $space-4;
  overflow: visible !important;
  position: relative;
  z-index: 10;

  &__header {
    margin-bottom: $space-4;
    padding-bottom: $space-3;
    border-bottom: 1px solid $color-border;

    h4 {
      display: flex;
      align-items: center;
      gap: $space-2;
      font-size: $text-sm;
      font-weight: 600;
      margin: 0 0 $space-1 0;
      color: $color-text-primary;

      .material-symbols-outlined { font-size: 1.15rem; color: var(--color-purple); }
    }

    .subtitle {
      font-size: $text-xs;
      color: $color-text-muted;
      margin: 0;
      line-height: 1.3;
    }
  }

  &__section {
    margin-bottom: $space-3;

    &--actions {
      margin-top: $space-4;
      padding-top: $space-3;
      border-top: 1px solid $color-border;
    }
  }

  &__label {
    display: flex;
    align-items: center;
    gap: $space-1;
    font-size: $text-xs;
    font-weight: 600;
    color: $color-text-secondary;
    margin-bottom: $space-1;
    text-transform: uppercase;
    letter-spacing: 0.04em;

    .material-symbols-outlined { font-size: 14px; }
  }

  &__input {
    width: 100%;
    padding: $space-2 $space-3;
    font-size: $text-sm;
    font-family: $font-body;
    color: $color-text-primary;
    background: $color-bg-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    outline: none;
    transition: all $transition-base;

    &:focus {
      border-color: var(--color-purple);
      box-shadow: 0 0 0 3px var(--color-primary-muted);
    }
  }

  &__coords {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-3;
    background: $color-bg-subtle;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    font-family: $font-mono;
    font-size: 11px;
    color: $color-text-secondary;

    .material-symbols-outlined { font-size: 16px; color: var(--color-purple); }
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    width: 100%;
    padding: $space-2 $space-3;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-body;
    border: none;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-base;

    .material-symbols-outlined { font-size: 18px; }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--confirm {
      background: var(--color-purple);
      color: white;
      box-shadow: 0 4px 12px var(--color-primary-muted);

      &:hover:not(:disabled) {
        background: var(--color-primary-dark);
        box-shadow: 0 6px 24px var(--color-primary-muted);
        transform: translateY(-1px);
      }
    }

    &--confirm-a {
      background: transparent;
      border: 1px solid var(--color-purple);
      color: var(--color-purple);
      margin-top: $space-2;

      &:hover:not(:disabled) {
        background: rgba(124, 58, 237, 0.05);
      }
    }

    &--confirm-a1 {
      background: var(--color-success);
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);

      &:hover:not(:disabled) {
        background: #059669;
        box-shadow: 0 6px 24px rgba(16, 185, 129, 0.3);
        transform: translateY(-1px);
      }
    }

    &--cancel {
      background: transparent;
      color: $color-text-muted;
      margin-top: $space-2;

      &:hover { color: $color-text-secondary; background: $color-bg-subtle; }
    }
  }

  &__hint {
    font-size: $text-xs;
    margin: $space-2 0 0;
    line-height: 1.4;

    &--danger { color: var(--color-danger); }
    &--warning { color: var(--color-warning); }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $space-6 $space-4;
    text-align: center;
    color: $color-text-muted;

    .material-symbols-outlined {
      font-size: 2rem;
      margin-bottom: $space-2;
      color: $color-text-faint;
    }

    p {
      font-size: $text-xs;
      margin: 0;
      line-height: 1.5;
    }
  }
}

.sa-map-page__route-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(124, 58, 237, 0.3);
  border-top-color: var(--color-purple);
  border-radius: 50%;
  animation: sa-route-spin 0.8s linear infinite;
}

@keyframes sa-route-spin {
  to { transform: rotate(360deg); }
}
</style>

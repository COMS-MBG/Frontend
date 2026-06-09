<template>
  <div class="sa-gis-panel__section">
    <label class="sa-gis-panel__label">
      <span class="material-symbols-outlined">search</span>
      Cari Alamat / Lokasi
    </label>
    <div class="sa-geocode-search">
      <input
        type="text"
        class="sa-gis-panel__input"
        v-model="geocodeQuery"
        @input="handleGeocodeInput"
        @focus="geocodeDropdownOpen = geocodeResults.length > 0"
        placeholder="Ketik alamat atau nama tempat..."
      />
      <transition name="fade">
        <div v-if="geocodeDropdownOpen && geocodeResults.length" class="sa-geocode-dropdown">
          <div
            v-for="result in geocodeResults"
            :key="result.place_id"
            class="sa-geocode-dropdown__item"
            @click="handleSelectGeocodeResult(result)"
          >
            <span class="material-symbols-outlined">place</span>
            <span class="sa-geocode-dropdown__text">{{ result.display_name }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { GeocodeResult } from '@/types/superadmin-map'

const props = defineProps<{
  geocodeResults: GeocodeResult[]
  resetTrigger?: unknown
}>()

const emit = defineEmits<{
  (e: 'search-geocode', query: string): void
  (e: 'select-geocode', result: GeocodeResult): void
}>()

const geocodeQuery = ref('')
const geocodeDropdownOpen = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.resetTrigger, () => {
  geocodeQuery.value = ''
  geocodeDropdownOpen.value = false
})

watch(() => props.geocodeResults, (newVal) => {
  geocodeDropdownOpen.value = newVal.length > 0
})

function handleGeocodeInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!geocodeQuery.value.trim()) {
    geocodeDropdownOpen.value = false
    return
  }
  debounceTimer = setTimeout(() => {
    emit('search-geocode', geocodeQuery.value)
  }, 400)
}

function handleSelectGeocodeResult(result: GeocodeResult) {
  geocodeQuery.value = result.display_name
  geocodeDropdownOpen.value = false
  emit('select-geocode', result)
}
</script>

<style scoped lang="scss">
.sa-gis-panel {
  &__section {
    margin-bottom: $space-3;
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
}

.sa-geocode-search {
  position: relative;
}

.sa-geocode-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 100;
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  max-height: 200px;
  overflow-y: auto;

  &__item {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    padding: $space-2 $space-3;
    font-size: $text-xs;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
      background: $color-bg-subtle;
    }

    .material-symbols-outlined {
      font-size: 16px;
      color: var(--color-purple);
      flex-shrink: 0;
      margin-top: 1px;
    }
  }

  &__text {
    line-height: 1.4;
    word-break: break-word;
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
</style>

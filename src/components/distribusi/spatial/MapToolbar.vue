<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSpatialStore } from '@/stores/spatial.store'

const store = useSpatialStore()

// Local state for debouncing
const isBlindSpot = ref(false)
let timeoutId: number | null = null

// Search state
const isSearchExpanded = ref(false)
const searchQuery = ref('')

watch(isBlindSpot, (val) => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = window.setTimeout(() => {
    store.toggleBlindSpot(val)
  }, 300) // 300ms debounce
})

// Sync back if mode resets
watch(() => store.mode, (mode) => {
  if (mode === 'default') {
    isBlindSpot.value = false
  }
})

const toggleSearch = () => {
  isSearchExpanded.value = !isSearchExpanded.value
  if (!isSearchExpanded.value) {
    searchQuery.value = ''
  }
}
</script>

<template>
  <div class="spatial-toolbar">
    <label class="toggle-switch" :class="{ 'disabled': store.mode === 'simulation' }">
      <span class="label">Tampilkan Blind Spot</span>
      <input type="checkbox" v-model="isBlindSpot" :disabled="store.mode === 'simulation'" />
      <span class="slider round"></span>
    </label>

    <div class="divider"></div>

    <div class="search-box" :class="{ 'expanded': isSearchExpanded }">
      <button class="icon-btn" @click="toggleSearch" aria-label="Toggle Search">
        <span class="material-symbols-outlined">search</span>
      </button>
      <input 
        ref="searchInput"
        type="text" 
        v-model="searchQuery"
        placeholder="Cari area atau sekolah..." 
        aria-label="Search map" 
      />
    </div>

    <button class="icon-btn" aria-label="Map Layers">
      <span class="material-symbols-outlined">layers</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.spatial-toolbar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  border-radius: 999px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  z-index: 1000;
  width: max-content;
}

.divider {
  width: 1px;
  height: 24px;
  background: $color-border;
  margin: 0 4px;
}

.search-box {
  display: flex;
  align-items: center;
  background: transparent;
  border-radius: 999px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &.expanded {
    background: $color-bg-subtle;
    padding-right: 12px;
  }

  input {
    width: 0;
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.875rem;
    font-family: inherit;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0;
    opacity: 0;
  }

  &.expanded input {
    width: 180px;
    padding-left: 8px;
    opacity: 1;
  }
}

.icon-btn {
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: $color-text-secondary;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: $color-bg-subtle;
    color: $color-primary;
  }
  
  .material-symbols-outlined {
    font-size: 20px;
  }
}

/* Toggle Switch Styles */
.toggle-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding-right: 4px;

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-text-secondary;
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .slider {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    background-color: #cbd5e1;
    border-radius: 24px;
    transition: .4s;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      border-radius: 50%;
      transition: .4s;
    }
  }

  input:checked + .slider {
    background-color: $color-danger; // Red for blind spot
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }
}
</style>

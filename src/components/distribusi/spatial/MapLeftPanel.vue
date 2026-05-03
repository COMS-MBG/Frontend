<script setup lang="ts">
import { useSpatialStore } from '@/stores/spatial.store'

const store = useSpatialStore()
</script>

<template>
  <div v-if="store.mode === 'blind'" class="map-left-panel">
    <div class="panel-header">
      <div class="icon-wrapper">
        <span class="material-symbols-outlined icon-error">warning</span>
      </div>
      <div>
        <h3>Area Blind Spot</h3>
        <p>{{ store.blindSpots.length }} Sekolah dengan status Kritis</p>
      </div>
    </div>
    
    <div class="panel-content">
      <div 
        v-for="school in store.blindSpots" 
        :key="school.id"
        class="school-card"
        :class="{ 'active': store.selectedSchool?.id === school.id }"
        @click="store.selectSchool(school.id)"
      >
        <div class="card-title">
          <span class="material-symbols-outlined">school</span>
          <strong>{{ school.name }}</strong>
        </div>
        <div class="card-meta">
          <span class="badge badge-error">{{ school.distanceKm }} km</span>
          <span class="text-muted">{{ school.students }} Siswa</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.map-left-panel {
  position: absolute;
  top: 90px;
  left: 20px;
  width: 320px;
  bottom: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.panel-header {
  padding: 20px;
  background: white;
  border-bottom: 1px solid $color-border-light;
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 40px;
    height: 40px;
    background: #fee2e2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .icon-error { color: $color-danger; }
  }

  h3 {
    margin: 0 0 4px 0;
    font-size: 1.125rem;
    color: $color-text-primary;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    color: $color-text-muted;
  }
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
}

.school-card {
  padding: 16px;
  background: white;
  border: 1px solid $color-border;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: $color-danger;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
  }

  &.active {
    border-color: $color-danger;
    background: #fef2f2;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    span { color: $color-text-secondary; }
    strong { color: $color-text-primary; }
  }

  .card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .badge-error {
      background: #fee2e2;
      color: $color-danger;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .text-muted {
      font-size: 0.875rem;
      color: $color-text-muted;
    }
  }
}
</style>

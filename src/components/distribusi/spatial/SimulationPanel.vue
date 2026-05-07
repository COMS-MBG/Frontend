<script setup lang="ts">
import { useSpatialStore } from '@/stores/spatial.store'

const store = useSpatialStore()
</script>

<template>
  <div v-if="store.mode === 'simulation' && store.simulationResult" class="simulation-panel">
    <div class="panel-header">
      <div class="title-group">
        <span class="material-symbols-outlined icon-sim">model_training</span>
        <h2>Hasil Simulasi SPPG</h2>
      </div>
      <button class="icon-btn-close" @click="store.resetSimulation" aria-label="Tutup Simulasi">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <div class="panel-content">
      <div class="metrics-row">
        <div class="sim-metric">
          <small>Siswa Tercover</small>
          <strong>+{{ store.simulationResult.newStudents }}</strong>
        </div>
        <div class="sim-metric">
          <small>Efisiensi Rute</small>
          <strong class="text-success">{{ store.simulationResult.efficiency }}</strong>
        </div>
        <div class="sim-metric">
          <small>Total Coverage</small>
          <strong class="text-primary">{{ store.simulationResult.coverage }}</strong>
        </div>
      </div>

      <div class="actions">
        <button class="btn-secondary" @click="store.resetSimulation">Ubah Lokasi</button>
        <button class="btn-primary">Terapkan SPPG Baru</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.simulation-panel {
  position: absolute;
  bottom: $space-5;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 700px;
  background: $color-bg-overlay;
  backdrop-filter: blur(8px);
  border-radius: $radius-2xl;
  box-shadow: $shadow-lg;
  z-index: 1000;
  border: 1px solid $color-border-light;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-4 $space-6;
  background: $color-bg-subtle;
  border-bottom: 1px solid $color-border-light;

  .title-group {
    display: flex;
    align-items: center;
    gap: $space-3;

    .icon-sim {
      color: $color-primary;
    }

    h2 {
      margin: 0;
      font-size: $text-lg;
      color: $color-text-primary;
    }
  }

  .icon-btn-close {
    background: transparent;
    border: none;
    cursor: pointer;
    color: $color-text-muted;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover { color: $color-danger; }
  }
}

.panel-content {
  padding: $space-6;
}

.metrics-row {
  display: flex;
  gap: $space-5;
  margin-bottom: $space-6;

  .sim-metric {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-4;
    background: $color-bg-subtle;
    border-radius: $radius-lg;
    text-align: center;

    small {
      color: $color-text-muted;
      font-size: $text-base;
      margin-bottom: $space-2;
    }

    strong {
      font-size: 1.5rem;
      color: $color-text-primary;
    }

    .text-success { color: $color-success; }
    .text-primary { color: $color-primary; }
  }
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: $space-4;
}
</style>

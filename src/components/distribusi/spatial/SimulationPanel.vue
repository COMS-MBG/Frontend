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
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 700px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.4);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: $color-bg-subtle;
  border-bottom: 1px solid $color-border-light;

  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-sim {
      color: $color-primary;
    }

    h2 {
      margin: 0;
      font-size: 1.125rem;
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
  padding: 24px;
}

.metrics-row {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;

  .sim-metric {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    background: $color-bg-subtle;
    border-radius: 12px;
    text-align: center;

    small {
      color: $color-text-muted;
      font-size: 0.875rem;
      margin-bottom: 8px;
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
  gap: 16px;
}
</style>

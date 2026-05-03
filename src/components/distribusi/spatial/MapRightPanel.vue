<script setup lang="ts">
import { useSpatialStore } from '@/stores/spatial.store'

const store = useSpatialStore()
</script>

<template>
  <div v-if="store.mode === 'blind' && store.selectedSchool" class="map-right-panel">
    <div class="panel-cover"></div>
    <div class="panel-content">
      <div class="school-header">
        <h2>{{ store.selectedSchool.name }}</h2>
        <span v-if="store.isCritical(store.selectedSchool)" class="badge badge-error">Kritis</span>
      </div>

      <div class="metrics-grid">
        <div class="metric">
          <span class="material-symbols-outlined text-muted">route</span>
          <div class="meta">
            <small>Jarak SPPG</small>
            <strong>{{ store.selectedSchool.distanceKm }} km</strong>
          </div>
        </div>
        <div class="metric">
          <span class="material-symbols-outlined text-muted">timer</span>
          <div class="meta">
            <small>Est. Waktu</small>
            <strong>~45 Menit</strong>
          </div>
        </div>
        <div class="metric">
          <span class="material-symbols-outlined text-muted">groups</span>
          <div class="meta">
            <small>Kapasitas Siswa</small>
            <strong>{{ store.selectedSchool.students }}</strong>
          </div>
        </div>
      </div>

      <div v-if="store.isCritical(store.selectedSchool)" class="warning-box">
        <span class="material-symbols-outlined icon">info</span>
        <p>Sekolah ini berada di luar radius operasional aman (5km). Risiko keterlambatan distribusi sangat tinggi.</p>
      </div>

      <div class="actions">
        <button class="btn-primary w-100" @click="store.runSimulation">
          Simulasikan Penempatan SPPG
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.map-right-panel {
  position: absolute;
  top: 90px;
  right: 20px;
  width: 360px;
  max-height: calc(100% - 110px);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 1000;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.4);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
}

.panel-cover {
  height: 120px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
}

.panel-content {
  padding: 24px;
  margin-top: -30px;
  background: white;
  border-radius: 24px 24px 0 0;
}

.school-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: $color-text-primary;
    line-height: 1.4;
  }

  .badge-error {
    background: #fee2e2;
    color: $color-danger;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
  }
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  .metric {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background: $color-bg-subtle;
    border-radius: 12px;

    .text-muted {
      color: $color-text-muted;
      font-size: 1.5rem;
    }

    .meta {
      display: flex;
      flex-direction: column;

      small {
        color: $color-text-muted;
        font-size: 0.75rem;
      }
      strong {
        color: $color-text-primary;
        font-size: 1rem;
      }
    }
  }
}

.warning-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  margin-bottom: 24px;

  .icon {
    color: #d97706;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    color: #92400e;
    line-height: 1.5;
  }
}

.w-100 {
  width: 100%;
}
</style>

<template>
  <div class="sa-map-legend-overlay" :class="{ 'sa-map-legend-overlay--collapsed': isCollapsed }">
    <div class="sa-map-legend-overlay__header" @click="$emit('update:isCollapsed', !isCollapsed)">
      <span>📍 Legenda Peta</span>
      <span class="material-symbols-outlined toggle-icon">
        {{ isCollapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
      </span>
    </div>
    <div class="sa-map-legend-overlay__body" v-show="!isCollapsed">
      <div class="legend-list">
        <div class="legend-item">
          <span class="legend-badge legend-sppg"><span class="material-symbols-outlined">warehouse</span></span>
          <span>SPPG Aktif</span>
        </div>
        <div class="legend-item">
          <span class="legend-badge legend-school-served"><span class="material-symbols-outlined">school</span></span>
          <span>Sekolah Terlayani (&le; 5km)</span>
        </div>
        <div class="legend-item">
          <span class="legend-badge legend-school-takeover"><span class="material-symbols-outlined">school</span></span>
          <span>Kandidat Takeover (&gt; 5km)</span>
        </div>
        <div class="legend-item">
          <span class="legend-badge legend-school-unserved"><span class="material-symbols-outlined">school</span></span>
          <span>Sekolah Belum Terlayani</span>
        </div>
        <div class="legend-item">
          <span class="legend-badge legend-recommendation"><span class="material-symbols-outlined">add_location_alt</span></span>
          <span>Rekomendasi SPPG Baru</span>
        </div>
        <div class="legend-item">
          <span class="legend-badge legend-proposed-unconfirmed"><span class="material-symbols-outlined">pending_actions</span></span>
          <span>Draft Belum Konfirmasi</span>
        </div>
        <div class="legend-item">
          <span class="legend-badge legend-proposed-confirmed"><span class="material-symbols-outlined">check_circle</span></span>
          <span>Draft Sudah Konfirmasi</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isCollapsed: boolean
}>()

defineEmits<{
  (e: 'update:isCollapsed', val: boolean): void
}>()
</script>

<style scoped lang="scss">
.legend-list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  font-size: $text-xs;
  color: $color-text-secondary;
}

.legend-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  border: 1px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  span { font-size: 12px; }
}

.sa-map-legend-overlay {
  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 999;
  background: rgba(#ffffff, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid $color-border;
  border-radius: $radius-md;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 240px;
  transition: all 0.3s ease;
  overflow: hidden;

  &--collapsed {
    width: 140px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background: $color-bg-subtle;
    border-bottom: 1px solid $color-border;
    cursor: pointer;
    font-size: 10px;
    font-weight: 700;
    color: $color-text-primary;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    user-select: none;

    .toggle-icon {
      font-size: 16px;
      color: $color-text-secondary;
    }
  }

  &__body {
    padding: 8px 12px;
    max-height: 200px;
    overflow-y: auto;

    .legend-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 10px;
      font-weight: 500;
      color: $color-text-secondary;
    }

    .legend-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      color: white;
      border: 1px solid white;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;

      span {
        font-size: 10px;
      }
    }
  }

  // Legend marker color categories using CSS theme variables (No hardcoded hex!)
  .legend-sppg { background: var(--color-primary); }
  .legend-school-served { background: var(--color-success); }
  .legend-school-takeover { background: var(--color-warning); }
  .legend-school-unserved { background: var(--color-danger); }
  .legend-recommendation { background: var(--color-primary-dark); border-color: var(--color-warning); }
  .legend-proposed-unconfirmed { background: var(--color-warning); }
  .legend-proposed-confirmed { background: var(--color-success); }
}
</style>

<template>
  <div class="health-score-card">
    <div class="hsc-header">
      <span class="material-symbols-outlined">verified</span>
      <span class="hsc-subtitle">HEALTH SCORE ANALYSIS</span>
    </div>
    <h3 class="hsc-title">Pilihan Sehat</h3>
    <p class="hsc-desc">
      Resep ini memiliki densitas nutrisi yang tinggi dan rendah lemak jenuh. Cocok untuk program makan siang sehat (MBG).
    </p>
    <button class="btn-download">
      DOWNLOAD PDF LAPORAN
    </button>
  </div>
</template>

<script setup lang="ts">
// Static component
</script>

<style scoped lang="scss">
.health-score-card {
  background-color: #064e3b; /* Dark Green bg matching the image */
  border-radius: $radius-lg;
  padding: $space-6;
  color: white;
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.hsc-header {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-xs;
  font-weight: 700;
  letter-spacing: 0.05em;
  
  .material-symbols-outlined {
    font-size: 1.25rem;
  }
}

.hsc-title {
  margin: 0;
  font-size: $text-2xl;
  font-weight: 700;
}

.hsc-desc {
  margin: 0;
  font-size: $text-sm;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: $space-4;
}

.btn-download {
  background-color: white;
  color: #064e3b;
  border: none;
  border-radius: $radius-md;
  padding: $space-3 $space-4;
  font-size: $text-sm;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
}
</style>

<template>
  <div class="health-score-card" :class="scoreClass">
    <div class="hsc-header">
      <span class="material-symbols-outlined">{{ scoreIcon }}</span>
      <span class="hsc-subtitle">HEALTH SCORE ANALYSIS</span>
    </div>
    <h3 class="hsc-title">{{ scoreTitle }}</h3>
    <p class="hsc-desc">{{ scoreDescription }}</p>

    <!-- Detail Breakdown -->
    <div class="hsc-breakdown" v-if="totalCalories > 0">
      <div class="hsc-breakdown-item">
        <span class="hsc-breakdown-label">Protein</span>
        <span class="hsc-breakdown-value" :class="proteinStatusClass">{{ proteinPercent }}% <small>(ideal 15–20%)</small></span>
      </div>
      <div class="hsc-breakdown-item">
        <span class="hsc-breakdown-label">Karbohidrat</span>
        <span class="hsc-breakdown-value" :class="karboStatusClass">{{ karboPercent }}% <small>(ideal 45–60%)</small></span>
      </div>
      <div class="hsc-breakdown-item">
        <span class="hsc-breakdown-label">Lemak</span>
        <span class="hsc-breakdown-value" :class="lemakStatusClass">{{ lemakPercent }}% <small>(ideal 20–30%)</small></span>
      </div>
    </div>

    <!-- Peringatan Kalori di Luar Target -->
    <div class="hsc-calorie-warning" v-if="isCalorieOutOfRange">
      <span class="material-symbols-outlined hsc-calorie-warning__icon">error_outline</span>
      <span class="hsc-calorie-warning__text">
        Kalori di luar target: {{ totalCalories.toFixed(0) }} kkal (target: 2000–2700 kkal)
      </span>
    </div>

    <button class="btn-print" @click="printRecipe">
      <span class="material-symbols-outlined btn-print-icon">print</span>
      CETAK RINGKASAN RESEP
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits<{
  (e: 'print'): void
}>()

const props = defineProps<{
  proteinPercent: number
  karboPercent: number
  lemakPercent: number
  totalCalories: number
  recipeName: string
}>()

// ── Evaluasi Keseimbangan Gizi (Berdasarkan Anjuran Kemenkes) ──
// Karbohidrat: 45-60%, Protein: 15-20%, Lemak: 20-30%

type ScoreLevel = 'balanced' | 'high-protein' | 'high-fat' | 'high-carb' | 'empty'

const scoreLevel = computed<ScoreLevel>(() => {
  if (props.totalCalories <= 0) return 'empty'

  const p = props.proteinPercent
  const k = props.karboPercent
  const l = props.lemakPercent

  // Cek apakah semua dalam rentang ideal
  const proteinOk = p >= 15 && p <= 20
  const karboOk = k >= 45 && k <= 60
  const lemakOk = l >= 20 && l <= 30
  const calorieOk = props.totalCalories >= 2000 && props.totalCalories <= 2700

  if (proteinOk && karboOk && lemakOk && calorieOk) return 'balanced'
  if (l > 30) return 'high-fat'
  if (p > 20) return 'high-protein'
  if (k > 60) return 'high-carb'

  return 'balanced' // Mendekati ideal (makro)
})

/** True jika kalori total di luar rentang 2000-2700 kkal */
const isCalorieOutOfRange = computed(() => {
  if (props.totalCalories <= 0) return false
  return props.totalCalories < 2000 || props.totalCalories > 2700
})

const scoreTitle = computed(() => {
  switch (scoreLevel.value) {
    case 'balanced':     return 'Gizi Seimbang'
    case 'high-protein': return 'Tinggi Protein'
    case 'high-fat':     return 'Perlu Penyesuaian Lemak'
    case 'high-carb':    return 'Tinggi Karbohidrat'
    case 'empty':        return 'Menunggu Kalkulasi'
  }
})

const scoreDescription = computed(() => {
  switch (scoreLevel.value) {
    case 'balanced':
      return 'Resep ini memiliki komposisi makronutrisi yang seimbang sesuai anjuran Kemenkes. Cocok untuk program Makanan Bergizi Gratis (MBG).'
    case 'high-protein':
      return 'Resep ini kaya akan protein. Sangat baik untuk pertumbuhan anak, namun pertimbangkan menambah sumber karbohidrat kompleks untuk keseimbangan energi.'
    case 'high-fat':
      return 'Kontribusi lemak melebihi anjuran (>30%). Pertimbangkan untuk mengurangi bahan berlemak tinggi atau mengganti metode memasak dari goreng ke kukus/panggang.'
    case 'high-carb':
      return 'Kontribusi karbohidrat melebihi anjuran (>60%). Pertimbangkan menambah sumber protein seperti telur, tahu, atau tempe untuk keseimbangan nutrisi.'
    case 'empty':
      return 'Tambahkan bahan baku dan tekan tombol "Kalkulasi" untuk melihat analisis keseimbangan gizi resep ini.'
  }
})

const scoreIcon = computed(() => {
  switch (scoreLevel.value) {
    case 'balanced':     return 'verified'
    case 'high-protein': return 'fitness_center'
    case 'high-fat':     return 'warning'
    case 'high-carb':    return 'info'
    case 'empty':        return 'help_outline'
  }
})

const scoreClass = computed(() => `hsc--${scoreLevel.value}`)

// ── Status Warna per Makronutrisi ──
const proteinStatusClass = computed(() => {
  const p = props.proteinPercent
  if (p >= 15 && p <= 20) return 'status-ok'
  return p > 20 ? 'status-high' : 'status-low'
})

const karboStatusClass = computed(() => {
  const k = props.karboPercent
  if (k >= 45 && k <= 60) return 'status-ok'
  return k > 60 ? 'status-high' : 'status-low'
})

const lemakStatusClass = computed(() => {
  const l = props.lemakPercent
  if (l >= 20 && l <= 30) return 'status-ok'
  return l > 30 ? 'status-high' : 'status-low'
})

// ── Cetak Resep ──
function printRecipe() {
  emit('print')
}
</script>

<style scoped lang="scss">
.health-score-card {
  border-radius: $radius-lg;
  padding: $space-6;
  color: white;
  display: flex;
  flex-direction: column;
  gap: $space-3;
  transition: background-color 0.4s ease;
}

// ── Warna dinamis berdasarkan skor ──
.hsc--balanced     { background-color: #064e3b; }
.hsc--high-protein { background-color: #1e3a5f; }
.hsc--high-fat     { background-color: #78350f; }
.hsc--high-carb    { background-color: #3b0764; }
.hsc--empty        { background-color: #374151; }

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
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

// ── Breakdown per makronutrisi ──
.hsc-breakdown {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  margin-top: $space-2;
  padding: $space-3;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $radius-md;
}

.hsc-breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: $text-sm;
}

.hsc-breakdown-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.hsc-breakdown-value {
  font-weight: 700;

  small {
    font-weight: 400;
    opacity: 0.7;
    font-size: $text-xs;
  }
}

.status-ok   { color: #6ee7b7; }
.status-high { color: #fbbf24; }
.status-low  { color: #93c5fd; }

// ── Tombol Cetak ──
.btn-print {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  background-color: $color-bg-surface;
  color: #064e3b;
  border: none;
  border-radius: $radius-md;
  padding: $space-3 $space-4;
  font-size: $text-sm;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  margin-top: $space-2;

  .btn-print-icon {
    font-size: 1.15rem;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }
}

// ── Peringatan Kalori di Luar Target ──
.hsc-calorie-warning {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3;
  background: $color-warning-bg;
  border: 1px solid $color-warning-border;
  border-radius: $radius-md;
  margin-top: $space-2;

  &__icon {
    font-size: 1.25rem;
    color: $color-warning;
    flex-shrink: 0;
  }

  &__text {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-warning;
    line-height: 1.4;
  }
}

// ── Print Styles ──
@media print {
  .health-score-card {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .btn-print {
    display: none !important;
  }

  .hsc-calorie-warning {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>

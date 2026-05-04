<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import {
  Chart,
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

Chart.register(
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
)

const barCanvas = ref<HTMLCanvasElement | null>(null)
const lineCanvas = ref<HTMLCanvasElement | null>(null)
let barChart: Chart | null = null
let lineChart: Chart | null = null

function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function buildTooltipConfig() {
  return {
    backgroundColor: '#1f2937',
    titleFont: { family: 'Inter' },
    bodyFont: { family: 'Inter' },
    cornerRadius: 8,
    padding: 10,
  }
}

function buildScales(textMuted: string, borderColor: string, extraY?: Record<string, unknown>) {
  return {
    x: {
      grid: { display: false },
      ticks: { color: textMuted, font: { family: 'Inter', size: 12 } },
    },
    y: {
      grid: { color: borderColor },
      ticks: { color: textMuted, font: { family: 'Inter', size: 12 }, ...extraY },
      beginAtZero: true,
    },
  }
}

onMounted(() => {
  const primary = getCSSVar('--color-primary') || '#1a56db'
  const danger = getCSSVar('--color-danger') || '#ef4444'
  const textMuted = getCSSVar('--color-text-muted') || '#6b7280'
  const borderColor = getCSSVar('--color-border') || '#e5e7eb'
  const tooltip = buildTooltipConfig()

  // ── Bar Chart: Distribusi per Hari ──
  if (barCanvas.value) {
    barChart = new Chart(barCanvas.value, {
      type: 'bar',
      data: {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        datasets: [
          {
            label: 'Distribusi',
            data: [24, 18, 30, 22, 28, 15, 11],
            backgroundColor: primary,
            borderRadius: 6,
            barThickness: 28,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip },
        scales: buildScales(textMuted, borderColor),
      },
    })
  }

  // ── Line Chart: Keterlambatan Mingguan ──
  if (lineCanvas.value) {
    lineChart = new Chart(lineCanvas.value, {
      type: 'line',
      data: {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        datasets: [
          {
            label: 'Keterlambatan',
            data: [5, 8, 3, 7],
            borderColor: danger,
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: danger,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip },
        scales: buildScales(textMuted, borderColor, { stepSize: 2 }),
      },
    })
  }
})

onBeforeUnmount(() => {
  barChart?.destroy()
  lineChart?.destroy()
})
</script>

<template>
  <div class="laporan__charts">
    <BaseCard title="Distribusi per Hari" padding="md">
      <div class="chart-container">
        <canvas ref="barCanvas"></canvas>
      </div>
    </BaseCard>

    <BaseCard title="Keterlambatan Mingguan" padding="md">
      <div class="chart-container">
        <canvas ref="lineCanvas"></canvas>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.chart-container {
  position: relative;
  height: 260px;
  width: 100%;
}
</style>

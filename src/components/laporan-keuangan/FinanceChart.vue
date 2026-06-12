<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useFinanceStore } from '@/stores/finance.store'
import { formatRupiah, formatRupiahShort } from '@/utils/format'
import BaseCard from '@/components/common/BaseCard.vue'
import {
  Chart,
  DoughnutController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(
  DoughnutController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
)

const store = useFinanceStore()

const pieCanvas = ref<HTMLCanvasElement | null>(null)
const barCanvas = ref<HTMLCanvasElement | null>(null)
let pieChart: Chart | null = null
let barChart: Chart | null = null

function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function buildTooltipConfig() {
  return {
    backgroundColor: '#1f2937',
    titleFont: { family: 'Inter' },
    bodyFont: { family: 'Inter' },
    cornerRadius: 8,
    padding: 12,
    caretSize: 6,
    boxPadding: 6,
    usePointStyle: true,
  }
}

function renderCharts() {
  // Destroy previous instances
  pieChart?.destroy()
  barChart?.destroy()

  const textMuted = getCSSVar('--color-text-muted') || '#6b7280'
  const borderColor = getCSSVar('--color-border') || '#e5e7eb'
  const tooltip = buildTooltipConfig()

  // Data from store getters (reactive)
  const labels = store.chartLabels
  const data = store.chartData
  const colors = store.chartColors

  // ── Doughnut Chart: Distribusi Biaya per Kategori ──
  if (pieCanvas.value) {
    pieChart = new Chart(pieCanvas.value, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 4,
            hoverBorderColor: '#ffffff',
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textMuted,
              font: { family: 'Inter', size: 12 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
            },
          },
          tooltip: {
            ...tooltip,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${formatRupiah(ctx.parsed as number)}`,
            },
          },
        },
      },
    })
  }

  // ── Bar Chart: Anggaran vs Realisasi ──
  if (barCanvas.value) {
    barChart = new Chart(barCanvas.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Anggaran',
            data: [80_000_000, 70_000_000, 100_000_000],
            backgroundColor: colors[0],
            borderRadius: 6,
            barThickness: 28,
          },
          {
            label: 'Realisasi',
            data,
            backgroundColor: colors[1],
            borderRadius: 6,
            barThickness: 28,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textMuted,
              font: { family: 'Inter', size: 12 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
            },
          },
          tooltip: {
            ...tooltip,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${formatRupiah(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textMuted, font: { family: 'Inter', size: 12 } },
          },
          y: {
            grid: { color: borderColor },
            ticks: {
              color: textMuted,
              font: { family: 'Inter', size: 12 },
              callback: (value) => formatRupiahShort(Number(value)),
            },
            beginAtZero: true,
          },
        },
      },
    })
  }
}

onMounted(() => {
  // Wait for store data before first render
  if (store.reports.length > 0) {
    renderCharts()
  }
})

// Re-render charts when store data changes
watch(() => store.reports, () => {
  if (store.reports.length > 0) {
    renderCharts()
  }
})

onBeforeUnmount(() => {
  pieChart?.destroy()
  barChart?.destroy()
})
</script>

<template>
  <div class="laporan__charts">
    <BaseCard title="Distribusi Biaya per Kategori" padding="md">
      <div class="chart-container">
        <canvas ref="pieCanvas"></canvas>
      </div>
    </BaseCard>

    <BaseCard title="Anggaran vs Realisasi" padding="md">
      <div class="chart-container">
        <canvas ref="barCanvas"></canvas>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.chart-container {
  position: relative;
  height: 280px;
  width: 100%;
}
</style>


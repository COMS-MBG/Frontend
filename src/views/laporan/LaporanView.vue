<script setup lang="ts">
import { onMounted } from 'vue'
import { useLaporanStore } from '@/stores/laporan.store'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import ReportStatCard from '@/components/laporan/ReportStatCard.vue'
import ReportChart from '@/components/laporan/ReportChart.vue'
import ReportToolbar from '@/components/laporan/ReportToolbar.vue'
import ReportTable from '@/components/laporan/ReportTable.vue'
import ReportToolsCard from '@/components/laporan/ReportToolsCard.vue'

const store = useLaporanStore()

onMounted(() => {
  store.fetchReports()
  store.fetchStats()
})

// ── Tool handlers (will be wired to real API later) ──
function onImportCSV() { /* placeholder for API integration */ }
function onExportCSV() { /* placeholder for API integration */ }
function onGeneratePDF() { /* placeholder for API integration */ }
</script>

<template>
  <div class="laporan-page">
    <!-- ═══════════════════════════════════════
         1. HEADER
    ════════════════════════════════════════ -->
    <PageHeader
      title="Laporan Operasional"
      subtitle="Monitoring & evaluasi distribusi dan logistik"
      :breadcrumb="['Laporan', 'Operasional']"
    />

    <!-- ═══════════════════════════════════════
         2. STAT CARDS
    ════════════════════════════════════════ -->
    <ReportStatCard />

    <!-- ═══════════════════════════════════════
         3. ANALYTICS CHARTS
    ════════════════════════════════════════ -->
    <ReportChart />

    <!-- ═══════════════════════════════════════
         4. OPERATIONAL TABLE (MAIN CONTENT)
    ════════════════════════════════════════ -->
    <BaseCard title="Riwayat Operasional" padding="none">
      <template #actions>
        <ReportToolbar />
      </template>
      <ReportTable />
    </BaseCard>

    <!-- ═══════════════════════════════════════
         5. TOOLS & EXPORT (SECONDARY)
    ════════════════════════════════════════ -->
    <ReportToolsCard
      @import-csv="onImportCSV"
      @export-csv="onExportCSV"
      @generate-pdf="onGeneratePDF"
    />
  </div>
</template>
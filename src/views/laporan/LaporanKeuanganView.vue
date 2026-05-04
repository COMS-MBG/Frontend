<script setup lang="ts">
import { onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance.store'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import FinanceStatCard from '@/components/laporan-keuangan/FinanceStatCard.vue'
import FinanceChart from '@/components/laporan-keuangan/FinanceChart.vue'
import FinanceToolbar from '@/components/laporan-keuangan/FinanceToolbar.vue'
import FinanceTable from '@/components/laporan-keuangan/FinanceTable.vue'
import FinanceToolsCard from '@/components/laporan-keuangan/FinanceToolsCard.vue'

const store = useFinanceStore()

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
      title="Laporan Keuangan"
      subtitle="Monitoring anggaran dan realisasi biaya operasional"
      :breadcrumb="['Laporan', 'Keuangan']"
    />

    <!-- ═══════════════════════════════════════
         ERROR ALERT
    ════════════════════════════════════════ -->
    <BaseAlert
      v-if="store.error"
      type="danger"
      :message="store.error"
    />

    <!-- ═══════════════════════════════════════
         2. STAT CARDS
    ════════════════════════════════════════ -->
    <FinanceStatCard />

    <!-- ═══════════════════════════════════════
         3. ANALYTICS CHARTS
    ════════════════════════════════════════ -->
    <FinanceChart />

    <!-- ═══════════════════════════════════════
         4. TRANSACTION TABLE (MAIN CONTENT)
    ════════════════════════════════════════ -->
    <BaseCard title="Riwayat Transaksi" padding="none">
      <template #actions>
        <FinanceToolbar />
      </template>
      <FinanceTable />
    </BaseCard>

    <!-- ═══════════════════════════════════════
         5. TOOLS & EXPORT (SECONDARY)
    ════════════════════════════════════════ -->
    <FinanceToolsCard
      @import-csv="onImportCSV"
      @export-csv="onExportCSV"
      @generate-pdf="onGeneratePDF"
    />
  </div>
</template>


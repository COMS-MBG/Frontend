<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSuperAdminDashboard } from '@/composables/useSuperAdminDashboard'

import PageHeader from '@/components/common/PageHeader.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

// Import modernized components
import SaDashboardStats from '@/components/superadmin/dashboard/SaDashboardStats.vue'
import SaDashboardMapWidget from '@/components/superadmin/dashboard/SaDashboardMapWidget.vue'
import SaDashboardCapacityAlert from '@/components/superadmin/dashboard/SaDashboardCapacityAlert.vue'
import SaDashboardFinanceWidget from '@/components/superadmin/dashboard/SaDashboardFinanceWidget.vue'
import SaDashboardDraftsFeed from '@/components/superadmin/dashboard/SaDashboardDraftsFeed.vue'
import SaDashboardSkeleton from '@/components/superadmin/dashboard/SaDashboardSkeleton.vue'

const router = useRouter()
const {
  dashboardStats,
  isLoading,
  error,
  coverageData,
  draftOverview,
  sppgsList,
  draftsList,
  financialSummary,
  approveReport,
  rejectReport,
  loadAllDashboardData,
} = useSuperAdminDashboard()

const showError = ref(true)

const lastUpdated = ref('')

function updateTimestamp() {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  const formatter = new Intl.DateTimeFormat('id-ID', options)
  lastUpdated.value = `Terakhir diperbarui: Hari ini, ${formatter.format(now).replace('.', ':')} WIB`
}

onMounted(async () => {
  await loadAllDashboardData()
  updateTimestamp()
})

async function handleRefresh() {
  await loadAllDashboardData()
  updateTimestamp()
}

function navigateTo(routeName: string) {
  router.push({ name: routeName })
}
</script>

<template>
  <div class="sa-dashboard-page">
    <PageHeader
      title="Dashboard Super Admin"
      subtitle="Command center pengawasan, kapasitas operasional, dan realisasi anggaran SPPG nasional"
      :breadcrumb="['Super Admin', 'Dashboard']"
      class="mb-6"
    >
      <template #actions>
        <div class="dashboard-header-actions">
          <span v-if="lastUpdated" class="timestamp-text">{{ lastUpdated }}</span>
          <button 
            class="btn-refresh btn-secondary btn-with-icon" 
            :disabled="isLoading"
            @click="handleRefresh"
          >
            <span class="material-symbols-outlined" :class="{ 'is-spinning': isLoading }">sync</span>
            <span>Refresh Data</span>
          </button>
        </div>
      </template>
    </PageHeader>

    <BaseAlert
      v-if="error"
      :show="showError"
      variant="error"
      :message="error"
      class="mb-6"
      @update:show="showError = $event"
    />

    <!-- SKELETON LOADING STATE -->
    <SaDashboardSkeleton v-if="isLoading" />

    <!-- ACTUAL CONTENT STATE -->
    <div v-else class="sa-dashboard-grid">
      <!-- Row 1: KPI Summary Tiles -->
      <SaDashboardStats
        v-if="dashboardStats"
        :stats="dashboardStats"
        :coverage="coverageData"
        :drafts="draftOverview"
      />

      <!-- Row 2: Hero Section (GIS Map Widget 2/3 and Capacity Warning Widget 1/3) -->
      <div class="sa-dashboard-grid__row-main">
        <div class="grid-col-2-3">
          <SaDashboardMapWidget :sppgs="sppgsList" :drafts="draftsList" />
        </div>
        <div class="grid-col-1-3">
          <SaDashboardCapacityAlert :sppgs="sppgsList" :isLoading="isLoading" />
        </div>
      </div>

      <!-- Row 3: Actionable Insights (Quick Actions) -->
      <div class="sa-dashboard-grid__row-bottom" style="grid-template-columns: 1fr;">
        <div>
          <SaDashboardDraftsFeed :drafts="draftsList" @navigate="navigateTo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-header-actions {
  display: flex;
  align-items: center;
  gap: $space-4;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    gap: $space-2;
  }

  .timestamp-text {
    font-size: 11px;
    color: $color-text-muted;
    font-weight: 500;
    white-space: nowrap;
  }

  .btn-refresh {
    height: 2.25rem;
    font-size: $text-xs;
    font-weight: 700;
  }
}

.is-spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>

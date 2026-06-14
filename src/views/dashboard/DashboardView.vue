<template>
  <div class="dashboard">

    <!-- ═══════════════════════════════════════
         HEADER
    ════════════════════════════════════════ -->
    <DashboardHeader
      section-label="RINGKASAN OPERASIONAL"
      title="Dashboard MBG Kota Bandung"
    />

    <!-- SKELETON LOADING STATE -->
    <DashboardSkeleton v-if="isLoading" />

    <template v-else>
      <!-- ═══════════════════════════════════════
           SECTION 1 — PRIMARY OPERATIONS
      ════════════════════════════════════════ -->
      <section class="dashboard__section">
        <div class="stats-row">
          <StatCard
            label="PORSI HARI INI"
            icon="restaurant"
            :value="formattedPortions"
            subtitle="Porsi terdaftar untuk mitra"
            variant="horizontal"
            iconVariant="blue"
          />
          <StatCard
            label="ARMADA AKTIF"
            icon="local_shipping"
            :value="activeCouriersStr"
            subtitle="Unit dalam perjalanan"
            variant="horizontal"
            iconVariant="green"
          />
          <StatCard
            label="PENGIRIMAN SELESAI"
            icon="check_circle"
            :value="deliveredCountStr"
            :subtitle="deliveredStatsText"
            variant="horizontal"
            iconVariant="purple"
          />
          <StatCard
            label="SEKOLAH MITRA"
            icon="school"
            :value="totalSchools"
            subtitle="Sekolah mitra terdaftar"
            variant="horizontal"
            iconVariant="orange"
          />
        </div>
      </section>

      <!-- ═══════════════════════════════════════
           SECTION 2 — SUPPLY & LOGISTICS
      ════════════════════════════════════════ -->
      <section class="dashboard__section">
        <div class="main-grid">
          <SupplyStatusCard
            section-label="MANAJEMEN GIZI"
            title="Status Menu & Persediaan Bahan"
            :badge-text="dashboardData?.stock_alerts.length ? 'Perlu Perhatian' : 'Sesuai Standar Gizi'"
            menu-name="Nasi Ayam Sayur"
            menu-calorie="Standar Kalori: 450 – 550 kkal"
            :bahan-items="bahanItems"
            action-label="Lihat Detail Stok"
            @update-stok="onUpdateStok"
          />
          <LogisticsCard
            section-label="MONITORING ARMADA"
            title="Status Pengiriman"
            icon="local_shipping"
            :stats="deliveryStats"
            action-label="Manajemen Armada"
            @action="onManajemenArmada"
          />
        </div>
      </section>

      <!-- ═══════════════════════════════════════
           SECTION 3 — OPERATIONAL FEED & METRICS
      ════════════════════════════════════════ -->
      <section class="dashboard__section">
        <div class="bottom-grid">
          <PendingBastCard
            :schedules="pendingConfirmationSchedules"
            @verify="onVerifyBast"
            @view-all="onManajemenArmada"
          />

          <!-- ── Supporting Info Stack (secondary weight) ── -->
          <div class="info-stack">
            <MiniInfoCard
              icon="map"
              label="Total Jarak Distribusi"
              :value="totalDistanceStr"
              unit="Km"
              variant="success"
              badge-text="Jarak tempuh bulan ini"
            />
            <MiniInfoCard
              icon="local_shipping"
              label="Total Pengiriman Bulanan"
              :value="totalDeliveriesThisMonth"
              unit="Jadwal"
              variant="success"
              :badge-text="avgDurationText"
            />
          </div>
        </div>
      </section>
    </template>

  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminDashboard } from '@/composables/useAdminDashboard'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SupplyStatusCard, { type BahanItem } from '@/components/dashboard/SupplyStatusCard.vue'
import LogisticsCard, { type DeliveryStatItem } from '@/components/dashboard/LogisticsCard.vue'
import PendingBastCard from '@/components/dashboard/PendingBastCard.vue'
import MiniInfoCard from '@/components/dashboard/MiniInfoCard.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton.vue'

const router = useRouter()
const { dashboardData, isLoading, loadDashboardData } = useAdminDashboard()

onMounted(async () => {
  await loadDashboardData()
})

const formattedPortions = computed(() => {
  return dashboardData.value ? dashboardData.value.resources.total_portions.toLocaleString('id-ID') : '0'
})

const activeCouriersStr = computed(() => {
  if (!dashboardData.value) return '0 / 0'
  return `${dashboardData.value.active_couriers} / ${dashboardData.value.resources.total_couriers}`
})

const deliveredCountStr = computed(() => {
  if (!dashboardData.value) return '0'
  const s = dashboardData.value.schedules
  return String(s.delivered + s.confirmed + s.rejected)
})

const deliveredStatsText = computed(() => {
  if (!dashboardData.value) return 'Dari 0 total jadwal'
  const s = dashboardData.value.schedules
  const total = s.in_order + s.delivering + s.delivered + s.revision_required + s.confirmed + s.rejected
  return `Dari ${total} total jadwal`
})

const deliveryStats = computed<DeliveryStatItem[]>(() => {
  if (!dashboardData.value) {
    return [
      { value: 0, label: 'PENDING' },
      { value: 0, label: 'JALAN' },
      { value: 0, label: 'SELESAI' },
    ]
  }
  const s = dashboardData.value.schedules
  return [
    { value: s.in_order + s.revision_required, label: 'PENDING' },
    { value: s.delivering, label: 'JALAN' },
    { value: s.delivered + s.confirmed + s.rejected, label: 'SELESAI' },
  ]
})

const bahanItems = computed<BahanItem[]>(() => {
  if (!dashboardData.value?.stock_alerts || dashboardData.value.stock_alerts.length === 0) {
    return [
      { name: 'Semua Stok Aman', qty: 'Sempurna', percent: 100 }
    ]
  }
  return dashboardData.value.stock_alerts.slice(0, 3).map(item => {
    const percent = item.minimum_quantity > 0 
      ? Math.min(Math.round((item.total_quantity / item.minimum_quantity) * 100), 100)
      : 100
    let statusText = `${item.total_quantity.toLocaleString('id-ID')} ${item.unit}`
    if (item.status === 'empty') statusText = 'Habis!'
    else if (item.status === 'low') statusText = `Kritis (${item.total_quantity})`
    if (item.has_expired) statusText += ' (Kedaluwarsa)'
    
    return {
      name: item.ingredient_name,
      qty: statusText,
      percent: percent
    }
  })
})

const totalSchools = computed(() => {
  return dashboardData.value ? String(dashboardData.value.resources.total_schools) : '0'
})

const totalDistanceStr = computed(() => {
  if (!dashboardData.value) return '0'
  return dashboardData.value.history_this_month.total_distance_km.toLocaleString('id-ID')
})

const pendingConfirmationSchedules = computed(() => {
  return dashboardData.value?.pending_confirmation || []
})

const totalDeliveriesThisMonth = computed(() => {
  return dashboardData.value ? String(dashboardData.value.history_this_month.total_deliveries) : '0'
})

const avgDurationText = computed(() => {
  if (!dashboardData.value || !dashboardData.value.history_this_month.avg_duration_minutes) {
    return 'Rerata: - mnt'
  }
  return `Rerata: ${dashboardData.value.history_this_month.avg_duration_minutes} mnt`
})

// ── Handlers ────────────────────────────
function onUpdateStok()      { router.push({ name: 'stok-bahan' }) }
function onManajemenArmada() { router.push({ name: 'distribusi' }) }
function onDetailLokasi()    { router.push({ name: 'peta-spasial' }) }

function onVerifyBast(id: number) {
  router.push({ name: 'riwayat-pengiriman', query: { schedule_id: id } })
}
</script>

<style scoped lang="scss">
.dashboard__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-12 $space-6;
  background-color: $color-bg-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border-light;
  gap: $space-3;
  color: $color-text-secondary;
  font-weight: 500;

  .is-spinning {
    animation: spin 1s linear infinite;
    font-size: 2rem;
    color: $color-primary;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>

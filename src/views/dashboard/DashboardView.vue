<template>
  <div class="dashboard">

    <!-- ═══════════════════════════════════════
         HEADER
    ════════════════════════════════════════ -->
    <DashboardHeader
      section-label="RINGKASAN OPERASIONAL"
      title="Dashboard MBG Kota Bandung"
    />

    <!-- ═══════════════════════════════════════
         SECTION 1 — PRIMARY OPERATIONS
    ════════════════════════════════════════ -->
    <section class="dashboard__section">
      <div class="stats-row">
        <StatCard
          label="PORSI HARI INI"
          icon="restaurant"
          value="45.820"
          subtitle="Porsi siap didistribusikan"
          variant="horizontal"
          iconVariant="blue"
        />
        <StatCard
          label="ARMADA AKTIF"
          icon="local_shipping"
          value="86 / 90"
          subtitle="Unit dalam perjalanan"
          variant="horizontal"
          iconVariant="green"
        />
        <StatCard
          label="PENGIRIMAN SELESAI"
          icon="check_circle"
          value="40"
          subtitle="Dari 57 total jadwal"
          variant="horizontal"
          iconVariant="purple"
        />
        <StatCard
          label="COVERAGE WILAYAH"
          icon="map"
          value="87%"
          subtitle="Kecamatan terlayani"
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
          badge-text="Sesuai Standar Gizi"
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
         SECTION 3 — STRATEGIC INSIGHTS
    ════════════════════════════════════════ -->
    <section class="dashboard__section">
      <div class="bottom-grid">
        <InsightMapCard
          severity="CRITICAL"
          category="BLIND SPOT TERDETEKSI"
          title="Kecamatan Batununggal Belum Terlayani"
          description="1.200 siswa berada di luar radius efisien 5km dari dapur pusat terdekat. Biaya logistik meningkat 18% per pengiriman dibanding rata-rata wilayah."
          recommendation="Inisiasi SPPG Baru Wilayah Timur"
          action-label="Lihat Detail Lokasi"
          @detail="onDetailLokasi"
        />

        <!-- ── Supporting Info Stack (secondary weight) ── -->
        <div class="info-stack">
          <MiniInfoCard
            icon="school"
            label="Sekolah Terdaftar"
            value="156"
            unit="Institusi"
            variant="success"
            badge-text="Verifikasi Dokumen 100%"
          />
          <MiniInfoCard
            icon="assignment"
            label="Laporan Menunggu BAST"
            value="8"
            unit="Berkas"
            variant="warning"
            deadline-text="Deadline: 48 Jam Kedepan"
          />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SupplyStatusCard, { type BahanItem } from '@/components/dashboard/SupplyStatusCard.vue'
import LogisticsCard, { type DeliveryStatItem } from '@/components/dashboard/LogisticsCard.vue'
import InsightMapCard from '@/components/dashboard/InsightMapCard.vue'
import MiniInfoCard from '@/components/dashboard/MiniInfoCard.vue'

// ── Data ────────────────────────────────
const bahanItems: BahanItem[] = [
  { name: 'Beras Premium',  qty: '1.250 kg', percent: 83 },
  { name: 'Daging Ayam',    qty: '850 kg',   percent: 57 },
  { name: 'Sayuran Campur', qty: '450 kg',   percent: 30 },
]

const deliveryStats: DeliveryStatItem[] = [
  { value: 12, label: 'PENDING'  },
  { value:  5, label: 'JALAN'    },
  { value: 40, label: 'SELESAI'  },
]

// ── Handlers ────────────────────────────
function onUpdateStok()      { console.log('Detail Stok') }
function onManajemenArmada() { console.log('Manajemen Armada') }
function onDetailLokasi()    { console.log('Detail Lokasi') }
</script>

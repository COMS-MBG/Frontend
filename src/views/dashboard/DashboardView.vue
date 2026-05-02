<template>
  <div class="dashboard">

    <!-- ═══════════════════════════════════════
         HEADER
    ════════════════════════════════════════ -->
    <DashboardHeader
      section-label="RINGKASAN SISTEM"
      title="Dashboard Operasional Bandung"
    />

    <!-- ═══════════════════════════════════════
         ROW 1: Stat Cards
    ════════════════════════════════════════ -->
    <div class="stats-row">
      <StatCard
        label="PORSI HARI INI"
        icon="restaurant"
        value="45.820"
        subtitle="Porsi siap didistribusikan"
      />
      <StatCard
        label="ARMADA AKTIF"
        icon="local_shipping"
        value="86 / 90"
        subtitle="Unit dalam perjalanan"
      />
    </div>

    <!-- ═══════════════════════════════════════
         ROW 2: Supply  |  Logistics
    ════════════════════════════════════════ -->
    <div class="main-grid">
      <SupplyStatusCard
        section-label="MANAJEMEN GIZI"
        title="Status Menu & Persediaan Bahan"
        badge-text="Sesuai Standar Gizi"
        menu-name="Nasi Ayam Sayur"
        menu-calorie="Standar Kalori: 450 – 550 kkal"
        :bahan-items="bahanItems"
        action-label="Update Stok Bahan"
        @update-stok="onUpdateStok"
      />
      <LogisticsCard
        section-label="LOGISTIK"
        title="Status Pengiriman"
        icon="local_shipping"
        :stats="deliveryStats"
        action-label="Manajemen Armada →"
        @action="onManajemenArmada"
      />
    </div>

    <!-- ═══════════════════════════════════════
         ROW 3: Insight Map  |  Mini Info Cards
    ════════════════════════════════════════ -->
    <div class="bottom-grid">
      <InsightMapCard
        severity="CRITICAL"
        category="INSIGHT STRATEGIS"
        title="Blind Spot Detected: Kecamatan Batununggal"
        description="1,200 siswa berada di luar radius efisien 5km dari dapur pusat terdekat. Hal ini meningkatkan biaya logistik sebesar 18% per pengiriman."
        recommendation="Inisiasi SPPG Baru Wilayah Timur"
        action-label="Detail Lokasi"
        @detail="onDetailLokasi"
      />

      <div class="info-stack">
        <MiniInfoCard
          icon="school"
          label="Data Sekolah Terdaftar"
          value="156"
          unit="Institusi Pendidikan"
          variant="success"
          badge-text="Verifikasi Dokumen 100%"
        />
        <MiniInfoCard
          icon="assignment"
          label="Laporan Menunggu BAST"
          value="8"
          unit="Berkas Tersisa"
          variant="warning"
          deadline-text="Deadline Laporan: 48 Jam Kedepan"
        />
      </div>
    </div>

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
  { name: 'Beras Premium', qty: '1.250 kg', percent: 83 },
  { name: 'Daging Ayam',   qty: '850 kg',   percent: 57 },
  { name: 'Sayuran Campur',qty: '450 kg',   percent: 30 },
]

const deliveryStats: DeliveryStatItem[] = [
  { value: 12, label: 'PENDING'  },
  { value:  5, label: 'JALAN'    },
  { value: 40, label: 'SELESAI'  },
]

// ── Handlers (akan dihubungkan ke router/store nanti) ────
function onUpdateStok()      { console.log('Update Stok Bahan') }
function onManajemenArmada() { console.log('Manajemen Armada')  }
function onDetailLokasi()    { console.log('Detail Lokasi')     }
</script>


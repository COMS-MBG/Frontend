<template>
  <div class="master-resep">

    <!-- ═══════════════════════════════════════
         1. HEADER + ACTION BUTTONS
    ════════════════════════════════════════ -->
    <PageHeader
      title="Master Data Resep"
      subtitle="Daftar resep makanan bergizi."
      :breadcrumb="['Manajemen Gizi', 'Master Data Resep']"
    >
      <template #actions>
        <button
          class="btn-secondary btn-with-icon" 
          @click="onEkspor" aria-label="Ekspor PDF" 
          title="Ekspor PDF">
          <span class="material-symbols-outlined">picture_as_pdf</span>
          Ekspor PDF
        </button>
        <button
          class="btn-primary btn-with-icon"
          @click="onTambah"
          aria-label="Tambah Resep"
          title="Tambah Resep Baru">
          <span class="material-symbols-outlined">add</span>
          Tambah Resep Baru
        </button>
      </template>
    </PageHeader>

    <!-- ═══════════════════════════════════════
         2. SUMMARY STAT CARDS
    ════════════════════════════════════════ -->
    <div class="summary-row">
      <StatCard
        v-for="stat in summaryStats"
        :key="stat.label"
        :label="stat.label"
        :icon="stat.icon"
        :value="stat.value"
        variant="horizontal"
        :icon-variant="stat.iconVariant"
      />
    </div>

    <!-- ═══════════════════════════════════════
         3. DATA TABLE & PAGINATION
    ════════════════════════════════════════ -->
    <div v-if="paginatedItems.length === 0" class="empty-wrapper">
      Tidak ada data resep
    </div>  
    <ResepTable
      :items="paginatedItems"
      @edit="onEdit"
      @delete="onDelete"
    >
      <template #pagination>
        <BasePagination
          v-if="totalItems > perPage"
          v-model="currentPage"
          :total="totalItems"
          :per-page="perPage"
          item-label="resep"
        />
      </template>
    </ResepTable>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import ResepTable from '@/components/gizi/ResepTable.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import type { ResepItem } from '@/components/gizi/ResepTable.vue'

const router = useRouter()

// ── Summary Stats ───────────────────────────────────────────
const summaryStats = [
  { label: 'TOTAL RESEP',        value: '124',  icon: 'menu_book',     iconVariant: 'blue'   as const },
  { label: 'SESUAI STANDAR',     value: '98%',  icon: 'check_circle',  iconVariant: 'green'  as const },
  { label: 'PEMBARUAN TERBARU',  value: 'H-1',  icon: 'schedule',      iconVariant: 'orange' as const },
  { label: 'KATEGORI MENU',      value: '12',   icon: 'category',      iconVariant: 'purple' as const },
]

// ── Dummy Data ──────────────────────────────────────────────
const allResep = ref<ResepItem[]>([
  {
    id: 1,
    nama: 'Nasi Ayam Sayur',
    status: 'Lengkap',
    statusVariant: 'success',
    kalori: 450,
    protein: 32.5,
    karbohidrat: 55.0,
    lemak: 12.0,
    image: undefined,
  },
  {
    id: 2,
    nama: 'Semur Daging Labu',
    status: 'Sesuai Standar',
    statusVariant: 'success',
    kalori: 520,
    protein: 38.0,
    karbohidrat: 42.0,
    lemak: 18.5,
    image: '',
  },
  {
    id: 3,
    nama: 'Pecel Lele Sehat',
    status: 'Lengkap',
    statusVariant: 'success',
    kalori: 380,
    protein: 28.0,
    karbohidrat: 35.0,
    lemak: 15.0,
    image: '',
  },
  {
    id: 4,
    nama: 'Soto Ayam Bening',
    status: 'Lengkap',
    statusVariant: 'success',
    kalori: 310,
    protein: 22.0,
    karbohidrat: 40.0,
    lemak: 8.5,
    image: '',
  },
  {
    id: 5,
    nama: 'Gado-Gado Protein',
    status: 'Sesuai Standar',
    statusVariant: 'success',
    kalori: 420,
    protein: 18.5,
    karbohidrat: 48.0,
    lemak: 22.0,
    image: '',
  },
  // ── Data tambahan untuk demo pagination ──
  { id: 6,  nama: 'Rawon Daging Sapi',   status: 'Lengkap',        statusVariant: 'success', kalori: 490, protein: 35.0, karbohidrat: 38.0, lemak: 20.0, image: '' },
  { id: 7,  nama: 'Bubur Ayam Komplit',   status: 'Sesuai Standar', statusVariant: 'success', kalori: 320, protein: 18.0, karbohidrat: 52.0, lemak: 6.0,  image: '' },
  { id: 8,  nama: 'Nasi Gudeg Jogja',     status: 'Lengkap',        statusVariant: 'success', kalori: 540, protein: 22.0, karbohidrat: 65.0, lemak: 24.0, image: '' },
  { id: 9,  nama: 'Sop Buntut Premium',   status: 'Sesuai Standar', statusVariant: 'success', kalori: 460, protein: 40.0, karbohidrat: 30.0, lemak: 19.0, image: '' },
  { id: 10, nama: 'Capcay Sayuran Segar', status: 'Lengkap',        statusVariant: 'success', kalori: 250, protein: 12.0, karbohidrat: 32.0, lemak: 8.0,  image: '' },
  { id: 11, nama: 'Rendang Padang',       status: 'Lengkap',        statusVariant: 'success', kalori: 580, protein: 42.0, karbohidrat: 18.0, lemak: 35.0, image: '' },
  { id: 12, nama: 'Mie Goreng Sehat',     status: 'Sesuai Standar', statusVariant: 'success', kalori: 410, protein: 20.0, karbohidrat: 58.0, lemak: 14.0, image: '' },
]
)

// ── Pagination ──────────────────────────────────────────────
const currentPage = ref(1)
const perPage = 5
const totalItems = computed(() => allResep.value.length)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return allResep.value.slice(start, start + perPage)
})

watch(currentPage, (val) => {
  if (val < 1) currentPage.value = 1
})

// ── Handlers ────────────────────────────────────────────────
function onEkspor() {
  console.log('Ekspor PDF')
}

function onTambah() {
  router.push({ name: 'kalkulator-gizi' })
}

function onEdit(item: ResepItem) {
  router.push({ name: 'kalkulator-gizi', params: { id: item.id } })
}

function onDelete(item: ResepItem) {
  const index = allResep.value.findIndex(r => r.id === item.id)
  if (index !== -1) {
    allResep.value.splice(index, 1)
  }
}

</script>

<style scoped lang="scss">
.master-resep {
  display: flex;
  flex-direction: column;
  gap: $space-6;
  font-family: $font-body;
}

// ── Summary row ──
.summary-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-4;
}

// ── Button helpers ──
.btn-with-icon {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  white-space: nowrap;

  .material-symbols-outlined {
    font-size: 1.15rem;
  }
}

// ── Responsive ──
@include tablet {
  .summary-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include mobile {
  .summary-row {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

.empty-wrapper {
  text-align: center;
  padding: $space-6;
  color: $color-text-muted;
}
</style>
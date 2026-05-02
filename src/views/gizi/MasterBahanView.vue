<template>
  <div class="master-bahan">

    <!-- ═══════════════════════════════════════
         1. HEADER + ACTION BUTTONS
    ════════════════════════════════════════ -->
    <PageHeader
      title="Master Data Bahan Baku"
      subtitle="Daftar bahan baku dan kandungan nutrisi"
      :breadcrumb="['Manajemen Gizi', 'Master Data Bahan Baku']"
    >
      <template #actions>
        <button
          class="btn-secondary btn-with-icon"
          aria-label="Ekspor PDF"
          title="Ekspor PDF"
          @click="onEksporPdf"
        >
          <span class="material-symbols-outlined">picture_as_pdf</span>
          Ekspor PDF
        </button>
        <button
          class="btn-primary btn-with-icon"
          aria-label="Tambah Bahan"
          title="Tambah Bahan Baru"
          @click="onTambah"
        >
          <span class="material-symbols-outlined">add</span>
          Tambah Bahan
        </button>
      </template>
    </PageHeader>

    <!-- ═══════════════════════════════════════
         2. STAT CARD
    ════════════════════════════════════════ -->
    <div class="master-bahan__stat">
      <BahanStatCard :total="filteredItems.length" />
    </div>

    <!-- ═══════════════════════════════════════
         3. TOOLBAR (Search / Filter / Import / Export)
    ════════════════════════════════════════ -->
    <div class="master-bahan__toolbar">
      <BahanToolbar
        :search="search"
        :filter="filter"
        @update:search="onSearchUpdate"
        @update:filter="filter = $event"
        @import="onImport"
        @export="onExport"
      />
    </div>

    <!-- ═══════════════════════════════════════
         4. LOADING STATE
    ════════════════════════════════════════ -->
    <BahanSkeleton v-if="isLoading" :rows="6" />

    <!-- ═══════════════════════════════════════
         5. EMPTY STATE
    ════════════════════════════════════════ -->
    <BahanEmptyState
      v-else-if="filteredItems.length === 0"
      @add="onTambah"
    />

    <!-- ═══════════════════════════════════════
         6. DATA TABLE + PAGINATION
    ════════════════════════════════════════ -->
    <div v-else class="master-bahan__table">
      <BahanTable>
        <BahanRow
          v-for="item in paginatedItems"
          :key="item.id"
          :item="item"
          @edit="onEdit"
          @delete="onDelete"
        />

        <template #pagination>
          <BasePagination
            v-if="filteredItems.length > perPage"
            v-model="page"
            :total="filteredItems.length"
            :per-page="perPage"
            item-label="bahan"
          />
        </template>
      </BahanTable>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BahanStatCard from '@/components/gizi/BahanStatCard.vue'
import BahanToolbar from '@/components/gizi/BahanToolbar.vue'
import BahanTable from '@/components/gizi/BahanTable.vue'
import BahanRow from '@/components/gizi/BahanRow.vue'
import BahanEmptyState from '@/components/gizi/BahanEmptyState.vue'
import BahanSkeleton from '@/components/gizi/BahanSkeleton.vue'
import type { BahanItem } from '@/types/gizi'

// ── UI State ────────────────────────────────────────────────
const search = ref('')
const filter = ref('all')
const page = ref(1)
const perPage = ref(10)
const isLoading = ref(false)

// ── Dummy Data ──────────────────────────────────────────────
const items = ref<BahanItem[]>([
  { id: 1,  nama: 'Daging Ayam',       kategori: 'protein', satuan: 'kg',    stok: 25,  kalori: 239,  protein: 27.3, karbohidrat: 0.0,  lemak: 13.6, image: '' },
  { id: 2,  nama: 'Daging Sapi',       kategori: 'protein', satuan: 'kg',    stok: 12,  kalori: 250,  protein: 26.0, karbohidrat: 0.0,  lemak: 15.0, image: '' },
  { id: 3,  nama: 'Beras Putih',       kategori: 'karbo',   satuan: 'kg',    stok: 50,  kalori: 365,  protein: 7.1,  karbohidrat: 80.0, lemak: 0.6,  image: '' },
  { id: 4,  nama: 'Minyak Goreng',     kategori: 'lemak',   satuan: 'liter', stok: 3,   kalori: 884,  protein: 0.0,  karbohidrat: 0.0,  lemak: 100.0, image: '' },
  { id: 5,  nama: 'Bayam Segar',       kategori: 'serat',   satuan: 'kg',    stok: 8,   kalori: 23,   protein: 2.9,  karbohidrat: 3.6,  lemak: 0.4,  image: '' },
  { id: 6,  nama: 'Wortel',            kategori: 'serat',   satuan: 'kg',    stok: 15,  kalori: 41,   protein: 0.9,  karbohidrat: 9.6,  lemak: 0.2,  image: '' },
  { id: 7,  nama: 'Tahu Putih',        kategori: 'protein', satuan: 'pcs',   stok: 0,   kalori: 76,   protein: 8.1,  karbohidrat: 1.9,  lemak: 4.8,  image: '' },
  { id: 8,  nama: 'Tempe',             kategori: 'protein', satuan: 'pcs',   stok: 5,   kalori: 192,  protein: 18.5, karbohidrat: 7.6,  lemak: 10.8, image: '' },
  { id: 9,  nama: 'Kentang',           kategori: 'karbo',   satuan: 'kg',    stok: 20,  kalori: 77,   protein: 2.0,  karbohidrat: 17.0, lemak: 0.1,  image: '' },
  { id: 10, nama: 'Santan Kelapa',     kategori: 'lemak',   satuan: 'liter', stok: 2,   kalori: 230,  protein: 2.3,  karbohidrat: 5.5,  lemak: 24.0, image: '' },
  { id: 11, nama: 'Telur Ayam',        kategori: 'protein', satuan: 'pcs',   stok: 100, kalori: 155,  protein: 13.0, karbohidrat: 1.1,  lemak: 11.0, image: '' },
  { id: 12, nama: 'Gula Pasir',        kategori: 'lainnya', satuan: 'kg',    stok: 10,  kalori: 387,  protein: 0.0,  karbohidrat: 100.0, lemak: 0.0, image: '' },
  { id: 13, nama: 'Garam',             kategori: 'lainnya', satuan: 'kg',    stok: 4,   kalori: 0,    protein: 0.0,  karbohidrat: 0.0,  lemak: 0.0,  image: '' },
  { id: 14, nama: 'Ikan Tuna',         kategori: 'protein', satuan: 'kg',    stok: 1,   kalori: 132,  protein: 28.0, karbohidrat: 0.0,  lemak: 1.3,  image: '' },
])

// ── Computed: Filter + Search ───────────────────────────────
const filteredItems = computed(() => {
  let result = items.value

  // Filter by kategori
  if (filter.value !== 'all') {
    result = result.filter(b => b.kategori === filter.value)
  }

  // Search by nama
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter(b => b.nama.toLowerCase().includes(q))
  }

  return result
})

// Reset page when filter/search changes
watch([search, filter], () => {
  page.value = 1
})

// ── Computed: Pagination ────────────────────────────────────
const paginatedItems = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredItems.value.slice(start, start + perPage.value)
})

// ── Handlers (stubs for API integration) ────────────────────
function onSearchUpdate(val: string | number | null) {
  search.value = String(val ?? '')
}

function onEksporPdf() {
  // TODO: integrate with PDF export API
}

function onTambah() {
  // TODO: open add modal or navigate
}

function onImport() {
  // TODO: open CSV import flow
}

function onExport() {
  // TODO: trigger CSV export
}

function onEdit(item: BahanItem) {
  // TODO: open edit modal with item data
}

function onDelete(item: BahanItem) {
  const index = items.value.findIndex(b => b.id === item.id)
  if (index !== -1) {
    items.value.splice(index, 1)
  }
}
</script>

<style scoped lang="scss">
// Page layout covered by _master-bahan.scss (global)
// Scoped overrides only

.btn-with-icon {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  white-space: nowrap;

  .material-symbols-outlined {
    font-size: 1.15rem;
  }
}
</style>
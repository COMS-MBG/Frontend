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
      <StatCard
        label="TOTAL KATALOG"
        icon="inventory_2"
        :value="`${filteredItems.length} Bahan`"
        variant="horizontal"
        icon-variant="blue"
      />
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
    <BaseTableSkeleton
      v-if="bahanStore.isLoading"
      :rows="6"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <!-- ═══════════════════════════════════════
         5. EMPTY STATE
    ════════════════════════════════════════ -->
    <BaseEmptyState
      v-else-if="filteredItems.length === 0"
      icon="inventory_2"
      title="Belum ada data bahan"
      description="Mulai tambahkan bahan baku untuk membangun katalog nutrisi Anda."
      action-label="Tambah Bahan"
      @action="onTambah"
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
import { ref, computed, watch, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import BahanToolbar from '@/components/gizi/master-bahan/BahanToolbar.vue'
import BahanTable from '@/components/gizi/master-bahan/BahanTable.vue'
import BahanRow from '@/components/gizi/master-bahan/BahanRow.vue'
import { useBahanStore } from '@/stores/bahan.store'
import { bahanDummy } from '@/data/bahan.dummy'
import { usePagination } from '@/composables/usePagination'
import type { BahanItem } from '@/types/gizi'

// ── Store ────────────────────────────────────────────────────
const bahanStore = useBahanStore()

// ── Skeleton Config ──────────────────────────────────────────
const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NAMA BAHAN', align: 'left' },
  { label: 'SATUAN', align: 'center' },
  { label: 'STOK', align: 'center' },
  { label: 'KALORI/100G', align: 'center' },
  { label: 'PROTEIN/100G', align: 'center' },
  { label: 'KARBO/100G', align: 'center' },
  { label: 'LEMAK/100G', align: 'center' },
  { label: 'AKSI', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'badge' },
  { type: 'text', width: '56px' },
  { type: 'text', width: '64px' },
  { type: 'text', width: '64px' },
  { type: 'text', width: '64px' },
  { type: 'text', width: '64px' },
  { type: 'actions' },
]

// ── Seed store on mount ──────────────────────────────────────
// TODO: swap to `bahanStore.fetchItems()` when API is ready.
onMounted(() => {
  if (bahanStore.items.length === 0) {
    bahanStore.setItems(bahanDummy)
  }
})

// ── UI State (view-local only) ───────────────────────────────
const search = ref('')
const filter  = ref('all')

// ── Derived: Filter + Search (read from store) ───────────────
const filteredItems = computed(() => {
  let result = bahanStore.items

  if (filter.value !== 'all') {
    result = result.filter(b => b.kategori === filter.value)
  }

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

// ── Pagination (extracted composable) ────────────────────────
const { page, perPage, paginatedItems } = usePagination(filteredItems, 10)

// ── Handlers ────────────────────────────────────────────────
function onSearchUpdate(val: string | number | null): void {
  search.value = String(val ?? '')
}

function onEksporPdf(): void {
  // TODO: integrate with PDF export service
}

function onTambah(): void {
  // TODO: open add modal (call bahanStore.addItem on submit)
}

function onImport(): void {
  // TODO: open CSV import flow, then bahanStore.setItems(parsed)
}

function onExport(): void {
  // TODO: trigger CSV export
}

function onEdit(item: BahanItem): void {
  // TODO: open edit modal, then bahanStore.updateItem(updated)
  void item
}

function onDelete(item: BahanItem): void {
  bahanStore.deleteItem(item.id)
}
</script>

<style scoped lang="scss">
// Page layout covered by _master-bahan.scss (global)
// Scoped overrides only
</style>
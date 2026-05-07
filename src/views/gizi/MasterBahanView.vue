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
         3. TOOLBAR (Search / Show Per Page / Add)
    ════════════════════════════════════════ -->
    <div class="master-bahan__toolbar">
      <BahanToolbar @add="onTambah" />
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
      v-else-if="bahanStore.filteredItems.length === 0"
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
            v-if="bahanStore.filteredItems.length > 0"
            v-model="page"
            :total="bahanStore.filteredItems.length"
            :per-page="bahanStore.rowsPerPage"
            item-label="bahan"
          />
        </template>
      </BahanTable>
    </div>

    <!-- Modals -->
    <BahanFormModal />
    <BahanDeleteModal />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, toRef } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import BahanToolbar from '@/components/gizi/master-bahan/BahanToolbar.vue'
import BahanTable from '@/components/gizi/master-bahan/BahanTable.vue'
import BahanRow from '@/components/gizi/master-bahan/BahanRow.vue'
import BahanFormModal from '@/components/master-bahan/BahanFormModal.vue'
import BahanDeleteModal from '@/components/master-bahan/BahanDeleteModal.vue'
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
  { label: 'KALORI/100G', align: 'center' },
  { label: 'PROTEIN/100G', align: 'center' },
  { label: 'KARBO/100G', align: 'center' },
  { label: 'LEMAK/100G', align: 'center' },
  { label: 'STATUS', align: 'center' },
  { label: 'AKSI', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'badge' },
  { type: 'text', width: '64px' },
  { type: 'text', width: '64px' },
  { type: 'text', width: '64px' },
  { type: 'text', width: '64px' },
  { type: 'badge' },
  { type: 'actions' },
]

// ── Seed store on mount ──────────────────────────────────────
// TODO: swap to `bahanStore.fetchItems()` when API is ready.
onMounted(() => {
  if (bahanStore.items.length === 0) {
    bahanStore.setItems(bahanDummy)
  }
})

// ── Summary Stats ───────────────────────────────────────────
const summaryStats = computed(() => {
  const items = bahanStore.items
  const count = items.length || 1
  const avgKalori = Math.round(items.reduce((s, i) => s + i.kalori, 0) / count)
  const avgProtein = (items.reduce((s, i) => s + i.protein, 0) / count).toFixed(1)
  const aktifCount = items.filter(i => i.status === 'aktif').length

  return [
    { label: 'TOTAL BAHAN',       value: items.length.toString(),             icon: 'inventory_2',           iconVariant: 'blue' as const },
    { label: 'RATA-RATA KALORI',  value: `${avgKalori} kcal`,                 icon: 'local_fire_department', iconVariant: 'orange' as const },
    { label: 'RATA-RATA PROTEIN', value: `${avgProtein} g`,                   icon: 'fitness_center',        iconVariant: 'purple' as const },
    { label: 'BAHAN AKTIF',       value: `${aktifCount} / ${items.length}`,   icon: 'check_circle',          iconVariant: 'green' as const },
  ]
})

// ── Pagination (extracted composable) ────────────────────────
const { page, paginatedItems } = usePagination(
  computed(() => bahanStore.filteredItems),
  toRef(bahanStore, 'rowsPerPage')
)

function onEksporPdf(): void {
  // TODO: integrate with PDF export service
}

function onTambah(): void {
  bahanStore.openCreateModal()
}

function onEdit(item: BahanItem): void {
  bahanStore.openEditModal(item)
}

function onDelete(item: BahanItem): void {
  bahanStore.openDeleteModal(item)
}
</script>

<style scoped lang="scss">
.master-bahan {
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
</style>
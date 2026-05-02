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
    <ResepTable
      :items="paginatedItems"
      @edit="onEdit"
      @delete="onDelete"
    >
      <template #pagination>
        <BasePagination
          v-if="totalItems > perPage"
          v-model="page"
          :total="totalItems"
          :per-page="perPage"
          item-label="resep"
        />
      </template>
    </ResepTable>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import ResepTable from '@/components/gizi/ResepTable.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import { useResepStore } from '@/stores/resep.store'
import { resepDummy } from '@/data/resep.dummy'
import { usePagination } from '@/composables/usePagination'
import type { ResepItem } from '@/types/resep'

const router = useRouter()

// ── Store ────────────────────────────────────────────────────
const resepStore = useResepStore()

// ── Seed store on mount ──────────────────────────────────────
// TODO: swap to `resepStore.fetchItems()` when API is ready.
onMounted(() => {
  if (resepStore.items.length === 0) {
    resepStore.setItems(resepDummy)
  }
})

// ── Summary Stats ───────────────────────────────────────────
const summaryStats = [
  { label: 'TOTAL RESEP',        value: '124',  icon: 'menu_book',     iconVariant: 'blue'   as const },
  { label: 'SESUAI STANDAR',     value: '98%',  icon: 'check_circle',  iconVariant: 'green'  as const },
  { label: 'PEMBARUAN TERBARU',  value: 'H-1',  icon: 'schedule',      iconVariant: 'orange' as const },
  { label: 'KATEGORI MENU',      value: '12',   icon: 'category',      iconVariant: 'purple' as const },
]

// ── Pagination (extracted composable) ────────────────────────
const { page, perPage, totalItems, paginatedItems } = usePagination(
  computed(() => resepStore.items),
  5
)

// ── Handlers ────────────────────────────────────────────────
function onEkspor(): void {
  // TODO: integrate with PDF export service
}

function onTambah(): void {
  router.push({ name: 'kalkulator-gizi' })
}

function onEdit(item: ResepItem): void {
  router.push({ name: 'kalkulator-gizi', params: { id: item.id } })
}

function onDelete(item: ResepItem): void {
  resepStore.deleteItem(item.id)
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
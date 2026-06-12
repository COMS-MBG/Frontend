<template>
  <div class="master-resep">

    <!-- ═══════════════════════════════════════
         1. HEADER
    ════════════════════════════════════════ -->
    <PageHeader
      title="Master Data Resep"
      subtitle="Daftar resep makanan dan kandungan nutrisi"
      :breadcrumb="['Manajemen Gizi', 'Master Data Resep']"
    />

    <!-- ═══════════════════════════════════════
         2. SUMMARY STAT CARDS
    ════════════════════════════════════════ -->
    <div class="summary-row">
      <StatCard label="TOTAL RESEP" icon="menu_book" :value="formatNum(pagination.total)" variant="horizontal" icon-variant="blue" />
      <StatCard label="RATA-RATA KALORI" icon="local_fire_department" :value="`${formatNum(avgCalorie)} kcal`" variant="horizontal" icon-variant="orange" />
      <StatCard label="RATA-RATA PROTEIN" icon="fitness_center" :value="`${formatDec(Number(avgProtein))} g`" variant="horizontal" icon-variant="purple" />
    </div>

    <!-- ═══════════════════════════════════════
         3. TOOLBAR
    ════════════════════════════════════════ -->
    <ResepToolbar
      :search-value="filters.search"
      :per-page-value="pagination.perPage"
      :can-create="canCreate"
      @update:search-value="onSearchChange"
      @update:per-page-value="onPerPageChange"
      @add="onTambah"
    />

    <!-- ═══════════════════════════════════════
         4. LOADING STATE
    ════════════════════════════════════════ -->
    <BaseTableSkeleton
      v-if="isLoading"
      :rows="6"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <!-- ═══════════════════════════════════════
         5. EMPTY STATE
    ════════════════════════════════════════ -->
    <BaseEmptyState
      v-else-if="recipes.length === 0"
      icon="menu_book"
      title="Belum ada data resep"
      description="Mulai tambahkan resep melalui Kalkulator Gizi untuk membangun katalog resep Anda."
      action-label="Tambah Resep"
      @action="onTambah"
    />

    <!-- ═══════════════════════════════════════
         6. DATA TABLE + PAGINATION
    ════════════════════════════════════════ -->
    <div v-else class="master-resep__table">
      <ResepTable>
        <ResepRow
          v-for="item in recipes"
          :key="item.id"
          :item="item"
          :can-edit="canUpdate"
          :can-delete="canDelete"
          @edit="onEdit"
          @delete="onDeleteRequest"
          @view-detail="openDetailModal"
        />

        <template #pagination>
          <BasePagination
            v-if="pagination.total > pagination.perPage"
            :model-value="pagination.currentPage"
            :total="pagination.total"
            :per-page="pagination.perPage"
            item-label="resep"
            @update:model-value="onPageChange"
          />
        </template>
      </ResepTable>
    </div>

    <!-- ═══════════════════════════════════════
         7. DELETE CONFIRMATION
    ════════════════════════════════════════ -->
    <ConfirmDeleteModal
      v-model="isDeleteOpen"
      title="Hapus Resep"
      :item-name="deleteTarget?.name ?? ''"
      confirm-label="Hapus"
      :is-submitting="isSubmitting"
      @confirm="onDeleteConfirm"
      @cancel="closeDeleteModal"
    />

    <!-- ═══════════════════════════════════════
         8. RESULT MODAL
    ════════════════════════════════════════ -->
    <ResultModal
      v-model="isResultOpen"
      :headline="resultHeadline"
      :message="resultMessage"
      :variant="resultVariant"
    />

    <!-- ═══════════════════════════════════════
         9. DETAIL MODAL
    ════════════════════════════════════════ -->
    <ResepDetailModal
      :is-open="isDetailOpen"
      :recipe="detailTarget"
      @update:is-open="isDetailOpen = $event"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import ResepToolbar from '@/components/gizi/master-resep/ResepToolbar.vue'
import ResepTable from '@/components/gizi/master-resep/ResepTable.vue'
import ResepRow from '@/components/gizi/master-resep/ResepRow.vue'
import ResepDetailModal from '@/components/gizi/master-resep/ResepDetailModal.vue'
import { useRecipe } from '@/composables/useRecipe'
import { useToast } from '@/composables/useToast'
import type { Recipe } from '@/types/recipe'
import { formatNum, formatDec } from '@/utils/format'

const router = useRouter()

// ── Composable ──────────────────────────────────────────────
const {
  recipes, selectedRecipe, pagination, isLoading, isSubmitting, error, filters,
  avgCalorie, avgProtein,
  canCreate, canUpdate, canDelete,
  fetchRecipes, fetchRecipeDetail, deleteRecipe, setFilter, resetState,
} = useRecipe()

const toast = useToast()

// ── Skeleton Config ──────────────────────────────────────────
const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NAMA RESEP', align: 'left' },
  { label: 'BERAT TOTAL', align: 'center' },
  { label: 'KALORI', align: 'center' },
  { label: 'PROTEIN', align: 'center' },
  { label: 'KARBO', align: 'center' },
  { label: 'LEMAK', align: 'center' },
  { label: 'AKSI', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'text', width: '64px', align: 'center' },
  { type: 'text', width: '64px', align: 'center' },
  { type: 'text', width: '64px', align: 'center' },
  { type: 'text', width: '64px', align: 'center' },
  { type: 'text', width: '64px', align: 'center' },
  { type: 'actions' },
]

// ── Toolbar ──────────────────────────────────────────────────
function onSearchChange(val: string) { setFilter('search', val) }
function onPageChange(page: number) { setFilter('page', page) }
function onPerPageChange(val: number) { setFilter('per_page', val) }

// ── Result Modal ─────────────────────────────────────────────
const isResultOpen = ref(false)
const resultHeadline = ref('')
const resultMessage = ref('')
const resultVariant = ref<'success' | 'error'>('success')

function showResult(headline: string, message: string, variant: 'success' | 'error' = 'success') {
  resultHeadline.value = headline
  resultMessage.value = message
  resultVariant.value = variant
  isResultOpen.value = true
}

// ── Navigation (Create/Edit via Kalkulator Gizi) ─────────────
function onTambah() {
  router.push({ name: 'kalkulator-gizi' })
}

function onEdit(item: Recipe) {
  router.push({ name: 'kalkulator-gizi', params: { id: item.id } })
}

// ── Delete Modal ─────────────────────────────────────────────
const isDeleteOpen = ref(false)
const deleteTarget = ref<Recipe | null>(null)

function onDeleteRequest(item: Recipe) { deleteTarget.value = item; isDeleteOpen.value = true }
function closeDeleteModal() { isDeleteOpen.value = false; deleteTarget.value = null }

async function onDeleteConfirm() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  const success = await deleteRecipe(deleteTarget.value.id)
  if (success) {
    closeDeleteModal()
    showResult('Resep Berhasil Dihapus', `Resep "${name}" telah dihapus dari sistem.`)
  } else if (error.value) {
    toast.error(error.value)
  }
}

// ── Detail Modal ─────────────────────────────────────────────
const isDetailOpen = ref(false)
const detailTarget = ref<Recipe | null>(null)

async function openDetailModal(item: Recipe) {
  detailTarget.value = item
  isDetailOpen.value = true

  // Ambil detail lengkap melalui composable (bukan direct API import)
  const full = await fetchRecipeDetail(item.id)
  if (full) {
    detailTarget.value = full
  }
}

function closeDetailModal() {
  isDetailOpen.value = false
  detailTarget.value = null
}

// ── Lifecycle ────────────────────────────────────────────────
onMounted(() => fetchRecipes())
onUnmounted(() => resetState())
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
  grid-template-columns: repeat(3, 1fr);
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
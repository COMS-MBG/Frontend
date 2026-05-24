<template>
  <div class="master-bahan">

    <!-- ═══════════════════════════════════════
         1. HEADER + ACTION BUTTONS
    ════════════════════════════════════════ -->
    <PageHeader
      title="Master Data Bahan Baku"
      subtitle="Daftar bahan baku dan kandungan nutrisi"
      :breadcrumb="['Manajemen Gizi', 'Master Data Bahan Baku']"
    />

    <!-- ═══════════════════════════════════════
         2. SUMMARY STAT CARDS
    ════════════════════════════════════════ -->
    <div class="summary-row">
      <StatCard label="TOTAL BAHAN" icon="inventory_2" :value="formatNum(pagination.total)" variant="horizontal" icon-variant="blue" />
      <StatCard label="RATA-RATA KALORI" icon="local_fire_department" :value="`${formatNum(avgCalorie)} kcal`" variant="horizontal" icon-variant="orange" />
      <StatCard label="RATA-RATA PROTEIN" icon="fitness_center" :value="`${formatDec(Number(avgProtein))} g`" variant="horizontal" icon-variant="purple" />
    </div>

    <!-- ═══════════════════════════════════════
         3. TOOLBAR
    ════════════════════════════════════════ -->
    <BahanToolbar
      :search-value="filters.search"
      :can-create="canCreate"
      @update:search-value="onSearchChange"
      @add="openCreateModal"
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
      v-else-if="ingredients.length === 0"
      icon="inventory_2"
      title="Belum ada data bahan"
      description="Mulai tambahkan bahan baku untuk membangun katalog nutrisi Anda."
      action-label="Tambah Bahan"
      @action="openCreateModal"
    />

    <!-- ═══════════════════════════════════════
         6. DATA TABLE + PAGINATION
    ════════════════════════════════════════ -->
    <div v-else class="master-bahan__table">
      <BahanTable>
        <BahanRow
          v-for="item in ingredients"
          :key="item.id"
          :item="item"
          :can-edit="canUpdate"
          :can-delete="canDelete"
          @edit="openEditModal"
          @delete="onDeleteRequest"
          @view-detail="openDetailModal"
        />

        <template #pagination>
          <BasePagination
            v-if="pagination.total > pagination.perPage"
            :model-value="pagination.currentPage"
            :total="pagination.total"
            :per-page="pagination.perPage"
            item-label="bahan"
            @update:model-value="onPageChange"
          />
        </template>
      </BahanTable>
    </div>

    <!-- ═══════════════════════════════════════
         7. FORM MODAL (Create/Edit)
    ════════════════════════════════════════ -->
    <BahanFormModal
      :is-open="isFormOpen"
      :initial-data="editTarget"
      :is-submitting="isSubmitting"
      @submit="onFormSubmit"
      @close="closeFormModal"
    />

    <!-- ═══════════════════════════════════════
         8. DELETE CONFIRMATION (Danger-styled)
    ════════════════════════════════════════ -->
    <ConfirmDeleteModal
      v-model="isDeleteOpen"
      title="Hapus Bahan Baku"
      :item-name="deleteTarget?.name ?? ''"
      confirm-label="Hapus"
      :is-submitting="isSubmitting"
      @confirm="onDeleteConfirm"
      @cancel="closeDeleteModal"
    />

    <!-- ═══════════════════════════════════════
         9. RESULT MODAL (Success/Error Feedback)
    ════════════════════════════════════════ -->
    <ResultModal
      v-model="isResultOpen"
      :headline="resultHeadline"
      :message="resultMessage"
      :variant="resultVariant"
    />

    <!-- ═══════════════════════════════════════
         10. DETAIL MODAL
    ════════════════════════════════════════ -->
    <BahanDetailModal
      :is-open="isDetailOpen"
      :ingredient="detailTarget"
      @update:is-open="isDetailOpen = $event"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import BahanToolbar from '@/components/gizi/master-bahan/BahanToolbar.vue'
import BahanTable from '@/components/gizi/master-bahan/BahanTable.vue'
import BahanRow from '@/components/gizi/master-bahan/BahanRow.vue'
import BahanDetailModal from '@/components/gizi/master-bahan/BahanDetailModal.vue'
import BahanFormModal from '@/components/master-bahan/BahanFormModal.vue'
import { useIngredient } from '@/composables/useIngredient'
import { useToast } from '@/composables/useToast'
import type { Ingredient, IngredientForm } from '@/types/ingredient'
import { formatNum, formatDec } from '@/utils/format'

// ── Composable ──────────────────────────────────────────────
const {
  ingredients, pagination, isLoading, isSubmitting, error, filters,
  avgCalorie, avgProtein,
  canCreate, canUpdate, canDelete,
  fetchIngredients, fetchIngredientDetail, createIngredient, updateIngredient, deleteIngredient,
  setFilter, resetState,
} = useIngredient()

const toast = useToast()

// ── Skeleton Config ──────────────────────────────────────────
const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NAMA BAHAN', align: 'left' },
  { label: 'BERAT ACUAN', align: 'center' },
  { label: 'KALORI', align: 'center' },
  { label: 'PROTEIN', align: 'center' },
  { label: 'KARBO', align: 'center' },
  { label: 'LEMAK', align: 'center' },
  { label: 'AKSI', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'text', width: '56px', align: 'center' },
  { type: 'text', width: '64px', align: 'center' },
  { type: 'text', width: '64px', align: 'center' },
  { type: 'text', width: '64px', align: 'center' },
  { type: 'text', width: '64px', align: 'center' },
  { type: 'actions' },
]

// ── Toolbar ──────────────────────────────────────────────────
function onSearchChange(val: string) { setFilter('search', val) }
function onPageChange(page: number) { setFilter('page', page) }

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

// ── Form Modal ───────────────────────────────────────────────
const isFormOpen = ref(false)
const editTarget = ref<Ingredient | null>(null)

function openCreateModal() { editTarget.value = null; isFormOpen.value = true }
function openEditModal(item: Ingredient) { editTarget.value = item; isFormOpen.value = true }
function closeFormModal() { isFormOpen.value = false; editTarget.value = null }

async function onFormSubmit(data: IngredientForm) {
  let success = false
  if (editTarget.value) {
    success = await updateIngredient(editTarget.value.id, data)
    if (success) {
      closeFormModal()
      showResult('Bahan Berhasil Diperbarui', `Data bahan baku "${data.name}" telah diperbarui.`)
    }
  } else {
    success = await createIngredient(data)
    if (success) {
      closeFormModal()
      showResult('Bahan Berhasil Ditambahkan', `Bahan baku "${data.name}" telah ditambahkan ke sistem.`)
    }
  }
  if (!success && error.value) toast.error(error.value)
}

// ── Delete Modal ─────────────────────────────────────────────
const isDeleteOpen = ref(false)
const deleteTarget = ref<Ingredient | null>(null)

function onDeleteRequest(item: Ingredient) { deleteTarget.value = item; isDeleteOpen.value = true }
function closeDeleteModal() { isDeleteOpen.value = false; deleteTarget.value = null }

async function onDeleteConfirm() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  const success = await deleteIngredient(deleteTarget.value.id)
  if (success) {
    closeDeleteModal()
    showResult('Bahan Berhasil Dihapus', `Bahan baku "${name}" telah dihapus dari sistem.`)
  } else if (error.value) {
    toast.error(error.value)
  }
}

// ── Lifecycle ────────────────────────────────────────────────
onMounted(() => fetchIngredients())
onUnmounted(() => resetState())

// ── Detail Modal ─────────────────────────────────────────────
const isDetailOpen = ref(false)
const detailTarget = ref<Ingredient | null>(null)

async function openDetailModal(item: Ingredient) {
  detailTarget.value = item
  isDetailOpen.value = true

  // Ambil detail lengkap melalui composable (bukan direct API import)
  const full = await fetchIngredientDetail(item.id)
  if (full) {
    detailTarget.value = full
  }
}

function closeDetailModal() {
  isDetailOpen.value = false
  detailTarget.value = null
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
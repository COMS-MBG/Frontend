<template>
  <div class="partner-management">

    <!-- 1. HEADER -->
    <PageHeader
      title="Sekolah Mitra"
      subtitle="Kelola data sekolah mitra program MBG, import data, dan pantau distribusi porsi."
      :breadcrumb="['Partner', 'Manajemen Sekolah Mitra']"
    />

    <!-- 2. SUMMARY STAT CARDS -->
    <div class="summary-row">
      <StatCard label="TOTAL SEKOLAH"  icon="domain"                :value="String(summary.total_schools)" variant="horizontal" icon-variant="blue"   />
      <StatCard label="SEKOLAH NEGERI" icon="account_balance"       :value="String(summary.total_public)"  variant="horizontal" icon-variant="green"  />
      <StatCard label="SEKOLAH SWASTA" icon="apartment"             :value="String(summary.total_private)" variant="horizontal" icon-variant="purple" />
      <StatCard label="SMA"            icon="school"                :value="String(summary.total_sma)"     variant="horizontal" icon-variant="blue"   />
      <StatCard label="SMK"            icon="precision_manufacturing" :value="String(summary.total_smk)"   variant="horizontal" icon-variant="orange" />
      <StatCard label="TOTAL PORSI"    icon="restaurant"            :value="String(summary.total_portion_count)" variant="horizontal" icon-variant="green"  />
    </div>

    <!-- 3. TOOLBAR -->
    <PartnerToolbar @add="onAdd" @import="isImportOpen = true" />

    <!-- 4. LOADING STATE -->
    <BaseTableSkeleton
      v-if="isLoading"
      :rows="6"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <!-- 5. FETCH ERROR STATE -->
    <div v-else-if="error" class="error-state">
      <span class="material-symbols-outlined">error</span>
      <p>{{ error }}</p>
      <button class="btn-primary btn-sm" @click="partnerStore.fetchItems()">Coba Lagi</button>
    </div>

    <!-- 6. EMPTY STATE -->
    <BaseEmptyState
      v-else-if="items.length === 0"
      icon="school"
      title="Belum ada data sekolah mitra"
      description="Mulai tambahkan sekolah mitra atau import data dari file CSV."
    />

    <!-- 7. DATA TABLE + PAGINATION -->
    <PartnerTable
      v-else
      :items="items"
      @view="onView"
      @edit="onEdit"
      @delete="onDeleteRequest"
      @add="onAdd"
    >
      <template #pagination>
        <BasePagination
          v-if="meta.last_page > 1"
          v-model="currentPage"
          :total="meta.total"
          :per-page="meta.per_page"
          item-label="sekolah"
        />
      </template>
    </PartnerTable>

    <!-- 8. DETAIL MODAL -->
    <PartnerDetailModal
      :is-open="isDetailOpen"
      :partner="selectedPartner"
      @update:is-open="isDetailOpen = $event"
      @close="isDetailOpen = false"
      @edit="onEditFromDetail"
    />

    <!-- 9. FORM MODAL (Create/Edit) -->
    <PartnerFormModal
      ref="formModalRef"
      :is-open="isFormOpen"
      :initial-data="editTarget"
      :is-submitting="isSubmitting"
      @update:is-open="isFormOpen = $event"
      @submit="onSubmit"
    />

    <!-- 10. DELETE CONFIRMATION MODAL -->
    <PartnerDeleteModal
      :is-open="isDeleteOpen"
      :partner="deleteTarget"
      :is-submitting="isDeleting"
      @update:is-open="isDeleteOpen = $event"
      @confirm="onDeleteConfirm"
    />

    <!-- 11. SUCCESS MODAL (create / edit) -->
    <PartnerSuccessModal
      :is-open="isSuccessOpen"
      :mode="successMode"
      :partner-name="successName"
      @update:is-open="isSuccessOpen = $event"
    />

    <!-- 12. IMPORT MODAL -->
    <ImportPartnerModal
      :is-open="isImportOpen"
      @update:is-open="isImportOpen = $event"
      @imported="onImported"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import type { AxiosError } from 'axios'

// ── Common Components ──
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'

// ── Partner Components ──
import PartnerToolbar from '@/components/partner/PartnerToolbar.vue'
import PartnerTable from '@/components/partner/PartnerTable.vue'
import PartnerDetailModal from '@/components/partner/PartnerDetailModal.vue'
import PartnerFormModal from '@/components/partner/PartnerFormModal.vue'
import PartnerDeleteModal from '@/components/partner/PartnerDeleteModal.vue'
import PartnerSuccessModal from '@/components/partner/PartnerSuccessModal.vue'
import ImportPartnerModal from '@/components/partner/ImportPartnerModal.vue'

// ── Store & Composables ──
import { usePartnerStore } from '@/stores/partner.store'
import { useToast } from '@/composables/useToast'
import type { Partner } from '@/types/partner'

// ── Store ──
const partnerStore = usePartnerStore()
const {
  items, isLoading, error, meta, summary,
  searchQuery, selectedBentuk, selectedStatus, rowsPerPage,
} = storeToRefs(partnerStore)

const toast = useToast()

// ── Skeleton Config ──
const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NAMA SEKOLAH', align: 'left' },
  { label: 'BENTUK', align: 'center' },
  { label: 'STATUS', align: 'center' },
  { label: 'KECAMATAN', align: 'left' },
  { label: 'KABUPATEN/KOTA', align: 'left' },
  { label: 'JUMLAH PORSI', align: 'right' },
  { label: 'AKSI', align: 'center' },
]
const skeletonColumns: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'badge' },
  { type: 'badge' },
  { type: 'text', width: '100px' },
  { type: 'text', width: '120px' },
  { type: 'text', width: '60px', align: 'right' },
  { type: 'actions' },
]

// ── Fetch on mount ──
onMounted(() => {
  partnerStore.fetchItems()
  partnerStore.fetchSummary()
})

// ── UI State ──
const formModalRef    = ref<InstanceType<typeof PartnerFormModal> | null>(null)
const isFormOpen      = ref(false)
const isDetailOpen    = ref(false)
const isImportOpen    = ref(false)
const isDeleteOpen    = ref(false)
const isSuccessOpen   = ref(false)
const successMode     = ref<'create' | 'edit' | 'delete'>('create')
const successName     = ref<string | null>(null)
const isSubmitting    = ref(false)
const isDeleting      = ref(false)
const editTarget      = ref<Partner | null>(null)
const selectedPartner = ref<Partner | null>(null)
const deleteTarget    = ref<Partner | null>(null)

// ── Server-side Pagination ──
const currentPage = computed({
  get: () => meta.value.current_page,
  set: (page: number) => partnerStore.fetchItems(page),
})

// ── Re-fetch on filter change ──
watch([searchQuery, selectedBentuk, selectedStatus, rowsPerPage], () => {
  partnerStore.fetchItems(1)
})

// ── Event Handlers ──
function onAdd(): void {
  editTarget.value = null
  isFormOpen.value = true
}

function onView(item: Partner): void {
  selectedPartner.value = item
  isDetailOpen.value = true
}

function onEdit(item: Partner): void {
  editTarget.value = item
  isFormOpen.value = true
}

function onEditFromDetail(item: Partner | null): void {
  isDetailOpen.value = false
  if (item) {
    editTarget.value = item
    isFormOpen.value = true
  }
}

/** Step 1: Open delete confirmation modal */
function onDeleteRequest(item: Partner): void {
  deleteTarget.value = item
  isDeleteOpen.value = true
}

/** Step 2: User confirmed → execute delete */
async function onDeleteConfirm(): Promise<void> {
  if (!deleteTarget.value || isDeleting.value) return
  isDeleting.value = true

  const schoolName = deleteTarget.value.school_name
  try {
    await partnerStore.deleteItem(deleteTarget.value.id)
    isDeleteOpen.value = false
    deleteTarget.value = null
    
    // Show success modal
    successMode.value = 'delete'
    successName.value = schoolName
    isSuccessOpen.value = true
  } catch {
    toast.error('Gagal menghapus data. Silakan coba lagi.')
  } finally {
    isDeleting.value = false
  }
}

/** Handle create/edit form submission */
async function onSubmit(data: Partial<Partner>): Promise<void> {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    if (data.id) {
      await partnerStore.updateItem(data.id, data)
      successMode.value = 'edit'
    } else {
      await partnerStore.createItem(data as Omit<Partner, 'id' | 'created_at' | 'updated_at'>)
      successMode.value = 'create'
    }
    successName.value = data.school_name ?? null
    isFormOpen.value  = false
    editTarget.value  = null
    isSuccessOpen.value = true   // ← open success modal
  } catch (err) {
    // Push server validation errors back into the form modal
    formModalRef.value?.applyServerErrors(err)
  } finally {
    isSubmitting.value = false
  }
}

/** Refresh after CSV import */
async function onImported(): Promise<void> {
  await partnerStore.refreshAfterImport()
  toast.success('Import data sekolah mitra berhasil.')
}
</script>

<style scoped lang="scss">
.partner-management {
  display: flex;
  flex-direction: column;
  gap: $space-6;
  font-family: $font-body;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $space-4;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-3;
  padding: $space-10;
  color: $color-text-muted;
  text-align: center;

  .material-symbols-outlined {
    font-size: 3rem;
    color: $color-danger;
  }

  p { margin: 0; font-size: $text-base; }
}

@include tablet {
  .summary-row { grid-template-columns: repeat(2, 1fr); }
}

@include mobile {
  .summary-row { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
}
</style>

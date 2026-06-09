<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useSuperAdminSchool } from '@/composables/useSuperAdminSchool'
import { useToast } from '@/composables/useToast'
import type { SchoolItem } from '@/types/superadmin-school'
import type { SchoolForm } from '@/components/superadmin/school/SaSchoolFormModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import SaSchoolStats from '@/components/superadmin/school/SaSchoolStats.vue'
import SaSchoolToolbar from '@/components/superadmin/school/SaSchoolToolbar.vue'
import SaSchoolTable from '@/components/superadmin/school/SaSchoolTable.vue'
import SaSchoolRow from '@/components/superadmin/school/SaSchoolRow.vue'
import SaSchoolFormModal from '@/components/superadmin/school/SaSchoolFormModal.vue'

const {
  schools, isLoading, isSubmitting, error, meta,
  searchQuery, statusFilter, totalItems, isEmpty,
  mappedCount, unmappedCount,
  fetchSchools, createSchool, updateSchool, deleteSchool, importSchools,
  setSearchQuery, setStatusFilter, setPerPage,
} = useSuperAdminSchool()

const toast = useToast()

// ── Modal state ───────────────────────────────────────────────────
const showFormModal    = ref(false)
const showDeleteModal  = ref(false)
const showImportResult = ref(false)
const editingItem      = ref<SchoolItem | null>(null)
const deletingItem     = ref<{ id: string; name: string } | null>(null)
const importResult     = ref({ success: false, imported_count: 0, errors: [] as { row: number; message: string }[] })

// ── Form ──────────────────────────────────────────────────────────
const emptyForm: SchoolForm = { school_name: '', npsn: '', school_type: '', ownership_status: '', address: '', district: '', city: '', province: '', latitude: '', longitude: '', portion_count: '' }
const form = ref<SchoolForm>({ ...emptyForm })

function resetForm() { form.value = { ...emptyForm }; editingItem.value = null }

// ── CRUD ──────────────────────────────────────────────────────────
function openCreateModal() { resetForm(); showFormModal.value = true }

function onEdit(item: SchoolItem) {
  editingItem.value = item
  form.value = {
    school_name: item.school_name, npsn: item.npsn ?? '', school_type: item.school_type,
    ownership_status: item.ownership_status, address: item.address, district: item.district,
    city: item.city, province: item.province, latitude: String(item.latitude),
    longitude: String(item.longitude), portion_count: String(item.portion_count),
  }
  showFormModal.value = true
}

async function handleSubmitForm() {
  try {
    const payload = { ...form.value, latitude: Number(form.value.latitude), longitude: Number(form.value.longitude), portion_count: Number(form.value.portion_count) }
    if (editingItem.value) {
      await updateSchool(editingItem.value.id, payload)
      toast.success('Sekolah berhasil diperbarui')
    } else {
      await createSchool(payload)
      toast.success('Sekolah berhasil ditambahkan')
    }
    showFormModal.value = false; resetForm()
  } catch { toast.error('Gagal menyimpan data sekolah') }
}

function onDelete(item: SchoolItem) {
  deletingItem.value = { id: item.id, name: item.school_name }
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!deletingItem.value) return
  try {
    await deleteSchool(deletingItem.value.id)
    toast.success('Sekolah berhasil dihapus')
    showDeleteModal.value = false; deletingItem.value = null
  } catch { toast.error('Gagal menghapus sekolah') }
}

// ── Import ────────────────────────────────────────────────────────
async function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'; input.accept = '.csv,.xlsx'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    const result = await importSchools(file)
    importResult.value = result; showImportResult.value = true
    if (result.success) toast.success(`${result.imported_count} sekolah berhasil diimport`)
  }
  input.click()
}

function onPerPageChange(val: number) {
  setPerPage(val)
  fetchSchools(1)
}

watch([searchQuery, statusFilter], () => fetchSchools(1))
onMounted(() => fetchSchools())

// ── Skeleton Config ──────────────────────────────────────────
const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NO', align: 'center' },
  { label: 'NAMA SEKOLAH', align: 'left' },
  { label: 'NPSN', align: 'left' },
  { label: 'JENIS', align: 'left' },
  { label: 'KOTA', align: 'left' },
  { label: 'PORSI', align: 'center' },
  { label: 'DIPETAKAN', align: 'center' },
  { label: 'AKSI', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'text', width: '32px', align: 'center' },
  { type: 'avatar-text' },
  { type: 'text', width: '70px', align: 'left' },
  { type: 'text', width: '50px', align: 'left' },
  { type: 'text', width: '80px', align: 'left' },
  { type: 'text', width: '48px', align: 'center' },
  { type: 'badge', align: 'center' },
  { type: 'actions' },
]
</script>

<template>
  <div class="sa-school-page">
    <PageHeader
      title="Manajemen Sekolah"
      subtitle="Kelola data sekolah mitra seluruh SPPG"
      :breadcrumb="['Super Admin', 'Manajemen Sekolah']"
      class="mb-6"
    />

    <SaSchoolStats :total-items="totalItems" :mapped-count="mappedCount" :unmapped-count="unmappedCount" />

    <SaSchoolToolbar
      :search-value="searchQuery"
      :filter-value="statusFilter"
      :per-page-value="meta.per_page"
      @update:search-value="setSearchQuery"
      @update:filter-value="setStatusFilter"
      @update:perPageValue="onPerPageChange"
      @import="handleImport"
      @add="openCreateModal"
    />

    <BaseTableSkeleton
      v-if="isLoading"
      :rows="6"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <BaseEmptyState
      v-else-if="isEmpty"
      icon="school"
      title="Belum ada data sekolah"
      description="Tambahkan sekolah baru atau import dari file."
    />

    <SaSchoolTable v-else>
      <SaSchoolRow
        v-for="(item, idx) in schools"
        :key="item.id"
        :item="item"
        :row-number="(meta.current_page - 1) * meta.per_page + idx + 1"
        @edit="onEdit"
        @delete="onDelete"
      />

      <template #pagination>
        <BasePagination
          v-if="meta.total > meta.per_page"
          :model-value="meta.current_page"
          :total="meta.total"
          :per-page="meta.per_page"
          @update:model-value="fetchSchools"
        />
      </template>
    </SaSchoolTable>

    <SaSchoolFormModal
      v-model="showFormModal"
      :form="form"
      :is-editing="!!editingItem"
      :is-submitting="isSubmitting"
      @update:form="form = $event"
      @submit="handleSubmitForm"
    />

    <ConfirmDeleteModal
      v-model="showDeleteModal"
      :item-name="deletingItem?.name ?? ''"
      :is-submitting="isSubmitting"
      @confirm="handleDelete"
    />

    <ResultModal
      v-model="showImportResult"
      :headline="importResult.success ? 'Import Berhasil' : 'Import Gagal'"
      :message="importResult.success ? `${importResult.imported_count} data sekolah berhasil diimport.` : 'Terjadi kesalahan saat import.'"
      :variant="importResult.success ? 'success' : 'error'"
    />
  </div>
</template>

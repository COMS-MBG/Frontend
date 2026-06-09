<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useSuperAdminSppg } from '@/composables/useSuperAdminSppg'
import { useToast } from '@/composables/useToast'
import type { SppgItem } from '@/types/superadmin-sppg'
import PageHeader from '@/components/common/PageHeader.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import ConfirmActionModal from '@/components/common/ConfirmActionModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import SaSppgToolbar from '@/components/superadmin/sppg/SaSppgToolbar.vue'
import SaSppgTable from '@/components/superadmin/sppg/SaSppgTable.vue'
import SaSppgRow from '@/components/superadmin/sppg/SaSppgRow.vue'
import SaSppgFormModal from '@/components/superadmin/sppg/SaSppgFormModal.vue'

const {
  sppgList, isLoading, isSubmitting, error, meta,
  searchQuery, statusFilter, rowsPerPage,
  fetchSppgs, createSppg, updateSppg, deleteSppg,
  activateSppg, deactivateSppg,
  setSearchQuery, setStatusFilter, setRowsPerPage,
} = useSuperAdminSppg()

const toast = useToast()

// ── Modal state ───────────────────────────────────────────────────
const showFormModal   = ref(false)
const showDeleteModal = ref(false)
const showActionModal = ref(false)
const showSuccessModal = ref(false)

const successModalTitle = ref('')
const successModalHeadline = ref('')
const successModalMessage = ref('')
const successModalVariant = ref<'success' | 'warning' | 'info'>('success')

const editingItem     = ref<SppgItem | null>(null)
const deletingItem    = ref<{ id: number; name: string } | null>(null)
const actionItem      = ref<{ id: number; name: string; action: 'activate' | 'deactivate' } | null>(null)

// ── Form ──────────────────────────────────────────────────────────
const form = ref({ name: '', address: '', city: '', province: '', latitude: '', longitude: '', capacity: '' })

function resetForm() {
  form.value = { name: '', address: '', city: '', province: '', latitude: '', longitude: '', capacity: '' }
  editingItem.value = null
}

// ── CRUD ──────────────────────────────────────────────────────────
function openCreateModal() { resetForm(); showFormModal.value = true }

function onEdit(item: SppgItem) {
  editingItem.value = item
  form.value = {
    name: item.name,
    address: item.address,
    city: item.region?.city || item.city || '',
    province: item.region?.province || item.province || '',
    latitude: String(item.latitude),
    longitude: String(item.longitude),
    capacity: String(item.capacity),
  }
  showFormModal.value = true
}

async function handleSubmitForm() {
  try {
    const payload = { ...form.value, latitude: Number(form.value.latitude), longitude: Number(form.value.longitude), capacity: Number(form.value.capacity) }
    const sppgName = payload.name
    const isEdit = !!editingItem.value

    if (isEdit) {
      await updateSppg(editingItem.value!.id, payload)
    } else {
      await createSppg(payload)
    }
    showFormModal.value = false
    resetForm()

    // Wait for the modal close transition (300ms) to complete
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (isEdit) {
      successModalTitle.value = 'Berhasil Edit'
      successModalHeadline.value = 'SPPG Berhasil Diperbarui'
      successModalMessage.value = `Data Satuan Pelaksana Pemberian Gizi "${sppgName}" telah berhasil diperbarui di sistem.`
      successModalVariant.value = 'success'
    } else {
      successModalTitle.value = 'Berhasil Tambah'
      successModalHeadline.value = 'SPPG Berhasil Ditambahkan'
      successModalMessage.value = `Satuan Pelaksana Pemberian Gizi "${sppgName}" baru telah berhasil ditambahkan ke sistem.`
      successModalVariant.value = 'success'
    }
    showSuccessModal.value = true
  } catch {
    toast.error('Gagal menyimpan data SPPG')
  }
}

function onDelete(item: SppgItem) { deletingItem.value = { id: item.id, name: item.name }; showDeleteModal.value = true }

async function handleDelete() {
  if (!deletingItem.value) return
  const itemName = deletingItem.value.name
  try {
    await deleteSppg(deletingItem.value.id)
    showDeleteModal.value = false
    
    // Wait for the modal close transition (300ms) to complete
    await new Promise((resolve) => setTimeout(resolve, 300))

    successModalTitle.value = 'Berhasil Hapus'
    successModalHeadline.value = 'SPPG Berhasil Dihapus'
    successModalMessage.value = `Satuan Pelaksana Pemberian Gizi "${itemName}" telah berhasil dihapus secara permanen dari sistem.`
    successModalVariant.value = 'success'
    showSuccessModal.value = true

    deletingItem.value = null
  } catch { toast.error('Gagal menghapus SPPG') }
}

function onActivate(item: SppgItem) { actionItem.value = { id: item.id, name: item.name, action: 'activate' }; showActionModal.value = true }
function onDeactivate(item: SppgItem) { actionItem.value = { id: item.id, name: item.name, action: 'deactivate' }; showActionModal.value = true }

async function handleAction() {
  if (!actionItem.value) return
  const itemName = actionItem.value.name
  const action = actionItem.value.action
  try {
    if (action === 'activate') {
      await activateSppg(actionItem.value.id)
      successModalTitle.value = 'Berhasil Aktifkan'
      successModalHeadline.value = 'SPPG Berhasil Diaktifkan'
      successModalMessage.value = `Satuan Pelaksana Pemberian Gizi "${itemName}" sekarang berstatus Aktif dan dapat melayani sekolah mitra.`
      successModalVariant.value = 'success'
    } else {
      await deactivateSppg(actionItem.value.id)
      successModalTitle.value = 'Berhasil Nonaktifkan'
      successModalHeadline.value = 'SPPG Berhasil Dinonaktifkan'
      successModalMessage.value = `Satuan Pelaksana Pemberian Gizi "${itemName}" sekarang berstatus Nonaktif.`
      successModalVariant.value = 'warning'
    }
    showActionModal.value = false

    // Wait for the modal close transition (300ms) to complete
    await new Promise((resolve) => setTimeout(resolve, 300))

    showSuccessModal.value = true
    actionItem.value = null
  } catch { toast.error('Gagal memproses tindakan') }
}

watch([searchQuery, statusFilter], () => fetchSppgs(1))
onMounted(() => fetchSppgs())

function onPerPageChange(val: number) {
  setRowsPerPage(val)
  fetchSppgs(1)
}

// ── Skeleton Config ──────────────────────────────────────────
const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NO', align: 'center' },
  { label: 'NAMA SPPG', align: 'left' },
  { label: 'KOTA', align: 'left' },
  { label: 'KAPASITAS', align: 'center' },
  { label: 'STATUS', align: 'center' },
  { label: 'TANGGAL DIBUAT', align: 'left' },
  { label: 'AKSI', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'text', width: '32px', align: 'center' },
  { type: 'avatar-text' },
  { type: 'text', width: '80px', align: 'left' },
  { type: 'text', width: '64px', align: 'center' },
  { type: 'badge', align: 'center' },
  { type: 'text', width: '90px', align: 'left' },
  { type: 'actions' },
]
</script>

<template>
  <div class="sa-sppg-page">
    <PageHeader
      title="Manajemen SPPG"
      subtitle="Kelola seluruh data Satuan Pelaksana Pemberian Gizi"
      :breadcrumb="['Super Admin', 'Manajemen SPPG']"
      class="mb-6"
    />

    <SaSppgToolbar
      :search-value="searchQuery"
      :filter-value="statusFilter"
      :per-page-value="rowsPerPage"
      @update:search-value="setSearchQuery"
      @update:filter-value="setStatusFilter"
      @update:perPageValue="onPerPageChange"
      @add="openCreateModal"
    />

    <BaseTableSkeleton
      v-if="isLoading"
      :rows="6"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <BaseEmptyState
      v-else-if="sppgList.length === 0"
      icon="domain"
      title="Belum ada data SPPG"
      description="Tambahkan SPPG baru untuk memulai."
    />

    <SaSppgTable v-else>
      <SaSppgRow
        v-for="(item, idx) in sppgList"
        :key="item.id"
        :item="item"
        :row-number="(meta.current_page - 1) * meta.per_page + idx + 1"
        @edit="onEdit"
        @delete="onDelete"
        @activate="onActivate"
        @deactivate="onDeactivate"
      />

      <template #pagination>
        <BasePagination
          v-if="meta.total > meta.per_page"
          :model-value="meta.current_page"
          :total="meta.total"
          :per-page="meta.per_page"
          @update:model-value="fetchSppgs"
        />
      </template>
    </SaSppgTable>

    <SaSppgFormModal
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

    <ConfirmActionModal
      v-model="showActionModal"
      :title="actionItem?.action === 'activate' ? 'Aktifkan SPPG' : 'Nonaktifkan SPPG'"
      :message="`Apakah Anda yakin ingin ${actionItem?.action === 'activate' ? 'mengaktifkan' : 'menonaktifkan'} <strong>${actionItem?.name ?? ''}</strong>?`"
      :confirm-label="actionItem?.action === 'activate' ? 'Aktifkan' : 'Nonaktifkan'"
      :variant="actionItem?.action === 'activate' ? 'success' : 'warning'"
      :is-submitting="isSubmitting"
      @confirm="handleAction"
    />

    <!-- Success Result Modal -->
    <ResultModal
      v-model="showSuccessModal"
      :title="successModalTitle"
      :headline="successModalHeadline"
      :message="successModalMessage"
      :variant="successModalVariant"
    />
  </div>
</template>

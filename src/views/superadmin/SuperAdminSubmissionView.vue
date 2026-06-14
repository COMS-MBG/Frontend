<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useSuperAdminSubmission } from '@/composables/useSuperAdminSubmission'
import { useToast } from '@/composables/useToast'
import { usePagination } from '@/composables/usePagination'
import type { SppgDraft } from '@/types/superadmin-submission'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import ConfirmActionModal from '@/components/common/ConfirmActionModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import SaSubmissionStats from '@/components/superadmin/submission/SaSubmissionStats.vue'
import SaSubmissionToolbar from '@/components/superadmin/submission/SaSubmissionToolbar.vue'
import SaSubmissionTable from '@/components/superadmin/submission/SaSubmissionTable.vue'
import SaSubmissionRow from '@/components/superadmin/submission/SaSubmissionRow.vue'
import SaSubmissionDetailModal from '@/components/superadmin/submission/SaSubmissionDetailModal.vue'

const {
  submissions, selectedSubmission, isLoading, isLoadingDetail, isSubmitting, error,
  draftCount, registeredCount, isEmpty,
  fetchSubmissions, fetchSubmissionDetail, deleteSubmission, submitDraft,
} = useSuperAdminSubmission()

const toast = useToast()

// ── Search & Filter State ─────────────────────────────────────────
const searchQuery = ref('')
const statusFilter = ref('all')
const perPage = ref(10)

// ── Computed Filtered Submissions ──────────────────────────────────
const filteredSubmissions = computed(() => {
  return submissions.value.filter((item) => {
    // 1. Search Query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesNumber = item.submission_number?.toLowerCase().includes(query)
      
      const nameInForm1 = (item.form1_data as any)?.name?.toLowerCase() || ''
      const matchesName = nameInForm1.includes(query)
      
      if (!matchesNumber && !matchesName) return false
    }

    // 2. Status Filter
    if (statusFilter.value !== 'all') {
      if (item.status !== statusFilter.value) return false
    }

    return true
  })
})

const { page, paginatedItems, totalItems } = usePagination(filteredSubmissions, perPage)

// ── Modal state ───────────────────────────────────────────────────
const showDeleteModal  = ref(false)
const showSubmitModal  = ref(false)
const showResultModal  = ref(false)
const showDetailModal  = ref(false)
const deletingItem     = ref<{ id: number; number: string } | null>(null)
const submittingItem   = ref<{ id: number; number: string } | null>(null)

const resultModalHeadline = ref('')
const resultModalMessage  = ref('')
const resultModalVariant  = ref<'success' | 'error'>('success')

// ── Handlers ──────────────────────────────────────────────────────
function onDelete(item: SppgDraft) {
  deletingItem.value = { id: item.id, number: item.submission_number }
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!deletingItem.value) return
  try {
    await deleteSubmission(deletingItem.value.id)
    toast.success('Pengajuan berhasil dihapus')
    showDeleteModal.value = false; deletingItem.value = null
  } catch { toast.error('Gagal menghapus pengajuan') }
}

function onSubmit(item: SppgDraft) {
  submittingItem.value = { id: item.id, number: item.submission_number }
  showSubmitModal.value = true
}

async function handleSubmit() {
  if (!submittingItem.value) return
  const submissionNumber = submittingItem.value.number
  const success = await submitDraft(submittingItem.value.id)
  
  showSubmitModal.value = false
  submittingItem.value = null

  // Wait for the modal close transition (300ms) to complete
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (success) {
    resultModalHeadline.value = 'Pendaftaran Berhasil'
    resultModalMessage.value = `Pengajuan ${submissionNumber} telah berhasil difinalisasi menjadi SPPG resmi terdaftar.`
    resultModalVariant.value = 'success'
    showResultModal.value = true
  } else {
    resultModalHeadline.value = 'Pendaftaran Gagal'
    resultModalMessage.value = error.value || 'Gagal memfinalisasi pengajuan draf menjadi SPPG resmi.'
    resultModalVariant.value = 'error'
    showResultModal.value = true
  }
}

async function onView(item: SppgDraft) {
  showDetailModal.value = true
  try {
    await fetchSubmissionDetail(item.id)
  } catch {
    toast.error('Gagal memuat detail pengajuan')
    showDetailModal.value = false
  }
}

// Dipanggil saat Form 2 berhasil disimpan dari dalam modal
function onDetailRefreshed(updatedDraft: SppgDraft) {
  // Update selectedSubmission agar modal langsung menampilkan data baru
  if (selectedSubmission.value?.id === updatedDraft.id) {
    selectedSubmission.value = updatedDraft
  }
  // Refresh list di background
  fetchSubmissions()
  toast.success('Data Admin SPPG berhasil disimpan')
}

// Dipanggil saat submit berhasil dari dalam modal
async function onDetailSubmitted() {
  showDetailModal.value = false
  await fetchSubmissions()
  toast.success('Pengajuan berhasil difinalisasi menjadi SPPG terdaftar!')
}

onMounted(() => fetchSubmissions())

// ── Skeleton Config ──────────────────────────────────────────
const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NO', align: 'center' },
  { label: 'NO. PENGAJUAN', align: 'left' },
  { label: 'SUMBER', align: 'left' },
  { label: 'STATUS', align: 'center' },
  { label: 'PETA DIKONFIRMASI', align: 'center' },
  { label: 'TANGGAL', align: 'left' },
  { label: 'AKSI', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'text', width: '32px', align: 'center' },
  { type: 'avatar-text' },
  { type: 'text', width: '100px', align: 'left' },
  { type: 'badge', align: 'center' },
  { type: 'badge', align: 'center' },
  { type: 'text', width: '100px', align: 'left' },
  { type: 'actions' },
]
</script>

<template>
  <div class="sa-submission-page">
    <PageHeader
      title="Pengajuan SPPG"
      subtitle="Kelola draf pengajuan SPPG baru"
      :breadcrumb="['Super Admin', 'Manajemen SPPG', 'Pengajuan SPPG']"
      class="mb-6"
    />

    <SaSubmissionStats
      :draft-count="draftCount"
      :registered-count="registeredCount"
      :total-count="submissions.length"
    />

    <SaSubmissionToolbar
      :search-value="searchQuery"
      :filter-value="statusFilter"
      :per-page-value="perPage"
      @update:search-value="searchQuery = $event"
      @update:filter-value="statusFilter = $event"
      @update:per-page-value="perPage = $event"
    />

    <BaseTableSkeleton
      v-if="isLoading"
      :rows="6"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <BaseEmptyState
      v-else-if="isEmpty"
      icon="assignment"
      title="Belum ada pengajuan SPPG"
      description="Pengajuan akan muncul di sini setelah dibuat."
    />

    <BaseEmptyState
      v-else-if="filteredSubmissions.length === 0"
      icon="search"
      title="Tidak ada hasil pencarian"
      description="Coba ubah kata kunci atau filter pencarian Anda."
    />

    <SaSubmissionTable v-else>
      <SaSubmissionRow
        v-for="(item, idx) in paginatedItems"
        :key="item.id"
        :item="item"
        :row-number="(page - 1) * perPage + idx + 1"
        @submit="onSubmit"
        @delete="onDelete"
        @view="onView"
      />

      <template #pagination>
        <BasePagination
          v-if="totalItems > perPage"
          v-model="page"
          :total="totalItems"
          :per-page="perPage"
          item-label="pengajuan"
        />
      </template>
    </SaSubmissionTable>


    <ConfirmDeleteModal
      v-model="showDeleteModal"
      :item-name="deletingItem?.number ?? ''"
      :is-submitting="isSubmitting"
      @confirm="handleDelete"
    />

    <ConfirmActionModal
      v-model="showSubmitModal"
      title="Finalisasi Pengajuan"
      :message="`Apakah Anda yakin ingin memfinalisasi pengajuan <strong>${submittingItem?.number ?? ''}</strong> menjadi SPPG terdaftar?`"
      confirm-label="Finalisasi"
      variant="success"
      :is-submitting="isSubmitting"
      @confirm="handleSubmit"
    />

    <ResultModal
      v-model="showResultModal"
      title="Status Registrasi"
      :headline="resultModalHeadline"
      :message="resultModalMessage"
      :variant="resultModalVariant"
    />

    <SaSubmissionDetailModal
      v-model:is-open="showDetailModal"
      :submission="selectedSubmission"
      :is-loading="isLoadingDetail"
      @refreshed="onDetailRefreshed"
      @submitted="onDetailSubmitted"
    />
  </div>
</template>

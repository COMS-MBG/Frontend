<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useSuperAdminFinance } from '@/composables/useSuperAdminFinance'
import { useToast } from '@/composables/useToast'
import type { FinancialReport } from '@/types/superadmin-finance'
import PageHeader from '@/components/common/PageHeader.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import ConfirmActionModal from '@/components/common/ConfirmActionModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import SaFinanceToolbar from '@/components/superadmin/finance/SaFinanceToolbar.vue'
import SaFinanceTable from '@/components/superadmin/finance/SaFinanceTable.vue'
import SaFinanceRow from '@/components/superadmin/finance/SaFinanceRow.vue'

const {
  reports, isLoading, isSubmitting, error, meta,
  searchQuery, statusFilter, isEmpty,
  fetchReports, deleteReport, approveReport, rejectReport,
  setSearchQuery, setStatusFilter,
} = useSuperAdminFinance()

const toast = useToast()
const showNotice = ref(true)

// ── Modal state ───────────────────────────────────────────────────
const showDeleteModal = ref(false)
const showActionModal = ref(false)
const showResultModal = ref(false)
const deletingItem    = ref<{ id: number; name: string } | null>(null)
const actionItem      = ref<{ id: number; name: string; action: 'approve' | 'reject' } | null>(null)

const resultModalHeadline = ref('')
const resultModalMessage  = ref('')
const resultModalVariant  = ref<'success' | 'error'>('success')

// ── Handlers ──────────────────────────────────────────────────────
function onDelete(item: FinancialReport) {
  deletingItem.value = { id: item.id, name: `${item.sppg_name} — ${item.period}` }
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!deletingItem.value) return
  try {
    await deleteReport(deletingItem.value.id)
    toast.success('Laporan keuangan berhasil dihapus')
    showDeleteModal.value = false; deletingItem.value = null
  } catch { toast.error('Gagal menghapus laporan') }
}

function onApprove(item: FinancialReport) {
  actionItem.value = { id: item.id, name: `${item.sppg_name} — ${item.period}`, action: 'approve' }
  showActionModal.value = true
}

function onReject(item: FinancialReport) {
  actionItem.value = { id: item.id, name: `${item.sppg_name} — ${item.period}`, action: 'reject' }
  showActionModal.value = true
}

async function handleAction() {
  if (!actionItem.value) return
  const isApprove = actionItem.value.action === 'approve'
  const name = actionItem.value.name
  try {
    if (isApprove) {
      await approveReport(actionItem.value.id)
      resultModalHeadline.value = 'Laporan Disetujui'
      resultModalMessage.value = `Laporan keuangan untuk ${name} telah berhasil disetujui.`
      resultModalVariant.value = 'success'
    } else {
      await rejectReport(actionItem.value.id)
      resultModalHeadline.value = 'Laporan Ditolak'
      resultModalMessage.value = `Laporan keuangan untuk ${name} telah berhasil ditolak.`
      resultModalVariant.value = 'success'
    }
    showResultModal.value = true
    showActionModal.value = false
    actionItem.value = null
  } catch (err: unknown) {
    resultModalHeadline.value = 'Gagal Memproses'
    resultModalMessage.value = error.value || `Gagal memproses tindakan pada laporan keuangan untuk ${name}.`
    resultModalVariant.value = 'error'
    showResultModal.value = true
    showActionModal.value = false
    actionItem.value = null
  }
}

watch([searchQuery, statusFilter], () => fetchReports(1))
onMounted(() => fetchReports())
</script>

<template>
  <div class="sa-finance-page">
    <PageHeader
      title="Laporan Keuangan"
      subtitle="Kelola laporan keuangan dari seluruh SPPG"
      :breadcrumb="['Super Admin', 'Keuangan']"
      class="mb-6"
    />

    <BaseAlert
      :show="showNotice"
      variant="warning"
      message="Modul keuangan masih dalam tahap pengembangan backend. Beberapa fitur mungkin belum berfungsi sepenuhnya."
      dismissible
      class="mb-4"
      @update:show="showNotice = $event"
    />

    <SaFinanceToolbar
      :search-value="searchQuery"
      :filter-value="statusFilter"
      @update:search-value="setSearchQuery"
      @update:filter-value="setStatusFilter"
    />

    <BaseTableSkeleton v-if="isLoading" />

    <BaseEmptyState
      v-else-if="isEmpty"
      icon="account_balance_wallet"
      title="Belum ada laporan keuangan"
      description="Laporan keuangan akan muncul setelah SPPG mengirim laporan."
    />

    <SaFinanceTable v-else>
      <SaFinanceRow
        v-for="(item, idx) in reports"
        :key="item.id"
        :item="item"
        :row-number="(meta.current_page - 1) * meta.per_page + idx + 1"
        @approve="onApprove"
        @reject="onReject"
        @delete="onDelete"
      />

      <template #pagination>
        <BasePagination
          v-if="meta.total > meta.per_page"
          :model-value="meta.current_page"
          :total="meta.total"
          :per-page="meta.per_page"
          @update:model-value="fetchReports"
        />
      </template>
    </SaFinanceTable>

    <ConfirmDeleteModal
      v-model="showDeleteModal"
      :item-name="deletingItem?.name ?? ''"
      :is-submitting="isSubmitting"
      @confirm="handleDelete"
    />

    <ConfirmActionModal
      v-model="showActionModal"
      :title="actionItem?.action === 'approve' ? 'Setujui Laporan' : 'Tolak Laporan'"
      :message="`Apakah Anda yakin ingin ${actionItem?.action === 'approve' ? 'menyetujui' : 'menolak'} laporan <strong>${actionItem?.name ?? ''}</strong>?`"
      :confirm-label="actionItem?.action === 'approve' ? 'Setujui' : 'Tolak'"
      :variant="actionItem?.action === 'approve' ? 'success' : 'danger'"
      :is-submitting="isSubmitting"
      @confirm="handleAction"
    />

    <ResultModal
      v-model="showResultModal"
      title="Status Laporan"
      :headline="resultModalHeadline"
      :message="resultModalMessage"
      :variant="resultModalVariant"
    />
  </div>
</template>

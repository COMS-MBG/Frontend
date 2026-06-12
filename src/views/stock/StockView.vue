<template>
  <div class="stock-view page-container">
    <!-- Header -->
    <PageHeader
      title="Manajemen Stok Bahan Baku"
      subtitle="Kelola persediaan, batas minimum, pengajuan stok, dan pantau histori keluar masuk bahan baku SPPG secara real-time."
      :breadcrumb="['Manajemen Gizi', 'Manajemen Stok']"
    />

    <!-- Statistik Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon-wrap stat-card__icon-wrap--primary">
          <span class="material-symbols-outlined">kitchen</span>
        </div>
        <div class="stat-card__content">
          <span class="stat-card__value">{{ totalBahan }}</span>
          <span class="stat-card__label">Total Bahan Baku</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card__icon-wrap stat-card__icon-wrap--warning">
          <span class="material-symbols-outlined">warning</span>
        </div>
        <div class="stat-card__content">
          <span class="stat-card__value">{{ lowStockCount }}</span>
          <span class="stat-card__label">Stok Rendah</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card__icon-wrap stat-card__icon-wrap--danger">
          <span class="material-symbols-outlined">cancel</span>
        </div>
        <div class="stat-card__content">
          <span class="stat-card__value">{{ emptyStockCount }}</span>
          <span class="stat-card__label">Stok Habis</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card__icon-wrap stat-card__icon-wrap--info">
          <span class="material-symbols-outlined">pending_actions</span>
        </div>
        <div class="stat-card__content">
          <span class="stat-card__value">{{ pendingCount }}</span>
          <span class="stat-card__label">Pending Approval</span>
        </div>
      </div>
    </div>

    <!-- Tabs Header -->
    <div class="tabs-header">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'summary' }"
        @click="switchTab('summary')"
      >
        <span class="material-symbols-outlined tab-icon">inventory_2</span>
        <span>Stok Tersedia</span>
      </button>

      <button
        class="tab-btn"
        :class="{ active: activeTab === 'pending' }"
        @click="switchTab('pending')"
      >
        <span class="material-symbols-outlined tab-icon">assignment_late</span>
        <span>Menunggu Persetujuan</span>
        <span v-if="pendingCount > 0" class="tab-badge">{{ pendingCount }}</span>
      </button>

      <button
        class="tab-btn"
        :class="{ active: activeTab === 'transactions' }"
        @click="switchTab('transactions')"
      >
        <span class="material-symbols-outlined tab-icon">history</span>
        <span>Riwayat Transaksi</span>
      </button>
    </div>

    <!-- Tabs Body -->
    <div class="tabs-body">
      <Transition name="fade" mode="out-in">
        <div :key="activeTab">
          <!-- ── TAB 1: SUMMARY STOK ── -->
          <template v-if="activeTab === 'summary'">
            <!-- Toolbar -->
            <StockToolbar
              v-model:search-value="searchQuery"
              v-model:status-filter="statusFilter"
              :can-create="canCreate"
              @add="onAddStockClick(null)"
            />

            <!-- Table or Skeleton -->
            <div class="table-container mt-4">
              <BaseTableSkeleton
                v-if="isLoading && summaries.length === 0"
                :headers="summaryHeaders"
                :columns="summaryCols"
                :rows-count="5"
              />

              <BaseEmptyState
                v-else-if="filteredSummaries.length === 0"
                title="Tidak Ada Data Stok"
                description="Belum ada data stok bahan baku yang sesuai atau tersedia di SPPG ini."
                icon="inventory_2"
              >
                <template #action v-if="canCreate">
                  <button class="btn-primary" @click="onAddStockClick(null)">
                    <span class="material-symbols-outlined">add</span>
                    Ajukan Stok Pertama
                  </button>
                </template>
              </BaseEmptyState>

              <StockTable v-else>
                <StockRow
                  v-for="item in filteredSummaries"
                  :key="item.ingredient_id"
                  :item="item"
                  :can-create="canCreate"
                  :can-update="canUpdate"
                  @view-detail="onViewDetail"
                  @set-minimum="onSetMinimum"
                  @add-stock="onAddStockClick"
                />
              </StockTable>
            </div>
          </template>

          <!-- ── TAB 2: PENDING APPROVAL QUEUE ── -->
          <template v-else-if="activeTab === 'pending'">
            <div class="table-container">
              <BaseTableSkeleton
                v-if="isLoading && pendingItems.length === 0"
                :headers="pendingHeaders"
                :columns="pendingCols"
                :rows-count="3"
              />

              <BaseEmptyState
                v-else-if="pendingItems.length === 0"
                title="Antrean Approval Kosong"
                description="Semua pengajuan stok telah diproses. Tidak ada data yang menunggu persetujuan."
                icon="check_circle"
              />

              <div v-else class="stock-table-wrap">
                <table class="stock-table">
                  <thead>
                    <tr>
                      <th class="th-left">BAHAN BAKU</th>
                      <th class="th-right">QTY PENGAJUAN</th>
                      <th class="th-right">EST. HARGA SATUAN</th>
                      <th>TGL PEMBELIAN</th>
                      <th>SUPPLIER</th>
                      <th>STORAGE</th>
                      <th>PENGAJU</th>
                      <th class="th-center">BUKTI</th>
                      <th class="th-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in pendingItems" :key="item.id" class="pending-row">
                      <td class="td-nama">
                        <div class="bahan-info">
                          <span class="bahan-icon material-symbols-outlined text-warning">pending_actions</span>
                          <span class="bahan-name">{{ item.ingredient?.name ?? 'Bahan Baku' }}</span>
                        </div>
                      </td>
                      <td class="td-right">
                        <strong>{{ formatDec(item.quantity, 3) }}</strong>
                        <span class="unit-text">{{ item.unit }}</span>
                      </td>
                      <td class="td-right">{{ formatRupiah(item.price_per_unit) }}</td>
                      <td>{{ formatDate(item.purchase_date) }}</td>
                      <td>{{ item.supplier }}</td>
                      <td>
                        <span class="storage-badge" :class="`storage-badge--${item.storage_type}`">
                          {{ storageLabel(item.storage_type) }}
                        </span>
                      </td>
                      <td>
                        <div class="creator-info">
                          <span class="creator-name">{{ item.creator?.name ?? 'Staf' }}</span>
                          <span class="creator-date">{{ formatDate(item.created_at) }}</span>
                        </div>
                      </td>
                      <td class="td-center">
                        <a
                          v-if="item.proof_document"
                          :href="getProofUrl(item.proof_document)"
                          target="_blank"
                          class="proof-link-btn"
                          title="Lihat Bukti Dokumen"
                        >
                          <span class="material-symbols-outlined">description</span>
                        </a>
                        <span v-else class="text-muted">—</span>
                      </td>
                      <td class="td-center">
                        <div class="row-actions justify-center">
                          <button
                            v-if="canApprove"
                            class="btn-xs btn-xs--success"
                            title="Setujui Pengajuan"
                            @click="triggerApprove(item)"
                          >
                            <span class="material-symbols-outlined">check</span>
                          </button>
                          <button
                            v-if="canApprove"
                            class="btn-xs btn-xs--danger"
                            title="Tolak Pengajuan"
                            @click="triggerReject(item)"
                          >
                            <span class="material-symbols-outlined">close</span>
                          </button>
                          <button
                            v-if="canUpdate && (item.created_by === currentUser?.id || isSuperAdmin)"
                            class="btn-xs btn-xs--primary"
                            title="Edit Pengajuan"
                            @click="triggerEditPending(item)"
                          >
                            <span class="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            v-if="canDelete && (item.created_by === currentUser?.id || isSuperAdmin)"
                            class="btn-xs btn-xs--danger-light"
                            title="Hapus Pengajuan"
                            @click="triggerDeletePending(item)"
                          >
                            <span class="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>

          <!-- ── TAB 3: RIWAYAT TRANSAKSI SPPG ── -->
          <template v-else-if="activeTab === 'transactions'">
            <!-- Filters for Riwayat Transaksi -->
            <div class="transaction-filters">
              <div class="filter-group-left">
                <div class="filter-item">
                  <span class="filter-label">Tipe Transaksi</span>
                  <div class="filter-select-wrap">
                    <AppSelect
                      v-model="txTypeFilter"
                      :options="txTypeOptions"
                      placeholder="Semua Tipe"
                    />
                  </div>
                </div>

                <div class="filter-item">
                  <span class="filter-label">Bahan Baku</span>
                  <div class="filter-select-wrap">
                    <AppSelect
                      v-model="txIngredientFilter"
                      :options="txIngredientOptions"
                      placeholder="Semua Bahan"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="table-container mt-4">
              <BaseTableSkeleton
                v-if="isLoading && transactions.length === 0"
                :headers="txHeaders"
                :columns="txCols"
                :rows-count="5"
              />

              <BaseEmptyState
                v-else-if="transactions.length === 0"
                title="Belum Ada Transaksi"
                description="Semua aktivitas masuk dan keluar stok SPPG akan tercatat secara otomatis di sini."
                icon="history"
              />

              <div v-else>
                <div class="stock-table-wrap">
                  <table class="stock-table">
                    <thead>
                      <tr>
                        <th>WAKTU</th>
                        <th>BAHAN BAKU</th>
                        <th>BATCH NO</th>
                        <th class="th-center">TIPE</th>
                        <th class="th-right">JUMLAH</th>
                        <th class="th-right">SEBELUM</th>
                        <th class="th-right">SESUDAH</th>
                        <th>PETUGAS</th>
                        <th>CATATAN</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="filteredTransactions.length === 0">
                        <td colspan="9" class="td-center text-muted py-4">
                          Tidak ada transaksi yang cocok dengan filter yang dipilih.
                        </td>
                      </tr>
                      <tr v-else v-for="tx in filteredTransactions" :key="tx.id" class="tx-row">
                        <td class="mono white-space-nowrap">{{ formatDate(tx.created_at) }}</td>
                        <td>
                          <strong>{{ tx.ingredient?.name ?? 'Bahan' }}</strong>
                        </td>
                        <td>
                          <span v-if="tx.stock_item?.batch_number" class="mono text-muted">
                            {{ tx.stock_item.batch_number }}
                          </span>
                          <span v-else class="text-muted">—</span>
                        </td>
                        <td class="td-center">
                          <span class="type-badge" :class="`type-badge--${tx.transaction_type}`">
                            <span class="material-symbols-outlined badge-icon">
                              {{ tx.transaction_type === 'in' ? 'arrow_upward' : 'arrow_downward' }}
                            </span>
                            {{ tx.transaction_type === 'in' ? 'Masuk' : 'Keluar' }}
                          </span>
                        </td>
                        <td class="td-right mono text-bold" :class="`qty-text--${tx.transaction_type}`">
                          {{ tx.transaction_type === 'in' ? '+' : '-' }}{{ formatDec(tx.quantity, 3) }}
                        </td>
                        <td class="td-right mono text-muted">{{ formatDec(tx.quantity_before, 3) }}</td>
                        <td class="td-right mono text-primary">{{ formatDec(tx.quantity_after, 3) }}</td>
                        <td>{{ tx.creator?.name ?? 'Sistem' }}</td>
                        <td class="notes-cell">{{ tx.notes }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination -->
                <div class="pagination-wrap mt-4">
                  <BasePagination
                    :model-value="transactionPagination.currentPage"
                    :total="transactionPagination.total"
                    :per-page="transactionPagination.perPage"
                    item-label="transaksi"
                    @update:model-value="fetchTransactions"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
      </Transition>
    </div>

    <!-- ── MODALS ── -->

    <!-- Modal 1: Ajukan / Edit Pengajuan Stok -->
    <StockAddModal
      :is-open="showAddModal"
      :is-submitting="isSubmitting"
      :ingredient-options="ingredientOptions"
      :prefill-ingredient="prefillSummary"
      :edit-item="editingPendingItem"
      @close="closeAddModal"
      @submit="onSubmitStock"
    />

    <!-- Modal 2: Detail Batch Per Ingredient -->
    <StockDetailModal
      :is-open="showDetailModal"
      :detail="currentDetail"
      :is-submitting="isSubmitting"
      :can-read="canRead"
      :can-approve="canApprove"
      :can-delete="canDelete"
      @close="showDetailModal = false"
      @approve="onApproveFromDetail"
      @reject="onRejectFromDetail"
      @delete="onDeleteFromDetail"
      @view-transactions="onViewBatchTransactions"
    />

    <!-- Modal 3: Set Minimum Stock -->
    <StockMinimumModal
      :is-open="showMinModal"
      :is-submitting="isSubmitting"
      :item="selectedSummary"
      @close="showMinModal = false"
      @submit="onSubmitMinimum"
    />

    <!-- Modal 4: Batch Transactions Log -->
    <StockTransactionModal
      :is-open="showTxModal"
      :is-loading="isLoading"
      :batch="selectedBatchForTx"
      :transactions="batchTransactions"
      @close="showTxModal = false"
    />

    <!-- Modal 5: Confirm Delete Pending -->
    <ConfirmDeleteModal
      v-model="showDeleteConfirm"
      title="Hapus Pengajuan Stok"
      :item-name="deletingItemName"
      :is-submitting="isSubmitting"
      @confirm="onConfirmDelete"
    />

    <!-- Modal 6: Confirm Action (Approve / Reject) -->
    <ConfirmActionModal
      v-model="showActionConfirm"
      :title="actionConfirmTitle"
      :message="actionConfirmMessage"
      :variant="actionConfirmVariant"
      :confirm-label="actionConfirmLabel"
      :confirm-icon="actionConfirmIcon"
      :is-submitting="isSubmitting"
      @confirm="onConfirmAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStock } from '@/composables/useStock'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { getIngredientDropdown } from '@/api/ingredient.api'
import { formatDec, formatDate, formatRupiah } from '@/utils/format'
import type { StockSummary, StockItem, StorageType } from '@/types/stock'
import type { SkeletonHeader, SkeletonColumn } from '@/components/common/BaseTableSkeleton.vue'
import type { SelectOption } from '@/types/form'

// Import components
import PageHeader from '@/components/common/PageHeader.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import ConfirmActionModal from '@/components/common/ConfirmActionModal.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import BasePagination from '@/components/common/BasePagination.vue'

import StockToolbar from '@/components/stock/StockToolbar.vue'
import StockTable from '@/components/stock/StockTable.vue'
import StockRow from '@/components/stock/StockRow.vue'
import StockAddModal from '@/components/stock/StockAddModal.vue'
import StockDetailModal from '@/components/stock/StockDetailModal.vue'
import StockMinimumModal from '@/components/stock/StockMinimumModal.vue'
import StockTransactionModal from '@/components/stock/StockTransactionModal.vue'

// Composable & auth refs
const {
  summaries, pendingItems, currentDetail, transactions, batchTransactions,
  isLoading, isSubmitting,
  totalBahan, lowStockCount, emptyStockCount, expiredCount, pendingCount, transactionPagination,
  canRead, canCreate, canUpdate, canDelete, canApprove,
  fetchSummary, fetchDetail, fetchPending, fetchTransactions, fetchBatchTransactions,
  createStock, updateStock, deleteStock, approveStock, rejectStock, updateMinimum
} = useStock()

const { user: currentUser, isSuperAdmin } = useAuth()
const toast = useToast()

// Active Tab
const activeTab = ref<'summary' | 'pending' | 'transactions'>('summary')

// Filters & search
const searchQuery = ref('')
const statusFilter = ref('all')

const filteredSummaries = computed(() => {
  let list = summaries.value
  if (statusFilter.value && statusFilter.value !== 'all') {
    list = list.filter(s => s.status === statusFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s => s.ingredient_name.toLowerCase().includes(q))
  }
  return list
})

// Tab 3: Transactions Filters
const txTypeFilter = ref<string>('all')
const txIngredientFilter = ref<string | number>('all')

const txTypeOptions: SelectOption[] = [
  { label: 'Semua Tipe', value: 'all' },
  { label: 'Masuk', value: 'in' },
  { label: 'Keluar', value: 'out' }
]

const txIngredientOptions = computed<SelectOption[]>(() => {
  const list = ingredientOptions.value.map(opt => ({
    label: opt.name,
    value: opt.id
  }))
  return [
    { label: 'Semua Bahan', value: 'all' },
    ...list
  ]
})

const filteredTransactions = computed(() => {
  let list = transactions.value
  if (txTypeFilter.value && txTypeFilter.value !== 'all') {
    list = list.filter(t => t.transaction_type === txTypeFilter.value)
  }
  if (txIngredientFilter.value && txIngredientFilter.value !== 'all') {
    const ingId = Number(txIngredientFilter.value)
    list = list.filter(t => t.ingredient_id === ingId)
  }
  return list
})

// Ingredient options for dropdown
const ingredientOptions = ref<any[]>([])

// Modal triggers & data refs
const showAddModal = ref(false)
const showDetailModal = ref(false)
const showMinModal = ref(false)
const showTxModal = ref(false)

const prefillSummary = ref<StockSummary | null>(null)
const selectedSummary = ref<StockSummary | null>(null)
const selectedBatchForTx = ref<StockItem | null>(null)
const editingPendingItem = ref<StockItem | null>(null)

// Action confirmation states
const showActionConfirm = ref(false)
const actionConfirmTitle = ref('')
const actionConfirmMessage = ref('')
const actionConfirmVariant = ref<'primary' | 'success' | 'warning' | 'danger'>('primary')
const actionConfirmLabel = ref('Konfirmasi')
const actionConfirmIcon = ref('check')
const activeAction = ref<{ type: 'approve' | 'reject'; id: number } | null>(null)

// Delete confirmation states
const showDeleteConfirm = ref(false)
const deletingItemId = ref<number | null>(null)
const deletingItemName = ref('')

// Load basic dropdown options
async function loadIngredientDropdown() {
  try {
    const data = await getIngredientDropdown()
    ingredientOptions.value = data
  } catch (err) {
    console.error('Gagal mengambil dropdown bahan baku:', err)
  }
}

// Lifecycle
onMounted(() => {
  fetchSummary()
  loadIngredientDropdown()
  // Fetch pending list automatically if user has approval rights
  if (canApprove.value) {
    fetchPending()
  }
})

// Tab Switch
function switchTab(tab: 'summary' | 'pending' | 'transactions') {
  activeTab.value = tab
  if (tab === 'summary') {
    fetchSummary()
  } else if (tab === 'pending') {
    fetchPending()
  } else if (tab === 'transactions') {
    fetchTransactions(1)
  }
}

// Add Stock trigger
function onAddStockClick(prefill: StockSummary | null) {
  prefillSummary.value = prefill
  editingPendingItem.value = null
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
  prefillSummary.value = null
  editingPendingItem.value = null
}

async function onSubmitStock(formData: FormData) {
  let ok = false
  if (editingPendingItem.value) {
    ok = await updateStock(editingPendingItem.value.id, formData)
    if (ok) {
      toast.success('Pengajuan stok berhasil diperbarui')
      fetchPending()
    }
  } else {
    ok = await createStock(formData)
    if (ok) {
      toast.success('Pengajuan penambahan stok berhasil dikirim')
      fetchPending()
    }
  }
  if (ok) {
    closeAddModal()
  } else {
    toast.error('Gagal memproses pengajuan stok')
  }
}

// Detail modal handlers
function onViewDetail(item: StockSummary) {
  fetchDetail(item.ingredient_id)
  showDetailModal.value = true
}

function onApproveFromDetail(id: number) {
  triggerActionConfirm('approve', id)
}

function onRejectFromDetail(id: number) {
  triggerActionConfirm('reject', id)
}

function onDeleteFromDetail(id: number) {
  deletingItemId.value = id
  deletingItemName.value = 'pengajuan stok batch'
  showDeleteConfirm.value = true
}

function onViewBatchTransactions(batch: StockItem) {
  selectedBatchForTx.value = batch
  fetchBatchTransactions(batch.id)
  showTxModal.value = true
}

// Minimum stock modal
function onSetMinimum(item: StockSummary) {
  selectedSummary.value = item
  showMinModal.value = true
}

async function onSubmitMinimum(payload: { minimum_quantity: number; unit: any }) {
  if (!selectedSummary.value) return
  const ok = await updateMinimum(selectedSummary.value.ingredient_id, payload)
  if (ok) {
    toast.success(`Batas minimum ${selectedSummary.value.ingredient_name} berhasil diperbarui`)
    showMinModal.value = false
  } else {
    toast.error('Gagal memperbarui batas minimum')
  }
}

// Pending Approval operations
function triggerApprove(item: StockItem) {
  triggerActionConfirm('approve', item.id)
}

function triggerReject(item: StockItem) {
  triggerActionConfirm('reject', item.id)
}

function triggerEditPending(item: StockItem) {
  editingPendingItem.value = item
  prefillSummary.value = null
  showAddModal.value = true
}

function triggerDeletePending(item: StockItem) {
  deletingItemId.value = item.id
  deletingItemName.value = `${item.ingredient?.name ?? 'Bahan'} (Qty: ${item.quantity})`
  showDeleteConfirm.value = true
}

// Confirm Delete execution
async function onConfirmDelete() {
  if (!deletingItemId.value) return
  const ok = await deleteStock(deletingItemId.value)
  if (ok) {
    toast.success('Pengajuan stok berhasil dihapus')
    showDeleteConfirm.value = false
    deletingItemId.value = null
    // If detail modal is open, refresh detail target
    if (showDetailModal.value && currentDetail.value) {
      fetchDetail(currentDetail.value.ingredient.id)
    }
  } else {
    toast.error('Gagal menghapus pengajuan stok')
  }
}

// Action confirms (Approve / Reject)
function triggerActionConfirm(type: 'approve' | 'reject', id: number) {
  activeAction.value = { type, id }
  if (type === 'approve') {
    actionConfirmTitle.value = 'Setujui Pengajuan Stok'
    actionConfirmMessage.value = 'Apakah Anda yakin ingin menyetujui pengajuan stok ini? Batch pembelian akan segera dimasukkan ke stok aktif.'
    actionConfirmVariant.value = 'success'
    actionConfirmLabel.value = 'Setujui'
    actionConfirmIcon.value = 'check_circle'
  } else {
    actionConfirmTitle.value = 'Tolak Pengajuan Stok'
    actionConfirmMessage.value = 'Apakah Anda yakin ingin menolak pengajuan stok ini?'
    actionConfirmVariant.value = 'danger'
    actionConfirmLabel.value = 'Tolak'
    actionConfirmIcon.value = 'cancel'
  }
  showActionConfirm.value = true
}

async function onConfirmAction() {
  if (!activeAction.value) return
  const { type, id } = activeAction.value
  let ok = false

  if (type === 'approve') {
    ok = await approveStock(id)
    if (ok) toast.success('Pengajuan stok berhasil disetujui')
  } else {
    ok = await rejectStock(id)
    if (ok) toast.success('Pengajuan stok ditolak')
  }

  if (ok) {
    showActionConfirm.value = false
    activeAction.value = null
    fetchPending()
    // If detail modal is open, refresh details
    if (showDetailModal.value && currentDetail.value) {
      fetchDetail(currentDetail.value.ingredient.id)
    }
  } else {
    toast.error('Gagal memproses persetujuan stok')
  }
}

// Helpers
function getProofUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  return `${baseUrl}/storage/${path}`
}

function storageLabel(type: StorageType): string {
  return { dry: 'Kering', chilled: 'Dingin', frozen: 'Beku' }[type] ?? type
}

// Header & column definitions for BaseTableSkeleton
const summaryHeaders: SkeletonHeader[] = [
  { label: 'BAHAN BAKU', align: 'left' },
  { label: 'TOTAL STOK', align: 'right' },
  { label: 'MINIMUM', align: 'right' },
  { label: 'BATCH AKTIF', align: 'center' },
  { label: 'STATUS', align: 'center' },
  { label: 'AKSI', align: 'center' }
]

const summaryCols: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'text', width: '70px', align: 'right' },
  { type: 'text', width: '70px', align: 'right' },
  { type: 'text', width: '50px', align: 'center' },
  { type: 'badge' },
  { type: 'actions' }
]

const pendingHeaders: SkeletonHeader[] = [
  { label: 'BAHAN BAKU', align: 'left' },
  { label: 'QTY', align: 'right' },
  { label: 'HARGA', align: 'right' },
  { label: 'TGL PEMBELIAN', align: 'left' },
  { label: 'SUPPLIER', align: 'left' },
  { label: 'STORAGE', align: 'left' },
  { label: 'PENGAJU', align: 'left' },
  { label: 'BUKTI', align: 'center' },
  { label: 'AKSI', align: 'center' }
]

const pendingCols: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'text', width: '60px', align: 'right' },
  { type: 'text', width: '80px', align: 'right' },
  { type: 'text', width: '90px' },
  { type: 'text', width: '90px' },
  { type: 'badge' },
  { type: 'text', width: '80px' },
  { type: 'text', width: '30px', align: 'center' },
  { type: 'actions' }
]

const txHeaders: SkeletonHeader[] = [
  { label: 'WAKTU', align: 'left' },
  { label: 'BAHAN BAKU', align: 'left' },
  { label: 'BATCH NO', align: 'left' },
  { label: 'TIPE', align: 'center' },
  { label: 'JUMLAH', align: 'right' },
  { label: 'SEBELUM', align: 'right' },
  { label: 'SESUDAH', align: 'right' },
  { label: 'PETUGAS', align: 'left' },
  { label: 'CATATAN', align: 'left' }
]

const txCols: SkeletonColumn[] = [
  { type: 'text', width: '120px' },
  { type: 'text', width: '120px' },
  { type: 'text', width: '100px' },
  { type: 'badge' },
  { type: 'text', width: '60px', align: 'right' },
  { type: 'text', width: '60px', align: 'right' },
  { type: 'text', width: '60px', align: 'right' },
  { type: 'text', width: '80px' },
  { type: 'text', width: '150px' }
]
</script>

<style scoped lang="scss">
.stock-view {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

// ── Statistik Cards ──
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: $space-4;
}

.stat-card {
  @include card-base($radius-lg, $shadow-xs);
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-5;
  background-color: $color-bg-surface;
  transition: transform $transition-fast, box-shadow $transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-sm;
  }

  &__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: $radius-lg;

    .material-symbols-outlined { font-size: 1.5rem; }

    &--primary { background-color: $color-primary-light; color: $color-primary; }
    &--warning { background-color: $color-warning-bg; color: $color-warning-dark; }
    &--danger  { background-color: $color-danger-bg; color: $color-danger; }
    &--info    { background-color: $color-info-bg; color: $color-info; }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__value {
    font-size: $text-xl;
    font-weight: 800;
    color: $color-text-primary;
    line-height: 1.2;
  }

  &__label {
    font-size: $text-xs;
    font-weight: 600;
    color: $color-text-muted;
  }
}

// ── Tabs Header ──
.tabs-header {
  display: flex;
  border-bottom: 1px solid $color-border;
  background-color: $color-bg-surface;
  border-radius: $radius-lg $radius-lg 0 0;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: $space-2;
  border: none;
  background: none;
  border-bottom: 2px solid transparent;
  padding: $space-4 $space-5;
  font-size: $text-sm;
  font-weight: 600;
  color: $color-text-muted;
  cursor: pointer;
  transition: all $transition-fast;
  white-space: nowrap;

  .tab-icon { font-size: 1.15rem; }
  &:hover { color: $color-primary; }

  &.active {
    color: $color-primary;
    border-bottom-color: $color-primary;
  }

  .tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: $radius-pill;
    background-color: $color-danger;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    margin-left: 2px;
  }
}

.tabs-body {
  background-color: $color-bg-surface;
  padding: $space-6;
  border-radius: 0 0 $radius-lg $radius-lg;
  border: 1px solid $color-border;
  border-top: none;
  box-shadow: $shadow-xs;
}

// ── Shared Table Styles ──
.table-container {
  width: 100%;
}

.stock-table-wrap {
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
  overflow-x: auto;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
  font-size: $text-sm;

  thead th {
    padding: $space-3.5 $space-4;
    font-size: $text-xs;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-text-muted;
    background-color: $color-bg-subtle;
    border-bottom: 1px solid $color-border;
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid $color-border-light;
    transition: background-color $transition-fast;
    &:last-child { border-bottom: none; }
    &:hover { background-color: $color-bg-subtle; }

    td { padding: $space-3 $space-4; vertical-align: middle; }
  }
}

.th-left { text-align: left; }
.th-right { text-align: right; }
.th-center { text-align: center; }
.td-right { text-align: right; }
.td-center { text-align: center; }
.mono { font-family: $font-mono; font-size: $text-xs; }
.text-muted { color: $color-text-faint; }
.text-primary { color: $color-primary; font-weight: 600; }
.text-bold { font-weight: 700; }
.white-space-nowrap { white-space: nowrap; }

.bahan-info {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.bahan-icon { font-size: 1.3rem; flex-shrink: 0; }
.bahan-name { font-size: $text-sm; font-weight: 600; color: $color-text-primary; }
.unit-text { font-size: $text-xs; color: $color-text-faint; margin-left: 4px; }

.storage-badge {
  display: inline-flex;
  padding: 2px $space-2;
  border-radius: $radius-sm;
  font-size: $text-xs;
  font-weight: 700;

  &--dry     { background-color: $color-bg-subtle; color: $color-text-secondary; border: 1px solid $color-border; }
  &--chilled { background-color: $color-info-bg; color: $color-info; border: 1px solid $color-info-bg; }
  &--frozen  { background-color: #e0f2ff; color: #0369a1; border: 1px solid #bae6fd; }
}

.creator-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.creator-name { font-size: $text-sm; font-weight: 600; color: $color-text-primary; }
.creator-date { font-size: $text-xs; color: $color-text-faint; }

.proof-link-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: $radius-sm;
  border: 1px solid $color-border;
  background-color: $color-bg-surface;
  color: $color-primary;
  transition: all $transition-fast;

  .material-symbols-outlined { font-size: 1.15rem; }
  &:hover { background-color: $color-primary-light; border-color: $color-primary-muted; }
}

// Row Actions
.row-actions {
  display: flex;
  gap: $space-1.5;
  &.justify-center { justify-content: center; }
}

.btn-xs {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: $radius-sm;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all $transition-fast;

  .material-symbols-outlined { font-size: 1.05rem; }

  &--success { background-color: $color-success-bg; color: $color-success-dark; border-color: $color-success-border; &:hover { background-color: $color-success; color: #fff; } }
  &--danger  { background-color: $color-danger-bg;  color: $color-danger;       border-color: $color-danger-border;  &:hover { background-color: $color-danger;  color: #fff; } }
  &--danger-light { background-color: $color-danger-bg; color: $color-danger; border-color: $color-danger-border; &:hover { background-color: $color-danger-bg; border-color: $color-danger; } }
  &--primary { background-color: $color-primary-light; color: $color-primary; border-color: $color-primary-muted; &:hover { background-color: $color-primary; color: #fff; } }
  &--neutral { background-color: $color-bg-subtle;  color: $color-text-muted;   border-color: $color-border;         &:hover { background-color: $color-bg-subtle; } }
}

// ── Transaction Specific Badge ──
.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px $space-2-5;
  border-radius: $radius-sm;
  font-size: $text-xs;
  font-weight: 700;

  .badge-icon { font-size: 0.85rem; }

  &--in {
    background-color: $color-success-bg;
    color: $color-success-dark;
    border: 1px solid $color-success-border;
  }
  &--out {
    background-color: $color-danger-bg;
    color: $color-danger-dark;
    border: 1px solid $color-danger-border;
  }
}

.qty-text--in { color: $color-success-dark; }
.qty-text--out { color: $color-danger; }

.notes-cell {
  font-size: $text-xs;
  color: $color-text-secondary;
  max-width: 220px;
  word-wrap: break-word;
}

// ── Pagination ──
.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: $space-3;
}

.pagination-buttons {
  display: flex;
  gap: $space-2;
}

.btn-pager {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: $space-2 $space-3;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  background-color: $color-bg-surface;
  color: $color-text-secondary;
  font-size: $text-xs;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-fast;

  .material-symbols-outlined { font-size: 1.1rem; }
  &:hover:not(:disabled) { background-color: $color-bg-subtle; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.mt-4 { margin-top: $space-4; }

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

// Filters for Riwayat Transaksi
.transaction-filters {
  display: flex;
  align-items: center;
  gap: $space-4;
  margin-bottom: $space-4;
  flex-wrap: wrap;

  .filter-group-left {
    display: flex;
    align-items: center;
    gap: $space-4;
    flex-wrap: wrap;
    flex: 1;
  }

  .filter-item {
    display: flex;
    align-items: center;
    gap: $space-2;

    .filter-label {
      font-size: $text-sm;
      font-weight: 500;
      color: $color-text-secondary;
      white-space: nowrap;
    }

    .filter-select-wrap {
      width: 180px;
    }
  }
}

@include mobile {
  .transaction-filters {
    .filter-group-left {
      width: 100%;
      flex-direction: column;
      align-items: stretch;
      gap: $space-3;
    }
    .filter-item {
      flex-direction: column;
      align-items: stretch;
      gap: $space-1;
      
      .filter-select-wrap {
        width: 100%;
      }
    }
  }
}
</style>

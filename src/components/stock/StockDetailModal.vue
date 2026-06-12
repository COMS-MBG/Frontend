<template>
  <BaseModal
    :model-value="isOpen"
    :title="`Detail Stok — ${detail?.ingredient?.name ?? ''}`"
    size="xl"
    @update:model-value="$emit('close')"
    @close="$emit('close')"
  >
    <div v-if="detail" class="stock-detail">
      <!-- Summary header -->
      <div class="detail-summary">
        <div class="summary-stat">
          <span class="summary-stat__label">Total Stok</span>
          <span class="summary-stat__value">{{ formatDec(totalQty, 2) }} {{ detail.unit }}</span>
        </div>
        <div class="summary-stat">
          <span class="summary-stat__label">Stok Minimum</span>
          <span class="summary-stat__value">{{ formatDec(detail.minimum_quantity, 2) }} {{ detail.unit }}</span>
        </div>
        <div class="summary-stat">
          <span class="summary-stat__label">Jumlah Batch</span>
          <span class="summary-stat__value">{{ detail.batches.length }}</span>
        </div>
      </div>

      <!-- Batch Table -->
      <section class="section">
        <h4 class="section-title">
          <span class="material-symbols-outlined">layers</span>
          Daftar Batch
        </h4>

        <div class="batch-table-wrap">
          <table class="batch-table">
            <thead>
              <tr>
                <th>BATCH NO</th>
                <th>QTY</th>
                <th>HARGA/UNIT</th>
                <th>TGL BELI</th>
                <th>TGL EXP</th>
                <th>SUPPLIER</th>
                <th>STORAGE</th>
                <th>STATUS</th>
                <th v-if="canApprove || canDelete || canRead">AKSI</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="batch in detail.batches"
                :key="batch.id"
                :class="getBatchRowClass(batch)"
              >
                <td>
                  <span v-if="batch.batch_number" class="mono">{{ batch.batch_number }}</span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td class="td-right">
                  <strong>{{ formatDec(batch.quantity, 3) }}</strong>
                  <span class="unit-text">{{ batch.unit }}</span>
                </td>
                <td class="td-right">{{ formatRupiah(batch.price_per_unit) }}</td>
                <td>{{ formatDate(batch.purchase_date) }}</td>
                <td :class="{ 'expiry-soon': isExpiringSoon(batch.expiry_date), 'expiry-past': isPast(batch.expiry_date) }">
                  {{ formatDate(batch.expiry_date) }}
                </td>
                <td>{{ batch.supplier }}</td>
                <td>
                  <span class="storage-badge" :class="`storage-badge--${batch.storage_type}`">
                    {{ storageLabel(batch.storage_type) }}
                  </span>
                </td>
                <td>
                  <span class="status-chip" :class="`status-chip--${batch.status}`">
                    {{ statusLabel(batch.status) }}
                  </span>
                </td>
                <td v-if="canApprove || canDelete || canRead">
                  <div class="row-actions">
                    <button
                      v-if="canRead && batch.status !== 'pending' && batch.status !== 'rejected'"
                      class="btn-xs btn-xs--neutral"
                      title="Lihat Transaksi"
                      @click="$emit('viewTransactions', batch)"
                    >
                      <span class="material-symbols-outlined">history</span>
                    </button>
                    <button
                      v-if="canApprove && batch.status === 'pending'"
                      class="btn-xs btn-xs--success"
                      title="Approve"
                      :disabled="isSubmitting"
                      @click="$emit('approve', batch.id)"
                    >
                      <span class="material-symbols-outlined">check</span>
                    </button>
                    <button
                      v-if="canApprove && batch.status === 'pending'"
                      class="btn-xs btn-xs--danger"
                      title="Tolak"
                      :disabled="isSubmitting"
                      @click="$emit('reject', batch.id)"
                    >
                      <span class="material-symbols-outlined">close</span>
                    </button>
                    <button
                      v-if="canDelete && batch.status === 'pending'"
                      class="btn-xs btn-xs--neutral"
                      title="Hapus Pengajuan"
                      :disabled="isSubmitting"
                      @click="$emit('delete', batch.id)"
                    >
                      <span class="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div v-else class="detail-loading">
      <span class="material-symbols-outlined spin">progress_activity</span>
      <p>Memuat detail stok...</p>
    </div>

    <template #footer>
      <button class="btn-secondary" @click="$emit('close')">Tutup</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { StockDetail, StockItem, StockStatus, StorageType } from '@/types/stock'
import { formatDec, formatRupiah, formatDate } from '@/utils/format'

const props = defineProps<{
  isOpen: boolean
  detail: StockDetail | null
  isSubmitting: boolean
  canRead: boolean
  canApprove: boolean
  canDelete: boolean
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'approve', id: number): void
  (e: 'reject', id: number): void
  (e: 'delete', id: number): void
  (e: 'viewTransactions', batch: StockItem): void
}>()

const totalQty = computed(() =>
  props.detail?.batches
    .filter(b => b.status === 'available' || b.status === 'low')
    .reduce((sum, b) => sum + b.quantity, 0) ?? 0
)

function isExpiringSoon(date: string): boolean {
  const diff = new Date(date).getTime() - Date.now()
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
}

function isPast(date: string): boolean {
  return new Date(date).getTime() < Date.now()
}

function getBatchRowClass(batch: StockItem) {
  return {
    'batch-row--pending':  batch.status === 'pending',
    'batch-row--expired':  batch.status === 'expired' || isPast(batch.expiry_date),
    'batch-row--low':      batch.status === 'low',
  }
}

function storageLabel(type: StorageType): string {
  return { dry: 'Kering', chilled: 'Dingin', frozen: 'Beku' }[type] ?? type
}

function statusLabel(status: StockStatus): string {
  return {
    pending:   'Pending',
    available: 'Tersedia',
    low:       'Rendah',
    empty:     'Habis',
    expired:   'Kadaluarsa',
    rejected:  'Ditolak',
  }[status] ?? status
}
</script>

<style scoped lang="scss">
.stock-detail {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.detail-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $space-4;

  @media (max-width: 480px) { grid-template-columns: 1fr; }
}

.summary-stat {
  display: flex;
  flex-direction: column;
  gap: $space-1;
  padding: $space-3 $space-4;
  background-color: $color-bg-subtle;
  border-radius: $radius-md;
  border: 1px solid $color-border-light;

  &__label {
    font-size: $text-xs;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-text-muted;
  }

  &__value {
    font-size: $text-xl;
    font-weight: 800;
    color: $color-primary;
  }
}

.section { }

.section-title {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-sm;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $color-text-secondary;
  margin: 0 0 $space-3;
  padding-bottom: $space-2;
  border-bottom: 1px solid $color-border-light;

  .material-symbols-outlined { font-size: 1.1rem; color: $color-primary; }
}

.batch-table-wrap {
  overflow-x: auto;
  border: 1px solid $color-border;
  border-radius: $radius-md;
}

.batch-table {
  width: 100%;
  border-collapse: collapse;
  font-size: $text-sm;

  thead th {
    padding: $space-2-5 $space-3;
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

    td { padding: $space-2-5 $space-3; vertical-align: middle; }
  }

  .batch-row--pending { background-color: $color-warning-bg; }
  .batch-row--expired { background-color: $color-danger-bg; }
  .batch-row--low     { background-color: $color-warning-bg; }
}

.td-right { text-align: right; }
.mono { font-family: $font-mono; font-size: $text-xs; }
.text-muted { color: $color-text-faint; }

.unit-text {
  font-size: $text-xs;
  color: $color-text-faint;
  margin-left: 4px;
}

.expiry-soon { color: $color-warning-dark; font-weight: 600; }
.expiry-past { color: $color-danger; font-weight: 700; }

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

.status-chip {
  display: inline-flex;
  padding: 2px $space-2-5;
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 700;

  &--pending  { background-color: $color-warning-bg;  color: $color-warning-dark;  border: 1px solid $color-warning-border; }
  &--available{ background-color: $color-success-bg;  color: $color-success-dark;  border: 1px solid $color-success-border; }
  &--low      { background-color: $color-warning-bg;  color: $color-warning-dark;  border: 1px solid $color-warning-border; }
  &--empty    { background-color: $color-danger-bg;   color: $color-danger-dark;   border: 1px solid $color-danger-border; }
  &--expired  { background-color: $color-danger-bg;   color: $color-danger;        border: 1px solid $color-danger-border; }
  &--rejected { background-color: $color-bg-subtle;   color: $color-text-muted;    border: 1px solid $color-border; }
}

.row-actions {
  display: flex;
  gap: $space-1;
}

.btn-xs {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: $radius-sm;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all $transition-fast;

  .material-symbols-outlined { font-size: 0.95rem; }

  &:disabled { opacity: 0.5; cursor: not-allowed; }

  &--success { background-color: $color-success-bg; color: $color-success-dark; border-color: $color-success-border; &:hover:not(:disabled) { background-color: $color-success; color: #fff; } }
  &--danger  { background-color: $color-danger-bg;  color: $color-danger;       border-color: $color-danger-border;  &:hover:not(:disabled) { background-color: $color-danger;  color: #fff; } }
  &--neutral { background-color: $color-bg-subtle;  color: $color-text-muted;   border-color: $color-border;         &:hover:not(:disabled) { background-color: $color-bg-subtle; } }
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: $space-2-5 $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  background-color: $color-bg-surface;
  color: $color-text-secondary;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  font-family: $font-body;
  transition: background-color $transition-fast;

  &:hover { background-color: $color-bg-subtle; }
}

.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-10;
  gap: $space-3;
  color: $color-text-muted;

  p { margin: 0; font-size: $text-sm; }
}

.spin { animation: spin 1s linear infinite; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>

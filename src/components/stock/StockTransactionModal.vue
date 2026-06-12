<template>
  <BaseModal
    :model-value="isOpen"
    :title="titleText"
    size="lg"
    @update:model-value="$emit('close')"
    @close="$emit('close')"
  >
    <div v-if="isLoading" class="tx-loading">
      <span class="material-symbols-outlined spin">progress_activity</span>
      <p>Memuat riwayat transaksi...</p>
    </div>

    <div v-else-if="txList.length === 0" class="tx-empty">
      <span class="material-symbols-outlined empty-icon">history_toggle_off</span>
      <p>Belum ada riwayat transaksi untuk batch ini.</p>
    </div>

    <div v-else class="tx-content">
      <div class="tx-table-wrap">
        <table class="tx-table">
          <thead>
            <tr>
              <th>WAKTU</th>
              <th class="th-center">TIPE</th>
              <th class="th-right">JUMLAH</th>
              <th class="th-right">SEBELUMNYA</th>
              <th class="th-right">SESUDAHNYA</th>
              <th>PENCATAT</th>
              <th>CATATAN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in txList" :key="tx.id">
              <td class="mono white-space-nowrap">{{ formatDate(tx.created_at) }}</td>
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
    </div>

    <template #footer>
      <button class="btn-secondary" @click="$emit('close')">Tutup</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { StockTransaction, StockItem } from '@/types/stock'
import { formatDec, formatDate } from '@/utils/format'

const props = defineProps<{
  isOpen: boolean
  isLoading: boolean
  batch: StockItem | null
  transactions: StockTransaction[]
}>()

defineEmits<{
  (e: 'close'): void
}>()

const titleText = computed(() => {
  if (props.batch) {
    return `Riwayat Transaksi Batch — ${props.batch.batch_number ?? 'Draft'}`
  }
  return 'Riwayat Transaksi Stok'
})

const txList = computed(() => props.transactions)
</script>

<style scoped lang="scss">
.tx-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-10;
  gap: $space-3;
  color: $color-text-muted;

  p { margin: 0; font-size: $text-sm; }
}

.tx-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-12;
  color: $color-text-faint;
  gap: $space-2;

  .empty-icon { font-size: 3rem; }
  p { margin: 0; font-size: $text-sm; font-weight: 500; }
}

.tx-content {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.tx-table-wrap {
  overflow-x: auto;
  border: 1px solid $color-border;
  border-radius: $radius-md;
}

.tx-table {
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
}

.td-right { text-align: right; }
.td-center { text-align: center; }
.th-right { text-align: right; }
.th-center { text-align: center; }
.mono { font-family: $font-mono; font-size: $text-xs; }
.text-muted { color: $color-text-faint; }
.text-primary { color: $color-primary; font-weight: 600; }
.text-bold { font-weight: 700; }
.white-space-nowrap { white-space: nowrap; }

.qty-text--in { color: $color-success-dark; }
.qty-text--out { color: $color-danger; }

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px $space-2;
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

.notes-cell {
  font-size: $text-xs;
  color: $color-text-secondary;
  max-width: 250px;
  word-wrap: break-word;
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

.spin { animation: spin 1s linear infinite; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>

<template>
  <tr class="stock-row" :class="rowClass" @click="$emit('viewDetail', item)">
    <!-- Nama Bahan -->
    <td class="td-nama">
      <div class="bahan-info">
        <span class="bahan-icon material-symbols-outlined">inventory_2</span>
        <div class="bahan-text">
          <span class="bahan-name">{{ item.ingredient_name }}</span>
          <span v-if="item.has_expired" class="expired-warn">
            <span class="material-symbols-outlined">warning</span> Ada batch expired
          </span>
        </div>
      </div>
    </td>

    <!-- Total Stok -->
    <td class="td-num">
      <span class="qty-value">{{ formatDec(item.total_quantity, 2) }}</span>
      <span class="qty-unit">{{ item.unit }}</span>
    </td>

    <!-- Minimum -->
    <td class="td-num">
      <span class="qty-min">{{ formatDec(item.minimum_quantity, 2) }}</span>
      <span class="qty-unit">{{ item.unit }}</span>
    </td>

    <!-- Batch Aktif -->
    <td class="td-center">
      <span class="batch-count">{{ item.batch_count }}</span>
    </td>

    <!-- Status Badge -->
    <td class="td-center">
      <span class="status-badge" :class="statusClass">
        <span class="material-symbols-outlined status-icon">{{ statusIcon }}</span>
        {{ statusLabel }}
      </span>
    </td>

    <!-- Aksi -->
    <td class="td-aksi" @click.stop>
      <button
        class="btn-icon btn-icon--info"
        title="Lihat Detail Batch"
        @click="$emit('viewDetail', item)"
      >
        <span class="material-symbols-outlined">open_in_new</span>
      </button>

      <button
        v-if="canUpdate"
        class="btn-icon btn-icon--neutral"
        title="Set Stok Minimum"
        @click="$emit('setMinimum', item)"
      >
        <span class="material-symbols-outlined">tune</span>
      </button>

      <button
        v-if="canCreate"
        class="btn-icon btn-icon--primary"
        title="Ajukan Stok Baru"
        @click="$emit('addStock', item)"
      >
        <span class="material-symbols-outlined">add_circle</span>
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StockSummary } from '@/types/stock'
import { formatDec } from '@/utils/format'

const props = defineProps<{
  item: StockSummary
  canCreate: boolean
  canUpdate: boolean
}>()

defineEmits<{
  (e: 'viewDetail', item: StockSummary): void
  (e: 'setMinimum', item: StockSummary): void
  (e: 'addStock', item: StockSummary): void
}>()

const rowClass = computed(() => ({
  'stock-row--low':   props.item.status === 'low',
  'stock-row--empty': props.item.status === 'empty',
}))

const statusClass = computed(() => ({
  'badge--success': props.item.status === 'available',
  'badge--warning': props.item.status === 'low',
  'badge--danger':  props.item.status === 'empty',
}))

const statusIcon = computed(() => {
  if (props.item.status === 'available') return 'check_circle'
  if (props.item.status === 'low')       return 'warning'
  return 'cancel'
})

const statusLabel = computed(() => {
  if (props.item.status === 'available') return 'Tersedia'
  if (props.item.status === 'low')       return 'Stok Rendah'
  return 'Habis'
})
</script>

<style scoped lang="scss">
.stock-row {
  border-bottom: 1px solid $color-border-light;
  cursor: pointer;
  transition: background-color $transition-fast;

  &:hover { background-color: $color-bg-subtle; }
  &:last-child { border-bottom: none; }

  &--low  { background-color: $color-warning-bg; }
  &--empty { background-color: $color-danger-bg; }
  &--low:hover  { background-color: $color-warning-border; }
  &--empty:hover { background-color: $color-danger-border; }

  td { padding: $space-3.5 $space-5; vertical-align: middle; }
}

.td-nama  { text-align: left; }
.td-num   { text-align: right; }
.td-center { text-align: center; }
.td-aksi  { text-align: center; width: 160px; }

.bahan-info {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.bahan-icon {
  font-size: 1.35rem;
  color: $color-primary;
  flex-shrink: 0;
}

.bahan-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bahan-name {
  font-size: $text-sm;
  font-weight: 600;
  color: $color-text-primary;
}

.expired-warn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $text-xs;
  color: $color-danger;
  font-weight: 600;

  .material-symbols-outlined { font-size: 0.9rem; }
}

.qty-value {
  font-size: $text-sm;
  font-weight: 700;
  color: $color-text-primary;
}

.qty-min {
  font-size: $text-sm;
  font-weight: 500;
  color: $color-text-muted;
}

.qty-unit {
  font-size: $text-xs;
  color: $color-text-faint;
  margin-left: 4px;
}

.batch-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: $radius-md;
  background-color: $color-bg-subtle;
  border: 1px solid $color-border;
  font-size: $text-sm;
  font-weight: 700;
  color: $color-text-secondary;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: $space-1.5;
  padding: 4px $space-3;
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 700;

  .status-icon { font-size: 0.9rem; }

  &.badge--success {
    background-color: $color-success-bg;
    color: $color-success-dark;
    border: 1px solid $color-success-border;
  }
  &.badge--warning {
    background-color: $color-warning-bg;
    color: $color-warning-dark;
    border: 1px solid $color-warning-border;
  }
  &.badge--danger {
    background-color: $color-danger-bg;
    color: $color-danger-dark;
    border: 1px solid $color-danger-border;
  }
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: $radius-md;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all $transition-fast;
  background: transparent;
  margin: 0 2px;

  .material-symbols-outlined { font-size: 1.1rem; }

  &--primary {
    color: $color-primary;
    border-color: $color-primary-muted;
    &:hover { background-color: $color-primary-light; }
  }
  &--info {
    color: $color-info;
    border-color: $color-info-bg;
    &:hover { background-color: $color-info-bg; }
  }
  &--neutral {
    color: $color-text-muted;
    border-color: $color-border;
    &:hover { background-color: $color-bg-subtle; }
  }
}
</style>

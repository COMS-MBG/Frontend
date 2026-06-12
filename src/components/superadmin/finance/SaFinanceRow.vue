<template>
  <tr class="sa-finance-row" role="row">
    <td>{{ rowNumber }}</td>
    <td class="sa-finance-row__sppg">{{ item.sppg_name }}</td>
    <td>{{ item.period }}</td>
    <td class="sa-finance-row__money sa-finance-row__money--income">{{ formatCurrency(item.total_income) }}</td>
    <td class="sa-finance-row__money sa-finance-row__money--expense">{{ formatCurrency(item.total_expense) }}</td>
    <td class="sa-finance-row__money" :class="item.net_income >= 0 ? 'sa-finance-row__money--income' : 'sa-finance-row__money--expense'">
      {{ formatCurrency(item.net_income) }}
    </td>
    <td>
      <BaseBadge :variant="statusVariant">
        {{ statusLabel }}
      </BaseBadge>
    </td>
    <td class="sa-finance-row__aksi">
      <div class="action-group">
        <button
          v-if="item.status === 'submitted' || item.status === 'pending'"
          class="action-btn action-btn--view"
          aria-label="Setujui"
          @click="$emit('approve', item)"
        >
          <span class="material-symbols-outlined">check_circle</span>
        </button>
        <button
          v-if="item.status === 'submitted' || item.status === 'pending'"
          class="action-btn action-btn--warning"
          aria-label="Tolak"
          @click="$emit('reject', item)"
        >
          <span class="material-symbols-outlined">cancel</span>
        </button>
        <button class="action-btn action-btn--delete" aria-label="Hapus" @click="$emit('delete', item)">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { FinancialReport } from '@/types/superadmin-finance'

const props = defineProps<{
  item: FinancialReport
  rowNumber: number
}>()

defineEmits<{
  (e: 'approve', item: FinancialReport): void
  (e: 'reject', item: FinancialReport): void
  (e: 'delete', item: FinancialReport): void
}>()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

const statusVariant = computed(() => {
  switch (props.item.status) {
    case 'approved': return 'success'
    case 'rejected': return 'danger'
    case 'submitted': return 'info'
    default: return 'warning'
  }
})

const statusLabel = computed(() => {
  switch (props.item.status) {
    case 'approved': return 'Disetujui'
    case 'rejected': return 'Ditolak'
    case 'submitted': return 'Disubmit'
    default: return 'Pending'
  }
})
</script>

<style scoped lang="scss">
.sa-finance-row {
  border-bottom: 1px solid $color-border-light;
  transition: background-color $transition-fast;

  &:last-child { border-bottom: none; }
  &:hover { background-color: $color-bg-subtle; }

  td {
    padding: $space-4 $space-5;
    vertical-align: middle;
    font-size: $text-sm;
  }

  &__sppg {
    font-weight: 600;
    color: $color-text-primary;
  }

  &__money {
    font-family: $font-mono;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    text-align: right;

    &--income { color: $color-success; }
    &--expense { color: $color-danger; }
  }

  &__aksi {
    white-space: nowrap;
  }
}
</style>

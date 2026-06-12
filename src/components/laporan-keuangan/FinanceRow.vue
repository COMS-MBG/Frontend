<script setup lang="ts">
import type { FinanceItem } from '@/types/finance'
import { FINANCE_CATEGORY_VARIANTS } from '@/types/finance'
import { formatRupiah, formatDate } from '@/utils/format'
import BaseBadge from '@/components/common/BaseBadge.vue'

defineProps<{
  item: FinanceItem
}>()

const statusMap: Record<string, { text: string; variant: 'success' | 'warning' }> = {
  Approved: { text: 'Disetujui', variant: 'success' },
  Pending:  { text: 'Menunggu',  variant: 'warning' },
}
</script>

<template>
  <tr class="finance-row">
    <td>{{ formatDate(item.tanggal) }}</td>
    <td>
      <BaseBadge
        :text="item.kategori"
        :variant="FINANCE_CATEGORY_VARIANTS[item.kategori]"
      />
    </td>
    <td>
      <strong>{{ item.deskripsi }}</strong>
    </td>
    <td class="td-amount">{{ formatRupiah(item.jumlah) }}</td>
    <td>
      <BaseBadge
        :text="statusMap[item.status]?.text ?? item.status"
        :variant="statusMap[item.status]?.variant ?? 'default'"
      />
    </td>
  </tr>
</template>

<style scoped lang="scss">
.finance-row {
  td {
    vertical-align: middle;

    strong {
      color: $color-text-primary;
      font-weight: 600;
    }
  }

  .td-amount {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: $color-text-primary;
    white-space: nowrap;
  }
}
</style>

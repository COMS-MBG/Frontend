<script setup lang="ts">
import type { ReportItem } from '@/types/laporan'
import BaseBadge from '@/components/common/BaseBadge.vue'

defineProps<{
  item: ReportItem
}>()

const statusMap: Record<string, { text: string; variant: 'success' | 'danger' | 'info' | 'warning' }> = {
  delivered:  { text: 'Terkirim',     variant: 'success' },
  delayed:    { text: 'Terlambat',    variant: 'danger'  },
  in_transit: { text: 'Dalam Proses', variant: 'info'    },
  cancelled:  { text: 'Dibatalkan',   variant: 'warning' },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <tr class="report-row">
    <td>
      <strong>{{ item.sekolah }}</strong>
    </td>
    <td>{{ formatDate(item.tanggal) }}</td>
    <td>
      <BaseBadge
        :text="statusMap[item.status]?.text ?? item.status"
        :variant="statusMap[item.status]?.variant ?? 'default'"
      />
    </td>
    <td>{{ item.durasi }}</td>
    <td>{{ item.keterangan }}</td>
  </tr>
</template>

<style scoped lang="scss">
.report-row {
  td {
    vertical-align: middle;

    strong {
      color: $color-text-primary;
      font-weight: 600;
    }
  }
}
</style>

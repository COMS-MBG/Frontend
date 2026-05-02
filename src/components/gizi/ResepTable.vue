<template>
  <div class="resep-table-wrap">
    <table class="resep-table">
      <thead>
        <tr>
          <th class="th-nama">NAMA MENU / RESEP</th>
          <th class="th-num">KALORI (KCAL)</th>
          <th class="th-num">PROTEIN (G)</th>
          <th class="th-num">KARBOHIDRAT (G)</th>
          <th class="th-num">LEMAK (G)</th>
          <th class="th-aksi">AKSI</th>
        </tr>
      </thead>
      <tbody>
  <template v-if="items.length > 0">
    <ResepRow
      v-for="item in items"
      :key="item.id"
      :item="item"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </template>

  <tr v-else>
    <td colspan="6" class="empty-state">
      Tidak ada data resep
    </td>
  </tr>
</tbody>
    </table>

    <div class="table-footer">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ResepRow from './ResepRow.vue'
import type { ResepItem } from '@/types/resep'

defineProps<{
  items: ResepItem[]
}>()

defineEmits<{
  (e: 'edit', item: ResepItem): void
  (e: 'delete', item: ResepItem): void
}>()
</script>

<style scoped lang="scss">
.resep-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}

.resep-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-body;

  thead {
    position: sticky;
    top: 0;
    z-index: 2;
    tr {
      background-color: $color-bg-subtle;
      border-bottom: 1px solid $color-border;
    }

    th {
      padding: $space-3 $space-5;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $color-text-muted;
      white-space: nowrap;
    }
    td{
      padding: $space-3 $space-5;
  }
}

  .th-nama {
    color: $color-text-primary;
    text-align: left;
  }

  .th-num {
    color: $color-text-primary;
    text-align: center;
  }

  .th-aksi {
    color: $color-text-primary;
    text-align: center;
    width: 100px;
  }
}

.table-footer {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border;
  background-color: $color-bg-surface;
}

.empty-state {
  text-align: center;
  padding: $space-6;
  color: $color-text-muted;
  font-size: $text-sm;
}
</style>

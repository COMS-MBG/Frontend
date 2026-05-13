<template>
  <div class="partner-table-wrap">
    <table class="partner-table">
      <thead>
        <tr>
          <th class="th-left">NAMA SEKOLAH</th>
          <th class="th-center">BENTUK</th>
          <th class="th-center">STATUS</th>
          <th class="th-left">KECAMATAN</th>
          <th class="th-left">KABUPATEN/KOTA</th>
          <th class="th-right">JUMLAH PORSI</th>
          <th class="th-aksi">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="items.length > 0">
          <PartnerRow
            v-for="item in items"
            :key="item.id"
            :item="item"
            @view="$emit('view', $event)"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
          />
        </template>

        <tr v-else>
          <td colspan="7" class="empty-state-cell">
            <BaseEmptyState
              icon="domain_disabled"
              title="Belum ada data sekolah mitra"
              description="Mulai tambahkan sekolah mitra atau import data dari file CSV."
              action-label="Tambah Partner"
              @action="$emit('add')"
            />
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
import PartnerRow from './PartnerRow.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import type { Partner } from '@/types/partner'

defineProps<{
  items: Partner[]
}>()

defineEmits<{
  (e: 'view', item: Partner): void
  (e: 'edit', item: Partner): void
  (e: 'delete', item: Partner): void
  (e: 'add'): void
}>()
</script>

<style scoped lang="scss">
.partner-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}

.partner-table {
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
      font-size: $text-xs;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $color-text-muted;
      white-space: nowrap;
    }
  }

  .th-left {
    color: $color-text-primary;
    text-align: left;
  }

  .th-center {
    color: $color-text-primary;
    text-align: center;
  }

  .th-right {
    color: $color-text-primary;
    text-align: right;
  }

  .th-aksi {
    color: $color-text-primary;
    text-align: center;
    width: 120px;
  }
}

.table-footer {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border;
  background-color: $color-bg-surface;
}

.empty-state-cell {
  padding: $space-6;
  background-color: $color-bg-surface;
}
</style>

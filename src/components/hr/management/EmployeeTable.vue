<template>
  <div class="employee-table-wrap">
    <table class="employee-table">
      <thead>
        <tr>
          <th class="th-left">NAMA KARYAWAN</th>
          <th class="th-left">NRP / NIDN</th>
          <th class="th-left">JABATAN</th>
          <th class="th-left">DEPARTEMEN</th>
          <th class="th-center">ROLE</th>
          <th class="th-center">STATUS</th>
          <th class="th-aksi">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="items.length > 0">
          <EmployeeRow
            v-for="item in items"
            :key="item.id"
            :item="item"
            :can-edit="canEdit"
            :can-delete="canDelete"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @toggle-status="$emit('toggle-status', $event)"
          />
        </template>

        <tr v-else>
          <td colspan="7" class="empty-state-cell">
            <BaseEmptyState
              icon="group_off"
              title="Belum ada data karyawan"
              description="Mulai tambahkan karyawan untuk mengelola data personalia Anda."
              action-label="Tambah Karyawan"
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
import EmployeeRow from './EmployeeRow.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import type { Employee } from '@/types/employee'

defineProps<{
  items: Employee[]
  canEdit: boolean
  canDelete: boolean
}>()

defineEmits<{
  (e: 'edit', item: Employee): void
  (e: 'delete', item: Employee): void
  (e: 'toggle-status', item: Employee): void
  (e: 'add'): void
}>()
</script>

<style scoped lang="scss">
.employee-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}

.employee-table {
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
  }

  .th-left {
    color: $color-text-primary;
    text-align: left;
  }

  .th-center {
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

.empty-state-cell {
  padding: $space-6;
  background-color: $color-bg-surface;
}
</style>

<template>
  <div class="employee-table-wrap">
    <BaseTableSkeleton
      v-if="isLoading"
      :rows="6"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <template v-else>
      <table v-if="items.length > 0" class="employee-table">
        <thead>
          <tr>
            <th class="th-left">NAMA KARYAWAN</th>
            <th class="th-left">NIK</th>
            <th class="th-left">POSISI</th>
            <th class="th-center">ROLE</th>
            <th class="th-aksi">AKSI</th>
          </tr>
        </thead>
        <tbody>
          <EmployeeRow
            v-for="item in items"
            :key="item.id"
            :item="item"
            :can-edit="canEdit"
            :can-delete="canDelete"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @assign-role="$emit('assign-role', $event)"
            @view-detail="$emit('view-detail', $event)"
          />
        </tbody>
      </table>

      <BaseEmptyState
        v-else
        icon="group_off"
        title="Belum ada data karyawan"
        description="Mulai tambahkan karyawan untuk mengelola data personalia Anda."
        :action-label="canEdit ? 'Tambah Karyawan' : undefined"
        @action="$emit('add')"
      />
    </template>

    <div v-if="items.length > 0" class="table-footer">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EmployeeRow from './EmployeeRow.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import type { Employee } from '@/types/employee'

withDefaults(defineProps<{
  items: Employee[]
  isLoading?: boolean
  canEdit: boolean
  canDelete: boolean
}>(), { isLoading: false })

defineEmits<{
  (e: 'edit', item: Employee): void
  (e: 'delete', item: Employee): void
  (e: 'assign-role', item: Employee): void
  (e: 'view-detail', item: Employee): void
  (e: 'add'): void
}>()

const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NAMA KARYAWAN', align: 'left' },
  { label: 'NIK', align: 'left' },
  { label: 'POSISI', align: 'left' },
  { label: 'ROLE', align: 'center' },
  { label: 'AKSI', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'text', width: '100px' },
  { type: 'text', width: '100px' },
  { type: 'badge' },
  { type: 'actions' },
]
</script>

<style scoped lang="scss">
.employee-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden; overflow-x: auto; scrollbar-width: thin;
}
.employee-table {
  width: 100%; border-collapse: collapse; font-family: $font-body;
  thead {
    position: sticky; top: 0; z-index: 2;
    tr { background-color: $color-bg-subtle; border-bottom: 1px solid $color-border; }
    th {
      padding: $space-3 $space-5; font-size: $text-xs; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: $color-text-muted; white-space: nowrap;
    }
  }
  .th-left { color: $color-text-primary; text-align: left; }
  .th-center { color: $color-text-primary; text-align: center; }
  .th-aksi { color: $color-text-primary; text-align: center; width: 120px; }
}
.table-footer {
  padding: $space-4 $space-5; border-top: 1px solid $color-border;
  background-color: $color-bg-surface;
}
</style>

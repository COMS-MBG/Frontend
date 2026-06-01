<template>
  <div class="base-table-wrapper">
    <table class="base-table role-table">
      <thead>
        <tr>
          <th class="th-name">NAMA ROLE</th>
          <th class="th-desc">DESKRIPSI</th>
          <th class="th-num">KARYAWAN</th>
          <th class="th-perms">HAK AKSES</th>
          <th class="th-aksi">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <RoleRow
          v-for="role in roles"
          :key="role.id"
          :role="role"
          :can-edit="canEdit"
          :can-delete="canDelete"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </tbody>
    </table>

    <div v-if="$slots.pagination" class="role-table__footer">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RoleRow from './RoleRow.vue'
import type { Role } from '@/types/access'

defineProps<{
  roles: Role[]
  canEdit: boolean
  canDelete: boolean
}>()

defineEmits<{
  (e: 'edit', role: Role): void
  (e: 'delete', role: Role): void
}>()
</script>

<style scoped lang="scss">
// Uses global: .base-table-wrapper, .base-table (_table.scss)

// ── Column widths ──
.role-table {
  table-layout: auto;

  .th-name {
    text-align: left;
    min-width: 200px;
  }
  .th-desc {
    text-align: left;
    min-width: 180px;
  }
  .th-num {
    text-align: center;
    width: 120px;
  }
  .th-perms {
    text-align: left;
    min-width: 220px;
  }
  .th-aksi {
    text-align: center;
    width: 120px;
  }
}

.role-table__footer {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border;
  background-color: $color-bg-surface;
}
</style>

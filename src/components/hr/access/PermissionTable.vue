<template>
  <div class="base-table-wrapper">
    <!-- Skeleton Loader -->
    <BaseTableSkeleton
      v-if="isLoading"
      :rows="8"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <!-- Actual Table -->
    <table v-else class="base-table">
      <thead>
        <tr>
          <th class="th-feature">FITUR</th>
          <th
            v-for="action in PERMISSION_ACTIONS"
            :key="action.key"
            class="th-action"
          >
            {{ action.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="features.length > 0">
          <PermissionRow
            v-for="row in features"
            :key="row.feature"
            :label="row.label"
            :icon="row.icon"
            :permissions="row.permissions"
            :can-edit="canEdit"
            :is-saving="isSaving"
            @toggle="(action) => $emit('toggle', row.feature, action)"
          />
        </template>

        <tr v-else>
          <td :colspan="1 + PERMISSION_ACTIONS.length" class="empty-state">
            Pilih role untuk melihat hak akses
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import PermissionRow from './PermissionRow.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import type { FeatureAccessRow, PermissionAction } from '@/types/access'
import { PERMISSION_ACTIONS } from '@/types/access'

defineProps<{
  features: FeatureAccessRow[]
  canEdit: boolean
  isSaving?: boolean
  isLoading?: boolean
}>()

defineEmits<{
  (e: 'toggle', feature: string, action: PermissionAction): void
}>()

const skeletonHeaders: SkeletonHeader[] = [
  { label: 'FITUR', align: 'left' },
  { label: 'READ', align: 'center' },
  { label: 'CREATE', align: 'center' },
  { label: 'UPDATE', align: 'center' },
  { label: 'DELETE', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'badge', align: 'center' },
  { type: 'badge', align: 'center' },
  { type: 'badge', align: 'center' },
  { type: 'badge', align: 'center' },
]
</script>

<style scoped lang="scss">
/* Extend global .base-table for permission-specific overrides only */
.base-table {
  table-layout: auto;

  .th-feature {
    text-align: left;
  }

  .th-action {
    text-align: center;
    width: 100px;
  }
}

.empty-state {
  text-align: center;
  padding: $space-6;
  color: $color-text-muted;
  font-size: $text-sm;
}
</style>
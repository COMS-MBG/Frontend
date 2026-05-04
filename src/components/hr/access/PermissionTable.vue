<template>
  <div class="base-table-wrapper">
    <table class="base-table">
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
            v-for="feature in features"
            :key="feature.id"
            :name="feature.name"
            :icon="feature.icon"
            :permissions="feature.permissions"
            :can-edit="canEdit"
            @toggle="(action) => $emit('toggle', feature.id, action)"
          />
        </template>

        <tr v-else>
          <td :colspan="1 + PERMISSION_ACTIONS.length" class="empty-state">
            Tidak ada data fitur
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import PermissionRow from './PermissionRow.vue'
import type { FeaturePermission, PermissionAction } from '@/types/access'
import { PERMISSION_ACTIONS } from '@/types/access'

interface PermissionFeatureRow {
  id: string
  name: string
  icon: string
  permissions: FeaturePermission
}

defineProps<{
  features: PermissionFeatureRow[]
  canEdit: boolean
}>()

defineEmits<{
  (e: 'toggle', featureId: string, action: PermissionAction): void
}>()
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
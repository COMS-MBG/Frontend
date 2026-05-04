<template>
  <tr class="perm-row" role="row">
    <!-- Feature Name + Icon -->
    <td class="perm-row__feature">
      <div class="perm-row__feature-inner">
        <span class="material-symbols-outlined perm-row__icon">{{ icon }}</span>
        <span class="perm-row__name">{{ name }}</span>
      </div>
    </td>

    <!-- Permission toggles (driven by PERMISSION_ACTIONS) -->
    <td
      v-for="action in PERMISSION_ACTIONS"
      :key="action.key"
      class="perm-row__toggle"
    >
      <PermissionToggle
        :model-value="permissions[action.key]"
        :disabled="!canEdit"
        :label="`${name} — ${action.label}`"
        @update:model-value="$emit('toggle', action.key)"
      />
    </td>
  </tr>
</template>

<script setup lang="ts">
import PermissionToggle from './PermissionToggle.vue'
import type { FeaturePermission, PermissionAction } from '@/types/access'
import { PERMISSION_ACTIONS } from '@/types/access'

defineProps<{
  name: string
  icon: string
  permissions: FeaturePermission
  canEdit: boolean
}>()

defineEmits<{
  (e: 'toggle', action: PermissionAction): void
}>()
</script>

<style scoped lang="scss">
.perm-row {
  // ── Feature name cell ──
  &__feature {
    min-width: 200px;
  }

  &__feature-inner {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__icon {
    font-size: 1.25rem;
    color: $color-text-muted;
  }

  &__name {
    font-size: $text-base;
    font-weight: 500;
    color: $color-text-primary;
  }

  // ── Toggle cells ──
  &__toggle {
    text-align: center;
  }
}
</style>
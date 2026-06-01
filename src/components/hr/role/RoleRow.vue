<template>
  <tr class="role-row" role="row">
    <!-- Name + Slug -->
    <td class="role-row__name-cell">
      <div class="role-row__name-group">
        <div class="role-row__avatar">
          <span class="material-symbols-outlined">shield_person</span>
        </div>
        <div class="role-row__text">
          <span class="role-row__name">{{ role.name }}</span>
          <span class="role-row__slug">{{ role.slug }}</span>
        </div>
      </div>
    </td>

    <!-- Description -->
    <td class="role-row__desc">
      {{ role.description || '—' }}
    </td>

    <!-- Employee Count Badge (uses BaseBadge) -->
    <td class="role-row__num">
      <BaseBadge
        :text="String(role.employees_count ?? 0)"
        :variant="(role.employees_count ?? 0) > 0 ? 'success' : 'default'"
      />
    </td>

    <!-- Permissions Badges (uses BaseBadge) -->
    <td class="role-row__perms">
      <div class="role-row__perm-list">
        <BaseBadge
          v-for="perm in role.permissions.slice(0, 4)"
          :key="perm.id"
          :text="perm.slug"
          variant="default"
          class="role-row__perm-badge"
        />
        <BaseBadge
          v-if="role.permissions.length > 4"
          :text="`+${role.permissions.length - 4}`"
          variant="info"
          class="role-row__perm-badge"
        />
      </div>
    </td>

    <!-- Actions (uses global .action-group + .action-btn from _shared.scss) -->
    <td class="role-row__aksi">
      <div class="action-group">
        <button
          v-if="canEdit"
          class="action-btn action-btn--edit"
          title="Edit Role"
          @click="$emit('edit', role)"
        >
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button
          v-if="canDelete"
          class="action-btn action-btn--delete"
          title="Hapus Role"
          @click="$emit('delete', role)"
        >
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { Role } from '@/types/access'

defineProps<{
  role: Role
  canEdit: boolean
  canDelete: boolean
}>()

defineEmits<{
  (e: 'edit', role: Role): void
  (e: 'delete', role: Role): void
}>()
</script>

<style scoped lang="scss">
// Uses global: .action-group, .action-btn, .action-btn--edit/--delete (_shared.scss)

.role-row {
  border-bottom: 1px solid $color-border-light;
  transition: background-color $transition-fast;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: $color-bg-subtle;
  }

  td {
    padding: $space-4 $space-5;
    vertical-align: middle;
  }
}

.role-row__name-cell {
  min-width: 200px;
}

.role-row__name-group {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.role-row__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: $color-bg-subtle;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $color-border-light;

  .material-symbols-outlined {
    font-size: 1.25rem;
    color: $color-text-faint;
  }
}

.role-row__text {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.role-row__name {
  display: block;
  font-weight: 600;
  font-size: $text-base;
  color: $color-text-primary;
}

.role-row__slug {
  display: block;
  font-size: $text-xs;
  color: $color-text-muted;
  font-family: $font-mono;
}

.role-row__desc {
  font-size: $text-base;
  font-weight: 500;
  color: $color-text-secondary;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role-row__num {
  text-align: center;
}

.role-row__perms {
  text-align: left;
}

.role-row__perm-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.role-row__perm-badge {
  font-size: $text-xs;
  white-space: nowrap;
  font-family: $font-mono;
}

.role-row__aksi {
  white-space: nowrap;
}
</style>

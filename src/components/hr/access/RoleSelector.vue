<template>
  <div class="role-selector">
    <div class="role-selector__tabs">
      <button
        v-for="role in roles"
        :key="role"
        class="role-selector__tab"
        :class="{ 'role-selector__tab--active': modelValue === role }"
        @click="$emit('update:modelValue', role)"
        :aria-pressed="modelValue === role"
      >
        <span class="material-symbols-outlined role-selector__icon">
          {{ roleIcon(role) }}
        </span>
        {{ role }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RoleKey } from '@/types/access'

defineProps<{
  modelValue: RoleKey
  roles: RoleKey[]
}>()

defineEmits<{
  (e: 'update:modelValue', role: RoleKey): void
}>()

function roleIcon(role: RoleKey): string {
  switch (role) {
    case 'Admin':    return 'admin_panel_settings'
    case 'Operator': return 'engineering'
    case 'Viewer':   return 'visibility'
    default:         return 'person'
  }
}
</script>

<style scoped lang="scss">
.role-selector {
  &__tabs {
    display: flex;
    gap: $space-2;
    flex-wrap: wrap;
  }

  &__tab {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-5;
    font-family: $font-body;
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-muted;
    background-color: $color-bg-surface;
    border: 1px solid $color-border;
    border-radius: $radius-pill;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      border-color: $color-primary;
      color: $color-primary;
      background-color: $color-primary-subtle;
    }

    &--active {
      color: $color-text-inverse;
      background-color: $color-primary;
      border-color: $color-primary;
      box-shadow: $shadow-sm;

      &:hover {
        background-color: $color-primary-dark;
        border-color: $color-primary-dark;
        color: $color-text-inverse;
      }
    }
  }

  &__icon {
    font-size: 1.15rem;
  }
}
</style>
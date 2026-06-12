<template>
  <div class="role-selector">
    <div class="role-selector__tabs">
      <button
        v-for="role in roles"
        :key="role.id"
        class="role-selector__tab"
        :class="{ 'role-selector__tab--active': modelValue === role.id }"
        @click="$emit('update:modelValue', role.id)"
        :aria-pressed="modelValue === role.id"
      >
        <span class="material-symbols-outlined role-selector__icon">
          {{ roleIcon(role.slug) }}
        </span>
        {{ role.name }}
        <span v-if="role.employees_count !== undefined" class="role-selector__count">
          {{ role.employees_count }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Role } from '@/types/access'

defineProps<{
  modelValue: number | null
  roles: Role[]
}>()

defineEmits<{
  (e: 'update:modelValue', roleId: number): void
}>()

function roleIcon(slug: string): string {
  switch (slug) {
    case 'admin-sppg':        return 'admin_panel_settings'
    case 'ahli-gizi':         return 'restaurant'
    case 'admin-logistik':    return 'local_shipping'
    default:                  return 'person'
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

  &__count {
    font-size: $text-xs;
    font-weight: 700;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 1px 6px;
    border-radius: $radius-pill;
  }
}
</style>
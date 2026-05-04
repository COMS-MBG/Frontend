<template>
  <tr class="employee-row" role="row">
    <!-- 1) Avatar + Nama -->
    <td class="employee-row__nama">
      <div class="employee-row__nama-inner">
        <div class="employee-row__thumb">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.nama"
            class="employee-row__thumb-img"
          />
          <span v-else class="material-symbols-outlined employee-row__thumb-icon">person</span>
        </div>
        <div class="employee-row__text">
          <span class="employee-row__name">{{ item.nama }}</span>
          <span class="employee-row__email">{{ item.email }}</span>
        </div>
      </div>
    </td>

    <!-- 2) NRP -->
    <td class="employee-row__left">{{ item.nrp }}</td>

    <!-- 3) Jabatan -->
    <td class="employee-row__left">{{ item.jabatan }}</td>

    <!-- 4) Departemen -->
    <td class="employee-row__left">{{ item.departemen }}</td>

    <!-- 5) Role Badge -->
    <td class="employee-row__center">
      <BaseBadge :text="item.role" :variant="roleVariant" />
    </td>

    <!-- 6) Status Toggle -->
    <td class="employee-row__center">
      <label class="status-toggle" :class="{ 'status-toggle--disabled': !canEdit }">
        <input
          type="checkbox"
          :checked="item.isActive"
          :disabled="!canEdit"
          @change="$emit('toggle-status', item)"
          aria-label="Toggle status"
        >
        <span class="status-toggle__slider"></span>
      </label>
    </td>

    <!-- 7) Aksi -->
    <td class="employee-row__aksi">
      <div class="action-group">
        <button
          v-if="canEdit"
          class="action-btn action-btn--edit"
          aria-label="Edit karyawan"
          @click="$emit('edit', item)"
        >
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button
          v-if="canDelete"
          class="action-btn action-btn--delete"
          aria-label="Hapus karyawan"
          @click="$emit('delete', item)"
        >
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { Employee } from '@/types/employee'

const props = defineProps<{
  item: Employee
  canEdit: boolean
  canDelete: boolean
}>()

defineEmits<{
  (e: 'edit', item: Employee): void
  (e: 'delete', item: Employee): void
  (e: 'toggle-status', item: Employee): void
}>()

const roleVariant = computed(() => {
  switch (props.item.role) {
    case 'Admin': return 'info'
    case 'Operator': return 'warning'
    case 'Viewer': return 'default'
    default: return 'default'
  }
})
</script>

<style scoped lang="scss">
.employee-row {
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

  // ── Nama cell ──
  &__nama {
    min-width: 220px;
  }

  &__nama-inner {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__thumb {
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
  }

  &__thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__thumb-icon {
    font-size: 1.25rem;
    color: $color-text-faint;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__name {
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__email {
    font-size: $text-xs;
    color: $color-text-muted;
  }

  // ── Left-aligned cells ──
  &__left {
    font-size: $text-base;
    font-weight: 500;
    color: $color-text-secondary;
  }

  // ── Center-aligned cells ──
  &__center {
    text-align: center;
  }

  // ── Action cell ──
  &__aksi {
    text-align: center;
  }
}

// ── Status Toggle ──
.status-toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $color-bg-muted;
    border-radius: $radius-pill;
    transition: background-color $transition-fast;

    &::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background-color: $color-text-inverse;
      border-radius: 50%;
      transition: transform $transition-fast;
      box-shadow: $shadow-xs;
    }
  }

  input:checked + &__slider {
    background-color: $color-success;
  }

  input:checked + &__slider::before {
    transform: translateX(18px);
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>

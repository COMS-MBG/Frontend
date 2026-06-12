<template>
  <tr class="employee-row" role="row">
    <!-- 1) Avatar + Name -->
    <td class="employee-row__nama">
      <div class="employee-row__nama-inner">
        <div class="employee-row__thumb">
          <img v-if="item.photo" :src="item.photo" :alt="item.name" class="employee-row__thumb-img" />
          <span v-else class="material-symbols-outlined employee-row__thumb-icon">person</span>
        </div>
        <div class="employee-row__text">
          <a class="employee-row__name employee-row__name--link" @click.prevent="$emit('view-detail', item)">{{ item.name }}</a>
          <span v-if="item.user" class="employee-row__email">{{ item.user.email }}</span>
        </div>
      </div>
    </td>

    <!-- 2) NIK -->
    <td class="employee-row__left">{{ item.nik ?? '—' }}</td>

    <!-- 3) Posisi -->
    <td class="employee-row__left">{{ positionLabel }}</td>

    <!-- 4) Role -->
    <td class="employee-row__center">
      <BaseBadge
        :text="item.role?.name ?? 'Tanpa Akses'"
        :variant="roleVariant"
      />
    </td>

    <!-- 5) Aksi -->
    <td class="employee-row__aksi">
      <div class="employee-row__action-group">
        <button
          v-if="canEdit"
          class="employee-row__action-btn employee-row__action-btn--edit"
          aria-label="Edit karyawan"
          @click="$emit('edit', item)"
        >
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button
          v-if="canEdit"
          class="employee-row__action-btn employee-row__action-btn--role"
          aria-label="Assign role"
          @click="$emit('assign-role', item)"
        >
          <span class="material-symbols-outlined">admin_panel_settings</span>
        </button>
        <button
          v-if="canDelete"
          class="employee-row__action-btn employee-row__action-btn--delete"
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

const POSITION_LABELS: Record<string, string> = {
  pemilik: 'Pemilik',
  manajer: 'Manajer',
  ahli_gizi: 'Ahli Gizi',
  admin_logistik: 'Admin Logistik',
  kurir: 'Kurir',
  karyawan_operasional: 'Karyawan Operasional',
}

const props = defineProps<{
  item: Employee
  canEdit: boolean
  canDelete: boolean
}>()

defineEmits<{
  (e: 'edit', item: Employee): void
  (e: 'delete', item: Employee): void
  (e: 'assign-role', item: Employee): void
  (e: 'view-detail', item: Employee): void
}>()

const positionLabel = computed(() => POSITION_LABELS[props.item.position] ?? props.item.position)

const roleVariant = computed(() => {
  const name = props.item.role?.name
  if (!name || name === 'Tanpa Akses') return 'default'
  if (name.includes('Admin')) return 'info'
  if (name.includes('Gizi')) return 'success'
  return 'warning'
})
</script>

<style scoped lang="scss">
.employee-row {
  border-bottom: 1px solid $color-border-light;
  transition: background-color $transition-fast;

  &:last-child { border-bottom: none; }
  &:hover { background-color: $color-bg-subtle; }

  td { padding: $space-4 $space-5; vertical-align: middle; }

  &__nama { min-width: 220px; }
  &__nama-inner { display: flex; align-items: center; gap: $space-3; }
  &__thumb {
    width: 40px; height: 40px; border-radius: 50%; overflow: hidden;
    flex-shrink: 0; background: $color-bg-subtle;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid $color-border-light;
  }
  &__thumb-img { width: 100%; height: 100%; object-fit: cover; }
  &__thumb-icon { font-size: 1.25rem; color: $color-text-faint; }
  &__text { display: flex; flex-direction: column; gap: $space-1; }
  &__name { font-size: $text-base; font-weight: 600; color: $color-text-primary; }
  &__name--link {
    color: $color-primary;
    cursor: pointer;
    text-decoration: none;
    transition: color $transition-fast;
    &:hover { color: $color-primary-dark; text-decoration: underline; }
  }
  &__email { font-size: $text-xs; color: $color-text-muted; }
  &__left { font-size: $text-base; font-weight: 500; color: $color-text-secondary; }
  &__center { text-align: center; }
  &__aksi { text-align: center; }

  &__action-group { display: flex; justify-content: center; gap: $space-2; }
  &__action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border: none; border-radius: $radius-sm;
    background: transparent; cursor: pointer; transition: all $transition-fast;
    .material-symbols-outlined { font-size: 1.15rem; }
    &--edit { color: $color-primary; &:hover { background-color: $color-primary-subtle; } }
    &--role { color: $color-warning; &:hover { background-color: $color-warning-subtle; } }
    &--delete { color: $color-danger; &:hover { background-color: rgba($color-danger, 0.08); } }
  }
}
</style>

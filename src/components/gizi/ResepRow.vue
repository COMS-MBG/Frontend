<template>
  <tr class="resep-row" role="row">
    <!-- Thumbnail + Nama + Badge -->
    <td class="resep-row__nama">
      <div class="resep-row__nama-inner">
        <div class="resep-row__thumb">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.nama"
            class="resep-row__thumb-img"
          />
          <span v-else class="material-symbols-outlined resep-row__thumb-icon">restaurant</span>
        </div>
        <div class="resep-row__text">
          <span class="resep-row__name">{{ item.nama }}</span>
          <BaseBadge :text="item.status" :variant="item.statusVariant" />
        </div>
      </div>
    </td>

    <!-- Nutrisi -->
    <td class="resep-row__num">{{ formatNumber(item.kalori) }}</td>
    <td class="resep-row__num">{{ formatNumber(item.protein) }}</td>
    <td class="resep-row__num">{{ formatNumber(item.karbohidrat) }}</td>
    <td class="resep-row__num">{{ formatNumber(item.lemak) }}</td>

    <!-- Aksi -->
    <td class="resep-row__aksi">
      <button class="action-btn action-btn--edit" @click="$emit('edit', item)" aria-label="Edit">
        <span class="material-symbols-outlined">edit</span>
      </button>
      <button class="action-btn action-btn--delete" @click="$emit('delete', item)" aria-label="Hapus">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { ResepItem } from './ResepTable.vue'

defineProps<{
  item: ResepItem
}>()

defineEmits<{
  (e: 'edit', item: ResepItem): void
  (e: 'delete', item: ResepItem): void
}>()

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}
</script>

<style scoped lang="scss">
.resep-row {
  border-bottom: 1px solid $color-border-light;
  transition: background-color $transition-fast;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: $color-bg-subtle;
  }

  td {
    padding: $space-4 $space-3;
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
    gap: 0.25rem;
  }

  &__name {
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-primary;
  }

  // ── Numeric cells ──
  &__num {
    text-align: center;
    font-size: $text-base;
    font-weight: 500;
    color: $color-text-secondary;
    font-variant-numeric: tabular-nums;
  }

  // ── Action cell ──
  &__aksi {
    text-align: center;
  }
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: $radius-sm;
  background: transparent;
  cursor: pointer;
  transition: background-color $transition-fast, color $transition-fast;

  .material-symbols-outlined {
    font-size: 1.25rem;
  }

  &--edit {
    color: $color-primary;
    &:hover { background-color: $color-primary-light; }
  }

  &--delete {
    color: $color-danger;
    &:hover { background-color: $color-danger-bg; }
  }
}
</style>

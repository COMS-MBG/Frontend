<template>
  <tr class="bahan-row" role="row">
    <!-- 1) Nama + Thumbnail -->
    <td class="bahan-row__nama">
      <div class="bahan-row__nama-inner">
        <div class="bahan-row__thumb">
          <span class="material-symbols-outlined bahan-row__thumb-icon">nutrition</span>
        </div>
        <div class="bahan-row__text">
          <span class="bahan-row__name">{{ item.name }}</span>
          <span v-if="item.description" class="bahan-row__desc">{{ item.description }}</span>
        </div>
      </div>
    </td>

    <!-- 2) Berat Acuan -->
    <td class="bahan-row__num">{{ formatDec(item.serving_weight) }} g</td>

    <!-- 3) Kalori -->
    <td class="bahan-row__num">{{ formatNum(Math.round(item.calorie)) }} kcal</td>

    <!-- 4) Protein -->
    <td class="bahan-row__num">{{ formatDec(item.protein) }} g</td>

    <!-- 5) Karbohidrat -->
    <td class="bahan-row__num">{{ formatDec(item.carbohydrate) }} g</td>

    <!-- 6) Lemak -->
    <td class="bahan-row__num">{{ formatDec(item.fat) }} g</td>

    <!-- 7) Aksi -->
    <td class="bahan-row__aksi">
      <div class="action-group">
        <button
          class="action-btn action-btn--view"
          aria-label="Lihat detail bahan"
          @click="$emit('view-detail', item)"
        >
          <span class="material-symbols-outlined">visibility</span>
        </button>
        <button
          v-if="canEdit"
          class="action-btn action-btn--edit"
          aria-label="Edit bahan"
          @click="$emit('edit', item)"
        >
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button
          v-if="canDelete"
          class="action-btn action-btn--delete"
          aria-label="Hapus bahan"
          @click="$emit('delete', item)"
        >
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Ingredient } from '@/types/ingredient'
import { formatNum, formatDec } from '@/utils/format'

defineProps<{
  item: Ingredient
  canEdit: boolean
  canDelete: boolean
}>()

defineEmits<{
  (e: 'edit', item: Ingredient): void
  (e: 'delete', item: Ingredient): void
  (e: 'view-detail', item: Ingredient): void
}>()
</script>

<style scoped lang="scss">
.bahan-row {
  border-bottom: 1px solid $color-border-light;
  transition: background-color $transition-fast;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: $color-bg-subtle;
  }

  td {
    padding: $space-5 $space-4;
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
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: $color-bg-subtle;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $color-border-light;
  }

  &__thumb-icon {
    font-size: $text-xl;
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

  &__desc {
    font-size: $text-xs;
    color: $color-text-muted;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // ── Center-aligned cells ──
  &__center {
    text-align: center;
  }

  // ── Numeric cells ──
  &__num {
    text-align: center;
    font-size: $text-base;
    font-weight: 500;
    color: $color-text-secondary;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  // ── Action cell ──
  &__aksi {
    white-space: nowrap;
  }
}
</style>

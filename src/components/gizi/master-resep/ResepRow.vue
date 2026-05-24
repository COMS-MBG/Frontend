<template>
  <tr class="resep-row" role="row">
    <!-- 1) Nama + Description -->
    <td class="resep-row__nama">
      <div class="resep-row__nama-inner">
        <div class="resep-row__thumb">
          <span class="material-symbols-outlined resep-row__thumb-icon">restaurant</span>
        </div>
        <div class="resep-row__text">
          <span class="resep-row__name">{{ item.name }}</span>
          <span v-if="item.description" class="resep-row__desc">{{ item.description }}</span>
          <span v-else class="resep-row__ingredients-count">
            {{ item.ingredients?.length ?? 0 }} bahan
          </span>
        </div>
      </div>
    </td>

    <!-- 2) Total Berat -->
    <td class="resep-row__num">{{ formatDec(item.totals.weight) }} g</td>

    <!-- 3) Total Kalori -->
    <td class="resep-row__num">{{ formatNum(Math.round(item.totals.calorie)) }} kcal</td>

    <!-- 4) Total Protein -->
    <td class="resep-row__num">{{ formatDec(item.totals.protein) }} g</td>

    <!-- 5) Total Karbohidrat -->
    <td class="resep-row__num">{{ formatDec(item.totals.carbohydrate) }} g</td>

    <!-- 6) Total Lemak -->
    <td class="resep-row__num">{{ formatDec(item.totals.fat) }} g</td>

    <!-- 7) Aksi -->
    <td class="resep-row__aksi">
      <div class="action-group">
        <button
          class="action-btn action-btn--view"
          aria-label="Lihat detail resep"
          @click="$emit('view-detail', item)"
        >
          <span class="material-symbols-outlined">visibility</span>
        </button>
        <button
          v-if="canEdit"
          class="action-btn action-btn--edit"
          aria-label="Edit resep"
          @click="$emit('edit', item)"
        >
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button
          v-if="canDelete"
          class="action-btn action-btn--delete"
          aria-label="Hapus resep"
          @click="$emit('delete', item)"
        >
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Recipe } from '@/types/recipe'
import { formatNum, formatDec } from '@/utils/format'

defineProps<{
  item: Recipe
  canEdit: boolean
  canDelete: boolean
}>()

defineEmits<{
  (e: 'edit', item: Recipe): void
  (e: 'delete', item: Recipe): void
  (e: 'view-detail', item: Recipe): void
}>()
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

  &__ingredients-count {
    font-size: $text-xs;
    color: $color-text-faint;
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

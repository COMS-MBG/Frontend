<template>
  <tr class="bahan-row" role="row">
    <!-- 1) Nama + Thumbnail -->
    <td class="bahan-row__nama">
      <div class="bahan-row__nama-inner">
        <div class="bahan-row__thumb">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.nama"
            class="bahan-row__thumb-img"
          />
          <span v-else class="material-symbols-outlined bahan-row__thumb-icon">nutrition</span>
        </div>
        <div class="bahan-row__text">
          <span class="bahan-row__name">{{ item.nama }}</span>
        </div>
      </div>
    </td>

    <!-- 2) Satuan Badge -->
    <td class="bahan-row__center">
      <BaseBadge :text="item.satuan.toUpperCase()" :variant="getSatuanVariant(item.satuan)" />
    </td>

    <!-- 3) Kalori -->
    <td class="bahan-row__num">{{ formatNum(item.kalori) }} kcal</td>

    <!-- 4) Protein -->
    <td class="bahan-row__num">{{ formatDec(item.protein) }} g</td>

    <!-- 5) Karbohidrat -->
    <td class="bahan-row__num">{{ formatDec(item.karbohidrat) }} g</td>

    <!-- 6) Lemak -->
    <td class="bahan-row__num">{{ formatDec(item.lemak) }} g</td>

    <!-- 7) Status -->
    <td class="bahan-row__center">
      <BaseBadge
        :text="item.status === 'aktif' ? 'Aktif' : 'Nonaktif'"
        :variant="item.status === 'aktif' ? 'success' : 'danger'"
      />
    </td>

    <!-- 8) Aksi -->
    <td class="bahan-row__aksi">
      <div class="action-group">
        <button
          class="action-btn action-btn--edit"
          aria-label="Edit bahan"
          @click="$emit('edit', item)"
        >
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button
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
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { BahanItem } from '@/types/gizi'
import { formatNum, formatDec } from '@/utils/format'

defineProps<{
  item: BahanItem
}>()

defineEmits<{
  (e: 'edit', item: BahanItem): void
  (e: 'delete', item: BahanItem): void
}>()

const getSatuanVariant = (satuan: string) => {
  switch (satuan.toLowerCase()) {
    case 'kg': return 'info'
    case 'liter': return 'success'
    case 'pcs': return 'warning'
    default: return 'default'
  }
}
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

  &__thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

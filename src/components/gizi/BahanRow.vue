<template>
  <tr class="bahan-row" role="row">
    <!-- 1) Nama + Thumbnail + Kategori -->
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
          <span class="bahan-row__kategori">{{ kategoriLabel }}</span>
        </div>
      </div>
    </td>

    <!-- 2) Satuan Badge -->
    <td class="bahan-row__center">
      <BaseBadge :text="item.satuan.toUpperCase()" variant="default" />
    </td>

    <!-- 3) Stok -->
    <td class="bahan-row__center">
      <span class="bahan-row__stok" :class="stokClass">
        {{ item.stok }} {{ item.satuan }}
      </span>
    </td>

    <!-- 4) Kalori -->
    <td class="bahan-row__num">{{ formatNum(item.kalori) }} kcal</td>

    <!-- 5) Protein -->
    <td class="bahan-row__num">{{ formatDec(item.protein) }} g</td>

    <!-- 6) Karbohidrat -->
    <td class="bahan-row__num">{{ formatDec(item.karbohidrat) }} g</td>

    <!-- 7) Lemak -->
    <td class="bahan-row__num">{{ formatDec(item.lemak) }} g</td>

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
import { computed } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { BahanItem, BahanKategori } from '@/types/gizi'

const props = defineProps<{
  item: BahanItem
}>()

defineEmits<{
  (e: 'edit', item: BahanItem): void
  (e: 'delete', item: BahanItem): void
}>()

const kategoriMap: Record<BahanKategori, string> = {
  protein: 'Protein',
  karbo: 'Karbohidrat',
  lemak: 'Lemak',
  serat: 'Serat',
  lainnya: 'Lainnya',
}

const kategoriLabel = computed(() => kategoriMap[props.item.kategori])

const stokClass = computed(() => {
  if (props.item.stok === 0) return 'stok--danger'
  if (props.item.stok <= 5) return 'stok--warning'
  return ''
})

function formatNum(val: number): string {
  return val.toLocaleString('id-ID')
}

function formatDec(val: number): string {
  return val.toFixed(1)
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
    padding: $space-5 $space-4; // Increased padding for less cramped rows
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
    width: 44px; // Slightly larger thumbnail for spacious row
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
    font-size: 1.25rem;
    color: $color-text-faint;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  &__name {
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__kategori {
    font-size: $text-xs;
    color: $color-text-muted;
    text-transform: capitalize;
  }

  // ── Center-aligned cells ──
  &__center {
    text-align: center;
  }

  // ── Stok ──
  &__stok {
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-secondary;
    font-variant-numeric: tabular-nums;
  }

  // ── Numeric cells ──
  &__num {
    text-align: center; // Changed from right to center
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

// ── Stok color variants ──
.stok--warning {
  color: $color-warning;
}

.stok--danger {
  color: $color-danger;
  font-weight: 700;
}

// ── Action buttons ──
.action-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2; // Add gap between buttons for better layout
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid transparent; // Add transparent border to match size properly
  border-radius: $radius-md; // Make it slightly more rounded square instead of small radius
  background: transparent;
  cursor: pointer;
  transition: all $transition-fast;

  .material-symbols-outlined {
    font-size: 1.15rem; // Slightly smaller icon to fit nicely
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }

  &--edit {
    color: $color-primary;
    background-color: $color-primary-subtle; // Add subtle background by default
    &:hover { 
      background-color: $color-primary; 
      color: $color-text-inverse;
      box-shadow: $shadow-sm;
      transform: translateY(-1px);
    }
  }

  &--delete {
    color: $color-danger;
    background-color: $color-danger-bg; // Add subtle background by default
    &:hover { 
      background-color: $color-danger; 
      color: $color-text-inverse;
      box-shadow: $shadow-sm;
      transform: translateY(-1px);
    }
  }
}
</style>

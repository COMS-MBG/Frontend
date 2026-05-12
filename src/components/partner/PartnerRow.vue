<template>
  <tr class="partner-row" role="row">
    <!-- 1) Nama Sekolah -->
    <td class="partner-row__nama">
      <div class="partner-row__nama-inner">
        <div class="partner-row__thumb">
          <span class="material-symbols-outlined partner-row__thumb-icon">school</span>
        </div>
        <div class="partner-row__text">
          <span class="partner-row__name">{{ item.nama_sekolah }}</span>
          <span class="partner-row__alamat">{{ item.alamat || '—' }}</span>
        </div>
      </div>
    </td>

    <!-- 2) Bentuk -->
    <td class="partner-row__center">
      <BaseBadge :text="item.bentuk" :variant="bentukVariant" />
    </td>

    <!-- 3) Status -->
    <td class="partner-row__center">
      <BaseBadge :text="item.status" :variant="statusVariant" />
    </td>

    <!-- 4) Kecamatan -->
    <td class="partner-row__left">{{ item.kecamatan || '—' }}</td>

    <!-- 5) Kabupaten/Kota -->
    <td class="partner-row__left">{{ item.kabupaten_kota || '—' }}</td>

    <!-- 6) Jumlah Porsi -->
    <td class="partner-row__right partner-row__porsi">
      {{ formatNumber(item.jumlah_porsi) }}
    </td>

    <!-- 7) Aksi -->
    <td class="partner-row__aksi">
      <div class="action-group">
        <button
          class="action-btn action-btn--view"
          aria-label="Lihat detail"
          @click="$emit('view', item)"
        >
          <span class="material-symbols-outlined">visibility</span>
        </button>
        <button
          class="action-btn action-btn--edit"
          aria-label="Edit partner"
          @click="$emit('edit', item)"
        >
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button
          class="action-btn action-btn--delete"
          aria-label="Hapus partner"
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
import type { Partner } from '@/types/partner'

const props = defineProps<{
  item: Partner
}>()

defineEmits<{
  (e: 'view', item: Partner): void
  (e: 'edit', item: Partner): void
  (e: 'delete', item: Partner): void
}>()

const bentukVariant = computed(() => {
  switch (props.item.bentuk) {
    case 'SMA': return 'info'
    case 'SMK': return 'warning'
    case 'MA':
    case 'MAK': return 'success'
    default: return 'default'
  }
})

const statusVariant = computed(() => {
  return props.item.status === 'Negeri' ? 'success' : 'default'
})

function formatNumber(val: number): string {
  return val.toLocaleString('id-ID')
}
</script>

<style scoped lang="scss">
.partner-row {
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
    min-width: 260px;
  }

  &__nama-inner {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__thumb {
    width: 40px;
    height: 40px;
    border-radius: $radius-md;
    overflow: hidden;
    flex-shrink: 0;
    background: $color-primary-subtle;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__thumb-icon {
    font-size: 1.25rem;
    color: $color-primary;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    min-width: 0;
  }

  &__name {
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__alamat {
    font-size: $text-xs;
    color: $color-text-muted;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
  }

  // ── Alignment classes ──
  &__left {
    font-size: $text-base;
    font-weight: 500;
    color: $color-text-secondary;
  }

  &__center {
    text-align: center;
  }

  &__right {
    text-align: right;
  }

  &__porsi {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: $color-text-primary;
  }

  &__aksi {
    text-align: center;
  }
}

// ── Action buttons ──
.action-group {
  display: flex;
  justify-content: center;
  gap: $space-1;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: $radius-sm;
  background: transparent;
  cursor: pointer;
  transition: all $transition-fast;

  .material-symbols-outlined {
    font-size: 1.15rem;
  }

  &--view {
    color: $color-primary;
    &:hover { background: $color-primary-subtle; }
  }

  &--edit {
    color: $color-warning;
    &:hover { background: $color-warning-subtle; }
  }

  &--delete {
    color: $color-danger;
    &:hover { background: rgba($color-danger, 0.1); }
  }
}
</style>

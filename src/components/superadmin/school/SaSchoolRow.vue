<template>
  <tr class="sa-school-row" role="row">
    <td class="sa-school-row__center">{{ rowNumber }}</td>
    <td class="sa-school-row__nama">
      <div class="sa-school-row__nama-inner">
        <div class="sa-school-row__thumb">
          <span class="material-symbols-outlined sa-school-row__thumb-icon">school</span>
        </div>
        <div class="sa-school-row__text">
          <span class="sa-school-row__name">{{ item.school_name }}</span>
          <span v-if="item.address" class="sa-school-row__desc">{{ item.address }}</span>
        </div>
      </div>
    </td>
    <td>{{ item.npsn ?? '-' }}</td>
    <td>{{ item.school_type }}</td>
    <td>{{ item.city || '-' }}</td>
    <td class="sa-school-row__num">{{ item.portion_count.toLocaleString('id-ID') }}</td>
    <td class="sa-school-row__center">
      <BaseBadge :variant="item.is_mapped ? 'success' : 'default'">
        {{ item.is_mapped ? 'Ya' : 'Belum' }}
      </BaseBadge>
    </td>
    <td class="sa-school-row__aksi">
      <div class="action-group">
        <button class="action-btn action-btn--edit" aria-label="Edit" @click="$emit('edit', item)">
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button class="action-btn action-btn--delete" aria-label="Hapus" @click="$emit('delete', item)">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { SchoolItem } from '@/types/superadmin-school'

defineProps<{
  item: SchoolItem
  rowNumber: number
}>()

defineEmits<{
  (e: 'edit', item: SchoolItem): void
  (e: 'delete', item: SchoolItem): void
}>()
</script>

<style scoped lang="scss">
.sa-school-row {
  border-bottom: 1px solid $color-border-light;
  transition: background-color $transition-fast;

  &:last-child { border-bottom: none; }
  &:hover { background-color: $color-bg-subtle; }

  td {
    padding: $space-5 $space-4;
    vertical-align: middle;
    font-size: $text-sm;
    color: $color-text-secondary;
  }

  // ── Nama cell ──
  &__nama {
    min-width: 240px;
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
    font-size: $text-sm;
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

  &__center {
    text-align: center;
  }

  &__num {
    text-align: center;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  &__aksi {
    white-space: nowrap;
  }
}
</style>

<template>
  <tr class="sa-sppg-row" role="row">
    <td class="sa-sppg-row__center">{{ rowNumber }}</td>
    <td class="sa-sppg-row__nama">
      <div class="sa-sppg-row__nama-inner">
        <div class="sa-sppg-row__thumb">
          <span class="material-symbols-outlined sa-sppg-row__thumb-icon">domain</span>
        </div>
        <div class="sa-sppg-row__text">
          <RouterLink :to="{ name: 'super-admin-sppg-detail', params: { id: item.id } }" class="sa-sppg-row__link-wrap">
            <span class="sa-sppg-row__name">{{ item.name }}</span>
          </RouterLink>
          <span v-if="item.address" class="sa-sppg-row__desc">{{ item.address }}</span>
        </div>
      </div>
    </td>
    <td>{{ item.region?.city || item.city || '—' }}</td>
    <td class="sa-sppg-row__num">{{ item.capacity.toLocaleString('id-ID') }}</td>
    <td class="sa-sppg-row__center">
      <BaseBadge
        :variant="item.status === 'active' ? 'success' : item.status === 'inactive' ? 'danger' : 'warning'"
      >
        {{ item.status === 'active' ? 'Aktif' : item.status === 'inactive' ? 'Nonaktif' : 'Pending' }}
      </BaseBadge>
    </td>
    <td>{{ new Date(item.created_at).toLocaleDateString('id-ID') }}</td>
    <td class="sa-sppg-row__aksi">
      <div class="action-group">
        <button class="action-btn action-btn--edit" aria-label="Edit" @click="$emit('edit', item)">
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button
          v-if="item.status !== 'active'"
          class="action-btn action-btn--success"
          aria-label="Aktifkan"
          @click="$emit('activate', item)"
        >
          <span class="material-symbols-outlined">check_circle</span>
        </button>
        <button
          v-if="item.status === 'active'"
          class="action-btn action-btn--warning"
          aria-label="Nonaktifkan"
          @click="$emit('deactivate', item)"
        >
          <span class="material-symbols-outlined">block</span>
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
import type { SppgItem } from '@/types/superadmin-sppg'

defineProps<{
  item: SppgItem
  rowNumber: number
}>()

defineEmits<{
  (e: 'edit', item: SppgItem): void
  (e: 'delete', item: SppgItem): void
  (e: 'activate', item: SppgItem): void
  (e: 'deactivate', item: SppgItem): void
}>()
</script>

<style scoped lang="scss">
.sa-sppg-row {
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
    color: $color-primary;
    transition: color $transition-fast;
  }

  &__link-wrap {
    text-decoration: none;
    display: inline-flex;

    &:hover {
      .sa-sppg-row__name {
        color: $color-primary-dark;
        text-decoration: underline;
      }
    }
  }

  &__desc {
    font-size: $text-xs;
    color: $color-text-muted;
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // ── Center cell ──
  &__center {
    text-align: center;
  }

  // ── Numeric cell ──
  &__num {
    text-align: center;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  // ── Action cell ──
  &__aksi {
    white-space: nowrap;
  }
}
</style>

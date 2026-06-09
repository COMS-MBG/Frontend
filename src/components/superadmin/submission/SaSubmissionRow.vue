<template>
  <tr class="sa-submission-row" role="row">
    <td class="sa-submission-row__center">{{ rowNumber }}</td>
    <td class="sa-submission-row__nama">
      <div class="sa-submission-row__nama-inner">
        <div class="sa-submission-row__thumb">
          <span class="material-symbols-outlined sa-submission-row__thumb-icon">assignment</span>
        </div>
        <div class="sa-submission-row__text">
          <span class="sa-submission-row__number">{{ item.submission_number }}</span>
          <span class="sa-submission-row__desc">{{ item.partners?.length ?? 0 }} Sekolah Mitra</span>
        </div>
      </div>
    </td>
    <td>{{ item.source }}</td>
    <td class="sa-submission-row__center">
      <BaseBadge :variant="item.status === 'registered' ? 'success' : 'warning'">
        {{ item.status === 'registered' ? 'Terdaftar' : 'Draft' }}
      </BaseBadge>
    </td>
    <td class="sa-submission-row__center">
      <BaseBadge :variant="item.map_confirmed ? 'success' : 'default'">
        {{ item.map_confirmed ? 'Ya' : 'Belum' }}
      </BaseBadge>
    </td>
    <td>{{ new Date(item.created_at).toLocaleDateString('id-ID') }}</td>
    <td class="sa-submission-row__aksi">
      <div class="action-group">
        <button
          v-if="item.status === 'draft'"
          class="action-btn action-btn--success"
          aria-label="Finalisasi"
          @click="$emit('submit', item)"
        >
          <span class="material-symbols-outlined">send</span>
        </button>
        <button
          v-if="item.status === 'draft'"
          class="action-btn action-btn--delete"
          aria-label="Hapus"
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
import type { SppgDraft } from '@/types/superadmin-submission'

defineProps<{
  item: SppgDraft
  rowNumber: number
}>()

defineEmits<{
  (e: 'submit', item: SppgDraft): void
  (e: 'delete', item: SppgDraft): void
}>()
</script>

<style scoped lang="scss">
.sa-submission-row {
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

  &__number {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-primary;
    font-family: $font-mono;
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

  &__aksi {
    white-space: nowrap;
  }
}
</style>

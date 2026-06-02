<script setup lang="ts">
import type { DistributionItem } from '@/types/distribution'
import DistributionStatusBadge from './DistributionStatusBadge.vue'
import DistributionActionButton from './DistributionActionButton.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import { formatDateTime } from '@/utils/format'

defineProps<{
  item: DistributionItem
}>()

const emit = defineEmits<{
  (e: 'submit', id: number): void
  (e: 'confirm', id: number): void
  (e: 'revision', id: number): void
  (e: 'view-detail', id: number): void
}>()
</script>

<template>
  <tr class="distribution-row">
    <td>
      <div class="distribution-row__school">
        <button
          class="distribution-row__school-btn"
          type="button"
          @click="emit('view-detail', item.id)"
          :title="`Lihat detail ${item.sekolah}`"
        >
          {{ item.sekolah }}
        </button>
        <small v-if="item.alamat">{{ item.alamat }}</small>
      </div>
    </td>
    <td>
      <div class="distribution-row__kurir">
        <UserAvatar :name="item.kurir" size="sm" />
        <p>{{ item.kurir }}</p>
      </div>
    </td>
    <td>{{ item.kendaraan }}</td>
    <td>{{ item.scheduledAt ? formatDateTime(item.scheduledAt) : '—' }}</td>
    <td>
      <DistributionStatusBadge :status="item.status" />
    </td>
    <td>
      <DistributionActionButton
        :id="item.id"
        :status="item.status"
        @submit="emit('submit', $event)"
        @confirm="emit('confirm', $event)"
        @revision="emit('revision', $event)"
      />
    </td>
  </tr>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.distribution-row {
  td { vertical-align: middle; }

  &__school {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;
  }

  &__school-btn {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font-weight: 700;
    color: $color-primary;
    font-family: $font-body;
    font-size: $text-base;
    text-align: left;
    cursor: pointer;
    line-height: 1.4;

    &:hover {
      text-decoration: underline;
      color: $color-primary-dark;
    }
  }

  &__kurir {
    display: flex;
    align-items: center;
    gap: $space-3;

    p {
      margin: 0;
      font-weight: 500;
      color: $color-text-primary;
    }
  }
}
</style>

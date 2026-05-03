<script setup lang="ts">
import type { DistributionItem } from '@/types/distribution'
import DistributionStatusBadge from './DistributionStatusBadge.vue'
import DistributionActionButton from './DistributionActionButton.vue'

defineProps<{
  item: DistributionItem
}>()
</script>

<template>
  <tr class="distribution-row">
    <td>
      <strong>{{ item.sekolah }}</strong>
    </td>
    <td>{{ item.porsi }} Porsi</td>
    <td>{{ item.jarakKm }} km</td>
    <td>
      <div class="distribution-row__kurir">
        <span class="avatar">👤</span>
        <div>
          <p>{{ item.kurir }}</p>
          <small>({{ item.kendaraan }})</small>
        </div>
      </div>
    </td>
    <td>
      <DistributionStatusBadge :status="item.status" />
    </td>
    <td>
      <DistributionActionButton :id="item.id" :status="item.status" />
    </td>
  </tr>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.distribution-row {
  td { vertical-align: middle; }

  &__kurir {
    display: flex;
    align-items: center;
    gap: 12px;

    .avatar {
      width: 32px;
      height: 32px;
      background: $color-bg-subtle;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    p {
      margin: 0;
      font-weight: 500;
      color: $color-text-primary;
    }

    small {
      color: $color-text-muted;
    }
  }
}
</style>

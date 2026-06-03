<script setup lang="ts">
import type { DeliveryHistory } from '@/types/deliveryHistory'
import UserAvatar from '@/components/common/UserAvatar.vue'
import {
  formatDeliveryDate,
  formatDeliveryTime,
  formatDuration,
  formatDistance,
  formatVehicleType
} from '@/utils/deliveryHistory'

defineProps<{
  history: DeliveryHistory
}>()

const emit = defineEmits<{
  (e: 'view-detail', history: DeliveryHistory): void
}>()
</script>

<template>
  <tr class="delivery-history-row">
    <td>
      <div class="delivery-history-row__date">
        <span class="date-text">{{ formatDeliveryDate(history.confirmed_at) }}</span>
        <small class="time-text">{{ formatDeliveryTime(history.confirmed_at) }}</small>
      </div>
    </td>
    <td>
      <div class="delivery-history-row__courier">
        <UserAvatar :name="history.courier_name" size="sm" />
        <span class="courier-name">{{ history.courier_name }}</span>
      </div>
    </td>
    <td>
      <div class="delivery-history-row__school">
        <span class="school-name">{{ history.school_name }}</span>
        <small class="school-address" :title="history.school_address">{{ history.school_address }}</small>
      </div>
    </td>
    <td>
      <div class="delivery-history-row__vehicle">
        <span class="vehicle-label">{{ formatVehicleType(history.vehicle_type) }}</span>
        <small class="vehicle-plate" v-if="history.vehicle_plate">{{ history.vehicle_plate }}</small>
      </div>
    </td>
    <td>
      <span class="duration-badge">{{ formatDuration(history.duration_minutes) }}</span>
    </td>
    <td>
      <span class="distance-badge">{{ formatDistance(history.distance_km) }}</span>
    </td>
    <td>
      <button
        class="btn-detail-trigger"
        type="button"
        @click="emit('view-detail', history)"
        :aria-label="`Lihat detail pengiriman ke ${history.school_name}`"
      >
        <span class="material-symbols-outlined icon">visibility</span>
        <span>Detail</span>
      </button>
    </td>
  </tr>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.delivery-history-row {
  td {
    vertical-align: middle;
  }

  &__date {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;

    .date-text {
      font-weight: 600;
      color: $color-text-primary;
      font-size: $text-sm;
    }

    .time-text {
      color: $color-text-muted;
      font-size: $text-xs;
    }
  }

  &__courier {
    display: flex;
    align-items: center;
    gap: $space-3;

    .courier-name {
      font-weight: 500;
      color: $color-text-primary;
      font-size: $text-sm;
    }
  }

  &__school {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;

    .school-name {
      font-weight: 600;
      color: $color-text-primary;
      font-size: $text-sm;
    }

    .school-address {
      color: $color-text-muted;
      font-size: $text-xs;
      max-width: 280px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__vehicle {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;

    .vehicle-label {
      font-weight: 500;
      color: $color-text-primary;
      font-size: $text-sm;
    }

    .vehicle-plate {
      color: $color-text-muted;
      font-family: monospace;
      font-size: $text-xs;
    }
  }

  .duration-badge, .distance-badge {
    font-size: $text-sm;
    color: $color-text-primary;
    font-weight: 500;
  }
}

.btn-detail-trigger {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  background: transparent;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: 0.375rem $space-3;
  font-size: $text-sm;
  font-weight: 600;
  color: $color-text-secondary;
  cursor: pointer;
  transition: all $transition-fast;

  .icon {
    font-size: 1.1rem;
    color: $color-text-muted;
  }

  &:hover {
    background-color: $color-bg-subtle;
    border-color: $color-primary-subtle;
    color: $color-primary;

    .icon {
      color: $color-primary;
    }
  }
}
</style>

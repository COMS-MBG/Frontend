<template>
  <div class="logistics-card">

    <!-- Header -->
    <div class="logistics-card__header">
      <div>
        <p class="logistics-card__label">{{ sectionLabel }}</p>
        <h2 class="logistics-card__title">{{ title }}</h2>
      </div>
      <span class="material-symbols-outlined logistics-card__icon">{{ icon }}</span>
    </div>

    <!-- Stats: Pending / Jalan / Selesai -->
    <div class="logistics-card__stats">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stat-item"
      >
        <span class="stat-item__value">{{ stat.value }}</span>
        <span class="stat-item__label">{{ stat.label }}</span>
      </div>
    </div>

    <!-- Action Button -->
    <button class="btn-outline" @click="$emit('action')">
      {{ actionLabel }}
    </button>

  </div>
</template>

<script setup lang="ts">
export interface DeliveryStatItem {
  value: number | string
  label: string
}

defineProps<{
  sectionLabel?: string
  title?: string
  icon?: string
  stats?: DeliveryStatItem[]
  actionLabel?: string
}>()

defineEmits<{ (e: 'action'): void }>()
</script>

<style scoped lang="scss">
.logistics-card {
  background: $color-primary;
  border-radius: $radius-xl;
  border: 1px solid $color-primary;
  box-shadow: $shadow-primary;
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-5;
  font-family: $font-body;
  height: 100%;
  box-sizing: border-box;

  // ── Header ──
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__label {
    @include label-uppercase(0.7rem, rgba(255, 255, 255, 0.65));
    margin: 0 0 0.25rem 0;
  }

  &__title {
    font-size: $text-xl;
    font-weight: 700;
    color: $color-text-inverse;
    margin: 0;
  }

  &__icon {
    font-size: 1.75rem;
    color: rgba(255, 255, 255, 0.55);
  }

  // ── Stats row ──
  &__stats {
    display: flex;
    justify-content: space-around;
    gap: $space-2;
    flex: 1;
    align-items: center;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;

  &__value {
    font-size: $text-hero;
    font-weight: 800;
    color: $color-text-inverse;
    line-height: 1;
  }

  &__label {
    @include label-uppercase(0.65rem, rgba(255, 255, 255, 0.6));
  }
}

// ── Button ──
.btn-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.65rem $space-5;
  border-radius: $radius-md;
  font-size: $text-base;
  font-weight: 600;
  font-family: $font-body;
  cursor: pointer;
  background: transparent;
  color: $color-text-inverse;
  border: 2px solid rgba(255, 255, 255, 0.55);
  transition: background $transition-fast, transform 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }
}
</style>

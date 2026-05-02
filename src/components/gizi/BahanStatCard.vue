<template>
  <div class="bahan-stat-card" role="group" aria-label="Total Katalog">
    <div class="bahan-stat-card__icon-circle">
      <span class="material-symbols-outlined">inventory_2</span>
    </div>
    <div class="bahan-stat-card__info">
      <span class="bahan-stat-card__label">TOTAL KATALOG</span>
      <div class="bahan-stat-card__value">{{ total }} <span class="bahan-stat-card__unit">Bahan</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  total: number
}>()
</script>

<style scoped lang="scss">
.bahan-stat-card {
  @include card-base($radius-lg, $shadow-xs);
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-5 $space-6;
  border-left: 4px solid $color-primary;
  font-family: $font-body;
  transition: box-shadow $transition-base, transform $transition-base;

  &:hover {
    box-shadow: 0 4px 16px $color-primary-muted;
    transform: translateY(-2px);
  }

  &__icon-circle {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: $radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background-color: $color-primary-subtle;

    .material-symbols-outlined {
      font-size: 1.35rem;
      color: $color-primary;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  &__label {
    @include label-uppercase;
  }

  &__value {
    font-size: $text-hero;
    font-weight: 800;
    color: $color-text-primary;
    line-height: 1.1;
  }

  &__unit {
    font-size: $text-base;
    font-weight: 500;
    color: $color-text-muted;
  }
}
</style>

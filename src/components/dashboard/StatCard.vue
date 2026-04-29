<template>
  <div class="stat-card">
    <div class="stat-card__top">
      <span class="stat-card__label">{{ label }}</span>
      <span class="material-symbols-outlined stat-card__icon">{{ icon }}</span>
    </div>
    <div class="stat-card__value">{{ value }}</div>
    <div class="stat-card__sub">{{ subtitle }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  icon: string
  value: string | number
  subtitle: string
}>()
</script>

<style scoped lang="scss">
.stat-card {
  @include card-base($radius-lg, $shadow-xs);
  padding: $space-5 $space-6;
  border-left: 4px solid $color-primary;
  font-family: $font-body;
  transition: box-shadow $transition-base, transform $transition-base;

  &:hover {
    box-shadow: 0 4px 16px $color-primary-muted;
    transform: translateY(-2px);
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $space-2;
  }

  &__label {
    @include label-uppercase;
  }

  &__icon {
    font-size: 1.5rem;
    color: $color-text-faint;
  }

  &__value {
    font-size: $text-hero;
    font-weight: 800;
    color: $color-text-primary;
    line-height: 1.1;
    margin-bottom: $space-1;
  }

  &__sub {
    font-size: 0.8rem;
    color: $color-text-muted;
  }
}
</style>

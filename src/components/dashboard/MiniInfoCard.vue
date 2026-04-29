<template>
  <div class="mini-info-card" :class="{ 'mini-info-card--warning': variant === 'warning' }">

    <!-- Icon -->
    <div class="mini-info-card__icon-wrap">
      <span
        class="material-symbols-outlined mini-info-card__icon"
        :class="{ 'mini-info-card__icon--red': variant === 'warning' }"
      >{{ icon }}</span>
    </div>

    <!-- Label -->
    <p class="mini-info-card__label">{{ label }}</p>

    <!-- Value + Unit -->
    <div class="mini-info-card__value-row">
      <span
        class="mini-info-card__value"
        :class="{ 'mini-info-card__value--red': variant === 'warning' }"
      >{{ value }}</span>
      <span class="mini-info-card__unit">{{ unit }}</span>
    </div>

    <!-- Optional footer: badge (success) or deadline text (warning) -->
    <div v-if="variant === 'success' && badgeText" class="mini-info-card__badge">
      <span class="material-symbols-outlined mini-info-card__badge-icon">check_circle</span>
      {{ badgeText }}
    </div>

    <p v-if="variant === 'warning' && deadlineText" class="mini-info-card__deadline">
      {{ deadlineText }}
    </p>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string | number
  unit: string
  variant?: 'default' | 'success' | 'warning'
  badgeText?: string
  deadlineText?: string
}>()
</script>

<style scoped lang="scss">
.mini-info-card {
  @include card-base;
  padding: $space-5 $space-6;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-family: $font-body;
  transition: box-shadow $transition-base, transform $transition-base;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  // Modifier: warning variant
  &--warning {
    border-top: 3px solid $color-danger;
  }

  // ── Icon ──
  &__icon-wrap { margin-bottom: $space-1; }

  &__icon {
    font-size: 1.4rem;
    color: $color-text-muted;

    &--red { color: $color-danger; }
  }

  // ── Label ──
  &__label {
    font-size: 0.8rem;
    color: $color-text-secondary;
    margin: 0;
  }

  // ── Value row ──
  &__value-row {
    display: flex;
    align-items: baseline;
    gap: $space-2;
  }

  &__value {
    font-size: $text-hero;
    font-weight: 800;
    color: $color-text-primary;
    line-height: 1;

    &--red { color: $color-danger; }
  }

  &__unit {
    font-size: 0.8rem;
    color: $color-text-muted;
  }

  // ── Badge (success) ──
  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $color-success;
    margin-top: $space-1;
  }

  &__badge-icon { font-size: 0.85rem; }

  // ── Deadline (warning) ──
  &__deadline {
    font-size: $text-sm;
    color: $color-text-faint;
    margin: $space-1 0 0 0;
  }
}
</style>

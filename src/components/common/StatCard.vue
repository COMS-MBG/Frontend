<template>
  <div
    class="stat-card"
    :class="[variant ? `stat-card--${variant}` : '']"
    role="group"
    :aria-label="label"
  >
    <!-- ── Horizontal variant (page summary) ── -->
    <template v-if="variant === 'horizontal'">
      <div
        class="stat-card__icon-circle"
        :class="`stat-card__icon-circle--${iconVariant}`"
      >
        <slot name="icon">
          <span class="material-symbols-outlined">{{ icon }}</span>
        </slot>
      </div>
      <div class="stat-card__info">
        <span class="stat-card__label">{{ label }}</span>
        <div class="stat-card__value">{{ formatValue(value) }}</div>
      </div>
    </template>

    <!-- ── Default variant (dashboard) ── -->
    <template v-else>
      <div class="stat-card__top">
        <span class="stat-card__label">{{ label }}</span>
        <span class="material-symbols-outlined stat-card__icon">{{
          icon
        }}</span>
      </div>
      <div class="stat-card__value">{{ formatValue(value) }}</div>
      <div v-if="subtitle" class="stat-card__sub">{{ subtitle }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    icon: string;
    value: string | number;
    subtitle?: string;
    variant?: "default" | "horizontal";
    iconVariant?: "blue" | "green" | "orange" | "purple";
  }>(),
  {
    variant: "default",
    iconVariant: "blue",
  },
);

function formatValue(val: string | number) {
  if (typeof val === "number") {
    return val.toLocaleString("id-ID");
  }
  return val;
}
</script>

<style scoped lang="scss">
// ── Default variant ──
.stat-card {
  @include card-base($radius-lg, $shadow-xs);
  padding: $space-5 $space-6;
  border-left: 4px solid $color-primary;
  font-family: $font-body;
  transition:
    box-shadow $transition-base,
    transform $transition-base;

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

// ── Horizontal variant ──
.stat-card--horizontal {
  display: flex;
  align-items: center;
  gap: $space-4;
  border-left: none;
  padding: $space-5 $space-6;

  .stat-card__info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .stat-card__value {
    margin-bottom: 0;
  }
}

// ── Icon circle colors ──
.stat-card__icon-circle {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .material-symbols-outlined {
    font-size: 1.35rem;
  }

  &--blue {
    background-color: $color-primary-subtle;
    .material-symbols-outlined {
      color: $color-primary;
    }
  }

  &--green {
    background-color: $color-success-subtle;
    .material-symbols-outlined {
      color: $color-success;
    }
  }

  &--orange {
    background-color: $color-warning-subtle;
    .material-symbols-outlined {
      color: $color-warning;
    }
  }

  &--purple {
    background-color: $color-purple-subtle;
    .material-symbols-outlined {
      color: $color-purple;
    }
  }
}
</style>

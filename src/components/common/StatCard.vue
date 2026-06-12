<template>
  <BaseCard
    class="stat-card"
    :class="[variant ? `stat-card--${variant}` : '']"
    variant="default"
    padding="none"
    hoverable
    role="group"
    :aria-label="label"
  >
    <div class="stat-card__inner">
      <!-- ── Horizontal & Financial variants (page summary) ── -->
      <template v-if="variant === 'horizontal' || variant === 'financial'">
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
          <div class="stat-card__value" :title="String(value)">{{ formatValue(value) }}</div>
          <div v-if="subtitle" class="stat-card__sub">{{ subtitle }}</div>
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
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from "./BaseCard.vue";

const props = withDefaults(
  defineProps<{
    label: string;
    icon: string;
    value: string | number;
    subtitle?: string;
    variant?: "default" | "horizontal" | "financial";
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
.stat-card {
  font-family: $font-body;

  // Ensure border-left overrides BaseCard's variant-default border
  &.stat-card--default {
    border-left: 4px solid $color-primary !important;
  }

  &__inner {
    padding: $space-5 $space-6;
  }

  // ── Default variant layout ──
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
    font-size: $text-xs;
    color: $color-text-muted;
  }
}

// ── Horizontal & Financial variant ──
.stat-card--horizontal, .stat-card--financial {
  .stat-card__inner {
    display: flex;
    align-items: center;
    gap: $space-4;
  }

  .stat-card__info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0; // Essential for text-overflow to work in flex
  }

  .stat-card__value {
    margin-bottom: 0;
  }
}

// ── Financial specific overrides ──
.stat-card--financial {
  .stat-card__value {
    font-size: clamp(1.8rem, 2vw, 2.6rem);
    font-variant-numeric: tabular-nums;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

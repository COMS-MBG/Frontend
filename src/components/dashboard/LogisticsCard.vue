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
// ── Dark-card scoped design tokens ──
$_text-high:    rgba(255, 255, 255, 0.8);
$_text-mid:     rgba(255, 255, 255, 0.5);
$_text-low:     rgba(255, 255, 255, 0.45);
$_icon-faint:   rgba(255, 255, 255, 0.3);
$_surface:      rgba(255, 255, 255, 0.04);
$_border:       rgba(255, 255, 255, 0.07);
$_btn-border:   rgba(255, 255, 255, 0.25);
$_hover-bg:     rgba(255, 255, 255, 0.07);
$_hover-border: rgba(255, 255, 255, 0.45);

.logistics-card {
  background-color: $color-text-secondary;
  background: linear-gradient(155deg, #1a2a4a 0%, #1e3460 50%, #16284a 100%);
  border-radius: $radius-xl;
  border: 1px solid $_border;
  box-shadow: $shadow-md;
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
    @include label-uppercase($text-xs, $_text-low);
    margin: 0 0 $space-1 0;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 700;
    color: $color-text-inverse;
    margin: 0;
  }

  &__icon {
    font-size: $text-3xl;
    color: $_icon-faint;
  }

  // ── Stats row ──
  &__stats {
    display: flex;
    justify-content: space-around;
    gap: $space-2;
    flex: 1;
    align-items: center;
    background: $_surface;
    border-radius: $radius-lg;
    border: 1px solid $_border;
    padding: $space-4 $space-3;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;

  &__value {
    font-size: $text-3xl;
    font-weight: 800;
    color: $color-text-inverse;
    line-height: 1;
  }

  &__label {
    @include label-uppercase($text-xs, $_text-mid);
  }
}

// ── Button ──
.btn-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: $space-3 $space-5;
  border-radius: $radius-md;
  font-size: $text-sm;
  font-weight: 600;
  font-family: $font-body;
  cursor: pointer;
  background: transparent;
  color: $_text-high;
  border: 1.5px solid $_btn-border;
  transition: background $transition-fast, border-color $transition-fast, transform $transition-fast;

  &:hover {
    background: $_hover-bg;
    border-color: $_hover-border;
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }
}
</style>

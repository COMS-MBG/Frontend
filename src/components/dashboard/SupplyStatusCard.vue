<template>
  <div class="supply-card">

    <!-- Header -->
    <div class="supply-card__header">
      <div>
        <p class="supply-card__label">{{ sectionLabel }}</p>
        <h2 class="supply-card__title">{{ title }}</h2>
      </div>
      <span class="supply-card__badge">
        <span class="material-symbols-outlined badge__icon">check_circle</span>
        {{ badgeText }}
      </span>
    </div>

    <!-- Body: Menu + Bahan -->
    <div class="supply-card__body">

      <!-- Menu Hari Ini -->
      <div class="menu-box">
        <p class="menu-box__label">MENU HARI INI</p>
        <h3 class="menu-box__name">{{ menuName }}</h3>
        <p class="menu-box__calorie">{{ menuCalorie }}</p>
      </div>

      <!-- Bahan Utama -->
      <div class="bahan-list">
        <p class="bahan-list__label">BAHAN UTAMA TERBANYAK</p>
        <div
          v-for="item in bahanItems"
          :key="item.name"
          class="bahan-item"
        >
          <span class="bahan-item__name">{{ item.name }}</span>
          <span class="bahan-item__qty">{{ item.qty }}</span>
          <div class="progress-bar">
            <div
              class="progress-bar__fill"
              :style="{ width: item.percent + '%' }"
            ></div>
          </div>
        </div>
      </div>

    </div>

    <!-- Action -->
    <button class="btn-primary" @click="$emit('update-stok')">
      {{ actionLabel }}
    </button>

  </div>
</template>

<script setup lang="ts">
export interface BahanItem {
  name: string
  qty: string
  percent: number
}

defineProps<{
  sectionLabel?: string
  title?: string
  badgeText?: string
  menuName?: string
  menuCalorie?: string
  bahanItems?: BahanItem[]
  actionLabel?: string
}>()

defineEmits<{ (e: 'update-stok'): void }>()
</script>

<style scoped lang="scss">
// ── Wrapper ──
.supply-card {
  @include card-base;
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-5;
  font-family: $font-body;

  // ── Header ──
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $space-4;
  }

  &__label {
    @include label-uppercase;
    margin: 0 0 0.25rem 0;
  }

  &__title {
    font-size: $text-xl;
    font-weight: 700;
    color: $color-text-primary;
    margin: 0;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.35rem 0.75rem;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    white-space: nowrap;
    background: $color-success-bg;
    color: $color-success;
    border: 1px solid $color-success-border;
  }

  // ── Body ──
  &__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-4;
  }
}

.badge__icon { font-size: 0.85rem; }

// ── Menu Box ──
.menu-box {
  background: $color-bg-muted;
  border-radius: 10px;
  padding: $space-4 $space-5;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  &__label {
    @include label-uppercase(0.65rem);
    margin: 0;
  }

  &__name {
    font-size: $text-xl;
    font-weight: 700;
    color: $color-text-primary;
    margin: 0;
  }

  &__calorie {
    font-size: 0.78rem;
    color: $color-text-muted;
    margin: 0;
  }
}

// ── Bahan List ──
.bahan-list {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  &__label {
    @include label-uppercase(0.65rem);
    margin: 0;
  }
}

.bahan-item {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 6px;
  gap: 0.2rem 0.5rem;
  align-items: center;

  &__name {
    font-size: 0.82rem;
    color: $color-text-secondary;
  }

  &__qty {
    font-size: 0.82rem;
    font-weight: 700;
    color: $color-primary;
  }
}

.progress-bar {
  grid-column: 1 / -1;
  height: 6px;
  background: $color-border;
  border-radius: $radius-pill;
  overflow: hidden;

  &__fill {
    height: 100%;
    background: $color-primary;
    border-radius: $radius-pill;
    transition: width $transition-spring;
  }
}

// ── Button ──
.btn-primary {
  @include btn-base($color-primary, $color-text-inverse);
  padding: 0.65rem $space-5;
  align-self: flex-start;
}

// ── Responsive ──
@include mobile {
  .supply-card {
    padding: $space-5;

    &__header { flex-wrap: wrap; gap: $space-3; }
    &__body { grid-template-columns: 1fr; }
  }

  .btn-primary {
    width: 100%;
    align-self: stretch;
  }
}
</style>

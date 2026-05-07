<template>
  <div class="insight-card">
    <!-- Grid texture overlay -->
    <div class="insight-card__overlay"></div>

    <!-- Content -->
    <div class="insight-card__content">

      <!-- Tags -->
      <div class="insight-card__tags">
        <span v-if="severity" class="tag tag--severity">{{ severity }}</span>
        <span class="tag tag--category">{{ category }}</span>
      </div>

      <!-- Title & Description -->
      <h2 class="insight-card__title">{{ title }}</h2>
      <p class="insight-card__desc">{{ description }}</p>

      <!-- Footer: Rekomendasi + CTA -->
      <div class="insight-card__footer">
        <div class="rekomendasi">
          <p class="rekomendasi__label">REKOMENDASI</p>
          <p class="rekomendasi__text">{{ recommendation }}</p>
        </div>
        <button class="btn-action" @click="$emit('detail')">
          {{ actionLabel }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  severity?: string
  category?: string
  title?: string
  description?: string
  recommendation?: string
  actionLabel?: string
}>()

defineEmits<{ (e: 'detail'): void }>()
</script>

<style scoped lang="scss">
// ── Dark-card scoped design tokens ──
// These isolate the dark-themed card's white-overlay values
// into reusable local custom properties.
$_text-high:    rgba(255, 255, 255, 0.9);
$_text-mid:     rgba(255, 255, 255, 0.65);
$_text-low:     rgba(255, 255, 255, 0.45);
$_text-cat:     rgba(255, 255, 255, 0.7);
$_surface:      rgba(255, 255, 255, 0.05);
$_border:       rgba(255, 255, 255, 0.09);
$_border-btn:   rgba(255, 255, 255, 0.4);
$_hover-bg:     rgba(255, 255, 255, 0.08);
$_hover-border: rgba(255, 255, 255, 0.6);
$_grid-line:    rgba(0, 210, 185, 0.04);

// ── Wrapper ──
.insight-card {
  position: relative;
  border-radius: $radius-xl;
  overflow: hidden;
  min-height: 260px;
  background:
    radial-gradient(ellipse at 65% 35%, rgba(0, 160, 140, 0.12) 0%, transparent 55%),
    radial-gradient(ellipse at 25% 75%, rgba(0, 80, 180, 0.14) 0%, transparent 50%),
    linear-gradient(145deg, #0e1f38 0%, #0d2847 45%, #0e3556 80%, #0c2240 100%);
  font-family: $font-body;

  // Grid texture overlay — subtle depth layer
  &__overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient($_grid-line 1px, transparent 1px),
      linear-gradient(90deg, $_grid-line 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  // ── Content ──
  &__content {
    position: relative;
    z-index: 1;
    padding: $space-8;
    display: flex;
    flex-direction: column;
    gap: $space-4;
    min-height: 260px;
  }

  // ── Tags ──
  &__tags {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  // ── Text ──
  &__title {
    font-size: $text-xl;
    font-weight: 700;
    color: $color-text-inverse;
    margin: 0;
    line-height: 1.35;
    max-width: 520px;
  }

  &__desc {
    font-size: $text-base;
    color: $_text-mid;
    margin: 0;
    line-height: 1.65;
    max-width: 500px;
  }

  // ── Footer ──
  &__footer {
    display: flex;
    align-items: center;
    gap: $space-4;
    margin-top: auto;
    background: $_surface;
    border: 1px solid $_border;
    border-radius: $radius-lg;
    padding: $space-4 $space-5;
  }
}

// ── Tags ──
.tag {
  font-size: $text-xs;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: $space-1 $space-2;
  border-radius: $radius-sm;
  text-transform: uppercase;

  &--severity {
    background: $color-danger;
    color: $color-text-inverse;
  }

  &--category {
    color: $_text-cat;
    font-weight: 600;
    font-size: $text-sm;
    padding: 0;
    background: transparent;
    letter-spacing: 0.06em;
  }
}

// ── Rekomendasi ──
.rekomendasi {
  flex: 1;

  &__label {
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: $_text-low;
    text-transform: uppercase;
    margin: 0 0 $space-1 0;
  }

  &__text {
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-inverse;
    margin: 0;
  }
}

// ── CTA Button ──
.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $space-2 $space-5;
  border-radius: $radius-md;
  font-size: $text-sm;
  font-weight: 600;
  font-family: $font-body;
  cursor: pointer;
  background: transparent;
  color: $_text-high;
  border: 1.5px solid $_border-btn;
  white-space: nowrap;
  transition: background $transition-fast, border-color $transition-fast, transform $transition-fast;

  &:hover {
    background: $_hover-bg;
    border-color: $_hover-border;
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }
}

// ── Responsive ──
@include mobile {
  .insight-card {
    &__content {
      padding: $space-5;
      min-height: 220px;
    }

    &__title { font-size: $text-lg; }

    &__footer {
      flex-direction: column;
      align-items: flex-start;
      gap: $space-3;
    }
  }

  .btn-action {
    width: 100%;
    justify-content: center;
  }
}
</style>

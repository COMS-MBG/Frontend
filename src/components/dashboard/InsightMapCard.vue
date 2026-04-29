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
// ── Wrapper ──
.insight-card {
  position: relative;
  border-radius: $radius-xl;
  overflow: hidden;
  min-height: 300px;
  background:
    radial-gradient(ellipse at 65% 35%, rgba(0, 200, 170, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 25% 75%, rgba(0, 100, 220, 0.22) 0%, transparent 50%),
    linear-gradient(135deg, #0d1f3c 0%, #0a2a4a 40%, #0d3d63 70%, #0f2744 100%);
  font-family: $font-body;

  // Grid texture overlay
  &__overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 230, 200, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 230, 200, 0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  // ── Content ──
  &__content {
    position: relative;
    z-index: 1;
    padding: 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    min-height: 300px;
  }

  // ── Tags ──
  &__tags {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  // ── Text ──
  &__title {
    font-size: $text-2xl;
    font-weight: 700;
    color: $color-text-inverse;
    margin: 0;
    line-height: 1.3;
  }

  &__desc {
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.72);
    margin: 0;
    line-height: 1.6;
    max-width: 540px;
  }

  // ── Footer ──
  &__footer {
    display: flex;
    align-items: center;
    gap: $space-4;
    margin-top: auto;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    padding: 0.875rem $space-4;
  }
}

// ── Tags ──
.tag {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  text-transform: uppercase;

  &--severity {
    background: $color-danger;
    color: $color-text-inverse;
  }

  &--category {
    color: rgba(255, 255, 255, 0.7);
    font-weight: 600;
    font-size: 0.72rem;
    padding: 0;
    background: transparent;
    letter-spacing: 0.06em;
  }
}

// ── Rekomendasi ──
.rekomendasi {
  flex: 1;

  &__label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    margin: 0 0 0.2rem 0;
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
  padding: 0.6rem 1.1rem;
  border-radius: $radius-md;
  font-size: $text-base;
  font-weight: 600;
  font-family: $font-body;
  cursor: pointer;
  background: transparent;
  color: $color-text-inverse;
  border: 2px solid rgba(255, 255, 255, 0.65);
  white-space: nowrap;
  transition: background $transition-fast, transform 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }
}

// ── Responsive ──
@include mobile {
  .insight-card {
    &__content {
      padding: $space-5;
      min-height: 260px;
    }

    &__title { font-size: $text-xl; }

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

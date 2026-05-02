<template>
  <Transition name="fade">
    <div v-if="show" class="base-loading-overlay" aria-live="polite" aria-busy="true">
      <div class="loader-ring">
        <div></div><div></div><div></div><div></div>
      </div>
      <p v-if="text" class="loader-text">{{ text }}</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  text?: string
}>()
</script>

<style scoped lang="scss">
.base-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: $z-overlay;
  background: $color-bg-overlay;
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-4;
  border-radius: inherit;
}

.loader-ring {
  width: 48px;
  height: 48px;
  position: relative;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    border: 4px solid transparent;
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: overlay-spin 0.9s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite;

    &:nth-child(2) {
      animation-delay: -0.3s;
      border-top-color: rgba(26, 86, 219, 0.45);
    }
    &:nth-child(3) {
      animation-delay: -0.15s;
      border-top-color: rgba(26, 86, 219, 0.2);
    }
    &:nth-child(4) { display: none; }
  }
}

@keyframes overlay-spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader-text {
  font-family: $font-body;
  font-size: $text-base;
  color: $color-text-muted;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>

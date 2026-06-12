<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast-${toast.variant}`"
          role="status"
        >
          <span class="material-symbols-outlined toast-icon">{{ iconFor(toast.variant) }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" @click="dismiss(toast.id)" aria-label="Tutup">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast, type ToastVariant } from '@/composables/useToast'

const { toasts, dismiss } = useToast()

function iconFor(variant: ToastVariant): string {
  switch (variant) {
    case 'success': return 'check_circle'
    case 'error':   return 'error'
    case 'warning': return 'warning'
    case 'info':    return 'info'
  }
}
</script>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  bottom: $space-6;
  right: $space-6;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: $space-2;
  max-width: 380px;
  width: calc(100vw - #{$space-6} * 2);

  @include mobile {
    bottom: $space-4;
    right: $space-4;
    left: $space-4;
    width: auto;
  }
}

.toast-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  border-radius: $radius-lg;
  font-size: $text-sm;
  font-family: $font-body;
  font-weight: 500;
  border: 1px solid transparent;
  box-shadow: $shadow-lg;
  backdrop-filter: blur(8px);

  &.toast-success {
    background-color: #f0fdf4;
    border-color: #bbf7d0;
    color: #166534;
    .toast-icon { color: #16a34a; }
    .toast-close { color: #166534; }
  }

  &.toast-error {
    background-color: $color-danger-bg;
    border-color: $color-danger-border;
    color: $color-danger-darker;
    .toast-icon { color: $color-danger; }
    .toast-close { color: $color-danger-darker; }
  }

  &.toast-warning {
    background-color: #fffbeb;
    border-color: #fde68a;
    color: #92400e;
    .toast-icon { color: #d97706; }
    .toast-close { color: #92400e; }
  }

  &.toast-info {
    background-color: #eff6ff;
    border-color: #bfdbfe;
    color: #1e40af;
    .toast-icon { color: #3b82f6; }
    .toast-close { color: #1e40af; }
  }
}

.toast-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.toast-msg {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  opacity: 0.6;
  flex-shrink: 0;
  transition: opacity $transition-fast;

  &:hover { opacity: 1; }

  .material-symbols-outlined { font-size: 1rem; }
}

// ── Transition ──
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>

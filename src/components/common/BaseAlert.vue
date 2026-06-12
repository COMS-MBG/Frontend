<template>
  <Transition name="slide-down">
    <div v-if="show" class="base-alert" :class="`alert-${variant}`" role="alert">
      <span class="material-symbols-outlined alert-icon">{{ currentIcon }}</span>
      <span class="alert-msg">
        <slot>{{ message }}</slot>
      </span>
      <button v-if="dismissible" class="alert-close" @click="close" aria-label="Tutup">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  show: boolean
  message?: string
  variant?: 'error' | 'success' | 'warning' | 'info'
  icon?: string
  dismissible?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'close'): void
}>()

const currentIcon = computed(() => {
  if (props.icon) return props.icon
  switch (props.variant) {
    case 'success': return 'check_circle'
    case 'warning': return 'warning'
    case 'info': return 'info'
    case 'error':
    default: return 'error'
  }
})

const close = () => {
  emit('update:show', false)
  emit('close')
}
</script>

<style scoped lang="scss">
.base-alert {
  display: flex;
  align-items: center;
  gap: $space-2;
  border-radius: $radius-lg;
  padding: $space-3 $space-4;
  font-size: 0.8125rem;
  font-family: $font-body;
  border: 1px solid transparent;

  &.alert-error {
    background-color: $color-danger-bg;
    border-color: $color-danger-border;
    color: $color-danger-darker;
    
    .alert-close {
      color: $color-danger-darker;
    }
  }

  &.alert-success {
    background-color: #f0fdf4;
    border-color: #bbf7d0;
    color: #166534;
    
    .alert-close {
      color: #166534;
    }
  }

  &.alert-warning {
    background-color: #fffbeb;
    border-color: #fde68a;
    color: #92400e;
    
    .alert-close {
      color: #92400e;
    }
  }

  &.alert-info {
    background-color: #eff6ff;
    border-color: #bfdbfe;
    color: #1e40af;
    
    .alert-close {
      color: #1e40af;
    }
  }
}

.alert-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.alert-msg {
  flex: 1;
  line-height: 1.4;
}

.alert-close {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  opacity: 0.7;
  transition: opacity $transition-fast;

  &:hover { opacity: 1; }
  .material-symbols-outlined { font-size: 1rem; }
}

.slide-down-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>

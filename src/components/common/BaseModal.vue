<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="modelValue" 
        class="modal-overlay" 
        @click.self="close"
      >
        <div 
          class="modal-dialog" 
          :class="[`modal-${size}`]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          @click.stop
        >
          <!-- Header -->
          <div class="modal-header">
            <slot name="header">
              <h3 id="modal-title" class="modal-title">{{ title }}</h3>
            </slot>
            <button class="btn-close" @click="close" aria-label="Tutup">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Footer -->
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  title: 'Modal Title',
  size: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// ── Keyboard Support ──────────────────────────────────────────────
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

// ── Scroll Lock & Padding ─────────────────────────────────────────
const lockScroll = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
}

const unlockScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// ── Lifecycle & Watchers ──────────────────────────────────────────
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    lockScroll()
    document.addEventListener('keydown', onKeydown)
  } else {
    unlockScroll()
    document.removeEventListener('keydown', onKeydown)
  }
})

onMounted(() => {
  if (props.modelValue) {
    lockScroll()
    document.addEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  unlockScroll()
  document.removeEventListener('keydown', onKeydown)
})
</script> 
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})

/** Extract initials: e.g. "Agus Kurir" -> "AK" */
function getInitials(name: string): string {
  const cleanName = name.trim()
  if (!cleanName) return '??'
  const parts = cleanName.split(/\s+/)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  }
  return cleanName.substring(0, 2).toUpperCase()
}

/** Determine color variant deterministically from name using permitted classes */
function getAvatarVariant(name: string): string {
  const variants = [
    'avatar--primary',
    'avatar--success',
    'avatar--warning',
    'avatar--info',
    'avatar--secondary'
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % variants.length
  return variants[index] ?? 'avatar--secondary'
}
</script>

<template>
  <span
    class="user-avatar"
    :class="[
      `user-avatar--${size}`,
      getAvatarVariant(name)
    ]"
    :title="name"
    role="img"
    :aria-label="name"
  >
    {{ getInitials(name) }}
  </span>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-pill;
  font-weight: 700;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  user-select: none;
  line-height: 1;
  font-family: $font-body;
  background-image: none !important; // override global navbar background-image gradient

  // ── Sizes ───────────────────────────────────────────────
  &--sm {
    width: 32px;
    height: 32px;
    font-size: $text-xs;
  }

  &--md {
    width: 40px;
    height: 40px;
    font-size: $text-sm;
  }

  &--lg {
    width: 48px;
    height: 48px;
    font-size: $text-base;
  }

  // ── Color Variants (strictly maps to design system) ─────
  &.avatar--primary {
    background: $color-primary;
    color: white;
  }

  &.avatar--success {
    background: $color-success;
    color: white;
  }

  &.avatar--warning {
    background: $color-warning;
    color: white;
  }

  &.avatar--info {
    background: $color-info;
    color: white;
  }

  &.avatar--secondary {
    background: $color-text-muted;
    color: white;
  }
}
</style>

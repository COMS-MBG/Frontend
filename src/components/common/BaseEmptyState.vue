<template>
  <div class="base-empty-state" role="status">
    <div class="base-empty-state__icon-circle">
      <span class="material-symbols-outlined">{{ icon }}</span>
    </div>
    <p class="base-empty-state__title">{{ title }}</p>
    <p v-if="description" class="base-empty-state__desc">{{ description }}</p>
    <button
      v-if="actionLabel"
      class="btn-primary btn-with-icon base-empty-state__action"
      :aria-label="actionLabel"
      @click="$emit('action')"
    >
      <span class="material-symbols-outlined">{{ actionIcon }}</span>
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  actionIcon?: string
}>(), {
  icon: 'inbox',
  actionIcon: 'add',
})

defineEmits<{
  (e: 'action'): void
}>()
</script>

<style scoped lang="scss">
.base-empty-state {
  @include card-base($radius-lg, $shadow-xs);
  @include flex-center(column);
  gap: $space-3;
  padding: $space-12 $space-6;
  text-align: center;
  font-family: $font-body;

  &__icon-circle {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: $color-bg-subtle;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $space-2;

    .material-symbols-outlined {
      font-size: 2rem;
      color: $color-text-faint;
    }
  }

  &__title {
    font-size: $text-lg;
    font-weight: 700;
    color: $color-text-primary;
    margin: 0;
  }

  &__desc {
    font-size: $text-sm;
    color: $color-text-muted;
    margin: 0;
    max-width: 360px;
  }

  &__action {
    margin-top: $space-2;
  }
}
</style>

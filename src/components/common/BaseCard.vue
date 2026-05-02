<template>
  <div 
    class="base-card" 
    :class="[
      `variant-${variant}`,
      `padding-${padding}`,
      { 'is-hoverable': hoverable, 'is-clickable': clickable }
    ]"
    role="region"
    :aria-labelledby="title ? 'base-card-title' : undefined"
  >
    <header v-if="$slots.header || title || $slots.actions" class="base-card-header">
      <div class="header-left">
        <slot name="header">
          <h3 v-if="title" id="base-card-title" class="base-card-title">{{ title }}</h3>
        </slot>
      </div>

      <div class="header-right" v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="base-card-body">
      <slot></slot>
    </div>

    <footer v-if="$slots.footer" class="base-card-footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'flat'
  hoverable?: boolean
  clickable?: boolean
}>(), {
  padding: 'md',
  variant: 'default',
  hoverable: false,
  clickable: false
})
</script>

<style scoped lang="scss">
.base-card {
  background-color: $color-bg-surface;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  /* Variant: default */
  &.variant-default {
    box-shadow: $shadow-xs;
    border: 1px solid $color-border;
  }

  /* Variant: outlined */
  &.variant-outlined {
    box-shadow: none;
    border: 1px solid $color-border;
  }

  /* Variant: flat */
  &.variant-flat {
    box-shadow: none;
    border: none;
  }

  /* Interactive States */
  &.is-hoverable:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  &.is-clickable {
    cursor: pointer;
    
    &:active {
      transform: translateY(0);
    }
  }

  /* Padding system applied to body */
  &.padding-none .base-card-body {
    padding: 0;
  }
  &.padding-sm .base-card-body {
    padding: $space-3;
  }
  &.padding-md .base-card-body {
    padding: $space-5;
  }
  &.padding-lg .base-card-body {
    padding: $space-8;
  }
}

.base-card-header {
  padding: $space-4 $space-5;
  border-bottom: 1px solid $color-border;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $space-4;

  .header-left {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  .base-card-title {
    margin: 0;
    font-size: $text-md;
    font-weight: 600;
    color: $color-text-primary;
  }
}

.base-card-body {
  display: block;
}

.base-card-footer {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border;
  background-color: $color-bg-subtle;
}
</style>

<template>
  <div class="page-header">
    <div class="page-header__left">
      <!-- Breadcrumb -->
      <nav class="page-header__breadcrumb" aria-label="Breadcrumb">
        <template v-for="(item, index) in breadcrumb" :key="index">
          <span
            class="breadcrumb__item"
            :class="{ 'breadcrumb__item--active': index === breadcrumb.length - 1 }"
            :aria-current="index === breadcrumb.length - 1 ? 'page' : undefined"
          >{{ item }}</span>
          <span v-if="index < breadcrumb.length - 1" class="breadcrumb__sep">/</span>
        </template>
      </nav>

      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>

    <!-- Slot for action buttons -->
    <div class="page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  breadcrumb: string[]
}>()
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $space-6;
  font-family: $font-body;

  &__left {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: $space-3;
  }

  &__title {
    font-family: $font-heading;
    font-size: $text-4xl;
    font-weight: 800;
    color: $color-text-primary;
    margin: 0;
    line-height: 1.25;
  }

  &__subtitle {
    font-size: $text-base;
    color: $color-text-muted;
    margin: 0.25rem 0 0;
    line-height: 1.5;
    max-width: 520px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-shrink: 0;
    padding-top: $space-6 ;
  }
}

.breadcrumb__item {
  font-size: $text-sm;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $color-text-faint;

  &--active {
    color: $color-primary;
    font-weight: 700;
  }
}

.breadcrumb__sep {
  font-size: $text-sm;
  color: $color-text-faint;
}

@include tablet {
  .page-header {
    flex-direction: column;
    gap: $space-4;

    &__actions {
      padding-top: 0;
    }
  }
}

@include mobile {
  .page-header__title {
    font-size: $text-2xl;
  }
}
</style>

<template>
  <div class="dashboard-header">
    <p class="dashboard-header__label">{{ sectionLabel }}</p>
    <h1 class="dashboard-header__title">{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sectionLabel?: string
  title?: string
}>()
</script>

<style scoped lang="scss">
.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: $space-1;
  font-family: $font-body;

  &__label {
    @include label-uppercase($text-sm);
    margin: 0;
  }

  &__title {
    font-size: $text-4xl;
    font-weight: 700;
    color: $color-primary;
    margin: 0;
    line-height: 1.2;

    @include mobile {
      font-size: $text-2xl;
    }
  }
}
</style>

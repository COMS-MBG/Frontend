<template>
  <div class="bahan-empty" role="status">
    <div class="bahan-empty__icon-circle">
      <span class="material-symbols-outlined">inventory_2</span>
    </div>
    <p class="bahan-empty__title">Belum ada data bahan</p>
    <p class="bahan-empty__desc">Mulai tambahkan bahan baku untuk membangun katalog nutrisi Anda.</p>
    <button
      class="btn-primary btn-with-icon"
      aria-label="Tambah Bahan"
      @click="$emit('add')"
    >
      <span class="material-symbols-outlined">add</span>
      Tambah Bahan
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'add'): void
}>()
</script>

<style scoped lang="scss">
.bahan-empty {
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
}

.btn-primary.btn-with-icon {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 $space-5;
  border: none;
  border-radius: $radius-md;
  background-color: $color-primary;
  color: $color-text-inverse;
  font-family: $font-body;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  box-shadow: $shadow-btn;
  transition: background-color 0.2s ease;
  margin-top: $space-2;

  .material-symbols-outlined {
    font-size: 1.15rem;
  }

  &:hover {
    background-color: $color-primary-dark;
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}
</style>

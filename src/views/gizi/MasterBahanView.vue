<template>
  <div class="dummy-page">
    <div class="dummy-card">
      <span class="material-symbols-outlined dummy-icon">kitchen</span>
      <h1>Master Data Bahan Baku</h1>
      <p>Halaman ini sedang dalam pengembangan.</p>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.dummy-page {
  @include flex-center;
  height: 100%;
}
.dummy-card {
  @include flex-center(column);
  text-align: center;
  gap: 0.75rem;
  padding: $space-12;
  background: $color-bg-surface;
  border-radius: $radius-2xl;
  box-shadow: $shadow-sm;
}
.dummy-icon {
  font-size: 3rem;
  color: $color-primary;
  opacity: 0.5;
}
h1 {
  font-family: $font-heading;
  font-size: 1.5rem;
  font-weight: 700;
  color: $color-text-primary;
  margin: 0;
}
p {
  font-size: $text-base;
  color: $color-text-muted;
  margin: 0;
}
</style>

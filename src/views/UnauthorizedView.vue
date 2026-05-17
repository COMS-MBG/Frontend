<template>
  <div class="unauthorized">
    <span class="material-symbols-outlined unauthorized__icon">lock</span>
    <h1 class="unauthorized__title">403 — Akses Ditolak</h1>
    <p class="unauthorized__subtitle">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
    <button class="btn-primary btn-md" @click="goToDashboard">
      <span class="material-symbols-outlined">arrow_back</span>
      Kembali ke Dashboard
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDashboard() {
  router.push({ name: 'dashboard' })
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.unauthorized {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: $space-8;

  &__icon {
    font-size: 4rem;
    color: $color-danger;
    margin-bottom: $space-6;
  }

  &__title {
    font-family: $font-heading;
    font-size: $text-2xl;
    font-weight: 700;
    color: $color-text-primary;
    margin: 0 0 $space-3;
  }

  &__subtitle {
    font-family: $font-body;
    font-size: $text-base;
    color: $color-text-muted;
    margin: 0 0 $space-8;
    max-width: 420px;
  }
}
</style>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <!-- Kolom Kiri — child route dirender via router-view -->
      <section class="auth-form-col">
        <router-view />
      </section>

      <!-- Kolom Kanan — image panel (45%), kosong, siap diisi gambar -->
      <div class="auth-image-col">
        <!-- Taruh <img> atau background-image Anda di sini -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// AuthLayout tidak memiliki logic — murni structural layout
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

/* ── Halaman: background #fff, flex center ── */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  font-family: 'Inter', sans-serif;
  padding: 1.5rem;
  box-sizing: border-box;
}

/* ── Card: putih, border-radius 20px, shadow, max-width 900px ── */
.auth-card {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 580px;
  background-color: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.20);
}

/* ── Kolom Kiri (55%) — diisi slot dari view ── */
.auth-form-col {
  width: 55%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /* padding diatur di dalam LoginView agar fleksibel */
}

/* ── Kolom Kanan (45%) — image panel ── */
.auth-image-col {
  width: 45%;
  background-color: #1f1f86;
  border-radius: 0 16px 16px 0;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

/* ── Responsif Mobile ── */
@media (max-width: 680px) {
  .auth-card {
    flex-direction: column;
    border-radius: 16px;
    min-height: auto;
  }
  .auth-form-col {
    width: 100%;
  }
  .auth-image-col {
    display: none;
  }
}
</style>

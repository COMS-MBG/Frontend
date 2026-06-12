<template>
  <div class="auth-page">
    <div class="auth-card">
      <!-- Kolom Kiri — child route dirender via router-view -->
      <section class="auth-form-col">
        <router-view />
      </section>

      <!-- Kolom Kanan — image panel (45%) -->
      <div class="auth-image-col">
        <div class="auth-image-overlay"></div>
        <div class="auth-image-content">
          <h2 class="auth-image-title">Makanan Bergizi, Generasi Berprestasi</h2>
          <p class="auth-image-desc">
            Sistem terintegrasi untuk perencanaan menu seimbang, pemantauan status gizi, dan optimasi jalur distribusi Makan Bergizi Gratis (MBG) di Kota Bandung.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// AuthLayout tidak memiliki logic — murni structural layout
</script>

<style scoped lang="scss">
// ── Halaman: background putih, flex center ──
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-surface;
  font-family: $font-body;
  padding: $space-6;
  box-sizing: border-box;
}

// ── Card: putih, border-radius 20px, shadow, max-width 900px ──
.auth-card {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 580px;
  background-color: $color-bg-surface;
  border-radius: $radius-2xl;
  overflow: hidden;
  box-shadow: $shadow-lg;
}

// ── Kolom Kiri (55%) — diisi slot dari view ──
.auth-form-col {
  width: 55%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

// ── Kolom Kanan (45%) — image panel ──
.auth-image-col {
  width: 45%;
  background-color: #1f1f86;
  background-image: url('/images/login-bg.png');
  background-size: cover;
  background-position: center;
  border-radius: 0 $radius-2xl $radius-2xl 0;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: $space-10 $space-8;
  box-sizing: border-box;
}

.auth-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(17, 24, 39, 0.1) 0%,
    rgba(17, 24, 39, 0.85) 100%
  );
  z-index: 1;
}

.auth-image-content {
  position: relative;
  z-index: 2;
  color: #ffffff;
  text-align: left;
}

.auth-image-title {
  font-family: $font-heading;
  font-size: $text-2xl;
  font-weight: 800;
  line-height: 1.3;
  margin: 0 0 $space-3 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.auth-image-desc {
  font-size: $text-base;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

// ── Responsif Mobile ──
@include auth-mobile {
  .auth-card {
    flex-direction: column;
    border-radius: $radius-2xl;
    min-height: auto;
  }

  .auth-form-col { width: 100%; }

  .auth-image-col { display: none; }
}
</style>

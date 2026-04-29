<template>
  <div class="main-layout">

    <!-- Sidebar Kiri — fixed height, tidak ikut scroll -->
    <AppSidebar />

    <!-- Area Kanan: Navbar + Konten + Footer -->
    <div class="main-right">

      <!-- Topbar — tetap di atas, tidak ikut scroll -->
      <AppNavbar />

      <!-- Konten Halaman — SATU-SATUNYA area yang scroll -->
      <main class="main-content">
        <router-view />
      </main>

      <!-- Footer — tetap di bawah -->
      <AppFooter />

    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<style scoped lang="scss">
// ── Root: kunci layout ke 100vh agar sidebar & navbar tidak ikut scroll ──
.main-layout {
  display: flex;
  height: 100vh;         // PENTING: bukan min-height
  overflow: hidden;      // PENTING: cegah body scroll
  background-color: $color-bg-page;
  font-family: $font-body;
}

// ── Area kanan: flex column, tinggi penuh ──
.main-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 0;
  overflow: hidden;
}

// ── Konten: satu-satunya elemen yang boleh scroll ──
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.75rem $space-6;
  box-sizing: border-box;
}
</style>

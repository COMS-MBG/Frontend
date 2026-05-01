<template>
  <div class="main-layout" :class="{ 'sidebar-open': isSidebarOpen }">

    <!-- Sidebar Kiri -->
    <AppSidebar :is-open="isSidebarOpen" @close="closeSidebar" @toggle="toggleSidebar" />

    <!-- Backdrop Overlay for Mobile/Tablet -->
    <div 
      v-if="isSidebarOpen" 
      class="sidebar-overlay" 
      @click="closeSidebar"
    ></div>

    <!-- Area Kanan: Navbar + Konten + Footer -->
    <div class="main-right">

      <!-- Topbar -->
      <AppNavbar @toggle-sidebar="toggleSidebar" />

      <!-- Konten Halaman -->
      <main class="main-content">
        <router-view />
      </main>

      <!-- Footer -->
      <AppFooter />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const isSidebarOpen = ref(true)

onMounted(() => {
  // Setup default state based on window width
  if (window.innerWidth <= 991) {
    isSidebarOpen.value = false
  }

  // Optional: Listen to window resize to auto collapse/expand
  const handleResize = () => {
    if (window.innerWidth <= 991) {
      isSidebarOpen.value = false
    } else {
      isSidebarOpen.value = true
    }
  }
  window.addEventListener('resize', handleResize)
  onUnmounted(() => window.removeEventListener('resize', handleResize))
})

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}
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

// ── Overlay Backdrop (Tampil hanya saat sidebar open di mobile/tablet) ──
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: calc(#{$z-navbar} + 5); /* Di bawah sidebar, di atas navbar */
  backdrop-filter: blur(2px);
}

@media (max-width: 991px) {
  .sidebar-overlay {
    display: block; /* Akan dikontrol via v-if di template */
  }
}
</style>

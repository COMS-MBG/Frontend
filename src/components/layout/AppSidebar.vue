<template>
  <aside class="sidebar">

    <!-- ── Logo / Brand ── -->
    <div class="sidebar-brand">
      <div class="brand-logo">
        <img src="" alt="MBG Logo" class="brand-img" />
      </div>
      <div class="brand-info">
        <span class="brand-name">MBG Bandung</span>
        <span class="brand-sub">ENTERPRISE SCM</span>
      </div>
    </div>

    <!-- ── Menu Utama ── -->
    <nav class="sidebar-nav">
      <!-- Dashboard -->
      <RouterLink to="/dashboard" class="nav-item" active-class="" exact-active-class="active">
        <span class="material-symbols-outlined nav-icon">dashboard</span>
        <span class="nav-label">Dashboard</span>
        <span class="nav-indicator"></span>
      </RouterLink>

      <!-- Manajemen Gizi -->
      <RouterLink to="/dashboard/manajemen-gizi" class="nav-item" active-class="active">
        <span class="material-symbols-outlined nav-icon">settings_accessibility</span>
        <span class="nav-label">Manajemen Gizi</span>
        <span class="nav-indicator"></span>
      </RouterLink>

      <!-- Distribusi -->
      <RouterLink to="/dashboard/distribusi" class="nav-item" active-class="active">
        <span class="material-symbols-outlined nav-icon">local_shipping</span>
        <span class="nav-label">Distribusi</span>
        <span class="nav-indicator"></span>
      </RouterLink>

      <!-- Master Data -->
      <RouterLink to="/dashboard/master-data" class="nav-item" active-class="active">
        <span class="material-symbols-outlined nav-icon">storage</span>
        <span class="nav-label">Master Data</span>
        <span class="nav-indicator"></span>
      </RouterLink>

      <!-- Laporan -->
      <RouterLink to="/dashboard/laporan" class="nav-item" active-class="active">
        <span class="material-symbols-outlined nav-icon">bar_chart</span>
        <span class="nav-label">Laporan</span>
        <span class="nav-indicator"></span>
      </RouterLink>
    </nav>

    <!-- ── Menu Bawah (Settings) ── -->
    <div class="sidebar-bottom">
      <RouterLink to="/dashboard/settings" class="nav-item" active-class="active">
        <span class="material-symbols-outlined nav-icon">settings</span>
        <span class="nav-label">Settings</span>
      </RouterLink>
    </div>

  </aside>
</template>

<script setup lang="ts">
// Tidak ada logic — murni struktur visual
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

/* ── Sidebar shell ── */
.sidebar {
  width: 192px;
  min-width: 192px;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  flex-shrink: 0;
  overflow-y: auto;
}

/* ── Brand area ── */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 1rem;
  height: 55px;
  border-bottom: 1px solid #f0f4f8;
}
.brand-logo {
  width: 2rem;
  height: 2rem;
  background-color: #1a56db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.brand-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.brand-info {
  display: flex;
  flex-direction: column;
}
.brand-name {
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  color: #1a56db;
  line-height: 1.2;
}
.brand-sub {
  font-family: 'Inter', sans-serif;
  font-size: 0.5625rem;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Nav ── */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  flex: 1;
  gap: 0.125rem;
}

/* ── Nav Item ── */
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  border-radius: 0;
  transition: background-color 0.15s, color 0.15s;
  cursor: pointer;
}
.nav-item:hover {
  background-color: #f0f4ff;
  color: #1a56db;
}
.nav-item:hover .nav-icon {
  color: #1a56db;
}

/* Active state */
.nav-item.active {
  color: #1a56db;
  font-weight: 600;
  background-color: #f0f4ff;
}
.nav-item.active .nav-icon {
  color: #1a56db;
}
/* Garis indikator biru di kanan saat active */
.nav-indicator {
  display: none;
}
.nav-item.active .nav-indicator {
  display: block;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background-color: #1a56db;
  border-radius: 2px 0 0 2px;
}

.nav-icon {
  font-size: 1.25rem;
  color: #9ca3af;
  flex-shrink: 0;
  line-height: 1;
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Bottom area ── */
.sidebar-bottom {
  padding: 0.75rem 0;
  border-top: 1px solid #f0f4f8;
}
</style>

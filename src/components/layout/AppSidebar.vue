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

  </aside>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
// ── Sidebar shell ──
.sidebar {
  width: $sidebar-width;
  min-width: $sidebar-width;
  height: 100vh;
  background-color: $color-bg-surface;
  display: flex;
  flex-direction: column;
  border-right: 1px solid $color-border-light;
  position: sticky;
  top: 0;
  flex-shrink: 0;
  overflow-y: auto;
}

// ── Brand area ──
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 $space-4;
  height: $navbar-height;
  border-bottom: 1px solid $color-border-subtle;
}

.brand-logo {
  width: 2rem;
  height: 2rem;
  background-color: $color-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  .brand-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-family: $font-heading;
  font-weight: 700;
  font-size: $text-base;
  color: $color-primary;
  line-height: 1.2;
}

.brand-sub {
  font-family: $font-body;
  font-size: 0.5625rem;
  font-weight: 500;
  color: $color-text-faint;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// ── Nav ──
.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: $space-4 0;
  flex: 1;
  gap: 0.125rem;
}

// ── Nav Item ──
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem $space-4;
  font-family: $font-body;
  font-size: $text-base;
  font-weight: 500;
  color: $color-text-muted;
  text-decoration: none;
  border-radius: 0;
  transition: background-color $transition-fast, color $transition-fast;
  cursor: pointer;

  &:hover {
    background-color: $color-primary-light;
    color: $color-primary;

    .nav-icon { color: $color-primary; }
  }

  // Active state
  &.active {
    color: $color-primary;
    font-weight: 600;
    background-color: $color-primary-light;

    .nav-icon { color: $color-primary; }

    .nav-indicator {
      display: block;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background-color: $color-primary;
      border-radius: 2px 0 0 2px;
    }
  }
}

.nav-indicator { display: none; }

.nav-icon {
  font-size: 1.25rem;
  color: $color-text-faint;
  flex-shrink: 0;
  line-height: 1;
}

.nav-label {
  @include truncate;
}
</style>

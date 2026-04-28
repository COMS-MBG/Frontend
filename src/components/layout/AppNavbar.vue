<template>
  <header class="navbar">

    <!-- ── Kiri: Nama Sistem ── -->
    <div class="navbar-left">
      <span class="navbar-title">SIMRS</span>
    </div>

    <!-- ── Kanan: Aksi & User ── -->
    <div class="navbar-right">

      <!-- Ikon Notifikasi -->
      <button class="icon-btn" aria-label="Notifikasi">
        <span class="material-symbols-outlined">notifications</span>
      </button>

      <div class="navbar-divider"></div>

      <!-- Info User -->
      <div class="user-info">
        <div class="user-text">
          <span class="user-name">Administrator</span>
          <span class="user-logout">LOGOUT</span>
        </div>
        <!-- Avatar -->
        <div class="user-avatar">
          <img src="" alt="User Avatar" class="avatar-img" />
        </div>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
// Tidak ada logic — murni struktur visual
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

/* ── Navbar shell ── */
.navbar {
  width: 100%;
  height: 56px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-sizing: border-box;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* ── Kiri ── */
.navbar-left {
  display: flex;
  align-items: center;
}
.navbar-title {
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 1.0625rem;
  color: #1a56db;
  letter-spacing: 0.01em;
}

/* ── Kanan ── */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-divider {
  width: 1px;
  height: 32px;
  background-color: #c7c7c7;
}

/* Ikon notifikasi */
.icon-btn {
  background: none;
  border: none;
  padding: 0.375rem;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: background-color 0.15s, color 0.15s;
}
.icon-btn:hover {
  background-color: #f0f4ff;
  color: #1a56db;
}
.icon-btn .material-symbols-outlined {
  font-size: 1.375rem;
}

/* Info user */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
}
.user-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.user-name {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
}
.user-logout {
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  color: #1a56db;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Avatar */
.user-avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e5e7eb;
  flex-shrink: 0;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

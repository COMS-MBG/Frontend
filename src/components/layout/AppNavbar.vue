<template>
  <header class="navbar">

    <!-- ── Kiri: Nama Sistem / Page Title ── -->
    <div class="navbar-left">
      <span class="navbar-title">MBG Supply Dashboard</span>
    </div>

    <!-- ── Kanan: Notifikasi + User Card ── -->
    <div class="navbar-right">

      <!-- Ikon Notifikasi -->
      <button class="icon-btn" aria-label="Notifikasi">
        <span class="material-symbols-outlined">notifications</span>
        <span class="notif-badge" aria-hidden="true"></span>
      </button>

      <div class="navbar-divider"></div>

      <!-- User Card (klik untuk toggle dropdown) -->
      <div class="user-card" @click="toggleDropdown" ref="cardRef">
        <!-- Avatar -->
        <div class="user-avatar">
          <span class="material-symbols-outlined avatar-icon">person</span>
        </div>

        <!-- Teks nama + role -->
        <div class="user-text">
          <span class="user-name">{{ authStore.fullName || 'Pengguna' }}</span>
          <span class="user-role">{{ authStore.userRole || '—' }}</span>
        </div>

        <!-- Chevron -->
        <span
          class="material-symbols-outlined chevron"
          :class="{ 'chevron--open': dropdownOpen }"
        >expand_more</span>
      </div>

      <!-- ── Dropdown Menu ── -->
      <Transition name="dropdown">
        <div v-if="dropdownOpen" class="dropdown" ref="dropdownRef">
          <div class="dropdown-header">
            <span class="dropdown-email">{{ authStore.user?.email ?? '' }}</span>
          </div>
          <hr class="dropdown-divider" />
          <button class="dropdown-item" @click="goProfile">
            <span class="material-symbols-outlined">manage_accounts</span>
            <span>Profil Saya</span>
          </button>
          <button class="dropdown-item" @click="goSettings">
            <span class="material-symbols-outlined">settings</span>
            <span>Pengaturan</span>
          </button>
          <hr class="dropdown-divider" />
          <button class="dropdown-item dropdown-item--danger" :disabled="authStore.isLoading" @click="handleLogout">
            <span class="material-symbols-outlined">logout</span>
            <span>{{ authStore.isLoading ? 'Sedang keluar…' : 'Keluar' }}</span>
          </button>
        </div>
      </Transition>

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router    = useRouter()

// ── Dropdown state ─────────────────────────────────────────────────────────
const dropdownOpen = ref(false)
const cardRef      = ref<HTMLElement | null>(null)
const dropdownRef  = ref<HTMLElement | null>(null)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

/** Tutup dropdown saat klik di luar */
function onClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (
    cardRef.value     && !cardRef.value.contains(target) &&
    dropdownRef.value && !dropdownRef.value.contains(target)
  ) {
    dropdownOpen.value = false
  }
}

onMounted(()       => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

// ── Actions ────────────────────────────────────────────────────────────────
async function handleLogout() {
  dropdownOpen.value = false
  await authStore.logout()
  router.push({ name: 'login' })
}

function goProfile() {
  dropdownOpen.value = false
  router.push({ name: 'profile' })
}

function goSettings() {
  dropdownOpen.value = false
  router.push({ name: 'settings' })
}
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
.navbar-left { display: flex; align-items: center; }
.navbar-title {
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 1.0625rem;
  color: #1a56db;
  letter-spacing: 0.01em;
}

/* ── Kanan ── */
.navbar-right {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar-divider {
  width: 1px;
  height: 32px;
  background-color: #e5e7eb;
}

/* ── Notifikasi ── */
.icon-btn {
  position: relative;
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
.icon-btn .material-symbols-outlined { font-size: 1.375rem; }

.notif-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid #fff;
}

/* ── User Card (clickable) ── */
.user-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.15s;
  user-select: none;
}
.user-card:hover { background-color: #f0f4ff; }

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a56db, #1145b0);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.avatar-icon { font-size: 1.125rem; color: #fff; }

.user-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.user-name {
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
  white-space: nowrap;
}
.user-role {
  font-family: 'Inter', sans-serif;
  font-size: 0.625rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: capitalize;
  letter-spacing: 0.03em;
}

.chevron {
  font-size: 1.125rem;
  color: #9ca3af;
  transition: transform 0.2s ease;
}
.chevron--open { transform: rotate(180deg); }

/* ── Dropdown ── */
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 0.5rem;
  z-index: 200;
}

.dropdown-header {
  padding: 0.375rem 0.625rem 0.5rem;
}
.dropdown-email {
  font-family: 'Inter', sans-serif;
  font-size: 0.6875rem;
  color: #9ca3af;
  word-break: break-all;
}

.dropdown-divider {
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 0.25rem 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: none;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.625rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s, color 0.15s;
}
.dropdown-item:hover:not(:disabled) {
  background-color: #f0f4ff;
  color: #1a56db;
}
.dropdown-item .material-symbols-outlined { font-size: 1.125rem; }

.dropdown-item--danger { color: #dc2626; }
.dropdown-item--danger:hover:not(:disabled) {
  background-color: #fef2f2;
  color: #b91c1c;
}
.dropdown-item:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Transition ── */
.dropdown-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;
}
.dropdown-leave-active {
  transition: all 0.15s ease;
  transform-origin: top right;
}
.dropdown-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(-6px);
}
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}
</style>

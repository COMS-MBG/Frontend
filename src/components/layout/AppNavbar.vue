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

<style scoped lang="scss">
// ── Navbar shell ──
.navbar {
  width: 100%;
  height: $navbar-height;
  background-color: $color-bg-surface;
  border-bottom: 1px solid $color-border-light;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $space-6;
  box-sizing: border-box;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: $z-navbar;
}

// ── Kiri ──
.navbar-left { display: flex; align-items: center; }

.navbar-title {
  font-family: $font-heading;
  font-weight: 700;
  font-size: $text-lg;
  color: $color-primary;
  letter-spacing: 0.01em;
}

// ── Kanan ──
.navbar-right {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar-divider {
  width: 1px;
  height: 32px;
  background-color: $color-border;
}

// ── Notifikasi ──
.icon-btn {
  position: relative;
  background: none;
  border: none;
  padding: 0.375rem;
  cursor: pointer;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-muted;
  transition: background-color $transition-fast, color $transition-fast;

  &:hover {
    background-color: $color-primary-light;
    color: $color-primary;
  }

  .material-symbols-outlined { font-size: 1.375rem; }
}

.notif-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background: $color-danger;
  border-radius: 50%;
  border: 2px solid $color-bg-surface;
}

// ── User Card ──
.user-card {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-1 $space-2 $space-1 $space-1;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color $transition-fast;
  user-select: none;

  &:hover { background-color: $color-primary-light; }
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-primary, $color-primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .avatar-icon { font-size: 1.125rem; color: $color-text-inverse; }
}

.user-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-family: $font-body;
  font-size: 0.8125rem;
  font-weight: 600;
  color: $color-text-primary;
  line-height: 1.2;
  white-space: nowrap;
}

.user-role {
  font-family: $font-body;
  font-size: $text-xs;
  font-weight: 500;
  color: $color-text-muted;
  text-transform: capitalize;
  letter-spacing: 0.03em;
}

.chevron {
  font-size: 1.125rem;
  color: $color-text-faint;
  transition: transform $transition-base;

  &--open { transform: rotate(180deg); }
}

// ── Dropdown ──
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: 14px;
  box-shadow: $shadow-lg;
  padding: $space-2;
  z-index: $z-dropdown;
}

.dropdown-header { padding: 0.375rem 0.625rem 0.5rem; }

.dropdown-email {
  font-family: $font-body;
  font-size: 0.6875rem;
  color: $color-text-faint;
  word-break: break-all;
}

.dropdown-divider {
  border: none;
  border-top: 1px solid $color-border-light;
  margin: $space-1 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: none;
  border: none;
  border-radius: $radius-md;
  padding: $space-2 0.625rem;
  font-family: $font-body;
  font-size: 0.8125rem;
  font-weight: 500;
  color: $color-text-secondary;
  cursor: pointer;
  text-align: left;
  transition: background-color $transition-fast, color $transition-fast;

  &:hover:not(:disabled) {
    background-color: $color-primary-light;
    color: $color-primary;
  }

  .material-symbols-outlined { font-size: 1.125rem; }

  &--danger {
    color: $color-danger-dark;

    &:hover:not(:disabled) {
      background-color: $color-danger-bg;
      color: $color-danger-darker;
    }
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

// ── Vue Transition ──
.dropdown-enter-active {
  transition: all $transition-base cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;
}
.dropdown-leave-active {
  transition: all $transition-fast;
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


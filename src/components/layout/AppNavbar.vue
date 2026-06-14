<template>
  <header class="navbar">

    <!-- ── Kiri: Nama Sistem / Page Title ── -->
    <div class="navbar-left">
      <span class="navbar-title">MBG Supply Dashboard</span>
    </div>

    <!-- ── Kanan: User Card ── -->
    <div class="navbar-right">

      <!-- User Card (klik untuk toggle dropdown) -->
      <div class="user-card" @click="toggleDropdown" ref="cardRef">
        <!-- Avatar -->
        <div class="user-avatar">
          <span class="material-symbols-outlined avatar-icon">person</span>
        </div>

        <!-- Teks nama + role -->
        <div class="user-text">
          <span class="user-name">{{ userName || 'Pengguna' }}</span>
          <span class="user-role">{{ userRole || '—' }}</span>
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
            <span class="dropdown-email">{{ user?.email ?? '' }}</span>
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
          <button class="dropdown-item dropdown-item--danger" :disabled="isLoading" @click="handleLogout">
            <span class="material-symbols-outlined">logout</span>
            <span>{{ isLoading ? 'Sedang keluar…' : 'Keluar' }}</span>
          </button>
        </div>
      </Transition>

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { user, userName, userRole, isLoading, logout, isSuperAdmin } = useAuth()
const router = useRouter()

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
  await logout()
  router.push({ name: 'login' })
}

function goProfile() {
  dropdownOpen.value = false
  router.push({ name: isSuperAdmin.value ? 'sa-profile' : 'profile' })
}

function goSettings() {
  dropdownOpen.value = false
  router.push({ name: isSuperAdmin.value ? 'sa-settings' : 'settings' })
}
</script>
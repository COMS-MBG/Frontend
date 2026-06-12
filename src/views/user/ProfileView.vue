<template>
  <div class="profile-page">
    <!-- Page Header -->
    <PageHeader
      title="Profil Saya"
      subtitle="Informasi detail akun pribadi, unit kerja, dan wewenang akses Anda di sistem COMS-MBG"
      :breadcrumb="['Dashboard', 'Profil']"
      class="mb-6"
    />

    <div v-if="user" class="profile-layout">
      
      <!-- ── SECTION 1: PROFILE HEADER CARD ── -->
      <div class="profile-card header-card">
        <div class="header-card__inner">
          <!-- Avatar -->
          <div class="header-card__avatar-wrap">
            <span v-if="user.profile_picture" class="avatar-img">
              <img :src="user.profile_picture" alt="Foto Profil" />
            </span>
            <div v-else class="avatar-initials">
              {{ nameInitials }}
            </div>
          </div>

          <!-- Identity -->
          <div class="header-card__identity">
            <h2 class="user-name">{{ user.name }}</h2>
            <p class="user-role">{{ user.role_name || 'Pengguna Sistem' }}</p>
            <p class="user-email">{{ user.email }}</p>
          </div>

          <!-- Spacer -->
          <div class="header-card__spacer"></div>

          <!-- Badges (right aligned on desktop) -->
          <div class="header-card__badges">
            <span class="role-badge">{{ user.role_type.toUpperCase() }}</span>
            <BaseBadge :variant="user.is_active ? 'success' : 'danger'" class="badge-pill">
              <span class="status-dot" :class="{ 'status-dot--active': user.is_active }"></span>
              {{ user.is_active ? 'Akun Aktif' : 'Akun Nonaktif' }}
            </BaseBadge>
          </div>
        </div>
      </div>

      <!-- ── 2 COLUMN LAYOUT (DESKTOP) ── -->
      <div class="profile-columns">
        
        <!-- Left: SECTION 2: Informasi Personal -->
        <div class="profile-card info-card">
          <div class="card-header">
            <span class="material-symbols-outlined card-header__icon">person</span>
            <h3 class="card-header__title">Informasi Personal</h3>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-item__label">Nama Lengkap</span>
                <span class="info-item__value">{{ user.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">Alamat Email</span>
                <span class="info-item__value font-mono">{{ user.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">Nomor Telepon</span>
                <span class="info-item__value">{{ user.phone || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">User ID</span>
                <span class="info-item__value font-mono">#{{ user.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">Tipe Peran</span>
                <span class="info-item__value font-mono text-uppercase">{{ user.role_type }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">Status Akun</span>
                <span class="info-item__value">
                  <span class="status-indicator" :class="{ 'status-indicator--active': user.is_active }">
                    {{ user.is_active ? '🟢 Aktif' : '🔴 Nonaktif' }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: SECTION 3: Informasi Sistem -->
        <div class="profile-card info-card">
          <div class="card-header">
            <span class="material-symbols-outlined card-header__icon">settings_applications</span>
            <h3 class="card-header__title">Informasi Sistem</h3>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-item__label">Lokasi Kerja</span>
                <span class="info-item__value">
                  {{ user.role_type === 'super_admin' ? 'Kantor Pusat (Akses Global)' : (user.sppg?.name || '—') }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-item__label">Unit Organisasi</span>
                <span class="info-item__value">
                  {{ user.role_type === 'super_admin' ? 'Manajemen Pusat COMS-MBG' : 'Unit Dapur SPPG Daerah' }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-item__label">Peran Sistem</span>
                <span class="info-item__value">{{ user.role_name || 'Pengguna Sistem' }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">Level Akses</span>
                <span class="info-item__value font-mono text-uppercase">
                  {{ user.role_type === 'super_admin' ? 'Akses Penuh (Administrator)' : 'Akses Terbatas Unit' }}
                </span>
              </div>
            </div>
            
            <div class="system-desc">
              <span class="material-symbols-outlined desc-icon">info</span>
              <p class="desc-text">{{ systemDescription }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- ── BELOW: SECTION 4: Hak Akses Sistem ── -->
      <div class="profile-card access-card">
        <div class="card-header">
          <span class="material-symbols-outlined card-header__icon">verified_user</span>
          <h3 class="card-header__title">Hak Akses Sistem</h3>
        </div>
        <div class="card-body">
          <p class="access-subtitle">Status persetujuan otorisasi modul pada aplikasi COMS-MBG</p>
          
          <div class="access-checklist">
            <div 
              v-for="mod in systemModules" 
              :key="mod.name" 
              class="checklist-item"
              :class="{ 'checklist-item--inactive': !mod.active }"
            >
              <span class="material-symbols-outlined checklist-icon" :class="{ 'checklist-icon--active': mod.active }">
                {{ mod.active ? 'check_circle' : 'cancel' }}
              </span>
              <span class="checklist-name">{{ mod.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── BELOW: SECTION 5: Ringkasan Aktivitas Sistem ── -->
      <div class="profile-card activity-card">
        <div class="card-header">
          <span class="material-symbols-outlined card-header__icon">analytics</span>
          <h3 class="card-header__title">Aktivitas Sistem</h3>
        </div>
        <div class="card-body">
          
          <!-- Loading Stats -->
          <div v-if="isLoadingStats" class="activity-loading">
            <span class="material-symbols-outlined loading-spinner">progress_activity</span>
            <p>Memuat aktivitas statistik...</p>
          </div>

          <!-- Super Admin Stats Grid -->
          <div v-else-if="user.role_type === 'super_admin' && statsData" class="stats-grid">
            <div class="stat-card">
              <div class="stat-card__icon bg-primary-light">
                <span class="material-symbols-outlined text-primary">domain</span>
              </div>
              <div class="stat-card__content">
                <span class="stat-card__number">{{ statsData.total_sppg || 0 }}</span>
                <span class="stat-card__label">Total SPPG Terdaftar</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-card__icon bg-success-light">
                <span class="material-symbols-outlined text-success">school</span>
              </div>
              <div class="stat-card__content">
                <span class="stat-card__number">{{ statsData.total_partners || 0 }}</span>
                <span class="stat-card__label">Sekolah Mitra Aktif</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-card__icon bg-warning-light">
                <span class="material-symbols-outlined text-warning">restaurant_menu</span>
              </div>
              <div class="stat-card__content">
                <span class="stat-card__number">{{ statsData.total_daily_portions?.toLocaleString('id-ID') || 0 }}</span>
                <span class="stat-card__label">Porsi Harian Disuplai</span>
              </div>
            </div>
          </div>

          <!-- Non-Admin / Empty State -->
          <div v-else class="activity-empty-state">
            <span class="material-symbols-outlined empty-icon">dashboard_customize</span>
            <div class="empty-text">
              <span class="title">Ringkasan Unit Operasional</span>
              <span class="desc">
                {{ user.role_type === 'super_admin' ? 'Data aktivitas gagal dimuat dari server.' : 'Data ringkasan statistik nasional hanya dapat diakses oleh peran Administrator Pusat.' }}
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Fallback Loading -->
    <div v-else class="profile-loading-fallback">
      <span class="material-symbols-outlined loading-spinner">progress_activity</span>
      <p>Memuat data profil akun...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useSuperAdminDashboard } from '@/composables/useSuperAdminDashboard'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isSuperAdmin = computed(() => authStore.isSuperAdmin)

const statsData = ref<any>(null)
const isLoadingStats = ref(false)

onMounted(async () => {
  if (!authStore.user) {
    await authStore.restoreSession()
  }

  // Fetch dashboard stats if user is super_admin
  if (isSuperAdmin.value) {
    isLoadingStats.value = true
    try {
      const dashboard = useSuperAdminDashboard()
      await dashboard.loadAllDashboardData()
      statsData.value = dashboard.dashboardStats.value
    } catch (err) {
      console.error('Failed to load dashboard stats for profile:', err)
    } finally {
      isLoadingStats.value = false
    }
  }
})

// Generate initials for avatar fallback (limit size, clean fallback)
const nameInitials = computed(() => {
  const currentUser = user.value
  if (!currentUser || !currentUser.name) return 'U'
  const parts = currentUser.name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})

// System Description 1-sentence mapping
const systemDescription = computed(() => {
  if (user.value?.role_type === 'super_admin') {
    return 'Administrator pusat dengan akses penuh ke seluruh modul operasional.'
  }
  return `Staf unit dengan wewenang terbatas pada operasional dapur ${user.value?.sppg?.name || 'terkait'}.`
})

// Mapped checklist of system modules based on actual permissions
const systemModules = computed(() => {
  return [
    { name: 'Dashboard Nasional', active: authStore.hasPermission('dashboard.read') },
    { name: 'Manajemen SPPG', active: authStore.hasPermission('sppg.read') },
    { name: 'Manajemen Sekolah', active: authStore.hasPermission('school.read') || authStore.hasPermission('partner.read') },
    { name: 'Pengajuan SPPG', active: authStore.hasPermission('sppg.create') },
    { name: 'Keuangan', active: authStore.hasPermission('finance.read') },
    { name: 'Peta Rekomendasi', active: authStore.hasPermission('report.read') },
    { name: 'Administrasi Sistem', active: isSuperAdmin.value || authStore.hasPermission('employee.read') }
  ]
})
</script>

<style scoped lang="scss">
.profile-page {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.profile-layout {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

// ── Generic Card Base ──
.profile-card {
  @include card-base($radius-lg, $shadow-xs);
  border: 1px solid $color-border;
  background-color: $color-bg-surface;
  overflow: hidden;
}

.card-header {
  border-bottom: 1px solid $color-border-light;
  padding: $space-4 $space-5;
  display: flex;
  align-items: center;
  gap: $space-2-5;

  &__icon {
    font-size: 1.25rem;
    color: $color-primary;
  }

  &__title {
    margin: 0;
    font-size: $text-base;
    font-weight: 700;
    color: $color-text-primary;
  }
}

.card-body {
  padding: $space-5;
}

// ── SECTION 1: Profile Header Card ──
.header-card {
  background: linear-gradient(120deg, #1a56db 0%, #1145b0 60%, #0d3a96 100%);
  border: none;
  padding: $space-6 $space-8;

  &__inner {
    display: flex;
    align-items: center;
    gap: $space-5;
    flex-wrap: wrap;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: flex-start;
      gap: $space-4;
    }
  }

  &__avatar-wrap {
    flex-shrink: 0;
  }

  &__identity {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__spacer {
    flex: 1;
  }

  &__badges {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $space-2;

    @media (max-width: 640px) {
      flex-direction: row;
      align-items: center;
    }
  }
}

// Text elements inside header (all white on blue)
.user-name {
  margin: 0;
  font-size: $text-2xl;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
}

.user-role {
  margin: 0;
  font-size: $text-sm;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.78);
}

.user-email {
  margin: 0;
  font-size: $text-xs;
  color: rgba(255, 255, 255, 0.55);
  font-family: $font-mono;
}

// Avatar Styles
.avatar-initials {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  border: 3px solid rgba(255, 255, 255, 0.5);
  letter-spacing: 0.05em;
}

.avatar-img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  border: 3px solid rgba(255, 255, 255, 0.5);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.badge-pill {
  padding: 2px $space-3;
  border-radius: $radius-pill;
  display: inline-flex;
  align-items: center;
  gap: $space-1.5;
}

// Custom role badge — white text, semi-transparent bg (visible over blue banner)
.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px $space-3;
  border-radius: $radius-pill;
  background-color: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-size: $text-xs;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: $color-danger;

  &--active {
    background-color: $color-success;
  }
}

// ── 2 COLUMN LAYOUT (DESKTOP) ──
.profile-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-5;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.info-card {
  height: 100%;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-5;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: $space-4;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: $space-1.5;
  padding: $space-3 0;
  border-bottom: 1px solid $color-border-light;

  &__label {
    font-size: 0.6875rem;
    font-weight: 700;
    color: $color-text-faint;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__value {
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-primary;
    line-height: 1.35;
  }
}

.status-indicator {
  font-weight: 700;
  font-size: $text-sm;
}

// System Description 1-sentence block
.system-desc {
  display: flex;
  align-items: flex-start;
  gap: $space-2-5;
  margin-top: $space-5;
  padding: $space-3 $space-4;
  background-color: $color-bg-subtle;
  border-radius: $radius-md;
  border: 1px solid $color-border-light;

  .desc-icon {
    font-size: 1.15rem;
    color: $color-primary;
    margin-top: 2px;
  }

  .desc-text {
    margin: 0;
    font-size: $text-xs;
    color: $color-text-secondary;
    line-height: 1.5;
  }
}

// ── SECTION 4: Hak Akses Checklist ──
.access-subtitle {
  margin: 0 0 $space-4 0;
  font-size: $text-xs;
  color: $color-text-muted;
}

.access-checklist {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $space-4;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  background-color: $color-bg-subtle;
  border: 1px solid $color-border-light;
  border-radius: $radius-md;
  transition: all $transition-fast;
  min-height: 52px;

  &:hover {
    background-color: $color-primary-light;
    border-color: $color-primary-muted;
  }

  &--inactive {
    opacity: 0.65;
    background-color: $color-bg-muted;

    &:hover {
      background-color: $color-bg-muted;
      border-color: $color-border-light;
    }
  }

  .checklist-icon {
    font-size: 1.35rem;
    color: $color-text-faint;
    flex-shrink: 0;

    &--active {
      color: $color-success;
    }
  }

  .checklist-name {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-text-secondary;
    line-height: 1.3;
  }
}

// ── SECTION 5: Ringkasan Aktivitas ──
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $space-5;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-5 $space-5;
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  background-color: $color-bg-subtle;
  transition: box-shadow $transition-fast;

  &:hover {
    box-shadow: $shadow-sm;
  }

  &__icon {
    width: 52px;
    height: 52px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    span {
      font-size: 1.5rem;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  &__number {
    font-size: $text-2xl;
    font-weight: 800;
    color: $color-text-primary;
    line-height: 1.1;
  }

  &__label {
    font-size: $text-xs;
    color: $color-text-muted;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    line-height: 1.4;
  }
}

// Icon Background Utilities
.bg-primary-light { background-color: $color-primary-light; }
.bg-success-light { background-color: $color-success-subtle; }
.bg-warning-light { background-color: $color-warning-subtle; }

// Compact Empty State
.activity-empty-state {
  display: flex;
  align-items: center;
  gap: $space-4;
  background-color: $color-bg-subtle;
  border: 1px dashed $color-border;
  border-radius: $radius-lg;
  padding: $space-4 $space-5;

  .empty-icon {
    font-size: 2rem;
    color: $color-text-faint;
  }

  .empty-text {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .title {
      font-size: $text-sm;
      font-weight: 700;
      color: $color-text-primary;
    }

    .desc {
      font-size: $text-xs;
      color: $color-text-muted;
      line-height: 1.4;
    }
  }
}

// Activity Loading
.activity-loading {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-2;
  color: $color-text-muted;

  .loading-spinner {
    font-size: 1.25rem;
    animation: spin 1s linear infinite;
    color: $color-primary;
  }

  p {
    margin: 0;
    font-size: $text-xs;
  }
}

// Fallback Loading Full Page
.profile-loading-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-12;
  gap: $space-4;
  color: $color-text-muted;

  .loading-spinner {
    font-size: 2.25rem;
    animation: spin 1s linear infinite;
    color: $color-primary;
  }

  p {
    margin: 0;
    font-size: $text-sm;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// Text Helper Overrides
.font-semibold { font-weight: 600; }
.font-mono { font-family: $font-mono; font-size: $text-xs; }
.text-primary { color: $color-primary; }
.text-success { color: $color-success; }
.text-warning { color: $color-warning; }
.text-uppercase { text-transform: uppercase; }
.text-xxs { font-size: $text-xs; } // fallback override helper
</style>
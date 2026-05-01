<template>
  <aside class="sidebar" :class="{ 'sidebar--open': isOpen, 'sidebar--collapsed': !isOpen }">

    <!-- ── Floating Edge Toggle Button ── -->
    <button class="edge-toggle-btn" @click="$emit('toggle')" aria-label="Toggle Sidebar">
      <span class="material-symbols-outlined">{{ isOpen ? 'chevron_left' : 'chevron_right' }}</span>
    </button>

    <!-- Inner wrapper untuk menyembunyikan scroll horizontal tanpa memotong tombol floating -->
    <div class="sidebar-inner">
      <!-- ── Logo / Brand ── -->
      <div class="sidebar-brand">
        <div class="brand-logo">
          <img src="" alt="MBG Logo" class="brand-img" />
        </div>
        <div class="brand-info">
          <span class="brand-name">MBG Bandung</span>
          <span class="brand-sub">ENTERPRISE SCM</span>
        </div>
        
        <!-- Mobile Close -->
        <button class="close-btn" @click="$emit('close')" aria-label="Tutup Sidebar">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

    <!-- ── Menu Utama ── -->
    <nav class="sidebar-nav">
      <template v-for="item in sidebarMenu" :key="item.id">

        <!-- Jika Menu Tidak Punya Children -->
        <template v-if="!item.children">
          <RouterLink
            :to="{ name: item.routeName }"
            class="nav-item"
            active-class=""
            exact-active-class="active"
          >
            <span class="material-symbols-outlined nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.title }}</span>
            <span class="nav-indicator"></span>
          </RouterLink>
        </template>

        <!-- Jika Menu Punya Children -->
        <template v-else>
          <!-- Parent Menu Toggle -->
          <div
            class="nav-item has-children"
            :class="{ 'parent-active': isParentActive(item), 'is-open': openMenus[item.id] }"
            @click="toggleMenu(item.id)"
          >
            <span class="material-symbols-outlined nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.title }}</span>
            <span class="material-symbols-outlined chevron-icon">
              expand_more
            </span>
          </div>

          <!-- Child Menus (Collapsible) -->
          <Transition name="slide" @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
            <div class="sub-menu" v-show="openMenus[item.id]">
              <RouterLink
                v-for="child in item.children"
                :key="child.id"
                :to="{ name: child.routeName }"
                class="sub-item"
                active-class=""
                exact-active-class="active"
              >
                <span class="sub-indicator"></span>
                <span class="sub-label">{{ child.title }}</span>
              </RouterLink>
            </div>
          </Transition>
        </template>

      </template>
    </nav>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { sidebarMenu, type MenuItem } from '@/config/sidebarMenu'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggle'): void
}>()

const route = useRoute()

// State untuk multiple open menus
const openMenus = ref<Record<string, boolean>>({})

function toggleMenu(id: string) {
  openMenus.value[id] = !openMenus.value[id]
}

// Cek apakah ada child route yang aktif
function isParentActive(item: MenuItem): boolean {
  if (item.routeName === route.name) return true
  if (item.children) {
    return item.children.some(child => child.routeName === route.name)
  }
  return false
}

// Buka otomatis parent jika salah satu child-nya aktif saat halaman dimuat
onMounted(() => {
  sidebarMenu.forEach(item => {
    if (item.children && isParentActive(item)) {
      openMenus.value[item.id] = true
    }
  })
})

// Buka otomatis parent jika rute berpindah ke salah satu child-nya
watch(() => route.name, () => {
  sidebarMenu.forEach(item => {
    if (item.children && isParentActive(item)) {
      openMenus.value[item.id] = true
    }
  })
  
  // Tutup sidebar di tampilan mobile/tablet jika rute berubah
  if (window.innerWidth <= 991) {
    emit('close')
  }
})

// ── Transition Hooks ──
function onBeforeEnter(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = '0'
  htmlEl.style.opacity = '0'
}

function onEnter(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  htmlEl.style.opacity = '1'
  // Bersihkan height setelah transisi agar tidak fix
  setTimeout(() => {
    htmlEl.style.height = 'auto'
  }, 300) // Waktu sesuai durasi CSS transisi
}

function onLeave(el: Element) {
  const htmlEl = el as HTMLElement
  // Set height explicit sebelum animasinya dimulai
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  // Trick browser flow
  htmlEl.offsetHeight 
  htmlEl.style.height = '0'
  htmlEl.style.opacity = '0'
}
</script>

<style scoped lang="scss">
// ── Sidebar shell ──
.sidebar {
  width: $sidebar-width;
  min-width: $sidebar-width;
  height: 100vh;
  background-color: $color-bg-surface;
  border-right: 1px solid $color-border-light;
  position: sticky;
  top: 0;
  flex-shrink: 0;
  transition: transform $transition-base, width $transition-base;
  z-index: calc(#{$z-navbar} + 10);
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

// ── Floating Edge Toggle Button ──
.edge-toggle-btn {
  display: none; // Default hidden on mobile
  position: absolute;
  top: 24px;
  right: -12px;
  width: 24px;
  height: 24px;
  background-color: $color-bg-surface;
  border: 1px solid $color-border-light;
  border-radius: 6px;
  box-shadow: $shadow-sm;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  color: $color-text-secondary;
  transition: right $transition-base;

  &:hover {
    color: $color-primary;
    background-color: $color-bg-subtle;
  }

  .material-symbols-outlined {
    font-size: 1.125rem; // Sedikit lebih kecil agar rapi
    font-weight: 500;
  }
}

// Hanya tampil di desktop
@media (min-width: 992px) {
  .edge-toggle-btn {
    display: flex;
  }
}

// ── Responsive Mobile / Tablet ──
@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%); // Hidden by default
  }

  .sidebar.sidebar--open {
    transform: translateX(0); // Show when open
    box-shadow: $shadow-lg;
  }
}

// ── Desktop Collapsed State ──
@media (min-width: 992px) {
  .sidebar.sidebar--collapsed {
    width: 80px;
    min-width: 80px;

    .brand-info,
    .nav-label,
    .chevron-icon,
    .sub-menu {
      display: none !important;
    }

    .sidebar-brand {
      justify-content: center;
      padding: 0 0.5rem;
      gap: 0;
    }

    .nav-item {
      justify-content: center;
      padding-left: 0;
      padding-right: 0;
    }
    
    .nav-icon {
      margin: 0;
    }
  }
}

// ── Brand area ──
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 $space-4;
  height: $navbar-height;
  border-bottom: 1px solid $color-border-subtle;
  position: relative;
}

.close-btn {
  display: none;
  background: none;
  border: none;
  color: $color-text-muted;
  margin-left: auto;
  padding: $space-1;
  border-radius: $radius-md;
  cursor: pointer;
  
  &:hover {
    background-color: $color-bg-subtle;
    color: $color-primary;
  }
}

@media (max-width: 991px) {
  .close-btn {
    display: block;
  }
}

.brand-logo {
  width: 2.25rem;
  height: 2.25rem;
  background-color: $color-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.3s ease;

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

// ── Nav Item (Parent / Standalone) ──
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
  user-select: none;

  &:hover {
    background-color: $color-primary-light;
    color: $color-primary;
    .nav-icon { color: $color-primary; }
  }

  // Standalone Active
  &.active, &.parent-active {
    color: $color-primary;
    font-weight: 600;

    .nav-icon { color: $color-primary; }
  }

  &.active {
    background-color: $color-primary-light;

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

  // Parent toggler chevron
  .chevron-icon {
    margin-left: auto;
    font-size: 1.125rem;
    transition: transform $transition-base;
    color: $color-text-faint;
  }

  &.is-open .chevron-icon {
    transform: rotate(180deg);
  }
}

.nav-indicator { display: none; }

.nav-icon {
  font-size: 1.25rem;
  color: $color-text-faint;
  flex-shrink: 0;
  line-height: 1;
  transition: color $transition-fast;
}

.nav-label {
  @include truncate;
}

// ── Sub Menu ──
.sub-menu {
  display: flex;
  flex-direction: column;
  background-color: $color-bg-surface;
  border-bottom: 1px solid $color-border-light;
  overflow: hidden;
}

.sub-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5rem $space-4 0.5rem 2.75rem;
  gap: 0.625rem;
  font-family: $font-body;
  font-size: 0.875rem;
  color: $color-text-muted;
  text-decoration: none;
  transition: background-color $transition-fast, color $transition-fast;

  &:hover {
    color: $color-primary;
    background-color: $color-primary-light;
    .sub-indicator {
      border-color: $color-primary;
    }
  }

  &.active {
    color: $color-primary;
    font-weight: 600;
    background-color: $color-primary-light;

    .sub-indicator {
      background-color: $color-primary;
      border-color: $color-primary;
    }
  }
}

.sub-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1.5px solid $color-border;
  background-color: transparent;
  flex-shrink: 0;
  transition: all $transition-fast;
}

.sub-label {
  line-height: 1.3;
}

// ── Slide Transition untuk Submenu ──
.slide-enter-active,
.slide-leave-active {
  transition: height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  height: 0;
  opacity: 0;
}
</style>

<template>
  <aside class="sidebar" :class="{ 'sidebar--open': isOpen, 'sidebar--collapsed': !isOpen }">

    <button class="edge-toggle-btn" @click="$emit('toggle')" aria-label="Toggle Sidebar">
      <span class="material-symbols-outlined">{{ isOpen ? 'chevron_left' : 'chevron_right' }}</span>
    </button>

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
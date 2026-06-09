<template>
  <div class="login-content">

    <!-- ── Loading Overlay ── -->
    <BaseLoadingOverlay
      :show="isLoading"
      text="Sedang masuk…"
    />

    <!-- ── Logo / Brand ── -->
    <div class="brand">
      <img src="/images/Logo_bgn.png" alt="Logo BGN" class="brand-logo" />
      <div class="brand-text">
        <span class="brand-name">MBG Bandung</span>
        <span class="brand-sub">Badan Gizi Nasional</span>
      </div>
    </div>

    <!-- ── Judul ── -->
    <h1 class="title">Selamat Datang Kembali</h1>
    <p class="subtitle">Masuk untuk mengakses dasbor operasional Anda.</p>

    <!-- ── Error Banner ── -->
    <BaseAlert
      :show="!!error"
      :variant="errorVariant"
      :message="error || ''"
      dismissible
      @close="clearError()"
      style="margin-bottom: 1rem;"
    />

    <!-- ── Form Login ── -->
    <form class="form" @submit.prevent="handleLogin" novalidate>

      <!-- Input Email -->
      <div class="field" :class="{ 'field--error': v.email }">
        <label class="field-label" for="email">Email</label>
        <div class="input-pill" :class="{ 'input-pill--error': v.email }">
          <span class="material-symbols-outlined input-icon">mail</span>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="nama@perusahaan.com"
            autocomplete="email"
            :disabled="isLoading"
            @input="clearError(); v.email = ''"
          />
        </div>
        <span v-if="v.email" class="field-error-msg">{{ v.email }}</span>
      </div>

      <!-- Input Password -->
      <div class="field" :class="{ 'field--error': v.password }">
        <label class="field-label" for="password">Kata Sandi</label>
        <div class="input-pill" :class="{ 'input-pill--error': v.password }">
          <span class="material-symbols-outlined input-icon">lock</span>
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            autocomplete="current-password"
            :disabled="isLoading"
            @input="clearError(); v.password = ''"
          />
          <!-- Toggle show/hide password -->
          <button
            type="button"
            class="toggle-pwd"
            :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
            @click="showPassword = !showPassword"
          >
            <span class="material-symbols-outlined">
              {{ showPassword ? 'visibility_off' : 'visibility' }}
            </span>
          </button>
        </div>
        <span v-if="v.password" class="field-error-msg">{{ v.password }}</span>
      </div>

      <!-- Remember Me -->
      <div class="options-row">
        <label class="remember">
          <input type="checkbox" v-model="rememberMe" :disabled="isLoading" />
          <span>Ingat Saya</span>
        </label>
        <a href="#" class="forgot">Lupa Kata Sandi?</a>
      </div>

      <!-- Tombol Login -->
      <button
        class="btn-masuk"
        type="submit"
        :disabled="isLoading"
        :class="{ 'btn-masuk--loading': isLoading }"
      >
        <span v-if="!isLoading">Masuk</span>
        <span v-else class="btn-spinner">
          <span></span><span></span><span></span>
        </span>
      </button>
    </form>

    <!-- ── Divider ── -->
    <div class="divider">
      <span class="divider-text">Atau masuk dengan</span>
    </div>

    <!-- ── Google SSO (placeholder, belum fungsional) ── -->
    <button class="btn-google" type="button" :disabled="isLoading">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09a6.6 6.6 0 010-4.18V7.07H2.18A11 11 0 001 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      <span>Lanjutkan dengan Google</span>
    </button>

    <!-- ── Hint akun dev ── -->
    <div class="dev-hint">
      <span class="material-symbols-outlined">info</span>
      <span>Dev: <strong>superadmin@sppg.test</strong> / <strong>password123</strong></span>
    </div>

    <!-- ── Footer Links ── -->
    <footer class="footer-links">
      <a href="#">Kebijakan Privasi</a>
      <a href="#">Bantuan</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { storageService } from '@/services/storageService'
import type { LoginRequest } from '@/types/auth'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseLoadingOverlay from '@/components/common/BaseLoadingOverlay.vue'

const router = useRouter()
const route  = useRoute()
const { isLoading, error, login, clearError, isSuperAdmin } = useAuth()

const showPassword = ref(false)
const rememberMe   = ref(false)

const form = reactive<LoginRequest>({
  email:    '',
  password: '',
})

// Pre-fill email from localStorage if user previously checked "Remember Me"
onMounted(() => {
  const savedEmail = storageService.getRememberedEmail()
  if (savedEmail) {
    form.email = savedEmail
    rememberMe.value = true
  }
})

// Client-side validation
const v = reactive({ email: '', password: '' })

// 403 (account deactivated) //
const errorVariant = computed(() => {
  if (error.value?.includes('dinonaktifkan')) return 'warning'
  return 'error'
})

function validate(): boolean {
  v.email    = ''
  v.password = ''
  let ok = true

  if (!form.email) {
    v.email = 'Email wajib diisi.'
    ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    v.email = 'Format email tidak valid.'
    ok = false
  }

  if (!form.password) {
    v.password = 'Kata sandi wajib diisi.'
    ok = false
  } else if (form.password.length < 6) {
    v.password = 'Kata sandi minimal 6 karakter.'
    ok = false
  }

  return ok
}

async function handleLogin() {
  if (!validate()) return

  try {
    await login({
      email:    form.email,
      password: form.password,
      remember: rememberMe.value,
    })

    // Handle Frontend UX Persistence for "Remember Me"
    if (rememberMe.value) {
      storageService.setRememberedEmail(form.email)
    } else {
      storageService.clearRememberedEmail()
    }

    const defaultRoute = isSuperAdmin.value ? '/super-admin' : '/dashboard'
    const redirectTo = (route.query.redirect as string) || defaultRoute
    router.push(redirectTo)
  } catch {
    
  }
}
</script>

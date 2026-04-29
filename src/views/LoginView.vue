<template>
  <div class="login-content">

    <!-- ── Loading Overlay ── -->
    <Transition name="fade">
      <div v-if="authStore.isLoading" class="loading-overlay" aria-live="polite" aria-busy="true">
        <div class="loader-ring">
          <div></div><div></div><div></div><div></div>
        </div>
        <p class="loader-text">Sedang masuk…</p>
      </div>
    </Transition>

    <!-- ── Logo / Brand ── -->
    <div class="brand">
      <div class="brand-icon">
        <span class="material-symbols-outlined">layers</span>
      </div>
      <span class="brand-name">MBG Bandung</span>
    </div>

    <!-- ── Judul ── -->
    <h1 class="title">Selamat Datang Kembali</h1>
    <p class="subtitle">Masuk untuk mengakses dasbor operasional Anda.</p>

    <!-- ── Error Banner ── -->
    <Transition name="slide-down">
      <div v-if="authStore.error" class="error-banner" role="alert">
        <span class="material-symbols-outlined error-icon">error</span>
        <span class="error-msg">{{ authStore.error }}</span>
        <button class="error-close" @click="authStore.clearError()" aria-label="Tutup">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </Transition>

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
            :disabled="authStore.isLoading"
            @input="authStore.clearError(); v.email = ''"
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
            :disabled="authStore.isLoading"
            @input="authStore.clearError(); v.password = ''"
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
          <input v-model="form.remember" type="checkbox" :disabled="authStore.isLoading" />
          <span>Ingat Saya</span>
        </label>
        <a href="#" class="forgot">Lupa Kata Sandi?</a>
      </div>

      <!-- Tombol Login -->
      <button
        class="btn-masuk"
        type="submit"
        :disabled="authStore.isLoading"
        :class="{ 'btn-masuk--loading': authStore.isLoading }"
      >
        <span v-if="!authStore.isLoading">Masuk</span>
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
    <button class="btn-google" type="button" :disabled="authStore.isLoading">
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
      <span>Dev: <strong>admin@mbgbandung.id</strong> / <strong>password</strong></span>
    </div>

    <!-- ── Footer Links ── -->
    <footer class="footer-links">
      <a href="#">Kebijakan Privasi</a>
      <a href="#">Bantuan</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types/auth'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()

const showPassword = ref(false)

const form = reactive<LoginCredentials>({
  email:    '',
  password: '', 
  remember: false,
})

// Validasi sederhana (client-side)
const v = reactive({ email: '', password: '' })

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
    await authStore.login({
      email:    form.email,
      password: form.password,
      remember: form.remember,
    })

    // Redirect ke halaman asal (jika ada query ?redirect=) atau dashboard
    const redirectTo = (route.query.redirect as string) || '/dashboard'
    router.push(redirectTo)
  } catch {
    // Error sudah dihandle di store → authStore.error sudah terisi
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');

/* ── Wrapper konten ── */
.login-content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 3rem 2.75rem 2.25rem;
  box-sizing: border-box;
  overflow: hidden;
}

/* ── Loading Overlay ── */
.loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: inherit;
}

/* Ring loader */
.loader-ring {
  width: 48px;
  height: 48px;
  position: relative;
}
.loader-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #1a56db;
  border-radius: 50%;
  animation: spin 0.9s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite;
}
.loader-ring div:nth-child(2) {
  animation-delay: -0.3s;
  border-top-color: rgba(26, 86, 219, 0.45);
}
.loader-ring div:nth-child(3) {
  animation-delay: -0.15s;
  border-top-color: rgba(26, 86, 219, 0.2);
}
.loader-ring div:nth-child(4) { display: none; }

@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* ── Brand ── */
.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 2rem;
}
.brand-icon {
  width: 2.25rem;
  height: 2.25rem;
  background-color: #1a56db;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.brand-icon .material-symbols-outlined { font-size: 1.25rem; color: #fff; }
.brand-name {
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 1.0625rem;
  color: #111827;
  letter-spacing: -0.01em;
}

/* ── Judul ── */
.title {
  font-family: 'Manrope', sans-serif;
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: #111827;
  margin: 0 0 0.375rem;
}
.subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
  line-height: 1.5;
}

/* ── Error Banner ── */
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: #b91c1c;
  font-family: 'Inter', sans-serif;
}
.error-icon { font-size: 1.125rem; flex-shrink: 0; }
.error-msg  { flex: 1; line-height: 1.4; }
.error-close {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #b91c1c;
  display: flex;
  align-items: center;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.error-close:hover { opacity: 1; }
.error-close .material-symbols-outlined { font-size: 1rem; }

/* ── Form ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.field-label {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6b7280;
  margin-left: 0.25rem;
}
.field--error .field-label { color: #b91c1c; }

.field-error-msg {
  font-size: 0.75rem;
  color: #dc2626;
  margin-left: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%       { transform: translateX(-4px); }
  75%       { transform: translateX(4px); }
}

/* ── Input Pill ── */
.input-pill {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background-color: #f0f2f5;
  border-radius: 999px;
  border: 1.5px solid transparent;
  padding: 0 1.25rem;
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
}
.input-pill:focus-within {
  border-color: #1a56db;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.1);
}
.input-pill--error {
  border-color: #f87171 !important;
  background-color: #fff5f5 !important;
}
.input-icon {
  font-size: 1.125rem;
  color: #9ca3af;
  flex-shrink: 0;
  user-select: none;
  line-height: 1;
}
.input-pill input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #111827;
  padding: 0.8125rem 0;
  outline: none;
  min-width: 0;
}
.input-pill input::placeholder { color: #9ca3af; }
.input-pill input:disabled { opacity: 0.6; cursor: not-allowed; }

.toggle-pwd {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  transition: color 0.15s;
  flex-shrink: 0;
}
.toggle-pwd:hover { color: #1a56db; }
.toggle-pwd .material-symbols-outlined { font-size: 1.125rem; }

/* ── Options Row ── */
.options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
  margin-top: 0.125rem;
}
.remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
}
.remember input[type='checkbox'] {
  width: 1rem;
  height: 1rem;
  accent-color: #1a56db;
  cursor: pointer;
}
.forgot { color: #1a56db; font-weight: 600; text-decoration: none; }
.forgot:hover { text-decoration: underline; }

/* ── Tombol Masuk ── */
.btn-masuk {
  width: 100%;
  background: linear-gradient(135deg, #1a56db 0%, #1145b0 100%);
  color: #fff;
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 0.9375rem;
  border: none;
  border-radius: 999px;
  padding: 0.875rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(26, 86, 219, 0.35);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  margin-top: 0.25rem;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-masuk:hover:not(:disabled) {
  opacity: 0.93;
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(26, 86, 219, 0.42);
}
.btn-masuk:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Dot spinner di dalam tombol */
.btn-spinner {
  display: flex;
  gap: 5px;
  align-items: center;
}
.btn-spinner span {
  width: 7px;
  height: 7px;
  background: #fff;
  border-radius: 50%;
  animation: dot-bounce 1.2s infinite ease-in-out;
}
.btn-spinner span:nth-child(1) { animation-delay: 0s; }
.btn-spinner span:nth-child(2) { animation-delay: 0.2s; }
.btn-spinner span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
  40%            { transform: scale(1);   opacity: 1; }
}

/* ── Divider ── */
.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}
.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0; right: 0;
  border-top: 1px solid #e5e7eb;
}
.divider-text {
  position: relative;
  background-color: #fff;
  padding: 0 0.875rem;
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #9ca3af;
}

/* ── Google SSO ── */
.btn-google {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  background-color: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.75rem 1.25rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.btn-google:hover:not(:disabled) {
  background-color: #f9fafb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transform: translateY(-1px);
}
.btn-google:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Dev hint ── */
.dev-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 1rem;
  padding: 0.5rem 0.875rem;
  background: #eff6ff;
  border: 1px dashed #bfdbfe;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #3b82f6;
}
.dev-hint .material-symbols-outlined { font-size: 0.9375rem; }
.dev-hint strong { color: #1d4ed8; }

/* ── Footer Links ── */
.footer-links {
  margin-top: auto;
  padding-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}
.footer-links a {
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.15s;
}
.footer-links a:hover { color: #1a56db; }

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

.slide-down-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>

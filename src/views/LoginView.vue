<template>
  <!-- LOGIN VIEW — hanya berisi konten form (dirender di dalam AuthLayout via router-view) -->
  <div class="login-content">
      <!-- Logo / Brand -->
      <div class="brand">
        <div class="brand-icon">
          <span class="material-symbols-outlined">layers</span>
        </div>
        <span class="brand-name">MBG Bandung</span>
      </div>

      <!-- Judul -->
      <h1 class="title">Selamat Datang Kembali</h1>
      <p class="subtitle">Masuk untuk mengakses dasbor operasional Anda.</p>

      <!-- Form Login -->
      <form class="form" @submit.prevent="handleLogin">
        <!-- Input Email -->
        <div class="field">
          <label class="field-label">Email</label>
          <div class="input-pill">
            <span class="material-symbols-outlined input-icon">mail</span>
            <input
              v-model="form.email"
              type="email"
              placeholder="nama@perusahaan.com"
              autocomplete="email"
            />
          </div>
        </div>

        <!-- Input Password -->
        <div class="field">
          <label class="field-label">Kata Sandi</label>
          <div class="input-pill">
            <span class="material-symbols-outlined input-icon">lock</span>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>
        </div>

        <!-- Remember Me -->
        <div class="options-row">
          <label class="remember">
            <input v-model="form.remember" type="checkbox" />
            <span>Ingat Saya</span>
          </label>
          <a href="#" class="forgot">Lupa Kata Sandi?</a>
        </div>

        <!-- Tombol Login -->
        <button class="btn-masuk" type="submit">Masuk</button>
      </form>

      <!-- Divider -->
      <div class="divider">
        <span class="divider-text">Atau masuk dengan</span>
      </div>

      <!-- Google SSO -->
      <button class="btn-google" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09a6.6 6.6 0 010-4.18V7.07H2.18A11 11 0 001 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span>Lanjutkan dengan Google</span>
      </button>

      <!-- Footer Links -->
      <footer class="footer-links">
        <a href="#">Kebijakan Privasi</a>
        <a href="#">Bantuan</a>
      </footer>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

// Dummy login — langsung masuk tanpa validasi
function handleLogin() {
  router.push('/dashboard')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');

/* ── Wrapper konten kiri (padding diatur di sini) ── */
.login-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 3rem 2.75rem 2.25rem;
  box-sizing: border-box;
}

/* ── Brand / Logo ── */
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
.brand-icon .material-symbols-outlined {
  font-size: 1.25rem;
  color: #ffffff;
}
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
  margin: 0 0 1.75rem;
  line-height: 1.5;
}

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

/* ── Input Pill ── */
.input-pill {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background-color: #f0f2f5;
  border-radius: 999px;
  border: 1.5px solid transparent;
  padding: 0 1.25rem;
  transition: border-color 0.2s, background-color 0.2s;
}
.input-pill:focus-within {
  border-color: #1a56db;
  background-color: #ffffff;
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
.forgot {
  color: #1a56db;
  font-weight: 600;
  text-decoration: none;
}
.forgot:hover { text-decoration: underline; }

/* ── Tombol Masuk ── */
.btn-masuk {
  width: 100%;
  background: linear-gradient(135deg, #1a56db 0%, #1145b0 100%);
  color: #ffffff;
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
}
.btn-masuk:hover {
  opacity: 0.93;
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(26, 86, 219, 0.42);
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
  left: 0;
  right: 0;
  border-top: 1px solid #e5e7eb;
}
.divider-text {
  position: relative;
  background-color: #ffffff;
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
  background-color: #ffffff;
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
.btn-google:hover {
  background-color: #f9fafb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

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
</style>

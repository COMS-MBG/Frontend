/**
 * stores/auth.ts — Pinia Auth Store (Sanctum SPA Cookie-based)
 *
 * Karena autentikasi dikelola server via session cookie (bukan localStorage token),
 * store ini hanya menyimpan data USER di memori (reaktif).
 *
 * Untuk persistence saat refresh halaman: store memanggil fetchMe() yang
 * akan hit GET /api/user. Jika session cookie di browser masih valid,
 * server mengembalikan user. Jika tidak → 401 → clear store → redirect login.
 *
 * TIDAK ada token di localStorage / sessionStorage.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '@/types/auth'
import { login as apiLogin, logout as apiLogout, fetchMe } from '@/services/authService'

// Hanya simpan data user (bukan sesi/token) untuk keperluan UI
const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  // ── State ───────────────────────────────────────────────────────────────────
  const user      = ref<User | null>(null)
  const isLoading = ref(false)
  const error     = ref<string | null>(null)
  const initialized = ref(false)
  // ── Getters ─────────────────────────────────────────────────────────────────
  /**
   * isAuthenticated: true jika server session aktif (user ter-hydrate).
   * Kebenaran session yang sesungguhnya ada di server (cookie);
   * state lokal ini hanya refleksi untuk keperluan UI & route guard.
   */
  const isAuthenticated = computed(() => !!user.value)
  const fullName        = computed(() => user.value?.name ?? '')
  const userRole        = computed(() => user.value?.role ?? null)

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * initialize()
   *
   * Dipanggil SEKALI oleh route guard saat app pertama dibuka.
   * Mencoba fetchMe() untuk memverifikasi apakah session cookie masih valid.
   *
   * - Jika ya  → store terisi, user tetap di halaman yang dituju
   * - Jika tidak (401) → _clearSession(), redirect ke /login
   *
   * Cache ringan: gunakan localStorage hanya untuk pre-populate nama user
   * di UI agar tidak blank saat loading — tetap divalidasi ke server.
   */
  
  async function initialize(): Promise<void> {
    if (initialized.value) return
    const cached = localStorage.getItem(USER_KEY)
    // Pre-populate dari cache supaya UI tidak blank sebentar
    if (cached) {
      try {
        user.value = JSON.parse(cached) as User
      } catch {
        localStorage.removeItem(USER_KEY)
      }
    }

    try {
      isLoading.value = true
      // Validasi sesi ke server (GET /api/user menggunakan session cookie)
      const freshUser = await fetchMe()
      user.value = freshUser
      localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
    } catch {
      // Session tidak valid atau expired
      _clearLocal()
    } finally {
      isLoading.value = false
  initialized.value = true
    }
  }

  /**
   * login()
   *
   * Sanctum SPA flow:
   *  1. initCsrf() — server set XSRF-TOKEN cookie
   *  2. POST /login — server buat session & set laravel_session cookie
   *  3. GET  /api/user — ambil data user via session yang baru dibuat
   *
   * Tidak ada token yang disimpan di client.
   */
  async function login(credentials: LoginCredentials): Promise<void> {
    try {
      isLoading.value = true
      error.value     = null

      const response = await apiLogin(credentials)

      user.value = response.user
      initialized.value = true

      // Simpan data user ke localStorage hanya untuk UX (pre-populate saat reload)
      // Bukan sebagai bukti autentikasi — server lah yang memegang session.
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    } catch (err: unknown) {
      _clearLocal()
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Terjadi kesalahan yang tidak diketahui.'
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * logout()
   *
   * Sanctum SPA: POST /logout menghancurkan session di server.
   * Browser otomatis kehilangan session cookie yang valid.
   * Client cukup hapus cache lokal dan reset state.
   */
  async function logout(): Promise<void> {
    try {
      isLoading.value = true
      await apiLogout()
    } catch {
      // Tetap lanjut clear lokal meski request ke server gagal
    } finally {
      _clearLocal()
      isLoading.value = false
    }
  }

  /** Bersihkan pesan error */
  function clearError(): void {
    error.value = null
  }

  // ── Private ──────────────────────────────────────────────────────────────────
  function _clearLocal(): void {
    user.value = null
    error.value = null  
    localStorage.removeItem(USER_KEY)
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    fullName,
    userRole,
    initialize,
    login,
    logout,
    clearError,
  }
})

import type { LoginCredentials, LoginResponse, User } from '@/types/auth'
// import api, { initCsrf } from './api'   // ← uncomment saat backend Laravel siap

// ─────────────────────────────────────────────────────────────────────────────
// ── FAKE DATA (dev only) ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const FAKE_USERS: Array<{ user: User; password: string }> = [
  {
    user: {
      id: 1,
      name: 'Admin MBG',
      email: 'admin@mbgbandung.id',
      role: 'admin',
      avatar: '',
    },
    password: 'password',
  },
  {
    user: {
      id: 2,
      name: 'Operator Distribusi',
      email: 'operator@mbgbandung.id',
      role: 'operator',
      avatar: '',
    },
    password: 'password',
  },
]

/**
 * Simulasi sesi aktif di memori (menggantikan session cookie server).
 * Di production, server yang memegang state ini via laravel_session cookie.
 */
let _fakeSession: User | null = null

/** Simulasi network delay */
const fakeDelay = (ms = 800) => new Promise((r) => setTimeout(r, ms))

// ─────────────────────────────────────────────────────────────────────────────
// ── AUTH SERVICE ──────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  // ── FAKE IMPLEMENTATION ──────────────────────────────────────────────────
  await fakeDelay(900)

  const match = FAKE_USERS.find(
    (u) => u.user.email === credentials.email && u.password === credentials.password
  )

  if (!match) {
    const err = new Error('Kredensial tidak valid. Periksa email dan kata sandi Anda.')
    ;(err as Error & { status: number }).status = 401
    throw err
  }

  // Simpan "sesi" di memori (menggantikan cookie server)
  _fakeSession = match.user

  return { user: match.user }
  // ── END FAKE ─────────────────────────────────────────────────────────────
}

export async function logout(): Promise<void> {
  // ── FAKE IMPLEMENTATION ──────────────────────────────────────────────────
  await fakeDelay(400)
  _fakeSession = null
  // ── END FAKE ─────────────────────────────────────────────────────────────
}

export async function fetchMe(): Promise<User> {
  // ── FAKE IMPLEMENTATION ──────────────────────────────────────────────────
  await fakeDelay(300)
  if (!_fakeSession) throw new Error('Sesi tidak ditemukan.')
  return _fakeSession
  // ── END FAKE ─────────────────────────────────────────────────────────────
}
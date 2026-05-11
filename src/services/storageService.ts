const USER_KEY     = 'auth_user'
const LOGGED_IN_KEY = 'is_logged_in'

// ── Session Hint ───────────────────────────────────────────────────────────────

function isLoggedIn(): boolean {
  return localStorage.getItem(LOGGED_IN_KEY) === 'true'
}

function setLoggedIn(value: boolean): void {
  if (value) {
    localStorage.setItem(LOGGED_IN_KEY, 'true')
  } else {
    localStorage.removeItem(LOGGED_IN_KEY)
  }
}

// ── User Cache ─────────────────────────────────────────────────────────────────

function getUser<T>(): T | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

function setUser<T>(user: T): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// ── Bulk Operations ────────────────────────────────────────────────────────────

function clearAuth(): void {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(LOGGED_IN_KEY)
}

// ── Remember Email ─────────────────────────────────────────────────────────────

const REMEMBER_EMAIL_KEY = 'remember_email'

function getRememberedEmail(): string | null {
  return localStorage.getItem(REMEMBER_EMAIL_KEY)
}

function setRememberedEmail(email: string): void {
  localStorage.setItem(REMEMBER_EMAIL_KEY, email)
}

function clearRememberedEmail(): void {
  localStorage.removeItem(REMEMBER_EMAIL_KEY)
}

// ── Public API ─────────────────────────────────────────────────────────────────

export const storageService = {
  isLoggedIn,
  setLoggedIn,
  getUser,
  setUser,
  clearAuth,
  getRememberedEmail,
  setRememberedEmail,
  clearRememberedEmail,
}

export { USER_KEY, LOGGED_IN_KEY, REMEMBER_EMAIL_KEY }

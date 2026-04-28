<template>
  <footer class="app-footer">

    <!-- Kiri: Copyright -->
    <div class="footer-left">
      <span class="footer-logo-dot"></span>
      <span class="footer-copy">
        &copy; {{ currentYear }} <strong>MBG Bandung</strong> — Enterprise SCM
      </span>
    </div>

    <!-- Kanan: Versi & Link -->
    <div class="footer-right">
      <span class="footer-version">v1.0.0</span>
      <span class="footer-sep">·</span>
      <a href="#" class="footer-link">Kebijakan Privasi</a>
      <span class="footer-sep">·</span>
      <a href="#" class="footer-link">Bantuan</a>
    </div>

  </footer>
</template>

<script setup lang="ts">
// Tahun otomatis — satu-satunya komputasi, bukan business logic
const currentYear = new Date().getFullYear()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.app-footer {
  width: 100%;
  height: 44px;
  background-color: #ffffff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-sizing: border-box;
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
}

/* ── Kiri ── */
.footer-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.footer-logo-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #1a56db;
  flex-shrink: 0;
}
.footer-copy {
  font-size: 0.75rem;
  color: #9ca3af;
}
.footer-copy strong {
  color: #6b7280;
  font-weight: 600;
}

/* ── Kanan ── */
.footer-right {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}
.footer-version {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #d1d5db;
  background-color: #f3f4f6;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
}
.footer-sep {
  font-size: 0.75rem;
  color: #d1d5db;
}
.footer-link {
  font-size: 0.6875rem;
  font-weight: 500;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.15s;
}
.footer-link:hover {
  color: #1a56db;
}
</style>

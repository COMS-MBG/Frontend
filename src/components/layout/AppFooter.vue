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
const currentYear = new Date().getFullYear()
</script>

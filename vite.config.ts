import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Auto-import variables & mixins ke semua komponen Vue
        // Tidak perlu @use manual di setiap <style lang="scss">
        additionalData: `
          @use "@/assets/styles/abstracts/variables" as *;
          @use "@/assets/styles/abstracts/mixins" as *;
        `,
      },
    },
  },
})

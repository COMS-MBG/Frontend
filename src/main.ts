import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// ── Global Styles ──────────────────────────────────────────
import '@/assets/styles/styles.scss'   // Fonts + SCSS variables entry point

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

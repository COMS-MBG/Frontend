import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { configureAxios } from '@/api/axios'
import { useAuthStore } from '@/stores/auth.store'

// ── Global Styles ──────────────────────────────────────────
// Library CSS MUST load BEFORE our overrides in main.scss
import '@vuepic/vue-datepicker/dist/main.css'
import '@/assets/styles/main.scss'   

const app  = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// ── Configure Axios ── //
const authStore = useAuthStore()

configureAxios({
  onUnauthorized: () => {
    // Clear reactive state + browser storage
    authStore.clearAuth()

    // Redirect to login if not already there
    const currentRoute = router.currentRoute.value
    if (currentRoute.name !== 'login') {
      router.push({ name: 'login' })
    }
  },
})

app.mount('#app')

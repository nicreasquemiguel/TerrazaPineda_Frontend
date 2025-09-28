import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import App from './App.vue'
import router from './router'
import './style.css'
import VCalendar from 'v-calendar'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)
app.use(PrimeVue, { unstyled: true, pt: Aura })
app.use(VCalendar, {})
app.use(Toast, { position: POSITION.TOP_RIGHT, timeout: 3500 })

const authStore = useAuthStore()
if (authStore.accessToken && !authStore.user) {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    authStore.setUser(JSON.parse(storedUser))
  }
  authStore.fetchUser()
}

app.mount('#app') 
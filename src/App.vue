<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar v-if="!isAdminPage" />
    <main class="flex-1" :class="isAdminPage ? '' : 'pt-16'">
      <router-view />
    </main>
    <Footer v-if="!isAdminPage" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const ADMIN_ROUTES = ['/dashboard', '/reservas', '/actividad', '/configuracion']
const isAdminPage = computed(() => ADMIN_ROUTES.some(r => route.path === r || route.path.startsWith(r + '/')))

// Check token validity on app mount
onMounted(async () => {
  if (authStore.accessToken) {
    console.log('[App] Checking token validity on mount...')
    
    try {
      const isValid = await authStore.checkTokenValidity()
      if (!isValid) {
        console.log('[App] Token is invalid, user will be logged out')
      } else {
        console.log('[App] Token is valid')
      }
    } catch (error) {
      console.log('[App] Error checking token validity:', error)
      authStore.clearInvalidAuth()
    }
  }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 
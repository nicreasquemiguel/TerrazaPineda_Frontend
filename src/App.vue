<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main class="flex-1" style="padding-top: 4rem !important;">
      <router-view />
    </main>
    <Footer v-if="!isDashboard" />
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

// Hide navbar and footer on dashboard page
const isDashboard = computed(() => route.path === '/dashboard')

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
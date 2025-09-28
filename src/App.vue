<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main class="flex-1" :class="isDashboard ? 'pt-0 md:pl-80' : 'pt-16 md:pl-80'">
      <router-view />
    </main>
    <Footer v-if="!isDashboard" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()

// Hide navbar and footer on dashboard page
const isDashboard = computed(() => route.path === '/dashboard')
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
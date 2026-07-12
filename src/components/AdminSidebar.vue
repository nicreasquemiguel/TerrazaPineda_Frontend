<template>
  <!-- Desktop sidebar (md+) -->
  <div class="hidden md:flex fixed top-0 left-0 bottom-0 z-30 flex-col w-64 bg-black border-r border-gray-800">
    <!-- Brand -->
    <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-800">
      <img src="/tp.svg" alt="Logo" class="w-8 h-8" />
      <span class="text-sm font-bold text-white">Terraza Pineda</span>
      <span class="ml-auto text-xs text-gray-600 font-medium">Admin</span>
    </div>

    <!-- User Profile -->
    <div class="p-5 border-b border-gray-800">
      <div class="flex items-center space-x-3">
        <div class="flex justify-center items-center w-11 h-11 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex-shrink-0">
          <span class="text-base font-bold text-white">{{ userInitials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <router-link to="/perfil" class="block text-sm font-bold text-white truncate hover:text-blue-400 transition-colors">
            {{ userName }}
          </router-link>
          <div class="text-xs text-gray-400">{{ userRole }}</div>
        </div>
        <div class="flex flex-col flex-shrink-0 space-y-1">
          <button
            @click="router.push('/perfil?notifications=true')"
            class="relative p-1.5 text-gray-400 hover:text-white transition-colors"
            title="Notificaciones"
          >
            <i class="fa-solid fa-bell"></i>
            <div v-if="unreadCount > 0" class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
          </button>
          <button @click="handleLogout" class="p-1.5 text-gray-400 hover:text-red-400 transition-colors" title="Cerrar Sesión">
            <i class="fa-solid fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="overflow-y-auto flex-1 py-3">
      <nav class="px-3 space-y-0.5">
        <div class="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-600 uppercase">Panel Admin</div>
        <div
          v-for="item in adminItems"
          :key="item.path"
          @click="router.push(item.path)"
          class="flex items-center px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
          :class="isActive(item.path) ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
        >
          <i :class="item.icon + ' w-5 text-center mr-3 text-sm'"></i>
          <span class="text-sm font-medium">{{ item.label }}</span>
        </div>
        <div class="pt-3 pb-1"><div class="border-t border-gray-800"></div></div>
        <div
          @click="router.push('/')"
          class="flex items-center px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <i class="fa-solid fa-globe w-5 text-center mr-3 text-sm"></i>
          <span class="text-sm font-medium">Ver sitio</span>
        </div>
      </nav>
    </div>
  </div>

  <!-- Mobile top bar -->
  <div class="fixed top-0 left-0 right-0 z-40 flex items-center h-14 px-4 bg-black border-b border-gray-800 md:hidden">
    <img src="/tp.svg" alt="Logo" class="w-7 h-7 mr-2 flex-shrink-0" />
    <span class="text-sm font-bold text-white">Terraza Pineda</span>
    <span class="ml-1.5 text-xs text-gray-500 font-medium">Admin</span>
    <div class="ml-auto flex items-center gap-2">
      <button
        @click="router.push('/perfil?notifications=true')"
        class="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <i class="fa-solid fa-bell text-sm"></i>
        <div v-if="unreadCount > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
      </button>
      <button
        @click="showDrawer = !showDrawer"
        class="p-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Menú"
      >
        <i class="fa-solid fa-bars text-sm"></i>
      </button>
    </div>
  </div>

  <!-- Mobile drawer overlay -->
  <Transition name="fade">
    <div v-if="showDrawer" class="fixed inset-0 z-50 md:hidden" @click.self="showDrawer = false">
      <div class="absolute inset-0 bg-black/60" @click="showDrawer = false"></div>
      <!-- Drawer panel -->
      <div class="absolute top-0 left-0 bottom-0 w-72 bg-black flex flex-col shadow-2xl">
        <!-- Drawer header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div class="flex items-center gap-2">
            <img src="/tp.svg" alt="Logo" class="w-7 h-7" />
            <span class="text-sm font-bold text-white">Terraza Pineda</span>
          </div>
          <button @click="showDrawer = false" class="p-1.5 text-gray-400 hover:text-white transition-colors">
            <i class="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        <!-- User info -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
          <div class="flex justify-center items-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex-shrink-0">
            <span class="text-sm font-bold text-white">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-white truncate">{{ userName }}</div>
            <div class="text-xs text-gray-400">{{ userRole }}</div>
          </div>
        </div>

        <!-- Nav items -->
        <div class="overflow-y-auto flex-1 py-3">
          <nav class="px-3 space-y-0.5">
            <div class="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-600 uppercase">Panel Admin</div>
            <div
              v-for="item in adminItems"
              :key="item.path"
              @click="navigate(item.path)"
              class="flex items-center px-3 py-3 rounded-lg transition-colors cursor-pointer"
              :class="isActive(item.path) ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <i :class="item.icon + ' w-5 text-center mr-3 text-sm'"></i>
              <span class="text-sm font-medium">{{ item.label }}</span>
            </div>
            <div class="pt-3 pb-1"><div class="border-t border-gray-800"></div></div>
            <div @click="navigate('/')" class="flex items-center px-3 py-3 rounded-lg transition-colors cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white">
              <i class="fa-solid fa-globe w-5 text-center mr-3 text-sm"></i>
              <span class="text-sm font-medium">Ver sitio</span>
            </div>
            <div @click="navigate('/perfil')" class="flex items-center px-3 py-3 rounded-lg transition-colors cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white">
              <i class="fa-solid fa-user w-5 text-center mr-3 text-sm"></i>
              <span class="text-sm font-medium">Perfil</span>
            </div>
          </nav>
        </div>

        <!-- Logout -->
        <div class="p-4 border-t border-gray-800">
          <button
            @click="handleLogout"
            class="flex items-center w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors"
          >
            <i class="fa-solid fa-sign-out-alt w-5 text-center mr-3 text-sm"></i>
            <span class="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const unreadCount = ref(0)
const showDrawer = ref(false)

const adminItems = [
  { label: 'Dashboard',     path: '/dashboard',     icon: 'fa-solid fa-tachometer-alt' },
  { label: 'Reservas',      path: '/reservas',      icon: 'fa-solid fa-calendar-alt' },
  { label: 'Actividad',     path: '/actividad',     icon: 'fa-solid fa-list-alt' },
  { label: 'Configuración', path: '/configuracion', icon: 'fa-solid fa-sliders' },
]

const isActive = (path) => route.path === path

function navigate(path) {
  showDrawer.value = false
  router.push(path)
}

const user = computed(() => authStore.user)

const userName = computed(() => {
  const u = user.value
  if (!u) return 'Admin'
  return u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.email?.split('@')[0] || 'Admin'
})

const userRole = computed(() => {
  const u = user.value
  if (!u) return 'Staff'
  return u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : u.is_staff ? 'Staff' : 'User'
})

const userInitials = computed(() => {
  const u = user.value
  if (!u) return 'A'
  if (u.first_name && u.last_name) return `${u.first_name[0]}${u.last_name[0]}`.toUpperCase()
  return (u.first_name?.[0] || u.email?.[0] || 'A').toUpperCase()
})

const handleLogout = () => {
  showDrawer.value = false
  authStore.logout(router)
}

onMounted(async () => {
  if (!authStore.isAuthenticated) return
  try {
    const { getNotifications } = await import('@/services/api')
    const response = await getNotifications()
    const data = response.data
    const list = Array.isArray(data) ? data : (data.results || [])
    unreadCount.value = list.filter(n => !n.read).length
  } catch {}
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

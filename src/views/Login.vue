<template>
  <div class="flex flex-col min-h-screen bg-[#fefefe]">
    <div class="flex flex-1 justify-center items-center px-2 py-8">
      <div class="flex overflow-hidden relative flex-col items-center p-8 w-full max-w-md rounded-3xl shadow-2xl bg-white/80">
        <!-- Logo -->
        <img src="/tp.svg" alt="Terraza Pineda Logo" class="mb-4 w-16 h-16" />
        <!-- Title -->
        <h1 class="mb-2 text-3xl font-extrabold text-center md:text-4xl">
          <span class="login-gradient-text">Iniciar sesión</span>
        </h1>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-6 mt-6 w-full">
          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold text-gray-700">Correo electrónico</label>
            <input
              id="email"
              v-model="email"
              type="email"se
              class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400"
              placeholder="Ingresa tu correo..."
              required
              autocomplete="email"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold text-gray-700">Contraseña</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400"
              placeholder="Ingresa tu contraseña..."
              required
              autocomplete="current-password"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 mt-2 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-md hover:opacity-90 transition disabled:opacity-60"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>
          <div v-if="error" class="mt-2 text-sm text-center text-red-500">{{ error }}</div>
        </form>
        <!-- Decorative Gradient -->
        <div class="absolute -z-10 left-1/2 top-0 w-[400px] h-[400px] -translate-x-1/2 bg-gradient-to-br from-[#f472b6]/30 via-[#7c3aed]/20 to-[#22d3ee]/10 rounded-full blur-3xl opacity-60"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const toast = useToast()

async function handleLogin() {
  loading.value = true
  error.value = ''
  const result = await authStore.login({ email: email.value, password: password.value })
  loading.value = false
  if (result.success) {
    toast.success('¡Bienvenido! Has iniciado sesión correctamente')
    // Redirect to ?next if present
    const next = route.query.next
    if (next) {
      router.push(next)
      return
    }
    // Redirect based on user role
    const user = authStore.user
    if (user && (user.is_staff || user.role === 'admin')) {
      router.push('/dashboard')
    } else {
      router.push('/mis-reservas')
    }
  } else {
    error.value = result.error || 'Error al iniciar sesión.'
  }
}
</script>

<style scoped>
.login-gradient-text {
  background: linear-gradient(90deg, #7c3aed, #f472b6, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
</style> 
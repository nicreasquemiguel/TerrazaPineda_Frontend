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
        <p class="mb-6 text-center text-gray-500 text-sm">Bienvenido de nuevo</p>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-6 w-full">
          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold text-gray-700">Correo electrónico</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400 transition"
              placeholder="Ingresa tu correo..."
              required
              autocomplete="email"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold text-gray-700">Contraseña</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-3 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400 transition"
                placeholder="Ingresa tu contraseña..."
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition"
                tabindex="-1"
                aria-label="Mostrar/ocultar contraseña"
              >
                <!-- Eye open -->
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Eye closed -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-md hover:opacity-90 transition disabled:opacity-60"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>
        </form>

        <!-- Links -->
        <div class="flex flex-col items-center gap-2 mt-6 w-full text-sm">
          <router-link
            to="/auth/forgot-password"
            class="text-[#7c3aed] hover:text-[#22d3ee] underline transition"
          >
            ¿Olvidaste tu contraseña?
          </router-link>
          <span class="text-gray-400">·</span>
          <router-link
            to="/register"
            class="text-[#7c3aed] hover:text-[#22d3ee] underline transition"
          >
            ¿No tienes cuenta? Regístrate
          </router-link>
        </div>

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
const showPassword = ref(false)
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
    const next = route.query.next
    if (next) {
      router.push(next)
      return
    }
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

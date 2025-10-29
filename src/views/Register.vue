<template>
  <div class="flex flex-col min-h-screen bg-[#fefefe]">
    <div class="flex flex-1 justify-center items-center px-2 py-8">
      <div class="flex overflow-hidden relative flex-col items-center p-8 w-full max-w-md rounded-3xl shadow-2xl bg-white/80">
        <!-- Logo -->
        <img src="/tp.svg" alt="Terraza Pineda Logo" class="mb-4 w-16 h-16" />
        <!-- Title -->
        <h1 class="mb-2 text-3xl font-extrabold text-center md:text-4xl">
          <span class="login-gradient-text">Registrar</span>
        </h1>
        <p class="mb-6 text-center text-gray-600">Crea tu cuenta</p>
        <form @submit.prevent="handleRegister" class="flex flex-col gap-5 w-full">
          <div class="flex flex-col gap-2">
            <label for="first_name" class="font-semibold text-gray-700">Nombre(s)</label>
            <input id="first_name" v-model="first_name" type="text" class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400" placeholder="Introduce tu nombre..." required />
          </div>
          <div class="flex flex-col gap-2">
            <label for="last_name" class="font-semibold text-gray-700">Apellido(s)</label>
            <input id="last_name" v-model="last_name" type="text" class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400" placeholder="Introduce tus apellidos..." required />
          </div>
          <div class="flex flex-col gap-2">
            <label for="phone" class="font-semibold text-gray-700">Teléfono</label>
            <input id="phone" v-model="phone" type="tel" class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400" placeholder="Introduce número de celular..." required />
          </div>
          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold text-gray-700">Correo electrónico</label>
            <input id="email" v-model="email" type="email" class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400" placeholder="Introduce tu correo electrónico..." required />
          </div>
          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold text-gray-700">Contraseña</label>
            <input id="password" v-model="password" type="password" class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400" placeholder="**********" required />
          </div>
          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="font-semibold text-gray-700">Confirma la contraseña</label>
            <input id="confirmPassword" v-model="confirmPassword" type="password" class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400" placeholder="**********" required />
          </div>
          <button type="submit" :disabled="loading" class="w-full py-3 mt-2 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-md hover:opacity-90 transition disabled:opacity-60">
            {{ loading ? 'Registrando...' : 'REGÍSTRATE' }}
          </button>
          <div v-if="error" class="mt-2 text-sm text-center text-red-500">{{ error }}</div>
        </form>
        <router-link to="/login" class="block mt-6 text-center text-[#7c3aed] hover:text-[#22d3ee] underline text-sm">¿Ya tienes cuenta? Iniciar Sesión</router-link>
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

const toast = useToast()

const first_name = ref('')
const last_name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const handleRegister = async () => {
  error.value = ''
  
  // Validation
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }
  
  loading.value = true
  
  try {
    const result = await authStore.register({
      email: email.value,
      password: password.value,
      first_name: first_name.value,
      last_name: last_name.value,
      phone: phone.value
    })
    
    if (result.success) {
      toast.success('¡Registro exitoso! Ya puedes iniciar sesión')
      // Redirect to ?next if present
      const next = route.query.next
      if (next) {
        router.push(next)
        return
      }
      // Redirect based on user role
      if (authStore.user && (authStore.user.is_staff || authStore.user.role === 'admin')) {
        router.push('/dashboard')
      } else {
        router.push('/mis-reservas')
      }
    } else {
      const errorMessage = result.error || 'Error al registrar. Intenta de nuevo.'
      error.value = errorMessage
      toast.error(errorMessage)
    }
  } catch (err) {
    const connectionError = 'Error de conexión. Verifica tu internet e intenta de nuevo.'
    error.value = connectionError
    toast.error(connectionError)
    console.error('Registration error:', err)
  } finally {
    loading.value = false
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
<template>
  <div class="flex flex-col min-h-screen bg-[#fefefe]">
    <div class="flex flex-1 justify-center items-center px-2 py-8">
      <div class="flex overflow-hidden relative flex-col items-center p-8 w-full max-w-md rounded-3xl shadow-2xl bg-white/80">
        <!-- Logo -->
        <img src="/tp.svg" alt="Terraza Pineda Logo" class="mb-4 w-16 h-16" />
        
        <!-- Title -->
        <h1 class="mb-2 text-3xl font-extrabold text-center md:text-4xl">
          <span class="login-gradient-text">¿Olvidaste tu Contraseña?</span>
        </h1>
        <p class="mb-6 text-center text-gray-600">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
        
        <form @submit.prevent="handleForgotPassword" class="flex flex-col gap-5 w-full">
          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold text-gray-700">Correo Electrónico</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400" 
              placeholder="Ingresa tu correo electrónico..." 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-3 mt-2 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-md hover:opacity-90 transition disabled:opacity-60"
          >
            {{ loading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento' }}
          </button>
          
          <div v-if="error" class="mt-2 text-sm text-center text-red-500">{{ error }}</div>
          <div v-if="success" class="mt-2 text-sm text-center text-green-600">{{ success }}</div>
        </form>

        <!-- Success State -->
        <div v-if="success" class="mt-6 text-center">
          <div class="mb-4">
            <i class="fas fa-envelope-open text-4xl text-green-500 mb-4"></i>
          </div>
          <p class="text-gray-600 mb-4">
            Hemos enviado un email de restablecimiento a:
          </p>
          <p class="font-semibold text-[#7c3aed] mb-4">{{ email }}</p>
          <p class="text-sm text-gray-500 mb-6">
            Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña.
            Si no ves el email, revisa tu carpeta de spam.
          </p>
        </div>

        <!-- Back to Login -->
        <router-link 
          to="/login" 
          class="block mt-6 text-center text-[#7c3aed] hover:text-[#22d3ee] underline text-sm"
        >
          ← Volver a Iniciar Sesión
        </router-link>

        <!-- Decorative Gradient -->
        <div class="absolute -z-10 left-1/2 top-0 w-[400px] h-[400px] -translate-x-1/2 bg-gradient-to-br from-[#f472b6]/30 via-[#7c3aed]/20 to-[#22d3ee]/10 rounded-full blur-3xl opacity-60"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleForgotPassword = async () => {
  error.value = ''
  success.value = ''
  
  if (!email.value) {
    error.value = 'Por favor ingresa tu correo electrónico.'
    return
  }
  
  loading.value = true
  
  try {
    const result = await authStore.requestPasswordReset(email.value)
    
    if (result.success) {
      success.value = result.message
      toast.success(result.message)
    } else {
      error.value = result.error
      toast.error(result.error)
    }
  } catch (err) {
    error.value = 'Error de conexión. Verifica tu internet e intenta de nuevo.'
    toast.error(error.value)
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

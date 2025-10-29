<template>
  <div class="flex flex-col min-h-screen bg-[#fefefe]">
    <div class="flex flex-1 justify-center items-center px-2 py-8">
      <div class="flex overflow-hidden relative flex-col items-center p-8 w-full max-w-md rounded-3xl shadow-2xl bg-white/80">
        <!-- Logo -->
        <img src="/tp.svg" alt="Terraza Pineda Logo" class="mb-4 w-16 h-16" />
        
        <!-- Title -->
        <h1 class="mb-2 text-3xl font-extrabold text-center md:text-4xl">
          <span class="login-gradient-text">Verifica tu Email</span>
        </h1>
        
        <!-- Content -->
        <div class="text-center mb-6">
          <div class="mb-4">
            <i class="fas fa-envelope-open text-6xl text-[#7c3aed] mb-4"></i>
          </div>
          <p class="text-gray-600 mb-4">
            Hemos enviado un email de verificación a:
          </p>
          <p class="font-semibold text-[#7c3aed] mb-4">{{ email }}</p>
          <p class="text-sm text-gray-500 mb-6">
            Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            Si no ves el email, revisa tu carpeta de spam.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-4 w-full">
          <button 
            @click="resendEmail" 
            :disabled="loading || resendCooldown > 0"
            class="w-full py-3 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-md hover:opacity-90 transition disabled:opacity-60"
          >
            {{ loading ? 'Enviando...' : resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar Email' }}
          </button>
          
          <router-link 
            to="/login" 
            class="w-full py-3 rounded-xl font-bold text-lg text-center text-[#7c3aed] border-2 border-[#7c3aed] hover:bg-[#7c3aed] hover:text-white transition"
          >
            Ir a Iniciar Sesión
          </router-link>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 text-sm text-center text-red-500">{{ error }}</div>
        
        <!-- Success Message -->
        <div v-if="success" class="mt-4 text-sm text-center text-green-600">{{ success }}</div>

        <!-- Decorative Gradient -->
        <div class="absolute -z-10 left-1/2 top-0 w-[400px] h-[400px] -translate-x-1/2 bg-gradient-to-br from-[#f472b6]/30 via-[#7c3aed]/20 to-[#22d3ee]/10 rounded-full blur-3xl opacity-60"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const resendCooldown = ref(0)

onMounted(() => {
  // Get email from route query or localStorage
  email.value = route.query.email || localStorage.getItem('pendingEmail') || ''
  
  if (!email.value) {
    // If no email found, redirect to register
    window.location.href = '/registrar'
  }
})

const resendEmail = async () => {
  if (!email.value) return
  
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const result = await authStore.resendActivation(email.value)
    
    if (result.success) {
      success.value = result.message
      toast.success(result.message)
      
      // Start cooldown timer
      resendCooldown.value = 60
      const timer = setInterval(() => {
        resendCooldown.value--
        if (resendCooldown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
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

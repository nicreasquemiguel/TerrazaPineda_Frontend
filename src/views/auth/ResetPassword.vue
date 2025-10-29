<template>
  <div class="flex flex-col min-h-screen bg-[#fefefe]">
    <div class="flex flex-1 justify-center items-center px-2 py-8">
      <div class="flex overflow-hidden relative flex-col items-center p-8 w-full max-w-md rounded-3xl shadow-2xl bg-white/80">
        <!-- Logo -->
        <img src="/tp.svg" alt="Terraza Pineda Logo" class="mb-4 w-16 h-16" />
        
        <!-- Title -->
        <h1 class="mb-2 text-3xl font-extrabold text-center md:text-4xl">
          <span class="login-gradient-text">Restablecer Contraseña</span>
        </h1>
        
        <form @submit.prevent="handleResetPassword" class="flex flex-col gap-5 w-full">
          <div class="flex flex-col gap-2">
            <label for="newPassword" class="font-semibold text-gray-700">Nueva Contraseña</label>
            <input 
              id="newPassword" 
              v-model="newPassword" 
              type="password" 
              class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400" 
              placeholder="Ingresa tu nueva contraseña..." 
              required 
            />
          </div>
          
          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="font-semibold text-gray-700">Confirmar Nueva Contraseña</label>
            <input 
              id="confirmPassword" 
              v-model="confirmPassword" 
              type="password" 
              class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400" 
              placeholder="Confirma tu nueva contraseña..." 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-3 mt-2 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-md hover:opacity-90 transition disabled:opacity-60"
          >
            {{ loading ? 'Restableciendo...' : 'Restablecer Contraseña' }}
          </button>
          
          <div v-if="error" class="mt-2 text-sm text-center text-red-500">{{ error }}</div>
          <div v-if="success" class="mt-2 text-sm text-center text-green-600">{{ success }}</div>
        </form>

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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const uid = ref('')
const token = ref('')

onMounted(() => {
  uid.value = route.params.uid
  token.value = route.params.token
  
  if (!uid.value || !token.value) {
    error.value = 'Enlace de restablecimiento inválido.'
    router.push('/login')
  }
})

const handleResetPassword = async () => {
  error.value = ''
  success.value = ''
  
  // Validation
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  
  if (newPassword.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }
  
  loading.value = true
  
  try {
    const result = await authStore.resetPassword(uid.value, token.value, newPassword.value)
    
    if (result.success) {
      success.value = result.message
      toast.success(result.message)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
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

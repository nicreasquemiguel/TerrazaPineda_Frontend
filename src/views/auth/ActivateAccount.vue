<template>
  <div class="flex flex-col min-h-screen bg-[#fefefe]">
    <div class="flex flex-1 justify-center items-center px-2 py-8">
      <div class="flex overflow-hidden relative flex-col items-center p-8 w-full max-w-md rounded-3xl shadow-2xl bg-white/80">
        <!-- Logo -->
        <img src="/tp.svg" alt="Terraza Pineda Logo" class="mb-4 w-16 h-16" />
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center">
          <div class="mb-4">
            <i class="fas fa-spinner fa-spin text-4xl text-[#7c3aed]"></i>
          </div>
          <h1 class="mb-2 text-2xl font-extrabold text-center">
            <span class="login-gradient-text">Activando cuenta...</span>
          </h1>
          <p class="text-gray-600">Por favor espera mientras activamos tu cuenta.</p>
        </div>

        <!-- Success State -->
        <div v-else-if="success" class="text-center">
          <div class="mb-4">
            <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
          </div>
          <h1 class="mb-2 text-2xl font-extrabold text-center text-green-600">
            ¡Cuenta Activada!
          </h1>
          <p class="text-gray-600 mb-6">
            Tu cuenta ha sido activada exitosamente. Ya puedes iniciar sesión.
          </p>
          <router-link 
            to="/login" 
            class="w-full py-3 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-md hover:opacity-90 transition"
          >
            Iniciar Sesión
          </router-link>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center">
          <div class="mb-4">
            <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          </div>
          <h1 class="mb-2 text-2xl font-extrabold text-center text-red-600">
            Error de Activación
          </h1>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <div class="flex flex-col gap-4 w-full">
            <router-link 
              to="/registrar" 
              class="w-full py-3 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-md hover:opacity-90 transition"
            >
              Registrarse Nuevamente
            </router-link>
            <router-link 
              to="/login" 
              class="w-full py-3 rounded-xl font-bold text-lg text-center text-[#7c3aed] border-2 border-[#7c3aed] hover:bg-[#7c3aed] hover:text-white transition"
            >
              Ir a Iniciar Sesión
            </router-link>
          </div>
        </div>

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

const loading = ref(true)
const success = ref(false)
const error = ref('')

onMounted(async () => {
  const uid = route.params.uid
  const token = route.params.token
  
  if (!uid || !token) {
    error.value = 'Enlace de activación inválido.'
    loading.value = false
    return
  }

  try {
    const result = await authStore.activateAccount(uid, token)
    
    if (result.success) {
      success.value = true
      toast.success(result.message)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
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
})
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

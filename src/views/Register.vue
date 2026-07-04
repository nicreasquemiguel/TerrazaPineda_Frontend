<template>
  <div class="flex flex-col min-h-screen bg-[#fefefe]">
    <div class="flex flex-1 justify-center items-center px-2 py-8">
      <div class="flex overflow-hidden relative flex-col items-center p-8 w-full max-w-md rounded-3xl shadow-2xl bg-white/80">
        <!-- Logo -->
        <img src="/tp.svg" alt="Terraza Pineda Logo" class="mb-4 w-16 h-16" />
        <!-- Title -->
        <h1 class="mb-1 text-3xl font-extrabold text-center md:text-4xl">
          <span class="login-gradient-text">Crear cuenta</span>
        </h1>
        <p class="mb-6 text-center text-gray-500 text-sm">Únete a Terraza Pineda</p>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-5 w-full">
          <!-- First & Last name row -->
          <div class="flex gap-3">
            <div class="flex flex-col gap-2 flex-1">
              <label for="first_name" class="font-semibold text-gray-700 text-sm">Nombre(s)</label>
              <input
                id="first_name"
                v-model="first_name"
                type="text"
                class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400 transition"
                placeholder="Tu nombre"
                required
                autocomplete="given-name"
              />
            </div>
            <div class="flex flex-col gap-2 flex-1">
              <label for="last_name" class="font-semibold text-gray-700 text-sm">Apellido(s)</label>
              <input
                id="last_name"
                v-model="last_name"
                type="text"
                class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400 transition"
                placeholder="Tus apellidos"
                required
                autocomplete="family-name"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="phone" class="font-semibold text-gray-700 text-sm">Teléfono</label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              inputmode="numeric"
              @input="formatPhone"
              class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400 transition"
              placeholder="000-000-0000"
              required
              autocomplete="tel"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold text-gray-700 text-sm">Correo electrónico</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400 transition"
              placeholder="tu@correo.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold text-gray-700 text-sm">Contraseña</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400 transition"
                placeholder="Mínimo 8 caracteres"
                required
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition"
                tabindex="-1"
                aria-label="Mostrar/ocultar contraseña"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <!-- Password strength meter -->
            <div v-if="password" class="mt-1">
              <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="[passwordStrength.color, passwordStrength.width]"
                ></div>
              </div>
              <p class="mt-1 text-xs" :class="passwordStrength.textColor">
                Contraseña {{ passwordStrength.label }}
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="font-semibold text-gray-700 text-sm">Confirmar contraseña</label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 placeholder-gray-400 transition"
                :class="confirmPassword ? (passwordsMatch ? 'focus:ring-green-400 border-green-300' : 'focus:ring-red-400 border-red-300') : 'focus:ring-[#7c3aed]'"
                placeholder="Repite tu contraseña"
                required
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition"
                tabindex="-1"
                aria-label="Mostrar/ocultar contraseña"
              >
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <!-- Match indicator -->
            <p v-if="confirmPassword" class="text-xs mt-1" :class="passwordsMatch ? 'text-green-500' : 'text-red-500'">
              {{ passwordsMatch ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden' }}
            </p>
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
            {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
          </button>
        </form>

        <router-link to="/login" class="block mt-6 text-center text-sm text-[#7c3aed] hover:text-[#22d3ee] underline transition">
          ¿Ya tienes cuenta? Iniciar sesión
        </router-link>

        <!-- Decorative Gradient -->
        <div class="absolute -z-10 left-1/2 top-0 w-[400px] h-[400px] -translate-x-1/2 bg-gradient-to-br from-[#f472b6]/30 via-[#7c3aed]/20 to-[#22d3ee]/10 rounded-full blur-3xl opacity-60"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()

const first_name = ref('')
const last_name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const loading = ref(false)

const passwordStrength = computed(() => {
  const p = password.value
  if (p.length < 8) {
    return { label: 'débil', color: 'bg-red-400', textColor: 'text-red-500', width: 'w-1/3' }
  }
  const hasUpper = /[A-Z]/.test(p)
  const hasLower = /[a-z]/.test(p)
  const hasNumber = /[0-9]/.test(p)
  const hasSpecial = /[^A-Za-z0-9]/.test(p)
  const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
  if (score >= 3) {
    return { label: 'fuerte', color: 'bg-green-400', textColor: 'text-green-600', width: 'w-full' }
  }
  return { label: 'media', color: 'bg-yellow-400', textColor: 'text-yellow-600', width: 'w-2/3' }
})

const passwordsMatch = computed(() =>
  confirmPassword.value ? password.value === confirmPassword.value : null
)

function formatPhone(event) {
  let digits = event.target.value.replace(/\D/g, '').slice(0, 10)
  if (digits.length > 6) {
    digits = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
  } else if (digits.length > 3) {
    digits = digits.slice(0, 3) + '-' + digits.slice(3)
  }
  phone.value = digits
}

const handleRegister = async () => {
  error.value = ''

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
      localStorage.setItem('pendingEmail', email.value)
      toast.success('¡Registro exitoso! Revisa tu email para activar tu cuenta')
      router.push({ path: '/auth/verify-email', query: { email: email.value } })
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

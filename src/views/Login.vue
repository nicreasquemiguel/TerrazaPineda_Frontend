<template>
  <SocialPhoneModal v-if="showPhoneModal" @done="onPhoneSaved" />
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

        <!-- Social login -->
        <div class="flex flex-col items-center gap-3 mt-6 w-full">
          <div class="flex items-center w-full gap-2">
            <div class="flex-1 h-px bg-gray-200"></div>
            <span class="text-xs text-gray-400 whitespace-nowrap">o continuar con</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>
          <div class="flex gap-3 w-full">
            <button
              type="button"
              @click="handleGoogleLogin"
              :disabled="socialLoading"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition disabled:opacity-60"
            >
              <svg class="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              @click="handleFacebookLogin"
              :disabled="socialLoading"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1877F2] bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1565d8] transition disabled:opacity-60"
            >
              <svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
          <p v-if="socialError" class="text-xs text-red-500 text-center">{{ socialError }}</p>
        </div>

        <!-- Links -->
        <div class="flex flex-col items-center gap-2 mt-4 w-full text-sm">
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import SocialPhoneModal from '@/components/SocialPhoneModal.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const socialLoading = ref(false)
const socialError = ref('')
const showPhoneModal = ref(false)
const pendingRedirect = ref(null)
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

function getRedirectTarget() {
  const next = route.query.next
  if (next) return next
  const user = authStore.user
  return (user && (user.is_staff || user.role === 'admin')) ? '/dashboard' : '/mis-reservas'
}

function redirectAfterSocialLogin(result) {
  if (result.created) toast.success('¡Bienvenido a Terraza Pineda!')
  else toast.success('¡Bienvenido de nuevo!')
  if (result.needsPhone) {
    pendingRedirect.value = getRedirectTarget()
    showPhoneModal.value = true
  } else {
    router.push(getRedirectTarget())
  }
}

function onPhoneSaved() {
  showPhoneModal.value = false
  router.push(pendingRedirect.value || '/mis-reservas')
}

// ── Google ──────────────────────────────────────────────────────────────────
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)

  const fbScript = document.createElement('script')
  fbScript.src = 'https://connect.facebook.net/es_LA/sdk.js'
  fbScript.async = true
  fbScript.defer = true
  fbScript.crossOrigin = 'anonymous'
  document.head.appendChild(fbScript)
  window.fbAsyncInit = function () {
    FB.init({ appId: import.meta.env.VITE_FACEBOOK_APP_ID || '', cookie: true, xfbml: true, version: 'v19.0' })
  }
})

async function handleGoogleLogin() {
  socialLoading.value = true
  socialError.value = ''
  try {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) throw new Error('Google Client ID no configurado.')
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: async (response) => {
        if (response.error) {
          socialError.value = 'Error al conectar con Google.'
          socialLoading.value = false
          return
        }
        const result = await authStore.loginWithSocial('google', response.access_token)
        socialLoading.value = false
        if (result.success) redirectAfterSocialLogin(result)
        else socialError.value = result.error
      },
    })
    tokenClient.requestAccessToken({ prompt: 'consent' })
  } catch (err) {
    socialError.value = err.message || 'Error al iniciar sesión con Google.'
    socialLoading.value = false
  }
}

async function handleFacebookLogin() {
  socialLoading.value = true
  socialError.value = ''
  try {
    FB.login(async (response) => {
      if (response.authResponse) {
        const result = await authStore.loginWithSocial('facebook', response.authResponse.accessToken)
        socialLoading.value = false
        if (result.success) redirectAfterSocialLogin(result)
        else socialError.value = result.error
      } else {
        socialError.value = 'Login con Facebook cancelado.'
        socialLoading.value = false
      }
    }, { scope: 'email,public_profile' })
  } catch (err) {
    socialError.value = err.message || 'Error al iniciar sesión con Facebook.'
    socialLoading.value = false
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

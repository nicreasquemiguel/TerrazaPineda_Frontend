import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  const isAuthenticated = computed(() => !!accessToken.value)

  function setToken(newAccess, newRefresh) {
    accessToken.value = newAccess
    refreshToken.value = newRefresh
    localStorage.setItem('accessToken', newAccess)
    localStorage.setItem('refreshToken', newRefresh)
  }

  function logout(router = null) {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    // Redirect to home page if router is provided
    if (router) {
      router.push('/')
    }
  }

  function setUser(userData) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  async function fetchUser() {
    if (!accessToken.value) return
    try {
      const res = await api.get('/auth/users/me/')
      setUser(res.data)
    } catch (error) {
      console.log('[Auth] Error fetching user, logging out:', error.response?.status);
      logout()
    }
  }

  // Function to check if token is valid
  async function checkTokenValidity() {
    if (!accessToken.value) return false
    
    try {
      const res = await api.post('/auth/jwt/verify/', { token: accessToken.value })
      return res.status === 200
    } catch (error) {
      console.log('[Auth] Token is invalid, clearing auth...');
      logout()
      return false
    }
  }

  // Function to clear auth data when token is invalid
  function clearInvalidAuth() {
    console.log('[Auth] Clearing invalid authentication data...');
    logout()
  }

  // Login action for Django JWT
  async function login({ email, password }) {
    try {
      const res = await api.post('/auth/jwt/create/', { 
        email: email, 
        password: password 
      })
      setToken(res.data.access, res.data.refresh)
      await fetchUser()
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error response:', error.response)
      console.error('Error message:', error.message)
      console.error('Error code:', error.code)
      
      logout()
      
      // Better error handling with more specific messages
      let errorMessage = 'Error al iniciar sesión.'
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.'
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Error de red. Verifica tu conexión a internet.'
      } else if (error.response) {
        // Server responded with error status
        const data = error.response.data
        errorMessage = data?.detail || 
                      data?.non_field_errors?.[0] || 
                      data?.email?.[0] || 
                      data?.password?.[0] || 
                      error.response.statusText ||
                      'Error del servidor'
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'El servidor no respondió. Verifica que esté funcionando.'
      } else {
        // Something else happened
        errorMessage = error.message || 'Error desconocido'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  // Register action for Django djoser
  async function register({ email, password, first_name, last_name, phone }) {
    try {
      const res = await api.post('/auth/users/', { 
        email, 
        password,
        first_name,
        last_name,
        phone
      })
      
      // For registration, we need to login after successful registration
      const loginRes = await api.post('/auth/jwt/create/', { email, password })
      setToken(loginRes.data.access, loginRes.data.refresh)
      await fetchUser()
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error.response?.data)
      logout()
      
      // Handle different types of djoser errors
      let errorMessage = 'Error al registrar. Intenta de nuevo.'
      
      if (error.response?.data) {
        const data = error.response.data
        
        // Handle field-specific errors
        if (data.email) {
          errorMessage = Array.isArray(data.email) ? data.email[0] : data.email
        } else if (data.password) {
          errorMessage = Array.isArray(data.password) ? data.password[0] : data.password
        } else if (data.first_name) {
          errorMessage = Array.isArray(data.first_name) ? data.first_name[0] : data.first_name
        } else if (data.last_name) {
          errorMessage = Array.isArray(data.last_name) ? data.last_name[0] : data.last_name
        } else if (data.phone) {
          errorMessage = Array.isArray(data.phone) ? data.phone[0] : data.phone
        } else if (data.detail) {
          errorMessage = data.detail
        } else if (data.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors
        }
      }
      
      return { success: false, error: errorMessage }
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setToken,
    logout,
    setUser,
    fetchUser,
    checkTokenValidity,
    clearInvalidAuth,
    login,
    register,
  }
}) 
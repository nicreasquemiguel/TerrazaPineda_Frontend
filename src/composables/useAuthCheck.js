import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useAuthCheck() {
  const authStore = useAuthStore()

  const checkAuthOnMount = async () => {
    // Only check if we have a token
    if (authStore.accessToken) {
      console.log('[AuthCheck] Checking token validity on mount...')
      
      try {
        const isValid = await authStore.checkTokenValidity()
        if (!isValid) {
          console.log('[AuthCheck] Token is invalid, user will be logged out')
        } else {
          console.log('[AuthCheck] Token is valid')
        }
      } catch (error) {
        console.log('[AuthCheck] Error checking token validity:', error)
        authStore.clearInvalidAuth()
      }
    }
  }

  onMounted(() => {
    checkAuthOnMount()
  })

  return {
    checkAuthOnMount
  }
}

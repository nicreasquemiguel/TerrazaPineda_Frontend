<template>
  <div class="py-4 min-h-screen bg-gray-50 sm:py-8">
    <div class="px-4 mx-auto max-w-lg sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="p-4 mb-4 bg-white rounded-lg shadow-sm sm:p-6 sm:mb-6">
        <div class="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div class="relative flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
            <div v-if="user && user.profile && user.profile.image && user.profile.image.trim() !== ''" class="overflow-hidden w-20 h-20 rounded-full">
              <img 
                :src="user.profile.image" 
                :alt="`${userName} Profile`" 
                class="object-cover w-full h-full"
                @error="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='flex'"
              />
              <div class="hidden justify-center items-center w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                <span class="text-2xl font-bold text-white">{{ userInitials }}</span>
              </div>
            </div>
            <div v-else class="flex justify-center items-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
              <span class="text-2xl font-bold text-white">{{ userInitials }}</span>
            </div>
          </div>
          <div class="flex-1">
            <h1 class="text-xl font-bold text-gray-900 sm:text-2xl">{{ userName }}</h1>
            <p class="text-sm text-gray-600 sm:text-base">{{ userRole }}</p>
            <p class="text-xs text-gray-500 break-all sm:text-sm">{{ user && user.email ? user.email : '' }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-200">
          <nav class="flex overflow-x-auto px-4 -mb-px space-x-2 sm:px-6 sm:space-x-8">
            <button
              @click="activeTab = 'profile'"
              :class="[
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0'
              ]"
            >
              <i class="mr-2 fa-solid fa-user"></i>
              Perfil
            </button>
            <button
              @click="activeTab = 'notifications'"
              :class="[
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0'
              ]"
            >
              <i class="mr-2 fa-solid fa-bell"></i>
              Notificaciones
              <span v-if="unreadCount > 0" class="inline-flex items-center px-2 py-1 ml-2 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                {{ unreadCount }}
              </span>
            </button>
            <button
              @click="activeTab = 'security'"
              :class="[
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0'
              ]"
            >
              <i class="mr-2 fa-solid fa-shield-alt"></i>
              Seguridad
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-4 sm:p-6">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Información Personal</h3>
            
            <div class="space-y-4 sm:space-y-6">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
                <div v-if="!isEditing" class="py-2 text-gray-900">{{ user?.first_name || 'No especificado' }}</div>
                <input v-else v-model="formData.first_name" class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Apellido</label>
                <div v-if="!isEditing" class="py-2 text-gray-900">{{ user?.last_name || 'No especificado' }}</div>
                <input v-else v-model="formData.last_name" class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
                <div class="py-2 text-gray-900">{{ user?.email || 'No especificado' }}</div>
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Teléfono</label>
                <div v-if="!isEditing" class="py-2 text-gray-900">{{ user?.phone || 'No especificado' }}</div>
                <input v-else v-model="formData.phone" class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Género</label>
                <div v-if="!isEditing" class="py-2 text-gray-900">{{ getGenderLabel(user?.profile?.gender) || 'No especificado' }}</div>
                <select v-else v-model="formData.profile.gender" class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">País</label>
                <div v-if="!isEditing" class="py-2 text-gray-900">{{ user?.profile?.country || 'No especificado' }}</div>
                <input v-else v-model="formData.profile.country" class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Estado</label>
                <div v-if="!isEditing" class="py-2 text-gray-900">{{ user?.profile?.state || 'No especificado' }}</div>
                <input v-else v-model="formData.profile.state" class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Imagen de perfil</label>
                <div v-if="!isEditing" class="py-2 text-gray-900">{{ user?.profile?.image || 'No especificado' }}</div>
                <input v-else v-model="formData.profile.image" class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Dirección</label>
                <div v-if="!isEditing" class="py-2 text-gray-900">{{ user?.profile?.address || 'No especificado' }}</div>
                <textarea v-else v-model="formData.profile.address" rows="3" class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>

            <div class="flex flex-col gap-2 justify-end sm:flex-row sm:gap-0">
              <button 
                v-if="!isEditing"
                @click="toggleEdit"
                class="px-4 py-2 w-full text-white bg-blue-600 rounded-md transition-colors sm:w-auto hover:bg-blue-700"
              >
                Editar perfil
              </button>
              <div v-else class="flex flex-col gap-2 w-full sm:flex-row sm:w-auto">
                <button 
                  @click="saveProfile"
                  :disabled="isSaving"
                  class="px-4 py-2 w-full text-white bg-green-600 rounded-md transition-colors sm:w-auto hover:bg-green-700 disabled:opacity-50"
                >
                  {{ isSaving ? 'Guardando...' : 'Guardar' }}
                </button>
                <button 
                  @click="toggleEdit"
                  class="px-4 py-2 w-full text-white bg-gray-400 rounded-md transition-colors sm:w-auto hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          <!-- Notifications Tab -->
          <div v-if="activeTab === 'notifications'" class="space-y-6">
            <div class="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-center">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Notificaciones</h3>
                <p class="text-xs text-gray-500">Total: {{ notifications.length }} | No leídas: {{ unreadCount }}</p>
              </div>
              <button
                @click="markAllAsRead"
                :disabled="isMarkingAllRead"
                class="px-3 py-1 w-full text-sm text-gray-700 bg-gray-100 rounded-md transition-colors sm:w-auto hover:bg-gray-200 disabled:opacity-50"
              >
                <i v-if="isMarkingAllRead" class="mr-1 fa-solid fa-spinner fa-spin"></i>
                Marcar todas como leídas
              </button>
            </div>

            <div v-if="notificationsLoading" class="py-8 text-center">
              <i class="text-2xl text-gray-400 fa-solid fa-spinner fa-spin"></i>
              <p class="mt-2 text-gray-500">Cargando notificaciones...</p>
            </div>

            <div v-else-if="notifications.length === 0" class="py-8 text-center">
              <i class="text-4xl text-gray-300 fa-solid fa-bell-slash"></i>
              <p class="mt-2 text-gray-500">No tienes notificaciones</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                :class="[
                  'p-4 rounded-lg border transition-colors',
                  notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                ]"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">{{ getNotificationTitle(notification) }}</h4>
                    <p class="mt-1 text-sm text-gray-600">{{ notification.message || 'Notificación' }}</p>
                    <div class="flex justify-between items-center mt-3">
                      <div class="flex gap-2">
                        <button
                          v-if="notification.booking"
                          @click.stop="viewBooking(notification.booking)"
                          class="px-3 py-1 text-xs text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
                        >
                          <i class="mr-1 fa-solid fa-eye"></i>
                          Ver Reserva
                        </button>
                        <button
                          v-if="!notification.read"
                          @click.stop="markAsRead(notification.id)"
                          class="px-3 py-1 text-xs text-blue-600 bg-blue-50 rounded-md transition-colors hover:bg-blue-100"
                        >
                          <i class="mr-1 fa-solid fa-check"></i>
                          Marcar como leída
                        </button>
                      </div>
                    </div>
                    <div class="mt-2">
                      <p class="text-xs text-gray-500">{{ formatDate(notification.created_at) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  </div>
                </div>
              </div>
              
              <!-- Pagination Controls -->
              <div v-if="notificationsPagination.count > notifications.length" class="pt-4 border-t border-gray-200">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-sm text-gray-600">
                    Mostrando {{ notifications.length }} de {{ notificationsPagination.count }} notificaciones
                  </span>
                </div>
                <div class="flex gap-4 justify-center items-center">
                  <button
                    @click="loadNotifications(notificationsPagination.previous)"
                    :disabled="!notificationsPagination.previous || notificationsLoading"
                    class="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <span class="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md">
                    Page {{ getCurrentPage() }}
                  </span>
                  <button
                    @click="loadNotifications(notificationsPagination.next)"
                    :disabled="!notificationsPagination.next || notificationsLoading"
                    class="px-6 py-2 text-sm font-medium text-white bg-gray-800 rounded-md transition-colors hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Cambiar Contraseña</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Contraseña Actual</label>
                <input
                  v-model="passwordData.current_password"
                  type="password"
                  class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Nueva Contraseña</label>
                <input
                  v-model="passwordData.new_password"
                  type="password"
                  class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa tu nueva contraseña"
                />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                <input
                  v-model="passwordData.re_new_password"
                  type="password"
                  class="px-3 py-2 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                @click="changePassword"
                :disabled="isChangingPassword || !isPasswordFormValid"
                class="px-4 py-2 w-full text-white bg-red-600 rounded-md transition-colors sm:w-auto hover:bg-red-700 disabled:opacity-50"
              >
                <i v-if="isChangingPassword" class="mr-2 fa-solid fa-spinner fa-spin"></i>
                {{ isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getNotifications, markNotificationRead } from '@/services/api'
import api from '@/services/api'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const toast = useToast()
const router = useRouter()

// Tab management
const activeTab = ref('profile')

// Profile editing
const isEditing = ref(false)
const isSaving = ref(false)

// Notifications
const notifications = ref([])
const notificationsLoading = ref(false)
const unreadCount = ref(0)
const isMarkingAllRead = ref(false)
const notificationsPagination = ref({
  count: 0,
  next: null,
  previous: null
})

// Password change
const isChangingPassword = ref(false)

const formData = reactive({
  first_name: '',
  last_name: '',
  phone: '',
  profile: {
    image: '',
    gender: '',
    country: '',
    state: '',
    address: ''
  }
})

const passwordData = reactive({
  current_password: '',
  new_password: '',
  re_new_password: ''
})

// Computed properties
const userName = computed(() => {
  if (!user.value) return 'Usuario'
  
  if (user.value.first_name && user.value.last_name) {
    return `${user.value.first_name} ${user.value.last_name}`
  } else if (user.value.first_name) {
    return user.value.first_name
  } else if (user.value.username) {
    return user.value.username
  } else if (user.value.email) {
    return user.value.email.split('@')[0]
  }
  
  return 'Usuario'
})

const userRole = computed(() => {
  if (!user.value) return 'Usuario'
  
  if (user.value.role) {
    return user.value.role.charAt(0).toUpperCase() + user.value.role.slice(1)
  } else if (user.value.is_staff) {
    return 'Staff'
  }
  
  return 'Usuario'
})

const userInitials = computed(() => {
  if (!user.value) return 'U'
  
  if (user.value.first_name && user.value.last_name) {
    return `${user.value.first_name.charAt(0)}${user.value.last_name.charAt(0)}`.toUpperCase()
  } else if (user.value.first_name) {
    return user.value.first_name.charAt(0).toUpperCase()
  } else if (user.value.username) {
    return user.value.username.charAt(0).toUpperCase()
  } else if (user.value.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  
  return 'U'
})

const isPasswordFormValid = computed(() => {
  return passwordData.current_password && 
         passwordData.new_password && 
         passwordData.re_new_password &&
         passwordData.new_password === passwordData.re_new_password
})

// Methods
function fillForm() {
  if (!user.value) return
  formData.first_name = user.value.first_name || ''
  formData.last_name = user.value.last_name || ''
  formData.phone = user.value.phone || ''
  formData.profile.image = user.value.profile?.image || ''
  formData.profile.gender = user.value.profile?.gender || ''
  formData.profile.country = user.value.profile?.country || ''
  formData.profile.state = user.value.profile?.state || ''
  formData.profile.address = user.value.profile?.address || ''
}

function toggleEdit() {
  isEditing.value = !isEditing.value
  if (isEditing.value) fillForm()
}

function getGenderLabel(gender) {
  if (gender === 'M') return 'Masculino'
  if (gender === 'F') return 'Femenino'
  if (gender === 'O') return 'Otro'
  return ''
}

async function saveProfile() {
  isSaving.value = true
  try {
    const res = await api.patch('/auth/users/me/', {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      profile: { ...formData.profile }
    })
    authStore.setUser(res.data)
    isEditing.value = false
    toast.success('Perfil actualizado exitosamente')
  } catch (error) {
    console.error('Error saving profile:', error)
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.first_name?.[0] ||
                        error.response?.data?.last_name?.[0] ||
                        error.response?.data?.phone?.[0] ||
                        'Error al guardar el perfil'
    toast.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}

const loadNotifications = async (url = null) => {
  notificationsLoading.value = true
  try {
    const response = url ? await api.get(url) : await getNotifications()
    console.log('Notifications API response:', response.data)
    
    // Handle the new pagination structure
    const data = response.data
    notifications.value = data?.results || data || []
    
    console.log('Processed notifications:', notifications.value)
    
    // Update pagination info
    notificationsPagination.value = {
      count: data?.count || 0,
      next: data?.next || null,
      previous: data?.previous || null
    }
    
    unreadCount.value = notifications.value.filter(n => n && !n.read).length
    console.log('Unread count:', unreadCount.value)
  } catch (error) {
    console.error('Error loading notifications:', error)
    toast.error('Error al cargar las notificaciones')
    notifications.value = []
  } finally {
    notificationsLoading.value = false
  }
}

const markAsRead = async (notificationId) => {
  if (!notificationId) return
  
  try {
    await markNotificationRead(notificationId)
    const notification = notifications.value.find(n => n && n.id === notificationId)
    if (notification) {
      notification.read = true
      unreadCount.value = notifications.value.filter(n => n && !n.read).length
    }
    toast.success('Notificación marcada como leída')
  } catch (error) {
    console.error('Error marking notification as read:', error)
    toast.error('Error al marcar la notificación')
  }
}

const viewBooking = (bookingId) => {
  if (bookingId) {
    // Navigate to booking detail page
    router.push({ name: 'DetalleReserva', params: { id: bookingId } })
  }
}

const getCurrentPage = () => {
  const pagination = notificationsPagination.value
  
  // If no previous page, we're on page 1
  if (!pagination.previous) {
    return 1
  }
  
  // Extract offset from previous URL
  try {
    const prevUrl = new URL(pagination.previous)
    const prevOffset = parseInt(prevUrl.searchParams.get('offset') || '0')
    const limit = parseInt(prevUrl.searchParams.get('limit') || '10')
    
    // Current page is (previous offset + limit) / limit
    return Math.floor((prevOffset + limit) / limit) + 1
  } catch (error) {
    console.error('Error calculating current page:', error)
    return 1
  }
}

const markAllAsRead = async () => {
  isMarkingAllRead.value = true
  try {
    const unreadNotifications = notifications.value.filter(n => n && !n.read)
    await Promise.all(unreadNotifications.map(n => markNotificationRead(n.id)))
    notifications.value.forEach(n => {
      if (n) n.read = true
    })
    unreadCount.value = 0
    toast.success('Todas las notificaciones marcadas como leídas')
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    toast.error('Error al marcar las notificaciones')
  } finally {
    isMarkingAllRead.value = false
  }
}

async function changePassword() {
  isChangingPassword.value = true
  
  // Validate password confirmation
  if (passwordData.new_password !== passwordData.re_new_password) {
    toast.error('Las contraseñas no coinciden')
    isChangingPassword.value = false
    return
  }
  
  // Validate password length
  if (passwordData.new_password.length < 8) {
    toast.error('La nueva contraseña debe tener al menos 8 caracteres')
    isChangingPassword.value = false
    return
  }
  
  try {
    await api.post('/auth/users/set_password/', {
      current_password: passwordData.current_password,
      new_password: passwordData.new_password,
      re_new_password: passwordData.re_new_password
    })
    
    // Clear form
    passwordData.current_password = ''
    passwordData.new_password = ''
    passwordData.re_new_password = ''
    
    toast.success('Contraseña cambiada exitosamente')
  } catch (error) {
    console.error('Error changing password:', error)
    
    // Handle different types of password errors
    let errorMessage = 'Error al cambiar la contraseña'
    
    if (error.response?.data) {
      const data = error.response.data
      
      if (data.current_password) {
        errorMessage = Array.isArray(data.current_password) ? data.current_password[0] : data.current_password
      } else if (data.new_password) {
        errorMessage = Array.isArray(data.new_password) ? data.new_password[0] : data.new_password
      } else if (data.re_new_password) {
        errorMessage = Array.isArray(data.re_new_password) ? data.re_new_password[0] : data.re_new_password
      } else if (data.detail) {
        errorMessage = data.detail
      } else if (data.non_field_errors) {
        errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors
      }
    }
    
    toast.error(errorMessage)
  } finally {
    isChangingPassword.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getNotificationTitle = (notification) => {
  // Generate title based on notification type or use a default
  if (notification.type) {
    const typeTitles = {
      'booking_confirmed': 'Reserva Confirmada',
      'booking_cancelled': 'Reserva Cancelada',
      'booking_reminder': 'Recordatorio de Reserva',
      'payment_received': 'Pago Recibido',
      'payment_failed': 'Error en Pago',
      'status_change': 'Cambio de Estado',
      'general': 'Notificación General'
    }
    return typeTitles[notification.type] || `Notificación ${notification.type}`
  }
  
  // If no type, try to generate title from message
  if (notification.message) {
    const message = notification.message.toLowerCase()
    if (message.includes('reserva') && message.includes('confirmada')) return 'Reserva Confirmada'
    if (message.includes('reserva') && message.includes('cancelada')) return 'Reserva Cancelada'
    if (message.includes('pago')) return 'Actualización de Pago'
    if (message.includes('recordatorio')) return 'Recordatorio'
    if (message.includes('estatus') && message.includes('cambio')) return 'Cambio de Estado'
  }
  
  return 'Notificación'
}

// Watch for tab changes to load notifications
watch(activeTab, (newTab) => {
  if (newTab === 'notifications' && notifications.value.length === 0) {
    loadNotifications()
  }
})

// Lifecycle
onMounted(() => {
  // Initialize form data
  fillForm()
})
</script>
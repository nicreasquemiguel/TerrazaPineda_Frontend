<template>
  <div class="min-h-screen bg-gray-100 sm:py-8">
    <div class="px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">

      <!-- ─── PAGE TITLE (desktop) ─── -->
      <h1 class="hidden mb-6 text-2xl font-bold text-gray-800 sm:block">Mi Perfil</h1>

      <!-- ─── MOBILE HERO HEADER ─── -->
      <div class="relative mb-0 sm:hidden">
        <div class="h-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl"></div>
        <div class="flex flex-col items-center px-4">
          <div class="-mt-12 mb-2">
            <div v-if="user?.profile?.image && user.profile.image.trim() !== ''" class="overflow-hidden w-24 h-24 rounded-full border-4 border-white shadow-md">
              <img :src="user.profile.image" :alt="`${userName}`" class="object-cover w-full h-full"
                @error="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='flex'" />
              <div class="hidden justify-center items-center w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                <span class="text-3xl font-bold text-white">{{ userInitials }}</span>
              </div>
            </div>
            <div v-else class="flex justify-center items-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-md">
              <span class="text-3xl font-bold text-white">{{ userInitials }}</span>
            </div>
          </div>
          <h2 class="text-xl font-bold text-gray-900">{{ userName }}</h2>
          <p class="text-sm text-gray-500">{{ userRole }}</p>
          <p class="mb-4 text-xs text-gray-400 break-all">{{ user?.email }}</p>
        </div>
      </div>

      <!-- ─── DESKTOP PROFILE CARD ─── -->
      <div class="hidden p-6 mb-6 bg-white rounded-xl border border-gray-200 shadow-sm sm:flex sm:items-center sm:gap-5">
        <div class="flex-shrink-0">
          <div v-if="user?.profile?.image && user.profile.image.trim() !== ''" class="overflow-hidden w-20 h-20 rounded-full">
            <img :src="user.profile.image" :alt="`${userName}`" class="object-cover w-full h-full"
              @error="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='flex'" />
            <div class="hidden justify-center items-center w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
              <span class="text-2xl font-bold text-white">{{ userInitials }}</span>
            </div>
          </div>
          <div v-else class="flex justify-center items-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
            <span class="text-2xl font-bold text-white">{{ userInitials }}</span>
          </div>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ userName }}</h2>
          <p class="text-sm text-gray-500">{{ userRole }}</p>
          <p class="text-sm text-gray-400 break-all">{{ user?.email }}</p>
        </div>
      </div>

      <!-- ─── TABS ─── -->
      <div class="bg-white rounded-none border-b border-gray-200 sm:rounded-t-xl sm:border sm:border-b-0">
        <nav class="flex overflow-x-auto px-4 -mb-px space-x-1 sm:px-6 sm:space-x-6">
          <button
            @click="activeTab = 'profile'"
            :class="[
              activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-3.5 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0'
            ]"
          >
            <i class="mr-1.5 fa-solid fa-user"></i>Perfil
          </button>
          <button
            @click="activeTab = 'notifications'"
            :class="[
              activeTab === 'notifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-3.5 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0'
            ]"
          >
            <i class="mr-1.5 fa-solid fa-bell"></i>Notificaciones
            <span v-if="unreadCount > 0" class="inline-flex items-center px-1.5 py-0.5 ml-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">{{ unreadCount }}</span>
          </button>
          <button
            @click="activeTab = 'security'"
            :class="[
              activeTab === 'security' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-3.5 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0'
            ]"
          >
            <i class="mr-1.5 fa-solid fa-shield-alt"></i>Seguridad
          </button>
        </nav>
      </div>

      <!-- ─── TAB PANELS ─── -->
      <div class="bg-white rounded-none border border-t-0 border-gray-200 shadow-sm sm:rounded-b-xl">

        <!-- ══ PERFIL ══ -->
        <div v-if="activeTab === 'profile'">

          <!-- VIEW MODE -->
          <template v-if="!isEditing">
            <!-- Personal Information -->
            <div class="p-4 sm:p-6">
              <div class="flex justify-between items-center mb-5">
                <h3 class="text-base font-semibold text-gray-800 sm:text-lg">Información Personal</h3>
                <button
                  @click="toggleEdit"
                  class="inline-flex gap-1.5 items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-500 rounded-lg transition-colors hover:bg-orange-600 sm:px-4 sm:py-2 sm:text-sm"
                >
                  <i class="fa-solid fa-pen"></i> Editar
                </button>
              </div>
              <!-- Grid 1-col mobile, 3-col desktop -->
              <div class="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-3">
                <div>
                  <p class="mb-1 text-xs font-medium text-gray-400 sm:text-sm">Nombre</p>
                  <p class="text-sm font-semibold text-gray-800 sm:text-base">{{ user?.first_name || '—' }}</p>
                </div>
                <div>
                  <p class="mb-1 text-xs font-medium text-gray-400 sm:text-sm">Apellido</p>
                  <p class="text-sm font-semibold text-gray-800 sm:text-base">{{ user?.last_name || '—' }}</p>
                </div>
                <div>
                  <p class="mb-1 text-xs font-medium text-gray-400 sm:text-sm">Género</p>
                  <p class="text-sm font-semibold text-gray-800 sm:text-base">{{ getGenderLabel(user?.profile?.gender) || '—' }}</p>
                </div>
                <div>
                  <p class="mb-1 text-xs font-medium text-gray-400 sm:text-sm">Email</p>
                  <p class="text-sm font-semibold text-gray-800 break-all sm:text-base">{{ user?.email || '—' }}</p>
                </div>
                <div>
                  <p class="mb-1 text-xs font-medium text-gray-400 sm:text-sm">Teléfono</p>
                  <p class="text-sm font-semibold text-gray-800 sm:text-base">{{ user?.phone || '—' }}</p>
                </div>
                <div>
                  <p class="mb-1 text-xs font-medium text-gray-400 sm:text-sm">Rol</p>
                  <p class="text-sm font-semibold text-gray-800 sm:text-base">{{ userRole }}</p>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="mx-4 border-t border-gray-100 sm:mx-6"></div>

            <!-- Address -->
            <div class="p-4 sm:p-6">
              <div class="flex justify-between items-center mb-5">
                <h3 class="text-base font-semibold text-gray-800 sm:text-lg">Dirección</h3>
              </div>
              <div class="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-3">
                <div>
                  <p class="mb-1 text-xs font-medium text-gray-400 sm:text-sm">País</p>
                  <p class="text-sm font-semibold text-gray-800 sm:text-base">{{ user?.profile?.country || '—' }}</p>
                </div>
                <div>
                  <p class="mb-1 text-xs font-medium text-gray-400 sm:text-sm">Estado / Ciudad</p>
                  <p class="text-sm font-semibold text-gray-800 sm:text-base">{{ user?.profile?.state || '—' }}</p>
                </div>
                <div>
                  <p class="mb-1 text-xs font-medium text-gray-400 sm:text-sm">Dirección completa</p>
                  <p class="text-sm font-semibold text-gray-800 sm:text-base">{{ user?.profile?.address || '—' }}</p>
                </div>
              </div>
            </div>
          </template>

          <!-- EDIT MODE -->
          <template v-else>
            <div class="p-4 sm:p-6">
              <h3 class="mb-5 text-base font-semibold text-gray-800 sm:text-lg">Editar Perfil</h3>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Nombre</label>
                  <input v-model="formData.first_name" class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Apellido</label>
                  <input v-model="formData.last_name" class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</label>
                  <input v-model="formData.phone" class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Género</label>
                  <select v-model="formData.profile.gender" class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
                <div>
                  <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">País</label>
                  <input v-model="formData.profile.country" class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</label>
                  <input v-model="formData.profile.state" class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="sm:col-span-2 lg:col-span-3">
                  <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Imagen de perfil (URL)</label>
                  <input v-model="formData.profile.image" class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="sm:col-span-2 lg:col-span-3">
                  <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Dirección</label>
                  <textarea v-model="formData.profile.address" rows="3" class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
              </div>

              <div class="flex flex-col gap-2 justify-end mt-6 sm:flex-row">
                <button @click="toggleEdit" class="order-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors sm:order-1 hover:bg-gray-200">
                  Cancelar
                </button>
                <button @click="saveProfile" :disabled="isSaving"
                  class="order-1 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors sm:order-2 hover:bg-blue-700 disabled:opacity-50">
                  <i v-if="isSaving" class="mr-1 fa-solid fa-spinner fa-spin"></i>
                  {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- ══ NOTIFICACIONES ══ -->
        <div v-if="activeTab === 'notifications'" class="p-4 sm:p-6">
          <div class="flex justify-between items-center mb-5">
            <div>
              <h3 class="text-base font-semibold text-gray-800 sm:text-lg">Notificaciones</h3>
              <p class="text-xs text-gray-400">{{ notifications.length }} total · {{ unreadCount }} no leídas</p>
            </div>
            <button @click="markAllAsRead" :disabled="isMarkingAllRead"
              class="inline-flex gap-1.5 items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200 disabled:opacity-50 sm:text-sm">
              <i v-if="isMarkingAllRead" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-check-double"></i>
              Leer todas
            </button>
          </div>

          <div v-if="notificationsLoading" class="py-12 text-center">
            <i class="text-2xl text-gray-300 fa-solid fa-spinner fa-spin"></i>
            <p class="mt-2 text-sm text-gray-400">Cargando...</p>
          </div>

          <div v-else-if="notifications.length === 0" class="py-12 text-center">
            <i class="text-4xl text-gray-200 fa-solid fa-bell-slash"></i>
            <p class="mt-3 text-sm text-gray-400">No tienes notificaciones</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="notification in notifications" :key="notification.id"
              :class="['p-4 rounded-xl border transition-colors', notification.read ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-100']"
            >
              <div class="flex gap-3 items-start">
                <span :class="['mt-1.5 flex-shrink-0 w-2 h-2 rounded-full', !notification.read ? 'bg-blue-500' : '']"></span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900">{{ getNotificationTitle(notification) }}</p>
                  <p class="mt-0.5 text-xs leading-relaxed text-gray-500">{{ notification.message || 'Notificación' }}</p>
                  <div class="flex flex-wrap gap-2 items-center mt-2.5">
                    <button v-if="notification.booking" @click.stop="viewBooking(notification.booking)"
                      class="inline-flex gap-1 items-center px-2.5 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700">
                      <i class="fa-solid fa-eye"></i> Ver Reserva
                    </button>
                    <button v-if="!notification.read" @click.stop="markAsRead(notification.id)"
                      class="inline-flex gap-1 items-center px-2.5 py-1 text-xs font-medium text-blue-600 bg-white rounded-full border border-blue-200 hover:bg-blue-50">
                      <i class="fa-solid fa-check"></i> Leída
                    </button>
                    <span class="ml-auto text-xs text-gray-400">{{ formatDate(notification.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="notificationsPagination.count > notifications.length" class="pt-4 border-t border-gray-100">
              <p class="mb-2 text-xs text-center text-gray-400">{{ notifications.length }} de {{ notificationsPagination.count }}</p>
              <div class="flex gap-3 justify-center">
                <button @click="loadNotifications(notificationsPagination.previous)"
                  :disabled="!notificationsPagination.previous || notificationsLoading"
                  class="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed">
                  Anterior
                </button>
                <span class="px-3 py-2 text-sm font-medium text-gray-500">Pág. {{ getCurrentPage() }}</span>
                <button @click="loadNotifications(notificationsPagination.next)"
                  :disabled="!notificationsPagination.next || notificationsLoading"
                  class="px-5 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ SEGURIDAD ══ -->
        <div v-if="activeTab === 'security'" class="p-4 sm:p-6">
          <h3 class="mb-5 text-base font-semibold text-gray-800 sm:text-lg">Cambiar Contraseña</h3>
          <div class="grid grid-cols-1 gap-4 max-w-lg sm:grid-cols-1">
            <div>
              <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Contraseña Actual</label>
              <input v-model="passwordData.current_password" type="password"
                class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu contraseña actual" />
            </div>
            <div>
              <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Nueva Contraseña</label>
              <input v-model="passwordData.new_password" type="password"
                class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mínimo 8 caracteres" />
            </div>
            <div>
              <label class="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Confirmar Nueva Contraseña</label>
              <input v-model="passwordData.re_new_password" type="password"
                class="px-3 py-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Repite tu nueva contraseña" />
            </div>
            <div>
              <button @click="changePassword" :disabled="isChangingPassword || !isPasswordFormValid"
                class="py-2.5 w-full text-sm font-medium text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700 disabled:opacity-50">
                <i v-if="isChangingPassword" class="mr-2 fa-solid fa-spinner fa-spin"></i>
                {{ isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
              </button>
            </div>
          </div>
        </div>

      </div>

      <div class="pb-6 sm:pb-0"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getNotifications, markNotificationRead } from '@/services/api'
import api from '@/services/api'
import { useToast } from 'vue-toastification'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const toast = useToast()
const router = useRouter()
const route = useRoute()

// Tab management
const activeTab = ref('profile')

// Check URL query params to auto-open notifications tab
onMounted(() => {
  if (route.query.notifications === 'true') {
    activeTab.value = 'notifications'
    console.log('[Perfil] Auto-opening notifications tab from URL param')
  }
})

// Watch for route changes to handle navigation with query params
watch(() => route.query.notifications, (newVal) => {
  if (newVal === 'true') {
    activeTab.value = 'notifications'
    console.log('[Perfil] Switching to notifications tab from route change')
  }
})

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
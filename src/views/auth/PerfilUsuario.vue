<template>
  <div class="min-h-screen bg-gray-50">

    <!-- ─── PROFILE HEADER ─── -->
    <div class="bg-gradient-to-br from-gray-900 to-black">
      <div class="px-4 mx-auto max-w-3xl sm:px-6">
        <div class="flex items-center gap-4 pt-8 pb-6">
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <div class="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] border-4 border-white/10 overflow-hidden shadow-xl">
              <img
                v-if="user?.profile?.image && user.profile.image.trim() !== ''"
                :src="user.profile.image"
                :alt="userName"
                class="object-cover w-full h-full"
                @error="$event.target.style.display='none'"
              />
              <span v-else class="text-3xl font-bold text-white">{{ userInitials }}</span>
            </div>
            <div v-if="unreadCount > 0" class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 rounded-full border-2 border-black">
              <span class="text-xs font-bold text-white leading-none">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h1 class="text-xl font-bold text-white truncate">{{ userName }}</h1>
            <p class="text-sm text-gray-400">{{ userRole }}</p>
            <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
          </div>

          <!-- Edit button -->
          <button
            v-if="!isEditing"
            @click="toggleEdit"
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-white/10 rounded-xl hover:bg-white/20 transition-colors flex-shrink-0 border border-white/10"
          >
            <i class="fa-solid fa-pen text-xs"></i>
            <span class="hidden sm:inline">Editar</span>
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-white/10">
          <button
            @click="activeTab = 'profile'"
            class="flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
            :class="activeTab === 'profile' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300'"
          >
            <i class="fa-solid fa-user text-xs"></i>Perfil
          </button>
          <button
            @click="activeTab = 'notifications'"
            class="flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
            :class="activeTab === 'notifications' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300'"
          >
            <i class="fa-solid fa-bell text-xs"></i>
            Notificaciones
            <span v-if="unreadCount > 0" class="inline-flex items-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full leading-none">{{ unreadCount }}</span>
          </button>
          <button
            @click="activeTab = 'security'"
            class="flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
            :class="activeTab === 'security' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300'"
          >
            <i class="fa-solid fa-shield-alt text-xs"></i>Seguridad
          </button>
        </div>
      </div>
    </div>

    <!-- ─── CONTENT ─── -->
    <div class="px-4 mx-auto max-w-3xl py-6 sm:px-6">

      <!-- ══ PERFIL ══ -->
      <div v-if="activeTab === 'profile'">

        <!-- VIEW MODE -->
        <template v-if="!isEditing">
          <!-- Personal info card -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <div class="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Información Personal</span>
            </div>
            <div class="divide-y divide-gray-50">
              <div class="flex items-center gap-4 px-5 py-3.5">
                <i class="fa-solid fa-user text-gray-400 w-4 text-center flex-shrink-0"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-400">Nombre completo</p>
                  <p class="text-sm font-semibold text-gray-900">{{ [user?.first_name, user?.last_name].filter(Boolean).join(' ') || '—' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 px-5 py-3.5">
                <i class="fa-solid fa-envelope text-gray-400 w-4 text-center flex-shrink-0"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-400">Email</p>
                  <p class="text-sm font-semibold text-gray-900 break-all">{{ user?.email || '—' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 px-5 py-3.5">
                <i class="fa-solid fa-phone text-gray-400 w-4 text-center flex-shrink-0"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-400">Teléfono</p>
                  <p class="text-sm font-semibold text-gray-900">{{ user?.phone || '—' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 px-5 py-3.5">
                <i class="fa-solid fa-venus-mars text-gray-400 w-4 text-center flex-shrink-0"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-400">Género</p>
                  <p class="text-sm font-semibold text-gray-900">{{ getGenderLabel(user?.profile?.gender) || '—' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 px-5 py-3.5">
                <i class="fa-solid fa-id-badge text-gray-400 w-4 text-center flex-shrink-0"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-400">Rol</p>
                  <p class="text-sm font-semibold text-gray-900">{{ userRole }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Address card -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <div class="px-5 py-3.5 border-b border-gray-50">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dirección</span>
            </div>
            <div class="divide-y divide-gray-50">
              <div class="flex items-center gap-4 px-5 py-3.5">
                <i class="fa-solid fa-globe text-gray-400 w-4 text-center flex-shrink-0"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-400">País</p>
                  <p class="text-sm font-semibold text-gray-900">{{ user?.profile?.country || '—' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 px-5 py-3.5">
                <i class="fa-solid fa-city text-gray-400 w-4 text-center flex-shrink-0"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-400">Estado / Ciudad</p>
                  <p class="text-sm font-semibold text-gray-900">{{ user?.profile?.state || '—' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 px-5 py-3.5">
                <i class="fa-solid fa-location-dot text-gray-400 w-4 text-center flex-shrink-0"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-400">Dirección completa</p>
                  <p class="text-sm font-semibold text-gray-900">{{ user?.profile?.address || '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit button (bottom) -->
          <button
            @click="toggleEdit"
            class="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-gray-700 bg-white rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <i class="fa-solid fa-pen text-xs text-gray-400"></i>
            Editar perfil
          </button>
        </template>

        <!-- EDIT MODE -->
        <template v-else>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <div class="px-5 py-3.5 border-b border-gray-50">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Editar Perfil</span>
            </div>
            <div class="p-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</label>
                <input v-model="formData.first_name" class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
              </div>
              <div>
                <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Apellido</label>
                <input v-model="formData.last_name" class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
              </div>
              <div>
                <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Teléfono</label>
                <input v-model="formData.phone" class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
              </div>
              <div>
                <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Género</label>
                <select v-model="formData.profile.gender" class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50">
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
              <div>
                <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">País</label>
                <input v-model="formData.profile.country" class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
              </div>
              <div>
                <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado / Ciudad</label>
                <input v-model="formData.profile.state" class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
              </div>
              <div class="sm:col-span-2">
                <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Imagen de perfil (URL)</label>
                <input v-model="formData.profile.image" class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" placeholder="https://..." />
              </div>
              <div class="sm:col-span-2">
                <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Dirección</label>
                <textarea v-model="formData.profile.address" rows="2" class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none"></textarea>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="toggleEdit" class="flex-1 py-3 text-sm font-semibold text-gray-700 bg-white rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button @click="saveProfile" :disabled="isSaving" class="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50">
              <i v-if="isSaving" class="mr-1.5 fa-solid fa-spinner fa-spin"></i>
              {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </template>
      </div>

      <!-- ══ NOTIFICACIONES ══ -->
      <div v-if="activeTab === 'notifications'">

        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-gray-800">Notificaciones</h3>
            <p class="text-xs text-gray-400">{{ unreadCount }} sin leer</p>
          </div>
          <button @click="markAllAsRead" :disabled="isMarkingAllRead || unreadCount === 0"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30" title="Marcar todas como leídas">
            <i v-if="isMarkingAllRead" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-rotate text-base"></i>
          </button>
        </div>

        <!-- Filter chips -->
        <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
          <button
            v-for="f in [
              { key: 'all', label: 'Todas' },
              { key: 'reservas', label: 'Reservas' },
              { key: 'pagos', label: 'Pagos' },
            ]"
            :key="f.key"
            @click="notifFilter = f.key"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0"
            :class="notifFilter === f.key
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'"
          >
            {{ f.label }}
            <span
              class="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-xs leading-none"
              :class="notifFilter === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'"
            >{{ notifCountByFilter[f.key] }}</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="notificationsLoading" class="py-16 text-center bg-white rounded-2xl border border-gray-100">
          <i class="text-3xl text-gray-200 fa-solid fa-spinner fa-spin"></i>
          <p class="mt-3 text-sm text-gray-400">Cargando...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredNotifications.length === 0" class="py-16 text-center bg-white rounded-2xl border border-gray-100">
          <i class="text-3xl text-gray-200 fa-solid fa-bell-slash mb-4 block"></i>
          <p class="text-sm font-medium text-gray-500">Sin notificaciones</p>
          <p class="text-xs text-gray-400 mt-1">Aquí aparecerán tus notificaciones</p>
        </div>

        <!-- List -->
        <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50/50"
            :class="!notification.read ? 'bg-blue-50/30' : ''"
          >
            <!-- Type icon -->
            <i :class="['fa-solid', notifIcon(notification.type).icon, 'text-gray-400 flex-shrink-0 mt-1 w-4 text-center']"></i>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-semibold text-gray-900 leading-snug">{{ getNotificationTitle(notification) }}</p>
                <div v-if="!notification.read" class="flex-shrink-0 w-2 h-2 mt-1.5 bg-blue-500 rounded-full"></div>
              </div>
              <p class="mt-0.5 text-xs leading-relaxed text-gray-500 line-clamp-2">{{ notification.message }}</p>

              <!-- Tag + actions row -->
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <!-- Context tag -->
                <span
                  v-if="notifTag(notification)"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold"
                  :class="notifTag(notification).bg"
                >
                  <i class="fa-solid fa-tag text-xs opacity-70"></i>
                  {{ notifTag(notification).label }}
                </span>

                <!-- Timestamp -->
                <span class="text-xs text-gray-400">{{ formatDate(notification.created_at) }}</span>

                <!-- Actions -->
                <div class="ml-auto flex items-center gap-2">
                  <button v-if="notification.booking" @click.stop="viewBooking(notification.booking)"
                    class="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Ver reserva →
                  </button>
                  <button v-if="!notification.read" @click.stop="markAsRead(notification.id)"
                    class="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="fa-solid fa-check"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="!notificationsLoading && notificationsPagination.count > notifications.length" class="mt-4">
          <p class="mb-3 text-xs text-center text-gray-400">{{ notifications.length }} de {{ notificationsPagination.count }}</p>
          <div class="flex gap-3">
            <button @click="loadNotifications(notificationsPagination.previous)"
              :disabled="!notificationsPagination.previous || notificationsLoading"
              class="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-white rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <i class="fa-solid fa-chevron-left mr-1 text-xs"></i>Anterior
            </button>
            <span class="flex items-center px-4 text-xs font-medium text-gray-400">Pág. {{ getCurrentPage() }}</span>
            <button @click="loadNotifications(notificationsPagination.next)"
              :disabled="!notificationsPagination.next || notificationsLoading"
              class="flex-1 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-2xl hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Siguiente<i class="fa-solid fa-chevron-right ml-1 text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Bottom actions -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button @click="markAllAsRead" :disabled="isMarkingAllRead || unreadCount === 0"
            class="text-sm font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 transition-colors disabled:opacity-40">
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <!-- ══ SEGURIDAD ══ -->
      <div v-if="activeTab === 'security'">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div class="px-5 py-3.5 border-b border-gray-50">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cambiar Contraseña</span>
          </div>
          <div class="p-5 space-y-4 max-w-md">
            <div>
              <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contraseña Actual</label>
              <input v-model="passwordData.current_password" type="password"
                class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Tu contraseña actual" />
            </div>
            <div>
              <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nueva Contraseña</label>
              <input v-model="passwordData.new_password" type="password"
                class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Mínimo 8 caracteres" />
            </div>
            <div>
              <label class="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Confirmar Nueva Contraseña</label>
              <input v-model="passwordData.re_new_password" type="password"
                class="px-3 py-2.5 w-full text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Repite tu nueva contraseña" />
            </div>
          </div>
        </div>

        <button @click="changePassword" :disabled="isChangingPassword || !isPasswordFormValid"
          class="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white bg-red-600 rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-50">
          <i v-if="isChangingPassword" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-lock text-xs"></i>
          {{ isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
        </button>
      </div>

    </div>

    <div class="pb-8"></div>
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
onMounted(async () => {
  await authStore.fetchUser()
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

// Notification filter
const notifFilter = ref('all')

const filteredNotifications = computed(() => {
  if (notifFilter.value === 'reservas') {
    return notifications.value.filter(n => ['booking_confirmed','booking_cancelled','booking_reminder','status_change'].includes(n.type))
  }
  if (notifFilter.value === 'pagos') {
    return notifications.value.filter(n => ['payment_received','payment_failed'].includes(n.type))
  }
  return notifications.value
})

const notifCountByFilter = computed(() => ({
  all: notifications.value.length,
  reservas: notifications.value.filter(n => ['booking_confirmed','booking_cancelled','booking_reminder','status_change'].includes(n.type)).length,
  pagos: notifications.value.filter(n => ['payment_received','payment_failed'].includes(n.type)).length,
}))

function notifIcon(type) {
  if (['booking_confirmed','booking_cancelled','booking_reminder','status_change'].includes(type)) return { icon: 'fa-calendar-check', bg: 'bg-blue-100', text: 'text-blue-600' }
  if (['payment_received','payment_failed'].includes(type)) return { icon: 'fa-dollar-sign', bg: 'bg-green-100', text: 'text-green-600' }
  return { icon: 'fa-bell', bg: 'bg-gray-100', text: 'text-gray-500' }
}

function notifTag(notification) {
  if (notification.booking) return { label: `Reserva #${String(notification.booking).slice(0,6).toUpperCase()}`, bg: 'bg-blue-50 text-blue-600' }
  if (['payment_received','payment_failed'].includes(notification.type)) return { label: 'Pago', bg: 'bg-green-50 text-green-600' }
  return null
}

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
    authStore.setUnreadCount(unreadCount.value)
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
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value = notifications.value.filter(n => n && !n.read).length
      authStore.decrementUnreadCount()
    }
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
    notifications.value.forEach(n => { if (n) n.read = true })
    unreadCount.value = 0
    authStore.setUnreadCount(0)
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
<template>
  <div class="py-10 min-h-screen bg-gray-50">
    <div class="px-4 mx-auto max-w-3xl">
      <!-- Breadcrumb for Staff -->
      <nav v-if="isStaffView" class="mb-4 text-xs text-gray-500">
        <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
        <span class="mx-2">/</span>
        <span class="font-semibold text-gray-700">Reservas</span>
      </nav>
      
      <h1 class="mb-6 text-3xl font-bold text-gray-900">
        {{ isStaffView ? 'Reservas' : 'Mis Reservas' }}
      </h1>
      
      <!-- Staff Info Banner -->
      <div v-if="isStaffView" class="p-4 mb-6 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center">
          <i class="mr-2 text-blue-600 fa-solid fa-user-shield"></i>
          <span class="text-sm text-blue-800">
            <strong>Modo Staff:</strong> Puedes ver todas las reservas del sistema
          </span>
        </div>
      </div>
      
      <!-- Filter Bar -->
      <div class="flex overflow-x-auto gap-2 pb-2 mb-6">
        <button
          v-for="status in statusFilters"
          :key="status.value"
          @click="selectedStatus = status.value"
          class="flex relative flex-shrink-0 items-center px-5 py-1 text-xs font-semibold whitespace-nowrap rounded-full border transition-all duration-150 focus:outline-none"
          :class="[
            selectedStatus === status.value
              ? 'text-blue-600 bg-white border-blue-500 z-10 ring-2 ring-offset-2 ring-transparent'
              : 'text-gray-600 bg-gray-100 border border-gray-200',
            'hover:bg-blue-50 hover:shadow-md hover:z-10'
          ]"
          :style="selectedStatus === status.value ? 'box-shadow: 0 4px 0 0 #7c3aed, 0 8px 0 0 #22d3ee;' : ''"
        >
          <span class="whitespace-nowrap">{{ status.label }}</span>
          <span v-if="getStatusCount(status.value) > 0" :class="selectedStatus === status.value ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 text-gray-600 border border-gray-200'" class="inline-block px-1.5 py-0.5 ml-2 text-xs font-semibold align-middle whitespace-nowrap rounded-full">{{ getStatusCount(status.value) }}</span>
        </button>
      </div>
      
      <div class="p-6 bg-white rounded-lg shadow-lg">
        <div v-if="loading" class="py-8 text-center">
          <div class="inline-block w-8 h-8 rounded-full border-b-2 border-cyan-500 animate-spin"></div>
          <p class="mt-2 text-gray-600">Cargando reservas...</p>
        </div>
        
        <div v-else-if="reservations.length === 0" class="py-8 text-center">
          <div class="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="mb-2 text-lg font-semibold text-gray-900">
            {{ isStaffView ? 'No hay reservas' : 'No tienes reservas' }}
          </h3>
          <p class="mb-4 text-gray-600">
            {{ isStaffView ? 'No hay reservas en el sistema.' : 'Aún no has realizado ninguna reserva.' }}
          </p>
          <router-link 
            v-if="!isStaffView"
            to="/reservar" 
            class="inline-block px-4 py-2 font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded transition-all duration-200 hover:from-cyan-600 hover:to-blue-600"
          >
            Hacer mi primera reserva
          </router-link>
        </div>
        
        <div v-else class="flex flex-col gap-6">
          <!-- Removed featured reservation card -->
          <div
            v-for="(reservation, i) in reservations"
            :key="reservation.id"
            class="relative group"
          >
            <div
              class="absolute inset-0 z-0 rounded-2xl translate-x-2 translate-y-2 pointer-events-none"
              :style="`background: ${cardGradients[i % cardGradients.length]}`"
            ></div>
            <div class="flex relative z-10 flex-col gap-4 p-5 bg-white rounded-2xl border border-cyan-100 shadow-lg transition-shadow transition-transform duration-300 md:flex-row md:items-center md:justify-between group-hover:-translate-y-2 group-hover:shadow-2xl">
              <div class="flex-1">
                <!-- Staff: Show user info -->
                <div v-if="isStaff && reservation.user_name" class="p-2 mb-3 bg-gray-50 rounded-lg">
                  <div class="text-sm text-gray-600">
                    <i class="mr-1 fa-solid fa-user"></i>
                    <strong>Cliente:</strong> {{ reservation.user_name }}
                  </div>
                  <div v-if="reservation.user_email" class="text-sm text-gray-600">
                    <i class="mr-1 fa-solid fa-envelope"></i>
                    {{ reservation.user_email }}
                  </div>
                </div>
                
                <div class="flex gap-2 items-center mb-2">
                  <span class="text-lg font-bold text-primary-700">{{ formatDate(reservation.start_datetime) }}</span>
                  <span class="text-xs text-gray-500">({{ getDayOfWeek(reservation.start_datetime) }})</span>
                </div>
                <div class="flex flex-wrap gap-4 mb-2">
                  <div>
                    <span class="block text-xs text-gray-500">Hora inicio</span>
                    <span class="font-semibold text-gray-800">{{ formatTime(reservation.start_datetime) }}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-500">Hora fin</span>
                    <span class="font-semibold text-gray-800">{{ formatTime(reservation.end_datetime) }}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-500">Paquete</span>
                    <span class="font-semibold text-primary-700">{{ reservation.package }}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-500">Total</span>
                    <span class="font-semibold text-green-700">${{ reservation.total }}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-500">Anticipo</span>
                    <span class="font-semibold text-emerald-600">${{ reservation.advancedPayment }}</span>
                  </div>
                </div>
                <div class="flex gap-2 items-center mb-2">
                  <span :class="getStatusClasses(reservation.status)" class="px-2 py-1 text-xs font-bold rounded">
                    {{ reservation.status }}
                  </span>
                </div>
              </div>
              <div class="flex flex-col gap-2 items-end">
                <router-link
                  :to="`/detalle-reserva/${reservation.id}`"
                  class="px-4 py-2 font-bold text-white rounded shadow transition-all duration-200"
                  :style="`background: ${cardGradients[i % cardGradients.length]}`"
                >
                  {{ isStaff ? 'Ver Detalles' : 'Ver detalles' }}
                </router-link>
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-6">
            <button @click="handlePrev" :disabled="!prevPage" class="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
            <span class="text-gray-600">Total: {{ count }}</span>
            <button @click="handleNext" :disabled="!nextPage" class="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

import api from '@/services/api'

const authStore = useAuthStore()
const route = useRoute()

const loading = ref(true)
const reservations = ref([])
const nextPage = ref(null)
const prevPage = ref(null)
const count = ref(0)

const STATUS_CHOICES = [
  { value: '', label: 'Todos' },
  { value: 'solicitud', label: 'Solicitud de Reserva' },
  { value: 'aceptacion', label: 'Aceptación de Reserva' },
  { value: 'apartado', label: 'Apartado inicial' },
  { value: 'liquidado', label: 'Monto liquidado' },
  { value: 'liquidado_entregado', label: 'Monto liquidado y lugar entregado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'finalizado', label: 'Reserva finalizada' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'rechazado', label: 'Rechazado' },
]

const statusFilters = STATUS_CHOICES
const selectedStatus = ref('')
const statusCounts = ref({})

const fetchReservations = async (url = null) => {
  loading.value = true
  try {
    let endpoint = url || '/api/bookings/bookings/'
    // Add status filter if selected
    const status = selectedStatus.value
    if (!url && status) {
      endpoint += `?status=${encodeURIComponent(status)}`
    }
    const res = await api.get(endpoint)
    console.log('API bookings response:', res.data)
    const data = res.data
    count.value = data.count
    nextPage.value = data.next
    prevPage.value = data.previous
    reservations.value = (data.results || []).map(r => ({
      id: r.id,
      start_datetime: r.start_datetime || '',
      end_datetime: r.end_datetime || '',
      package: r.package_name || '',
      status: r.status_display || '',
      total: r.total_price || '',
      advancedPayment: r.advance_paid || '',
      user_name: r.user_name || '', // Added for staff mode
      user_email: r.user_email || '' // Added for staff mode
    }))
  } catch (e) {
    console.error('Error fetching bookings:', e)
    reservations.value = []
  } finally {
    loading.value = false
  }
}

const fetchStatusCounts = async () => {
  try {
    const res = await api.get('/api/bookings/status-counts/')
    statusCounts.value = res.data || {}
  } catch (e) {
    statusCounts.value = {}
  }
}

onMounted(() => {
  fetchReservations()
  fetchStatusCounts()
})

watch(selectedStatus, () => {
  fetchReservations()
})

const handleNext = () => {
  if (nextPage.value) fetchReservations(nextPage.value)
}
const handlePrev = () => {
  if (prevPage.value) fetchReservations(prevPage.value)
}

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const getDayOfWeek = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', { weekday: 'long' })
}

const getStatusClasses = (status) => {
  // Normalize to lowercase and remove accents for matching
  const normalized = (status || '').toLowerCase().normalize('NFD').replace(/[  -]/g, '');
  if (normalized.includes('solicitud')) return 'bg-blue-100 text-blue-700';
  if (normalized.includes('aceptacion')) return 'bg-cyan-200 text-cyan-700';
  if (normalized.includes('apartado')) return 'bg-yellow-100 text-yellow-700';
  if (normalized.includes('liquidado y lugar entregado') || normalized.includes('liquidado_entregado')) return 'bg-emerald-100 text-emerald-700';
  if (normalized.includes('liquidado')) return 'bg-green-100 text-green-700';
  if (normalized.includes('entregado')) return 'bg-teal-100 text-teal-700';
  if (normalized.includes('finalizada') || normalized.includes('finalizado')) return 'bg-gray-200 text-gray-700';
  if (normalized.includes('cancelado')) return 'bg-red-100 text-red-700';
  if (normalized.includes('rechazado')) return 'bg-pink-100 text-pink-700';
  return 'bg-gray-100 text-gray-700';
}

const cardGradients = [
  'linear-gradient(90deg, #7c3aed, #22d3ee)',
  'linear-gradient(90deg, #f472b6, #fbbf24)',
  'linear-gradient(90deg, #34d399, #a3e635)',
]

// Determine if the user is a staff member
const isStaff = computed(() => {
  return authStore.user?.is_staff
})

// Determine if this is the staff view (accessed via /reservas)
const isStaffView = computed(() => {
  return route.path === '/reservas'
})

// Filtered reservations
const filteredReservations = computed(() => {
  if (!selectedStatus.value) return reservations.value
  return reservations.value.filter(r => r.statusKey === selectedStatus.value)
})

// In the filter bar, update the count for 'Todos' to be the sum of all status counts
const getStatusCount = (statusValue) => {
  if (statusValue === '') {
    // Sum all status counts for 'Todos'
    return Object.values(statusCounts.value).reduce((a, b) => a + b, 0)
  }
  return statusCounts.value[statusValue] || 0
}
</script> 
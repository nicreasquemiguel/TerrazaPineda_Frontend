import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useLogsStore = defineStore('logs', () => {
  const activityLogs = ref([])
  const activitySummary = ref(null)
  const bookingLogs = ref([])
  const paymentLogs = ref([])
  const userLogs = ref([])
  const systemLogs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({ count: 0, next: null, previous: null })

  function parsePaginated(data, target) {
    if (data.results !== undefined) {
      target.value = data.results
      pagination.value = { count: data.count, next: data.next, previous: data.previous }
    } else {
      target.value = data
      pagination.value = { count: data.length, next: null, previous: null }
    }
  }

  async function fetchActivityLogs(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/api/logs/activity/', { params })
      parsePaginated(data, activityLogs)
    } catch {
      error.value = 'Error al cargar el registro de actividad'
    } finally {
      loading.value = false
    }
  }

  async function fetchActivitySummary(days = 30) {
    try {
      const { data } = await api.get('/api/logs/activity/summary/', { params: { days } })
      activitySummary.value = data
    } catch (err) {
      console.error('Error fetching activity summary:', err)
    }
  }

  async function fetchBookingLogs(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/api/logs/booking/', { params })
      parsePaginated(data, bookingLogs)
    } catch {
      error.value = 'Error al cargar el registro de reservas'
    } finally {
      loading.value = false
    }
  }

  async function fetchPaymentLogs(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/api/logs/payment/', { params })
      parsePaginated(data, paymentLogs)
    } catch {
      error.value = 'Error al cargar el registro de pagos'
    } finally {
      loading.value = false
    }
  }

  async function fetchUserLogs(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/api/logs/user/', { params })
      parsePaginated(data, userLogs)
    } catch {
      error.value = 'Error al cargar el registro de usuarios'
    } finally {
      loading.value = false
    }
  }

  async function fetchSystemLogs(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/api/logs/system/', { params })
      parsePaginated(data, systemLogs)
    } catch {
      error.value = 'Error al cargar el registro del sistema'
    } finally {
      loading.value = false
    }
  }

  return {
    activityLogs, activitySummary, bookingLogs, paymentLogs, userLogs, systemLogs,
    loading, error, pagination,
    fetchActivityLogs, fetchActivitySummary,
    fetchBookingLogs, fetchPaymentLogs, fetchUserLogs, fetchSystemLogs,
  }
})

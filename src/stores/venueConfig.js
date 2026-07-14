import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

// "22:00" or "22:00:00" -> "10 de la noche"
export function formatTimeWords(timeStr) {
  if (!timeStr) return ''
  const h = parseInt(timeStr.split(':')[0], 10)
  const displayHour = h % 12 === 0 ? 12 : h % 12
  let period
  if (h === 0) period = 'de la medianoche'
  else if (h === 12) period = 'del mediodía'
  else if (h < 12) period = 'de la mañana'
  else if (h < 20) period = 'de la tarde'
  else period = 'de la noche'
  return `${displayHour} ${period}`
}

// "22:00" or "22:00:00" -> "10:00 p.m."
export function formatTimeAmPm(timeStr) {
  if (!timeStr) return ''
  const [hStr, mStr] = timeStr.split(':')
  const h = parseInt(hStr, 10)
  const period = h < 12 ? 'a.m.' : 'p.m.'
  const displayHour = h % 12 === 0 ? 12 : h % 12
  return `${displayHour}:${mStr} ${period}`
}

export const useVenueConfigStore = defineStore('venueConfig', () => {
  const openTime = ref('10:00')
  const closeTime = ref('22:00')
  const minimumDeposit = ref(1000)
  const loaded = ref(false)
  let loadingPromise = null

  async function fetchConfig(force = false) {
    if (loaded.value && !force) return
    if (loadingPromise) return loadingPromise

    loadingPromise = api.get('/api/bookings/configuration/')
      .then(({ data }) => {
        if (data.open_time) openTime.value = data.open_time
        if (data.close_time) closeTime.value = data.close_time
        if (data.minimum_deposit !== undefined && data.minimum_deposit !== null) {
          minimumDeposit.value = parseFloat(data.minimum_deposit)
        }
        loaded.value = true
      })
      .catch((err) => {
        console.error('Failed to load venue configuration:', err)
      })
      .finally(() => {
        loadingPromise = null
      })

    return loadingPromise
  }

  return { openTime, closeTime, minimumDeposit, loaded, fetchConfig }
})

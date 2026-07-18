<template>
  <div class="min-h-screen bg-gray-50 pt-14 md:pt-0">
    <AdminSidebar />

    <div class="md:ml-64">
      <!-- Header -->
      <div class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center gap-3 px-4 py-3">
          <div class="flex justify-center items-center w-9 h-9 bg-yellow-100 rounded-xl flex-shrink-0">
            <i class="fa-solid fa-lightbulb text-yellow-500 text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-base font-bold text-gray-900">Control de Luces</div>
            <div class="text-xs text-gray-400">
              {{ venuesLoading ? 'Cargando...' : `${venues.length} venue${venues.length !== 1 ? 's' : ''}` }}
            </div>
          </div>
        </div>

        <!-- Venue selector -->
        <div v-if="venues.length > 1" class="px-4 pb-3 flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            v-for="venue in venues"
            :key="venue.id"
            @click="selectedVenueId = venue.id"
            :class="['px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all flex-shrink-0',
              selectedVenueId === venue.id ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200']"
          >
            {{ venue.name }}
          </button>
        </div>
      </div>

      <div class="px-4 py-4">
        <div v-if="devicesLoading" class="p-4 text-sm text-center text-gray-400 bg-white rounded-2xl border border-gray-200 shadow-sm">
          Cargando dispositivos...
        </div>
        <div v-else-if="!devices.length" class="p-4 text-sm text-center text-gray-400 bg-white rounded-2xl border border-gray-200 shadow-sm">
          No hay luces registradas para este venue.
        </div>
        <div v-else class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <SmartHomeControls
            :devices="devices"
            :control-fn="controlAdminDevice"
            :status-fn="getAdminDeviceStatus"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import SmartHomeControls from '@/components/SmartHomeControls.vue'
import { getVenues, getAdminDevices, controlAdminDevice, getAdminDeviceStatus } from '@/services/api'

const venues = ref([])
const venuesLoading = ref(false)
const selectedVenueId = ref(null)
const devices = ref([])
const devicesLoading = ref(false)

async function fetchVenues() {
  venuesLoading.value = true
  try {
    const res = await getVenues()
    venues.value = Array.isArray(res.data) ? res.data : (res.data.results || [])
    if (venues.value.length && !selectedVenueId.value) {
      selectedVenueId.value = venues.value[0].id
    }
  } catch (e) {
    venues.value = []
  } finally {
    venuesLoading.value = false
  }
}

async function fetchDevices(venueId) {
  if (!venueId) return
  devicesLoading.value = true
  try {
    const res = await getAdminDevices(venueId)
    devices.value = Array.isArray(res.data) ? res.data : (res.data.results || [])
  } catch (e) {
    devices.value = []
  } finally {
    devicesLoading.value = false
  }
}

watch(selectedVenueId, (id) => fetchDevices(id))

onMounted(fetchVenues)
</script>

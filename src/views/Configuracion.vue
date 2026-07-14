<template>
  <div class="min-h-screen bg-gray-50 pt-14 md:pt-0">
    <AdminSidebar />
    <div class="md:ml-64">
      <!-- Page header -->
      <div class="px-6 py-5 border-b border-gray-200 bg-white">
        <h1 class="text-2xl font-bold text-gray-900">Configuración</h1>
        <p class="mt-1 text-sm text-gray-500">Ajustes generales del sistema. Solo accesible para staff.</p>
      </div>

      <div class="px-6 py-6">
        <div v-if="loading" class="py-12 text-center text-gray-500">Cargando...</div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl">
          <!-- Horario del Lugar -->
          <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 flex-shrink-0">
                <i class="text-blue-500 fa-solid fa-clock"></i>
              </div>
              <div>
                <h2 class="text-base font-bold text-gray-800">Horario del Lugar</h2>
                <p class="text-xs text-gray-500 mt-0.5">Horario por defecto para nuevas reservas</p>
              </div>
            </div>

            <div class="space-y-4 mb-5">
              <div>
                <label class="block mb-1.5 text-sm font-semibold text-gray-700">Hora de apertura</label>
                <input
                  v-model="form.open_time"
                  type="time"
                  class="p-3 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block mb-1.5 text-sm font-semibold text-gray-700">Hora de cierre</label>
                <input
                  v-model="form.close_time"
                  type="time"
                  class="p-3 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div v-if="error" class="p-3 mb-4 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
              <i class="mr-1 fa-solid fa-circle-xmark"></i>{{ error }}
            </div>
            <div v-if="saved" class="p-3 mb-4 text-xs text-green-700 bg-green-50 rounded-lg border border-green-200">
              <i class="mr-1 fa-solid fa-circle-check"></i>Configuración guardada correctamente.
            </div>

            <button
              @click="save"
              :disabled="saving"
              class="w-full px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving" class="flex gap-2 items-center justify-center">
                <div class="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
                Guardando...
              </span>
              <span v-else>Guardar cambios</span>
            </button>
          </div>

          <!-- Apartado Mínimo -->
          <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 flex-shrink-0">
                <i class="text-green-500 fa-solid fa-money-bill-wave"></i>
              </div>
              <div>
                <h2 class="text-base font-bold text-gray-800">Apartado Mínimo</h2>
                <p class="text-xs text-gray-500 mt-0.5">Monto mínimo para el apartado inicial de una reserva</p>
              </div>
            </div>

            <div class="space-y-4 mb-5">
              <div>
                <label class="block mb-1.5 text-sm font-semibold text-gray-700">Monto mínimo (MXN)</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
                  <input
                    v-model.number="form.minimum_deposit"
                    type="number"
                    min="0"
                    step="1"
                    class="p-3 pl-6 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              @click="save"
              :disabled="saving"
              class="w-full px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving" class="flex gap-2 items-center justify-center">
                <div class="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
                Guardando...
              </span>
              <span v-else>Guardar cambios</span>
            </button>
          </div>
        </div>
      </div>
    </div><!-- end md:ml-64 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { useVenueConfigStore } from '@/stores/venueConfig'

const venueConfigStore = useVenueConfigStore()

const loading = ref(true)
const saving = ref(false)
const saved = ref(false)
const error = ref('')
const form = ref({ open_time: '', close_time: '', minimum_deposit: 0 })

onMounted(async () => {
  try {
    const res = await api.get('/api/bookings/configuration/')
    form.value.open_time = res.data.open_time?.slice(0, 5) ?? ''
    form.value.close_time = res.data.close_time?.slice(0, 5) ?? ''
    form.value.minimum_deposit = parseFloat(res.data.minimum_deposit ?? 0)
  } catch (e) {
    error.value = 'No se pudo cargar la configuración.'
  } finally {
    loading.value = false
  }
})

const save = async () => {
  saving.value = true
  saved.value = false
  error.value = ''
  try {
    await api.patch('/api/bookings/configuration/', {
      open_time: form.value.open_time,
      close_time: form.value.close_time,
      minimum_deposit: form.value.minimum_deposit,
    })
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
    venueConfigStore.fetchConfig(true)
  } catch (e) {
    error.value = 'Error al guardar. Verifica los valores e intenta de nuevo.'
  } finally {
    saving.value = false
  }
}
</script>

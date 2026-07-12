<template>
  <div class="min-h-screen bg-gray-50 pt-14 md:pt-0">
    <AdminSidebar />
    <div class="md:ml-64">
  <div class="py-8 px-4 mx-auto max-w-lg">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Configuración</h1>
      <p class="mt-1 text-sm text-gray-500">Ajustes generales del sistema. Solo accesible para staff.</p>
    </div>

    <div v-if="loading" class="py-12 text-center text-gray-500">Cargando...</div>

    <div v-else class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <h2 class="mb-1 text-base font-bold text-gray-800">
        <i class="mr-2 text-blue-500 fa-solid fa-clock"></i>
        Horario del Lugar
      </h2>
      <p class="mb-5 text-xs text-gray-500">
        Estos horarios se aplican automáticamente a nuevas reservas cuando el cliente no especifica una hora.
      </p>

      <div class="flex gap-4 mb-6">
        <div class="flex-1">
          <label class="block mb-1.5 text-sm font-semibold text-gray-700">Hora de apertura</label>
          <input
            v-model="form.open_time"
            type="time"
            class="p-3 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="flex-1">
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
        class="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="saving" class="flex gap-2 items-center">
          <div class="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
          Guardando...
        </span>
        <span v-else>Guardar cambios</span>
      </button>
    </div>
  </div>
    </div><!-- end md:ml-64 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import AdminSidebar from '@/components/AdminSidebar.vue'

const loading = ref(true)
const saving = ref(false)
const saved = ref(false)
const error = ref('')
const form = ref({ open_time: '', close_time: '' })

onMounted(async () => {
  try {
    const res = await api.get('/api/bookings/configuration/')
    form.value.open_time = res.data.open_time?.slice(0, 5) ?? ''
    form.value.close_time = res.data.close_time?.slice(0, 5) ?? ''
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
    })
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  } catch (e) {
    error.value = 'Error al guardar. Verifica los valores e intenta de nuevo.'
  } finally {
    saving.value = false
  }
}
</script>

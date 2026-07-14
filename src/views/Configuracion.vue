<template>
  <div class="min-h-screen bg-gray-50 pt-14 md:pt-0">
    <AdminSidebar />
    <div class="md:ml-64">
      <!-- Page header -->
      <div class="px-6 py-5 border-b border-gray-200 bg-white">
        <div class="flex flex-wrap gap-2 items-center">
          <h1 class="text-2xl font-bold text-gray-900">Configuración</h1>
          <span
            v-if="isDirty"
            class="px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-100 rounded-full"
          >
            Cambios sin guardar
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500">Ajustes generales del sistema. Solo accesible para staff.</p>
      </div>

      <div class="px-6 py-6 pb-28">
        <div v-if="loading" class="py-12 text-center text-gray-500">Cargando...</div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
          <!-- Horario del Lugar -->
          <section class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 flex-shrink-0">
                <i class="text-blue-500 fa-solid fa-clock"></i>
              </div>
              <div>
                <h2 class="text-base font-bold text-gray-800">Horario del Lugar</h2>
                <p class="text-xs text-gray-500 mt-0.5">Horario por defecto para nuevas reservas</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block mb-1.5 text-sm font-semibold text-gray-700">Hora de apertura</label>
                  <input
                    v-model="form.open_time"
                    type="time"
                    class="p-3 w-full text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="timeError ? 'border-red-300' : 'border-gray-300'"
                  />
                </div>
                <div>
                  <label class="block mb-1.5 text-sm font-semibold text-gray-700">Hora de cierre</label>
                  <input
                    v-model="form.close_time"
                    type="time"
                    class="p-3 w-full text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="timeError ? 'border-red-300' : 'border-gray-300'"
                  />
                </div>
              </div>
              <p v-if="timeError" class="text-xs font-medium text-red-600">
                <i class="mr-1 fa-solid fa-circle-exclamation"></i>{{ timeError }}
              </p>
              <p v-else class="text-xs text-gray-400">
                Horario actual: {{ formatTimeWords(form.open_time) }} a {{ formatTimeWords(form.close_time) }}.
              </p>
            </div>
          </section>

          <!-- Apartado Mínimo -->
          <section class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 flex-shrink-0">
                <i class="text-green-500 fa-solid fa-money-bill-wave"></i>
              </div>
              <div>
                <h2 class="text-base font-bold text-gray-800">Apartado Mínimo</h2>
                <p class="text-xs text-gray-500 mt-0.5">Monto mínimo para el apartado inicial de una reserva</p>
              </div>
            </div>

            <div class="space-y-2">
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
              <p class="text-xs text-gray-400">
                Ejemplo: un cliente deberá apartar mínimo ${{ formattedDeposit }} MXN al reservar.
              </p>
            </div>
          </section>

          <!-- Cambios de Fecha -->
          <section class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 flex-shrink-0">
                <i class="text-purple-500 fa-solid fa-calendar-days"></i>
              </div>
              <div>
                <h2 class="text-base font-bold text-gray-800">Cambios de Fecha</h2>
                <p class="text-xs text-gray-500 mt-0.5">Aviso mínimo requerido para solicitar un cambio de fecha</p>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block mb-1.5 text-sm font-semibold text-gray-700">Días de anticipación</label>
              <input
                v-model.number="form.date_change_notice_days"
                type="number"
                min="0"
                step="1"
                class="p-3 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-400">
                Ejemplo: con un evento en 15 días, un cliente no podría cambiar la fecha (mínimo {{ form.date_change_notice_days || 0 }} días).
              </p>
            </div>
          </section>

          <!-- Política de Cancelación -->
          <section class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 flex-shrink-0">
                <i class="text-red-500 fa-solid fa-rotate-left"></i>
              </div>
              <div>
                <h2 class="text-base font-bold text-gray-800">Política de Cancelación</h2>
                <p class="text-xs text-gray-500 mt-0.5">Reembolso del anticipo al cancelar una reserva</p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block mb-1.5 text-sm font-semibold text-gray-700">Umbral de días</label>
                <input
                  v-model.number="form.cancellation_refund_threshold_days"
                  type="number"
                  min="0"
                  step="1"
                  class="p-3 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block mb-1.5 text-sm font-semibold text-gray-700">Porcentaje de reembolso</label>
                <div class="relative">
                  <input
                    v-model.number="form.cancellation_refund_percent"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    class="p-3 pr-8 w-full text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="percentError ? 'border-red-300' : 'border-gray-300'"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">%</span>
                </div>
              </div>
              <p v-if="percentError" class="text-xs font-medium text-red-600">
                <i class="mr-1 fa-solid fa-circle-exclamation"></i>{{ percentError }}
              </p>
              <p v-else class="text-xs text-gray-400">
                Ejemplo: cancelar con más de {{ form.cancellation_refund_threshold_days || 0 }} días de anticipación
                devuelve el {{ form.cancellation_refund_percent || 0 }}% del anticipo
                (${{ exampleRefundAmount }} de un apartado de ${{ formattedDeposit }}). Con menos días, no hay reembolso.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div><!-- end md:ml-64 -->

    <!-- Sticky save bar -->
    <div class="fixed bottom-0 left-0 right-0 md:left-64 z-30 px-4 py-3 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <div class="flex flex-wrap gap-3 justify-between items-center max-w-4xl">
        <p class="text-xs text-gray-500">
          <template v-if="loading">Cargando configuración…</template>
          <template v-else-if="isDirty">Tienes cambios sin guardar.</template>
          <template v-else>Todo guardado.</template>
        </p>
        <button
          @click="save"
          :disabled="saving || loading || !isDirty || !!timeError || !!percentError"
          class="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { useToast } from 'vue-toastification'
import { useVenueConfigStore, formatTimeWords } from '@/stores/venueConfig'

const toast = useToast()
const venueConfigStore = useVenueConfigStore()

const loading = ref(true)
const saving = ref(false)

const emptyForm = () => ({
  open_time: '', close_time: '', minimum_deposit: 0,
  date_change_notice_days: 21,
  cancellation_refund_threshold_days: 45,
  cancellation_refund_percent: 50,
})

const form = ref(emptyForm())
const originalForm = ref(emptyForm())

const isDirty = computed(() => JSON.stringify(form.value) !== JSON.stringify(originalForm.value))

const timeError = computed(() => {
  if (form.value.open_time && form.value.close_time && form.value.open_time === form.value.close_time) {
    return 'La hora de apertura y cierre no pueden ser iguales.'
  }
  return ''
})

const percentError = computed(() => {
  const pct = form.value.cancellation_refund_percent
  if (pct === '' || pct === null || pct === undefined) return ''
  if (pct < 0 || pct > 100) return 'El porcentaje debe estar entre 0 y 100.'
  return ''
})

const formattedDeposit = computed(() => (form.value.minimum_deposit || 0).toLocaleString('es-MX'))
const exampleRefundAmount = computed(() => {
  const amount = (form.value.minimum_deposit || 0) * (form.value.cancellation_refund_percent || 0) / 100
  return amount.toLocaleString('es-MX', { maximumFractionDigits: 0 })
})

onMounted(async () => {
  try {
    const res = await api.get('/api/bookings/configuration/')
    const loaded = {
      open_time: res.data.open_time?.slice(0, 5) ?? '',
      close_time: res.data.close_time?.slice(0, 5) ?? '',
      minimum_deposit: parseFloat(res.data.minimum_deposit ?? 0),
      date_change_notice_days: parseInt(res.data.date_change_notice_days ?? 21, 10),
      cancellation_refund_threshold_days: parseInt(res.data.cancellation_refund_threshold_days ?? 45, 10),
      cancellation_refund_percent: parseFloat(res.data.cancellation_refund_percent ?? 50),
    }
    form.value = { ...loaded }
    originalForm.value = { ...loaded }
  } catch (e) {
    toast.error('No se pudo cargar la configuración.')
  } finally {
    loading.value = false
  }
})

const save = async () => {
  if (timeError.value || percentError.value) return
  saving.value = true
  try {
    await api.patch('/api/bookings/configuration/', form.value)
    originalForm.value = { ...form.value }
    toast.success('Configuración guardada correctamente.')
    venueConfigStore.fetchConfig(true)
  } catch (e) {
    toast.error('Error al guardar. Verifica los valores e intenta de nuevo.')
  } finally {
    saving.value = false
  }
}
</script>

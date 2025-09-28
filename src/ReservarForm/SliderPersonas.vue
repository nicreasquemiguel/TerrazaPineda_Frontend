<template>
  <div class="grid grid-cols-1 justify-center place-items-center w-3/4 text-center rounded-2xl md:w-full shadow-d">
    <!-- Amenities Section -->
    <div class="flex flex-col items-center mb-4 w-full">
      <div class="mb-2 text-base font-bold text-gray-700 text-center w-full md:w-[28rem]">¿Qué está incluido?</div>
      <div class="flex justify-center items-end w-full md:w-[28rem] md:flex-nowrap" style="scrollbar-width: thin;">
        <div
          v-for="(amenity, i) in amenities"
          :key="i"
          class="flex flex-col flex-1 items-center mx-1"
        >
          <div
            :key="paqueteSeleccionado && paqueteSeleccionado.icon === amenity.icon ? 'selected-' + paqueteSeleccionado.icon + '-' + paqueteSeleccionado.n_people : 'unselected-' + amenity.icon"
            class="flex justify-center items-center transition-transform duration-200"
          >
            <Icon :icon="amenity.icon" class="text-xl text-sky-400 md:text-3xl" />
          </div>
          <div class="w-full text-xs leading-tight text-center text-gray-600" style="height: 3em; display: flex; align-items: flex-start; justify-content: center;">
            {{ amenity.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="grid gap-1 justify-around md:gap-2 grid-rows-auto">
      <fieldset>
        <div v-for="(paquete, index) in paquetes" :key="index" class="flex place-items-center h-32">
          <div class="flex flex-wrap gap-3">
            <label :for="'inline-radio-' + paquete.title" class="cursor-pointer">
              <input
                :id="'inline-radio-' + paquete.title"
                type="radio"
                name="radio-paquete"
                class="sr-only peer"
                :value="paquete.n_people"
                :checked="paquete.n_people === paqueteSeleccionado?.n_people"
                @change="() => onPaqueteChange(paquete)"
              />
              <div
                class="relative p-5 text-gray-600 transition-all w-72 md:w-[28rem] rounded-xl bg-slate-200 ring-2 ring-transparent peer-checked:shadow-xl peer-checked:text-sky-600 hover:ring-blue-400 peer-checked:ring-offset-2"
              >
                <div v-if="paquete.icon" class="absolute top-4 left-4 text-[50px] text-sky-400">
                  <div 
                    :key="paqueteSeleccionado && paqueteSeleccionado.n_people === paquete.n_people ? 'selected-' + paquete.n_people + '-' + Date.now() : 'unselected-' + paquete.n_people"
                    :class="{'animate-shake': paqueteSeleccionado && paqueteSeleccionado.n_people === paquete.n_people}"
                  >
                    <Icon :icon="paquete.icon" />
                  </div>
                </div>
                <div class="flex flex-col gap-1 pl-14 md:pl-20">
                  <div class="flex justify-between items-center">
                    <p><span class="text-lg font-bold">{{ paquete.title }}</span></p>
                    <div>
                      <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" /></svg>
                    </div>
                  </div>
                  <div class="flex justify-between items-end">
                    <p class="text-sm font-semibold text-gray-500 uppercase">personas</p>
                    <p class="text-sm font-bold">${{ paquete.price }}</p>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import api from '@/services/api'
import { Icon } from '@iconify/vue'

const amenities = [
  { icon: 'mdi:table-chair', label: 'Mobiliario' },
  { icon: 'mdi:clock-outline', label: '10am- 12am' },
  { icon: 'mdi:waves', label: 'Alberca Climatizada' },
  { icon: 'mdi:wifi', label: 'Wifi' },
  { icon: 'mdi:grill', label: 'Asador' },
]

const paquetes = ref([])
const paqueteSeleccionado = ref(null)
const emit = defineEmits(['update:modelValue'])

const fetchPaquetes = async () => {
  const res = await api.get('/api/bookings/packages/?limit=10')
  paquetes.value = Array.isArray(res.data) ? res.data : (res.data.results || [])
  if (!paqueteSeleccionado.value && paquetes.value.length) {
    paqueteSeleccionado.value = paquetes.value[0]
    emit('update:modelValue', paqueteSeleccionado.value)
  }
}

onMounted(fetchPaquetes)

function onPaqueteChange(paquete) {
  paqueteSeleccionado.value = paquete
  emit('update:modelValue', paquete)
}
</script>

<style scoped>
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
  100% { transform: translateX(0); }
}
.animate-shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}
</style> 
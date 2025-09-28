<template>
  <div class="grid grid-cols-1 justify-center place-items-center w-3/4 text-center rounded-2xl md:w-full shadow-d">


    <div class="grid gap-1 justify-around md:gap-2 grid-rows-auto">
      <fieldset>
        <div v-for="(extra, index) in extras" :key="index" class="flex place-items-center h-32">
          <div class="flex flex-wrap gap-3">
            <label :for="'checkbox-extra-' + extra.id" class="cursor-pointer">
              <input
                :id="'checkbox-extra-' + extra.id"
                type="checkbox"
                name="checkbox-extras"
                class="sr-only peer"
                :value="extra.id"
                :checked="selectedExtras.includes(extra.id)"
                @change="() => onExtraChange(extra)"
              />
              <div
                class="relative p-5 text-gray-600 transition-all w-72 md:w-[28rem] rounded-xl bg-slate-200 ring-2 ring-transparent peer-checked:shadow-xl peer-checked:text-sky-600 hover:ring-blue-400 peer-checked:ring-offset-2"
              >
                <div v-if="extra.icon" class="absolute top-4 left-4 text-[50px] text-sky-400">
                  <div 
                    :key="selectedExtras.includes(extra.id) ? 'selected-' + extra.id + '-' + Date.now() : 'unselected-' + extra.id"
                    :class="{'animate-shake': selectedExtras.includes(extra.id)}"
                  >
                    <Icon :icon="extra.icon" />
                  </div>
                </div>
                <div class="flex flex-col gap-1 pl-14 md:pl-20">
                  <div class="flex justify-between items-center">
                    <p><span class="text-lg font-bold">{{ extra.name }}</span></p>
                    <div>
                      <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q1.35-1.35-3.175 2.137Q14.075 22 12 22Z" /></svg>
                    </div>
                  </div>
                  <div class="flex justify-between items-end">
                    <p class="text-sm font-semibold text-gray-500 uppercase">{{ extra.name }}</p>
                    <p class="text-sm font-bold">${{ extra.price }}</p>
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
  { icon: 'mdi:music', label: 'Entretenimiento' },
  { icon: 'mdi:camera', label: 'Fotografía' },
  { icon: 'mdi:food', label: 'Catering' },
  { icon: 'mdi:flower', label: 'Decoración' },
  { icon: 'mdi:plus', label: 'Extras' },
]

const extras = ref([])
const selectedExtras = ref([])
const emit = defineEmits(['update:modelValue'])

const fetchExtras = async () => {
  try {
    const res = await api.get('/api/bookings/extras/')
    extras.value = Array.isArray(res.data) ? res.data : (res.data.results || [])
  } catch (error) {
    console.error('Error fetching extras:', error)
    extras.value = []
  }
}

const onExtraChange = (extra) => {
  const index = selectedExtras.value.indexOf(extra.id)
  if (index > -1) {
    // Remove if already selected
    selectedExtras.value.splice(index, 1)
  } else {
    // Add if not selected
    selectedExtras.value.push(extra.id)
  }
  emit('update:modelValue', selectedExtras.value)
}

onMounted(fetchExtras)
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
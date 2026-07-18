<template>
  <div class="space-y-3">
    <div
      v-for="device in devices"
      :key="device.id"
      class="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-gray-200"
    >
      <div class="flex items-center gap-3 min-w-0">
        <i class="text-lg fa-solid fa-lightbulb" :class="deviceState[device.id]?.isOn ? 'text-yellow-400' : 'text-gray-300'"></i>
        <div class="min-w-0">
          <div class="text-sm font-semibold text-gray-800 truncate">{{ device.name }}</div>
          <div v-if="deviceState[device.id]?.error" class="text-xs text-red-500">No se pudo conectar con las luces</div>
        </div>
      </div>

      <div class="flex items-center gap-3 flex-shrink-0">
        <input
          v-if="device.supports_color"
          type="color"
          class="w-8 h-8 rounded cursor-pointer border border-gray-200"
          :value="deviceState[device.id]?.hexColor || '#ffffff'"
          :disabled="deviceState[device.id]?.loading"
          @change="onColorChange(device, $event.target.value)"
        />
        <button
          type="button"
          role="switch"
          :aria-checked="!!deviceState[device.id]?.isOn"
          :disabled="deviceState[device.id]?.loading"
          @click="toggleDevice(device)"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50"
          :class="deviceState[device.id]?.isOn ? 'bg-green-500' : 'bg-gray-300'"
        >
          <span
            class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
            :class="deviceState[device.id]?.isOn ? 'translate-x-6' : 'translate-x-1'"
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
  devices: { type: Array, required: true },
  controlFn: { type: Function, required: true },
  statusFn: { type: Function, required: true },
})

const toast = useToast()
const deviceState = reactive({})

function hsvToHex(h, s, v) {
  const sat = s / 100
  const val = v / 100
  const c = val * sat
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = val - c
  let [r, g, b] = [0, 0, 0]
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const toHex = (n) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexToHsv(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : Math.round((d / max) * 100)
  const v = Math.round(max * 100)
  return { h, s, v }
}

function findByCodePrefix(statusList, prefix) {
  return (statusList || []).find((item) => item.code?.startsWith(prefix))
}

async function hydrateStatus(device) {
  deviceState[device.id] = deviceState[device.id] || { isOn: false, hexColor: '#ffffff', loading: false, error: false }
  try {
    const res = await props.statusFn(device.id)
    const statusList = res.data?.status || []
    const powerItem = findByCodePrefix(statusList, 'switch')
    const colorItem = findByCodePrefix(statusList, 'colour_data')
    deviceState[device.id].isOn = powerItem ? !!powerItem.value : false
    deviceState[device.id].error = false
    if (colorItem?.value) {
      deviceState[device.id].hexColor = hsvToHex(colorItem.value.h, colorItem.value.s, colorItem.value.v)
    }
  } catch (e) {
    deviceState[device.id].error = true
  }
}

async function toggleDevice(device) {
  const state = deviceState[device.id]
  if (!state || state.loading) return
  state.loading = true
  const nextOn = !state.isOn
  try {
    await props.controlFn(device.id, { action: nextOn ? 'on' : 'off' })
    state.isOn = nextOn
    state.error = false
    toast.success(nextOn ? `${device.name} encendida` : `${device.name} apagada`)
  } catch (e) {
    toast.error(e?.response?.data?.error || `No se pudo controlar ${device.name}`)
  } finally {
    state.loading = false
  }
}

async function onColorChange(device, hex) {
  const state = deviceState[device.id]
  if (!state || state.loading) return
  state.loading = true
  const { h, s, v } = hexToHsv(hex)
  try {
    await props.controlFn(device.id, { action: 'color', color: { h, s, v } })
    state.hexColor = hex
    toast.success(`Color de ${device.name} actualizado`)
  } catch (e) {
    toast.error(e?.response?.data?.error || `No se pudo cambiar el color de ${device.name}`)
  } finally {
    state.loading = false
  }
}

watch(
  () => props.devices,
  (devices) => {
    devices.forEach((device) => hydrateStatus(device))
  },
  { immediate: true }
)
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-white text-gray-900 overflow-hidden bg-cover bg-center min-h-[60vh]"
      style="background-image: url('/hero.jpg')">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="relative max-w-4xl px-4 pt-8 pb-12 mx-auto text-center sm:px-6 lg:px-8">
        <img src="/tp-white.svg" alt="Terraza Pineda Logo" class="w-16 h-16 mx-auto mb-4" />
        <h1 class="mb-4 text-4xl font-bold text-white md:text-5xl">Precios y Paquetes</h1>
        <p class="max-w-2xl mx-auto text-xl text-white/80">
          Eche un vistazo a los paquetes hechos para cualquier ocasión y no dude en contactarnos si tiene alguna duda.
        </p>
      </div>
    </section>

    <!-- Carousel Section -->
    <section class="py-8 bg-white">
      <div class="max-w-3xl px-4 mx-auto">
        <div class="relative group">
          <img
            :src="slides[currentSlide]"
            class="object-cover w-full h-48 transition-all duration-700 border border-gray-200 shadow-md rounded-xl"
            :alt="`Slide ${currentSlide + 1}`"
          />
          <!-- Left arrow -->
          <button
            @click="prevSlide"
            class="absolute z-10 p-2 text-gray-700 transition -translate-y-1/2 rounded-full shadow left-2 top-1/2 bg-white/80 hover:bg-white"
            style="backdrop-filter: blur(4px);"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <!-- Right arrow -->
          <button
            @click="nextSlide"
            class="absolute z-10 p-2 text-gray-700 transition -translate-y-1/2 rounded-full shadow right-2 top-1/2 bg-white/80 hover:bg-white"
            style="backdrop-filter: blur(4px);"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
          <!-- Dots -->
          <div class="absolute z-10 flex gap-2 -translate-x-1/2 bottom-2 left-1/2">
            <button
              v-for="(img, i) in slides"
              :key="i"
              @click="goToSlide(i)"
              class="w-2 h-2 transition-colors duration-200 rounded-full"
              :class="currentSlide === i ? 'bg-[#7c3aed]' : 'bg-gray-300'"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Packages Section -->
    <section class="py-12 bg-white">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 class="mb-8 text-3xl font-bold text-center text-transparent text-gray-900 bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400 md:text-4xl">
          Paquetes
        </h2>
        <div v-if="paquetesLoading">Cargando paquetes...</div>
        <div v-else-if="paquetesError">Error: {{ paquetesError.message }}</div>
        <div v-else-if="!paquetes.length">No hay paquetes disponibles.</div>
        <div class="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(paquete, i) in paquetes" :key="i" class="relative group">
            <div
              class="absolute inset-0 z-0 translate-x-2 translate-y-2 pointer-events-none rounded-xl"
              :style="`background: ${cardGradients[i % cardGradients.length]}`"
            ></div>
            <div class="relative z-10 flex flex-col items-center h-full p-6 transition-shadow transition-transform duration-300 bg-white border border-gray-200 rounded-xl group-hover:-translate-y-2 group-hover:shadow-2xl">
              <div class="flex items-center justify-center mb-4 rounded-lg w-14 h-14 bg-primary-100">
                <Icon :icon="paquete.icon" class="w-10 h-10 text-primary-600" />
              </div>
              <h3 class="mb-1 text-xl font-semibold text-gray-900">{{ paquete.title }}</h3>
              <div class="mb-2 text-lg font-bold text-primary-600">${{ paquete.price }}</div>
              <div class="mb-2 text-gray-600">{{ paquete.n_people }} personas</div>
              <div class="mb-2 text-sm text-gray-500">{{ paquete.hours }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Included Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-6xl px-4 mx-auto">
        <h2 class="mb-2 text-3xl font-extrabold text-center text-gray-900 md:text-4xl">¿Qué incluyen?</h2>
        <p class="mb-10 text-center text-gray-500">Todo lo que necesitas para tu evento en un solo lugar</p>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(cat, i) in included"
            :key="i"
            class="relative flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-300"
          >
            <!-- top accent bar -->
            <div class="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" :style="`background: ${catGradients[i % catGradients.length]}`"></div>
            <!-- icon + title -->
            <div class="flex items-center gap-3 mb-5">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl shrink-0" :style="`background: ${catBg[i % catBg.length]}`">
                <Icon :icon="cat.icon" class="w-5 h-5" :style="`color: ${catColor[i % catColor.length]}`" />
              </div>
              <span class="text-sm font-bold tracking-wider uppercase" :style="`color: ${catColor[i % catColor.length]}`">{{ cat.title }}</span>
            </div>
            <!-- items -->
            <ul class="flex flex-col gap-2.5">
              <li v-for="(item, j) in cat.items" :key="j" class="flex items-center gap-2.5 text-gray-700 text-sm">
                <Icon :icon="item.icon" class="w-4 h-4 shrink-0 text-gray-400" />
                <span>{{ item.label }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Extras Section -->
    <section class="py-12 bg-white">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 class="mb-8 text-3xl font-bold text-center text-gray-900">Extras</h2>
        <div v-if="extrasLoading">Cargando extras...</div>
        <div v-else-if="extrasError">Error: {{ extrasError.message }}</div>
        <div v-else-if="!extras.length">No hay extras disponibles.</div>
        <div class="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(extra, i) in extras" :key="i" class="relative group">
            <div
              class="absolute inset-0 z-0 translate-x-2 translate-y-2 pointer-events-none rounded-xl"
              :style="`background: ${cardGradients[i % cardGradients.length]}`"
            ></div>
            <div class="relative z-10 flex flex-col items-center h-full p-6 transition-shadow transition-transform duration-300 bg-white border border-gray-200 rounded-xl group-hover:-translate-y-2 group-hover:shadow-2xl">
              <div class="flex items-center justify-center mb-4 rounded-lg w-14 h-14 bg-primary-100">
                <Icon :icon="extra.icon" class="w-10 h-10 text-primary-600" />
              </div>
              <h3 class="mb-1 text-xl font-semibold text-gray-900">{{ extra.title }}</h3>
              <div class="mb-2 text-lg font-bold text-primary-600">${{ extra.price }}</div>
              <div class="mb-2 text-sm text-gray-600">{{ extra.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import api from '@/services/api'

// Use Vite's import.meta.glob to import all images in the terraza folder
const images = import.meta.glob('@/assets/terraza/*', { eager: true, import: 'default' })

const slideFiles = [
  'albercaflores.jpg',
  'mesas.jpg',
  'mesasadornos.jpg',
]
const slides = slideFiles.map(file => images[`/src/assets/terraza/${file}`])

const currentSlide = ref(0)
let interval = null
const AUTOPLAY_DELAY = 3500
const isHovered = ref(false)

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}
function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}
function goToSlide(i) {
  currentSlide.value = i
}
function startAutoplay() {
  stopAutoplay()
  interval = setInterval(() => {
    if (!isHovered.value) nextSlide()
  }, AUTOPLAY_DELAY)
}
function stopAutoplay() {
  if (interval) clearInterval(interval)
}
onMounted(() => {
  startAutoplay()
})
onBeforeUnmount(() => {
  stopAutoplay()
})
// Pause on hover
function handleMouseEnter() { isHovered.value = true }
function handleMouseLeave() { isHovered.value = false }

const paquetes = ref([])
const paquetesLoading = ref(true)
const paquetesError = ref(null)

const normalizePackage = (pkg) => ({
  title: pkg.name || pkg.title,
  price: pkg.price,
  n_people: pkg.minPeople || pkg.n_people,
  hours: pkg.hours || '10am-10pm',
  icon: pkg.icon || 'mdi:party-popper',
})

const normalizeExtra = (extra) => ({
  title: extra.name || extra.title,
  price: extra.price,
  description: extra.description || '',
  icon: extra.icon || 'mdi:music',
})

async function fetchPackagesAndExtras() {
  paquetesLoading.value = true
  extrasLoading.value = true
  paquetesError.value = null
  extrasError.value = null

  try {
    const res = await api.get('/api/bookings/packages/?limit=10')
    const pkgs = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.results) ? res.data.results : [])
    paquetes.value = pkgs.map(normalizePackage)
  } catch (err) {
    paquetesError.value = err
    paquetes.value = []
  }

  try {
    const res = await api.get('/api/bookings/extras/?limit=10')
    const exs = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.results) ? res.data.results : [])
    extras.value = exs.map(normalizeExtra)
  } catch (err) {
    extrasError.value = err
    extras.value = []
  }

  paquetesLoading.value = false
  extrasLoading.value = false
}

onMounted(() => {
  fetchPackagesAndExtras()
})

const catGradients = [
  'linear-gradient(90deg,#7c3aed,#a78bfa)',
  'linear-gradient(90deg,#0ea5e9,#22d3ee)',
  'linear-gradient(90deg,#06b6d4,#34d399)',
  'linear-gradient(90deg,#f472b6,#fb923c)',
]
const catColor = ['#7c3aed', '#0ea5e9', '#06b6d4', '#f472b6']
const catBg   = ['#f3f0ff', '#e0f2fe', '#ecfeff', '#fdf2f8']

const included = [
  {
    title: 'Mobiliario',
    icon: 'mdi:table-furniture',
    items: [
      { label: 'Mesas', icon: 'mdi:table-chair' },
      { label: 'Sillas', icon: 'mdi:chair-rolling' },
      { label: 'Mantelería', icon: 'mdi:table' },
    ]
  },
  {
    title: 'Horario',
    icon: 'mdi:clock-time-four-outline',
    items: [
      { label: '10am a 10pm', icon: 'mdi:clock-outline' },
      { label: 'Sin límite dentro del horario', icon: 'mdi:clock-check-outline' },
      { label: 'Horas extras disponibles', icon: 'mdi:clock-plus-outline' },
    ]
  },
  {
    title: 'Alberca',
    icon: 'mdi:pool',
    items: [
      { label: 'Climatizada', icon: 'mdi:fire' },
      { label: '1.20 mts de profundidad', icon: 'mdi:waves' },
      { label: 'Bancas alrededor', icon: 'mdi:bench' },
    ]
  },
  {
    title: 'Otras Amenidades',
    icon: 'mdi:star-circle-outline',
    items: [
      { label: 'Futbolito', icon: 'mdi:soccer' },
      { label: 'Wifi', icon: 'mdi:wifi' },
      { label: 'Piñatero', icon: 'mdi:party-popper' },
      { label: 'Asador', icon: 'mdi:grill' },
      { label: 'Hielera', icon: 'mdi:fridge-outline' },
      { label: 'WCs', icon: 'mdi:toilet' },
    ]
  },
]

const extras = ref([])
const extrasLoading = ref(true)
const extrasError = ref(null)

const cardGradients = [
  'linear-gradient(90deg, #7c3aed, #22d3ee)', // purple-cyan
  'linear-gradient(90deg, #f472b6, #fbbf24)', // pink-orange
  'linear-gradient(90deg, #34d399, #a3e635)', // green-lime
]
</script> 
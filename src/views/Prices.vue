<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-white text-gray-900 overflow-hidden bg-cover bg-center min-h-[60vh]"
      style="background-image: url('/hero.jpg')">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="relative px-4 pt-16 pb-12 mx-auto max-w-4xl text-center sm:px-6 lg:px-8">
        <img src="@/assets/tp-white.svg" alt="Terraza Pineda Logo" class="mx-auto mb-4 w-16 h-16" />
        <h1 class="mb-4 text-4xl font-bold text-white md:text-5xl">Precios y Paquetes</h1>
        <p class="mx-auto max-w-2xl text-xl text-white/80">
          Eche un vistazo a los paquetes hechos para cualquier ocasión y no dude en contactarnos si tiene alguna duda.
        </p>
      </div>
    </section>

    <!-- Carousel Section -->
    <section class="py-8 bg-white">
      <div class="px-4 mx-auto max-w-3xl">
        <div class="relative group">
          <img
            :src="slides[currentSlide]"
            class="object-cover w-full h-48 rounded-xl border border-gray-200 shadow-md transition-all duration-700"
            :alt="`Slide ${currentSlide + 1}`"
          />
          <!-- Left arrow -->
          <button
            @click="prevSlide"
            class="absolute left-2 top-1/2 z-10 p-2 text-gray-700 rounded-full shadow transition -translate-y-1/2 bg-white/80 hover:bg-white"
            style="backdrop-filter: blur(4px);"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <!-- Right arrow -->
          <button
            @click="nextSlide"
            class="absolute right-2 top-1/2 z-10 p-2 text-gray-700 rounded-full shadow transition -translate-y-1/2 bg-white/80 hover:bg-white"
            style="backdrop-filter: blur(4px);"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
          <!-- Dots -->
          <div class="flex absolute bottom-2 left-1/2 z-10 gap-2 -translate-x-1/2">
            <button
              v-for="(img, i) in slides"
              :key="i"
              @click="goToSlide(i)"
              class="w-2 h-2 rounded-full transition-colors duration-200"
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
        <div class="grid gap-8 w-full md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(paquete, i) in paquetes" :key="i" class="relative group">
            <div
              class="absolute inset-0 z-0 rounded-xl translate-x-2 translate-y-2 pointer-events-none"
              :style="`background: ${cardGradients[i % cardGradients.length]}`"
            ></div>
            <div class="flex relative z-10 flex-col items-center p-6 h-full bg-white rounded-xl border border-gray-200 transition-shadow transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
              <div class="flex justify-center items-center mb-4 w-14 h-14 rounded-lg bg-primary-100">
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
    <section class="py-12 bg-gray-50">
      <div class="px-4 mx-auto max-w-5xl">
        <h2 class="mb-8 text-3xl font-bold text-center text-gray-900">¿Qué incluyen?</h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(cat, i) in included" :key="i" class="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-200">
            <div class="mb-2 text-xl font-bold text-sky-700 uppercase">{{ cat.title }}</div>
            <div class="grid grid-cols-1 gap-3 w-full">
              <div v-for="(item, j) in cat.items" :key="j" class="flex gap-2 items-center text-gray-700">
                <Icon :icon="item.icon" class="w-6 h-6 text-primary-600" />
                <span>{{ item.label }}</span>
              </div>
            </div>
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
        <div class="grid gap-8 w-full md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(extra, i) in extras" :key="i" class="relative group">
            <div
              class="absolute inset-0 z-0 rounded-xl translate-x-2 translate-y-2 pointer-events-none"
              :style="`background: ${cardGradients[i % cardGradients.length]}`"
            ></div>
            <div class="flex relative z-10 flex-col items-center p-6 h-full bg-white rounded-xl border border-gray-200 transition-shadow transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
              <div class="flex justify-center items-center mb-4 w-14 h-14 rounded-lg bg-primary-100">
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
import axios from 'axios'

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

onMounted(async () => {
  try {
    paquetesLoading.value = true
    const res = await axios.get('/api/bookings/packages/?limit=10')
    console.log('Fetched packages:', res.data)
    // Handle both array and object (with results) responses
    let pkgs = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.results) ? res.data.results : [])
    paquetes.value = pkgs.map(pkg => ({
      title: pkg.name || pkg.title,
      price: pkg.price,
      n_people: pkg.minPeople || pkg.n_people,
      hours: pkg.hours || '10am-10pm',
      icon: pkg.icon || 'mdi:party-popper',
    }))
    paquetesError.value = null

    // Fetch extras
    try {
      extrasLoading.value = true
      const res = await axios.get('/api/bookings/extras/?limit=10')
      console.log('Fetched extras:', res.data)
      let exs = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.results) ? res.data.results : [])
      extras.value = exs.map(extra => ({
        title: extra.name || extra.title,
        price: extra.price,
        description: extra.description || '',
        icon: extra.icon || 'mdi:music',
      }))
      extrasError.value = null
    } catch (err) {
      extrasError.value = err
      extras.value = []
    } finally {
      extrasLoading.value = false
    }
  } catch (err) {
    paquetesError.value = err
    paquetes.value = []
  } finally {
    paquetesLoading.value = false
  }
})

const included = [
  {
    title: 'Mobiliario',
    items: [
      { label: 'Mesas', icon: 'mdi:table-chair' },
      { label: 'Sillas', icon: 'mdi:chair-rolling' },
      { label: 'Mantelería', icon: 'mdi:table' },
    ]
  },
  {
    title: 'Horario',
    items: [
      { label: '10am a 10pm', icon: 'mdi:clock-outline' },
      { label: 'Sin límite dentro del horario', icon: 'mdi:clock-check-outline' },
      { label: 'Horas extras', icon: 'mdi:clock-plus-outline' },
    ]
  },
  {
    title: 'Alberca',
    items: [
      { label: 'Climatizada', icon: 'mdi:fire' },
      { label: '1.20 mts', icon: 'mdi:waves' },
      { label: 'Bancas', icon: 'mdi:bench' },
    ]
  },
  {
    title: 'Otras Amenidades',
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
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="px-4 py-8 mx-auto max-w-7xl">
        <h1 class="mb-4 text-4xl font-bold text-center text-gray-900">Galería de Fotos</h1>
        <p class="mx-auto max-w-2xl text-lg text-center text-gray-600">
          Descubre la belleza y el ambiente único de Terraza Pineda a través de nuestras fotos
        </p>
      </div>
    </div>

    <!-- Gallery Controls -->
    <div class="px-4 py-6 mx-auto max-w-7xl">
      <div class="flex flex-wrap gap-4 justify-center mb-8">
        <button 
          @click="selectedCategory = 'all'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all duration-200',
            selectedCategory === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          ]"
        >
          Todas
        </button>
        <button 
          v-for="category in categories"
          :key="category.value"
          @click="selectedCategory = category.value"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all duration-200',
            selectedCategory === category.value 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          ]"
        >
          {{ category.label }}
        </button>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div class="px-4 pb-12 mx-auto max-w-7xl">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div 
          v-for="photo in filteredPhotos" 
          :key="photo.id"
          class="overflow-hidden relative rounded-lg shadow-lg transition-all duration-300 cursor-pointer group hover:shadow-xl"
          @click="openLightbox(photo)"
        >
          <img 
            :src="photo.src" 
            :alt="photo.alt"
            class="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-300 from-black/60 group-hover:opacity-100">
            <div class="absolute right-4 bottom-4 left-4">
              <h3 class="text-sm font-semibold text-white">{{ photo.title }}</h3>
              <p class="text-xs text-white/80">{{ photo.category }}</p>
            </div>
          </div>
          <div class="absolute top-3 right-3">
            <span class="px-2 py-1 text-xs font-medium text-gray-700 rounded-full bg-white/90">
              {{ photo.category }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div 
      v-if="lightboxOpen" 
      class="flex fixed inset-0 z-50 justify-center items-center bg-black/90"
      @click="closeLightbox"
    >
      <div class="relative max-w-4xl max-h-[90vh] mx-4">
        <button 
          @click="closeLightbox"
          class="absolute top-4 right-4 z-10 text-white transition-colors hover:text-gray-300"
        >
          <i class="text-2xl fa-solid fa-times"></i>
        </button>
        
        <div class="relative">
          <img 
            :src="selectedPhoto?.src" 
            :alt="selectedPhoto?.alt"
            class="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          
          <!-- Navigation arrows -->
          <button 
            v-if="filteredPhotos.length > 1"
            @click.stop="previousPhoto"
            class="absolute left-4 top-1/2 text-white transition-colors transform -translate-y-1/2 hover:text-gray-300"
          >
            <i class="text-3xl fa-solid fa-chevron-left"></i>
          </button>
          <button 
            v-if="filteredPhotos.length > 1"
            @click.stop="nextPhoto"
            class="absolute right-4 top-1/2 text-white transition-colors transform -translate-y-1/2 hover:text-gray-300"
          >
            <i class="text-3xl fa-solid fa-chevron-right"></i>
          </button>
        </div>
        
        <div class="absolute right-4 bottom-4 left-4 text-center text-white">
          <h3 class="text-lg font-semibold">{{ selectedPhoto?.title }}</h3>
          <p class="text-sm opacity-80">{{ selectedPhoto?.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Footer from '@/components/Footer.vue'

const selectedCategory = ref('all')
const lightboxOpen = ref(false)
const selectedPhoto = ref(null)
const currentPhotoIndex = ref(0)

const categories = [
  { value: 'eventos', label: 'Eventos' },
  { value: 'instalaciones', label: 'Instalaciones' },
  { value: 'vistas', label: 'Vistas' },
  { value: 'decoracion', label: 'Decoración' }
]

// Import images dynamically
import albercaflores from '@/assets/terraza/albercaflores.jpg'
import hero from '@/assets/terraza/hero.jpg'
import mesas from '@/assets/terraza/mesas.jpg'
import mesasadornos from '@/assets/terraza/mesasadornos.jpg'
import noche from '@/assets/terraza/noche.jpg'
import IMG_4025 from '@/assets/terraza/IMG_4025.jpg'
import IMG_4026 from '@/assets/terraza/IMG_4026.jpg'
import IMG_8695 from '@/assets/terraza/IMG_8695.jpg'

const photos = [
  {
    id: 1,
    src: albercaflores,
    alt: 'Alberca con flores',
    title: 'Alberca con flores',
    description: 'Nuestra alberca rodeada de hermosas flores',
    category: 'instalaciones'
  },
  {
    id: 2,
    src: hero,
    alt: 'Vista panorámica',
    title: 'Vista panorámica',
    description: 'Vista espectacular de la terraza',
    category: 'vistas'
    
  },
  {
    id: 3,
    src: mesas,
    alt: 'Área de mesas',
    title: 'Área de mesas',
    description: 'Espacios para eventos y reuniones',
    category: 'instalaciones'
  },
  {
    id: 4,
    src: mesasadornos,
    alt: 'Mesas decoradas',
    title: 'Mesas decoradas',
    description: 'Decoración elegante para eventos especiales',
    category: 'decoracion'
  },
  {
    id: 5,
    src: noche,
    alt: 'Terraza de noche',
    title: 'Terraza de noche',
    description: 'Ambiente mágico bajo las estrellas',
    category: 'vistas'
  },
  {
    id: 6,
    src: IMG_4025,
    alt: 'Evento especial',
    title: 'Evento especial',
    description: 'Celebraciones inolvidables',
    category: 'eventos'
  },
  {
    id: 7,
    src: IMG_4026,
    alt: 'Decoración de fiesta',
    title: 'Decoración de fiesta',
    description: 'Ambiente festivo y acogedor',
    category: 'decoracion'
  },
  {
    id: 8,
    src: IMG_8695,
    alt: 'Vista del jardín',
    title: 'Vista del jardín',
    description: 'Naturaleza y tranquilidad',
    category: 'vistas'
  }
]

const filteredPhotos = computed(() => {
  if (selectedCategory.value === 'all') {
    return photos
  }
  return photos.filter(photo => photo.category === selectedCategory.value)
})

function openLightbox(photo) {
  selectedPhoto.value = photo
  currentPhotoIndex.value = filteredPhotos.value.findIndex(p => p.id === photo.id)
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
  selectedPhoto.value = null
}

function nextPhoto() {
  if (filteredPhotos.value.length > 1) {
    currentPhotoIndex.value = (currentPhotoIndex.value + 1) % filteredPhotos.value.length
    selectedPhoto.value = filteredPhotos.value[currentPhotoIndex.value]
  }
}

function previousPhoto() {
  if (filteredPhotos.value.length > 1) {
    currentPhotoIndex.value = currentPhotoIndex.value === 0 
      ? filteredPhotos.value.length - 1 
      : currentPhotoIndex.value - 1
    selectedPhoto.value = filteredPhotos.value[currentPhotoIndex.value]
  }
}

// Keyboard navigation
function handleKeydown(event) {
  if (!lightboxOpen.value) return
  
  if (event.key === 'Escape') {
    closeLightbox()
  } else if (event.key === 'ArrowRight') {
    nextPhoto()
  } else if (event.key === 'ArrowLeft') {
    previousPhoto()
  }
}

// Add keyboard event listener
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Custom scrollbar for lightbox */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 
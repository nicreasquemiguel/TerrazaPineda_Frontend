<template>
  <div class="min-h-screen">
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="showMobileSidebar" 
      class="fixed inset-0 z-40 bg-black bg-opacity-50"
      @click="closeMobileSidebar"
    ></div>
    
    <!-- Mobile Sidebar -->
    <div 
      class="fixed top-0 left-0 z-50 w-80 h-full bg-black transition-transform duration-300 ease-in-out transform"
      :class="showMobileSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Sidebar Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-700">
        <div class="flex items-center space-x-2">
          <div class="flex justify-center items-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <i class="text-sm text-white fa-solid fa-paperclip"></i>
          </div>
          <span class="text-xl font-bold text-white">RomBok</span>
        </div>
        <button 
          @click="closeMobileSidebar"
          class="text-gray-400 hover:text-white"
        >
          <i class="text-xl fa-solid fa-times"></i>
        </button>
      </div>
      
      <!-- Sidebar Content -->
      <div class="flex flex-col h-full">
        <!-- User Profile -->
        <div class="p-6 border-b border-gray-700">
          <div class="flex items-center space-x-3">
            <img 
              :src="`https://ui-avatars.com/api/?name=${userInitials}&background=6366f1&color=fff`" 
              :alt="`${userName} Profile`" 
              class="w-12 h-12 rounded-full"
            />
            <div>
              <div class="text-lg font-bold text-white">{{ userName }}</div>
              <div class="text-sm text-gray-400">{{ userRole }}</div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="p-4 border-b border-gray-700">
          <div class="flex space-x-2">
            <!-- Notification Button -->
            <button class="relative flex-1 px-4 py-3 text-gray-300 rounded-lg transition-colors hover:bg-gray-800 hover:text-white">
              <i class="mr-2 fa-solid fa-bell"></i>
              <span>Notificaciones</span>
              <div class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>
        
        <!-- Navigation Menu -->
        <div class="overflow-y-auto flex-1">
          <nav class="p-4 space-y-2">
            <div 
              v-for="item in navigationItems" 
              :key="item.name"
              @click="goToPage(item.path); closeMobileSidebar()"
              class="flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors cursor-pointer hover:bg-gray-800 hover:text-white"
            >
              <i :class="getNavigationIcon(item.name) + ' mr-3 text-lg'"></i>
              <span class="text-base">{{ item.name }}</span>
            </div>
          </nav>
        </div>
        
        <!-- Sidebar Footer -->
        <div class="p-6 border-t border-gray-700">
          <button 
            @click="handleLogout"
            class="flex justify-center items-center px-4 py-3 w-full text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700"
          >
            <i class="mr-3 text-lg fa-solid fa-sign-out-alt"></i>
            <span class="text-base font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Hamburger Menu Button -->
    <button 
      @click="openMobileSidebar"
      class="fixed top-4 left-4 z-30 p-2 text-white rounded-lg transition-colors hover:bg-black hover:bg-opacity-20"
    >
      <i class="text-xl fa-solid fa-bars"></i>
    </button>

    <!-- Hero Section -->
    <section
      class="overflow-hidden relative min-h-screen text-gray-900 bg-white bg-center bg-cover"
      style="background-image: url('/hero.jpg')"
    >
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="relative px-4 pt-10 pb-24 mx-auto max-w-7xl sm:px-6 lg:px-32 lg:py-32">
        <div class="grid gap-12 items-center lg:grid-cols-2">
          <div class="space-y-8 text-center lg:text-left">
            <img src="/tp-white.svg" alt="Terraza Pineda Logo" class="block mx-auto mb-6 w-20 h-20 md:hidden" />
            <h1 class="text-4xl font-bold leading-tight md:text-6xl">
              <SplitText
                text="¡CELEBRA "
                splitType="words"
                :delay="150"
                :duration="0.8"
                :from="{ opacity: 0, y: 50 }"
                :to="{ opacity: 1, y: 0 }"
                class="text-white uppercase"
              />
              <span class="block h-16 uppercase text-white-300">
                <span v-html="gradientTypingText"></span><span class="animate-pulse">|</span>
              </span>
            </h1>
            <div class="flex flex-col gap-4 justify-center sm:flex-row lg:justify-start">
              <router-link
                to="/reservar"
                class="w-full flex-1 min-w-[140px] md:min-w-[140px] px-6 py-3 md:py-4 text-lg md:text-xl font-semibold uppercase rounded-[20px] bg-white/30 border border-white/30 backdrop-blur-md shadow-lg text-black hover:bg-white/50 transition group overflow-hidden"
              >
                <span class="animated-gradient-text">RESERVAR</span>
                <span class="absolute inset-0 pointer-events-none group-hover:button-gradient-shadow"></span>
              </router-link>
              <router-link
                to="/precios"
                class="w-full flex-1 min-w-[140px] md:min-w-[140px] px-6 py-3 md:py-4 text-lg md:text-xl font-semibold uppercase rounded-[20px] bg-white/30 border border-white/30 backdrop-blur-md shadow-lg text-black hover:bg-white/50 transition group overflow-hidden"
              >
                <span class="text-black">PRECIOS</span>
                <span class="absolute inset-0 pointer-events-none group-hover:button-gradient-shadow"></span>
              </router-link>
            </div>
          </div>
          <div class="hidden lg:block">
              <div class="relative w-[24rem] h-[24rem] bg-white/10 rounded-2xl border border-white/30 flex items-center justify-center mx-auto backdrop-blur-xl shadow-2xl">
                <img src="/tp-white.svg" alt="Terraza Pineda Logo" class="z-10 w-32 h-32" />
                <!-- Gradient Circles -->
                <div class="absolute -top-6 left-1/2 w-32 h-32 rounded-full opacity-80 -translate-x-1/2 animate-circle1" style="background: linear-gradient(90deg, #7c3aed, #22d3ee);"></div>
                <div class="absolute bottom-8 -left-8 w-24 h-24 rounded-full opacity-80 animate-circle2" style="background: linear-gradient(90deg, #f472b6, #fbbf24);"></div>
                <div class="absolute -right-8 bottom-8 w-24 h-24 rounded-full opacity-80 animate-circle3" style="background: linear-gradient(90deg, #34d399, #a3e635);"></div>
              </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Detalles de renta
          </h2>
          <p class="mx-auto max-w-3xl text-xl text-gray-600">
            A continuacion explicamos los pasos a seguir (Nota: Para reservaciones en linea se envia como solicitud)
          </p>
        </div>

        <div class="grid gap-8 items-stretch md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(feature, i) in features"
            :key="feature.title"
            class="relative h-full group"
          >
            <!-- Gradient shadow -->
            <div
              class="absolute inset-0 z-0 rounded-xl translate-x-2 translate-y-2 pointer-events-none"
              :style="`background: ${cardGradients[i % cardGradients.length]}`"
            ></div>
            <!-- Main card -->
            <div class="relative bg-white backdrop-blur-md rounded-xl border border-gray-200 p-6 z-10 h-full min-h-[220px] flex flex-col transition-transform transition-shadow duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
              <div class="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-primary-100">
                <Icon :icon="feature.icon" :class="feature.icon === 'carbon:request-quote' ? 'w-8 h-8 text-primary-600' : 'w-12 h-12 text-primary-600'" />
              </div>
              <h3 class="mb-2 text-xl font-semibold text-gray-900">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600" v-html="feature.description"></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Carousel & Description Section -->
    <section class="py-20 backdrop-blur-md bg-white/80">
      <div class="flex flex-col gap-12 items-center px-4 mx-auto max-w-6xl sm:px-6 lg:px-8 md:flex-row">
        <!-- Carousel -->
        <div class="w-full md:w-1/2">
          <div class="overflow-hidden relative rounded-2xl border shadow-xl backdrop-blur-lg border-white/20 bg-white/30">
            <img :src="serviceSlides[serviceSlideIndex]" class="object-cover w-full h-64 transition-all duration-700" :alt="`Service Slide ${serviceSlideIndex + 1}`" />
            <button @click="prevServiceSlide" class="absolute left-2 top-1/2 z-10 p-2 text-gray-700 rounded-full shadow transition -translate-y-1/2 bg-white/70 hover:bg-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
            <button @click="nextServiceSlide" class="absolute right-2 top-1/2 z-10 p-2 text-gray-700 rounded-full shadow transition -translate-y-1/2 bg-white/70 hover:bg-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>
            <div class="flex absolute bottom-2 left-1/2 z-10 gap-2 -translate-x-1/2">
              <button v-for="(img, i) in serviceSlides" :key="i" @click="goToServiceSlide(i)" class="w-2 h-2 rounded-full transition-colors duration-200" :class="serviceSlideIndex === i ? 'bg-[#7c3aed]' : 'bg-gray-300'" />
            </div>
          </div>
        </div>
        <!-- Description -->
        <div class="w-full text-center md:w-1/2 md:text-left">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Nuestros Servicios</h2>
          <p class="mb-6 text-xl text-gray-700">En Terraza Pineda ofrecemos renta de espacio para eventos, albercadas, fiestas infantiles, reuniones familiares y más. Contamos con alberca climatizada, mobiliario, área techada, asador, WiFi, y servicios adicionales como DJ, fotografía y catering para que tu evento sea inolvidable.</p>
        </div>
      </div>
    </section>

    <!-- Address & Map Section -->
    <section class="py-20 backdrop-blur-md bg-white/80">
      <div class="px-4 mx-auto max-w-4xl text-center sm:px-6 lg:px-8">
        <h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">¿Dónde estamos?</h2>
        <div class="flex flex-col gap-2 items-center mb-6 text-lg text-gray-700">
          <div class="text-2xl font-bold text-gray-900">Terraza Pineda</div>
          <div>Privada Bugambilias 443,</div>
          <div>Vicente Guerrero, 45134</div>
          <div>Zapopan, Jal., México</div>
          <div class="flex gap-2 justify-center items-center mt-2">
            <Icon icon="mdi:email-outline" class="w-5 h-5 text-primary-600" />
            <span>terrazapineda7@gmail.com</span>
          </div>
          <div class="flex gap-2 justify-center items-center">
            <Icon icon="mdi:phone-outline" class="w-5 h-5 text-primary-600" />
            <span>33 3495 2066</span>
          </div>
        </div>
        <div class="overflow-hidden rounded-2xl border shadow-xl backdrop-blur-lg border-white/20 bg-white/30">
          <iframe
            src="https://www.google.com/maps?q=Terraza+Pineda,+Privada+Bugambilias+443,+Vicente+Guerrero,+45134+Zapopan,+Jal.,+Mexico&z=12&output=embed"
            width="100%"
            height="350"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import { 
  VueIcon, 
  TailwindIcon, 
  PiniaIcon, 
  QueryIcon, 
  JwtIcon, 
  MotionIcon 
} from '@/components/icons'
import SplitText from '@/components/SplitText.vue'
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import StarBorder from '@/components/StarBorder.vue'
// import { 
//   GrDocumentUpdate, 
//   LiaMoneyCheckAltSolid, 
//   MdOutlineMoneyOff, 
//   HiOutlineIdentification, 
//   FaClockRotateLeft, 
//   TbExchangeOff, 
//   FaBroomBall 
// } from 'vue-icons'
import { Icon } from '@iconify/vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Mobile sidebar state
const showMobileSidebar = ref(false)

// User profile state
const user = ref(null)

// Navigation items
const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Precios', path: '/precios' },
  { name: 'Reservar', path: '/reservar' },
  { name: 'Fotos', path: '/fotos' },
  { name: 'Reglamento', path: '/reglamento' },
  { name: 'Preguntas', path: '/preguntas-frecuentes' },
]

// Get user from auth store
onMounted(async () => {
  if (authStore.user) {
    user.value = authStore.user
  }
})

// Computed properties for user display
const userName = computed(() => {
  if (!user.value) return 'Usuario'
  
  if (user.value.first_name && user.value.last_name) {
    return `${user.value.first_name} ${user.value.last_name}`
  } else if (user.value.first_name) {
    return user.value.first_name
  } else if (user.value.username) {
    return user.value.username
  } else if (user.value.email) {
    return user.value.email.split('@')[0]
  }
  
  return 'Usuario'
})

const userRole = computed(() => {
  if (!user.value) return 'Usuario'
  
  if (user.value.role) {
    return user.value.role.charAt(0).toUpperCase() + user.value.role.slice(1)
  } else if (user.value.is_staff) {
    return 'Staff'
  }
  
  return 'Usuario'
})

const userInitials = computed(() => {
  if (!user.value) return 'U'
  
  if (user.value.first_name && user.value.last_name) {
    return `${user.value.first_name.charAt(0)}${user.value.last_name.charAt(0)}`.toUpperCase()
  } else if (user.value.first_name) {
    return user.value.first_name.charAt(0).toUpperCase()
  } else if (user.value.username) {
    return user.value.username.charAt(0).toUpperCase()
  }
  
  return 'U'
})

// Navigation functions
const goToPage = (path) => {
  router.push(path)
}

const handleLogout = () => {
  authStore.logout(router)
}

// Mobile sidebar functions
const openMobileSidebar = () => {
  showMobileSidebar.value = true
}

const closeMobileSidebar = () => {
  showMobileSidebar.value = false
}

// Helper function to get navigation icons
const getNavigationIcon = (name) => {
  const iconMap = {
    'Home': 'fa-solid fa-home',
    'Precios': 'fa-solid fa-tags',
    'Reservar': 'fa-solid fa-calendar-plus',
    'Fotos': 'fa-solid fa-images',
    'Reglamento': 'fa-solid fa-file-contract',
    'Preguntas': 'fa-solid fa-question-circle',
  }
  return iconMap[name] || 'fa-solid fa-link'
}

const typingTexts = [
  'albercadas!',
  ' cumpleaños!',
  ' fiestas!',
  ' de todo!'
]
const typingText = ref('')
let textIndex = 0
let charIndex = 0
let isDeleting = false
let typingInterval

function typeEffect() {
  const current = typingTexts[textIndex]
  if (!isDeleting) {
    typingText.value = current.substring(0, charIndex + 1)
    charIndex++
    if (charIndex === current.length) {
      isDeleting = true
      setTimeout(typeEffect, 1200)
      return
    }
  } else {
    typingText.value = current.substring(0, charIndex - 1)
    charIndex--
    if (charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % typingTexts.length
    }
  }
  typingInterval = setTimeout(typeEffect, isDeleting ? 60 : 120)
}

onMounted(() => {
  typeEffect()
})

const features = [
  {
    title: 'Solicitud de Reserva',
    description: 'Para apartados en línea, se requiere de una solicitud la cual nos ayudará a comprender su tipo de evento, en caso de aceptarse se les notificará para seguir con el apartado',
    icon: 'carbon:request-quote'
  },
  {
    title: 'Apartado',
    description: 'Se aparta fecha solamente con $1000, los cuales pueden ser depositados, o en la sección de <a href="/reserve" class="text-purple-600 underline">Reservar</a> de esta página o entregados en la terraza.',
    icon: 'fluent:money-hand-20-regular'
  },
  {
    title: 'Liquidar',
    description: 'Debe quedar liquidado antes o al momento de la entrega del lugar. En caso de requerir algún otro servicio durante su evento, notificar al personal correspondiente',
    icon: 'mdi:cash-remove'
  },
  {
    title: 'Persona Responsable',
    description: 'Una persona quedará responsable del lugar, se tendrá que entregar una credencial vigente, para cualquier caso de irregularidad.',
    icon: 'mdi:card-account-details-outline'
  },
  {
    title: 'Horario de Renta',
    description: 'Por el momento, el Ayuntamiento nos ha limitado, al horario de 10 de la mañana hasta 10 de la noche. Estamos en proceso de recuperarlo, sin embargo, hasta nuevo aviso estaremos manejando este horario.',
    icon: 'mdi:clock-time-four-outline'
  },
  {
    title: 'Cambios o cancelaciones',
    description: 'Cambios de fechas se necesitan hacer con 3 semanas de anticipación. Cancelaciones se pierde apartado, sin excepción.',
    icon: 'mdi:calendar-remove-outline'
  },
  {
    title: 'Limpieza',
    description: 'Se tendrá que hacer la limpieza del lugar, se tiene que entregar con la basura y objetos ajenos a la terraza recogidos.',
    icon: 'mdi:broom'
  }
]

const cardGradients = [
  'linear-gradient(90deg, #7c3aed, #22d3ee)',
  'linear-gradient(90deg, #f472b6, #fbbf24)',
  'linear-gradient(90deg, #34d399, #a3e635)',
]

const typingWords = typingTexts.map(t => t.trim())

const currentTypingWordIndex = computed(() => textIndex % typingWords.length)
const currentGradient = computed(() => cardGradients[currentTypingWordIndex.value % cardGradients.length])

const gradientTypingText = computed(() => {
  // Show the currently typed substring with the gradient for the current word
  const wordIdx = textIndex % typingWords.length
  const gradient = cardGradients[wordIdx % cardGradients.length]
  const word = typingText.value
  return `<span style="background: ${gradient}; -webkit-background-clip: text; background-clip: text; color: transparent;">${word.toUpperCase()}</span>`
})

// Carousel for services section
import { ref as vueRef, onMounted as vueOnMounted, onBeforeUnmount as vueOnBeforeUnmount } from 'vue'

const serviceSlides = [
  '/hero.jpg',
  '/src/assets/terraza/albercaflores.jpg',
  '/src/assets/terraza/mesas.jpg',
  '/src/assets/terraza/mesasadornos.jpg',
]
const serviceSlideIndex = vueRef(0)
let serviceInterval = null
function nextServiceSlide() {
  serviceSlideIndex.value = (serviceSlideIndex.value + 1) % serviceSlides.length
}
function prevServiceSlide() {
  serviceSlideIndex.value = (serviceSlideIndex.value - 1 + serviceSlides.length) % serviceSlides.length
}
function goToServiceSlide(i) {
  serviceSlideIndex.value = i
}
function startServiceAutoplay() {
  stopServiceAutoplay()
  serviceInterval = setInterval(() => {
    nextServiceSlide()
  }, 4000)
}
function stopServiceAutoplay() {
  if (serviceInterval) clearInterval(serviceInterval)
}
vueOnMounted(() => {
  startServiceAutoplay()
})
vueOnBeforeUnmount(() => {
  stopServiceAutoplay()
})
</script>

<style>
.text-shadow-glow {
  text-shadow: 0 0 8px #7c3aed, 0 0 16px #22d3ee;
}

.button-gradient-shadow {
  box-shadow: 0 0 0 4px #fff, 0 4px 32px 0px #7c3aed, 0 4px 32px 8px #22d3ee;
  border-radius: 20px;
  z-index: 1;
  opacity: 0.7;
  transition: box-shadow 0.3s;
}

@keyframes float1 {
  0%, 100% { transform: translate(-50%, 0); }
  25% { transform: translate(-60%, 10px); }
  50% { transform: translate(-50%, 30px); }
  75% { transform: translate(-40%, 10px); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(-10px, 10px); }
  50% { transform: translate(-20px, 30px); }
  80% { transform: translate(-10px, 10px); }
}
@keyframes float3 {
  0%, 100% { transform: translate(0, 0); }
  30% { transform: translate(10px, -10px); }
  60% { transform: translate(20px, 20px); }
  90% { transform: translate(10px, -10px); }
}
.animate-circle1 {
  animation: float1 7s ease-in-out infinite;
}
.animate-circle2 {
  animation: float2 8s ease-in-out infinite;
}
.animate-circle3 {
  animation: float3 9s ease-in-out infinite;
}
.animated-gradient-text {
  background: linear-gradient(270deg, #7c3aed, #22d3ee, #f472b6, #7c3aed);
  background-size: 600% 600%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  animation: gradientPulse 5s ease-in-out infinite;
}
@keyframes gradientPulse {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style> 
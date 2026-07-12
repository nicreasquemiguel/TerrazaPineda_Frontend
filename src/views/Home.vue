<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section
      class="overflow-hidden relative min-h-[calc(100vh-4rem)] flex items-center text-gray-900 bg-white bg-center bg-cover"
      style="background-image: url('/hero.jpg')"
    >
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-32 lg:py-32 w-full">
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
                class="relative w-full flex-1 min-w-[140px] px-6 py-3 md:py-4 text-lg md:text-xl font-semibold uppercase rounded-[20px] bg-white/30 border border-white/30 backdrop-blur-md shadow-lg text-black hover:bg-white/50 transition group overflow-hidden whitespace-nowrap"
              >
                <span class="animated-gradient-text">RESERVAR</span>
                <span class="absolute inset-0 pointer-events-none group-hover:button-gradient-shadow"></span>
              </router-link>
              <router-link
                to="/precios"
                class="relative w-full flex-1 min-w-[140px] px-6 py-3 md:py-4 text-lg md:text-xl font-semibold uppercase rounded-[20px] bg-white/30 border border-white/30 backdrop-blur-md shadow-lg text-black hover:bg-white/50 transition group overflow-hidden whitespace-nowrap"
              >
                <span class="text-black">PRECIOS</span>
                <span class="absolute inset-0 pointer-events-none group-hover:button-gradient-shadow"></span>
              </router-link>
              <router-link
                to="/login"
                class="relative w-full flex-1 min-w-[140px] px-6 py-3 md:py-4 text-lg md:text-xl font-semibold uppercase rounded-[20px] bg-white/30 border border-white/30 backdrop-blur-md shadow-lg text-black hover:bg-white/50 transition group overflow-hidden whitespace-nowrap"
              >
                <span class="text-black">MI CUENTA</span>
                <span class="absolute inset-0 pointer-events-none group-hover:button-gradient-shadow"></span>
              </router-link>
            </div>
          </div>
          <div class="hidden lg:block">
            <div class="relative w-[24rem] h-[24rem] bg-white/10 rounded-full border border-white/30 flex items-center justify-center mx-auto backdrop-blur-xl shadow-2xl">
              <img src="/tp-white.svg" alt="Terraza Pineda Logo" class="z-10 w-32 h-32" />
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
            <div
              class="absolute inset-0 z-0 rounded-xl translate-x-2 translate-y-2 pointer-events-none"
              :style="`background: ${cardGradients[i % cardGradients.length]}`"
            ></div>
            <div class="relative bg-white backdrop-blur-md rounded-xl border border-gray-200 p-6 z-10 h-full min-h-[220px] flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
              <div class="flex justify-center items-center mb-4 w-12 h-12">
                <Icon :icon="feature.icon" :class="feature.icon === 'carbon:request-quote' ? 'w-8 h-8 text-black -600' : 'w-12 h-12 text-black -600'" />
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
            <button @click="prevServiceSlide" class="absolute left-2 top-1/2 z-10 p-2 text-gray-700 rounded-full shadow transition -translate-y-1/2 bg-white/70 hover:bg-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button @click="nextServiceSlide" class="absolute right-2 top-1/2 z-10 p-2 text-gray-700 rounded-full shadow transition -translate-y-1/2 bg-white/70 hover:bg-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
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
import SplitText from '@/components/SplitText.vue'
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

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
  setTimeout(typeEffect, isDeleting ? 60 : 120)
}

const features = [
  {
    title: 'Solicitud de Reserva',
    description: 'Para apartados en línea, se requiere de una solicitud la cual nos ayudará a comprender su tipo de evento, en caso de aceptarse se les notificará para seguir con el apartado',
    icon: 'carbon:request-quote'
  },
  {
    title: 'Apartado',
    description: 'Se aparta fecha solamente con $1000, los cuales pueden ser depositados, o en la sección de <a href="/reservar" class="text-purple-600 underline">Reservar</a> de esta página o entregados en la terraza.',
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

const gradientTypingText = computed(() => {
  const wordIdx = textIndex % typingTexts.length
  const gradient = cardGradients[wordIdx % cardGradients.length]
  const word = typingText.value
  return `<span style="background: ${gradient}; -webkit-background-clip: text; background-clip: text; color: transparent;">${word.toUpperCase()}</span>`
})

const serviceSlides = [
  '/hero.jpg',
  '/src/assets/terraza/albercaflores.jpg',
  '/src/assets/terraza/mesas.jpg',
  '/src/assets/terraza/mesasadornos.jpg',
]
const serviceSlideIndex = ref(0)
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
  serviceInterval = setInterval(nextServiceSlide, 4000)
}
function stopServiceAutoplay() {
  if (serviceInterval) clearInterval(serviceInterval)
}

onMounted(() => {
  typeEffect()
  startServiceAutoplay()
})

onBeforeUnmount(() => {
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

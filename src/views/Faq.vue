<template>
  <div class="min-h-screen flex flex-col items-center justify-start pb-12 px-0 md:py-12 md:px-2 bg-[#fdf6ef]">
    <div class="overflow-hidden relative p-8 w-full max-w-3xl rounded-3xl shadow-2xl bg-white/80">
      <!-- Logo -->
      <div class="flex justify-center mb-4">
        <img src="@/assets/tp.svg" alt="Terraza Pineda Logo" class="w-16 h-16" />
      </div>
      <!-- Title -->
      <h1 class="mb-2 text-4xl font-extrabold text-center md:text-5xl">
        Preguntas <span class="faq-gradient-text">frecuentes</span>
      </h1>
      <p class="mb-8 text-lg text-center text-gray-600">
        ¿Necesitas ayuda con algo o tienes dudas sobre nuestros servicios? Aquí respondemos las preguntas más comunes.
      </p>
      <!-- Accordion -->
      <div class="space-y-2">
        <div v-for="(faq, i) in faqs" :key="faq.q" class="overflow-hidden rounded-xl border border-gray-200 bg-white/90">
          <button @click="toggle(i)" class="flex justify-between items-center px-6 py-4 w-full font-semibold text-left text-gray-900 focus:outline-none">
            <span>{{ faq.q }}</span>
            <svg :class="[openIndex === i ? 'rotate-45 text-[#7c3aed]' : 'text-gray-400', 'transition-transform duration-200 w-6 h-6']" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          </button>
          <transition name="fade">
            <div v-if="openIndex === i" class="px-6 pb-4 text-gray-700 border-t border-gray-100">
              {{ faq.a }}
            </div>
          </transition>
        </div>
      </div>
      <!-- Contact Section -->
      <div class="mt-12 text-center">
        <h2 class="mb-2 text-2xl font-bold">¿Tienes alguna otra pregunta?</h2>
        <p class="mb-4 text-gray-600">No dudes en enviarnos un correo con tu consulta a:</p>
        <div class="flex flex-col gap-2 justify-center items-center px-4 py-2 mx-auto bg-white rounded-lg shadow sm:flex-row">
          <span class="font-mono text-gray-800 select-all">terrazapineda7@gmail.com</span>
          <button @click="copyEmail" class="px-2 py-1 rounded bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-semibold focus:outline-none">Copiar</button>
        </div>
        <div v-if="copied" class="mt-2 text-sm text-green-600">¡Correo copiado!</div>
      </div>
      <!-- Decorative Gradient -->
      <div class="absolute -z-10 left-1/2 top-0 w-[600px] h-[600px] -translate-x-1/2 bg-gradient-to-br from-[#f472b6]/30 via-[#7c3aed]/20 to-[#22d3ee]/10 rounded-full blur-3xl opacity-60"></div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'


const faqs = [
  {
    q: '¿Con cuánto tiempo de anticipación debemos apartar?',
    a: 'Nosotros en cuestión de horas se les puede tener preparado, sin embargo, por tema de disponibilidad de las fechas, en especial en fin de semana, les recomendamos que con un tiempo de 5 a 6 meses para que alcancen su fecha deseada.'
  },
  {
    q: '¿Con cuánto dinero se aparta alguna fecha?',
    a: 'Para cualquier paquete, se aparta fecha únicamente con $1000 MXN. Damos 3 días para que se haga el apartado, en caso contrario queda libre para renta nuevamente.\n\nAceptamos transferencias, depósitos y en efectivo.'
  },
  {
    q: '¿Para qué sirve el apartado, y cómo procede con cancelaciones o cambio de fechas?',
    a: 'El apartado protege a ambos, ustedes como arrendatarios y nosotros como arrendadores, ustedes aseguran su fecha la cual no se vuelve a ofrecer y nosotros para asegurar la renta.\n\nEn caso de cambio de fechas, pedimos que sean con 3 semanas de anticipación.\n\nEn caso de cancelaciones se pierde el apartado, sin excepción.\n\nSe toman estas medidas, debido a que estando apartada se pierden potenciales clientes, y una vez cambio de fecha o cancelación, corremos con un gran riesgo de que se pierda el día.'
  },
  {
    q: '¿Se generá algún contrato?',
    a: 'Por simplicidad del proceso sólo pedimos una identificación vigente y con dirección, se debe de entregar al inicio del evento y se les entrega al final del mismo una vez que se asegure que la terraza esté todo en orden.\n\nSe puede retener la identificación, en los siguientes casos:\n- No se entregó lugar como se acordó\n- Daños al lugar, tanto como el mobiliario, etc.\n- Falta de pago\n- Actos de violencia\n- Sobrecupo del lugar'
  },
  {
    q: '¿Qué tipo de música se permite?',
    a: 'Se permite de todo desde bocinas bluetooth hasta un set de DJ o grupos musicales.'
  },
  {
    q: '¿De qué trata las personas adicionales mencionadas en los paquetes?',
    a: 'Cada paquete cuenta con una cierta cantidad de personas, se les pone el mobiliario respectivo para estas personas, y entendemos que de repente se exceda por unos cuantos las invitaciones, por lo cual permitimos 10 personas adicionales a todos los paquetes contratados. Cabe mencionar que no incluye el mobiliario.'
  },
  {
    q: '¿Qué pasa si se va la electricidad en la colonia?',
    a: 'Se han presentado algunos casos que por problemas de parte de la CFE, la zona se ha quedado sin electricidad, CFE atendió la zona y ya no se han tenido problemas pero aún así nos hemos preparado con una planta de electricidad, por cualquier inconveniencia. Les recordamos que les queremos brindar el mejor servicio.'
  }
]

const openIndex = ref(null)
const copied = ref(false)

function toggle(i) {
  openIndex.value = openIndex.value === i ? null : i
}

function copyEmail() {
  navigator.clipboard.writeText('terrazapineda7@gmail.com')
  copied.value = true
  setTimeout(() => copied.value = false, 1500)
}
</script>

<style scoped>
.faq-gradient-text {
  background: linear-gradient(90deg, #7c3aed, #f472b6, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 
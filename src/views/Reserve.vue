<template>
  <div class="flex flex-col min-h-screen bg-white">
    <div class="flex flex-col flex-1 items-center px-2 pt-2 pb-8 w-full md:pt-16 md:min-h-[36rem]">
      <!-- Logo -->
      <img src="@/assets/tp.svg" alt="Terraza Pineda Logo" class="mb-4 w-12 h-12 md:w-16 md:h-16" />
      <!-- Title -->
      <h1 class="mb-2 text-4xl font-extrabold text-center md:text-5xl reserve-gradient-text">Solicitud</h1>
      <p class="mb-6 max-w-xl text-base text-center text-gray-600 md:text-lg">Se aprobará según los detalles de tu evento, tales como fecha, paquete, descripción, seguir pasos...</p>
      <!-- Stepper -->
      <div class="flex justify-center items-center mb-8 w-full max-w-2xl">
        <div class="flex flex-1 gap-2 justify-between items-center">
          <div v-for="(step, idx) in steps" :key="step" class="flex flex-col flex-1 items-center">
            <div 
              :class="[
                'w-9 h-9 flex items-center justify-center rounded-full font-bold text-lg mb-1 border-2 transition cursor-pointer',
              currentStep === idx + 1
                ? 'bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] text-white border-[#22d3ee] shadow'
                : 'bg-gray-100 text-[#22d3ee] border-gray-300'
              ]"
              @click="goToStep(idx + 1)"
            >
              {{ idx + 1 }}
            </div>
            <span :class="[
              'text-xs font-semibold',
              currentStep === idx + 1 ? 'text-[#22d3ee]' : 'text-gray-400'
            ]">{{ step }}</span>
          </div>
        </div>
      </div>
      <!-- Step Content -->
      <div class="flex flex-col gap-6 items-center mb-8 w-full max-w-xl">
        <div v-if="currentStep === 1" class="flex flex-col gap-4 items-center w-full">
          <h2 class="mb-1 text-2xl font-extrabold text-gray-900">Selecciona tu fecha</h2>
          <CalendarPicker v-model="date" />
          <div class="flex flex-col items-center mt-6 w-full">
            <template v-if="date">
              <SplitText
                :key="splitTextKey"
                :text="formatDate(date)"
                split-type="words, chars"
                :duration="0.7"
                :delay="40"
                :useScroll="false"
                className="selected-date-text"
              />
              <div class="fecha-label">FECHA SELECCIONADA</div>
            </template>
            <template v-else>
              <div class="fecha-label">FECHA SELECCIONADA</div>
            </template>
          </div>
        </div>
        <div v-else-if="currentStep === 2" class="flex flex-col gap-0 items-center w-full">
          <h2 class="mb-1 text-2xl font-extrabold text-gray-900">Elige un paquete</h2>
          <SliderPersonas v-model="selectedPackage" />
        </div>
        <div v-else-if="currentStep === 3" class="flex flex-col gap-4 items-center w-full">
          <h2 class="mb-1 text-2xl font-extrabold text-gray-900">Servicios extra (opcional)</h2>
          <ExtrasSlider v-model="selectedExtras" />
        </div>
        <div v-else-if="currentStep === 4" class="flex flex-col gap-4 items-center w-full">
          <h2 class="mb-1 text-2xl font-extrabold text-gray-900">Descripción del evento</h2>
          <DescriptionInput v-model="description" />
        </div>
        <div v-else-if="currentStep === 5" class="flex flex-col gap-4 items-center w-full">
          <h2 class="mb-1 text-2xl font-extrabold text-gray-900">Resumen y Enviar</h2>
          <div class="flex flex-col gap-4 p-4 w-full max-w-md bg-gray-50 rounded-xl shadow">
            <!-- Fecha -->
            <div class="relative">
              <div class="flex justify-between items-center mb-2 font-bold text-gray-700">
                <span>Fecha seleccionada</span>
                <button @click="goToStep(1)" class="ml-2 px-2 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-semibold shadow-sm hover:bg-[#bae6fd] transition">Editar</button>
              </div>
              <div class="flex gap-2 items-center p-2 bg-white rounded-lg border">
                <span class="text-xl"><Icon icon="mdi:calendar" /></span>
                <div class="flex-1">
                  <div class="font-semibold">{{ date ? formatDate(date) : 'No seleccionada' }}</div>
                </div>
              </div>
            </div>
            <!-- Package Information -->
            <div class="relative">
              <div class="flex justify-between items-center mb-2 font-bold text-gray-700">
                <span>Paquete seleccionado</span>
                <button @click="goToStep(2)" class="ml-2 px-2 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-semibold shadow-sm hover:bg-[#bae6fd] transition">Editar</button>
              </div>
              <div class="flex gap-2 items-center p-2 bg-white rounded-lg border">
                <span class="text-2xl">
                  <Icon v-if="selectedPackage?.icon" :icon="selectedPackage.icon" />
                  <Icon v-else icon="mdi:package-variant" />
                </span>
                <div class="flex-1">
                  <div class="font-semibold">{{ selectedPackage?.title || selectedPackage?.label || 'No seleccionado' }}</div>
                </div>
                <span class="text-base font-bold text-gray-500">${{ Math.round(selectedPackage?.price || 0) }}</span>
              </div>
            </div>
            <!-- Extras -->
            <div class="relative">
              <div class="flex justify-between items-center mb-2 font-bold text-gray-700">
                <span>Servicios extra</span>
                <button @click="goToStep(3)" class="ml-2 px-2 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-semibold shadow-sm hover:bg-[#bae6fd] transition">Editar</button>
              </div>
              <div v-if="selectedExtrasDetails.length" class="flex flex-col gap-1">
                <div v-for="extra in selectedExtrasDetails" :key="extra.id" class="flex justify-between items-center px-3 py-1 text-sm bg-white rounded-lg border">
                  <span class="flex gap-2 items-center text-base font-semibold">
                    <span v-if="extra.icon"><Icon :icon="extra.icon" class="text-lg" /></span>
                    {{ extra.name || extra.title }}
                  </span>
                  <span class="text-base font-bold text-gray-500">${{ Math.round(extra.price) }}</span>
                </div>
              </div>
              <div v-else class="text-xs text-gray-500">Ninguno</div>
            </div>
            <!-- Descripción -->
            <div>
              <div class="mb-2 font-bold text-gray-700">Descripción del evento</div>
              <div class="px-3 py-2 text-sm bg-white rounded-lg border">{{ description }}</div>
            </div>
            <!-- Checkboxes -->
            <div class="flex flex-col gap-2 mt-2">
              <label class="flex gap-2 items-center text-sm">
                <input type="checkbox" v-model="isOver18" />
                Soy mayor de 18 años
              </label>
              <label class="flex gap-2 items-center text-sm">
                <input type="checkbox" v-model="acceptTerms" />
                Acepto los <a href="#" class="text-blue-500 underline" @click.prevent="showTermsModal = true">términos y condiciones</a>
              </label>
            </div>
            <!-- Resumen de costos -->
            <div>
              <div class="mb-2 font-bold text-gray-700">Resumen de costos</div>
              <div class="flex items-center mt-2">
                <span class="text-base font-bold">Total</span>
                <span class="flex-1"></span>
                <span class="text-base font-extrabold text-black">${{ totalCostNoDecimals }}</span>
              </div>
            </div>
          </div>
          <!-- Notes Section -->
          <div class="p-3 mx-auto mt-4 w-full max-w-md text-xs text-yellow-800 bg-yellow-50 rounded border-l-4 border-yellow-400 md:p-4 md:text-sm">
            <strong>Nota:</strong> Esta es solo una solicitud de reservación. La fecha y servicios seleccionados están sujetos a disponibilidad y aprobación. Serás notificado si tu solicitud es aceptada. Después de la aceptación, tendrás 3 días para realizar el pago de anticipo de $1000 MXN y asegurar tu evento.
          </div>
          <button @click="onSubmitClick" :disabled="!isOver18 || !acceptTerms" class="w-full mt-4 py-3 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] shadow-lg hover:opacity-90 transition disabled:opacity-50">Mandar solicitud</button>
        </div>
      </div>
      <!-- Navigation Buttons -->
      <div class="mt-2 w-full max-w-xl">
        <button
          v-if="currentStep < 5"
          @click="nextStep"
          :disabled="!canContinue"
          class="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold rounded-xl text-white bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] shadow-lg hover:opacity-90 transition disabled:opacity-50 mb-2"
        >
          Continuar <span class="text-xl">&#8594;</span>
        </button>
        <button
          v-if="currentStep > 1"
          @click="prevStep"
          class="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold rounded-xl border-2 border-[#22d3ee] text-[#22d3ee] bg-white hover:bg-[#f0f9fa] transition"
        >
          <span class="text-xl">&#8592;</span> Regresar
        </button>
      </div>
    </div>

    <!-- Terms Modal -->
    <div v-if="showTermsModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black/40" @click.self="closeTermsModal">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]" @click.stop>
        <div class="flex sticky top-0 z-10 justify-between items-center pb-2 mb-2 bg-white">
          <h2 class="flex-1 text-2xl font-bold text-center">Términos y Reglamento</h2>
          <button @click="closeTermsModal" class="ml-2 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        </div>
        <div class="space-y-4">
          <div v-for="(rule, i) in rulesWithLinks" :key="i" class="flex gap-4 items-start p-4 text-gray-800 rounded-xl border border-gray-200 shadow bg-white/90">
            <Icon :icon="rule.icon" class="w-6 h-6 flex-shrink-0 mt-1 text-[#7c3aed]" />
            <span v-html="rule.text"></span>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <button @click="acceptTermsAndClose" class="px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] shadow hover:opacity-90 transition">Aceptar</button>
        </div>
      </div>
    </div>
    <!-- Auth Modal -->
    <div v-if="showAuthModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black/40">
      <div class="flex relative flex-col items-center p-6 w-full max-w-xs bg-white rounded-2xl shadow-2xl">
        <button @click="showAuthModal = false" class="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <h2 class="mb-4 text-xl font-bold text-center">Inicia sesión o regístrate</h2>
        <p class="mb-6 text-sm text-center text-gray-600">Debes iniciar sesión o crear una cuenta para continuar con tu reservación.</p>
        <div class="flex flex-col gap-3 w-full">
          <button @click="goToAuth('login')" class="w-full py-2 rounded-xl font-bold text-white bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] shadow hover:opacity-90 transition">Iniciar sesión</button>
          <button @click="goToAuth('register')" class="w-full py-2 rounded-xl font-bold text-[#06b6d4] border-2 border-[#22d3ee] bg-white hover:bg-[#f0f9fa] transition">Registrarse</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import CalendarPicker from '@/ReservarForm/CalendarPicker.vue'
import MultiSelect from 'primevue/multiselect';
import Textarea from 'primevue/textarea';
import DescriptionInput from '@/ReservarForm/DescriptionInput.vue';
import SplitText from '@/components/SplitText.vue'
import SliderPersonas from '@/ReservarForm/SliderPersonas.vue'
import ExtrasSlider from '@/ReservarForm/ExtrasSlider.vue'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import 'v-calendar/style.css'
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useToast } from 'vue-toastification'


const date = ref(null);
const splitTextKey = ref(0);
const selectedPackage = ref(null);
const selectedExtras = ref([]);
const extrasOptions = [
  { label: 'DJ', value: 'dj' },
  { label: 'Fotografía', value: 'photo' },
  { label: 'Decoración', value: 'deco' },
  { label: 'Catering', value: 'catering' },
];
const description = ref('');
const currentStep = ref(1);
const steps = [
  'Fecha',
  'Paquete',
  'Extras',
  'Descripción',
  'Resumen',
];

const canContinue = computed(() => {
  if (currentStep.value === 1) return !!date.value;
  if (currentStep.value === 2) return !!selectedPackage.value;
  if (currentStep.value === 3) return true;
  if (currentStep.value === 4) return description.value && description.value.length >= 64;
  return false;
});

function nextStep() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (currentStep.value < 5) currentStep.value++;
}
function prevStep() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (currentStep.value > 1) currentStep.value--;
}
const advancePaid = ref('8.40');
const coupon = ref('');

const extrasTotal = computed(() => {
  // Sum the prices of selected extras
  return selectedExtrasDetails.value.reduce((sum, extra) => sum + (Number(extra.price) || 0), 0);
});
const totalCost = computed(() => {
  const pkg = selectedPackage.value?.price ? Number(selectedPackage.value.price) : 0;
  return pkg + extrasTotal.value;
});
const totalCostNoDecimals = computed(() => {
  return Math.round(totalCost.value);
});

function applyCoupon() {
  // Placeholder for coupon logic
}

async function sendRequest() {
  // Example data structure
  const data = {
    package_id: selectedPackage.value?.id || 0,
    extra_service_ids: selectedExtras.value,
    start_datetime: date.value ? new Date(date.value).toISOString() : new Date().toISOString(),
    end_datetime: date.value ? new Date(date.value).toISOString() : new Date().toISOString(),
    description: description.value || '',
  };
  try {
    console.log('[Booking] Sending data:', data);
    const response = await api.post('/api/bookings/bookings/', data);
    console.log('[Booking] Success response:', response.data);
    localStorage.removeItem('reserveCart')
    toast.success('¡Solicitud enviada con éxito!')
    if (response.data && response.data.id) {
      router.push(`/detalle-reserva/${response.data.id}`)
    } else {
      router.push('/mis-reservas')
    }
  } catch (e) {
    if (e.response && e.response.status === 409 && e.response.data?.detail?.includes('already exists')) {
      toast.error('La fecha o el evento ya está ocupado. Por favor elige otra fecha o paquete.');
    } else {
      alert('Error al enviar la solicitud.');
    }
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

const handleDateChange = (val) => {
  date.value = val;
  splitTextKey.value++;
}

function goToStep(step) {
  currentStep.value = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const isOver18 = ref(false);
const acceptTerms = ref(false);
const showTermsModal = ref(false);

const allExtras = ref([]);

// Reglamento rules (copied and adapted from Reglamento.vue)
const rules = [
  { text: 'Cambios de fecha se tendrán que hacer con 3 semanas de anticipación, cancelaciones se pierde el apartado, SIN EXCEPCIÓN.', icon: 'mdi:calendar-alert' },
  { text: 'Se aparta fecha únicamente con su apartado $1000, tiene que quedar liquidado a más tardar en la entrega del lugar. Al dar el apartado se acepta este reglamento como obligaciones de quién contrata.', icon: 'mdi:calendar-alert' },
  { text: 'Se debe entregar una identificación vigente y domicilio para que se les entregue el lugar, quien se vaya a hacer responsable.', icon: 'mdi:card-account-details-outline' },
  { text: 'Nuestro horario incluidos en los paquetes son de 10 de la mañana hasta 12 de la noche. Horas extras son adicionales, pregunta sin compromiso.', icon: 'mdi:clock-time-four-outline' },
  { text: 'Cualquier mal uso de las instalaciones y mobiliario, y actos de violencia son causa para la suspensión del evento.', icon: 'mdi:alert-octagon-outline' },
  { text: 'Si el lugar está sobre el número de personas acordadas es causa para la suspensión del evento.', icon: 'mdi:account-group-outline' },
  { text: 'Queda estrictamente prohibido ingresar automóviles o motos, a las áreas verdes.', icon: 'mdi:car-off' },
  { text: 'Se deberá entregar la terraza limpia, se tiene que recoger la basura y los objetos ajenos a la terraza. (Al menos de que hayan pagado el servicio de limpieza).', icon: 'mdi:trash-can-outline' },
  { text: 'En caso de daños o extravíos del mobiliario de la terraza, quien quedó responsable debe recuperarlo o pagar el costo correspondiente.', icon: 'mdi:hammer-wrench' },
  { text: 'Está totalmente prohibido el uso de confetis, brillantina o cosas parecidas (si se encuentran residuos se cobrarán $300 de servicio de limpieza adicionales)', icon: 'mdi:emoticon-confused-outline' },
  { text: 'La música en vivo como norteños, bandas etc, están bienvenidas de nuevo!', icon: 'mdi:music-circle-outline' },
  { text: 'La música está permitida sin problema, sin embargo, tenemos un limitante de 65 decibeles por el Municipio, cualquier falta/descumplimiento la multa será otorgada a el responsable. Más info en este link https://www.zapopan.gob.mx/aprueba-zapopan-armonizacion-de-la-normatividad-municipal-a-la-ley-antirruido/', icon: 'mdi:volume-high' },
  { text: 'Al incumplir este reglamento, se podrá retener la credencial hasta que se resuelva el hecho.', icon: 'mdi:alert-circle-outline' }
];

function linkify(text) {
  const antiRuidoUrl = 'https://www.zapopan.gob.mx/aprueba-zapopan-armonizacion-de-la-normatividad-municipal-a-la-ley-antirruido/';
  if (text.includes(antiRuidoUrl)) {
    return text.replace(antiRuidoUrl, `<br><a href='${antiRuidoUrl}' target='_blank' rel='noopener' class='underline text-[#7c3aed] hover:text-[#22d3ee]'>Ver normativa antirruido del Ayuntamiento de Zapopan</a>`);
  }
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener" class="underline text-[#7c3aed] hover:text-[#22d3ee]">${url}</a>`)
}

const rulesWithLinks = rules.map(rule => ({
  ...rule,
  text: linkify(rule.text)
}));

onMounted(async () => {
  try {
    const res = await api.get('/api/bookings/extras/');
    allExtras.value = Array.isArray(res.data) ? res.data : (res.data.results || []);
  } catch (e) {
    allExtras.value = [];
  }
});

// For displaying selected extras with price
const selectedExtrasDetails = computed(() => {
  return allExtras.value.filter(e => selectedExtras.value.includes(e.id));
});

function closeTermsModal() {
  showTermsModal.value = false;
}

function acceptTermsAndClose() {
  showTermsModal.value = false;
  acceptTerms.value = true;
  // If not already on overview, go to overview (step 5)
  if (currentStep.value !== 5) {
    currentStep.value = 5;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const router = useRouter()
const authStore = useAuthStore()
const showAuthModal = ref(false)
const toast = useToast()

// Watch for changes and persist to localStorage
watch([date, selectedPackage, selectedExtras, description, currentStep], () => {
  const data = {
    date: date.value,
    selectedPackage: selectedPackage.value,
    selectedExtras: selectedExtras.value,
    description: description.value,
    currentStep: currentStep.value
  }
  localStorage.setItem('reserveCart', JSON.stringify(data))
})

// On mount, load from localStorage if present
onMounted(() => {
  const saved = localStorage.getItem('reserveCart')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.date) date.value = data.date
      if (data.selectedPackage) selectedPackage.value = data.selectedPackage
      if (data.selectedExtras) selectedExtras.value = data.selectedExtras
      if (data.description) description.value = data.description
      if (data.currentStep) currentStep.value = data.currentStep
    } catch {}
  }
})

function goToAuth(type) {
  // Save current step and data
  localStorage.setItem('reserveCart', JSON.stringify({
    date: date.value,
    selectedPackage: selectedPackage.value,
    selectedExtras: selectedExtras.value,
    description: description.value,
    currentStep: currentStep.value
  }))
  // Redirect to login or register with ?next=/reserve
  router.push({ path: `/${type}`, query: { next: '/reservar' } })
}

// Check auth before overview/submit
function requireAuthOrShowModal(action) {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return false
  }
  return true
}

function onSubmitClick() {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true;
    return;
  }
  sendRequest();
}
</script>

<style scoped>
.reserve-gradient-text {
  background: linear-gradient(90deg, #22d3ee, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
.dark-input :deep(.p-inputtext),
.dark-input :deep(.p-dropdown),
.dark-input :deep(.p-multiselect),
.dark-input :deep(.p-inputtextarea) {
  background: #f7fafc !important;
  color: #222 !important;
  border: 1px solid #b6e0ef !important;
  border-radius: 0.5rem;
}
.dark-input :deep(.p-inputtext:focus),
.dark-input :deep(.p-dropdown:focus),
.dark-input :deep(.p-multiselect:focus),
.dark-input :deep(.p-inputtextarea:focus) {
  border-color: #22d3ee !important;
  box-shadow: 0 0 0 2px #22d3ee33;
}
.selected-date-text {
  font-size: 2.2rem;
  font-weight: 800;
  color: #06b6d4;
  line-height: 1.1;
  margin-bottom: 0.2em;
  text-align: center;
}
.fecha-label {
  font-size: 1rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-align: center;
}
</style> 
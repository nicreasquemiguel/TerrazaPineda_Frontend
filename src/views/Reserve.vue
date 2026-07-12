<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-4 py-8 mx-auto max-w-5xl sm:px-6 lg:px-8">

      <!-- Header centrado — solo móvil -->
      <div class="mb-6 text-center lg:hidden">
        <h1 class="mb-1 text-3xl font-extrabold reserve-gradient-text">Solicitud</h1>
        <p class="mx-auto max-w-sm text-sm text-gray-500">
          Se aprobará según los detalles de tu evento, tales como fecha, paquete, descripción, seguir pasos...
        </p>
      </div>

      <!-- Mobile: stepper horizontal -->
      <div class="mb-6 lg:hidden">
        <div class="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div
            v-for="(step, idx) in steps"
            :key="step"
            @click="goToStep(idx + 1)"
            class="flex flex-col flex-1 items-center cursor-pointer"
          >
            <div
              :class="[
                'w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm mb-1 border-2 transition',
                currentStep === idx + 1
                  ? 'bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] text-white border-[#22d3ee] shadow'
                  : currentStep > idx + 1
                    ? 'bg-cyan-100 text-cyan-600 border-cyan-300'
                    : 'bg-gray-100 text-gray-400 border-gray-300'
              ]"
            >
              <svg v-if="currentStep > idx + 1" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span
              :class="[
                'text-[10px] font-semibold text-center leading-tight',
                currentStep === idx + 1 ? 'text-[#22d3ee]' : 'text-gray-400'
              ]"
            >{{ step }}</span>
          </div>
        </div>
      </div>

      <!-- Two-column grid: left=stepper, right=content -->
      <div class="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">

        <!-- ── Left: Header + Vertical stepper (desktop) ── -->
        <aside class="hidden lg:block lg:sticky lg:top-24">

          <!-- Header solo desktop -->
          <div class="flex gap-4 items-start mb-5">
            <img src="/tp.svg" alt="Terraza Pineda Logo" class="flex-shrink-2 w-32 h-16 pt-8" />
            <div>
              <h1 class="mb-1 text-3xl font-extrabold reserve-gradient-text">Solicitud</h1>
              <p class="max-w-xs text-sm text-gray-500">
                Se aprobará según los detalles de tu evento, tales como fecha, paquete, descripción, seguir pasos...
              </p>
            </div>
          </div>
          <div class="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <nav class="flex flex-col gap-0.5">
              <div
                v-for="(step, idx) in steps"
                :key="step"
                @click="goToStep(idx + 1)"
                :class="[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all',
                  currentStep === idx + 1 ? 'bg-cyan-50' : 'hover:bg-gray-50'
                ]"
              >
                <div
                  :class="[
                    'w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm border-2 transition flex-shrink-0',
                    currentStep === idx + 1
                      ? 'bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] text-white border-[#22d3ee] shadow'
                      : currentStep > idx + 1
                        ? 'bg-cyan-100 text-cyan-600 border-cyan-300'
                        : 'bg-gray-100 text-gray-400 border-gray-300'
                  ]"
                >
                  <svg v-if="currentStep > idx + 1" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span v-else>{{ idx + 1 }}</span>
                </div>
                <span
                  :class="[
                    'text-sm font-semibold',
                    currentStep === idx + 1 ? 'text-cyan-600' : currentStep > idx + 1 ? 'text-gray-700' : 'text-gray-400'
                  ]"
                >{{ step }}</span>
              </div>
            </nav>
          </div>
        </aside>

        <!-- ── Right: Step content ── -->
        <div class="flex flex-col items-center w-full">

        <!-- Step Content -->
        <div class="flex flex-col gap-6 items-center mb-8 w-full max-w-xl">

          <!-- Step 1: Date -->
          <div v-if="currentStep === 1" class="flex flex-col gap-4 items-center w-full">
            <h2 class="mb-1 text-2xl font-extrabold text-gray-900">Selecciona tu fecha</h2>
            <CalendarPicker v-model="date" :is-staff="!!authStore.user?.is_staff" />
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

          <!-- Step 2: Package -->
          <div v-else-if="currentStep === 2" class="flex flex-col gap-0 items-center w-full">
            <h2 class="mb-1 text-2xl font-extrabold text-gray-900">Elige un paquete</h2>
            <SliderPersonas v-model="selectedPackage" />
          </div>

          <!-- Step 3: Extras -->
          <div v-else-if="currentStep === 3" class="flex flex-col gap-4 items-center w-full">
            <h2 class="mb-1 text-2xl font-extrabold text-gray-900">Servicios extra (opcional)</h2>
            <ExtrasSlider v-model="selectedExtras" />
          </div>

          <!-- Step 4: Description -->
          <div v-else-if="currentStep === 4" class="flex flex-col gap-4 items-center w-full">
            <h2 class="mb-1 text-2xl font-extrabold text-gray-900">Descripción del evento</h2>
            <DescriptionInput v-model="description" />
          </div>

          <!-- Step 5: Summary -->
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
              <!-- Package -->
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
                  <div class="flex gap-2">
                    <button @click="goToStep(3)" class="px-2 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-semibold shadow-sm hover:bg-[#bae6fd] transition">Editar</button>
                    <button v-if="isStaff" @click="showCustomChargeModal = true" class="flex gap-1 items-center px-2 py-0.5 text-[11px] font-semibold text-orange-700 bg-orange-50 rounded-full border border-orange-200 shadow-sm hover:bg-orange-100 transition">
                      <i class="fa-solid fa-plus text-[9px]"></i>
                      Cargo
                    </button>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <div v-for="extra in selectedExtrasDetails" :key="extra.id" class="flex justify-between items-center px-3 py-1 text-sm bg-white rounded-lg border">
                    <span class="flex gap-2 items-center text-base font-semibold">
                      <span v-if="extra.icon"><Icon :icon="extra.icon" class="text-lg" /></span>
                      {{ extra.name || extra.title }}
                    </span>
                    <span class="text-base font-bold text-gray-500">${{ Math.round(extra.price) }}</span>
                  </div>
                  <div v-for="(charge, i) in customCharges" :key="'cc-'+i" class="flex justify-between items-center px-3 py-1 text-sm bg-orange-50 rounded-lg border border-orange-200">
                    <span class="flex gap-2 items-center font-semibold text-orange-800">
                      <i class="fa-solid fa-circle-plus text-orange-400"></i>
                      {{ charge.description }}
                    </span>
                    <div class="flex gap-2 items-center">
                      <span class="font-bold text-gray-500">${{ Math.round(charge.price) }}</span>
                      <button @click="removeLocalCharge(i)" class="text-red-400 hover:text-red-600"><i class="fa-solid fa-xmark text-xs"></i></button>
                    </div>
                  </div>
                  <div v-if="!selectedExtrasDetails.length && !customCharges.length" class="text-xs text-gray-500">Ninguno</div>
                </div>
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
              <!-- Cupón de descuento -->
              <div class="flex flex-col gap-2">
                <div class="font-bold text-gray-700">Cupón de descuento</div>
                <div class="flex gap-2">
                  <div class="flex flex-1 items-center gap-2 px-3 py-2 bg-white rounded-lg border text-sm">
                    <i class="fa-solid fa-ticket text-gray-300"></i>
                    <input v-model="couponCode" type="text" placeholder="CODIGO2026"
                      @input="couponPreview = null; couponError = null"
                      class="flex-1 bg-transparent outline-none uppercase placeholder-gray-400 text-gray-900" />
                  </div>
                  <button @click="validateCoupon" :disabled="!couponCode.trim() || validatingCoupon"
                    class="px-3 py-2 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-40 transition">
                    <i v-if="validatingCoupon" class="fa-solid fa-spinner fa-spin"></i>
                    <span v-else>Verificar</span>
                  </button>
                </div>
                <div v-if="couponError" class="text-xs text-red-600 font-semibold">
                  <i class="fa-solid fa-circle-xmark mr-1"></i>{{ couponError }}
                </div>
                <div v-if="couponPreview" class="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <i class="fa-solid fa-circle-check text-green-500 text-sm flex-shrink-0"></i>
                  <div class="flex-1">
                    <div class="text-sm font-bold text-green-800">{{ couponPreview.label }}</div>
                    <div class="text-xs text-green-600">-${{ Math.round(parseFloat(couponPreview.computed_discount)).toLocaleString() }}</div>
                  </div>
                  <button @click="couponPreview = null; couponCode = ''" class="text-gray-400 hover:text-gray-600">
                    <i class="fa-solid fa-xmark text-xs"></i>
                  </button>
                </div>
              </div>
              <!-- Resumen de costos -->
              <div>
                <div class="mb-2 font-bold text-gray-700">Resumen de costos</div>
                <div v-if="couponPreview" class="flex justify-between items-center text-sm text-green-700 mb-1">
                  <span class="font-semibold"><i class="fa-solid fa-ticket mr-1 text-xs"></i>{{ couponPreview.label }}</span>
                  <span class="font-bold">-${{ Math.round(parseFloat(couponPreview.computed_discount)) }}</span>
                </div>
                <div class="flex items-center mt-2">
                  <span class="text-base font-bold">Total</span>
                  <span class="flex-1"></span>
                  <span class="text-base font-extrabold text-black">${{ totalCostNoDecimals }}</span>
                </div>
              </div>
            </div>
            <!-- Nota -->
            <div class="p-3 mx-auto mt-4 w-full max-w-md text-xs text-yellow-800 bg-yellow-50 rounded border-l-4 border-yellow-400 md:p-4 md:text-sm">
              <strong>Nota:</strong> Esta es solo una solicitud de reservación. La fecha y servicios seleccionados están sujetos a disponibilidad y aprobación. Serás notificado si tu solicitud es aceptada. Después de la aceptación, tendrás 3 días para realizar el pago de anticipo de $1000 MXN y asegurar tu evento.
            </div>
            <button @click="onSubmitClick" :disabled="!isOver18 || !acceptTerms || isSending" class="w-full mt-4 py-3 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] shadow-lg hover:opacity-90 transition disabled:opacity-50">
  {{ isSending ? 'Enviando...' : 'Mandar solicitud' }}
</button>
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
      </div><!-- /grid -->
    </div><!-- /max-w-5xl container -->

    <!-- ── Terms Modal ── -->
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

    <!-- Modal Cargo Adicional (staff only) -->
    <div v-if="showCustomChargeModal"
      class="flex fixed inset-0 z-50 justify-center items-end sm:items-center bg-black/50 backdrop-blur-sm"
      @click.self="showCustomChargeModal = false; customChargeDescription = ''; customChargePrice = ''">
      <div class="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
          <div class="flex justify-center items-center w-10 h-10 bg-orange-100 rounded-2xl flex-shrink-0">
            <i class="fa-solid fa-receipt text-orange-500 text-base"></i>
          </div>
          <div class="flex-1">
            <div class="text-base font-bold text-gray-900">Cargo adicional</div>
            <div class="text-xs text-gray-400">Solo visible para staff</div>
          </div>
          <button @click="showCustomChargeModal = false; customChargeDescription = ''; customChargePrice = ''"
            class="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
        <!-- Body -->
        <div class="flex flex-col gap-4 px-5 py-5">
          <div>
            <label class="mb-1.5 block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Descripción</label>
            <div class="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <i class="fa-solid fa-tag text-gray-300 text-sm flex-shrink-0"></i>
              <input v-model="customChargeDescription" type="text" placeholder="Ej. Hora extra, decoración..."
                class="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400" />
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Monto</label>
            <div class="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <span class="text-sm font-bold text-gray-300">$</span>
              <input v-model="customChargePrice" type="number" inputmode="decimal" placeholder="0"
                class="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400" />
              <span class="text-xs text-gray-300 font-medium">MXN</span>
            </div>
          </div>
          <!-- Live preview -->
          <div v-if="customChargeDescription || customChargePrice"
            class="flex items-center gap-3 px-3 py-2.5 bg-orange-50 border border-orange-100 rounded-xl">
            <i class="fa-solid fa-circle-plus text-orange-400 text-sm flex-shrink-0"></i>
            <div class="flex-1 text-sm font-semibold text-gray-800 truncate">{{ customChargeDescription || 'Descripción...' }}</div>
            <div class="text-sm font-bold text-orange-500">${{ customChargePrice ? parseFloat(customChargePrice).toLocaleString() : '0' }}</div>
          </div>
        </div>
        <!-- Footer -->
        <div class="px-5 pb-6">
          <button @click="addLocalCharge"
            :disabled="!customChargeDescription.trim() || !customChargePrice"
            class="w-full py-3 text-sm font-bold text-white bg-orange-500 rounded-2xl hover:bg-orange-600 disabled:opacity-40 transition-colors shadow-sm">
            Agregar cargo
          </button>
          <button @click="showCustomChargeModal = false; customChargeDescription = ''; customChargePrice = ''"
            class="mt-2.5 w-full py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- ── Auth Modal ── -->
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
import DescriptionInput from '@/ReservarForm/DescriptionInput.vue';
import SplitText from '@/components/SplitText.vue'
import SliderPersonas from '@/ReservarForm/SliderPersonas.vue'
import ExtrasSlider from '@/ReservarForm/ExtrasSlider.vue'
import 'v-calendar/style.css'
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useToast } from 'vue-toastification'


const date = ref(null);
const splitTextKey = ref(0);
const selectedPackage = ref(null);

// Watch date changes to update splitTextKey for SplitText animation
watch(date, (newDate, oldDate) => {
  const formatDateStr = (d) => {
    if (!d) return null;
    const dateObj = d instanceof Date ? d : new Date(d);
    return dateObj.toDateString();
  }

  splitTextKey.value++;
})
const selectedExtras = ref([]);
const description = ref('');
const customCharges = ref([]);
const showCustomChargeModal = ref(false);
const customChargeDescription = ref('');
const customChargePrice = ref('');
const couponCode = ref('');
const couponPreview = ref(null);
const couponError = ref(null);
const validatingCoupon = ref(false);
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
const extrasTotal = computed(() => {
  return selectedExtrasDetails.value.reduce((sum, extra) => sum + (Number(extra.price) || 0), 0);
});
const customChargesTotal = computed(() => {
  return customCharges.value.reduce((sum, c) => sum + (Number(c.price) || 0), 0);
});
const subtotalCost = computed(() => {
  const pkg = selectedPackage.value?.price ? Number(selectedPackage.value.price) : 0;
  return pkg + extrasTotal.value + customChargesTotal.value;
});
const couponDiscount = computed(() => {
  return couponPreview.value ? parseFloat(couponPreview.value.computed_discount) || 0 : 0;
});
const totalCost = computed(() => {
  return Math.max(0, subtotalCost.value - couponDiscount.value);
});
const totalCostNoDecimals = computed(() => {
  return Math.round(totalCost.value);
});

const isStaff = computed(() => authStore.user?.is_staff)

function addLocalCharge() {
  if (!customChargeDescription.value.trim() || !customChargePrice.value) return;
  customCharges.value.push({ description: customChargeDescription.value.trim(), price: parseFloat(customChargePrice.value) });
  customChargeDescription.value = '';
  customChargePrice.value = '';
  showCustomChargeModal.value = false;
}
function removeLocalCharge(index) {
  customCharges.value.splice(index, 1);
}

async function validateCoupon() {
  if (!couponCode.value.trim()) return;
  validatingCoupon.value = true;
  couponPreview.value = null;
  couponError.value = null;
  try {
    const res = await api.post('/api/bookings/bookings/validate_coupon_code/', {
      code: couponCode.value.trim(),
      subtotal: subtotalCost.value,
    });
    couponPreview.value = res.data;
  } catch (e) {
    couponError.value = e?.response?.data?.detail || 'Cupón no válido.';
  } finally {
    validatingCoupon.value = false;
  }
}

async function sendRequest() {
  if (isSending.value) return;
  isSending.value = true;
  const data = {
    package_id: selectedPackage.value?.id || 0,
    extra_service_ids: selectedExtras.value,
    start_datetime: date.value ? new Date(date.value).toISOString() : new Date().toISOString(),
    end_datetime: date.value ? new Date(date.value).toISOString() : new Date().toISOString(),
    description: description.value || '',
  };
  try {
    const response = await api.post('/api/bookings/bookings/', data);
    const bookingId = response.data?.id;
    if (bookingId && customCharges.value.length > 0) {
      for (const charge of customCharges.value) {
        try {
          await api.post(`/api/bookings/bookings/${bookingId}/add_custom_charge/`, {
            description: charge.description,
            price: charge.price,
          });
        } catch {}
      }
    }
    if (bookingId && couponPreview.value) {
      try {
        await api.post(`/api/bookings/bookings/${bookingId}/apply_coupon/`, {
          code: couponCode.value.trim(),
        });
      } catch {}
    }
    localStorage.removeItem('reserveCart')
    toast.success('¡Solicitud enviada con éxito!')
    if (bookingId) {
      router.push(`/detalle-reserva/${bookingId}`)
    } else {
      router.push('/mis-reservas')
    }
  } catch (e) {
    const status = e.response?.status;
    const data = e.response?.data;
    if (status === 400 && data?.start_datetime) {
      const msg = Array.isArray(data.start_datetime) ? data.start_datetime[0] : data.start_datetime;
      if (msg.toLowerCase().includes('not available')) {
        toast.error('Esta fecha ya está ocupada. Por favor elige otra fecha.');
      } else {
        toast.error(msg);
      }
    } else if (status === 409 && data?.detail?.includes('already exists')) {
      toast.error('La fecha o el evento ya está ocupado. Por favor elige otra fecha o paquete.');
    } else if (!e.response || status === 502 || status === 503) {
      toast.error('El servidor está iniciando, espera unos segundos e intenta de nuevo.');
    } else {
      toast.error('Error al enviar la solicitud. Intenta de nuevo.');
    }
  } finally {
    isSending.value = false;
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

function goToStep(step) {
  currentStep.value = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const isOver18 = ref(false);
const acceptTerms = ref(false);
const showTermsModal = ref(false);
const isSending = ref(false);

const allExtras = ref([]);

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

const selectedExtrasDetails = computed(() => {
  return allExtras.value.filter(e => selectedExtras.value.includes(e.id));
});

function closeTermsModal() {
  showTermsModal.value = false;
}

function acceptTermsAndClose() {
  showTermsModal.value = false;
  acceptTerms.value = true;
  if (currentStep.value !== 5) {
    currentStep.value = 5;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const router = useRouter()
const authStore = useAuthStore()
const showAuthModal = ref(false)
const toast = useToast()

// Persist to localStorage
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

// Restore from localStorage on mount
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
  localStorage.setItem('reserveCart', JSON.stringify({
    date: date.value,
    selectedPackage: selectedPackage.value,
    selectedExtras: selectedExtras.value,
    description: description.value,
    currentStep: currentStep.value
  }))
  router.push({ path: `/${type}`, query: { next: '/reservar' } })
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

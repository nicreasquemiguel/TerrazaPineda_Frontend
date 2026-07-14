<template>
  <div>
    <!-- Cambiar paquete Modal -->
    <div v-if="showPackageModal"
      class="flex fixed inset-0 z-50 justify-center items-end sm:items-center bg-black/50 backdrop-blur-sm"
      @click.self="showPackageModal = false">
      <div class="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
          <div class="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-2xl flex-shrink-0">
            <i class="fa-solid fa-box-open text-blue-500 text-base"></i>
          </div>
          <div class="flex-1">
            <div class="text-base font-bold text-gray-900">Cambiar paquete</div>
            <div class="text-xs text-gray-400">Selecciona el nuevo paquete</div>
          </div>
          <button @click="showPackageModal = false"
            class="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
        <!-- Body -->
        <div class="px-5 py-4 max-h-[55vh] overflow-y-auto">
          <div v-if="packagesLoading" class="py-10 text-center text-sm text-gray-400">
            <i class="fa-solid fa-spinner fa-spin mr-2"></i>Cargando paquetes...
          </div>
          <div v-else-if="packagesError" class="py-8 text-center text-sm text-red-500">
            Error cargando paquetes: {{ packagesError.message }}
          </div>
          <div v-else-if="availablePackages.length === 0" class="py-8 text-center text-sm text-gray-400">
            No hay paquetes disponibles
          </div>
          <div v-else class="flex flex-col gap-2">
            <div v-for="pkg in availablePackages" :key="pkg?.id || pkg?.title"
              @click="selectedPackageId = pkg?.id"
              :class="['flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all',
                selectedPackageId === pkg?.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white']">
              <div class="flex justify-center items-center w-10 h-10 rounded-xl flex-shrink-0"
                :class="selectedPackageId === pkg?.id ? 'bg-blue-100' : 'bg-white'">
                <Icon v-if="pkg?.icon" :icon="pkg.icon"
                  :class="selectedPackageId === pkg?.id ? 'text-blue-500' : 'text-gray-400'"
                  class="text-xl" />
                <i v-else class="fa-solid fa-box text-gray-300 text-lg"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-gray-900 text-sm">{{ pkg?.title || 'Sin título' }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ pkg?.n_people || 0 }} personas · ${{ (pkg?.price || 0).toLocaleString() }}</div>
              </div>
              <div class="flex justify-center items-center w-6 h-6 rounded-full flex-shrink-0 transition-all"
                :class="selectedPackageId === pkg?.id ? 'bg-blue-500' : 'bg-gray-200'">
                <i class="fa-solid fa-check text-white text-[10px]"></i>
              </div>
            </div>
          </div>
        </div>
        <!-- Footer -->
        <div class="px-5 pb-6 pt-3 border-t border-gray-100">
          <button @click="savePackageChange()"
            :disabled="selectedPackageId === (event.package && event.package.id)"
            class="w-full py-3 text-sm font-bold text-white bg-blue-500 rounded-2xl hover:bg-blue-600 disabled:opacity-40 transition-colors shadow-sm">
            Guardar paquete
          </button>
          <button @click="showPackageModal = false"
            class="mt-2.5 w-full py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Cambiar extras Modal -->
    <div v-if="showExtrasModal"
      class="flex fixed inset-0 z-50 justify-center items-end sm:items-center bg-black/50 backdrop-blur-sm"
      @click.self="showExtrasModal = false">
      <div class="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
          <div class="flex justify-center items-center w-10 h-10 bg-cyan-100 rounded-2xl flex-shrink-0">
            <i class="fa-solid fa-gift text-cyan-500 text-base"></i>
          </div>
          <div class="flex-1">
            <div class="text-base font-bold text-gray-900">Gestionar extras</div>
            <div class="text-xs text-gray-400">Toca un extra para agregarlo o quitarlo</div>
          </div>
          <button @click="showExtrasModal = false"
            class="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
        <!-- Body — single unified list, tap toggles -->
        <div class="px-5 py-4 max-h-[55vh] overflow-y-auto">
          <div v-if="availableExtras.length === 0" class="py-8 text-center text-sm text-gray-400">
            No hay extras disponibles
          </div>
          <div v-else class="flex flex-col gap-2">
            <div v-for="extra in availableExtras" :key="extra.name"
              @click="toggleExtra(extra)"
              :class="['flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all',
                isExtraSelected(extra)
                  ? 'border-cyan-400 bg-cyan-50'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white']">
              <div class="flex justify-center items-center w-10 h-10 rounded-xl flex-shrink-0"
                :class="isExtraSelected(extra) ? 'bg-cyan-100' : 'bg-white'">
                <i class="fa-solid fa-gift text-lg"
                  :class="isExtraSelected(extra) ? 'text-cyan-500' : 'text-gray-300'"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-gray-900 text-sm">{{ extra.name }}</div>
                <div class="text-xs text-gray-400 mt-0.5">${{ extra.price.toLocaleString() }}</div>
              </div>
              <div class="flex justify-center items-center w-6 h-6 rounded-full flex-shrink-0 transition-all"
                :class="isExtraSelected(extra) ? 'bg-cyan-500' : 'bg-gray-200'">
                <i class="fa-solid fa-check text-white text-[10px]"></i>
              </div>
            </div>
          </div>
        </div>
        <!-- Selected count chip -->
        <div v-if="selectedExtras.length > 0" class="mx-5 mb-2 flex items-center gap-2 px-3 py-2 bg-cyan-50 rounded-xl border border-cyan-100">
          <i class="fa-solid fa-circle-check text-cyan-500 text-xs"></i>
          <span class="text-xs font-semibold text-cyan-700">{{ selectedExtras.length }} extra{{ selectedExtras.length > 1 ? 's' : '' }} seleccionado{{ selectedExtras.length > 1 ? 's' : '' }}</span>
        </div>
        <!-- Footer -->
        <div class="px-5 pb-6 pt-3 border-t border-gray-100">
          <button @click="saveExtrasChange()"
            class="w-full py-3 text-sm font-bold text-white bg-cyan-500 rounded-2xl hover:bg-cyan-600 transition-colors shadow-sm">
            Guardar extras
          </button>
          <button @click="showExtrasModal = false"
            class="mt-2.5 w-full py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            Cancelar
          </button>
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
          <transition name="fade">
            <div v-if="customChargeDescription || customChargePrice"
              class="flex items-center gap-3 px-3 py-2.5 bg-orange-50 border border-orange-100 rounded-xl">
              <i class="fa-solid fa-circle-plus text-orange-400 text-sm flex-shrink-0"></i>
              <div class="flex-1 text-sm font-semibold text-gray-800 truncate">{{ customChargeDescription || 'Descripción...' }}</div>
              <div class="text-sm font-bold text-orange-500">${{ customChargePrice ? parseFloat(customChargePrice).toLocaleString() : '0' }}</div>
            </div>
          </transition>
        </div>
        <!-- Footer -->
        <div class="px-5 pb-6">
          <button @click="addCustomCharge"
            :disabled="isAddingCustomCharge || !customChargeDescription.trim() || !customChargePrice"
            class="w-full py-3 text-sm font-bold text-white bg-orange-500 rounded-2xl hover:bg-orange-600 disabled:opacity-40 transition-colors shadow-sm">
            {{ isAddingCustomCharge ? 'Agregando...' : 'Agregar cargo' }}
          </button>
          <button @click="showCustomChargeModal = false; customChargeDescription = ''; customChargePrice = ''"
            class="mt-2.5 w-full py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Discount Modal -->
    <div v-if="showDiscountModal"
      class="flex fixed inset-0 z-50 justify-center items-end sm:items-center bg-black/50 backdrop-blur-sm"
      @click.self="closeDiscountModal">
      <div class="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div class="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
          <div class="flex justify-center items-center w-10 h-10 bg-green-100 rounded-2xl flex-shrink-0">
            <i class="fa-solid fa-tag text-green-600 text-base"></i>
          </div>
          <div class="flex-1">
            <div class="text-base font-bold text-gray-900">{{ isStaff ? 'Aplicar descuento' : 'Aplicar cupón' }}</div>
            <div class="text-xs text-gray-400">{{ isStaff ? 'Cupón o descuento manual' : 'Ingresa tu código de cupón' }}</div>
          </div>
          <button @click="closeDiscountModal" class="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
        <!-- Tabs -->
        <div class="flex border-b border-gray-100">
          <button @click="discountTab = 'coupon'"
            :class="['flex-1 py-2.5 text-xs font-bold transition', discountTab === 'coupon' ? 'text-green-700 border-b-2 border-green-500' : 'text-gray-400']">
            <i class="fa-solid fa-ticket mr-1"></i>Código de cupón
          </button>
          <button v-if="isStaff" @click="discountTab = 'manual'"
            :class="['flex-1 py-2.5 text-xs font-bold transition', discountTab === 'manual' ? 'text-green-700 border-b-2 border-green-500' : 'text-gray-400']">
            <i class="fa-solid fa-pen mr-1"></i>Descuento manual
          </button>
        </div>
        <!-- Coupon tab -->
        <div v-if="discountTab === 'coupon'" class="flex flex-col gap-4 px-5 py-5">
          <div>
            <label class="mb-1.5 block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Código</label>
            <div class="flex gap-2">
              <div class="flex flex-1 items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-green-300 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <i class="fa-solid fa-ticket text-gray-300 text-sm flex-shrink-0"></i>
                <input v-model="discountCode" type="text" placeholder="CODIGO2026" @input="couponPreview = null; couponError = null"
                  class="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400 uppercase" />
              </div>
              <button @click="validateCoupon" :disabled="!discountCode.trim() || validatingCoupon"
                class="px-3 py-2 text-xs font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-40 transition-colors">
                <i v-if="validatingCoupon" class="fa-solid fa-spinner fa-spin"></i>
                <span v-else>Verificar</span>
              </button>
            </div>
          </div>
          <div v-if="couponError" class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-semibold">
            <i class="fa-solid fa-circle-xmark"></i> {{ couponError }}
          </div>
          <div v-if="couponPreview" class="flex items-center gap-3 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl">
            <i class="fa-solid fa-circle-check text-green-500 text-sm flex-shrink-0"></i>
            <div class="flex-1">
              <div class="text-sm font-bold text-green-800">{{ couponPreview.label }}</div>
              <div class="text-xs text-green-600">Ahorro: -${{ parseFloat(couponPreview.computed_discount).toLocaleString() }}</div>
            </div>
          </div>
          <button @click="applyCoupon" :disabled="!couponPreview || applyingDiscount"
            class="w-full py-3 text-sm font-bold text-white bg-green-600 rounded-2xl hover:bg-green-700 disabled:opacity-40 transition-colors shadow-sm">
            {{ applyingDiscount ? 'Aplicando...' : 'Aplicar cupón' }}
          </button>
        </div>
        <!-- Manual tab -->
        <div v-if="discountTab === 'manual'" class="flex flex-col gap-4 px-5 py-5">
          <div>
            <label class="mb-1.5 block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Descripción</label>
            <div class="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-green-300 focus-within:ring-2 focus-within:ring-green-100 transition-all">
              <i class="fa-solid fa-tag text-gray-300 text-sm flex-shrink-0"></i>
              <input v-model="discountDescription" type="text" placeholder="Ej. Descuento familiar, promoción..."
                class="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400" />
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Monto a descontar</label>
            <div class="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-green-300 focus-within:ring-2 focus-within:ring-green-100 transition-all">
              <span class="text-sm font-bold text-gray-300">$</span>
              <input v-model="discountAmount" type="number" inputmode="decimal" placeholder="0"
                class="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400" />
              <span class="text-xs text-gray-300 font-medium">MXN</span>
            </div>
          </div>
          <transition name="fade">
            <div v-if="discountDescription || discountAmount"
              class="flex items-center gap-3 px-3 py-2.5 bg-green-50 border border-green-100 rounded-xl">
              <i class="fa-solid fa-tag text-green-500 text-sm flex-shrink-0"></i>
              <div class="flex-1 text-sm font-semibold text-gray-800 truncate">{{ discountDescription || 'Descripción...' }}</div>
              <div class="text-sm font-bold text-green-600">-${{ discountAmount ? parseFloat(discountAmount).toLocaleString() : '0' }}</div>
            </div>
          </transition>
          <button @click="applyManualDiscount" :disabled="applyingDiscount || !discountDescription.trim() || !discountAmount"
            class="w-full py-3 text-sm font-bold text-white bg-green-600 rounded-2xl hover:bg-green-700 disabled:opacity-40 transition-colors shadow-sm">
            {{ applyingDiscount ? 'Aplicando...' : 'Aplicar descuento' }}
          </button>
        </div>
        <div class="px-5 pb-5">
          <button @click="closeDiscountModal" class="w-full py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de Pago -->
    <div v-if="showPaymentModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black/40">
      <div class="relative p-6 w-full max-w-md bg-white rounded-2xl shadow-xl">
        <button @click="showPaymentModal = false" class="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <h3 class="mb-4 text-lg font-bold text-gray-900">Realizar Pago</h3>
        
        <!-- Información del monto -->
        <div class="p-4 mb-4 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">Total de la reserva:</span>
            <span class="font-bold text-gray-900">${{ (parseFloat(event?.total_price) || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">Ya pagado:</span>
            <span class="font-bold text-green-600">${{ (parseFloat(event?.advance_paid) || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t">
            <span class="text-sm font-semibold text-gray-700">Pendiente por pagar:</span>
            <span class="font-bold text-red-600">${{ ((parseFloat(event?.total_price) || 0) - (parseFloat(event?.advance_paid) || 0)).toLocaleString() }}</span>
          </div>
        </div>

        <!-- Campo de cantidad a pagar -->
        <div class="mb-4">
          <label class="block mb-2 text-sm font-semibold text-gray-700">Cantidad a pagar:</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 text-gray-500 transform -translate-y-1/2">$</span>
            <input
              v-model="paymentAmount"
              type="number"
              inputmode="decimal"
              step="0.01"
              :min="(parseFloat(event?.advance_paid) || 0) === 0 ? minimumDeposit : 0.01"
              :max="remainingAmount"
              :disabled="remainingAmount <= 0 || parseFloat(paymentAmount) >= remainingAmount"
              class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="0.00"
            />
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Mínimo: ${{ (parseFloat(event?.advance_paid) || 0) === 0 ? minimumDeposit.toLocaleString() : '0.01' }} | Máximo: ${{ remainingAmount.toLocaleString() }}
          </div>
          <div v-if="remainingAmount <= 0" class="mt-2 text-xs font-bold text-green-600">
            ¡Reserva pagada por completo!
          </div>
          <div v-else-if="parseFloat(paymentAmount) >= remainingAmount" class="mt-2 text-xs font-bold text-blue-600">
            ✓ Monto máximo alcanzado
          </div>
        </div>

        <!-- Botones de acción rápida -->
        <div class="mb-4">
          <div class="mb-2 text-sm font-semibold text-gray-700">Pagos rápidos:</div>
          <div class="flex flex-wrap gap-2">
            <button 
              @click="paymentAmount = remainingAmount"
              class="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 hover:bg-blue-100"
            >
              Pagar todo
            </button>
            <button 
              @click="paymentAmount = Math.min(minimumDeposit, remainingAmount)"
              :disabled="remainingAmount < minimumDeposit"
              class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ${{ minimumDeposit.toLocaleString() }}
            </button>
            <button 
              @click="paymentAmount = Math.min(500, remainingAmount)"
              :disabled="remainingAmount < 500"
              class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              $500
            </button>
          </div>
        </div>

        <div class="flex gap-2 justify-end">
          <button @click="showPaymentModal = false" class="px-4 py-2 font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
          <button 
            @click="confirmarPago()" 
            :disabled="!paymentAmount || paymentAmount <= 0 || isPaying"
            class="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isPaying" class="flex gap-2 items-center">
              <div class="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
              Procesando...
            </span>
            <span v-else>Pagar con Stripe</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <div v-if="showPhotoModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black/80">
      <div class="relative p-4 w-full max-w-4xl bg-white rounded-2xl shadow-xl">
        <button @click="closePhotoModal" class="absolute top-3 right-3 z-10 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <div class="flex justify-center">
          <img 
            :src="selectedPhoto" 
            alt="Comprobante de pago"
            class="max-w-full max-h-[80vh] rounded-lg"
          />
        </div>
      </div>
    </div>

    <!-- Modal de Transferencias y Depósitos -->
    <div v-if="showTransferModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black/40">
      <div class="relative p-6 w-full max-w-lg bg-white rounded-2xl shadow-xl">
        <button @click="showTransferModal = false" class="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <h3 class="mb-4 text-lg font-bold text-gray-900">Transferencias y Depósitos</h3>
        
        <!-- Información del monto -->
        <div class="p-4 mb-4 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">Monto a pagar:</span>
            <span class="font-bold text-gray-900">${{ paymentAmount || '0.00' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Máximo disponible:</span>
            <span class="font-bold text-green-600">${{ remainingAmount.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Campo de cantidad a pagar -->
        <div class="mb-6">
          <label class="block mb-2 text-sm font-semibold text-gray-700">Cantidad a pagar:</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 text-gray-500 transform -translate-y-1/2">$</span>
            <input
              v-model="transferAmount"
              type="number"
              inputmode="decimal"
              step="50"
              :min="(parseFloat(event?.advance_paid) || 0) === 0 ? minimumDeposit : 0.01"
              :max="remainingAmount"
              :disabled="remainingAmount <= 0 || parseFloat(transferAmount) >= remainingAmount"
              class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="0.00"
            />
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Mínimo: ${{ (parseFloat(event?.advance_paid) || 0) === 0 ? minimumDeposit.toLocaleString() : '0.01' }} | Máximo: ${{ remainingAmount.toLocaleString() }}
          </div>
        </div>

        <!-- Accordion de opciones de pago -->
        <div class="mb-6 space-y-3">
          <div class="rounded-lg border border-gray-200">
      <button 
              @click="selectedTransferOption = 'transfer'"
              :class="[
                'flex w-full items-center justify-between p-4 text-left transition-colors',
                selectedTransferOption === 'transfer' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
              ]"
            >
              <div class="flex gap-3 items-center">
                <div class="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                  <i class="text-blue-600 fa-solid fa-money-bill-transfer"></i>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">Transferencia Bancaria</div>
                  <div class="text-sm text-gray-500">Pago directo a cuenta bancaria</div>
                </div>
              </div>
              <i class="text-gray-400 fa-solid fa-chevron-down" :class="{ 'rotate-180': selectedTransferOption === 'transfer' }"></i>
      </button>

            <div v-if="selectedTransferOption === 'transfer'" class="p-4 bg-green-50 border-t border-gray-200">
              <div class="space-y-3">
                <div class="p-3 bg-white rounded-lg border border-gray-200">
                  <div class="mb-2 text-sm font-semibold text-gray-700">Datos bancarios:</div>
                  <div class="space-y-1 text-sm">
                    <div><span class="font-medium">Banco:</span> Banco de México</div>
                    <div><span class="font-medium">Cuenta:</span> 1234-5678-9012-3456</div>
                    <div><span class="font-medium">CLABE:</span> 012345678901234567</div>
                    <div><span class="font-medium">Beneficiario:</span> Terraza Paraíso S.A.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200">
            <button 
              @click="selectedTransferOption = 'deposit'"
              :class="[
                'flex w-full items-center justify-between p-4 text-left transition-colors',
                selectedTransferOption === 'deposit' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
              ]"
            >
              <div class="flex gap-3 items-center">
                <div class="flex justify-center items-center w-10 h-10 bg-green-100 rounded-full">
                  <i class="text-green-600 fa-solid fa-building-columns"></i>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">Depósito en Ventanilla</div>
                  <div class="text-sm text-gray-500">Pago en sucursal bancaria</div>
                </div>
              </div>
              <i class="text-gray-400 fa-solid fa-chevron-down" :class="{ 'rotate-180': selectedTransferOption === 'deposit' }"></i>
            </button>
            
            <div v-if="selectedTransferOption === 'deposit'" class="p-4 bg-green-50 border-t border-gray-200">
              <div class="space-y-3">
                <div class="p-3 bg-white rounded-lg border border-gray-200">
                  <div class="mb-2 text-sm font-semibold text-gray-700">Instrucciones:</div>
                  <div class="space-y-2 text-sm text-gray-600">
                    <div>1. Acude a cualquier sucursal bancaria</div>
                    <div>2. Solicita hacer un depósito a cuenta</div>
                    <div>3. Proporciona los datos bancarios</div>
                    <div>4. Guarda el comprobante de pago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload de comprobante -->
        <div class="mb-6">
          <label class="block mb-2 text-sm font-semibold text-gray-700">Comprobante de pago:</label>
            <div class="p-6 text-center rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-green-400">
              <input 
                type="file" 
                accept="image/*"
                @change="handleFileUpload" 
                class="hidden" 
                ref="fileInput"
              />
              <div v-if="!uploadedFile" @click="$refs.fileInput.click()" class="cursor-pointer">
                <i class="mb-2 text-4xl text-gray-400 fa-solid fa-cloud-upload-alt"></i>
                <div class="text-sm text-gray-600">
                  <span class="font-semibold text-green-600">Haz clic para subir</span> o arrastra aquí
                </div>
                <div class="mt-1 text-xs text-gray-500">PNG, JPG, JPEG, GIF, WebP hasta 10MB</div>
              </div>
              <div v-else class="flex justify-between items-center">
                <div class="flex gap-3 items-center">
                  <i class="text-green-500 fa-solid fa-check-circle"></i>
                  <span class="text-sm font-medium text-gray-700">{{ uploadedFile.name }}</span>
                </div>
                <button @click="removeFile" class="text-red-500 hover:text-red-700">
                  <i class="fa-solid fa-times"></i>
                </button>
            </div>
          </div>
        </div>

        <div class="flex gap-2 justify-end">
          <button @click="showTransferModal = false" class="px-4 py-2 font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
          <button 
            @click="submitTransferPayment()" 
            :disabled="!transferAmount || !selectedTransferOption || !uploadedFile || isSubmittingTransfer"
            class="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmittingTransfer" class="flex gap-2 items-center">
              <div class="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
              Enviando...
            </span>
            <span v-else>Enviar comprobante</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <!-- Cancel Reservation Modal -->
    <div v-if="showCancelModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black/40">
      <div class="relative p-6 w-full max-w-md bg-white rounded-2xl shadow-xl">
        <button @click="showCancelModal = false" class="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <div class="flex gap-3 items-center mb-4">
          <div class="flex justify-center items-center w-10 h-10 bg-red-100 rounded-full">
            <i class="text-red-600 fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Cancelar Reserva</h3>
        </div>

        <!-- Applicable policy based on days until event -->
        <div class="p-4 mb-4 rounded-xl border"
          :class="daysUntilEvent > 45 ? 'bg-yellow-50 border-yellow-300' : 'bg-red-50 border-red-300'">
          <div class="mb-1 text-sm font-semibold"
            :class="daysUntilEvent > 45 ? 'text-yellow-800' : 'text-red-800'">
            <i class="mr-1 fa-solid fa-scale-balanced"></i>
            {{ daysUntilEvent > 45 ? `Más de 45 días de anticipación (${daysUntilEvent} días)` : `45 días o menos de anticipación (${daysUntilEvent} días)` }}
          </div>
          <p class="text-xs" :class="daysUntilEvent > 45 ? 'text-yellow-700' : 'text-red-700'">
            {{ daysUntilEvent > 45
              ? 'Se devolverá el 50% del anticipo. El resto se retiene por gastos administrativos.'
              : 'El anticipo no es reembolsable bajo ninguna circunstancia.' }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block mb-2 text-sm font-semibold text-gray-700">Motivo de cancelación:</label>
          <textarea
            v-model="cancellationReason"
            rows="3"
            class="p-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm resize-none"
            placeholder="Cuéntanos por qué deseas cancelar tu reserva..."
          ></textarea>
        </div>

        <p class="mb-5 text-sm text-gray-500">Esta acción no se puede deshacer.</p>

        <div class="flex gap-2 justify-end">
          <button @click="showCancelModal = false" class="px-4 py-2 font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Volver</button>
          <button @click="confirmCancelReservation" :disabled="isCancelling || !cancellationReason.trim()"
            class="px-4 py-2 font-semibold text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isCancelling" class="flex gap-2 items-center">
              <div class="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
              Cancelando...
            </span>
            <span v-else>Sí, cancelar reserva</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Reschedule Modal -->
    <div v-if="showDateChangeModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showDateChangeModal = false">
      <div class="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <!-- Handle bar (mobile) -->
        <div class="flex justify-center pt-3 pb-1 sm:hidden">
          <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-6 pt-4 pb-4 border-b border-gray-100">
          <div class="flex gap-3 items-center">
            <div class="flex justify-center items-center w-9 h-9 bg-blue-100 rounded-full">
              <i class="text-blue-600 fa-solid fa-calendar-days text-sm"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900">Cambiar Fecha</h3>
          </div>
          <button @click="showDateChangeModal = false" class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 py-5 space-y-4">
          <!-- Rules reminder -->
          <div class="p-3 text-xs text-blue-700 bg-blue-50 rounded-xl border border-blue-200">
            <i class="mr-1 fa-solid fa-circle-info"></i>
            Solo se permite <strong>un cambio de fecha</strong> por evento. Debe solicitarse con al menos <strong>3 semanas de anticipación</strong> a la fecha actual del evento.
          </div>

          <!-- Too close warning (non-staff only) -->
          <div v-if="!isStaff && daysUntilEvent <= 21" class="p-3 text-xs text-red-700 bg-red-50 rounded-xl border border-red-200">
            <i class="mr-1 fa-solid fa-triangle-exclamation"></i>
            Tu evento está a <strong>{{ daysUntilEvent }} días</strong>. No cumples el mínimo de 21 días de anticipación.
          </div>

          <!-- Calendar -->
          <div>
            <p class="mb-2 text-sm font-semibold text-gray-700">Selecciona la nueva fecha:</p>
            <CalendarPicker v-model="newEventDate" :is-staff="!!isStaff" />
          </div>

          <!-- API error -->
          <div v-if="dateChangeError" class="p-3 text-xs text-red-700 bg-red-50 rounded-xl border border-red-200">
            <i class="mr-1 fa-solid fa-circle-xmark"></i>
            {{ dateChangeError }}
          </div>
        </div>

        <!-- Footer actions -->
        <div class="flex gap-3 px-6 pb-6 pt-2">
          <button @click="showDateChangeModal = false" class="flex-1 px-4 py-2.5 font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            Cancelar
          </button>
          <button @click="submitDateChange" :disabled="isRescheduling || !newEventDate || (!isStaff && daysUntilEvent <= 21)"
            class="flex-1 px-4 py-2.5 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <span v-if="isRescheduling" class="flex gap-2 items-center justify-center">
              <div class="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
              Guardando...
            </span>
            <span v-else>Confirmar cambio</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showRejectModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black/40">
      <div class="relative p-6 w-full max-w-md bg-white rounded-2xl shadow-xl">
        <button @click="showRejectModal = false" class="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <h3 class="mb-4 text-lg font-bold text-gray-900">Rechazar Reserva</h3>
        
        <div class="mb-4">
          <label class="block mb-2 text-sm font-semibold text-gray-700">Razón del rechazo:</label>
          <textarea
            v-model="rejectReason"
            rows="4"
            class="p-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Explica por qué se rechaza esta reserva..."
          ></textarea>
        </div>

        <div class="flex gap-2 justify-end">
          <button 
            @click="showRejectModal = false" 
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            @click="rejectBooking"
            :disabled="!rejectReason.trim() || isSubmitting"
            class="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">Procesando...</span>
            <span v-else>Rechazar</span>
          </button>
        </div>
      </div>
    </div>
  <div class="pt-4 pb-16 min-h-screen bg-gray-50">
    <!-- Loading state -->
    <div v-if="loading" class="py-8 text-center">
      <div class="inline-block w-8 h-8 rounded-full border-b-2 border-cyan-500 animate-spin"></div>
      <p class="mt-2 text-gray-600">Cargando reserva...</p>
    </div>
    
    <!-- Event content when loaded -->
    <div v-else-if="event" class="px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
      <!-- Breadcrumb + staff pill inline -->
      <div class="flex items-center justify-between mb-3">
        <nav class="text-xs text-gray-500">
          <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
          <span class="mx-2">/</span>
          <router-link :to="isStaff ? '/reservas' : '/mis-reservas'" class="hover:underline">
            {{ isStaff ? 'Reservas' : 'Mis Reservas' }}
          </router-link>
          <span class="mx-2">/</span>
          <span class="font-semibold text-gray-700">Detalle</span>
        </nav>

        <!-- Staff pill -->
        <div v-if="isStaff" class="flex items-center gap-1.5 ml-3 flex-shrink-0 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-full">
          <i class="text-[10px] text-indigo-500 fa-solid fa-user-shield"></i>
          <span class="text-[10px] font-bold tracking-wide text-indigo-600">ADMIN</span>
          <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
        </div>
      </div>

      <!-- Two-column layout: left=steps, right=summary+payment -->
      <div class="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        <!-- RIGHT TOP: summary + share (mobile: 1st, desktop: col-1 row-1) -->
        <div class="flex flex-col gap-3 min-w-0 order-1 lg:col-start-1 lg:row-start-1">

      <!-- Event Overview (Order Summary Style, with real event data) -->
        <div class="mb-3 bg-transparent rounded-2xl border-gray-100 border-none -none-md -50">
        <h2 class="mb-2 text-sm font-bold text-gray-700 sm:text-base sm:mb-3">Resumen de Reserva</h2>
        <div class="flex flex-col gap-2 mb-3">
            <div class="flex flex-col gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <!-- Date -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex gap-2 items-center min-w-0">
                  <i class="text-base text-blue-500 fa-regular fa-calendar flex-shrink-0"></i>
                  <div class="min-w-0">
                    <div class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Fecha del Evento</div>
                    <div class="text-sm font-bold text-gray-900">
                      <span v-if="event.start_datetime">{{ formatDate(event.start_datetime) }}</span>
                      <span v-else class="text-gray-500">Fecha no especificada</span>
                    </div>
                  </div>
                </div>
                <button
                  v-if="!isLocked && (isStaff || event.date_changes_count === 0)"
                  @click="showDateChangeModal = true; dateChangeError = ''"
                  class="flex-shrink-0 flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 transition hover:bg-blue-100"
                >
                  <i class="fa-solid fa-pen text-[10px]"></i>
                  Editar
                </button>
              </div>
              <!-- Time -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex gap-2 items-center min-w-0 flex-1">
                  <i class="text-base text-blue-500 fa-regular fa-clock flex-shrink-0"></i>
                  <div class="min-w-0 flex-1">
                    <div class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Horario</div>
                    <div v-if="!editingTimes">
                      <div class="text-sm font-bold text-gray-900">
                        <span v-if="event.start_datetime && event.end_datetime">
                          {{ formatTime(event.start_datetime) }} - {{ formatTime(event.end_datetime) }}
                        </span>
                        <span v-else-if="event.package && event.package.hours">
                          {{ event.package.hours }}
                        </span>
                        <span v-else class="text-gray-500">Horario no especificado</span>
                      </div>
                    </div>
                  <!-- Staff inline time editor -->
                  <div v-else class="flex flex-wrap gap-2 items-center mt-1">
                    <div>
                      <label class="block mb-0.5 text-xs text-gray-500">Inicio</label>
                      <input v-model="editStartTime" type="time"
                        class="p-1.5 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label class="block mb-0.5 text-xs text-gray-500">Fin</label>
                      <input v-model="editEndTime" type="time"
                        class="p-1.5 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div class="flex gap-1 mt-4">
                      <button @click="saveTimeEdit" :disabled="savingTimes"
                        class="px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
                        <span v-if="savingTimes"><i class="fa-solid fa-spinner fa-spin"></i></span>
                        <span v-else>Guardar</span>
                      </button>
                      <button @click="editingTimes = false"
                        class="px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                        Cancelar
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
                <button v-if="isStaff && !editingTimes"
                  @click="openTimeEdit"
                  class="flex-shrink-0 flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 transition hover:bg-blue-100">
                  <i class="fa-solid fa-pen text-[10px]"></i>
                  Editar
                </button>
              </div>
              <!-- Description -->
              <div class="flex gap-2 items-start">
                <i class="text-base text-blue-500 fa-regular fa-file-lines flex-shrink-0 mt-0.5"></i>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between">
                    <div class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Descripción</div>
                    <button v-if="isStaff && !editingDescription"
                      @click="editingDescription = true; editDescriptionValue = cleanDescription(event.description) || ''"
                      class="flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 hover:bg-blue-100 transition">
                      <i class="fa-solid fa-pen text-[10px]"></i>
                      Editar
                    </button>
                  </div>
                  <!-- Edit mode -->
                  <div v-if="editingDescription" class="mt-1">
                    <textarea v-model="editDescriptionValue" rows="4"
                      class="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition"
                      placeholder="Descripción del evento..."></textarea>
                    <div class="flex gap-1.5 mt-1.5">
                      <button @click="saveDescription" :disabled="savingDescription"
                        class="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        <i v-if="savingDescription" class="fa-solid fa-spinner fa-spin"></i>
                        <span v-else>Guardar</span>
                      </button>
                      <button @click="editingDescription = false"
                        class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Cancelar
                      </button>
                    </div>
                  </div>
                  <!-- View mode -->
                  <div v-else-if="event.description || getDefaultEventSummary()" class="text-sm text-gray-600 mt-0.5">
                    <span class="whitespace-pre-wrap" v-if="!showFullDescription">{{ (cleanDescription(event.description) || getDefaultEventSummary()).substring(0, 100) }}{{ (cleanDescription(event.description) || getDefaultEventSummary()).length > 100 ? '...' : '' }}</span>
                    <span class="whitespace-pre-wrap" v-else>{{ cleanDescription(event.description) || getDefaultEventSummary() }}</span>
                    <button
                      v-if="(cleanDescription(event.description) || getDefaultEventSummary()).length > 100"
                      @click="showFullDescription = !showFullDescription"
                      class="ml-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800">
                      {{ showFullDescription ? 'Leer menos' : 'Leer más' }}
                    </button>
                  </div>
                  <div v-else-if="isStaff" class="text-xs text-gray-400 italic mt-0.5">Sin descripción</div>
                </div>
              </div>
            </div>
            <!-- Package & People Card -->
            <div class="mb-3">
              <div class="flex justify-between items-center mb-2 pl-1">
                <div class="text-sm font-bold text-gray-900">Paquete</div>
                <button v-if="!isLocked" @click="showPackageModal = true" class="flex-shrink-0 flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 transition hover:bg-blue-100">
                  <i class="fa-solid fa-pen text-[10px]"></i>
                  Editar
                </button>
              </div>
              <div class="flex gap-2 items-center p-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div v-if="event.package && event.package.icon" class="text-xl text-blue-500 flex-shrink-0">
                  <Icon :icon="event.package.icon" />
          </div>
                <div class="flex flex-col flex-1 min-w-0">
                  <div class="text-sm font-bold text-gray-900">{{ event.package ? event.package.n_people : 0 }} personas</div>
                  <div class="mt-1 text-sm text-gray-500">{{ event.package ? event.package.description : '' }}</div>
            </div>
                <div class="ml-2 text-sm font-bold text-right text-gray-900">
                  ${{ packageBookedPrice.toLocaleString() }}
            </div>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <div class="flex justify-between items-center mb-2 pl-1">
            <div class="text-sm font-bold text-gray-900">Extras</div>
            <!-- Add Extra Button -->
            <div class="flex gap-2">
              <button v-if="!isLocked" @click="showExtrasModal = true" class="flex-shrink-0 flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 transition hover:bg-blue-100">
                <i class="fa-solid fa-plus text-[10px]"></i>
                Agregar
              </button>
              <button v-if="isStaff" @click="showCustomChargeModal = true" class="flex-shrink-0 flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-orange-700 bg-orange-50 rounded border border-orange-200 transition hover:bg-orange-100">
                <i class="fa-solid fa-plus text-[10px]"></i>
                Cargo
              </button>
              <button @click="openDiscountModal" class="flex-shrink-0 flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 transition hover:bg-green-100">
                <i class="fa-solid fa-ticket text-[10px]"></i>
                Cupón
              </button>
            </div>
          </div>
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div v-if="localExtras && localExtras.length">
              <div v-for="(extra, i) in localExtras" :key="i" class="relative h-14 select-none"
                @touchstart="!isLocked && onTouchStart(i, $event)"
                @touchmove="!isLocked && onTouchMove(i, $event)"
                @touchend="!isLocked && onTouchEnd(i)"
                @mousedown="!isLocked && onMouseDown(i, $event)"
              >
                <!-- Red background with trash icon -->
                <div class="flex absolute inset-0 justify-end items-center pr-6 bg-red-500 rounded-xl transition-all duration-300"
                  :class="{ 'opacity-100': extra.showDelete, 'opacity-80': !extra.showDelete }"
                >
                  <button @click="removeExtra(i)" class="focus:outline-none">
                    <TrashIcon class="w-5 h-5 text-white" />
                  </button>
                </div>
                <!-- Sliding card -->
                <div class="flex relative z-30 items-center px-4 bg-white rounded-xl border-b border-gray-100 transition-all duration-300 last:border-b-0"
                  :style="{
                    transform: `translateX(${extra.translateX}px)`,
                    opacity: extra.deleting ? 0 : 1,
                    height: extra.deleting ? '0px' : '56px',
                    marginBottom: extra.deleting ? '0px' : '',
                    transition: 'transform 0.3s, opacity 0.3s, height 0.3s, margin-bottom 0.3s'
                  }"
                >
                  <i class="mr-2 text-cyan-500 fa-solid fa-gift"></i>
                  <div class="flex-1 font-semibold text-gray-900">{{ typeof extra.data === 'string' ? extra.data : extra.data.name }}</div>
                  <div class="w-24 text-sm font-semibold text-right text-gray-900">
                    ${{ parseFloat(extra.bookedPrice ?? (typeof extra.data === 'object' ? extra.data.price : 0) ?? 0).toLocaleString() }}
                  </div>
                  <!-- Small X button -->
                  <button v-if="!extra.showDelete" @click.prevent="triggerShowDelete(i)" class="flex absolute top-0.5 right-1 z-20 justify-center items-center p-0 m-0 w-4 h-4 text-xs leading-none text-red-500 bg-transparent hover:text-red-600 focus:outline-none">
                    <i class="text-xs fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="px-2 py-2 text-sm text-gray-400">Sin extras</div>
            <!-- Custom charges (item_type === 'other') -->
            <div v-if="event.line_items && event.line_items.filter(li => li.item_type === 'other').length > 0"
              class="border-t border-gray-100">
              <div v-for="charge in event.line_items.filter(li => li.item_type === 'other')" :key="charge.id"
                class="flex items-center px-4 h-14 border-b border-gray-100 last:border-b-0">
                <i class="mr-2 text-orange-400 fa-solid fa-circle-plus"></i>
                <div class="flex-1 text-sm font-semibold text-gray-900">{{ charge.description }}</div>
                <div class="mr-3 text-sm font-semibold text-gray-900">${{ parseFloat(charge.unit_price).toLocaleString() }}</div>
                <button v-if="isStaff" @click="removeCustomCharge(charge.id)"
                  :disabled="removingChargeId === charge.id"
                  class="flex justify-center items-center w-5 h-5 text-xs text-red-400 rounded-full transition hover:text-red-600 disabled:opacity-40">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            <!-- Discounts (item_type === 'discount') -->
            <div v-if="event.line_items && event.line_items.filter(li => li.item_type === 'discount').length > 0"
              class="border-t border-gray-100">
              <div v-for="disc in event.line_items.filter(li => li.item_type === 'discount')" :key="disc.id"
                class="flex items-center px-4 h-14 border-b border-gray-100 last:border-b-0">
                <i class="mr-2 text-green-500 fa-solid fa-tag"></i>
                <div class="flex-1 text-sm font-semibold text-gray-700">{{ disc.description }}</div>
                <div class="mr-3 text-sm font-semibold text-green-600">-${{ Math.abs(parseFloat(disc.unit_price)).toLocaleString() }}</div>
                <button v-if="isStaff" @click="removeDiscount(disc.id)"
                  :disabled="removingDiscountId === disc.id"
                  class="flex justify-center items-center w-5 h-5 text-xs text-red-400 rounded-full transition hover:text-red-600 disabled:opacity-40">
                  <i v-if="removingDiscountId === disc.id" class="fa-solid fa-spinner fa-spin"></i>
                  <i v-else class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div class="flex justify-between mb-1">
            <span class="text-xs text-gray-500">Total</span>
              <span class="text-sm font-semibold text-gray-900">${{ (parseFloat(event.total_price) || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between mb-1">
            <span class="text-xs text-gray-500">Anticipo</span>
              <span class="text-sm font-semibold text-green-600">${{ (parseFloat(event.advance_paid) || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between pt-2 mt-1 border-t">
            <span class="text-sm font-bold text-gray-900">Restante</span>
              <span class="text-sm font-bold text-indigo-600">${{ ((parseFloat(event.total_price) || 0) - (parseFloat(event.advance_paid) || 0)).toLocaleString() }}</span>
          </div>
        </div>
        
        <!-- Entrega y cierre del evento -->
        <div v-if="event && ['aceptacion','apartado','liquidado','liquidado_entregado','entregado','finalizado'].includes(event.status)"
          class="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <!-- Header -->
          <div class="flex items-start justify-between p-4 pb-3">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 flex items-center justify-center w-10 h-10">
                <i class="fa-solid fa-flag-checkered text-purple-500 text-xl"></i>
              </div>
              <div>
                <div class="text-sm font-bold text-gray-900">Proceso de entrega y finalización</div>
                <div class="mt-0.5 text-xs text-gray-500">{{ isStaff ? 'Gestiona la entrega del lugar y finaliza la reserva.' : 'Estado de entrega y cierre de tu evento.' }}</div>
              </div>
            </div>
            <!-- Staff + finalizado: three-dot menu instead of badge -->
            <div v-if="isStaff && event.status === 'finalizado'" class="relative ml-2 flex-shrink-0">
              <button @click="showStaffMenu = !showStaffMenu"
                class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition">
                <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
              </button>
              <div v-if="showStaffMenu"
                class="absolute right-0 top-9 z-20 w-48 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                <button @click="toggleEntregado(); showStaffMenu = false" :disabled="entregadoLoading"
                  class="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition">
                  <i v-if="entregadoLoading" class="fa-solid fa-spinner fa-spin w-4"></i>
                  <i v-else class="fa-solid fa-door-closed w-4"></i>
                  Quitar entregado
                </button>
                <div class="border-t border-gray-100"></div>
                <button @click="quitarFinalizado(); showStaffMenu = false" :disabled="quitarFinalizadoLoading"
                  class="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-orange-600 hover:bg-orange-50 disabled:opacity-50 transition">
                  <i v-if="quitarFinalizadoLoading" class="fa-solid fa-spinner fa-spin w-4"></i>
                  <i v-else class="fa-regular fa-star w-4"></i>
                  Quitar finalizado
                </button>
              </div>
              <div v-if="showStaffMenu" @click="showStaffMenu = false" class="fixed inset-0 z-10"></div>
            </div>
          </div>

          <!-- Hora de entrega (always visible in this section) -->
          <div class="mx-6 mb-3 flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0">
                <i class="fa-regular fa-clock text-purple-500 text-sm"></i>
              </div>
              <div>
                <div class="text-xs text-gray-500">Hora de llegada al evento</div>
                <div v-if="!editingHoraEntrega || !isStaff" class="text-sm font-bold text-gray-900">
                  {{ event.hora_entrega ? event.hora_entrega.slice(0,5) : (event.start_datetime ? new Date(event.start_datetime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Sin especificar') }}
                </div>
                <div v-else class="flex gap-2 items-center mt-0.5">
                  <input type="time" v-model="horaEntregaInput"
                    class="px-2 py-1 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  <button @click="saveHoraEntrega" :disabled="horaEntregaLoading"
                    class="px-3 py-1 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50">
                    <i v-if="horaEntregaLoading" class="fa-solid fa-spinner fa-spin mr-1"></i>
                    Guardar
                  </button>
                  <button @click="editingHoraEntrega = false" class="px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-300">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
            <button v-if="isStaff && !editingHoraEntrega && !isLocked" @click="editingHoraEntrega = true; horaEntregaInput = event.hora_entrega ? event.hora_entrega.slice(0,5) : (event.start_datetime ? new Date(event.start_datetime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }) : '')"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 flex-shrink-0">
              <i class="fa-solid fa-pen text-xs"></i>
              {{ event.hora_entrega ? 'Editar hora' : 'Agregar hora' }}
            </button>
          </div>

          <!-- Progress track + buttons unified layout -->
          <div class="mx-6 mb-4">
            <!-- Step row with connector -->
            <div class="relative flex gap-2 mb-3">
              <!-- Connector: center of left circle to center of right circle -->
              <div :class="event.status === 'finalizado' ? 'bg-purple-400' : event.is_entregado ? 'bg-cyan-300' : 'bg-gray-200'"
                class="absolute left-[calc(50%-1px)] right-[calc(50%-1px)] top-[17px] h-0.5 transition-all"
                style="left: calc(25% + 18px); right: calc(25% + 18px);"></div>
              <!-- Step 1: Entregado -->
              <div class="flex flex-col items-center flex-1 z-10">
                <div :class="event.is_entregado ? 'bg-cyan-500 border-cyan-500 text-white shadow-md shadow-cyan-200' : 'bg-white border-gray-300 text-gray-400'"
                  class="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm mb-1.5 transition-all">
                  <i class="fa-solid fa-door-open"></i>
                </div>
                <div :class="event.is_entregado ? 'text-cyan-600 font-bold' : 'text-gray-500'" class="text-xs text-center leading-tight">Entrega del lugar</div>
                <div class="text-[10px] text-gray-400 text-center mt-0.5 leading-tight">{{ isStaff ? 'Confirma que el lugar fue entregado al cliente' : 'El staff confirmará la entrega del lugar' }}</div>
              </div>
              <!-- Step 2: Finalizado -->
              <div class="flex flex-col items-center flex-1 z-10">
                <div :class="event.status === 'finalizado' ? 'bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-200' : 'bg-white border-gray-300 text-gray-400'"
                  class="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm mb-1.5 transition-all">
                  <i :class="event.status === 'finalizado' ? 'fa-solid fa-check' : 'fa-regular fa-star'"></i>
                </div>
                <div :class="event.status === 'finalizado' ? 'text-purple-600 font-bold' : 'text-gray-500'" class="text-xs text-center leading-tight">Finalizado</div>
                <div class="text-[10px] text-gray-400 text-center mt-0.5 leading-tight">{{ isStaff ? 'Cierra el evento y completa la reserva' : 'El staff cerrará el evento al finalizar' }}</div>
              </div>
            </div>
            <!-- Buttons aligned under their steps -->
            <div v-if="isStaff && event.status !== 'finalizado'" class="flex gap-2">
              <button @click="toggleEntregado" :disabled="entregadoLoading"
                :class="event.is_entregado ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-500 hover:bg-cyan-600'"
                class="flex-1 py-2 text-xs font-semibold text-white rounded-xl disabled:opacity-50 transition-colors">
                <i v-if="entregadoLoading" class="fa-solid fa-spinner fa-spin mr-1"></i>
                <i v-else :class="event.is_entregado ? 'fa-solid fa-door-closed' : 'fa-solid fa-door-open'" class="mr-1"></i>
                {{ event.is_entregado ? 'Quitar entregado' : 'Marcar entregado' }}
              </button>
              <button @click="finalizarReserva" :disabled="finalizarLoading"
                class="flex-1 py-2 text-xs font-semibold text-white bg-purple-500 rounded-xl hover:bg-purple-600 disabled:opacity-50 transition-colors">
                <i v-if="finalizarLoading" class="fa-solid fa-spinner fa-spin mr-1"></i>
                <i v-else class="fa-regular fa-star mr-1"></i>
                Finalizar reserva
              </button>
            </div>
          </div>

        </div><!-- /Entrega y cierre -->

        <!-- Action Buttons for Staff -->
        <div v-if="isStaff && event.status === 'solicitud'" class="p-4 mt-4 bg-white rounded-lg border border-gray-200">
          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              @click="approveBooking"
              :disabled="isSubmitting"
              class="flex-1 px-4 py-3 font-semibold text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="mr-2 fa-solid fa-check"></i>
              <span v-if="isSubmitting">Procesando...</span>
              <span v-else>Aprobar Reserva</span>
            </button>
            <button
              @click="showRejectModal = true"
              :disabled="isSubmitting"
              class="flex-1 px-4 py-3 font-semibold text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="mr-2 fa-solid fa-times"></i>
              Rechazar Reserva
            </button>
          </div>
        </div>
      </div>

        <!-- Share Confirmation Card -->
        <div
          v-if="event && !authStore.user?.is_staff && ['aceptacion','apartado','liquidado','liquidado_entregado','entregado','finalizado'].includes(event.status)"
          class="mt-6"
        >
          <div class="p-5 bg-gradient-to-br from-[#1a0533] to-[#0a021e] rounded-2xl shadow-lg border border-purple-900/40">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg">🎉</span>
              <h2 class="text-base font-bold text-white">¡Comparte tu reservación!</h2>
            </div>
            <p class="text-xs text-purple-300 mb-4">Genera tu tarjeta personalizada y compártela.</p>

            <!-- Card preview -->
            <div v-if="confirmCardUrl" class="mb-4">
              <img :src="confirmCardUrl" alt="Tarjeta de reservación" class="w-full max-w-xs mx-auto rounded-xl shadow-md" />
              <div class="flex justify-center mt-2">
                <button
                  @click="loadConfirmCard"
                  :disabled="loadingConfirmCard"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-300 text-xs font-medium transition disabled:opacity-50"
                >
                  <svg :class="['h-3.5 w-3.5', loadingConfirmCard && 'animate-spin']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  {{ loadingConfirmCard ? 'Generando...' : 'Nueva frase' }}
                </button>
              </div>
            </div>
            <div v-else-if="loadingConfirmCard" class="flex justify-center py-6">
              <svg class="animate-spin h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>

            <!-- Generate button (before card loads) -->
            <button
              v-if="!confirmCardUrl && !loadingConfirmCard"
              @click="loadConfirmCard"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition mb-2"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Generar tarjeta
            </button>

            <!-- Share buttons (after card loads) -->
            <div v-if="confirmCardUrl" class="flex flex-col gap-2">

              <!-- Native share (mobile: opens Instagram / Facebook / WhatsApp sheet) -->
              <button
                v-if="canNativeShare"
                @click="nativeShareCard(confirmCardApiUrl, '¡Reservé Terraza Pineda para el ' + formatEventDate(event.start_datetime) + '! 🎉')"
                class="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-bold shadow transition hover:opacity-90"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                Compartir imagen
              </button>

              <div class="flex gap-2">
                <!-- WhatsApp — includes image URL so WhatsApp renders a preview -->
                <a
                  :href="`https://wa.me/?text=${encodeURIComponent('¡Reservé Terraza Pineda para el ' + formatEventDate(event.start_datetime) + '! 🎉\n' + confirmCardUrl.split('?')[0])}`"
                  target="_blank" rel="noopener"
                  class="flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] text-white text-sm font-semibold transition"
                >
                  <svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.374 0 0 5.374 0 12c0 2.117.547 4.103 1.504 5.829L.057 23.882l6.233-1.635A11.934 11.934 0 0012 24c6.626 0 12-5.374 12-12 0-6.627-5.374-12-12-12zm0 21.818a9.818 9.818 0 01-4.999-1.369l-.358-.213-3.706.973.989-3.611-.234-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.389 9.818 9.818 0 5.43-4.389 9.818-9.818 9.818z"/></svg>
                  WhatsApp
                </a>

                <!-- Copy link (works everywhere: Facebook, Instagram bio, etc.) -->
                <button
                  @click="copyCardLink(confirmCardUrl)"
                  class="flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1877F2] hover:bg-[#1565d8] text-white text-sm font-semibold transition"
                >
                  <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  Copiar
                </button>

                <!-- Download -->
                <button
                  @click="downloadCard(confirmCardApiUrl, 'terraza-pineda-reserva.png')"
                  class="flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition"
                >
                  <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Guardar
                </button>
              </div>

              <!-- Tips by platform -->
              <div class="text-xs text-purple-400 text-center pt-1 space-y-0.5">
                <p v-if="canNativeShare">📲 "Compartir imagen" abre Instagram, Facebook y más desde tu cel.</p>
                <p v-else>📲 En tu cel: usa "Compartir imagen" para subir directo a Instagram o Facebook.</p>
                <p>📋 "Copiar" → pega el enlace en Facebook, WhatsApp o donde quieras.</p>
              </div>
            </div>
          </div>
        </div><!-- /Share Confirmation Card -->

      <!-- Client Information for Staff -->
      <div v-if="isStaff" class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-bold text-gray-700">Información del Cliente</h3>
          <button @click="openUserPicker"
            class="flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded border border-indigo-200 hover:bg-indigo-100 transition">
            <i class="fa-solid fa-pen text-[10px]"></i>
            Cambiar
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="flex items-center gap-2">
            <i class="text-blue-400 text-sm fa-solid fa-user flex-shrink-0"></i>
            <div class="min-w-0">
              <div class="text-[10px] text-gray-400">Nombre</div>
              <div class="text-xs font-semibold text-gray-900 truncate">
                {{ event.user?.first_name || event.user_name || 'N/A' }} {{ event.user?.last_name || '' }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <i class="text-blue-400 text-sm fa-solid fa-envelope flex-shrink-0"></i>
            <div class="min-w-0">
              <div class="text-[10px] text-gray-400">Email</div>
              <div class="text-xs font-semibold text-gray-900 truncate">{{ event.user?.email || 'N/A' }}</div>
            </div>
          </div>
          <div v-if="event.user?.phone" class="flex items-center gap-2 col-span-2">
            <i class="text-blue-400 text-sm fa-solid fa-phone flex-shrink-0"></i>
            <div class="min-w-0 flex-1">
              <div class="text-[10px] text-gray-400">Teléfono</div>
              <div class="text-xs font-semibold text-gray-900">{{ event.user.phone }}</div>
            </div>
            <div class="flex gap-1.5 flex-shrink-0">
              <a :href="'tel:' + event.user.phone"
                class="flex items-center justify-center gap-1 w-20 py-1 text-[10px] font-semibold text-blue-600 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition">
                <i class="fa-solid fa-phone text-[9px]"></i>
                Llamar
              </a>
              <a :href="'https://wa.me/' + event.user.phone.replace(/\D/g, '')" target="_blank" rel="noopener"
                class="flex items-center justify-center gap-1 w-20 py-1 text-[10px] font-semibold text-green-600 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition">
                <i class="fa-brands fa-whatsapp text-[10px]"></i>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- User Picker Modal (staff only) -->
      <div v-if="showUserPickerModal"
        class="flex fixed inset-0 z-50 justify-center items-end sm:items-center bg-black/50 backdrop-blur-sm"
        @click.self="showUserPickerModal = false">
        <div class="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
            <div class="flex justify-center items-center w-10 h-10 bg-indigo-100 rounded-2xl flex-shrink-0">
              <i class="fa-solid fa-user-pen text-indigo-500 text-base"></i>
            </div>
            <div class="flex-1">
              <div class="text-base font-bold text-gray-900">Asignar cliente</div>
              <div class="text-xs text-gray-400">Busca y selecciona un usuario</div>
            </div>
            <button @click="showUserPickerModal = false"
              class="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
          <!-- Search -->
          <div class="px-5 pt-4 pb-2">
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <i class="fa-solid fa-magnifying-glass text-gray-300 text-sm flex-shrink-0"></i>
              <input v-model="userPickerQuery" type="text" placeholder="Nombre o email..."
                class="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                style="font-size: 16px;"
                @input="searchUsers"
                v-focus-desktop />
              <button v-if="userPickerQuery" @click="userPickerQuery = ''; searchUsers()"
                class="text-gray-300 hover:text-gray-500">
                <i class="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>
          </div>
          <!-- Results -->
          <div class="px-5 py-2 max-h-72 overflow-y-auto">
            <div v-if="userPickerLoading" class="py-8 text-center text-sm text-gray-400">
              <i class="fa-solid fa-spinner fa-spin mr-2"></i>Buscando...
            </div>
            <div v-else-if="userPickerResults.length === 0" class="py-8 text-center text-sm text-gray-400">
              Sin resultados
            </div>
            <div v-else class="flex flex-col gap-1.5">
              <button v-for="u in userPickerResults" :key="u.id"
                @click="selectUser(u)"
                :class="['flex items-center gap-3 p-3 rounded-2xl border-2 text-left w-full transition-all',
                  pickedUser?.id === u.id
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white']">
                <div class="flex justify-center items-center w-9 h-9 rounded-xl flex-shrink-0 bg-indigo-100 text-indigo-600 font-bold text-sm">
                  {{ (u.first_name?.[0] || u.email?.[0] || '?').toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-bold text-gray-900 truncate">
                    {{ u.first_name }} {{ u.last_name }}
                    <span v-if="!u.first_name && !u.last_name" class="text-gray-400">Sin nombre</span>
                  </div>
                  <div class="text-xs text-gray-400 truncate">{{ u.email }}</div>
                  <div v-if="u.phone" class="text-xs text-gray-400">{{ u.phone }}</div>
                </div>
                <div v-if="pickedUser?.id === u.id"
                  class="flex justify-center items-center w-5 h-5 rounded-full bg-indigo-500 flex-shrink-0">
                  <i class="fa-solid fa-check text-white text-[9px]"></i>
                </div>
              </button>
            </div>
          </div>
          <!-- Footer -->
          <div class="px-5 pb-6 pt-3 border-t border-gray-100">
            <button @click="saveUserChange"
              :disabled="!pickedUser || savingUser"
              class="w-full py-3 text-sm font-bold text-white bg-indigo-500 rounded-2xl hover:bg-indigo-600 disabled:opacity-40 transition-colors shadow-sm">
              <span v-if="savingUser"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Guardando...</span>
              <span v-else>Asignar cliente</span>
            </button>
            <button @click="showUserPickerModal = false"
              class="mt-2.5 w-full py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </div>

        </div><!-- /RIGHT TOP -->

        <!-- RIGHT BOTTOM: payment + history + review (mobile: 3rd, desktop: col-1 row-2) -->
        <div class="flex flex-col gap-3 min-w-0 order-3 lg:col-start-1 lg:row-start-2">

        <!-- Payment Methods Section (shown when reservation is accepted and not locked) -->
        <div v-if="event && !isLocked && (event.status === 'aceptacion' || event.status === 'apartado' || event.status === 'liquidado' || event.status === 'entregado' || event.status === 'finalizado')" class="mt-6">
          <div class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-sm font-bold text-gray-700">Métodos de Pago</h2>
              <div class="flex items-center space-x-2">
                <i class="text-green-500 fa-solid fa-credit-card"></i>
                <span class="text-sm font-medium text-gray-600">Disponibles</span>
              </div>
            </div>

            <!-- Payment Methods Accordions -->
            <div class="space-y-4">
              <!-- Stripe Payment Accordion -->
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                <button 
                  @click="selectedPaymentMethod = selectedPaymentMethod === 'stripe' ? '' : 'stripe'"
                  :class="[
                    'flex w-full items-center justify-between p-4 text-left transition-colors',
                    selectedPaymentMethod === 'stripe' ? 'border-blue-200' : 'hover:bg-gray-50'
                  ]"
                >
                  <div class="flex gap-3 items-center">
                    <div class="flex justify-center items-center w-10 h-10 text-gray-400">
                      <i class="text-lg fa-brands fa-stripe"></i>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">Pago con Tarjeta</div>
                      <div class="text-sm text-gray-500">Visa, Mastercard, Amex</div>
                    </div>
                  </div>
                  <i class="text-gray-400 fa-solid fa-chevron-down" :class="{ 'rotate-180': selectedPaymentMethod === 'stripe' }"></i>
                </button>
                
                <div v-if="selectedPaymentMethod === 'stripe'" class="p-4 border-t border-gray-200">
                  <!-- Payment Summary -->
                  <div class="p-4 mb-4 bg-white rounded-lg border border-gray-200">
                    <h4 class="mb-3 text-sm font-semibold text-gray-700">Resumen del Pago</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="font-medium">Total de la reserva:</span>
                        <span class="font-mono">${{ (parseFloat(event?.total_price) || 0).toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="font-medium">Ya pagado:</span>
                        <span class="font-mono text-green-600">${{ (parseFloat(event?.advance_paid) || 0).toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between pt-2 border-t">
                        <span class="font-medium">Pendiente por pagar:</span>
                        <span class="font-mono text-red-600">${{ ((parseFloat(event?.total_price) || 0) - (parseFloat(event?.advance_paid) || 0)).toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Amount Input -->
                  <div class="mb-4">
                    <label class="block mb-2 text-sm font-semibold text-gray-700">Cantidad a pagar:</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 text-gray-500 transform -translate-y-1/2">$</span>
                      <input
                        v-model="paymentAmount"
                        type="number"
                        inputmode="decimal"
                        step="0.01"
                        :min="(parseFloat(event?.advance_paid) || 0) === 0 ? minimumDeposit : 0.01"
                        :max="remainingAmount"
                        :disabled="remainingAmount <= 0 || parseFloat(paymentAmount) >= remainingAmount"
                        class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="0.00"
                      />
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                      <span v-if="(parseFloat(event?.advance_paid) || 0) === 0">
                        Mínimo: ${{ minimumDeposit.toLocaleString() }} | Máximo: ${{ remainingAmount.toLocaleString() }}
                      </span>
                      <span v-else>
                        Máximo: ${{ remainingAmount.toLocaleString() }}
                      </span>
                    </div>
                    
                    <!-- Quick Amount Buttons -->
                    <div class="flex flex-wrap gap-2 mt-3">
                      <button 
                        @click="paymentAmount = remainingAmount"
                        class="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 hover:bg-blue-100"
                      >
                        Pagar todo
                      </button>
                      <button 
                        @click="paymentAmount = Math.min(minimumDeposit, remainingAmount)"
                        class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100"
                      >
                        ${{ minimumDeposit.toLocaleString() }}
                      </button>
                      <button 
                        @click="paymentAmount = Math.min(500, remainingAmount)"
                        class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100"
                      >
                        $500
                      </button>
                    </div>
                  </div>


                  <!-- Commission breakdown -->
                  <div v-if="paymentAmount && parseFloat(paymentAmount) > 0" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm space-y-1.5">
                    <div class="flex justify-between text-gray-600">
                      <span>Pago a reserva</span>
                      <span class="font-mono">${{ parseFloat(paymentAmount).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
                    </div>
                    <div class="flex justify-between text-gray-500">
                      <span>Comisión Stripe <span class="text-xs">(3.6% + $3.00)</span></span>
                      <span class="font-mono">${{ stripeCommission.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
                    </div>
                    <div class="flex justify-between font-semibold text-gray-900 pt-1.5 border-t border-gray-200">
                      <span>Total a cobrar</span>
                      <span class="font-mono">${{ stripeTotalCharge.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <button
                      @click="pagar()"
                      :disabled="!paymentAmount || paymentAmount <= 0 || isPaying || ((parseFloat(event?.advance_paid) || 0) === 0 && paymentAmount < minimumDeposit)"
                      class="flex-1 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i class="mr-2 fa-solid fa-credit-card"></i>
                      <span v-if="isPaying">Procesando...</span>
                      <span v-else>Pagar ${{ stripeTotalCharge.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }} con Stripe</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- MercadoPago Payment Accordion -->
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                <button 
                  @click="selectedPaymentMethod = selectedPaymentMethod === 'mercadopago' ? '' : 'mercadopago'"
                  :class="[
                    'flex w-full items-center justify-between p-4 text-left transition-colors',
                    selectedPaymentMethod === 'mercadopago' ? 'border-yellow-400' : 'hover:bg-gray-50'
                  ]"
                >
                  <div class="flex gap-3 items-center">
                    <div class="flex justify-center items-center w-10 h-10 text-gray-400">
                      <i class="text-lg fa-brands fa-cc-mastercard"></i>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">MercadoPago</div>
                      <div class="text-sm text-gray-500">Tarjetas, efectivo, transferencia</div>
                    </div>
                  </div>
                  <i class="text-gray-400 fa-solid fa-chevron-down" :class="{ 'rotate-180': selectedPaymentMethod === 'mercadopago' }"></i>
                </button>
                
                <div v-if="selectedPaymentMethod === 'mercadopago'" class="p-4 border-t border-gray-200">
                  <!-- Payment Summary -->
                  <div class="p-4 mb-4 bg-white rounded-lg border border-gray-200">
                    <h4 class="mb-3 text-sm font-semibold text-gray-700">Resumen del Pago</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="font-medium">Total de la reserva:</span>
                        <span class="font-mono">${{ (parseFloat(event?.total_price) || 0).toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="font-medium">Ya pagado:</span>
                        <span class="font-mono text-green-600">${{ (parseFloat(event?.advance_paid) || 0).toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between pt-2 border-t">
                        <span class="font-medium">Pendiente por pagar:</span>
                        <span class="font-mono text-red-600">${{ ((parseFloat(event?.total_price) || 0) - (parseFloat(event?.advance_paid) || 0)).toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Amount selection (hidden once preference is ready) -->
                  <template v-if="!mpPreferenceId">
                    <!-- Amount Input -->
                    <div class="mb-4">
                      <label class="block mb-2 text-sm font-semibold text-gray-700">Cantidad a pagar:</label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 text-gray-500 transform -translate-y-1/2">$</span>
                        <input
                          v-model="paymentAmount"
                          type="number"
                          inputmode="decimal"
                          step="0.01"
                          :min="(parseFloat(event?.advance_paid) || 0) === 0 ? minimumDeposit : 0.01"
                          :max="remainingAmount"
                          :disabled="remainingAmount <= 0 || parseFloat(paymentAmount) >= remainingAmount"
                          class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="0.00"
                        />
                      </div>
                      <div class="mt-2 text-xs text-gray-500">
                        <span v-if="(parseFloat(event?.advance_paid) || 0) === 0">
                          Mínimo: ${{ minimumDeposit.toLocaleString() }} | Máximo: ${{ remainingAmount.toLocaleString() }}
                        </span>
                        <span v-else>
                          Máximo: ${{ remainingAmount.toLocaleString() }}
                        </span>
                      </div>

                      <!-- Quick Amount Buttons -->
                      <div class="flex flex-wrap gap-2 mt-3">
                        <button
                          @click="paymentAmount = remainingAmount"
                          class="px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-50 rounded border border-yellow-300 hover:bg-yellow-100"
                        >
                          Pagar todo
                        </button>
                        <button
                          @click="paymentAmount = Math.min(minimumDeposit, remainingAmount)"
                          class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100"
                        >
                          ${{ minimumDeposit.toLocaleString() }}
                        </button>
                        <button
                          @click="paymentAmount = Math.min(500, remainingAmount)"
                          class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100"
                        >
                          $500
                        </button>
                      </div>
                    </div>

                    <!-- Payment type toggle -->
                    <div class="mb-3">
                      <div class="text-xs font-semibold text-gray-500 mb-1.5">Medio de pago</div>
                      <div class="flex gap-2">
                        <button
                          v-for="t in [{ key: 'card', label: 'Tarjeta / SPEI' }, { key: 'cash', label: 'Efectivo (Oxxo)' }]"
                          :key="t.key"
                          @click="mpPaymentType = t.key"
                          :class="['flex-1 py-1.5 px-2 text-xs font-semibold rounded border transition', mpPaymentType === t.key ? 'bg-yellow-400 text-gray-900 border-yellow-400' : 'bg-white text-gray-600 border-gray-300 hover:border-yellow-400']"
                        >{{ t.label }}</button>
                      </div>
                    </div>

                    <!-- Commission breakdown -->
                    <div v-if="paymentAmount && parseFloat(paymentAmount) > 0" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm space-y-1.5">
                      <div class="flex justify-between text-gray-600">
                        <span>Pago a reserva</span>
                        <span class="font-mono">${{ parseFloat(paymentAmount).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
                      </div>
                      <div class="flex justify-between text-gray-500">
                        <span>Comisión MP <span class="text-xs">({{ mpPaymentType === 'cash' ? '3.79%' : '3.49%' }} + $4.00 + IVA)</span></span>
                        <span class="font-mono">${{ mpCommission.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
                      </div>
                      <div class="flex justify-between font-semibold text-gray-900 pt-1.5 border-t border-gray-200">
                        <span>Total a cobrar</span>
                        <span class="font-mono">${{ mpTotalCharge.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
                      </div>
                    </div>

                    <div class="flex gap-3">
                      <button
                        @click="pagarMercadoPago()"
                        :disabled="!paymentAmount || paymentAmount <= 0 || isPaying || ((parseFloat(event?.advance_paid) || 0) === 0 && paymentAmount < minimumDeposit)"
                        class="flex-1 px-6 py-3 text-sm font-semibold text-gray-900 bg-yellow-400 rounded-lg transition-colors hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i class="mr-2 fa-brands fa-mercadopago"></i>
                        <span v-if="isPaying">Procesando...</span>
                        <span v-else>Pagar ${{ mpTotalCharge.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }} con MercadoPago</span>
                      </button>
                    </div>
                  </template>

                  <!-- Wallet Brick rendered after preference_id is obtained -->
                  <template v-else>
                    <p class="mb-3 text-sm text-center text-gray-600">
                      Haz clic en el botón para completar tu pago de
                      <strong>${{ parseFloat(paymentAmount).toLocaleString() }}</strong> en MercadoPago
                    </p>
                    <div id="walletBrick_container" style="min-height: 52px; width: 100%;"></div>
                    <button
                      @click="resetMpBrick"
                      class="mt-3 text-xs text-gray-400 underline hover:text-gray-600"
                    >
                      ← Cambiar monto
                    </button>
                  </template>
                </div>
              </div>

              <!-- Bank Transfer Payment Accordion -->
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                <button 
                  @click="selectedPaymentMethod = selectedPaymentMethod === 'transfer' ? '' : 'transfer'"
                  :class="[
                    'flex w-full items-center justify-between p-4 text-left transition-colors',
                    selectedPaymentMethod === 'transfer' ? 'border-green-200' : 'hover:bg-gray-50'
                  ]"
                >
                  <div class="flex gap-3 items-center">
                    <div class="flex justify-center items-center w-10 h-10 text-gray-400">
                      <i class="text-lg fa-solid fa-money-bill-transfer"></i>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">Transferencia Bancaria</div>
                      <div class="text-sm text-gray-500">Depósito directo a cuenta</div>
                    </div>
                  </div>
                  <i class="text-gray-400 fa-solid fa-chevron-down" :class="{ 'rotate-180': selectedPaymentMethod === 'transfer' }"></i>
                </button>
                
                <div v-if="selectedPaymentMethod === 'transfer'" class="p-4 border-t border-gray-200">
                  <!-- Payment Summary -->
                  <div class="p-4 mb-4 bg-white rounded-lg border border-gray-200">
                    <h4 class="mb-3 text-sm font-semibold text-gray-700">Resumen del Pago</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="font-medium">Total de la reserva:</span>
                        <span class="font-mono">${{ (parseFloat(event?.total_price) || 0).toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="font-medium">Ya pagado:</span>
                        <span class="font-mono text-green-600">${{ (parseFloat(event?.advance_paid) || 0).toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between pt-2 border-t">
                        <span class="font-medium">Pendiente por pagar:</span>
                        <span class="font-mono text-red-600">${{ ((parseFloat(event?.total_price) || 0) - (parseFloat(event?.advance_paid) || 0)).toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Amount Input -->
                  <div class="mb-4">
                    <label class="block mb-2 text-sm font-semibold text-gray-700">Cantidad a pagar:</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 text-gray-500 transform -translate-y-1/2">$</span>
                      <input
                        v-model="transferAmount"
                        type="number"
                        inputmode="decimal"
                        step="50"
                        :min="(parseFloat(event?.advance_paid) || 0) === 0 ? minimumDeposit : 0.01"
                        :max="remainingAmount"
                        :disabled="remainingAmount <= 0 || parseFloat(transferAmount) >= remainingAmount"
                        class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="0.00"
                      />
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                      Mínimo: ${{ (parseFloat(event?.advance_paid) || 0) === 0 ? minimumDeposit.toLocaleString() : '0.01' }} | Máximo: ${{ remainingAmount.toLocaleString() }}
                    </div>
                    
                    <!-- Quick Amount Buttons -->
                    <div class="flex flex-wrap gap-2 mt-3">
                      <button 
                        @click="transferAmount = remainingAmount"
                        class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100"
                      >
                        Pagar todo
                      </button>
                      <button 
                        @click="transferAmount = Math.min(minimumDeposit, remainingAmount)"
                        :disabled="remainingAmount < minimumDeposit"
                        class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ${{ minimumDeposit.toLocaleString() }}
                      </button>
                      <button 
                        @click="transferAmount = Math.min(500, remainingAmount)"
                        :disabled="remainingAmount < 500"
                        class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        $500
                      </button>
                    </div>
                  </div>

                  <!-- Deposit method toggle -->
                  <div class="mb-4">
                    <div class="text-xs font-semibold text-gray-500 mb-1.5">¿Cómo vas a depositar?</div>
                    <div class="flex gap-2">
                      <button @click="transferDepositMethod = 'spei'"
                        :class="['flex-1 flex gap-1.5 items-center justify-center py-2 px-2 text-xs font-semibold rounded border transition',
                          transferDepositMethod === 'spei' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400']">
                        <i class="fa-solid fa-money-bill-transfer"></i> Transferencia
                      </button>
                      <button @click="transferDepositMethod = 'oxxo'"
                        :class="['flex-1 flex gap-1.5 items-center justify-center py-2 px-2 text-xs font-semibold rounded border transition',
                          transferDepositMethod === 'oxxo' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400']">
                        <i class="fa-solid fa-store"></i> Depósito
                      </button>
                    </div>
                  </div>

                  <!-- Bank Account -->
                  <div class="mb-4">
                    <div class="mb-2 text-sm font-semibold text-gray-700">Datos de la cuenta:</div>
                    <!-- Card: click copies card number -->
                    <div class="relative aspect-[1.586/1] p-4 flex flex-col justify-between text-white bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl shadow-md cursor-pointer active:opacity-90 transition-opacity select-none" @click="copyCardNumber">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="text-[10px] font-semibold tracking-widest uppercase opacity-70">Banco</div>
                          <div class="text-sm font-bold">BBVA Bancomer</div>
                        </div>
                        <i class="text-2xl opacity-40 fa-solid fa-building-columns"></i>
                      </div>
                      <div>
                        <div class="mb-2">
                          <div class="text-[10px] font-semibold tracking-widest uppercase opacity-70">Número de tarjeta</div>
                          <div class="text-base font-bold tracking-[0.2em] font-mono">4152 3144 4172 4641</div>
                        </div>
                        <div class="text-[10px] font-semibold tracking-widest uppercase opacity-70">Titular</div>
                        <div class="text-sm font-bold">Christopher Pineda</div>
                      </div>
                      <div class="flex items-center gap-1 text-[10px] font-bold text-white/60">
                        <i class="fa-solid fa-copy text-[10px]"></i>
                        Toca para copiar número de tarjeta
                      </div>
                    </div>
                    <!-- CLABE copy button below card -->
                    <button @click="copyClabe" class="mt-2 w-full flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 hover:bg-blue-100 transition">
                      <div>
                        <span class="text-[10px] font-semibold uppercase tracking-wider text-blue-500 block">CLABE interbancaria</span>
                        <span class="font-mono font-bold tracking-wider">0123 2001 5086 5040 05</span>
                      </div>
                      <span class="flex items-center gap-1 font-semibold text-blue-600 flex-shrink-0 ml-2">
                        <i class="fa-solid fa-copy"></i> Copiar
                      </span>
                    </button>

                    <!-- Instructions SPEI -->
                    <div v-if="transferDepositMethod === 'spei'" class="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-gray-700 space-y-1.5">
                      <div class="font-semibold text-blue-700 mb-1">¿Cómo realizar tu transferencia SPEI?</div>
                      <div class="flex gap-2 items-start"><span class="text-blue-500 font-bold flex-shrink-0">1.</span> Abre tu app bancaria o banca en línea.</div>
                      <div class="flex gap-2 items-start"><span class="text-blue-500 font-bold flex-shrink-0">2.</span> Elige "Transferencia SPEI" e ingresa la CLABE de arriba.</div>
                      <div class="flex gap-2 items-start"><span class="text-blue-500 font-bold flex-shrink-0">3.</span> Ingresa el monto exacto que pusiste arriba.</div>
                      <div class="flex gap-2 items-start"><span class="text-blue-500 font-bold flex-shrink-0">4.</span> Sube el comprobante aquí abajo para confirmar tu pago.</div>
                    </div>

                    <!-- Instructions Oxxo / Walmart -->
                    <div v-else class="mt-3 p-3 bg-orange-50 border border-orange-100 rounded-xl text-xs text-gray-700 space-y-1.5">
                      <div class="font-semibold text-orange-600 mb-1 flex gap-1.5 items-center">
                        <i class="fa-solid fa-store"></i> ¿Cómo depositar en tienda?
                      </div>
                      <div class="flex gap-2 items-start">
                        <span class="text-orange-500 font-bold flex-shrink-0">1.</span>
                        <span class="flex flex-wrap gap-1 items-center">Ve a cualquier
                          <span class="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-600 text-white">OXXO</span>
                          <span class="px-1.5 py-0.5 rounded text-[9px] font-black bg-green-700 text-white">7-Eleven</span>
                          <span class="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white">Walmart</span>
                          <span class="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-700 text-white">Fma GDL</span>
                        </span>
                      </div>
                      <div class="flex gap-2 items-start"><span class="text-orange-500 font-bold flex-shrink-0">2.</span> Pide un <strong>depósito con número de tarjeta</strong>.</div>
                      <div class="flex gap-2 items-start"><span class="text-orange-500 font-bold flex-shrink-0">4.</span> Guarda tu ticket y súbelo como comprobante aquí abajo.</div>
                      <div class="flex gap-2 items-start text-orange-500 font-semibold"><i class="fa-solid fa-triangle-exclamation flex-shrink-0 mt-px"></i> Puede haber una comisión de $10–$15 MXN por parte de la tienda, no incluida en el total.</div>
                    </div>
                  </div>

                  <!-- Upload de comprobante -->
                  <div class="mb-4">
                    <label class="block mb-2 text-sm font-semibold text-gray-700">Comprobante de pago:</label>
                    <div class="p-6 text-center rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-green-400">
                      <input 
                        type="file" 
                        accept="image/*"
                        @change="handleFileUpload" 
                        class="hidden" 
                        ref="fileInput"
                      />
                      <div v-if="!uploadedFile" @click="$refs.fileInput.click()" class="cursor-pointer">
                        <i class="mb-2 text-4xl text-gray-400 fa-solid fa-cloud-upload-alt"></i>
                        <div class="text-sm text-gray-600">
                          <span class="font-semibold text-green-600">Haz clic para subir</span> o arrastra aquí
                        </div>
                        <div class="mt-1 text-xs text-gray-500">PNG, JPG, JPEG, GIF, WebP hasta 10MB</div>
                      </div>
                      <div v-else class="flex justify-between items-center">
                        <div class="flex gap-3 items-center">
                          <i class="text-green-500 fa-solid fa-check-circle"></i>
                          <span class="text-sm font-medium text-gray-700">{{ uploadedFile.name }}</span>
                        </div>
                        <button @click="removeFile" class="text-red-500 hover:text-red-700">
                          <i class="fa-solid fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <button 
                      @click="submitTransferPayment()" 
                      :disabled="!transferAmount || !uploadedFile || isSubmittingTransfer"
                      class="flex-1 px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i class="mr-2 fa-solid fa-upload"></i>
                      <span v-if="isSubmittingTransfer">Enviando...</span>
                      <span v-else>Enviar Comprobante</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Cash Payment Accordion -->
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                <button 
                  @click="selectedPaymentMethod = selectedPaymentMethod === 'cash' ? '' : 'cash'"
                  :class="[
                    'flex w-full items-center justify-between p-4 text-left transition-colors',
                    selectedPaymentMethod === 'cash' ? 'border-yellow-200' : 'hover:bg-gray-50'
                  ]"
                >
                  <div class="flex gap-3 items-center">
                    <div class="flex justify-center items-center w-10 h-10 text-gray-400">
                      <i class="text-lg fa-solid fa-money-bill-wave"></i>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">Pago en Efectivo</div>
                      <div class="text-sm text-gray-500">Pago presencial en el evento</div>
                    </div>
                  </div>
                  <i class="text-gray-400 fa-solid fa-chevron-down" :class="{ 'rotate-180': selectedPaymentMethod === 'cash' }"></i>
                </button>
                
                <div v-if="selectedPaymentMethod === 'cash'" class="p-4 border-t border-gray-200">
                  <!-- Payment Summary -->
                  <div class="p-4 mb-4 bg-white rounded-lg border border-gray-200">
                    <h4 class="mb-3 text-sm font-semibold text-gray-700">Resumen del Pago</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="font-medium">Total de la reserva:</span>
                        <span class="font-mono">${{ (parseFloat(event?.total_price) || 0).toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="font-medium">Ya pagado:</span>
                        <span class="font-mono text-green-600">${{ (parseFloat(event?.advance_paid) || 0).toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between pt-2 border-t">
                        <span class="font-medium">Pendiente por pagar:</span>
                        <span class="font-mono text-red-600">${{ ((parseFloat(event?.total_price) || 0) - (parseFloat(event?.advance_paid) || 0)).toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Staff: register cash payment directly -->
                  <template v-if="isStaff">
                    <div class="p-4 mb-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div class="flex items-start space-x-2">
                        <i class="mt-0.5 text-yellow-600 fa-solid fa-user-shield"></i>
                        <div class="text-sm text-yellow-800 font-medium">Registrar pago en efectivo recibido</div>
                      </div>
                    </div>
                    <div class="mb-4">
                      <label class="block mb-2 text-sm font-semibold text-gray-700">Monto recibido:</label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 text-gray-500 transform -translate-y-1/2">$</span>
                        <input
                          v-model="cashAmount"
                          type="number"
                          inputmode="decimal"
                          step="0.01"
                          min="0.01"
                          class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div class="flex flex-wrap gap-2 mt-2">
                        <button @click="cashAmount = ((parseFloat(event?.total_price) || 0) - (parseFloat(event?.advance_paid) || 0)).toString()"
                          class="px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-50 rounded border border-yellow-200 hover:bg-yellow-100">
                          Pagar todo
                        </button>
                      </div>
                    </div>
                    <button
                      @click="registerCashPayment()"
                      :disabled="!cashAmount || isRegisteringCash"
                      class="w-full px-6 py-3 text-sm font-semibold text-white bg-yellow-600 rounded-lg transition-colors hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i class="mr-2 fa-solid fa-money-bill-wave"></i>
                      {{ isRegisteringCash ? 'Registrando...' : 'Registrar pago en efectivo' }}
                    </button>
                  </template>

                  <!-- Non-staff: contact to coordinate -->
                  <template v-else>
                    <div class="p-4 mb-4 bg-yellow-100 rounded-lg border border-yellow-200">
                      <div class="flex items-start space-x-2">
                        <i class="mt-0.5 text-yellow-600 fa-solid fa-info-circle"></i>
                        <div class="text-sm text-yellow-800">
                          <div class="font-medium">Importante:</div>
                          <div>Contacta con nosotros para coordinar el pago en efectivo y confirmar la disponibilidad.</div>
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-3">
                      <button
                        @click="contactForCashPayment()"
                        class="flex-1 px-6 py-3 text-sm font-semibold text-white bg-yellow-600 rounded-lg transition-colors hover:bg-yellow-700"
                      >
                        <i class="mr-2 fa-solid fa-phone"></i>
                        Contactar para Coordinar
                      </button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment History -->
        <div v-if="ordersLoading" class="mt-6 p-4 text-sm text-center text-gray-400 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div class="inline-block mr-2 w-4 h-4 rounded-full border-2 border-gray-400 animate-spin border-t-transparent"></div>
          Cargando historial de pagos...
        </div>
        <div v-else-if="allPayments.length > 0" class="mt-6">
          <div class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h2 class="mb-3 text-sm font-bold text-gray-700">Historial de Pagos</h2>
            <div class="divide-y divide-gray-100">
              <div v-for="payment in allPayments" :key="payment.id" class="py-2.5 first:pt-0 last:pb-0">
                <!-- Clickable row -->
                <div class="flex gap-2.5 items-center cursor-pointer select-none" @click="togglePaymentDetail(payment.id)">
                  <div class="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-gray-50 rounded-lg text-gray-400">
                    <i :class="['text-sm', getPaymentIcon(payment.gateway)]"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex gap-2 justify-between items-center">
                      <div class="flex gap-2 items-center min-w-0">
                        <span class="text-sm font-semibold text-gray-900 truncate">{{ getPaymentMethodText(payment.method) }}</span>
                        <span :class="['flex-shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-bold', getPaymentStatusClass(payment.status)]">
                          {{ getPaymentStatusText(payment.status) }}
                        </span>
                      </div>
                      <div class="flex items-center gap-1.5 flex-shrink-0">
                        <span class="text-sm font-bold text-gray-900">${{ parseFloat(payment.amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
                        <i class="text-gray-300 text-[10px] fa-solid fa-chevron-down transition-transform duration-200"
                          :class="expandedPaymentId === payment.id ? 'rotate-180' : ''"></i>
                      </div>
                    </div>
                    <div class="flex gap-2 items-center mt-0.5">
                      <span class="text-[10px] text-gray-500">
                        <i class="fa-regular fa-calendar mr-0.5"></i>
                        {{ formatDate(payment.paid_at || payment.created_at) }}
                      </span>
                      <span v-if="payment.card_last4" class="text-[10px] text-gray-400">· •••• {{ payment.card_last4 }}</span>
                    </div>
                  </div>
                </div>

                <!-- Expanded detail panel -->
                <div v-if="expandedPaymentId === payment.id" class="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-600 space-y-2">
                  <div class="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <div>
                      <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Plataforma</div>
                      <div class="font-semibold text-gray-700">{{ getGatewayText(payment.gateway) || '—' }}</div>
                    </div>
                    <div>
                      <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Método</div>
                      <div class="font-semibold text-gray-700">{{ getPaymentMethodText(payment.method) || '—' }}</div>
                    </div>
                    <div>
                      <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Monto</div>
                      <div class="font-semibold text-gray-700">${{ parseFloat(payment.amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</div>
                    </div>
                    <div>
                      <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Estado</div>
                      <div class="font-semibold text-gray-700">{{ getPaymentStatusText(payment.status) }}</div>
                    </div>
                    <div v-if="payment.created_at" class="col-span-2">
                      <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Creado</div>
                      <div class="font-semibold text-gray-700">{{ formatDate(payment.created_at) }} · {{ formatTime(payment.created_at) }}</div>
                    </div>
                    <div v-if="payment.paid_at" class="col-span-2">
                      <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Pagado el</div>
                      <div class="font-semibold text-gray-700">{{ formatDate(payment.paid_at) }} · {{ formatTime(payment.paid_at) }}</div>
                    </div>
                    <div v-if="payment.card_last4" class="col-span-2">
                      <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Tarjeta</div>
                      <div class="font-semibold text-gray-700">•••• •••• •••• {{ payment.card_last4 }}</div>
                    </div>
                    <div v-if="payment.id" class="col-span-2">
                      <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">ID de Pago</div>
                      <div class="font-mono text-gray-500 text-[10px] break-all">{{ payment.id }}</div>
                    </div>
                  </div>
                  <!-- Comprobante -->
                  <div v-if="getPaymentPhotoUrl(payment)" class="pt-1 border-t border-gray-200">
                    <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Comprobante</div>
                    <img
                      :src="getPaymentPhotoUrl(payment)"
                      alt="Comprobante"
                      class="h-28 rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      @click.stop="openPhotoModal(getPaymentPhotoUrl(payment))"
                      @error="handleImageError"
                      @load="handleImageLoad"
                    />
                  </div>
                  <!-- Staff approve button -->
                  <div v-if="isStaff && payment.status === 'pending'" class="pt-2 border-t border-gray-200">
                    <button
                      @click.stop="approvePayment(payment.id)"
                      :disabled="approvingPaymentId === payment.id"
                      class="w-full py-2 text-xs font-bold text-white bg-green-500 rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors"
                    >
                      <i v-if="approvingPaymentId === payment.id" class="fa-solid fa-spinner fa-spin mr-1"></i>
                      <i v-else class="fa-solid fa-circle-check mr-1"></i>
                      {{ approvingPaymentId === payment.id ? 'Aprobando...' : 'Aprobar pago' }}
                    </button>
                  </div>
                  <!-- Staff delete button (cash/transfer only) -->
                  <div v-if="isStaff && ['cash','transfer'].includes(payment.method)" class="pt-2 border-t border-gray-200">
                    <button
                      @click.stop="deletePayment(payment.id)"
                      :disabled="deletingPaymentId === payment.id"
                      class="w-full py-2 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      <i v-if="deletingPaymentId === payment.id" class="fa-solid fa-spinner fa-spin mr-1"></i>
                      <i v-else class="fa-solid fa-trash mr-1"></i>
                      {{ deletingPaymentId === payment.id ? 'Eliminando...' : 'Eliminar pago' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Review & Rating (shown after steps when finalizado) -->
        <div v-if="event && (event.status === 'finalizado' || event.status_display === 'Finalizado')" class="mt-4">
          <div class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-sm font-bold text-gray-700">{{ isStaff ? 'Reseña del cliente' : 'Tu reseña' }}</h2>
              <span v-if="reviewLoading" class="text-xs text-gray-500">Cargando…</span>
            </div>

            <!-- Staff: read-only view -->
            <template v-if="isStaff">
              <div v-if="myReview && (myReview.rating || myReview.review)">
                <div class="flex gap-1 items-center mb-2">
                  <span class="text-yellow-400" v-for="s in (myReview.rating || 0)" :key="'rs'+s"><i class="fa-solid fa-star"></i></span>
                  <span class="text-gray-300" v-for="s in (5 - (myReview.rating || 0))" :key="'re'+s"><i class="fa-regular fa-star"></i></span>
                  <span class="ml-2 text-sm text-gray-500">{{ myReview.rating || 0 }}/5</span>
                </div>
                <p class="text-sm text-gray-700 whitespace-pre-line">{{ myReview.review }}</p>
              </div>
              <p v-else class="text-sm text-gray-400 italic">El cliente aún no ha dejado una reseña.</p>
            </template>

            <!-- User: review section -->
            <template v-else>
              <!-- Has review: show read-only + share, with edit toggle -->
              <template v-if="myReview && (myReview.rating || myReview.review)">
                <div v-if="!editingReview">
                  <!-- Read-only display -->
                  <div class="flex gap-1 items-center mb-2">
                    <span class="text-yellow-400" v-for="s in (myReview.rating || 0)" :key="'rs'+s"><i class="fa-solid fa-star"></i></span>
                    <span class="text-gray-300" v-for="s in (5 - (myReview.rating || 0))" :key="'re'+s"><i class="fa-regular fa-star"></i></span>
                    <span class="ml-2 text-sm text-gray-500">{{ myReview.rating || 0 }}/5</span>
                  </div>
                  <p class="text-sm text-gray-700 whitespace-pre-line mb-3">{{ myReview.review }}</p>
                  <button @click="editingReview = true"
                    class="text-xs font-semibold text-blue-600 hover:underline mb-4 inline-block">
                    <i class="fa-solid fa-pen mr-1"></i>Editar reseña
                  </button>

                  <!-- Share — same style as confirmation card -->
                  <div class="mt-4 p-4 bg-gradient-to-br from-[#1a0533] to-[#0a021e] rounded-2xl border border-purple-900/40">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-base">⭐</span>
                      <h3 class="text-sm font-bold text-white">¡Comparte tu experiencia!</h3>
                    </div>
                    <p class="text-xs text-purple-300 mb-3">Genera tu tarjeta y compártela con todos.</p>

                    <!-- Card preview -->
                    <div v-if="reviewCardUrl" class="mb-3">
                      <img :src="reviewCardUrl" alt="Tarjeta de reseña" class="w-full max-w-xs mx-auto rounded-xl shadow-md" />
                      <div class="flex justify-center mt-2">
                        <button @click="loadReviewCard" :disabled="loadingReviewCard"
                          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-300 text-xs font-medium transition disabled:opacity-50">
                          <svg :class="['h-3.5 w-3.5', loadingReviewCard && 'animate-spin']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                          </svg>
                          {{ loadingReviewCard ? 'Generando...' : 'Nueva tarjeta' }}
                        </button>
                      </div>
                    </div>
                    <div v-else-if="loadingReviewCard" class="flex justify-center py-4">
                      <svg class="animate-spin h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    </div>

                    <!-- Generate button -->
                    <button v-if="!reviewCardUrl && !loadingReviewCard" @click="loadReviewCard"
                      class="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition mb-2">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      Generar tarjeta
                    </button>

                    <!-- Share buttons -->
                    <div v-if="reviewCardUrl" class="flex flex-col gap-2">
                      <button v-if="canNativeShare"
                        @click="nativeShareCard(reviewCardApiUrl, '¡Tuve mi evento en Terraza Pineda! ' + '★'.repeat(myReview.rating || 5) + ' ¡Totalmente recomendado!')"
                        class="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-bold shadow transition hover:opacity-90">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                        Compartir imagen
                      </button>
                      <div class="flex gap-2">
                        <a :href="`https://wa.me/?text=${encodeURIComponent('¡Tuve mi evento en Terraza Pineda! ' + '★'.repeat(myReview.rating || 5) + ' ¡Totalmente recomendado! terrazapineda.com')}`"
                          target="_blank" rel="noopener"
                          class="flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] text-white text-sm font-semibold transition">
                          <svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.374 0 0 5.374 0 12c0 2.117.547 4.103 1.504 5.829L.057 23.882l6.233-1.635A11.934 11.934 0 0012 24c6.626 0 12-5.374 12-12 0-6.627-5.374-12-12-12zm0 21.818a9.818 9.818 0 01-4.999-1.369l-.358-.213-3.706.973.989-3.611-.234-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.389 9.818 9.818 0 5.43-4.389 9.818-9.818 9.818z"/></svg>
                          WhatsApp
                        </a>
                        <button @click="copyCardLink(reviewCardUrl)"
                          class="flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1877F2] hover:bg-[#1565d8] text-white text-sm font-semibold transition">
                          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                          Copiar
                        </button>
                        <button @click="downloadCard(reviewCardApiUrl, 'terraza-pineda-resena.png')"
                          class="flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition">
                          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          Guardar
                        </button>
                      </div>
                      <div class="text-xs text-purple-400 text-center pt-1 space-y-0.5">
                        <p v-if="canNativeShare">📲 "Compartir imagen" abre Instagram, Facebook y más desde tu cel.</p>
                        <p v-else>📲 En tu cel: usa "Compartir imagen" para subir directo a redes.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Edit form (shown when editingReview=true) -->
                <div v-else>
                  <div class="flex gap-2 items-center mb-3">
                    <button v-for="s in 5" :key="s" type="button" @click="rating = s"
                      class="text-2xl focus:outline-none"
                      :class="s <= (rating || 0) ? 'text-yellow-400' : 'text-gray-300'">
                      <i :class="s <= (rating || 0) ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
                    </button>
                    <span class="ml-2 text-sm text-gray-500">{{ rating || 0 }}/5</span>
                  </div>
                  <textarea v-model="reviewText" rows="4"
                    placeholder="Cuéntanos cómo fue tu experiencia"
                    class="p-3 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                  <div class="flex gap-2 justify-end items-center mt-3">
                    <button @click="editingReview = false; resetReviewForm()" type="button"
                      class="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
                    <button @click="saveReview" :disabled="savingReview || (rating || 0) === 0"
                      class="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                      <span v-if="savingReview" class="flex gap-2 items-center">
                        <div class="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
                        Guardando…
                      </span>
                      <span v-else>Guardar reseña</span>
                    </button>
                  </div>
                </div>
              </template>

              <!-- No review yet: show form directly -->
              <template v-else>
                <div class="flex gap-2 items-center mb-3">
                  <button v-for="s in 5" :key="s" type="button" @click="rating = s"
                    class="text-2xl focus:outline-none"
                    :class="s <= (rating || 0) ? 'text-yellow-400' : 'text-gray-300'">
                    <i :class="s <= (rating || 0) ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
                  </button>
                  <span class="ml-2 text-sm text-gray-500">{{ rating || 0 }}/5</span>
                </div>
                <textarea v-model="reviewText" rows="4"
                  placeholder="Cuéntanos cómo fue tu experiencia"
                  class="p-3 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                <div class="flex gap-2 justify-end items-center mt-3">
                  <button @click="resetReviewForm" type="button"
                    class="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Limpiar</button>
                  <button @click="saveReview" :disabled="savingReview || (rating || 0) === 0"
                    class="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="savingReview" class="flex gap-2 items-center">
                      <div class="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
                      Guardando…
                    </span>
                    <span v-else>Guardar reseña</span>
                  </button>
                </div>
              </template>
            </template><!-- /v-else user -->
          </div>
        </div><!-- /Review -->
        </div><!-- /RIGHT BOTTOM -->

        <!-- RIGHT COLUMN (steps — sticky on desktop) -->
        <div class="flex flex-col gap-3 order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24">
          <!-- Steps Progress -->
          <div class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h2 class="mb-3 text-sm font-bold text-gray-700">Pasos a seguir</h2>

            <!-- Cancelado banner -->
            <div v-if="event.status === 'cancelado'"
              class="mb-3 overflow-hidden rounded-xl border border-orange-300 bg-orange-50">
              <div class="flex gap-3 items-center px-3 pt-3 pb-2">
                <div class="flex flex-shrink-0 justify-center items-center w-7 h-7 bg-orange-500 rounded-full">
                  <i class="text-xs text-white fa-solid fa-xmark"></i>
                </div>
                <div class="text-sm font-bold text-orange-800">Reserva Cancelada</div>
              </div>
              <div v-if="event.cancellation_reason" class="mx-3 mb-3 px-3 py-2 bg-white rounded-lg border border-orange-200 text-xs text-orange-700">
                <span class="font-semibold">Motivo: </span>{{ event.cancellation_reason }}
              </div>
              <div v-else class="px-3 pb-3 text-xs text-orange-600">Esta reserva ha sido cancelada.</div>
            </div>

            <!-- Rechazado banner -->
            <div v-if="event.status === 'rechazado'" class="mb-3 rounded-xl border border-red-300 bg-red-50 overflow-hidden">
              <!-- Header -->
              <div class="flex gap-3 items-center px-3 pt-3 pb-2">
                <div class="flex flex-shrink-0 justify-center items-center w-7 h-7 bg-red-500 rounded-full">
                  <i class="text-xs text-white fa-solid fa-xmark"></i>
                </div>
                <div class="text-sm font-bold text-red-800">Reserva Rechazada</div>
              </div>

              <!-- Razón específica del staff -->
              <div v-if="event.rejection_reason" class="mx-3 mb-3 px-3 py-2 bg-white rounded-lg border border-red-200 text-xs text-red-700">
                <span class="font-semibold">Razón: </span>{{ event.rejection_reason }}
              </div>

              <!-- Posibles razones comunes -->
              <div class="mx-3 mb-3">
                <p class="mb-1.5 text-xs font-semibold text-red-700">Motivos frecuentes de rechazo:</p>
                <ul class="space-y-1 text-xs text-red-600">
                  <li class="flex gap-1.5 items-start">
                    <i class="mt-0.5 fa-solid fa-circle-dot text-[10px] flex-shrink-0"></i>
                    Fecha o aforo no disponibles en el periodo solicitado
                  </li>
                  <li class="flex gap-1.5 items-start">
                    <i class="mt-0.5 fa-solid fa-circle-dot text-[10px] flex-shrink-0"></i>
                    Información incompleta o incorrecta en la solicitud
                  </li>
                  <li class="flex gap-1.5 items-start">
                    <i class="mt-0.5 fa-solid fa-circle-dot text-[10px] flex-shrink-0"></i>
                    Incumplimiento de alguna política del reglamento
                  </li>
                  <li class="flex gap-1.5 items-start">
                    <i class="mt-0.5 fa-solid fa-circle-dot text-[10px] flex-shrink-0"></i>
                    El tipo de evento no está permitido en las instalaciones
                  </li>
                </ul>
              </div>

              <!-- Link al reglamento -->
              <div class="px-3 pb-3">
                <router-link to="/reglamento"
                  class="inline-flex gap-1.5 items-center text-xs font-semibold text-red-700 hover:text-red-900 underline underline-offset-2">
                  <i class="fa-solid fa-book-open"></i>
                  Consulta el reglamento completo
                </router-link>
              </div>
            </div>

            <div class="flex flex-col">
              <div v-for="(step, i) in visibleSteps" :key="step.key" class="relative flex gap-3 pb-2">
                <!-- Vertical connector line -->
                <div v-if="i < visibleSteps.length - 1" class="absolute left-[11px] top-7 bottom-0 w-0.5"
                  :class="[
                    i < getCurrentStepIndex(event.status, event.is_entregado) ? 'bg-green-300' :
                    i === getCurrentStepIndex(event.status, event.is_entregado) ? 'bg-blue-200' :
                    'bg-gray-200'
                  ]"
                ></div>

                <!-- Step icon -->
                <div class="relative z-10 flex-shrink-0 mt-2.5">
                  <div v-if="i === getCurrentStepIndex(event.status, event.is_entregado)"
                    class="absolute inset-0 w-6 h-6 bg-green-400 rounded-full opacity-40 animate-ping">
                  </div>
                  <div class="relative flex justify-center items-center w-6 h-6 text-xs font-bold rounded-full"
                    :class="[
                      i < getCurrentStepIndex(event.status, event.is_entregado) ? 'bg-green-500 text-white shadow-sm' :
                      i === getCurrentStepIndex(event.status, event.is_entregado) ? 'bg-green-500 text-white shadow-md' :
                      i === getCurrentStepIndex(event.status, event.is_entregado) + 1 && getCurrentStepIndex(event.status, event.is_entregado) >= 0 ? 'bg-blue-500 text-white shadow-sm' :
                      'bg-white border-2 border-gray-300 text-gray-400'
                    ]"
                  >
                    <i v-if="i < getCurrentStepIndex(event.status, event.is_entregado)" class="text-xs fa-solid fa-check"></i>
                    <span v-else class="text-xs">{{ i + 1 }}</span>
                  </div>
                </div>

                <!-- Step card -->
                <div class="flex-1 min-w-0 rounded-xl border px-3 py-2.5 transition"
                  :class="[
                    i < getCurrentStepIndex(event.status, event.is_entregado) ? 'border-green-200 bg-green-50' :
                    i === getCurrentStepIndex(event.status, event.is_entregado) ? 'border-green-300 bg-green-50 shadow-sm ring-1 ring-green-200' :
                    i === getCurrentStepIndex(event.status, event.is_entregado) + 1 && getCurrentStepIndex(event.status, event.is_entregado) >= 0 ? 'border-blue-300 bg-blue-50 shadow-sm ring-1 ring-blue-200' :
                    'border-gray-200 bg-white'
                  ]"
                >
                  <div class="flex justify-between items-center gap-1">
                    <span class="text-sm font-semibold"
                      :class="[
                        i === getCurrentStepIndex(event.status, event.is_entregado) ? 'text-green-800' :
                        i === getCurrentStepIndex(event.status, event.is_entregado) + 1 && getCurrentStepIndex(event.status, event.is_entregado) >= 0 ? 'text-blue-800' :
                        'text-gray-900'
                      ]"
                    >{{ step.label }}</span>
                    <!-- Status badge -->
                    <span v-if="i < getCurrentStepIndex(event.status, event.is_entregado)"
                      class="flex-shrink-0 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Listo</span>
                    <span v-else-if="i === getCurrentStepIndex(event.status, event.is_entregado)"
                      class="flex-shrink-0 px-2 py-0.5 text-xs font-bold text-white bg-green-500 rounded-full">Actual</span>
                    <span v-else-if="i === getCurrentStepIndex(event.status, event.is_entregado) + 1 && getCurrentStepIndex(event.status, event.is_entregado) >= 0"
                      class="flex-shrink-0 px-2 py-0.5 text-xs font-bold text-white bg-blue-500 rounded-full">Próximo</span>
                  </div>
                  <p class="mt-0.5 text-xs leading-relaxed text-gray-500">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Cancellation Policy + Cancel Button -->
          <div v-if="!isLocked"
            class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h3 class="mb-3 text-sm font-bold text-gray-700">
              <i class="mr-1.5 text-gray-400 fa-solid fa-file-contract"></i>
              Política del Evento
            </h3>
            <div class="space-y-2.5 text-xs text-gray-600">
              <div class="flex gap-2 items-start">
                <i class="mt-0.5 flex-shrink-0 text-gray-400 fa-solid fa-coins"></i>
                <p><span class="font-semibold text-gray-700">Anticipo de reserva:</span> se requiere un anticipo de <span class="font-semibold text-gray-900">${{ minimumDeposit.toLocaleString() }} MXN</span> para apartar la fecha. Este monto no es reembolsable salvo las excepciones descritas a continuación.</p>
              </div>
              <div class="flex gap-2 items-start">
                <i class="mt-0.5 flex-shrink-0 text-gray-400 fa-solid fa-triangle-exclamation"></i>
                <p><span class="font-semibold text-gray-700">Pago total:</span> el monto total del evento debe quedar <span class="font-semibold text-gray-900">liquidado antes del inicio del evento</span>. No se entrega el lugar si no está pagado por completo.</p>
              </div>
              <div class="flex gap-2 items-start">
                <i class="mt-0.5 flex-shrink-0 text-gray-400 fa-solid fa-circle-check"></i>
                <p><span class="font-semibold text-gray-700">Más de 45 días de anticipación:</span> se devuelve el 50% del anticipo. El resto se retiene por gastos administrativos.</p>
              </div>
              <div class="flex gap-2 items-start">
                <i class="mt-0.5 flex-shrink-0 text-gray-400 fa-solid fa-circle-xmark"></i>
                <p><span class="font-semibold text-gray-700">45 días o menos:</span> el anticipo no es reembolsable bajo ninguna circunstancia.</p>
              </div>
              <div class="flex gap-2 items-start">
                <i class="mt-0.5 flex-shrink-0 text-gray-400 fa-solid fa-calendar-days"></i>
                <p><span class="font-semibold text-gray-700">Cambios de fecha:</span> con al menos 3 semanas de anticipación, sujeto a disponibilidad. Solo se permite un cambio por evento.</p>
              </div>
              <div class="flex gap-2 items-start">
                <i class="mt-0.5 flex-shrink-0 text-gray-400 fa-solid fa-credit-card"></i>
                <p><span class="font-semibold text-gray-700">Comisiones de plataformas de pago:</span> las comisiones e importes adicionales cobrados por plataformas externas (MercadoPago, Stripe, transferencia bancaria, etc.) <span class="font-semibold text-gray-900">no están incluidos en el costo total de la reserva</span> y corren por cuenta del cliente.</p>
              </div>
            </div>
            <router-link to="/reglamento"
              class="inline-flex gap-1.5 items-center mt-3 text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline">
              <i class="fa-solid fa-book-open"></i>
              Ver reglamento completo
            </router-link>
            <div class="flex gap-2 mt-4">
              <!-- Reschedule button — staff bypass the 1-change limit -->
              <button v-if="isStaff || event.date_changes_count === 0"
                @click="showDateChangeModal = true; dateChangeError = ''"
                class="flex-1 py-2 text-xs font-semibold text-white bg-cyan-500 rounded-xl hover:bg-cyan-600 transition-colors">
                <i class="mr-1 fa-solid fa-calendar-days"></i>
                Cambiar Fecha
              </button>
              <div v-else class="flex-1 flex gap-2 items-center justify-center px-3 py-2 text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                <i class="fa-solid fa-calendar-xmark text-gray-400"></i>
                Sin cambios disponibles
              </div>

              <button @click="showCancelModal = true"
                class="flex-1 py-2 text-xs font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                <i class="mr-1 fa-solid fa-ban"></i>
                Cancelar Reserva
              </button>
            </div>
          </div>
        </div><!-- /LEFT -->
      </div><!-- /grid -->

        <!-- Staff Card -->
        <div v-if="event.staff" class="flex gap-3 items-center p-3 mt-2 mb-6 bg-white rounded-2xl border border-blue-100 shadow sm:p-4 md:flex-row">
          <img :src="event.staff.profile?.image || 'https://ui-avatars.com/api/?name=' + (event.staff.first_name || '') + '+' + (event.staff.last_name || '') + '&background=0D8ABC&color=fff'" alt="Staff profile" class="object-cover flex-shrink-0 w-12 h-12 rounded-full border-2 border-blue-200 sm:w-16 sm:h-16" />
          <div class="flex-1 min-w-0">
            <div class="mb-0.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">¿Quién te atendió?</div>
            <div class="text-sm font-bold text-gray-900 sm:text-base">{{ event.staff.first_name }} {{ event.staff.last_name }}</div>
            <div class="text-xs text-gray-600 truncate">{{ event.staff.email }}</div>
            <div v-if="event.staff.phone" class="mt-1">
              <a :href="'tel:' + event.staff.phone" class="inline-flex gap-1 items-center font-semibold text-blue-600 hover:underline">
                <i class="fa-solid fa-phone"></i>
                {{ event.staff.phone }}
              </a>
          </div>
        </div>
      </div>

      <!-- Activity Logs Section for Staff -->
      <div v-if="isStaff" class="mt-6 mb-8">
        <div class="overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
          <!-- Header -->
          <div class="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-sm font-bold text-gray-700">Registro de Actividad</h2>
                <p class="text-xs text-gray-400">{{ logsData?.length || 0 }} eventos</p>
              </div>
              <button
                @click="refetchLogs()"
                :disabled="logsLoading"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 disabled:opacity-50 transition-colors"
              >
                <i class="fa-solid fa-rotate-right" :class="logsLoading ? 'animate-spin' : ''"></i>
                Actualizar
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-3 py-4">
            <!-- Loading state -->
            <div v-if="logsLoading" class="flex justify-center items-center gap-2 py-8">
              <div class="w-4 h-4 rounded-full border-2 border-indigo-500 animate-spin border-t-transparent"></div>
              <span class="text-sm text-gray-400">Cargando historial...</span>
            </div>

            <!-- Error state -->
            <div v-else-if="logsError" class="flex flex-col items-center gap-2 py-8 text-center">
              <i class="text-red-400 fa-solid fa-triangle-exclamation"></i>
              <p class="text-sm font-medium text-red-600">Error cargando logs</p>
            </div>

            <!-- Logs Timeline -->
            <div v-else-if="logsData && logsData.length > 0" class="relative">
              <!-- Vertical guide line -->
              <div class="absolute left-[15px] top-0 bottom-0 w-px bg-gray-100"></div>

              <div class="space-y-2">
                <div v-for="log in logsData" :key="log.id" class="flex gap-3">
                  <!-- Icon dot -->
                  <div class="relative z-10 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-white shadow-sm"
                    :class="getLogActionClass(log.action)">
                    <i class="text-[10px]" :class="getLogIcon(log.action)"></i>
                  </div>

                  <!-- Card -->
                  <div class="flex-1 min-w-0 rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-2.5 sm:px-4 sm:py-3">
                    <!-- Description -->
                    <p class="text-xs sm:text-sm font-semibold leading-snug text-gray-800">{{ log.description }}</p>

                    <!-- Meta: user + timestamp -->
                    <div class="flex flex-wrap gap-x-2 items-center mt-1">
                      <span v-if="log.user_name" class="text-[10px] sm:text-xs text-gray-400 truncate max-w-[160px]">
                        <i class="fa-solid fa-user text-[9px] mr-0.5"></i>{{ log.user_name }}
                      </span>
                      <span class="text-[10px] sm:text-xs text-gray-400 tabular-nums">
                        <i class="fa-regular fa-calendar text-[9px] mr-0.5"></i>{{ formatLogDate(log.timestamp) }}
                      </span>
                    </div>

                    <!-- Status change -->
                    <div v-if="log.old_status && log.new_status && log.old_status !== log.new_status" class="mt-1.5">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full"
                        :class="getLogActionClass(log.action)">
                        {{ formatStatus(log.old_status) }}
                        <i class="fa-solid fa-arrow-right text-[8px]"></i>
                        {{ formatStatus(log.new_status) }}
                      </span>
                    </div>

                    <!-- Changes list -->
                    <ul v-if="log.metadata && log.metadata.changes" class="mt-2 space-y-1 pl-1">
                      <li v-for="change in log.metadata.changes" :key="change"
                        class="flex items-start gap-1.5 text-[10px] sm:text-xs text-gray-500">
                        <span class="flex-shrink-0 text-emerald-400 mt-px">•</span>
                        <span class="break-all">{{ change }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-else class="flex flex-col items-center gap-2 py-8 text-center">
              <i class="text-gray-300 text-xl fa-solid fa-clock-rotate-left"></i>
              <p class="text-xs text-gray-400">Sin registros de actividad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="py-8 text-center">
      <div class="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full">
        <i class="text-xl text-red-500 fa-solid fa-exclamation-triangle"></i>
      </div>
      <h3 class="mb-2 text-lg font-semibold text-gray-900">Error al cargar la reserva</h3>
      <p class="mb-4 text-gray-600">No se pudo cargar la información de la reserva.</p>
      <router-link 
        to="/mis-reservas" 
        class="inline-block px-4 py-2 font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded transition-all duration-200 hover:from-cyan-600 hover:to-blue-600"
      >
        Volver a Mis Reservas
      </router-link>
    </div>
    

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import Footer from '@/components/Footer.vue'
import { TrashIcon } from '@heroicons/vue/24/solid'
import api from '@/services/api'
import CalendarPicker from '@/ReservarForm/CalendarPicker.vue'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useVenueConfigStore } from '@/stores/venueConfig'

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const venueConfigStore = useVenueConfigStore()
venueConfigStore.fetchConfig()
// Bookings freeze the deposit minimum that applied when they were created — use that,
// not the live (possibly since-changed) venue config. Fall back to the live value only
// for legacy bookings that predate the frozen field.
const minimumDeposit = computed(() => {
  const frozen = parseFloat(event.value?.minimum_deposit)
  return frozen > 0 ? frozen : venueConfigStore.minimumDeposit
})

// Determine if the user is a staff member
const isStaff = computed(() => {
  return authStore.user?.is_staff
})

const entregadoLoading = ref(false)
const finalizarLoading = ref(false)
const quitarFinalizadoLoading = ref(false)
const showStaffMenu = ref(false)
const editingHoraEntrega = ref(false)
const horaEntregaInput = ref('')
const horaEntregaLoading = ref(false)

const saveHoraEntrega = async () => {
  if (!event.value) return
  horaEntregaLoading.value = true
  try {
    await api.patch(`/api/bookings/bookings/${event.value.id}/`, { hora_entrega: horaEntregaInput.value || null })
    await refetch()
    editingHoraEntrega.value = false
    toast.success('Hora de llegada guardada')
  } catch {
    toast.error('Error al guardar la hora')
  } finally {
    horaEntregaLoading.value = false
  }
}

const toggleEntregado = async () => {
  if (!event.value) return
  entregadoLoading.value = true
  try {
    const res = await api.post(`/api/bookings/bookings/${event.value.id}/marcar_entregado/`)
    await refetch()
    refetchLogs()
    toast.success(res.data.is_entregado ? 'Marcado como entregado' : 'Entrega removida')
  } catch {
    toast.error('Error al actualizar el estado de entrega')
  } finally {
    entregadoLoading.value = false
  }
}

const finalizarReserva = async () => {
  if (!event.value) return
  finalizarLoading.value = true
  try {
    await api.post(`/api/bookings/bookings/${event.value.id}/finalizar/`)
    await refetch()
    refetchLogs()
    toast.success('Reserva finalizada')
  } catch {
    toast.error('Error al finalizar la reserva')
  } finally {
    finalizarLoading.value = false
  }
}

const quitarFinalizado = async () => {
  if (!event.value) return
  quitarFinalizadoLoading.value = true
  try {
    await api.post(`/api/bookings/bookings/${event.value.id}/quitar_finalizado/`)
    await refetch()
    refetchLogs()
    toast.success('Finalización removida')
  } catch {
    toast.error('Error al quitar el finalizado')
  } finally {
    quitarFinalizadoLoading.value = false
  }
}

// Package price locked at booking time; falls back to live price for legacy bookings
const packageBookedPrice = computed(() => {
  if (!event.value) return 0
  const lineItem = (event.value.line_items || []).find(i => i.item_type === 'package')
  return parseFloat(lineItem?.unit_price ?? event.value.package?.price ?? 0)
})

// Local extras for deletion/swipe, each with swipe state
const localExtras = ref([])

const SWIPE_OFFSET = -80 // px, how far to snap for delete
const SWIPE_THRESHOLD = 60 // px, how far to trigger

// Fetch event as before
const { data: event, isLoading: loading, error, refetch } = useQuery({
  queryKey: ['event', route.params.id],
  queryFn: async () => {
    const response = await api.get(`/api/bookings/bookings/${route.params.id}/`)
    console.log('[Event Detail] API Response:', response.data)
    console.log('[Event Detail] Date fields:', {
      start_datetime: response.data.start_datetime,
      end_datetime: response.data.end_datetime
    })
    
    // Build a name→unit_price map from locked line items
    const lineItemPriceByName = Object.fromEntries(
      (response.data.line_items || [])
        .filter(i => i.item_type === 'extra_service')
        .map(i => [i.description, i.unit_price])
    )
    // Copy extras to localExtras for manipulation, add swipe state
    localExtras.value = Array.isArray(response.data.extra_services)
      ? response.data.extra_services.map(e => ({
          data: e,
          bookedPrice: lineItemPriceByName[e.name] ?? e.price,
          translateX: 0,
          showDelete: false,
          deleting: false,
          startX: 0,
          dragging: false
        }))
      : []
    return response.data
  },
  retry: 1,
  retryDelay: 1000,
})

// Fetch orders dynamically when event is loaded
const {
  data: ordersData,
  isLoading: ordersLoading,
  error: ordersError,
  refetch: refetchOrders
} = useQuery({
  queryKey: ['orders', () => event.value?.id],
  enabled: computed(() => !!event.value?.id),
  queryFn: async () => {
    if (!event.value?.id) return []
    const res = await api.get(`/api/store/orders/?booking_id=${event.value.id}`)
    // Support both .results and array
    return res.data.results || res.data
  }
})

const mpPaymentType = ref('card')    // 'card' | 'cash'

const MP_RATES = { instant: 0.0349, cash: 0.0379 }

// Gross-up for MP: charge = (booking_amount + 4×IVA) / (1 − rate×IVA)
// ensures net after MP fee = booking_amount
const mpTotalCharge = computed(() => {
  const amt = parseFloat(paymentAmount.value) || 0
  const rate = mpPaymentType.value === 'cash' ? MP_RATES.cash : MP_RATES.instant
  const effectiveRate = rate * 1.16
  const effectiveFixed = 4 * 1.16
  return Math.ceil((amt + effectiveFixed) / (1 - effectiveRate) * 100) / 100
})

const mpCommission = computed(() => {
  return Math.round((mpTotalCharge.value - (parseFloat(paymentAmount.value) || 0)) * 100) / 100
})

// Actual Stripe rate for this account: 4.1% + $3.00 pre-IVA, IVA 16% on the fee
// Gross-up: charge = (booking + fixed×IVA) / (1 − rate×IVA)
const stripeTotalCharge = computed(() => {
  const amt = parseFloat(paymentAmount.value) || 0
  const effectiveRate = 0.041 * 1.16
  const effectiveFixed = 3 * 1.16
  return Math.ceil((amt + effectiveFixed) / (1 - effectiveRate) * 100) / 100
})

const stripeCommission = computed(() => {
  return Math.round((stripeTotalCharge.value - (parseFloat(paymentAmount.value) || 0)) * 100) / 100
})

const allPayments = computed(() => {
  if (!ordersData.value) return []
  return ordersData.value.flatMap(o => o.payments || [])
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const getStatusClasses = (status) => {
  switch (status) {
    case 'Aprobada':
      return 'bg-green-100 text-green-700'
    case 'Pendiente':
      return 'bg-yellow-100 text-yellow-700'
    case 'Rechazada':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const daysUntilEvent = computed(() => {
  if (!event.value?.start_datetime) return 0
  const eventDate = new Date(event.value.start_datetime)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
})

const confirmCancelReservation = async () => {
  isCancelling.value = true
  try {
    await api.patch(`/api/bookings/bookings/${event.value.id}/`, {
      status: 'cancelado',
      cancellation_reason: cancellationReason.value.trim()
    })
    showCancelModal.value = false
    cancellationReason.value = ''
    await refetch()
  } catch (e) {
    console.error('Error cancelling reservation', e)
  } finally {
    isCancelling.value = false
  }
}

const isLocked = computed(() => {
  const alwaysLocked = ['cancelado', 'rechazado']
  const userLocked = ['finalizado']
  return alwaysLocked.includes(event.value?.status) ||
    (!isStaff.value && userLocked.includes(event.value?.status))
})

const openTimeEdit = () => {
  editStartTime.value = event.value?.start_datetime
    ? new Date(event.value.start_datetime).toTimeString().slice(0, 5)
    : ''
  editEndTime.value = event.value?.end_datetime
    ? new Date(event.value.end_datetime).toTimeString().slice(0, 5)
    : ''
  editingTimes.value = true
}

const saveTimeEdit = async () => {
  savingTimes.value = true
  try {
    const datePart = event.value.start_datetime
      ? event.value.start_datetime.slice(0, 10)
      : new Date().toISOString().split('T')[0]
    // End date = same day, unless end time <= start time (overnight → next day)
    let endDatePart = datePart
    if (editEndTime.value && editStartTime.value && editEndTime.value <= editStartTime.value) {
      const [y, m, d] = datePart.split('-').map(Number)
      const next = new Date(y, m - 1, d + 1)
      endDatePart = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`
    }
    await api.patch(`/api/bookings/bookings/${event.value.id}/`, {
      start_datetime: `${datePart}T${editStartTime.value}:00`,
      end_datetime: `${endDatePart}T${editEndTime.value}:00`,
    })
    editingTimes.value = false
    await refetch()
  } catch (e) {
    console.error('Error saving times', e)
  } finally {
    savingTimes.value = false
  }
}

const submitDateChange = async () => {
  dateChangeError.value = ''
  isRescheduling.value = true
  try {
    const dateStr = newEventDate.value instanceof Date
      ? newEventDate.value.toISOString().split('T')[0]
      : newEventDate.value
    const origStart = new Date(event.value.start_datetime)
    const origEnd = new Date(event.value.end_datetime)
    const durationMs = origEnd - origStart
    const originalStartTime = origStart.toTimeString().slice(0, 5)
    const newStart = new Date(`${dateStr}T${originalStartTime}:00`)
    const newEnd = new Date(newStart.getTime() + durationMs)
    // If end crosses midnight, the date part will be the next day — keep the time
    const newEndDateStr = newEnd.toISOString().split('T')[0]
    const newEndTime = newEnd.toTimeString().slice(0, 5)
    await api.patch(`/api/bookings/bookings/${event.value.id}/`, {
      start_datetime: `${dateStr}T${originalStartTime}:00`,
      end_datetime: `${newEndDateStr}T${newEndTime}:00`
    })
    showDateChangeModal.value = false
    newEventDate.value = null
    await refetch()
  } catch (e) {
    const msg = e?.response?.data?.start_datetime
    dateChangeError.value = Array.isArray(msg) ? msg[0] : (msg || 'Error al cambiar la fecha. Intenta de nuevo.')
  } finally {
    isRescheduling.value = false
  }
}

const steps = [
  {
    key: 'solicitud',
    label: 'Solicitud',
    icon: 'fa-regular fa-file-lines',
    description: 'Tu solicitud ha sido enviada y está siendo revisada'
  },
  {
    key: 'aceptacion',
    label: 'Aceptación',
    icon: 'fa-solid fa-user-check',
    description: 'Tu reserva ha sido aceptada, puedes proceder con el apartado'
  },
  {
    key: 'apartado',
    label: 'Apartado',
    icon: 'fa-solid fa-calendar-plus',
    description: 'Se ha realizado el apartado, faltan los pagos restantes'
  },
  {
    key: 'liquidado',
    label: 'Liquidado',
    icon: 'fa-solid fa-money-bill-wave',
    description: 'Pago completo realizado, tu evento está saldado'
  },
  {
    key: 'finalizado',
    label: 'Finalizado',
    icon: 'fa-regular fa-star',
    description: 'Evento completado, puedes dejar tu reseña'
  }
]

const entregadoStep = {
  key: 'entregado',
  label: 'Entregado',
  icon: 'fa-solid fa-door-open',
  description: 'El lugar ha sido entregado para el evento'
}

// Default: entregado sits after liquidado. When marked, it's inserted after the status stored in entregado_after_status.
const visibleSteps = computed(() => {
  const defaultIdx = steps.findIndex(s => s.key === 'liquidado')
  const anchorKey = event.value?.entregado_after_status
  const anchorIdx = anchorKey ? steps.findIndex(s => s.key === anchorKey) : -1
  // use the stored anchor if valid and not the last step; otherwise default to after liquidado
  const insertAfter = anchorIdx >= 0 && anchorIdx < steps.length - 1 ? anchorIdx : defaultIdx
  return [...steps.slice(0, insertAfter + 1), entregadoStep, ...steps.slice(insertAfter + 1)]
})

const terminalStatuses = ['rechazado', 'cancelado']

// Returns -1 for terminal states; uses visibleSteps for correct index
const getCurrentStepIndex = (status, isEntregado = false) => {
  const stepsToUse = visibleSteps.value
  if (terminalStatuses.includes(status)) return -1
  if (status === 'finalizado') return stepsToUse.findIndex(s => s.key === 'finalizado')
  if (isEntregado || status === 'liquidado_entregado' || status === 'entregado') {
    const idx = stepsToUse.findIndex(s => s.key === 'entregado')
    return idx >= 0 ? idx : stepsToUse.findIndex(s => s.key === 'liquidado')
  }
  const stepIndex = stepsToUse.findIndex(step => step.key === status)
  return stepIndex >= 0 ? stepIndex : 0
}

// Function to get step icon based on status and position
const getStepIcon = (stepIndex, currentStepIndex) => {
  const step = steps[stepIndex]
  
  // If this step is completed (before current step)
  if (stepIndex < currentStepIndex) {
    return 'fa-solid fa-check-circle'
  }
  // If this is the current step
  else if (stepIndex === currentStepIndex) {
    return step.icon
  }
  // If this step is pending (after current step)
  else {
    return 'fa-regular fa-circle'
  }
}

const statusBadge = (statusKey) => {
  switch (statusKey) {
    case 'solicitud': return 'bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-bold'
    case 'rechazado': return 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold'
    case 'aceptacion': return 'bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold'
    case 'apartado': return 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold'
    case 'liquidado': return 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold'
    case 'entregado': return 'bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full text-xs font-bold'
    case 'finalizado': return 'bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold'
    default: return 'bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-bold'
  }
}

const getDayOfWeek = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('es-ES', { weekday: 'long' })
  } catch (e) {
    console.error('[Event Detail] Day of week parsing error:', e, dateString)
    return ''
  }
}

function onTouchStart(i, e) {
  const touch = e.touches ? e.touches[0] : e
  localExtras.value[i].startX = touch.clientX
  localExtras.value[i].dragging = true
}
function onTouchMove(i, e) {
  if (!localExtras.value[i].dragging) return
  const touch = e.touches ? e.touches[0] : e
  let dx = touch.clientX - localExtras.value[i].startX
  // If already showing delete, allow only further left
  if (localExtras.value[i].showDelete) dx += SWIPE_OFFSET
  if (dx < SWIPE_OFFSET) dx = SWIPE_OFFSET
  if (dx > 0) dx = 0
  localExtras.value[i].translateX = dx
}
function onTouchEnd(i) {
  const extra = localExtras.value[i]
  extra.dragging = false
  // If not showing delete, check for first swipe
  if (!extra.showDelete) {
    if (extra.translateX < -SWIPE_THRESHOLD) {
      // Close all others
      localExtras.value.forEach((ex, idx) => {
        if (idx !== i) {
          ex.showDelete = false;
          ex.translateX = 0;
        }
      });
      extra.translateX = SWIPE_OFFSET
      extra.showDelete = true
    } else {
      extra.translateX = 0
    }
  } else {
    // If already showing delete, check for second swipe
    if (extra.translateX < SWIPE_OFFSET - SWIPE_THRESHOLD) {
      // Animate out and delete
      extra.translateX = -500
      extra.deleting = true
      setTimeout(() => {
        localExtras.value.splice(i, 1)
      }, 300)
    } else if (extra.translateX > SWIPE_OFFSET + SWIPE_THRESHOLD) {
      // Swiped right, snap back
      extra.translateX = 0
      extra.showDelete = false
    } else {
      // Snap to delete position
      extra.translateX = SWIPE_OFFSET
    }
  }
}
function onMouseDown(i, e) {
  e.preventDefault()
  onTouchStart(i, e)
  const move = ev => onTouchMove(i, ev)
  const up = () => {
    onTouchEnd(i)
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}
function removeExtra(i) {
  const extraToRemove = localExtras.value[i]
  console.log('Removing extra:', extraToRemove)
  
  // Animate out
  localExtras.value[i].translateX = -500
  localExtras.value[i].deleting = true
  
  // Remove from backend
  const removeExtraFromBackend = async () => {
    try {
      // Get current extras without the one being removed
      const currentExtras = localExtras.value
        .filter((_, index) => index !== i)
        .map(extra => extra.data.id || extra.data.service_id)
      
      console.log('Updating extras after removal:', currentExtras)
      
      const response = await api.patch(`/api/bookings/bookings/${event.value.id}/`, { 
        extra_service_ids: currentExtras
      })
      console.log('Backend response after removing extra:', response)
      
      // Refetch to get updated data
      await refetch()
      
      toast.success('Extra eliminado con éxito')
      
    } catch (error) {
      console.error('Error removing extra from backend:', error)
      // If backend fails, revert the UI change
      localExtras.value[i].translateX = 0
      localExtras.value[i].deleting = false
      alert('Error al eliminar el extra')
    }
  }
  
  // Call backend after animation starts
  setTimeout(() => {
    removeExtraFromBackend()
  }, 100)
  
  // Remove from UI after animation
  setTimeout(() => {
    localExtras.value.splice(i, 1)
  }, 320)
}

function triggerShowDelete(i) {
  // Close all others
  localExtras.value.forEach((ex, idx) => {
    if (idx !== i) {
      ex.showDelete = false;
      ex.translateX = 0;
    }
  });
  localExtras.value[i].showDelete = true
  localExtras.value[i].translateX = SWIPE_OFFSET
}

const showAddExtra = ref(false)
const availableExtras = ref([])
const extrasLoading = ref(true)

// Load extras from API
async function loadExtras() {
  extrasLoading.value = true
  try {
    const response = await api.get('/api/bookings/extras/')
    console.log('Extras loaded from API:', response.data)
    availableExtras.value = response.data.results || response.data
  } catch (err) {
    console.error('Error loading extras from API:', err)
    // Fallback to sample data
    availableExtras.value = [
      { id: 1, name: 'DJ', price: 500 },
      { id: 2, name: 'Fotografía', price: 500 },
      { id: 3, name: 'Iluminación', price: 700 },
      { id: 4, name: 'Decoración', price: 600 }
    ]
  } finally {
    extrasLoading.value = false
  }
}

function addExtra(option) {
  localExtras.value.push({
    data: { ...option },
    translateX: 0,
    showDelete: false,
    deleting: false,
    startX: 0,
    dragging: false
  })
  showAddExtra.value = false
}

const availablePackages = ref([])
const packagesLoading = ref(true)
const packagesError = ref(null)

function updatePackageByPeople() {
  if (!event.value || typeof event.value.people !== 'number' || !availablePackages.value.length) return;
  // Sort by minPeople descending, pick first where people >= minPeople
  const sorted = [...availablePackages.value].sort((a, b) => b.minPeople - a.minPeople)
  const personas = event.value.people || 0
  const pkg = sorted.find(p => personas >= p.minPeople) || availablePackages.value[0]
  event.value.package = pkg.name
  event.value.packagePrice = pkg.price
}
function changePeople(delta) {
  if (!event.value) return;
  const newValue = Math.max(0, (event.value.people || 0) + delta)
  event.value.people = newValue
  updatePackageByPeople()
}

onMounted(() => {
  packagesLoading.value = true
  console.log('Loading packages...')
  
  // Try to load from API first
  api.get('/api/bookings/packages/?limit=10')
    .then(res => {
      console.log('Packages loaded from API:', res.data)
      availablePackages.value = res.data.results || res.data
      packagesError.value = null
    })
    .catch(err => {
      console.error('Error loading packages from API:', err)
      packagesError.value = err
      // Fallback to sample data if API fails
      availablePackages.value = [
        { id: 1, title: 'Paquete Básico', n_people: 20, price: 2000, description: 'Ideal para eventos pequeños', icon: 'mdi:account-group' },
        { id: 2, title: 'Paquete Estándar', n_people: 50, price: 3500, description: 'Perfecto para eventos medianos', icon: 'mdi:account-multiple' },
        { id: 3, title: 'Paquete Premium', n_people: 100, price: 5000, description: 'Para eventos grandes y especiales', icon: 'mdi:star' }
      ]
    })
    .finally(() => {
      packagesLoading.value = false
      console.log('Final availablePackages:', availablePackages.value)
    })

  loadExtras() // Load extras on mount

  // Poll for Stripe webhook to land after returning from checkout.
  // Stripe appends ?session_id=cs_... to the success_url; some configs use ?stripe=1.
  if (route.query.session_id || route.query.stripe) {
    let tries = 0
    let prevDue = null
    const pollStripe = setInterval(async () => {
      const result = await refetchOrders()
      const order = result.data?.[0] ?? null
      const due = order ? parseFloat(order.amount_due) : null
      if (prevDue === null) {
        prevDue = due
      } else if (due !== null && (due < prevDue || order?.status === 'paid')) {
        clearInterval(pollStripe)
        return
      }
      if (++tries >= 8) clearInterval(pollStripe)
    }, 2000)
  }
})



// Add these helper functions in <script setup>
const formatDateLong = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    // Example: 7 de noviembre de 2023
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch (e) {
    return ''
  }
}
const formatTime12 = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    // Example: 12:30 AM
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  } catch (e) {
    return ''
  }
}

const showPackageModal = ref(false)
const selectedPackageId = ref(null)

// User picker (staff)
const showUserPickerModal = ref(false)
const userPickerQuery = ref('')
const userPickerResults = ref([])
const userPickerLoading = ref(false)
const pickedUser = ref(null)
const savingUser = ref(false)
let userSearchTimer = null

function openUserPicker() {
  pickedUser.value = null
  userPickerQuery.value = ''
  userPickerResults.value = []
  showUserPickerModal.value = true
  searchUsers()
}

async function searchUsers() {
  clearTimeout(userSearchTimer)
  userSearchTimer = setTimeout(async () => {
    userPickerLoading.value = true
    try {
      const res = await api.get('/api/users/list/', { params: { q: userPickerQuery.value } })
      userPickerResults.value = res.data
    } catch (e) {
      console.error(e)
    } finally {
      userPickerLoading.value = false
    }
  }, 250)
}

function selectUser(u) {
  pickedUser.value = u
}

async function saveUserChange() {
  if (!pickedUser.value) return
  savingUser.value = true
  try {
    const res = await api.patch(`/api/bookings/bookings/${event.value.id}/`, { user_id: pickedUser.value.id })
    event.value.user = pickedUser.value
    showUserPickerModal.value = false
  } catch (e) {
    console.error(e)
  } finally {
    savingUser.value = false
  }
}

// Extras modal variables
const showExtrasModal = ref(false)
const selectedExtras = ref([])
const showCustomChargeModal = ref(false)
const customChargeDescription = ref('')
const customChargePrice = ref('')
const isAddingCustomCharge = ref(false)
const removingChargeId = ref(null)

async function addCustomCharge() {
  if (!customChargeDescription.value.trim() || !customChargePrice.value) return
  isAddingCustomCharge.value = true
  try {
    await api.post(`/api/bookings/bookings/${event.value.id}/add_custom_charge/`, {
      description: customChargeDescription.value.trim(),
      price: parseFloat(customChargePrice.value),
    })
    showCustomChargeModal.value = false
    customChargeDescription.value = ''
    customChargePrice.value = ''
    toast.success('Cargo agregado.')
    await refetch()
  } catch (e) {
    toast.error(e?.response?.data?.detail || 'Error al agregar cargo.')
  } finally {
    isAddingCustomCharge.value = false
  }
}

async function removeCustomCharge(lineItemId) {
  removingChargeId.value = lineItemId
  try {
    await api.delete(`/api/bookings/bookings/${event.value.id}/remove_custom_charge/${lineItemId}/`)
    toast.success('Cargo eliminado.')
    await refetch()
  } catch (e) {
    toast.error(e?.response?.data?.detail || 'Error al eliminar cargo.')
  } finally {
    removingChargeId.value = null
  }
}

// ── Discount modal ─────────────────────────────────────────────────────────
const showDiscountModal = ref(false)
const discountTab = ref('coupon')
const discountCode = ref('')
const couponPreview = ref(null)
const couponError = ref(null)
const validatingCoupon = ref(false)
const discountDescription = ref('')
const discountAmount = ref('')
const applyingDiscount = ref(false)
const removingDiscountId = ref(null)

function openDiscountModal() {
  discountTab.value = 'coupon'
  discountCode.value = ''
  couponPreview.value = null
  couponError.value = null
  discountDescription.value = ''
  discountAmount.value = ''
  showDiscountModal.value = true
}

function closeDiscountModal() {
  showDiscountModal.value = false
}

async function validateCoupon() {
  if (!discountCode.value.trim()) return
  validatingCoupon.value = true
  couponPreview.value = null
  couponError.value = null
  try {
    const res = await api.post(`/api/bookings/bookings/${event.value.id}/validate_coupon/`, { code: discountCode.value.trim() })
    couponPreview.value = res.data
  } catch (e) {
    couponError.value = e?.response?.data?.detail || 'Cupón no válido.'
  } finally {
    validatingCoupon.value = false
  }
}

async function applyCoupon() {
  if (!couponPreview.value) return
  applyingDiscount.value = true
  const code = couponPreview.value.code
  try {
    await api.post(`/api/bookings/bookings/${event.value.id}/apply_coupon/`, { code: discountCode.value.trim() })
    closeDiscountModal()
    toast.success(`Cupón ${code} aplicado.`)
    await refetch()
  } catch (e) {
    toast.error(e?.response?.data?.detail || 'Error al aplicar cupón.')
  } finally {
    applyingDiscount.value = false
  }
}

async function applyManualDiscount() {
  if (!discountDescription.value.trim() || !discountAmount.value) return
  applyingDiscount.value = true
  try {
    await api.post(`/api/bookings/bookings/${event.value.id}/add_discount/`, {
      description: discountDescription.value.trim(),
      amount: parseFloat(discountAmount.value),
    })
    closeDiscountModal()
    toast.success('Descuento aplicado.')
    await refetch()
  } catch (e) {
    toast.error(e?.response?.data?.detail || 'Error al aplicar descuento.')
  } finally {
    applyingDiscount.value = false
  }
}

async function removeDiscount(lineItemId) {
  removingDiscountId.value = lineItemId
  try {
    await api.delete(`/api/bookings/bookings/${event.value.id}/remove_discount/${lineItemId}/`)
    toast.success('Descuento eliminado.')
    await refetch()
  } catch (e) {
    toast.error(e?.response?.data?.detail || 'Error al eliminar descuento.')
  } finally {
    removingDiscountId.value = null
  }
}

// Transfer accordion variables
const showTransferAccordion = ref(false)
const uploadedFile = ref(null)
const isSubmittingTransfer = ref(false)
const showFullDescription = ref(false)

// Transfer accordion toggle function
function toggleTransferAccordion() {
  console.log('Toggle accordion clicked, current state:', showTransferAccordion.value)
  showTransferAccordion.value = !showTransferAccordion.value
  console.log('New state:', showTransferAccordion.value)
}

// Function to toggle extra selection
function toggleExtra(extra) {
  const index = selectedExtras.value.findIndex(e => e.id === extra.id)
  if (index > -1) {
    selectedExtras.value.splice(index, 1)
  } else {
    selectedExtras.value.push(extra)
  }
}

// Function to check if extra is selected
function isExtraSelected(extra) {
  return selectedExtras.value.some(e => e.id === extra.id)
}

// Function to remove selected extra
function removeSelectedExtra(extra) {
  const index = selectedExtras.value.findIndex(e => e.id === extra.id)
  if (index > -1) {
    selectedExtras.value.splice(index, 1)
  }
}

// Function to save extras changes
async function saveExtrasChange() {
  console.log('saveExtrasChange called')
  console.log('selectedExtras:', selectedExtras.value)
  console.log('event.value:', event.value)
  
  try {
    console.log('Updating extras to:', selectedExtras.value)
    
    // Convert selected extras to IDs (assuming extras have IDs)
    const extraServiceIds = selectedExtras.value.map(extra => extra.id || extra.service_id)
    console.log('extraServiceIds:', extraServiceIds)
    
    const response = await api.patch(`/api/bookings/bookings/${event.value.id}/`, { 
      extra_service_ids: extraServiceIds
    })
    console.log('API response:', response)
    
    // Refetch the event data to get the updated state
    await refetch()
    
    showExtrasModal.value = false
    console.log('Extras updated successfully')
    toast.success('Extras actualizados con éxito')
  } catch (e) {
    console.error('Error updating extras:', e)
    alert('Error al actualizar los extras')
  }
}

// Save handler
async function savePackageChange() {
  console.log('savePackageChange called')
  console.log('selectedPackageId:', selectedPackageId.value)
  console.log('event.value:', event.value)
  console.log('event.value.package:', event.value?.package)
  
  if (!selectedPackageId.value || !event.value || selectedPackageId.value === (event.value.package && event.value.package.id)) {
    console.log('Early return - conditions not met')
    return
  }
  
  try {
    console.log('Updating package to:', selectedPackageId.value)
    const response = await api.patch(`/api/bookings/bookings/${event.value.id}/`, { 
      package_id: selectedPackageId.value 
    })
    console.log('API response:', response)
    
    // Refetch the event data to get the updated state
    await refetch()
    
    showPackageModal.value = false
    console.log('Package updated successfully')
    toast.success('Paquete actualizado con éxito')
  } catch (e) {
    console.error('Error updating package:', e)
    alert('Error al actualizar el paquete')
  }
}

// When opening modal, set selectedPackageId to current package id
watch(showPackageModal, (val) => {
  if (val) {
    // Use real packages from the event if available
    if (event.value && event.value.available_packages && event.value.available_packages.length > 0) {
      console.log('Using real packages from event:', event.value.available_packages)
      availablePackages.value = event.value.available_packages
    } else if (availablePackages.value.length === 0) {
      console.log('No packages loaded, loading sample data...')
      availablePackages.value = [
        { id: 1, title: 'Paquete Básico', n_people: 20, price: 2000, description: 'Ideal para eventos pequeños', icon: 'mdi:account-group' },
        { id: 2, title: 'Paquete Estándar', n_people: 50, price: 3500, description: 'Perfecto para eventos medianos', icon: 'mdi:account-multiple' },
        { id: 3, title: 'Paquete Premium', n_people: 100, price: 5000, description: 'Para eventos grandes y especiales', icon: 'mdi:star' }
      ]
    }
    
    if (event.value && event.value.package) {
      selectedPackageId.value = event.value.package.id
      console.log('Modal opened, selectedPackageId:', selectedPackageId.value)
    }
  }
})

// When opening extras modal, initialize selected extras
watch(showExtrasModal, (val) => {
  if (val) {
    // Initialize selected extras from current localExtras
    selectedExtras.value = localExtras.value.map(extra => extra.data)
    console.log('Extras modal opened, selected extras:', selectedExtras.value)
  }
})

// Watch for changes in event.extra_services and sync localExtras
watch(() => event.value?.extra_services, (newExtras) => {
  if (newExtras && Array.isArray(newExtras)) {
    const lineItemPriceByName = Object.fromEntries(
      (event.value?.line_items || [])
        .filter(i => i.item_type === 'extra_service')
        .map(i => [i.description, i.unit_price])
    )
    localExtras.value = newExtras.map(e => ({
      data: e,
      bookedPrice: lineItemPriceByName[e.name] ?? e.price,
      translateX: 0,
      showDelete: false,
      deleting: false,
      startX: 0,
      dragging: false
    }))
    console.log('Synced localExtras from event:', localExtras.value)
  }
}, { deep: true })

const isPaying = ref(false)

const paymentAmount = ref('')
const expandedPaymentId = ref(null)
const togglePaymentDetail = (id) => { expandedPaymentId.value = expandedPaymentId.value === id ? null : id }
const approvingPaymentId = ref(null)
const deletingPaymentId = ref(null)

async function deletePayment(paymentId) {
  if (!confirm('¿Eliminar este pago? Esta acción no se puede deshacer.')) return
  deletingPaymentId.value = paymentId
  try {
    await api.delete(`/api/store/payments/${paymentId}/`)
    toast.success('Pago eliminado.')
    await Promise.all([refetch(), refetchOrders(), refetchLogs()])
  } catch (e) {
    const msg = e?.response?.data?.detail || 'Error al eliminar el pago.'
    toast.error(msg)
  } finally {
    deletingPaymentId.value = null
  }
}

async function approvePayment(paymentId) {
  approvingPaymentId.value = paymentId
  try {
    await api.post(`/api/store/payments/${paymentId}/approve/`)
    toast.success('Pago aprobado.')
    await refetchOrders()
  } catch (e) {
    const msg = e?.response?.data?.detail || 'Error al aprobar el pago.'
    toast.error(msg)
  } finally {
    approvingPaymentId.value = null
  }
}

// Auto-fill the minimum deposit when booking loads with no advance paid yet
watch(event, (val) => {
  if (!val || paymentAmount.value) return
  const paid = parseFloat(val.advance_paid) || 0
  if (paid === 0) paymentAmount.value = String(minimumDeposit.value)
}, { immediate: true })

const mpPreferenceId = ref(null)
const mpPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY
let walletBrickController = null

function mpWait(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function waitForMpSDK(maxMs = 8000) {
  let elapsed = 0
  while (!window.MercadoPago && elapsed < maxMs) {
    await mpWait(200)
    elapsed += 200
  }
  return !!window.MercadoPago
}

watch(mpPreferenceId, async (newId) => {
  if (walletBrickController) {
    try { walletBrickController.unmount() } catch {}
    walletBrickController = null
  }
  if (!newId) return

  const ready = await waitForMpSDK()
  if (!ready) { console.error('[MP] SDK not loaded'); return }

  // Poll until the container div is in the real DOM
  let container = null
  for (let i = 0; i < 60; i++) {
    container = document.getElementById('walletBrick_container')
    if (container) break
    await mpWait(50)
  }
  if (!container) { console.error('[MP] container not found'); return }

  await mpWait(150)

  try {
    const mp = new window.MercadoPago(mpPublicKey)
    const bricksBuilder = mp.bricks()
    walletBrickController = await bricksBuilder.create('wallet', 'walletBrick_container', {
      initialization: { preferenceId: newId }
    })
  } catch (err) {
    console.error('[MP] brick creation failed:', err)
  }
})

function resetMpBrick() {
  if (walletBrickController) {
    try { walletBrickController.unmount() } catch {}
    walletBrickController = null
  }
  mpPreferenceId.value = null
}

// Watch paymentAmount to limit it to remainingAmount and reset MP preference
watch(paymentAmount, (newValue) => {
  if (newValue && parseFloat(newValue) > remainingAmount.value) {
    paymentAmount.value = remainingAmount.value.toString()
  }
  resetMpBrick()
})

// Add computed for remaining amount
const remainingAmount = computed(() => {
  const total = parseFloat(event.value?.total_price) || 0
  const paid = parseFloat(event.value?.advance_paid) || 0
  const remaining = Math.max(0, total - paid)
  
  // If no advance payment has been made, minimum payment is the configured deposit
  if (paid === 0 && remaining > 0) {
    return Math.max(minimumDeposit.value, remaining)
  }
  
  return remaining
})

async function pagar(amount = paymentAmount.value) {
  isPaying.value = true
  try {
    const maxAmount = remainingAmount.value
    // Use the passed amount, but clamp to max
    const amountToPay = Math.min(parseFloat(amount) || 0, maxAmount)
    
    if (amountToPay <= 0) {
      toast.error('No hay monto pendiente por pagar')
      return
    }

    const res = await api.post('/api/store/orders/create_and_initiate/', {
      booking_id: event.value.id,
      amount: amountToPay,
      gateway: 'stripe'
    })
    
    if (res.data.payment_url) {
      window.location.href = res.data.payment_url
    } else {
      toast.error('No se pudo iniciar el pago')
    }
  } catch (e) {
    console.error('Error al iniciar pago:', e)
    toast.error('Error al iniciar el pago')
  } finally {
    isPaying.value = false
  }
}

async function pagarMercadoPago(amount = paymentAmount.value) {
  isPaying.value = true
  try {
    const amountToPay = Math.min(parseFloat(amount) || 0, remainingAmount.value)

    if (amountToPay <= 0) {
      toast.error('No hay monto pendiente por pagar')
      return
    }

    const res = await api.post('/api/store/orders/create_and_initiate/', {
      booking_id: event.value.id,
      amount: amountToPay,
      gateway: 'mercadopago',
      mp_release_time: 'instant',
      mp_payment_type: mpPaymentType.value,
    })

    if (res.data.preference_id) {
      mpPreferenceId.value = res.data.preference_id
    } else if (res.data.payment_url) {
      window.location.href = res.data.payment_url
    } else {
      toast.error('No se pudo iniciar el pago con MercadoPago')
    }
  } catch (e) {
    console.error('Error al iniciar pago con MercadoPago:', e)
    const msg = e.response?.data?.error || e.response?.data?.detail
    toast.error(msg || 'Error al iniciar el pago con MercadoPago')
  } finally {
    isPaying.value = false
  }
}

// Helper functions for orders/payments section
const formatOrderDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric' })
  } catch (e) {
    return ''
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'text-yellow-700'
    case 'paid': return 'text-green-700'
    case 'failed': return 'text-red-700'
    case 'refunded': return 'text-gray-700'
    default: return 'text-gray-700'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Pendiente'
    case 'paid': return 'Pagado'
    case 'failed': return 'Fallido'
    case 'refunded': return 'Reembolsado'
    default: return status
  }
}

const getPaymentIcon = (gateway) => {
  switch (gateway) {
    case 'stripe': return 'fa-brands fa-stripe'
    case 'mercadopago': return 'fa-brands fa-cc-mastercard' // MercadoPago uses Mastercard icon
    case 'bank_transfer': return 'fa-solid fa-money-bill-transfer'
    default: return 'fa-solid fa-credit-card'
  }
}

const getPaymentIconClass = (gateway, status) => {
  let baseClass = 'bg-gray-100 text-gray-600'
  if (status === 'paid') {
    baseClass = 'bg-green-100 text-green-700'
  } else if (status === 'failed' || status === 'refunded') {
    baseClass = 'bg-red-100 text-red-700'
  }

  switch (gateway) {
    case 'stripe': return `${baseClass} text-blue-600`
    case 'mercadopago': return `${baseClass} text-purple-600`
    case 'bank_transfer': return `${baseClass} text-indigo-600`
    default: return baseClass
  }
}

const getPaymentMethodText = (method) => {
  switch (method) {
    case 'card': return 'Tarjeta'
    case 'transfer': return 'Transferencia Bancaria'
    case 'cash': return 'Efectivo'
    case 'bank_slip': return 'Boleta de Banco'
    default: return method
  }
}

const getGatewayText = (gateway) => {
  switch (gateway) {
    case 'stripe': return 'Stripe'
    case 'mercadopago': return 'MercadoPago'
    case 'transfer': return 'Transferencia Bancaria'
    default: return gateway
  }
}

const formatPaymentTime = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleTimeString('es-ES', { hour: 'numeric', minute: 'numeric' })
  } catch (e) {
    return ''
  }
}

const formatPaymentDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric' })
  } catch (e) {
    return ''
  }
}

const getPaymentStatusClass = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'failed': return 'bg-red-100 text-red-800'
    case 'refunded': return 'bg-gray-100 text-gray-800'
    default: return 'bg-yellow-100 text-yellow-800'
  }
}

const getPaymentStatusText = (status) => {
  switch (status) {
    case 'paid': return 'Pagado'
    case 'failed': return 'Fallido'
    case 'refunded': return 'Reembolsado'
    default: return 'Pendiente'
  }
}

// Transfer payment functions
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // Only accept image files
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    toast.error('Solo se permiten archivos de imagen (PNG, JPG, JPEG, GIF, WebP)')
    return
  }

  // Check file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    toast.error('El archivo es demasiado grande. Máximo 10MB')
    return
  }

  uploadedFile.value = file
  console.log('File selected:', file.name, file.type, file.size)
}

function removeFile() {
  uploadedFile.value = null
  if (this.$refs.fileInput) {
    this.$refs.fileInput.value = ''
  }
}

// Copy to clipboard function
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copiado al portapapeles')
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    toast.success('Copiado al portapapeles')
  }
}

function copyClabe() {
  copyToClipboard('012320015086504005')
}

function copyCardNumber() {
  copyToClipboard('4152314441724641')
}

async function submitTransferPayment() {
  if (!uploadedFile.value) {
    toast.error('Por favor selecciona un comprobante de pago')
    return
  }

  if (!event.value?.id) {
    toast.error('No se pudo identificar la reserva')
    return
  }

  isSubmittingTransfer.value = true

  try {
    // Convert the file to base64
    const base64String = await fileToBase64(uploadedFile.value)
    
    const orderData = {
      booking_id: event.value.id,
      amount: parseFloat(transferAmount.value) || 0,
      gateway: 'transfer',
      payment_photo_base64: base64String // Send the base64 encoded image
    }

    console.log('Sending transfer payment with base64 image:', {
      ...orderData,
      payment_photo_base64: base64String.substring(0, 100) + '...' // Log first 100 chars
    })

    const response = await api.post('/api/store/orders/create_and_initiate/', orderData)

    if (response.status >= 200 && response.status < 300) {
      toast.success(isStaff.value
        ? '✅ Transferencia registrada y confirmada.'
        : '¡Pago por transferencia enviado! Se procesará en breve.'
      )
      
      // Reset form
      uploadedFile.value = null
      showTransferAccordion.value = false
      
      // Refresh orders to show the new payment
      await refetchOrders()
    } else {
      throw new Error('Unexpected response status')
    }
  } catch (error) {
    console.error('Error submitting transfer payment:', error)
    toast.error('Error al enviar el pago por transferencia. Intenta de nuevo.')
  } finally {
    isSubmittingTransfer.value = false
  }
}

// Watch for transfer modal to sync amount
watch(showTransferAccordion, (val) => {
  if (val) {
    transferAmount.value = paymentAmount.value
  }
})

// Modal variables
const showPaymentModal = ref(false)
const showTransferModal = ref(false)
const showRejectModal = ref(false)
const showCancelModal = ref(false)
const isCancelling = ref(false)
const cancellationReason = ref('')
const showDateChangeModal = ref(false)
const isRescheduling = ref(false)
const newEventDate = ref(null)
const newEventTime = ref('')
const dateChangeError = ref('')
const editingTimes = ref(false)
const editStartTime = ref('')
const editEndTime = ref('')
const savingTimes = ref(false)

const editingDescription = ref(false)
const editDescriptionValue = ref('')
const savingDescription = ref(false)

async function saveDescription() {
  savingDescription.value = true
  try {
    const wasGCal = event.value.description?.startsWith('[GCal]\n')
    const toSave = wasGCal ? `[GCal]\n${editDescriptionValue.value}` : editDescriptionValue.value
    await api.patch(`/api/bookings/bookings/${event.value.id}/`, { description: toSave })
    event.value.description = toSave
    editingDescription.value = false
  } catch (e) {
    console.error(e)
  } finally {
    savingDescription.value = false
  }
}

const transferAmount = ref('')
const transferDepositMethod = ref('spei') // 'spei' | 'oxxo'

// Watch transferAmount to limit it to remainingAmount
watch(transferAmount, (newValue) => {
  if (newValue && parseFloat(newValue) > remainingAmount.value) {
    transferAmount.value = remainingAmount.value.toString()
  }
})

const rejectReason = ref('')
const isSubmitting = ref(false)

// Payment method selection
const selectedPaymentMethod = ref('')

// Function for cash payment contact
const contactForCashPayment = () => {
  toast.info('Redirigiendo para coordinar pago en efectivo...')
  console.log('Contact for cash payment:', paymentAmount.value)
}

const cashAmount = ref('')
const isRegisteringCash = ref(false)

async function registerCashPayment() {
  const amount = parseFloat(cashAmount.value)
  if (!amount || amount <= 0) {
    toast.error('Ingresa un monto válido.')
    return
  }
  isRegisteringCash.value = true
  try {
    await api.post('/api/store/orders/register_cash_payment/', {
      booking_id: event.value.id,
      amount
    })
    toast.success('Pago en efectivo registrado.')
    cashAmount.value = ''
    refetch()
    refetchOrders()
    refetchLogs()
  } catch (err) {
    toast.error(err?.response?.data?.detail || 'Error al registrar el pago.')
  } finally {
    isRegisteringCash.value = false
  }
}

const reviewRating = ref(0)
// const reviewText = ref('')
const submittingReview = ref(false)
const reviewSuccess = ref(false)

function submitReview() {
  submittingReview.value = true
  reviewSuccess.value = false
  // Add your review submission logic here
  console.log('Submitting review:', { rating: reviewRating.value, text: reviewText.value })
  // Simulate a delay for the review submission
  setTimeout(() => {
    submittingReview.value = false
    reviewSuccess.value = true
    reviewRating.value = 0
    reviewText.value = ''
  }, 1000)
}

// Review state
const rating = ref(0)
const reviewText = ref('')
const savingReview = ref(false)
const editingReview = ref(false)

// Fetch my review for this booking (returns null if none)
const { data: myReview, isLoading: reviewLoading, refetch: refetchReview } = useQuery({
  queryKey: ['myReview', () => event.value?.id],
  enabled: computed(() => !!event.value?.id),
  queryFn: async () => {
    if (!event.value?.id) return null
    try {
      const res = await api.get(`/api/bookings/reviews/me-by-booking/${event.value.id}/`)
      // Initialize form values from existing review
      if (res?.data) {
        rating.value = Number(res.data.rating || 0)
        reviewText.value = res.data.review || ''
      }
      return res.data
    } catch (e) {
      if (e?.response?.status === 404) {
        rating.value = 0
        reviewText.value = ''
        return null
      }
      throw e
    }
  },
  retry: false
})

function resetReviewForm() {
  if (myReview?.value) {
    rating.value = Number(myReview.value.rating || 0)
    reviewText.value = myReview.value.review || ''
  } else {
    rating.value = 0
    reviewText.value = ''
  }
}

async function saveReview() {
  if (!event.value?.id) return
  if (!rating.value) {
    toast.error('Selecciona una calificación')
    return
  }
  savingReview.value = true
  try {
    await api.put(`/api/bookings/reviews/me-by-booking/${event.value.id}/`, {
      rating: Number(rating.value),
      review: reviewText.value?.trim() || ''
    })
    toast.success('¡Gracias por tu reseña!')
    editingReview.value = false
    await refetchReview()
  } catch (e) {
    console.error('Error guardando reseña', e)
    toast.error('No se pudo guardar la reseña')
  } finally {
    savingReview.value = false
  }
}

// Check if there are payments with photos to auto-open accordion
const hasPaymentWithPhoto = computed(() => {
  if (!ordersData.value || !Array.isArray(ordersData.value)) return false
  
  return ordersData.value.some(order => {
    if (!order || !order.payments || !Array.isArray(order.payments)) return false
    
    return order.payments.some(payment => {
      if (!payment) return false
      // Check if we have actual photo data (not empty strings)
      const hasPhoto = payment.payment_photo && payment.payment_photo.trim() !== ''
      const hasBase64 = payment.payment_photo_base64 && payment.payment_photo_base64.trim() !== ''
      return hasPhoto || hasBase64
    })
  })
})

// Auto-open accordion if there are payments with photos
watch(hasPaymentWithPhoto, (hasPhoto) => {
  if (hasPhoto && !showTransferAccordion.value) {
    showTransferAccordion.value = true
  }
}, { immediate: true })

// Photo modal state
const showPhotoModal = ref(false)
const selectedPhoto = ref('')

function openPhotoModal(photoUrl) {
  selectedPhoto.value = photoUrl
  showPhotoModal.value = true
}

function closePhotoModal() {
  showPhotoModal.value = false
  selectedPhoto.value = ''
}

// Helper function to get the correct photo URL
function getPaymentPhotoUrl(payment) {
  // Safety check for undefined payment
  if (!payment) {
    console.log('Payment is undefined')
    return null
  }
  
  console.log('Payment photo data:', {
    payment_photo: payment.payment_photo,
    payment_photo_base64: payment.payment_photo_base64,
    payment
  })
  
  if (payment.payment_photo_base64 && payment.payment_photo_base64.startsWith('data:image')) {
    // If it's already a base64 data URL, return it directly
    console.log('Using base64 data URL')
    return payment.payment_photo_base64
  } else if (payment.payment_photo_base64 && !payment.payment_photo_base64.startsWith('data:image')) {
    // If it's a filename, construct the full backend URL
    // Use the same base URL as the API service
    const backendUrl = 'http://192.168.100.10:8000' // Same as api.js baseURL
    const mediaUrl = `${backendUrl}/media/${payment.payment_photo_base64}`
    console.log('Filename detected, constructed URL:', mediaUrl)
    return mediaUrl
  } else if (payment.payment_photo) {
    // Fallback to the original payment_photo field
    console.log('Using payment_photo field')
    return payment.payment_photo
  }
  
  console.log('No photo URL found')
  return null
}

// Image error and load handlers
function handleImageError(event) {
  console.error('Error loading image:', event.target.src)
  // Simply hide the image without showing error message
  event.target.style.display = 'none'
}

function handleImageLoad(event) {
  console.log('Image loaded successfully:', event.target.src)
}

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// Function to generate default event summary when no description is provided
function cleanDescription(desc) {
  if (!desc) return desc
  if (desc.startsWith('[GCal]\n')) {
    return desc.split('\n').slice(1).join('\n').trim()
  }
  return desc
}

function getDefaultEventSummary() {
  if (!event.value) return ''
  
  const parts = []
  
  // Add package information
  if (event.value.package) {
    if (event.value.package.n_people) {
      parts.push(`Evento para ${event.value.package.n_people} personas`)
    }
    if (event.value.package.title) {
      parts.push(`con el paquete ${event.value.package.title}`)
    }
  }
  
  // Add venue information if available
  if (event.value.venue_name) {
    parts.push(`en ${event.value.venue_name}`)
  }
  
  // Add date information
  if (event.value.start_datetime) {
    const date = new Date(event.value.start_datetime)
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' })
    const monthName = date.toLocaleDateString('es-ES', { month: 'long' })
    parts.push(`el ${dayName} ${date.getDate()} de ${monthName}`)
  }
  
  // Add time information
  if (event.value.start_datetime && event.value.end_datetime) {
    const startTime = new Date(event.value.start_datetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    const endTime = new Date(event.value.end_datetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    parts.push(`de ${startTime} a ${endTime}`)
  }
  
  // Add total price if available
  if (event.value.total_price) {
    parts.push(`con un costo total de $${parseFloat(event.value.total_price).toLocaleString()}`)
  }
  
  return parts.length > 0 ? parts.join(', ') : 'Evento programado con los detalles seleccionados'
}

// Fetch logs for the booking
const { data: logsData, isLoading: logsLoading, error: logsError, refetch: refetchLogs } = useQuery({
  queryKey: ['logs', () => event.value?.id],
  enabled: computed(() => !!event.value?.id && isStaff.value),
  staleTime: 0,
  queryFn: async () => {
    if (!event.value?.id) return []
    const res = await api.get(`/api/logs/booking/by_booking/?booking_id=${event.value.id}`)
    return res.data.results || res.data
  }
})

// Helper functions for logs
const getLogActionClass = (action) => {
  switch (action) {
    case 'created':      return 'bg-green-100 text-green-700'
    case 'confirmed':    return 'bg-green-100 text-green-700'
    case 'updated':      return 'bg-blue-100 text-blue-700'
    case 'status_changed': return 'bg-yellow-100 text-yellow-700'
    case 'cancelled':    return 'bg-orange-100 text-orange-700'
    case 'rejected':     return 'bg-red-100 text-red-700'
    case 'deleted':      return 'bg-red-100 text-red-700'
    case 'payment_received': return 'bg-emerald-100 text-emerald-700'
    case 'admin_approved':   return 'bg-emerald-100 text-emerald-700'
    case 'admin_rejected':   return 'bg-red-100 text-red-700'
    case 'payment_deleted':  return 'bg-red-100 text-red-700'
    case 'reminder_sent': return 'bg-purple-100 text-purple-700'
    case 'review_requested': return 'bg-indigo-100 text-indigo-700'
    default:             return 'bg-gray-100 text-gray-700'
  }
}

const getLogActionText = (action) => {
  const labels = {
    created: 'Creada', confirmed: 'Confirmada', updated: 'Actualizada',
    status_changed: 'Estado Cambiado', cancelled: 'Cancelada', rejected: 'Rechazada',
    deleted: 'Eliminada', payment_received: 'Pago Recibido',
    admin_approved: 'Pago Aprobado por Staff', admin_rejected: 'Pago Rechazado por Staff',
    payment_deleted: 'Pago Eliminado por Staff',
    reminder_sent: 'Recordatorio Enviado', review_requested: 'Reseña Solicitada',
  }
  return labels[action] || action || 'Acción'
}

const formatLogDate = (timestamp) => {
  if (!timestamp) return ''
  try {
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return ''
  }
}

const getLogIcon = (action) => {
  const icons = {
    created:          'fa-solid fa-plus text-green-600',
    confirmed:        'fa-solid fa-check text-green-600',
    updated:          'fa-solid fa-pen text-blue-600',
    status_changed:   'fa-solid fa-arrows-rotate text-yellow-600',
    cancelled:        'fa-solid fa-ban text-orange-600',
    rejected:         'fa-solid fa-times text-red-600',
    deleted:          'fa-solid fa-trash text-red-600',
    payment_received: 'fa-solid fa-circle-dollar-to-slot text-emerald-600',
    admin_approved:   'fa-solid fa-user-check text-emerald-600',
    admin_rejected:   'fa-solid fa-user-xmark text-red-600',
    payment_deleted:  'fa-solid fa-trash text-red-600',
    reminder_sent:    'fa-solid fa-bell text-purple-600',
    review_requested: 'fa-solid fa-star text-indigo-600',
  }
  return icons[action] || 'fa-solid fa-circle text-gray-400'
}

const formatKey = (key) => {
  const keyMap = {
    'venue': 'Lugar',
    'status': 'Estado',
    'package': 'Paquete',
    'total_price': 'Precio Total',
    'price': 'Precio',
    'extras': 'Servicios Extra',
    'date': 'Fecha',
    'time': 'Hora',
    'people_count': 'Número de Personas',
    'client_name': 'Nombre del Cliente',
    'client_phone': 'Teléfono',
    'client_email': 'Email'
  }
  return keyMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatStatus = (status) => {
  if (!status) return ''
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Booking approval and rejection functions
const approveBooking = async () => {
  if (!event.value?.id) return
  
  isSubmitting.value = true
  try {
    const response = await api.post('/api/dashboard/dashboard/approve_booking/', {
      booking_id: event.value.id
    })

    if (response.status >= 200 && response.status < 300) {
      await refetch()
      refetchLogs()
      toast.success('Reserva aprobada exitosamente')
    }
  } catch (error) {
    console.error('Error approving booking:', error)
    toast.error(`Error: ${error.response?.data?.detail || error.message || 'Error desconocido'}`)
  } finally {
    isSubmitting.value = false
  }
}

const rejectBooking = async () => {
  if (!event.value?.id || !rejectReason.value.trim()) return
  
  isSubmitting.value = true
  try {
    const response = await api.post('/api/dashboard/dashboard/reject_booking/', {
      booking_id: event.value.id,
      reason: rejectReason.value.trim()
    })

    if (response.status >= 200 && response.status < 300) {
      await refetch()
      refetchLogs()
      showRejectModal.value = false
      rejectReason.value = ''
      toast.success('Reserva rechazada exitosamente')
    }
  } catch (error) {
    console.error('Error rejecting booking:', error)
    toast.error(`Error: ${error.response?.data?.detail || error.message || 'Error desconocido'}`)
  } finally {
    isSubmitting.value = false
  }
}

// ── Share Cards ──────────────────────────────────────────────────────────────
const confirmCardUrl = ref(null)   // media URL → used for <img> preview
const confirmCardApiUrl = ref(null) // API endpoint → used for blob fetch (guaranteed CORS)
const loadingConfirmCard = ref(false)
const reviewCardUrl = ref(null)
const reviewCardApiUrl = ref(null)
const loadingReviewCard = ref(false)

async function loadConfirmCard() {
  if (!event.value?.id) return
  loadingConfirmCard.value = true
  try {
    const res = await api.get(`/api/bookings/bookings/${event.value.id}/share-card/confirmation/`)
    confirmCardUrl.value = res.data.url + '?t=' + Date.now()
    // API image endpoint — goes through DRF so CORS headers are guaranteed
    confirmCardApiUrl.value = `/api/bookings/bookings/${event.value.id}/share-card/confirmation/image/?t=${Date.now()}`
  } catch (err) {
    toast.error('No se pudo generar la tarjeta de reservación.')
    console.error(err)
  } finally {
    loadingConfirmCard.value = false
  }
}

async function loadReviewCard() {
  if (!event.value?.id) return
  loadingReviewCard.value = true
  try {
    const res = await api.get(`/api/bookings/bookings/${event.value.id}/share-card/review/`)
    reviewCardUrl.value = res.data.url + '?t=' + Date.now()
    reviewCardApiUrl.value = `/api/bookings/bookings/${event.value.id}/share-card/review/image/?t=${Date.now()}`
  } catch (err) {
    toast.error('No se pudo generar la tarjeta de reseña.')
    console.error(err)
  } finally {
    loadingReviewCard.value = false
  }
}

function copyLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    toast.success('¡Enlace copiado al portapapeles!')
  }).catch(() => {
    toast.error('No se pudo copiar el enlace.')
  })
}

function formatEventDate(datetime) {
  if (!datetime) return ''
  const d = new Date(datetime)
  return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

// Properly detect if device supports native file sharing (mobile only)
const canNativeShare = (() => {
  if (typeof navigator === 'undefined' || !navigator.share) return false
  try {
    const f = new File([''], 'test.png', { type: 'image/png' })
    return !!(navigator.canShare && navigator.canShare({ files: [f] }))
  } catch {
    return false
  }
})()

async function _fetchImageBlob(apiUrl) {
  // Use the authenticated api service — goes through DRF, CORS guaranteed
  const res = await api.get(apiUrl, { responseType: 'blob' })
  return res.data
}

async function downloadCard(apiUrl, filename) {
  try {
    const blob = await _fetchImageBlob(apiUrl)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  } catch {
    // Fallback: open preview in new tab (user can long-press to save on mobile)
    window.open(apiUrl.split('?')[0], '_blank')
  }
}

function copyCardLink(url) {
  navigator.clipboard.writeText(url.split('?')[0]).then(() => {
    toast.success('¡Enlace copiado! Pégalo en Facebook, Instagram o donde quieras.')
  }).catch(() => {
    toast.error('No se pudo copiar el enlace.')
  })
}

async function nativeShareCard(url, text) {
  try {
    let shareData
    try {
      const blob = await _fetchImageBlob(url)
      const file = new File([blob], 'terraza-pineda.png', { type: 'image/png' })
      shareData = { files: [file], title: 'Terraza Pineda', text }
    } catch {
      // CORS unavailable — share the URL so at least the sheet opens
      shareData = { title: 'Terraza Pineda', text, url: url.split('?')[0] }
    }
    await navigator.share(shareData)
  } catch (err) {
    if (err.name !== 'AbortError') {
      await downloadCard(url, 'terraza-pineda.png')
    }
  }
}

</script>

<style scoped>
/* Accordion chevron rotation animation */
.rotate-180 {
  transform: rotate(180deg);
}

/* Smooth transitions for accordion content */
.accordion-content {
  transition: all 0.3s ease-in-out;
}
</style>
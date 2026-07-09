<template>
  <div>
    <!-- Cambiar paquete Modal -->
    <div v-if="showPackageModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black/40">
      <div class="relative p-6 w-full max-w-md bg-white rounded-2xl shadow-xl">
        <button @click="showPackageModal = false" class="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <h3 class="mb-4 text-lg font-bold text-gray-900">Selecciona un paquete</h3>
        <div v-if="packagesLoading" class="py-8 text-center">Cargando paquetes...</div>
        <div v-else-if="packagesError" class="py-8 text-center text-red-600">
          Error cargando paquetes: {{ packagesError.message }}
        </div>
        <div v-else>
          <div class="flex overflow-y-auto flex-col gap-3 max-h-72">
            <div v-if="availablePackages.length === 0" class="py-4 text-center text-gray-500">
              No hay paquetes disponibles
            </div>
            <template v-else>
              <div v-for="pkg in availablePackages" :key="pkg?.id || pkg?.title || Math.random()"
                @click="selectedPackageId = pkg?.id; console.log('Selected package:', pkg?.id)"
                :class="[ 'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition',
                  selectedPackageId === pkg?.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50' ]">
                <div v-if="pkg?.icon" class="text-xl text-blue-500">
                  <Icon :icon="pkg.icon" />
                </div>
                <div class="flex-1">
                  <div class="font-bold text-gray-900">{{ pkg?.title || 'Sin título' }}</div>
                  <div class="text-sm text-gray-500">{{ pkg?.n_people || 0 }} personas • ${{ (pkg?.price || 0).toLocaleString() }}</div>
                </div>
                <span v-if="selectedPackageId === pkg?.id" class="font-bold text-blue-500">✓</span>
              </div>
            </template>
          </div>
          <div class="flex gap-2 justify-end mt-6">
            <button @click="showPackageModal = false" class="px-4 py-2 font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
            <button @click="() => { console.log('Save package button clicked'); savePackageChange(); }" :disabled="selectedPackageId === (event.package && event.package.id)" class="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cambiar extras Modal -->
    <div v-if="showExtrasModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black/40">
      <div class="relative p-6 w-full max-w-md bg-white rounded-2xl shadow-xl">
        <button @click="showExtrasModal = false" class="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <h3 class="mb-4 text-lg font-bold text-gray-900">Gestionar extras</h3>
        
        <!-- Available Extras -->
        <div class="mb-6">
          <h4 class="mb-3 font-semibold text-gray-700">Extras disponibles</h4>
          <div class="flex overflow-y-auto flex-col gap-2 max-h-48">
            <div v-for="extra in availableExtras.filter(e => !isExtraSelected(e))" :key="extra.name"
              @click="toggleExtra(extra)"
              :class="[ 'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition',
                'border-gray-200 hover:bg-gray-50' ]">
              <div class="text-xl text-cyan-500">
                <i class="fa-solid fa-gift"></i>
              </div>
              <div class="flex-1">
                <div class="font-bold text-gray-900">{{ extra.name }}</div>
                <div class="text-sm text-gray-500">${{ extra.price.toLocaleString() }}</div>
              </div>
            </div>
            <div v-if="availableExtras.filter(e => !isExtraSelected(e)).length === 0" class="py-4 text-center text-gray-500">
              No hay extras disponibles
            </div>
          </div>
        </div>

        <!-- Selected Extras -->
        <div v-if="selectedExtras.length > 0" class="mb-6">
          <h4 class="mb-3 font-semibold text-gray-700">Extras seleccionados</h4>
          <div class="flex flex-col gap-2">
            <div v-for="extra in selectedExtras" :key="extra.name"
              class="flex gap-3 items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div class="text-xl text-cyan-500">
                <i class="fa-solid fa-gift"></i>
              </div>
              <div class="flex-1">
                <div class="font-bold text-gray-900">{{ extra.name }}</div>
                <div class="text-sm text-gray-500">${{ extra.price.toLocaleString() }}</div>
              </div>
              <button @click="removeSelectedExtra(extra)" class="text-red-500 hover:text-red-700">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-2 justify-end">
          <button @click="showExtrasModal = false" class="px-4 py-2 font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
          <button @click="() => { console.log('Save extras button clicked'); saveExtrasChange(); }" class="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700">Guardar</button>
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
              step="0.01" 
              :min="(parseFloat(event?.advance_paid) || 0) === 0 ? 1000 : 0.01"
              :max="remainingAmount"
              :disabled="remainingAmount <= 0 || parseFloat(paymentAmount) >= remainingAmount"
              class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="0.00"
            />
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Mínimo: ${{ (parseFloat(event?.advance_paid) || 0) === 0 ? '1,000' : '0.01' }} | Máximo: ${{ remainingAmount.toLocaleString() }}
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
              @click="paymentAmount = Math.min(1000, remainingAmount)"
              :disabled="remainingAmount < 1000"
              class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              $1,000
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
              step="50" 
              :min="(parseFloat(event?.advance_paid) || 0) === 0 ? 1000 : 0.01"
              :max="remainingAmount"
              :disabled="remainingAmount <= 0 || parseFloat(transferAmount) >= remainingAmount"
              class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="0.00"
            />
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Mínimo: ${{ (parseFloat(event?.advance_paid) || 0) === 0 ? '1,000' : '0.01' }} | Máximo: ${{ remainingAmount.toLocaleString() }}
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
    <div v-if="showDateChangeModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black/40">
      <div class="relative p-6 w-full max-w-md bg-white rounded-2xl shadow-xl">
        <button @click="showDateChangeModal = false" class="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <div class="flex gap-3 items-center mb-4">
          <div class="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
            <i class="text-blue-600 fa-solid fa-calendar-days"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Cambiar Fecha</h3>
        </div>

        <!-- Rules reminder -->
        <div class="p-3 mb-4 text-xs text-blue-700 bg-blue-50 rounded-lg border border-blue-200">
          <i class="mr-1 fa-solid fa-circle-info"></i>
          Solo se permite <strong>un cambio de fecha</strong> por evento. Debe solicitarse con al menos <strong>3 semanas de anticipación</strong> a la fecha actual del evento.
        </div>

        <!-- Too close warning (non-staff only) -->
        <div v-if="!isStaff && daysUntilEvent <= 21" class="p-3 mb-4 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
          <i class="mr-1 fa-solid fa-triangle-exclamation"></i>
          Tu evento está a <strong>{{ daysUntilEvent }} días</strong>. El cambio de fecha será rechazado por la API ya que no cumples el mínimo de 21 días de anticipación.
        </div>

        <div class="mb-4">
          <label class="block mb-2 text-sm font-semibold text-gray-700">Nueva fecha:</label>
          <CalendarPicker v-model="newEventDate" />
        </div>

        <!-- API error -->
        <div v-if="dateChangeError" class="p-3 mb-4 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
          <i class="mr-1 fa-solid fa-circle-xmark"></i>
          {{ dateChangeError }}
        </div>

        <div class="flex gap-2 justify-end">
          <button @click="showDateChangeModal = false" class="px-4 py-2 font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
          <button @click="submitDateChange" :disabled="isRescheduling || !newEventDate || (!isStaff && daysUntilEvent <= 21)"
            class="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isRescheduling" class="flex gap-2 items-center">
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
  <div class="py-4 pb-0 min-h-screen bg-gray-50">
    <!-- Loading state -->
    <div v-if="loading" class="py-8 text-center">
      <div class="inline-block w-8 h-8 rounded-full border-b-2 border-cyan-500 animate-spin"></div>
      <p class="mt-2 text-gray-600">Cargando reserva...</p>
    </div>
    
    <!-- Event content when loaded -->
    <div v-else-if="event" class="px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="mb-2 text-xs text-gray-500">
        <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
        <span class="mx-2">/</span>
        <router-link :to="isStaff ? '/mis-reservas' : '/mis-reservas'" class="hover:underline">
          {{ isStaff ? 'Reservas' : 'Mis Reservas' }}
        </router-link>
        <span class="mx-2">/</span>
        <span class="font-semibold text-gray-700">Detalle</span>
      </nav>

      <!-- Two-column layout: left=steps, right=summary+payment -->
      <div class="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        <!-- RIGHT COLUMN (summary+payment) — rendered second in HTML, placed right by grid -->
        <div class="flex flex-col gap-4 min-w-0 lg:order-2">

      <!-- Staff Info Banner -->
      <div v-if="isStaff" class="overflow-hidden relative p-1 mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl">
        <div class="p-4 bg-white rounded-lg">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="flex justify-center items-center w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                <i class="text-white fa-solid fa-user-shield"></i>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-600">Modo Staff</div>
                <div class="text-base font-bold text-gray-900">
                  Viendo reserva de {{ event.user_name || event.user?.first_name || 'Cliente' }}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div class="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                ADMIN
              </div>
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Client Information for Staff -->
      <div v-if="isStaff" class="p-4 mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h3 class="mb-3 text-lg font-bold text-gray-900">Información del Cliente</h3>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div class="flex items-center space-x-3">
            <i class="text-blue-500 fa-solid fa-user"></i>
            <div>
              <div class="text-sm text-gray-500">Nombre</div>
              <div class="font-semibold text-gray-900">
                {{ event.user?.first_name || event.user_name || 'N/A' }} {{ event.user?.last_name || '' }}
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <i class="text-blue-500 fa-solid fa-envelope"></i>
            <div>
              <div class="text-sm text-gray-500">Email</div>
              <div class="font-semibold text-gray-900">{{ event.user?.email || 'N/A' }}</div>
            </div>
          </div>
          <div v-if="event.user?.phone" class="flex items-center space-x-3">
            <i class="text-blue-500 fa-solid fa-phone"></i>
            <div>
              <div class="text-sm text-gray-500">Teléfono</div>
              <div class="font-semibold text-gray-900">{{ event.user.phone }}</div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <i class="text-blue-500 fa-solid fa-calendar"></i>
            <div>
              <div class="text-sm text-gray-500">Fecha de Creación</div>
              <div class="font-semibold text-gray-900">{{ formatDate(event.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Event Overview (Order Summary Style, with real event data) -->
        <div class="mb-6 bg-transparent rounded-2xl border-gray-100 border-none -none-md -50">
        <h2 class="mb-4 text-lg font-bold text-gray-900">Resumen de Reserva</h2>
        <div class="flex flex-col gap-3 mb-4">
            <div class="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <!-- Date -->
              <div class="flex gap-3 items-center">
                <i class="text-xl text-blue-500 fa-regular fa-calendar"></i>
                <div class="flex-1">
                  <div class="mb-1 font-semibold text-gray-400">Fecha del Evento</div>
                  <div class="flex gap-2 items-center">
                    <div class="text-lg font-bold text-gray-900">
                      <span v-if="event.start_datetime">{{ formatDate(event.start_datetime) }}</span>
                      <span v-else class="text-gray-500">Fecha no especificada</span>
                    </div>
                    <button
                      v-if="!isLocked && (isStaff || event.date_changes_count === 0)"
                      @click="showDateChangeModal = true; dateChangeError = ''"
                      class="flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 transition hover:bg-blue-100"
                    >
                      <i class="fa-solid fa-pen text-[10px]"></i>
                      Editar
                    </button>
                  </div>
                </div>
              </div>
              <!-- Time -->
              <div class="flex gap-3 items-center mt-2">
                <i class="text-xl text-blue-500 fa-regular fa-clock"></i>
                <div class="flex-1">
                  <div class="mb-1 font-semibold text-gray-400">Horario</div>
                  <div v-if="!editingTimes" class="flex gap-2 items-center">
                    <div class="text-lg font-bold text-gray-900">
                      <span v-if="event.start_datetime && event.end_datetime">
                        {{ formatTime(event.start_datetime) }} - {{ formatTime(event.end_datetime) }}
                      </span>
                      <span v-else-if="event.package && event.package.hours">
                        {{ event.package.hours }}
                      </span>
                      <span v-else class="text-gray-500">Horario no especificado</span>
                    </div>
                    <button v-if="isStaff"
                      @click="openTimeEdit"
                      class="flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 transition hover:bg-blue-100">
                      <i class="fa-solid fa-pen text-[10px]"></i>
                      Editar
                    </button>
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
                  
                  <!-- Description with Read More -->
                  <div class="mt-2">
                    <div v-if="event.description" class="text-sm text-gray-600">
                      <span v-if="!showFullDescription" class="line-clamp-2">
                        {{ event.description.substring(0, 100) }}{{ event.description.length > 100 ? '...' : '' }}
                      </span>
                      <span v-else>{{ event.description }}</span>
            </div>
                    <div v-else class="text-sm text-gray-600">
                      <span v-if="!showFullDescription" class="line-clamp-2">
                        {{ getDefaultEventSummary() }}
                      </span>
                      <span v-else>{{ getDefaultEventSummary() }}</span>
                    </div>
                    <button 
                      v-if="(event.description && event.description.length > 100) || (!event.description && getDefaultEventSummary().length > 100)"
                      @click="showFullDescription = !showFullDescription"
                      class="mt-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                      {{ showFullDescription ? 'Leer menos' : 'Leer más' }}
                    </button>
                  </div>
            </div>
              </div>
            </div>
            <!-- Package & People Card -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <div class="font-bold text-gray-900">Paquete</div>
                <button v-if="!isLocked" @click="showPackageModal = true" class="flex gap-1 items-center px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 transition hover:bg-blue-100">
                  <i class="fa-solid fa-edit"></i>
                  Cambiar
                </button>
              </div>
              <div class="flex gap-3 items-center p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div v-if="event.package && event.package.icon" class="mr-1 text-2xl text-blue-500">
                  <Icon :icon="event.package.icon" />
          </div>
                <div class="flex flex-col flex-1">
                  <div class="text-lg font-bold text-gray-900">{{ event.package ? event.package.n_people : 0 }} personas</div>
                  <div class="mt-1 text-sm text-gray-500">{{ event.package ? event.package.description : '' }}</div>
            </div>
                <div class="ml-2 text-base font-bold text-right text-gray-900">
                  ${{ packageBookedPrice.toLocaleString() }}
            </div>
            </div>
          </div>
          <div class="p-3 text-sm bg-white rounded-lg" v-if="event.description">
            <div class="mb-1 font-semibold text-gray-400">Descripción</div>
              <div class="text-gray-900 whitespace-pre-line">{{ event.description }}</div>
          </div>
        </div>
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <div class="font-bold text-gray-900">Extras</div>
            <!-- Add Extra Button -->
            <div class="flex gap-2">
              <button v-if="!isLocked" @click="showExtrasModal = true" class="flex gap-1 items-center px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded border border-blue-200 transition hover:bg-blue-100">
                <i class="fa-solid fa-plus"></i>
                Agregar
              </button>
            </div>
          </div>
          <div class="p-2 bg-white rounded-lg">
            <div v-if="localExtras && localExtras.length">
              <div class="flex px-2 py-1 text-xs font-semibold text-gray-400 border-b border-gray-100">
                <div class="flex-1">Extra</div>
                <div class="w-24 text-right">Precio</div>
              </div>
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
                <div class="flex relative z-30 items-center px-2 bg-white rounded-xl border-b border-gray-100 transition-all duration-300 last:border-b-0"
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
                  <div class="w-24 text-base font-semibold text-right text-gray-900">
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
          </div>
        </div>
        <div class="p-4 text-sm bg-white rounded-lg">
          <div class="flex justify-between mb-1">
            <span class="text-gray-500">Total</span>
              <span class="text-base font-semibold text-gray-900">${{ (parseFloat(event.total_price) || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between mb-1">
            <span class="text-gray-500">Anticipo</span>
              <span class="text-base font-semibold text-green-600">${{ (parseFloat(event.advance_paid) || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between pt-2 mt-2 border-t">
            <span class="font-bold text-gray-900">Restante</span>
              <span class="text-base font-bold text-indigo-600">${{ ((parseFloat(event.total_price) || 0) - (parseFloat(event.advance_paid) || 0)).toLocaleString() }}</span>
          </div>
        </div>
        
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
          v-if="event && ['aceptacion','apartado','liquidado','liquidado_entregado','entregado','finalizado'].includes(event.status)"
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
                @click="nativeShareCard(confirmCardUrl, '¡Reservé Terraza Pineda para el ' + formatEventDate(event.start_datetime) + '! 🎉')"
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
                  @click="downloadCard(confirmCardUrl, 'terraza-pineda-reserva.png')"
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

        <!-- Payment Methods Section (shown when reservation is accepted and not locked) -->
        <div v-if="event && !isLocked && (event.status === 'aceptacion' || event.status === 'apartado' || event.status === 'liquidado' || event.status === 'entregado' || event.status === 'finalizado')" class="mt-6">
          <div class="p-5 bg-white rounded-2xl border border-gray-100 shadow-lg">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold text-primary-700">Métodos de Pago</h2>
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
                    <div class="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                      <i class="text-blue-600 fa-brands fa-stripe"></i>
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
                        step="0.01" 
                        :min="(parseFloat(event?.advance_paid) || 0) === 0 ? 1000 : 0.01"
                        :max="remainingAmount"
                        :disabled="remainingAmount <= 0 || parseFloat(paymentAmount) >= remainingAmount"
                        class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="0.00"
                      />
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                      <span v-if="(parseFloat(event?.advance_paid) || 0) === 0">
                        Mínimo: $1,000 | Máximo: ${{ remainingAmount.toLocaleString() }}
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
                        @click="paymentAmount = Math.min(1000, remainingAmount)"
                        class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100"
                      >
                        $1,000
                      </button>
                      <button 
                        @click="paymentAmount = Math.min(500, remainingAmount)"
                        class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100"
                      >
                        $500
                      </button>
                    </div>
                  </div>


                  <div class="flex gap-3">
                    <button 
                      @click="pagar()"
                      :disabled="!paymentAmount || paymentAmount <= 0 || isPaying || ((parseFloat(event?.advance_paid) || 0) === 0 && paymentAmount < 1000)"
                      class="flex-1 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i class="mr-2 fa-solid fa-credit-card"></i>
                      <span v-if="isPaying">Procesando...</span>
                      <span v-else>Pagar con Stripe</span>
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
                    selectedPaymentMethod === 'mercadopago' ? 'border-purple-200' : 'hover:bg-gray-50'
                  ]"
                >
                  <div class="flex gap-3 items-center">
                    <div class="flex justify-center items-center w-10 h-10 bg-purple-100 rounded-full">
                      <i class="text-purple-600 fa-brands fa-cc-mastercard"></i>
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
                          step="0.01"
                          :min="(parseFloat(event?.advance_paid) || 0) === 0 ? 1000 : 0.01"
                          :max="remainingAmount"
                          :disabled="remainingAmount <= 0 || parseFloat(paymentAmount) >= remainingAmount"
                          class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="0.00"
                        />
                      </div>
                      <div class="mt-2 text-xs text-gray-500">
                        <span v-if="(parseFloat(event?.advance_paid) || 0) === 0">
                          Mínimo: $1,000 | Máximo: ${{ remainingAmount.toLocaleString() }}
                        </span>
                        <span v-else>
                          Máximo: ${{ remainingAmount.toLocaleString() }}
                        </span>
                      </div>

                      <!-- Quick Amount Buttons -->
                      <div class="flex flex-wrap gap-2 mt-3">
                        <button
                          @click="paymentAmount = remainingAmount"
                          class="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-50 rounded border border-purple-200 hover:bg-purple-100"
                        >
                          Pagar todo
                        </button>
                        <button
                          @click="paymentAmount = Math.min(1000, remainingAmount)"
                          class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100"
                        >
                          $1,000
                        </button>
                        <button
                          @click="paymentAmount = Math.min(500, remainingAmount)"
                          class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100"
                        >
                          $500
                        </button>
                      </div>
                    </div>

                    <div class="flex gap-3">
                      <button
                        @click="pagarMercadoPago()"
                        :disabled="!paymentAmount || paymentAmount <= 0 || isPaying || ((parseFloat(event?.advance_paid) || 0) === 0 && paymentAmount < 1000)"
                        class="flex-1 px-6 py-3 text-sm font-semibold text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i class="mr-2 fa-brands fa-mercadopago"></i>
                        <span v-if="isPaying">Procesando...</span>
                        <span v-else>Continuar con MercadoPago</span>
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
                    <div class="flex justify-center items-center w-10 h-10 bg-green-100 rounded-full">
                      <i class="text-green-600 fa-solid fa-money-bill-transfer"></i>
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
                        step="50" 
                        :min="(parseFloat(event?.advance_paid) || 0) === 0 ? 1000 : 0.01"
                        :max="remainingAmount"
                        :disabled="remainingAmount <= 0 || parseFloat(transferAmount) >= remainingAmount"
                        class="py-3 pr-4 pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="0.00"
                      />
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                      Mínimo: ${{ (parseFloat(event?.advance_paid) || 0) === 0 ? '1,000' : '0.01' }} | Máximo: ${{ remainingAmount.toLocaleString() }}
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
                        @click="transferAmount = Math.min(1000, remainingAmount)"
                        :disabled="remainingAmount < 1000"
                        class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border border-green-200 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        $1,000
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

                  <!-- Bank Cards -->
                  <div class="mb-4">
                    <div class="mb-3 text-sm font-semibold text-gray-700">Selecciona una cuenta:</div>
                    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <!-- Card 1 -->
                      <div class="relative p-4 text-white bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg transition-shadow cursor-pointer hover:shadow-xl">
                        <div class="flex justify-between items-start mb-4">
                          <div class="text-sm font-medium opacity-90">Cuenta Principal</div>
                          <div class="w-8 h-6 bg-white rounded opacity-20"></div>
                        </div>
                        <div class="mb-2 text-lg font-bold tracking-wider">**** **** **** 1234</div>
                        <div class="text-xs opacity-90">Banco de México</div>
                        <div class="mt-2 text-xs opacity-75">CLABE: 012345678901234567</div>
                      </div>
                      
                      <!-- Card 2 -->
                      <div class="relative p-4 text-white bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-lg transition-shadow cursor-pointer hover:shadow-xl">
                        <div class="flex justify-between items-start mb-4">
                          <div class="text-sm font-medium opacity-90">Cuenta Alternativa</div>
                          <div class="w-8 h-6 bg-white rounded opacity-20"></div>
                        </div>
                        <div class="mb-2 text-lg font-bold tracking-wider">**** **** **** 5678</div>
                        <div class="text-xs opacity-90">Banco Santander</div>
                        <div class="mt-2 text-xs opacity-75">CLABE: 014180000000000000</div>
                      </div>
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
                    <div class="flex justify-center items-center w-10 h-10 bg-yellow-100 rounded-full">
                      <i class="text-yellow-600 fa-solid fa-money-bill-wave"></i>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment History / Orders Section -->
        <div v-if="ordersLoading" class="mt-6 p-4 text-sm text-center text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="inline-block mr-2 w-4 h-4 rounded-full border-2 border-gray-400 animate-spin border-t-transparent"></div>
          Cargando historial de pagos...
        </div>
        <div v-else-if="ordersData && ordersData.length > 0" class="mt-6">
          <div class="p-5 bg-white rounded-2xl border border-gray-100 shadow-lg">
            <h2 class="mb-4 text-lg font-bold text-gray-900">Historial de Pagos</h2>
            <div class="space-y-4">
              <div v-for="order in ordersData" :key="order.id" class="overflow-hidden rounded-xl border border-gray-200">
                <!-- Order header -->
                <div class="flex items-center justify-between p-4 bg-gray-50">
                  <div class="flex gap-3 items-center">
                    <div class="flex flex-shrink-0 justify-center items-center w-9 h-9 bg-blue-100 rounded-full">
                      <i class="text-sm text-blue-600 fa-solid fa-receipt"></i>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-gray-900">Orden de pago</div>
                      <div class="text-xs text-gray-400">{{ formatDate(order.created_at) }}</div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1 items-end">
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-bold', getPaymentStatusClass(order.status)]">
                      {{ getPaymentStatusText(order.status) }}
                    </span>
                    <span class="font-bold text-gray-900">${{ parseFloat(order.amount_due || 0).toLocaleString() }}</span>
                  </div>
                </div>

                <!-- Payments list -->
                <div v-if="order.payments && order.payments.length > 0" class="divide-y divide-gray-100">
                  <div v-for="payment in order.payments" :key="payment.id" class="p-4">
                    <div class="flex gap-3 items-start">
                      <div :class="['flex flex-shrink-0 justify-center items-center w-9 h-9 rounded-full', getPaymentIconClass(payment.gateway, payment.status)]">
                        <i :class="['text-sm', getPaymentIcon(payment.gateway)]"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex gap-2 justify-between items-start">
                          <div>
                            <div class="text-sm font-semibold text-gray-900">{{ getPaymentMethodText(payment.method) }}</div>
                            <div class="text-xs text-gray-400">{{ getGatewayText(payment.gateway) }}</div>
                          </div>
                          <div class="flex flex-col flex-shrink-0 gap-1 items-end">
                            <span :class="['px-2 py-0.5 rounded-full text-xs font-bold', getPaymentStatusClass(payment.status)]">
                              {{ getPaymentStatusText(payment.status) }}
                            </span>
                            <span class="text-sm font-bold text-gray-900">${{ parseFloat(payment.amount || 0).toLocaleString() }}</span>
                          </div>
                        </div>
                        <div v-if="payment.paid_at" class="flex gap-1 items-center mt-1 text-xs text-gray-400">
                          <i class="fa-regular fa-clock"></i>
                          Pagado el {{ formatDate(payment.paid_at) }}
                        </div>
                        <div v-if="payment.card_last4" class="mt-1 text-xs text-gray-500">
                          Tarjeta terminada en {{ payment.card_last4 }}
                        </div>
                        <!-- Payment photo -->
                        <div v-if="getPaymentPhotoUrl(payment)" class="mt-3">
                          <div class="flex gap-1 items-center mb-1.5 text-xs font-semibold text-gray-600">
                            <i class="text-gray-400 fa-solid fa-image"></i>
                            Comprobante de pago
                          </div>
                          <img
                            :src="getPaymentPhotoUrl(payment)"
                            alt="Comprobante de pago"
                            class="object-cover w-full max-w-xs h-40 rounded-lg border border-gray-200 transition-opacity cursor-pointer hover:opacity-90"
                            @click="openPhotoModal(getPaymentPhotoUrl(payment))"
                            @error="handleImageError"
                            @load="handleImageLoad"
                          />
                          <button
                            @click="openPhotoModal(getPaymentPhotoUrl(payment))"
                            class="flex gap-1 items-center mt-1.5 text-xs text-blue-600 hover:text-blue-800"
                          >
                            <i class="fa-solid fa-expand-alt"></i>
                            Ver en pantalla completa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="p-4 text-sm text-center text-gray-400">
                  Sin pagos registrados en esta orden
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Review & Rating (shown after steps when finalizado) -->
        <div v-if="event && (event.status === 'finalizado' || event.status_display === 'Finalizado')" class="mt-4">
          <div class="p-5 bg-white rounded-2xl border border-gray-100 shadow-lg">
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-lg font-bold text-primary-700">Tu reseña</h2>
              <span v-if="reviewLoading" class="text-xs text-gray-500">Cargando…</span>
            </div>

            <!-- Star rating -->
            <div class="flex gap-2 items-center mb-3">
              <button v-for="s in 5" :key="s" type="button"
                @click="rating = s"
                class="text-2xl focus:outline-none"
                :class="s <= (rating || 0) ? 'text-yellow-400' : 'text-gray-300'">
                <i :class="s <= (rating || 0) ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
              </button>
              <span class="ml-2 text-sm text-gray-500">{{ rating || 0 }}/5</span>
            </div>

            <!-- Review text -->
            <textarea v-model="reviewText" rows="4"
              placeholder="Cuéntanos cómo fue tu experiencia"
              class="p-3 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>

            <!-- Actions -->
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

            <!-- Existing info -->
            <div v-if="myReview && (myReview.rating || myReview.review)" class="p-3 mt-4 text-xs bg-gray-50 rounded border border-gray-200">
              <div class="mb-1 font-semibold text-gray-700">Última reseña guardada</div>
              <div class="flex gap-2 items-center mb-1">
                <span class="text-yellow-400" v-for="s in (myReview.rating || 0)" :key="'rs'+s"><i class="fa-solid fa-star"></i></span>
                <span class="text-gray-400" v-for="s in (5 - (myReview.rating || 0))" :key="'re'+s"><i class="fa-regular fa-star"></i></span>
                <span class="ml-2 text-gray-500">{{ myReview.rating || 0 }}/5</span>
              </div>
              <div class="text-gray-700 whitespace-pre-line">{{ myReview.review }}</div>

              <!-- Share review card -->
              <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="font-semibold text-gray-700 mb-2">¡Comparte tu experiencia!</p>
                <div v-if="reviewCardUrl" class="mb-3">
                  <img :src="reviewCardUrl" alt="Tarjeta de reseña" class="w-full max-w-xs mx-auto rounded-xl shadow-md" />
                </div>
                <div v-else-if="loadingReviewCard" class="flex justify-center py-3">
                  <svg class="animate-spin h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-if="!reviewCardUrl && !loadingReviewCard"
                    @click="loadReviewCard"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-semibold transition"
                  >
                    Ver tarjeta
                  </button>
                  <a
                    v-if="reviewCardUrl"
                    :href="reviewCardUrl"
                    download="terraza-pineda-resena.png"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-semibold transition"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Descargar para Instagram/TikTok
                  </a>
                  <a
                    v-if="event && myReview"
                    :href="`https://wa.me/?text=${encodeURIComponent('¡Tuve mi evento en Terraza Pineda! ' + '★'.repeat(myReview.rating || 5) + ' ¡Totalmente recomendado! terrazapineda.com')}`"
                    target="_blank"
                    rel="noopener"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1a9e4a] text-xs font-semibold transition"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div><!-- /Review -->
        </div><!-- /LEFT COLUMN -->

        <!-- LEFT COLUMN (steps — sticky on desktop) -->
        <div class="flex flex-col gap-4 lg:order-1 lg:sticky lg:top-24">
          <!-- Steps Progress -->
          <div class="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h2 class="mb-3 text-base font-bold text-primary-700 sm:text-lg">Pasos a seguir</h2>

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
              <div v-for="(step, i) in steps" :key="step.key" class="relative flex gap-3 pb-2">
                <!-- Vertical connector line -->
                <div v-if="i < steps.length - 1" class="absolute left-[11px] top-7 bottom-0 w-0.5"
                  :class="[
                    i < getCurrentStepIndex(event.status) ? 'bg-green-300' :
                    i === getCurrentStepIndex(event.status) ? 'bg-blue-200' :
                    'bg-gray-200'
                  ]"
                ></div>

                <!-- Step icon -->
                <div class="relative z-10 flex-shrink-0 mt-2.5">
                  <div v-if="i === getCurrentStepIndex(event.status)"
                    class="absolute inset-0 w-6 h-6 bg-green-400 rounded-full opacity-40 animate-ping">
                  </div>
                  <div class="relative flex justify-center items-center w-6 h-6 text-xs font-bold rounded-full"
                    :class="[
                      i < getCurrentStepIndex(event.status) ? 'bg-green-500 text-white shadow-sm' :
                      i === getCurrentStepIndex(event.status) ? 'bg-green-500 text-white shadow-md' :
                      i === getCurrentStepIndex(event.status) + 1 && getCurrentStepIndex(event.status) >= 0 ? 'bg-blue-500 text-white shadow-sm' :
                      'bg-white border-2 border-gray-300 text-gray-400'
                    ]"
                  >
                    <i v-if="i < getCurrentStepIndex(event.status)" class="text-xs fa-solid fa-check"></i>
                    <span v-else class="text-xs">{{ i + 1 }}</span>
                  </div>
                </div>

                <!-- Step card -->
                <div class="flex-1 min-w-0 rounded-xl border px-3 py-2.5 transition"
                  :class="[
                    i < getCurrentStepIndex(event.status) ? 'border-green-200 bg-green-50' :
                    i === getCurrentStepIndex(event.status) ? 'border-green-300 bg-green-50 shadow-sm ring-1 ring-green-200' :
                    i === getCurrentStepIndex(event.status) + 1 && getCurrentStepIndex(event.status) >= 0 ? 'border-blue-300 bg-blue-50 shadow-sm ring-1 ring-blue-200' :
                    'border-gray-200 bg-white'
                  ]"
                >
                  <div class="flex justify-between items-center gap-1">
                    <span class="text-sm font-semibold"
                      :class="[
                        i === getCurrentStepIndex(event.status) ? 'text-green-800' :
                        i === getCurrentStepIndex(event.status) + 1 && getCurrentStepIndex(event.status) >= 0 ? 'text-blue-800' :
                        'text-gray-900'
                      ]"
                    >{{ step.label }}</span>
                    <!-- Status badge -->
                    <span v-if="i < getCurrentStepIndex(event.status)"
                      class="flex-shrink-0 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Listo</span>
                    <span v-else-if="i === getCurrentStepIndex(event.status)"
                      class="flex-shrink-0 px-2 py-0.5 text-xs font-bold text-white bg-green-500 rounded-full">Actual</span>
                    <span v-else-if="i === getCurrentStepIndex(event.status) + 1 && getCurrentStepIndex(event.status) >= 0"
                      class="flex-shrink-0 px-2 py-0.5 text-xs font-bold text-white bg-blue-500 rounded-full">Próximo</span>
                  </div>
                  <p class="mt-0.5 text-xs leading-relaxed text-gray-500">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Cancellation Policy + Cancel Button -->
          <div v-if="!isLocked"
            class="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 class="mb-3 text-sm font-bold text-gray-700">
              <i class="mr-1.5 text-gray-400 fa-solid fa-file-contract"></i>
              Política de Cancelación y Cambios
            </h3>
            <div class="space-y-2.5 text-xs text-gray-600">
              <div class="flex gap-2 items-start">
                <i class="mt-0.5 flex-shrink-0 text-green-500 fa-solid fa-circle-check"></i>
                <p><span class="font-semibold text-gray-700">Más de 45 días de anticipación:</span> se devuelve el 50% del anticipo. El resto se retiene por gastos administrativos.</p>
              </div>
              <div class="flex gap-2 items-start">
                <i class="mt-0.5 flex-shrink-0 text-red-500 fa-solid fa-circle-xmark"></i>
                <p><span class="font-semibold text-gray-700">45 días o menos:</span> el anticipo no es reembolsable bajo ninguna circunstancia.</p>
              </div>
              <div class="flex gap-2 items-start">
                <i class="mt-0.5 flex-shrink-0 text-blue-400 fa-solid fa-calendar-days"></i>
                <p><span class="font-semibold text-gray-700">Cambios de fecha:</span> con al menos 3 semanas de anticipación, sujeto a disponibilidad. Solo se permite un cambio por evento.</p>
              </div>
            </div>
            <div class="flex flex-col gap-2 mt-4">
              <!-- Reschedule button — staff bypass the 1-change limit -->
              <button v-if="isStaff || event.date_changes_count === 0"
                @click="showDateChangeModal = true; dateChangeError = ''"
                class="w-full px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl border border-blue-200 transition hover:bg-blue-100">
                <i class="mr-2 fa-solid fa-calendar-days"></i>
                Cambiar Fecha
              </button>
              <div v-else class="flex gap-2 items-center px-3 py-2 text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                <i class="fa-solid fa-calendar-xmark text-gray-400"></i>
                Ya utilizaste el cambio de fecha permitido para este evento.
              </div>

              <button @click="showCancelModal = true"
                class="w-full px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl border border-red-200 transition hover:bg-red-100">
                <i class="mr-2 fa-solid fa-ban"></i>
                Cancelar Reserva
              </button>
            </div>
          </div>
        </div><!-- /RIGHT COLUMN -->
      </div><!-- /grid -->

        <!-- Staff Card -->
        <div v-if="event.staff" class="flex flex-col gap-4 items-center p-5 mt-2 mb-8 bg-white rounded-2xl border border-blue-100 shadow md:flex-row">
          <img :src="event.staff.profile?.image || 'https://ui-avatars.com/api/?name=' + (event.staff.first_name || '') + '+' + (event.staff.last_name || '') + '&background=0D8ABC&color=fff'" alt="Staff profile" class="object-cover w-16 h-16 rounded-full border-2 border-blue-200" />
          <div class="flex-1">
            <div class="mb-1 text-xs font-semibold text-gray-400">¿Quién te atendió?</div>
            <div class="text-lg font-bold text-gray-900">{{ event.staff.first_name }} {{ event.staff.last_name }}</div>
            <div class="text-sm text-gray-600">{{ event.staff.email }}</div>
            <div v-if="event.staff.phone" class="mt-1">
              <a :href="'tel:' + event.staff.phone" class="inline-flex gap-1 items-center font-semibold text-blue-600 hover:underline">
                <i class="fa-solid fa-phone"></i>
                {{ event.staff.phone }}
              </a>
          </div>
        </div>
      </div>

      <!-- Activity Logs Section for Staff -->
      <div v-if="isStaff" class="mb-8">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-200 sm:px-6 sm:py-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="flex justify-center items-center w-6 h-6 bg-blue-600 rounded-lg sm:w-8 sm:h-8">
                  <i class="text-xs text-white sm:text-sm fa-solid fa-history"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h2 class="text-base font-semibold text-gray-900 truncate sm:text-lg">Registro de Actividad</h2>
                  <p class="text-xs text-gray-500 sm:text-sm">{{ logsData?.length || 0 }} eventos registrados</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-4 sm:p-6">
            <!-- Loading state -->
            <div v-if="logsLoading" class="py-8 text-center sm:py-12">
              <div class="inline-flex items-center space-x-2 sm:space-x-3">
                <div class="w-4 h-4 rounded-full border-2 border-blue-600 animate-spin sm:w-5 sm:h-5 border-t-transparent"></div>
                <span class="text-xs text-gray-600 sm:text-sm">Cargando historial...</span>
              </div>
            </div>
            
            <!-- Error state -->
            <div v-else-if="logsError" class="py-8 text-center sm:py-12">
              <div class="flex flex-col items-center space-y-2 sm:space-y-3">
                <div class="flex justify-center items-center w-10 h-10 bg-red-100 rounded-full sm:w-12 sm:h-12">
                  <i class="text-sm text-red-500 sm:text-base fa-solid fa-exclamation-triangle"></i>
                </div>
                <div class="px-4">
                  <p class="text-xs font-medium text-red-600 sm:text-sm">Error cargando logs</p>
                  <p class="text-xs text-gray-500">Intenta recargar la página</p>
                </div>
              </div>
            </div>
            
            <!-- Logs Timeline -->
            <div v-else-if="logsData && logsData.length > 0" class="space-y-4 sm:space-y-6">
              <div v-for="(log, index) in logsData" :key="log.id" class="flex relative items-start space-x-3 sm:space-x-4">
                <!-- Timeline line -->
                <div v-if="index < logsData.length - 1" class="absolute left-3 top-6 w-0.5 bg-gray-200 sm:left-4 sm:top-8" style="height: calc(100% + 1rem);"></div>
                
                <!-- Timeline dot -->
                <div class="flex z-10 flex-shrink-0 justify-center items-center w-6 h-6 bg-white rounded-full border-2 sm:w-8 sm:h-8"
                  :class="getLogActionClass(log.action).replace('text-', 'border-').replace('bg-', 'bg-')">
                  <i class="text-xs" :class="getLogIcon(log.action)"></i>
                </div>
                
                <!-- Log content -->
                <div class="flex-1 pb-4 min-w-0 sm:pb-6">
                  <!-- Mobile layout -->
                  <div class="block sm:hidden">
                    <div class="flex justify-between items-start mb-2">
                      <div class="flex-1 pr-2 min-w-0">
                        <p class="text-sm font-medium leading-tight text-gray-900">{{ log.description }}</p>
                      </div>
                      <div class="flex-shrink-0 text-xs font-medium text-gray-500">
                        {{ formatLogDate(log.timestamp) }}
                      </div>
                    </div>
                    
                    <p v-if="log.user_name" class="mb-2 text-xs text-gray-500">
                      Por {{ log.user_name }}
                    </p>
                    
                    <!-- Status change indicator -->
                    <div v-if="log.old_status && log.new_status" class="mb-2">
                      <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                        {{ formatStatus(log.old_status) }} → {{ formatStatus(log.new_status) }}
                      </span>
                    </div>
                    
                    <!-- Changes list -->
                    <div v-if="log.metadata && log.metadata.changes" class="mt-2">
                      <div class="p-2 bg-gray-50 rounded-lg">
                        <h4 class="mb-1 text-xs font-medium text-gray-700">Cambios:</h4>
                        <ul class="space-y-1">
                          <li v-for="change in log.metadata.changes" :key="change" 
                            class="flex items-start text-xs text-gray-600">
                            <span class="flex-shrink-0 mt-0.5 mr-1.5 text-green-500">•</span>
                            <span class="break-words">{{ change }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Desktop layout -->
                  <div class="hidden sm:block">
                    <div class="flex justify-between items-start">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900">{{ log.description }}</p>
                        <p v-if="log.user_name" class="mt-1 text-xs text-gray-500">
                          Por {{ log.user_name }} ({{ log.user_email }})
                        </p>
                        
                        <!-- Status change indicator -->
                        <div v-if="log.old_status && log.new_status" class="mt-2">
                          <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                            {{ formatStatus(log.old_status) }} → {{ formatStatus(log.new_status) }}
                          </span>
                        </div>
                        
                        <!-- Changes list -->
                        <div v-if="log.metadata && log.metadata.changes" class="mt-3">
                          <div class="p-3 bg-gray-50 rounded-lg">
                            <h4 class="mb-2 text-xs font-medium text-gray-700">Cambios realizados:</h4>
                            <ul class="space-y-1">
                              <li v-for="change in log.metadata.changes" :key="change" 
                                class="flex items-start text-xs text-gray-600">
                                <span class="mr-2 text-green-500">•</span>
                                {{ change }}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Date -->
                      <div class="flex-shrink-0 ml-4 text-xs font-medium text-gray-500">
                        {{ formatLogDate(log.timestamp) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No logs message -->
            <div v-else class="py-8 text-center sm:py-12">
              <div class="flex flex-col items-center space-y-2 sm:space-y-3">
                <div class="flex justify-center items-center w-10 h-10 bg-gray-100 rounded-full sm:w-12 sm:h-12">
                  <i class="text-sm text-gray-400 sm:text-base fa-solid fa-history"></i>
                </div>
                <div class="px-4">
                  <p class="text-xs font-medium text-gray-600 sm:text-sm">No hay registros de actividad</p>
                  <p class="text-xs text-gray-500">Los cambios aparecerán aquí cuando se realicen</p>
                </div>
              </div>
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

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

// Determine if the user is a staff member
const isStaff = computed(() => {
  return authStore.user?.is_staff
})

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

const isLocked = computed(() =>
  ['cancelado', 'rechazado', 'finalizado'].includes(event.value?.status)
)

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
    const originalTime = event.value.start_datetime
      ? new Date(event.value.start_datetime).toTimeString().slice(0, 5)
      : '00:00'
    await api.patch(`/api/bookings/bookings/${event.value.id}/`, {
      start_datetime: `${dateStr}T${originalTime}:00`
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
    key: 'liquidado_entregado',
    label: 'Liquidado y Entregado',
    icon: 'fa-solid fa-handshake',
    description: 'Monto liquidado y lugar entregado para tu evento'
  },
  {
    key: 'entregado',
    label: 'Entregado',
    icon: 'fa-solid fa-door-open',
    description: 'El lugar ha sido entregado para tu evento'
  },
  {
    key: 'finalizado',
    label: 'Finalizado',
    icon: 'fa-regular fa-star',
    description: 'Evento completado, puedes dejar tu reseña'
  }
]

const terminalStatuses = ['rechazado', 'cancelado']

// Returns -1 for terminal states (rechazado/cancelado) so all steps render as pending
const getCurrentStepIndex = (status) => {
  if (terminalStatuses.includes(status)) return -1
  const stepIndex = steps.findIndex(step => step.key === status)
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

// Extras modal variables
const showExtrasModal = ref(false)
const selectedExtras = ref([])

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
  
  // If no advance payment has been made, minimum payment is $1,000
  if (paid === 0 && remaining > 0) {
    return Math.max(1000, remaining)
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
      gateway: 'mercadopago'
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
      toast.success('¡Pago por transferencia enviado exitosamente! Se procesará en breve.')
      
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

const transferAmount = ref('')

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
  // You can add logic here to open contact form or redirect to contact page
  console.log('Contact for cash payment:', paymentAmount.value)
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
const { data: logsData, isLoading: logsLoading, error: logsError } = useQuery({
  queryKey: ['logs', () => event.value?.id],
  enabled: computed(() => !!event.value?.id && isStaff.value),
  queryFn: async () => {
    if (!event.value?.id) return []
    const res = await api.get(`/api/logs/booking/by_booking/?booking_id=${event.value.id}`)
    return res.data.results || res.data
  }
})

// Helper functions for logs
const getLogActionClass = (action) => {
  switch (action) {
    case 'created':
      return 'bg-green-100 text-green-700'
    case 'updated':
      return 'bg-blue-100 text-blue-700'
    case 'status_changed':
      return 'bg-yellow-100 text-yellow-700'
    case 'deleted':
      return 'bg-red-100 text-red-700'
    case 'payment_received':
      return 'bg-emerald-100 text-emerald-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getLogActionText = (action) => {
  switch (action) {
    case 'created':
      return 'Creada'
    case 'updated':
      return 'Actualizada'
    case 'status_changed':
      return 'Estado Cambiado'
    case 'deleted':
      return 'Eliminada'
    case 'payment_received':
      return 'Pago Recibido'
    default:
      return action || 'Acción'
  }
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
  switch (action) {
    case 'created':
      return 'fa-solid fa-plus text-green-600'
    case 'updated':
      return 'fa-solid fa-edit text-blue-600'
    case 'status_changed':
      return 'fa-solid fa-exchange-alt text-yellow-600'
    case 'deleted':
      return 'fa-solid fa-trash text-red-600'
    case 'payment_received':
      return 'fa-solid fa-credit-card text-green-600'
    default:
      return 'fa-solid fa-circle text-gray-600'
  }
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
      // Refresh the event data
      await refetch()
      // Show success message
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
      // Refresh the event data
      await refetch()
      // Close modal and reset
      showRejectModal.value = false
      rejectReason.value = ''
      // Show success message
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
const confirmCardUrl = ref(null)
const loadingConfirmCard = ref(false)
const reviewCardUrl = ref(null)
const loadingReviewCard = ref(false)

async function loadConfirmCard() {
  if (!event.value?.id) return
  loadingConfirmCard.value = true
  try {
    const res = await api.get(`/api/bookings/bookings/${event.value.id}/share-card/confirmation/`)
    confirmCardUrl.value = res.data.url + '?t=' + Date.now()
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
    reviewCardUrl.value = res.data.url
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

async function _fetchImageBlob(url) {
  const resp = await fetch(url, { mode: 'cors' })
  if (!resp.ok) throw new Error('fetch failed')
  return resp.blob()
}

async function downloadCard(url, filename) {
  try {
    const blob = await _fetchImageBlob(url)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  } catch {
    // CORS blocked — open in new tab so user can long-press / right-click save
    window.open(url.split('?')[0], '_blank')
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
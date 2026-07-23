<template>
  <div class="min-h-screen bg-gray-50 pt-14 md:pt-0">
    <AdminSidebar />
    <div class="md:ml-64 pb-24">

      <!-- Sticky header -->
      <div class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center gap-3 px-4 py-3">
          <button @click="handleBack"
            class="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 flex-shrink-0">
            <i class="fa-solid fa-arrow-left text-sm"></i>
          </button>
          <div class="flex-1 min-w-0">
            <div class="text-base font-bold text-gray-900">Nueva Reserva</div>
            <div class="text-xs text-gray-400">{{ STEPS[currentStep] }} — {{ currentStep + 1 }} de {{ STEPS.length }}</div>
          </div>
        </div>
        <div class="w-full h-0.5 bg-gray-100">
          <div class="h-0.5 bg-indigo-500 transition-all duration-300"
            :style="{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }"></div>
        </div>
      </div>

      <!-- Step content -->
      <div class="px-4 py-6 max-w-lg mx-auto">

        <!-- ── Step 0: Cliente ── -->
        <div v-if="currentStep === 0">
          <h2 class="text-xl font-bold text-gray-900 mb-1">¿Para quién es la reserva?</h2>
          <p class="text-sm text-gray-400 mb-5">Busca un cliente registrado o ingresa los datos de uno nuevo.</p>

          <div class="flex rounded-xl bg-gray-100 p-1 mb-5">
            <button v-for="mode in clientModes" :key="mode.value" @click="clientMode = mode.value"
              :class="['flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all',
                clientMode === mode.value ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600']">
              {{ mode.label }}
            </button>
          </div>

          <template v-if="clientMode === 'registered'">
            <div class="relative mb-3">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
              <input v-model="userSearchQuery" @input="onUserSearch" v-focus-desktop
                class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                placeholder="Buscar por nombre, email o teléfono..."
                style="font-size: 16px;" />
            </div>
            <div v-if="userSearchLoading" class="py-8 text-center text-sm text-gray-400">
              <i class="fa-solid fa-circle-notch fa-spin mr-1.5"></i> Buscando...
            </div>
            <div v-else-if="userSearchResults.length > 0" class="space-y-2">
              <button v-for="u in userSearchResults" :key="u.id" @click="selectUser(u)"
                :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left',
                  selectedUser?.id === u.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-100 bg-white hover:border-indigo-200']">
                <div class="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm uppercase">
                  {{ (u.first_name?.[0] || '') + (u.last_name?.[0] || '') || '?' }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-sm text-gray-900">{{ u.first_name }} {{ u.last_name }}</div>
                  <div class="text-xs text-gray-400 truncate">{{ u.email }}</div>
                  <div v-if="u.phone" class="text-xs text-gray-400">{{ u.phone }}</div>
                </div>
                <i v-if="selectedUser?.id === u.id" class="fa-solid fa-circle-check text-indigo-500 flex-shrink-0"></i>
              </button>
            </div>
            <div v-else-if="userSearchQuery.length >= 2 && !userSearchLoading" class="py-8 text-center">
              <div class="text-gray-400 text-sm mb-2">Sin resultados para "{{ userSearchQuery }}"</div>
              <button @click="clientMode = 'guest'" class="text-sm text-indigo-500 font-semibold hover:text-indigo-700">
                + Crear nuevo cliente
              </button>
            </div>
            <div v-if="selectedUser" class="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
              <i class="fa-solid fa-circle-check text-green-500 flex-shrink-0"></i>
              <div class="flex-1 text-sm font-semibold text-green-800">{{ selectedUser.first_name }} {{ selectedUser.last_name }}</div>
              <button @click="selectedUser = null; userSearchQuery = ''; userSearchResults = []"
                class="text-xs text-gray-400 hover:text-gray-600">Cambiar</button>
            </div>
          </template>

          <template v-else>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Nombre *</label>
                  <input v-model="guestForm.first_name"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    placeholder="María" style="font-size: 16px;" />
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Apellido *</label>
                  <input v-model="guestForm.last_name"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    placeholder="García" style="font-size: 16px;" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Teléfono *</label>
                <input v-model="guestForm.phone" type="tel"
                  class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="55 1234 5678" style="font-size: 16px;" />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 mb-1.5 block">
                  Correo <span class="font-normal text-gray-300">(opcional)</span>
                </label>
                <input v-model="guestForm.email" type="email"
                  class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="maria@correo.com" style="font-size: 16px;" />
              </div>
              <p class="text-xs text-gray-400 pt-1">
                <i class="fa-solid fa-info-circle mr-1"></i>
                Se creará una cuenta invitada automáticamente que el cliente puede reclamar más adelante.
              </p>
            </div>
          </template>
        </div>

        <!-- ── Step 1: Fecha ── -->
        <div v-if="currentStep === 1">
          <h2 class="text-xl font-bold text-gray-900 mb-1">¿Cuándo es el evento?</h2>
          <p class="text-sm text-gray-400 mb-5">Selecciona una fecha disponible.</p>
          <CalendarPicker v-model="selectedDate" :isStaff="false" />
          <div v-if="selectedDate" class="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-200">
            <i class="fa-solid fa-calendar-check text-indigo-500 flex-shrink-0"></i>
            <span class="text-sm font-semibold text-indigo-800 capitalize">{{ formatDate(selectedDate) }}</span>
          </div>
        </div>

        <!-- ── Step 2: Paquete ── -->
        <div v-if="currentStep === 2">
          <h2 class="text-xl font-bold text-gray-900 mb-1">Selecciona un paquete</h2>
          <p class="text-sm text-gray-400 mb-5">Elige el paquete que mejor se adapte al evento.</p>
          <div v-if="packagesLoading" class="py-10 text-center text-sm text-gray-400">
            <i class="fa-solid fa-circle-notch fa-spin mr-1.5"></i> Cargando...
          </div>
          <div v-else class="space-y-3">
            <button v-for="pkg in packages" :key="pkg.id" @click="selectedPackage = pkg"
              :class="['w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 transition-all text-left',
                selectedPackage?.id === pkg.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-100 bg-white hover:border-indigo-200']">
              <div class="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                <i :class="[pkg.icon || 'fa-solid fa-users', 'text-indigo-600 text-lg']"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-sm text-gray-900">{{ pkg.title }}</div>
                <div class="text-xs text-gray-400 mt-0.5">Hasta {{ pkg.n_people }} personas</div>
              </div>
              <div class="text-right flex-shrink-0">
                <div class="font-bold text-gray-900">${{ Math.round(pkg.price).toLocaleString('es-MX') }}</div>
                <i v-if="selectedPackage?.id === pkg.id" class="fa-solid fa-circle-check text-indigo-500 mt-0.5 block"></i>
              </div>
            </button>
          </div>
        </div>

        <!-- ── Step 3: Extras ── -->
        <div v-if="currentStep === 3">
          <h2 class="text-xl font-bold text-gray-900 mb-1">Servicios adicionales</h2>
          <p class="text-sm text-gray-400 mb-5">Opcionales — puedes omitir este paso.</p>
          <div v-if="extrasLoading" class="py-10 text-center text-sm text-gray-400">
            <i class="fa-solid fa-circle-notch fa-spin mr-1.5"></i> Cargando...
          </div>
          <div v-else-if="extras.length === 0" class="py-10 text-center text-sm text-gray-400">
            No hay servicios adicionales disponibles.
          </div>
          <div v-else class="space-y-2">
            <button v-for="extra in extras" :key="extra.id" @click="toggleExtra(extra)"
              :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left',
                isExtraSelected(extra.id)
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-100 bg-white hover:border-gray-200']">
              <i :class="[extra.icon || 'fa-solid fa-star', 'text-gray-400 w-4 text-center flex-shrink-0 text-sm']"></i>
              <div class="flex-1 text-sm font-semibold text-gray-800">{{ extra.name }}</div>
              <div class="text-sm font-medium text-gray-500 flex-shrink-0">${{ Number(extra.price).toLocaleString('es-MX') }}</div>
              <i v-if="isExtraSelected(extra.id)" class="fa-solid fa-circle-check text-indigo-500 flex-shrink-0"></i>
            </button>
          </div>
        </div>

        <!-- ── Step 4: Cargos y Descuentos ── -->
        <div v-if="currentStep === 4">
          <h2 class="text-xl font-bold text-gray-900 mb-1">Cargos y descuentos</h2>
          <p class="text-sm text-gray-400 mb-5">Opcionales — agrega cargos extra, cupones o descuentos manuales.</p>

          <!-- Custom charges -->
          <div class="mb-5">
            <div class="flex items-center gap-2 mb-3">
              <i class="fa-solid fa-circle-plus text-orange-400 text-xs w-3.5 text-center"></i>
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Cargos adicionales</span>
            </div>
            <!-- Existing charges list -->
            <div v-if="customCharges.length > 0" class="space-y-2 mb-3">
              <div v-for="(charge, idx) in customCharges" :key="idx"
                class="flex items-center gap-3 px-3 py-2.5 bg-orange-50 border border-orange-200 rounded-xl">
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-gray-800">{{ charge.description }}</div>
                  <div class="text-xs text-orange-600">+${{ Number(charge.price).toLocaleString('es-MX') }}</div>
                </div>
                <button @click="customCharges.splice(idx, 1)"
                  class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-gray-300 hover:text-red-500 transition-colors">
                  <i class="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>
            </div>
            <!-- Add charge form -->
            <div class="flex gap-2">
              <input v-model="newCharge.description"
                class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                placeholder="Descripción" style="font-size: 16px;" />
              <input v-model.number="newCharge.price" type="number" min="1"
                class="w-24 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                placeholder="$0" style="font-size: 16px;" />
              <button @click="addCharge" :disabled="!newCharge.description.trim() || !(newCharge.price > 0)"
                class="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <i class="fa-solid fa-plus text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Coupon -->
          <div class="mb-5">
            <div class="flex items-center gap-2 mb-3">
              <i class="fa-solid fa-tag text-green-400 text-xs w-3.5 text-center"></i>
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Cupón de descuento</span>
            </div>
            <div v-if="couponPreview" class="flex items-center gap-3 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl mb-2">
              <i class="fa-solid fa-circle-check text-green-500 flex-shrink-0 text-sm"></i>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-gray-800">{{ couponPreview.label || couponCode }}</div>
                <div class="text-xs text-green-600">-${{ Math.round(Number(couponPreview.computed_discount)).toLocaleString('es-MX') }}</div>
              </div>
              <button @click="removeCoupon"
                class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-gray-300 hover:text-red-500 transition-colors">
                <i class="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>
            <div v-else class="flex gap-2">
              <input v-model="couponInput" @keydown.enter="validateCoupon"
                class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 uppercase"
                placeholder="Código de cupón" style="font-size: 16px;" />
              <button @click="validateCoupon" :disabled="!couponInput.trim() || couponValidating"
                class="flex-shrink-0 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <i v-if="couponValidating" class="fa-solid fa-circle-notch fa-spin"></i>
                <span v-else>Aplicar</span>
              </button>
            </div>
            <div v-if="couponError" class="mt-1.5 text-xs text-red-500">
              <i class="fa-solid fa-triangle-exclamation mr-1"></i>{{ couponError }}
            </div>
          </div>

          <!-- Manual discounts -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <i class="fa-solid fa-circle-minus text-blue-400 text-xs w-3.5 text-center"></i>
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Descuento manual</span>
            </div>
            <div v-if="manualDiscounts.length > 0" class="space-y-2 mb-3">
              <div v-for="(disc, idx) in manualDiscounts" :key="idx"
                class="flex items-center gap-3 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-gray-800">{{ disc.description }}</div>
                  <div class="text-xs text-blue-600">-${{ Number(disc.amount).toLocaleString('es-MX') }}</div>
                </div>
                <button @click="manualDiscounts.splice(idx, 1)"
                  class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-gray-300 hover:text-red-500 transition-colors">
                  <i class="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>
            </div>
            <div class="flex gap-2">
              <input v-model="newDiscount.description"
                class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                placeholder="Descripción" style="font-size: 16px;" />
              <input v-model.number="newDiscount.amount" type="number" min="1"
                class="w-24 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                placeholder="$0" style="font-size: 16px;" />
              <button @click="addDiscount" :disabled="!newDiscount.description.trim() || !(newDiscount.amount > 0)"
                class="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <i class="fa-solid fa-plus text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- ── Step 5: Descripción ── -->
        <div v-if="currentStep === 5">
          <h2 class="text-xl font-bold text-gray-900 mb-1">Notas adicionales</h2>
          <p class="text-sm text-gray-400 mb-5">Opcionales — agrega cualquier detalle relevante del evento.</p>
          <textarea v-model="description" rows="6"
            class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
            placeholder="Ej: Cumpleaños de 15 años, requieren decoración especial, acceso a las 16:00..."
            style="font-size: 16px;"></textarea>
        </div>

        <!-- ── Step 6: Resumen ── -->
        <div v-if="currentStep === 6">
          <h2 class="text-xl font-bold text-gray-900 mb-1">Resumen de la reserva</h2>
          <p class="text-sm text-gray-400 mb-5">Revisa los detalles antes de crear la reserva.</p>

          <div class="space-y-3">
            <!-- Client -->
            <div class="px-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <i class="fa-solid fa-user text-indigo-400 text-xs w-3.5 text-center"></i>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Cliente</span>
              </div>
              <div class="font-semibold text-gray-900">{{ clientDisplayName }}</div>
              <div v-if="clientDisplayEmail" class="text-sm text-gray-400 mt-0.5">{{ clientDisplayEmail }}</div>
              <div v-if="clientDisplayPhone" class="text-sm text-gray-400">{{ clientDisplayPhone }}</div>
              <div v-if="clientMode === 'guest'" class="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-700 font-medium">
                <i class="fa-solid fa-user-plus text-[10px]"></i> Cuenta invitada
              </div>
            </div>

            <!-- Date -->
            <div class="px-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <i class="fa-solid fa-calendar text-indigo-400 text-xs w-3.5 text-center"></i>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Fecha</span>
              </div>
              <div class="font-semibold text-gray-900 capitalize">{{ formatDate(selectedDate) }}</div>
            </div>

            <!-- Package + extras -->
            <div class="px-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <i class="fa-solid fa-box text-indigo-400 text-xs w-3.5 text-center"></i>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Paquete</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="font-semibold text-gray-900">{{ selectedPackage?.title }}</span>
                <span class="text-gray-500">${{ Math.round(selectedPackage?.price || 0).toLocaleString('es-MX') }}</span>
              </div>
              <div class="text-xs text-gray-400 mt-0.5">{{ selectedPackage?.n_people }} personas</div>
              <template v-if="selectedExtras.length > 0">
                <div class="mt-2 pt-2 border-t border-gray-100 space-y-1">
                  <div v-for="extra in selectedExtras" :key="extra.id" class="flex justify-between text-sm text-gray-600">
                    <span>{{ extra.name }}</span>
                    <span>${{ Number(extra.price).toLocaleString('es-MX') }}</span>
                  </div>
                </div>
              </template>
            </div>

            <!-- Charges & discounts (only if any) -->
            <div v-if="customCharges.length > 0 || couponPreview || manualDiscounts.length > 0"
              class="px-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <i class="fa-solid fa-receipt text-indigo-400 text-xs w-3.5 text-center"></i>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Ajustes</span>
              </div>
              <div v-for="(charge, idx) in customCharges" :key="`c${idx}`" class="flex justify-between text-sm mt-1">
                <span class="text-orange-700">{{ charge.description }}</span>
                <span class="text-orange-600 font-medium">+${{ Number(charge.price).toLocaleString('es-MX') }}</span>
              </div>
              <div v-if="couponPreview" class="flex justify-between text-sm mt-1">
                <span class="text-green-700">{{ couponPreview.label || couponCode }}</span>
                <span class="text-green-600 font-medium">-${{ Math.round(Number(couponPreview.computed_discount)).toLocaleString('es-MX') }}</span>
              </div>
              <div v-for="(disc, idx) in manualDiscounts" :key="`d${idx}`" class="flex justify-between text-sm mt-1">
                <span class="text-blue-700">{{ disc.description }}</span>
                <span class="text-blue-600 font-medium">-${{ Number(disc.amount).toLocaleString('es-MX') }}</span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="description.trim()" class="px-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <i class="fa-solid fa-note-sticky text-indigo-400 text-xs w-3.5 text-center"></i>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Notas</span>
              </div>
              <div class="text-sm text-gray-700 whitespace-pre-line">{{ description }}</div>
            </div>

            <!-- Initial status -->
            <div class="px-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <i class="fa-solid fa-circle-dot text-indigo-400 text-xs w-3.5 text-center"></i>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Estado inicial</span>
              </div>
              <select v-model="initialStatus"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                style="font-size: 16px;">
                <option value="solicitud">Solicitud</option>
                <option value="aceptacion">Aceptación</option>
                <option value="apartado">Apartado</option>
                <option value="liquidado">Liquidado</option>
              </select>
            </div>
          </div>

          <!-- Total breakdown -->
          <div class="mt-4 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
            <div class="flex justify-between text-sm text-indigo-600">
              <span>Subtotal</span>
              <span>${{ subtotalPrice.toLocaleString('es-MX') }}</span>
            </div>
            <div v-if="totalAdjustments !== 0" class="flex justify-between text-sm"
              :class="totalAdjustments > 0 ? 'text-orange-600' : 'text-green-600'">
              <span>Ajustes</span>
              <span>{{ totalAdjustments > 0 ? '+' : '' }}${{ totalAdjustments.toLocaleString('es-MX') }}</span>
            </div>
            <div class="flex justify-between font-bold text-indigo-700 text-base pt-1 border-t border-indigo-200">
              <span>Total estimado</span>
              <span>${{ totalPrice.toLocaleString('es-MX') }}</span>
            </div>
          </div>

          <div v-if="submitError" class="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <i class="fa-solid fa-triangle-exclamation mr-1.5"></i>{{ submitError }}
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom action bar -->
    <div class="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-gray-200 px-4 py-3 flex gap-2">
      <button v-if="currentStep > 0" @click="prevStep"
        class="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0">
        <i class="fa-solid fa-arrow-left text-xs"></i> Atrás
      </button>
      <button v-if="isOptionalStep" @click="currentStep++"
        class="flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-400 hover:bg-gray-50 transition-colors flex-shrink-0">
        Omitir
      </button>
      <button @click="handleNext" :disabled="!canProceed || submitting"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 active:scale-[0.98]">
        <i v-if="submitting" class="fa-solid fa-circle-notch fa-spin"></i>
        <template v-else>
          {{ currentStep === STEPS.length - 1 ? 'Crear Reserva' : 'Continuar' }}
          <i v-if="currentStep < STEPS.length - 1" class="fa-solid fa-arrow-right text-xs"></i>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import AdminSidebar from '@/components/AdminSidebar.vue'
import CalendarPicker from '@/ReservarForm/CalendarPicker.vue'
import api from '@/services/api'

const router = useRouter()
const toast = useToast()

const STEPS = ['Cliente', 'Fecha', 'Paquete', 'Extras', 'Cargos y Descuentos', 'Descripción', 'Resumen']
const OPTIONAL_STEPS = new Set([3, 4, 5])

const clientModes = [
  { value: 'registered', label: 'Cliente registrado' },
  { value: 'guest', label: 'Nuevo cliente' },
]

const currentStep = ref(0)

// ── Step 0: Client ──
const clientMode = ref('registered')
const userSearchQuery = ref('')
const userSearchResults = ref([])
const userSearchLoading = ref(false)
const selectedUser = ref(null)
const guestForm = ref({ first_name: '', last_name: '', phone: '', email: '' })
let searchDebounce = null

// ── Step 1: Date ──
const selectedDate = ref(null)

// ── Step 2: Package ──
const packages = ref([])
const packagesLoading = ref(false)
const selectedPackage = ref(null)

// ── Step 3: Extras ──
const extras = ref([])
const extrasLoading = ref(false)
const selectedExtras = ref([])

// ── Step 4: Charges & Discounts ──
const customCharges = ref([])
const newCharge = ref({ description: '', price: null })
const couponInput = ref('')
const couponCode = ref('')
const couponPreview = ref(null)
const couponValidating = ref(false)
const couponError = ref('')
const manualDiscounts = ref([])
const newDiscount = ref({ description: '', amount: null })

// ── Step 5: Description ──
const description = ref('')

// ── Step 6: Summary ──
const initialStatus = ref('solicitud')
const submitting = ref(false)
const submitError = ref('')

const isOptionalStep = computed(() => OPTIONAL_STEPS.has(currentStep.value))

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      if (clientMode.value === 'registered') return !!selectedUser.value
      return !!(guestForm.value.first_name.trim() && guestForm.value.last_name.trim() && guestForm.value.phone.trim())
    case 1: return !!selectedDate.value
    case 2: return !!selectedPackage.value
    default: return true
  }
})

const clientDisplayName = computed(() => {
  if (clientMode.value === 'registered' && selectedUser.value)
    return `${selectedUser.value.first_name} ${selectedUser.value.last_name}`
  if (clientMode.value === 'guest')
    return `${guestForm.value.first_name} ${guestForm.value.last_name}`.trim() || '—'
  return '—'
})
const clientDisplayEmail = computed(() => clientMode.value === 'registered' ? (selectedUser.value?.email || '') : guestForm.value.email)
const clientDisplayPhone = computed(() => clientMode.value === 'registered' ? (selectedUser.value?.phone || '') : guestForm.value.phone)

const subtotalPrice = computed(() => {
  const pkg = Number(selectedPackage.value?.price || 0)
  const extrasSum = selectedExtras.value.reduce((s, e) => s + Number(e.price), 0)
  return Math.round(pkg + extrasSum)
})

const totalAdjustments = computed(() => {
  const charges = customCharges.value.reduce((s, c) => s + Number(c.price), 0)
  const couponDiscount = couponPreview.value ? Number(couponPreview.value.computed_discount) : 0
  const manualDisc = manualDiscounts.value.reduce((s, d) => s + Number(d.amount), 0)
  return Math.round(charges - couponDiscount - manualDisc)
})

const totalPrice = computed(() => Math.max(0, subtotalPrice.value + totalAdjustments.value))

function formatDate(date) {
  if (!date) return '—'
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function handleBack() {
  if (currentStep.value === 0) router.push('/reservas')
  else prevStep()
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}

async function handleNext() {
  if (currentStep.value === STEPS.length - 1) {
    await submitBooking()
  } else {
    if (!canProceed.value) return
    currentStep.value++
    onStepEnter(currentStep.value)
  }
}

function onStepEnter(step) {
  if (step === 2 && packages.value.length === 0) fetchPackages()
  if (step === 3 && extras.value.length === 0) fetchExtras()
}

// ── User search ──
function onUserSearch() {
  clearTimeout(searchDebounce)
  if (userSearchQuery.value.length < 2) { userSearchResults.value = []; return }
  searchDebounce = setTimeout(searchUsers, 350)
}

async function searchUsers() {
  userSearchLoading.value = true
  try {
    const res = await api.get('/api/users/list/', { params: { q: userSearchQuery.value } })
    userSearchResults.value = res.data?.results ?? res.data ?? []
  } catch { userSearchResults.value = [] }
  finally { userSearchLoading.value = false }
}

function selectUser(u) { selectedUser.value = u }

// ── Packages ──
async function fetchPackages() {
  packagesLoading.value = true
  try {
    const res = await api.get('/api/bookings/packages/')
    packages.value = res.data?.results ?? res.data ?? []
  } catch { packages.value = [] }
  finally { packagesLoading.value = false }
}

// ── Extras ──
async function fetchExtras() {
  extrasLoading.value = true
  try {
    const res = await api.get('/api/bookings/extras/')
    extras.value = (res.data?.results ?? res.data ?? []).filter(e => e.is_active !== false)
  } catch { extras.value = [] }
  finally { extrasLoading.value = false }
}

function toggleExtra(extra) {
  const idx = selectedExtras.value.findIndex(e => e.id === extra.id)
  if (idx >= 0) selectedExtras.value.splice(idx, 1)
  else selectedExtras.value.push(extra)
}

function isExtraSelected(id) { return selectedExtras.value.some(e => e.id === id) }

// ── Custom charges ──
function addCharge() {
  if (!newCharge.value.description.trim() || !(newCharge.value.price > 0)) return
  customCharges.value.push({ description: newCharge.value.description.trim(), price: newCharge.value.price })
  newCharge.value = { description: '', price: null }
}

// ── Coupon ──
async function validateCoupon() {
  if (!couponInput.value.trim() || couponValidating.value) return
  couponValidating.value = true
  couponError.value = ''
  try {
    const res = await api.post('/api/bookings/bookings/validate_coupon_code/', {
      code: couponInput.value.trim(),
      subtotal: subtotalPrice.value,
    })
    couponCode.value = couponInput.value.trim()
    couponPreview.value = res.data
  } catch (err) {
    couponError.value = err.response?.data?.detail || 'Cupón inválido o expirado'
    couponPreview.value = null
    couponCode.value = ''
  } finally {
    couponValidating.value = false
  }
}

function removeCoupon() {
  couponCode.value = ''
  couponPreview.value = null
  couponInput.value = ''
  couponError.value = ''
}

// ── Manual discounts ──
function addDiscount() {
  if (!newDiscount.value.description.trim() || !(newDiscount.value.amount > 0)) return
  manualDiscounts.value.push({ description: newDiscount.value.description.trim(), amount: newDiscount.value.amount })
  newDiscount.value = { description: '', amount: null }
}

// ── Submit ──
async function submitBooking() {
  submitting.value = true
  submitError.value = ''
  try {
    const d = selectedDate.value instanceof Date ? selectedDate.value : new Date(selectedDate.value)
    const payload = {
      package_id: selectedPackage.value.id,
      start_datetime: d.toISOString(),
      end_datetime: d.toISOString(),
      extra_service_ids: selectedExtras.value.map(e => e.id),
      description: description.value || '',
      status: initialStatus.value,
    }

    if (clientMode.value === 'registered' && selectedUser.value) {
      payload.user_id = selectedUser.value.id
    } else if (clientMode.value === 'guest') {
      payload.guest_first_name = guestForm.value.first_name.trim()
      payload.guest_last_name = guestForm.value.last_name.trim()
      payload.guest_phone = guestForm.value.phone.trim()
      payload.guest_email = guestForm.value.email.trim()
    }

    const res = await api.post('/api/bookings/bookings/', payload)
    const bookingId = res.data.id

    // Apply custom charges
    for (const charge of customCharges.value) {
      await api.post(`/api/bookings/bookings/${bookingId}/add_custom_charge/`, {
        description: charge.description,
        price: charge.price,
      })
    }

    // Apply coupon
    if (couponCode.value && couponPreview.value) {
      await api.post(`/api/bookings/bookings/${bookingId}/apply_coupon/`, {
        code: couponCode.value,
      })
    }

    // Apply manual discounts
    for (const disc of manualDiscounts.value) {
      await api.post(`/api/bookings/bookings/${bookingId}/add_discount/`, {
        description: disc.description,
        amount: disc.amount,
      })
    }

    toast.success('Reserva creada exitosamente')
    router.push(`/detalle-reserva/${bookingId}`)
  } catch (err) {
    const data = err.response?.data
    if (data && typeof data === 'object') {
      submitError.value = Object.values(data).flat().join(' ')
    } else {
      submitError.value = 'Error al crear la reserva. Intenta de nuevo.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

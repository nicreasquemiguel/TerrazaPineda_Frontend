<template>
  <div class="min-h-screen bg-white" style="padding-top: 4rem !important;">
    <!-- Desktop Layout (md and larger) -->
    <div class="hidden md:block">
      <!-- Fixed Desktop Sidebar -->
      <div class="fixed top-16 left-0 bottom-0 z-30 flex flex-col w-64 bg-black border-r border-gray-800">
        <!-- User Profile -->
        <div class="p-5 border-b border-gray-800">
          <div class="flex items-center space-x-3">
            <div class="relative flex-shrink-0">
              <div class="flex justify-center items-center w-11 h-11 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                <span class="text-base font-bold text-white">{{ userInitials }}</span>
              </div>
              <div v-if="unreadCount > 0" class="flex absolute -top-1 -right-1 justify-center items-center w-4 h-4 bg-red-500 rounded-full">
                <span class="text-xs font-bold text-white">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <router-link to="/perfil" class="block text-sm font-bold text-white truncate transition-colors hover:text-blue-400">
                {{ userName }}
              </router-link>
              <div class="text-xs text-gray-400">{{ userRole }}</div>
            </div>
            <div class="flex flex-col flex-shrink-0 space-y-1">
              <button
                @click="router.push('/perfil?notifications=true')"
                class="relative p-1.5 text-gray-400 transition-colors hover:text-white"
                title="Ver Notificaciones"
              >
                <i class="fa-solid fa-bell"></i>
                <div v-if="unreadCount > 0" class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              </button>
              <button
                @click="handleLogout"
                class="p-1.5 text-gray-400 transition-colors hover:text-red-400"
                title="Cerrar Sesión"
              >
                <i class="fa-solid fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="overflow-y-auto flex-1 py-3">
          <nav class="px-3 space-y-0.5">
            <!-- Public Navigation -->
            <div
              v-for="item in publicNavigationItems"
              :key="item.name"
              @click="goToPage(item.path)"
              class="flex items-center px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
              :class="isActivePath(item.path) ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <i :class="getNavigationIcon(item.name) + ' w-5 text-center mr-3 text-sm'"></i>
              <span class="text-sm font-medium">{{ item.name }}</span>
            </div>

            <!-- Section divider -->
            <div class="pt-3 pb-1.5">
              <div class="px-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">Mi cuenta</div>
            </div>

            <!-- Authenticated Navigation -->
            <div
              v-for="item in filteredAuthenticatedItems"
              :key="item.name"
              @click="goToPage(item.path)"
              class="flex items-center px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
              :class="isActivePath(item.path) ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <i :class="getNavigationIcon(item.name) + ' w-5 text-center mr-3 text-sm'"></i>
              <span class="text-sm font-medium">{{ item.name }}</span>
            </div>
          </nav>
        </div>
      </div>

      <!-- Desktop Main Content -->
      <div class="p-6 bg-white min-h-[calc(100vh-4rem)]" style="margin-left: 16rem;">
        <div class="max-w-6xl" style="margin-left: max(0px, calc((100vw - 72rem) / 2 - 16rem)); margin-right: auto;">
          <!-- Header -->
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-800">Panel de Administración de Reservas</h1>
            <div class="relative">
              <input 
                type="text" 
                placeholder="Buscar" 
                class="py-2 pr-4 pl-10 w-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <i class="absolute left-3 top-1/2 text-gray-400 transform -translate-y-1/2 fa-solid fa-search"></i>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="py-8 text-center">
            <div class="inline-block w-6 h-6 rounded-full border-b-2 border-blue-500 animate-spin"></div>
            <p class="mt-2 text-sm text-gray-500">Cargando panel...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="py-8 text-center">
            <div class="flex justify-center items-center mx-auto mb-2 w-8 h-8 bg-red-100 rounded-full">
              <i class="text-sm text-red-500 fa-solid fa-exclamation-triangle"></i>
            </div>
            <p class="text-sm text-red-500">{{ error }}</p>
          </div>

          <!-- Dashboard content -->
          <div v-else-if="dashboardData">
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 gap-4 mb-6 xl:grid-cols-4">
              <div 
                v-for="(card, index) in statsCards" 
                :key="index"
                class="relative flex-shrink-0 p-4 w-full rounded-xl border-2 border-gray-100 shadow-sm"
                :style="{
                  background: card.gradient
                }"
              >
                <!-- Card Indicator (inside the card) -->
                <div class="absolute top-3 right-3">
                  <div 
                    class="w-3 h-3 rounded-full border-2 border-white transition-colors duration-300 cursor-pointer"
                    :class="currentCardIndex === index ? 'bg-white' : 'bg-transparent'"
                    @click="goToCard(index)"
                  ></div>
                  </div>
                
                
                <!-- Stats Card Content -->
                <div v-if="card.type === 'stats'" class="flex justify-between items-center">
                  <div class="text-white">
                    <div class="text-sm opacity-90">{{ card.title }}</div>
                    <div class="text-2xl font-bold">{{ card.value }}</div>
                    <div class="flex items-center mt-1 space-x-2">
                      <i class="text-xs fa-solid fa-arrow-up"></i>
                      <span class="text-xs font-medium opacity-90">{{ card.percentage }}</span>
                  </div>
                </div>
                  <div class="text-white opacity-80">
                    <i :class="card.icon + ' text-2xl'"></i>
                  </div>
                </div>

                <!-- Calendar Event Card Content (Desktop) -->
                <div v-else-if="card.type === 'calendar-event'" class="text-white">
                  <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium opacity-90">{{ card.title }}</span>
                      <span 
                        class="px-1.5 py-0.5 text-xs font-medium text-white bg-white bg-opacity-30 rounded-full"
                      >
                        {{ getStatusText(card.eventData.bookings?.[0]?.status || 'pendiente') }}
                      </span>
                    </div>
                    <button 
                      @click="closeCalendarEventCard"
                      class="text-white opacity-80 hover:opacity-100"
                    >
                      <i class="text-sm fa-solid fa-times"></i>
                    </button>
                  </div>
                  
                  <!-- Ultra compact info -->
                  <div class="mb-2">
                    <div class="text-xs font-semibold truncate mb-1">{{ card.eventData.bookings?.[0]?.package_name || 'Package' }}</div>
                    <div class="flex items-center justify-between text-xs">
                      <div class="flex items-center space-x-1">
                        <span class="px-1.5 py-0.5 text-white bg-white bg-opacity-20 rounded text-xs">
                          {{ card.eventData.bookings?.[0]?.people_count || 0 }}p
                        </span>
                        <span class="px-1.5 py-0.5 text-white bg-white bg-opacity-20 rounded text-xs">
                          ${{ parseFloat(card.eventData.bookings?.[0]?.amount_due || 0).toLocaleString() }}
                        </span>
                      </div>
                      <a 
                        :href="`tel:${card.eventData.bookings?.[0]?.client_phone}`"
                        class="text-white opacity-75 hover:opacity-100 text-xs"
                      >
                        <i class="fa-solid fa-phone mr-1"></i>{{ card.eventData.bookings?.[0]?.client_phone }}
                      </a>
                    </div>
                  </div>
                  
                  <!-- Client name and link in one line -->
                  <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center space-x-1">
                      <i class="fa-solid fa-user"></i>
                      <span class="truncate">{{ card.eventData.bookings?.[0]?.client_first_name }} {{ card.eventData.bookings?.[0]?.client_last_name }}</span>
                    </div>
                    <a 
                      :href="`/detalle-reserva/${card.eventData.bookings?.[0]?.booking_id}`"
                      class="px-2 py-1 text-xs font-medium text-white bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-all duration-200"
                    >
                      <i class="fa-solid fa-eye mr-1"></i>Ver
                    </a>
                  </div>
                </div>

                <!-- Event Card Content -->
                <div v-else-if="card.type === 'event'" class="text-white">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center space-x-2">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm opacity-90">{{ card.title }}</span>
                        <span 
                          class="px-2 py-1 text-xs font-medium text-white bg-white bg-opacity-30 rounded-full"
                        >
                          {{ getStatusText(card.eventData.bookings?.[0]?.status || 'pendiente') }}
                        </span>
                      </div>
                    </div>
                    <button 
                      @click="closeEventDetails"
                      class="text-white opacity-80 hover:opacity-100"
                    >
                      <i class="text-lg fa-solid fa-times"></i>
                    </button>
                  </div>
                  
                  <div class="mb-2 text-lg font-bold">{{ card.eventData.bookings?.[0]?.package_name || 'Package' }}</div>
                  
                  <div class="space-y-1">
                    <div 
                      v-for="booking in card.eventData.bookings || []" 
                      :key="booking.booking_id"
                      class="p-1.5 bg-white bg-opacity-20 rounded-lg"
                    >
                      <div class="text-xs opacity-90">
                        <span class="flex items-center mb-0.5">
                          <i class="mr-1 fa-solid fa-dollar-sign"></i>
                          ${{ parseFloat(booking.amount_due || 0).toLocaleString() }}
                        </span>
                        <span class="flex items-center mb-0.5">
                          <i class="mr-1 fa-solid fa-user"></i>
                          {{ booking.client_first_name }} {{ booking.client_last_name }}
                        </span>
                        <a 
                          :href="`tel:${booking.client_phone}`"
                          class="flex items-center text-sm text-white opacity-90 cursor-pointer hover:text-white"
                          @click="makeCall(booking.client_phone)"
                        >
                          <i class="mr-1 fa-solid fa-phone"></i>
                          <span class="underline">{{ booking.client_phone }}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Calendar Section -->
            <div class="overflow-hidden mb-8 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div class="px-6 py-4 border-b border-gray-100">
                <h3 class="text-lg font-bold text-gray-800">Calendario Semanal</h3>
              </div>
              
              <!-- Loading State -->
              <div v-if="weekCalendarLoading" class="p-8 text-center">
                <div class="text-gray-500">Cargando calendario...</div>
              </div>
              
              <!-- Calendar Content -->
              <div v-else-if="weekCalendarData?.daily_cards && weekCalendarData.daily_cards.length > 0">
                <div class="relative px-6 py-4">
                  <!-- Navigation Arrows -->
                  <button 
                    @click="goToPreviousWeek"
                    class="absolute left-2 top-1/2 z-10 p-2 text-gray-600 bg-white rounded-full shadow-sm transform -translate-y-1/2 hover:text-gray-800 hover:bg-gray-100"
                  >
                    <i class="text-sm fa-solid fa-chevron-left"></i>
                  </button>
                  
                  <button 
                    @click="goToNextWeek"
                    class="absolute right-2 top-1/2 z-10 p-2 text-gray-600 bg-white rounded-full shadow-sm transform -translate-y-1/2 hover:text-gray-800 hover:bg-gray-100"
                  >
                    <i class="text-sm fa-solid fa-chevron-right"></i>
                  </button>
                  
                  <!-- Week Header -->
                  <div class="grid grid-cols-7 gap-6 px-8 mb-6">
                    <div 
                      v-for="date in getWeekDates" 
                      :key="date.toISOString()"
                      class="text-center calendar-day"
                      :data-date="date.toISOString()"
                    >
                      <div 
                        class="mb-2 text-sm font-medium text-center text-gray-500"
                        :class="isToday(date) ? 'text-blue-600' : ''"
                      >
                        {{ formatWeekDate(date).charAt(0).toUpperCase() }}
                        </div>
                      <div class="flex justify-center">
                        <button 
                          class="flex justify-center items-center w-12 h-12 text-lg font-medium rounded-full transition-transform cursor-pointer calendar-day hover:scale-110 active:scale-95"
                          :class="[getDayStatusClasses(date), getDayStatus(date) ? 'hover:scale-110' : '']"
                          @click="handleDayClick(date)"
                          type="button"
                          style="min-width: 48px; min-height: 48px; max-width: 48px; max-height: 48px;"
                        >
                          {{ date.getDate() }}
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              
              <!-- Empty State -->
              <div v-else class="p-8 text-center">
                <i class="mb-4 text-4xl text-gray-300 fa-solid fa-calendar"></i>
                <div class="text-gray-500">No hay datos del calendario disponibles</div>
              </div>
            </div>

            <!-- Bookings & Payments Tabbed Section -->
            <div class="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm">
              <!-- Tab Bar -->
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div class="flex p-1 space-x-1 bg-gray-100 rounded-lg">
                  <button
                    @click="activeTab = 'bookings'"
                    class="px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200"
                    :class="activeTab === 'bookings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
                  >
                    Reservas
                    <span v-if="eventsData?.total_requests" class="ml-1.5 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {{ eventsData.total_requests }}
                    </span>
                  </button>
                  <button
                    @click="activeTab = 'payments'"
                    class="px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200"
                    :class="activeTab === 'payments' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
                  >
                    Pagos Pendientes
                    <span v-if="paymentsData?.payments?.length" class="ml-1.5 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                      {{ paymentsData.payments.length }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Bookings Tab -->
              <div v-if="activeTab === 'bookings'">
                <div v-if="eventsLoading" class="py-12 text-center">
                  <div class="inline-block w-6 h-6 rounded-full border-b-2 border-blue-500 animate-spin"></div>
                  <p class="mt-2 text-sm text-gray-500">Cargando reservas...</p>
                </div>
                <div v-else-if="!eventsData?.events?.length" class="py-12 text-center">
                  <i class="mb-3 text-4xl text-gray-300 fa-solid fa-calendar-xmark"></i>
                  <p class="text-gray-500">No hay reservas disponibles</p>
                </div>
                <div v-else class="overflow-x-auto">
                  <table class="w-full">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Cliente</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Fecha</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Paquete</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Personas</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Estado</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                      <tr
                        v-for="event in eventsData.events"
                        :key="event.booking_id"
                        class="transition-colors hover:bg-gray-50 cursor-pointer select-none"
                        @dblclick="navigateToBookingDetail(event.booking_id)"
                      >
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-shrink-0 justify-center items-center w-9 h-9 text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                              {{ (event.client_name || '?').charAt(0).toUpperCase() }}
                            </div>
                            <div>
                              <div class="text-sm font-medium text-gray-900">{{ event.client_name }}</div>
                              <div class="text-xs text-gray-500">{{ event.client_phone }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">{{ formatEventDate(event.start_datetime) }}</div>
                          <div class="text-xs text-gray-500">{{ formatEventTime(event.start_datetime) }}</div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{{ event.package_name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-1 text-sm text-gray-900">
                            <i class="text-xs text-gray-400 fa-solid fa-users"></i>
                            <span>{{ event.people_count }}</span>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusColor(event.status)">
                            {{ getStatusText(event.status) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex justify-end items-center space-x-2">
                            <button
                              @click="openAcceptModal(event)"
                              class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600"
                              title="Aceptar reserva"
                            >
                              <i class="mr-1 fa-solid fa-check"></i> Aceptar
                            </button>
                            <button
                              @click="openRejectModal(event)"
                              class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
                              title="Rechazar reserva"
                            >
                              <i class="mr-1 fa-solid fa-times"></i> Rechazar
                            </button>
                            <button
                              @click="navigateToBookingDetail(event.booking_id)"
                              class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                              title="Ver detalles"
                            >
                              <i class="fa-solid fa-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Payments Tab -->
              <div v-else-if="activeTab === 'payments'">
                <div v-if="paymentsLoading" class="py-12 text-center">
                  <div class="inline-block w-6 h-6 rounded-full border-b-2 border-blue-500 animate-spin"></div>
                  <p class="mt-2 text-sm text-gray-500">Cargando pagos...</p>
                </div>
                <div v-else-if="!paymentsData?.payments?.length" class="py-12 text-center">
                  <i class="mb-3 text-4xl text-gray-300 fa-solid fa-check-circle"></i>
                  <p class="font-medium text-gray-500">No hay pagos pendientes</p>
                  <p class="mt-1 text-sm text-gray-400">Todos los pagos han sido procesados</p>
                </div>
                <div v-else class="overflow-x-auto">
                  <table class="w-full">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Cliente</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Fecha Evento</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Monto Pago</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Por Pagar</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Estado</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                      <tr
                        v-for="payment in paymentsData.payments"
                        :key="payment.payment_id"
                        class="transition-colors hover:bg-gray-50"
                      >
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-shrink-0 justify-center items-center w-9 h-9 text-sm font-bold text-white bg-gradient-to-br from-green-500 to-blue-600 rounded-full">
                              {{ (payment.user_name || '?').charAt(0).toUpperCase() }}
                            </div>
                            <div class="text-sm font-medium text-gray-900">{{ payment.user_name }}</div>
                          </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{{ formatPaymentDate(payment.booking_date) }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm font-semibold text-green-700">${{ parseFloat(payment.amount || 0).toLocaleString() }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm font-semibold text-red-600">${{ parseFloat(payment.amount_due || 0).toLocaleString() }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pendiente</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex justify-end items-center space-x-2">
                            <button
                              @click="approvePayment(payment.payment_id)"
                              class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600"
                              title="Aprobar pago"
                            >
                              <i class="mr-1 fa-solid fa-check"></i> Aprobar
                            </button>
                            <button
                              @click="openPaymentRejectModal(payment)"
                              class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
                              title="Rechazar pago"
                            >
                              <i class="mr-1 fa-solid fa-times"></i> Rechazar
                            </button>
                            <button
                              v-if="payment.payment_photo_base64"
                              @click="openPaymentPhotoModal(payment.payment_photo_base64)"
                              class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                              title="Ver comprobante"
                            >
                              <i class="fa-solid fa-image"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout (sm and smaller) -->
    <div class="pb-20 bg-white md:hidden">

      <!-- Week Calendar -->
      <div class="px-4 pt-2 pb-2">
        <div v-if="weekCalendarLoading" class="py-4 text-sm text-center text-gray-500">Cargando calendario...</div>
        <div v-else class="relative px-6">
          <button @click="goToPreviousWeek" class="absolute left-0 top-1/2 z-10 p-1 text-gray-600 bg-white rounded-full shadow-sm -translate-y-1/2">
            <i class="text-sm fa-solid fa-chevron-left"></i>
          </button>
          <button @click="goToNextWeek" class="absolute right-0 top-1/2 z-10 p-1 text-gray-600 bg-white rounded-full shadow-sm -translate-y-1/2">
            <i class="text-sm fa-solid fa-chevron-right"></i>
          </button>
          <div class="grid grid-cols-7 gap-1 px-2 mb-2">
            <div v-for="date in getWeekDates" :key="date.toISOString()" class="text-center calendar-day" :data-date="date.toISOString()">
              <div class="mb-1 text-xs font-medium text-gray-500" :class="isToday(date) ? 'text-blue-600' : ''">
                {{ formatWeekDate(date).charAt(0).toUpperCase() }}
              </div>
              <div class="flex justify-center">
                <button
                  class="flex justify-center items-center w-9 h-9 text-sm font-medium rounded-full transition-transform cursor-pointer calendar-day touch-manipulation active:scale-95"
                  :class="[getDayStatusClasses(date), getDayStatus(date) ? '' : '']"
                  @click="handleDayClick(date)"
                  type="button"
                  style="min-width:36px;min-height:36px;max-width:36px;max-height:36px;"
                >
                  {{ date.getDate() }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar Event Inline Panel -->
        <div v-if="showCalendarEventCard && selectedCalendarEvent" class="mt-2">
          <div class="p-4 rounded-xl text-white" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold">{{ selectedCalendarEvent.dayData?.day_name }} {{ selectedCalendarEvent.dayData?.day_number }}</span>
                <span class="px-2 py-0.5 text-xs bg-white bg-opacity-30 rounded-full">
                  {{ getStatusText(selectedCalendarEvent.bookings?.[0]?.status || 'pendiente') }}
                </span>
              </div>
              <button @click="closeCalendarEventCard" class="text-white opacity-80">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="text-sm font-bold truncate mb-2">{{ selectedCalendarEvent.bookings?.[0]?.package_name }}</div>
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2 py-1 bg-white bg-opacity-20 rounded-full">{{ selectedCalendarEvent.bookings?.[0]?.people_count }}p</span>
                <span class="px-2 py-1 bg-white bg-opacity-20 rounded-full">${{ parseFloat(selectedCalendarEvent.bookings?.[0]?.amount_due || 0).toLocaleString() }}</span>
                <span class="px-2 py-1 bg-white bg-opacity-20 rounded-full truncate max-w-[120px]">
                  {{ selectedCalendarEvent.bookings?.[0]?.client_first_name }} {{ selectedCalendarEvent.bookings?.[0]?.client_last_name }}
                </span>
              </div>
              <a :href="`/detalle-reserva/${selectedCalendarEvent.bookings?.[0]?.booking_id}`" class="px-2 py-1 bg-white bg-opacity-20 rounded text-white">
                <i class="fa-solid fa-eye mr-1"></i>Ver
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid (2×2) -->
      <div class="grid grid-cols-2 gap-3 px-4 mb-4">
        <div
          v-for="(card, index) in statsCards.filter(c => c.type === 'stats')"
          :key="index"
          class="p-4 rounded-xl shadow-sm"
          :style="{ background: card.gradient }"
        >
          <div class="flex justify-between items-start">
            <div class="text-white">
              <div class="text-xs opacity-80 mb-1">{{ card.title }}</div>
              <div class="text-2xl font-bold">{{ card.value }}</div>
              <div class="flex items-center mt-1">
                <i class="text-xs fa-solid fa-arrow-up mr-1 opacity-80"></i>
                <span class="text-xs opacity-80">{{ card.percentage }}</span>
              </div>
            </div>
            <i :class="card.icon + ' text-xl text-white opacity-70 mt-1'"></i>
          </div>
        </div>
      </div>

      <!-- Bookings / Payments List -->
      <div class="px-4">
        <!-- Bookings Tab -->
        <div v-if="activeTab === 'bookings'">
          <h3 class="mb-3 text-base font-semibold text-gray-800">Reservas ({{ eventsData?.total_requests || 0 }})</h3>
          <div v-if="eventsLoading" class="py-6 text-sm text-center text-gray-500">Cargando reservas...</div>
          <div v-else-if="eventsData?.events?.length" class="space-y-3">
            <div
              v-for="event in eventsData.events"
              :key="event?.booking_id"
              class="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div class="flex flex-shrink-0 justify-center items-center w-11 h-11 text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                  {{ event?.people_count || 0 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-gray-900 truncate">{{ event?.client_name }}</div>
                  <div class="text-xs text-gray-500 truncate">{{ event?.package_name }} · {{ formatEventDate(event?.start_datetime) }}</div>
                </div>
                <span class="flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(event?.status || 'pendiente')">
                  {{ getStatusText(event?.status || 'pendiente') }}
                </span>
              </div>
              <div class="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                <button @click.stop="openAcceptModal(event)" class="flex-1 py-2 text-xs font-semibold text-white bg-green-500 rounded-lg active:bg-green-600">
                  <i class="fa-solid fa-check mr-1"></i>Aceptar
                </button>
                <button @click.stop="openRejectModal(event)" class="flex-1 py-2 text-xs font-semibold text-white bg-red-500 rounded-lg active:bg-red-600">
                  <i class="fa-solid fa-times mr-1"></i>Rechazar
                </button>
                <button @click.stop="navigateToBookingDetail(event?.booking_id)" class="px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded-lg active:bg-blue-600">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="py-8 text-center text-gray-500">
            <div class="text-base font-medium">No hay reservas disponibles</div>
          </div>
        </div>

        <!-- Payments Tab -->
        <div v-else-if="activeTab === 'payments'">
          <h3 class="mb-3 text-base font-semibold text-gray-800">Pagos Pendientes ({{ paymentsData?.payments?.length || 0 }})</h3>
          <div v-if="paymentsLoading" class="py-6 text-sm text-center text-gray-500">Cargando pagos...</div>
          <div v-else-if="paymentsData?.payments?.length" class="space-y-3">
            <div
              v-for="payment in paymentsData.payments"
              :key="payment?.payment_id"
              class="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div class="flex flex-shrink-0 justify-center items-center w-11 h-11 text-xs font-bold text-white bg-gradient-to-br from-green-500 to-blue-600 rounded-full">
                  ${{ parseFloat(payment?.amount || 0).toLocaleString() }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-gray-900 truncate">{{ payment?.user_name }}</div>
                  <div class="text-xs text-gray-500">{{ formatPaymentDate(payment?.booking_date) }} · Debe: ${{ parseFloat(payment?.amount_due || 0).toLocaleString() }}</div>
                </div>
                <span class="flex-shrink-0 px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Pendiente</span>
              </div>
              <div class="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                <button @click.stop="approvePayment(payment?.payment_id)" class="flex-1 py-2 text-xs font-semibold text-white bg-green-500 rounded-lg active:bg-green-600">
                  <i class="fa-solid fa-check mr-1"></i>Aprobar
                </button>
                <button @click.stop="openPaymentRejectModal(payment)" class="flex-1 py-2 text-xs font-semibold text-white bg-red-500 rounded-lg active:bg-red-600">
                  <i class="fa-solid fa-times mr-1"></i>Rechazar
                </button>
                <button v-if="payment?.payment_photo_base64" @click.stop="openPaymentPhotoModal(payment.payment_photo_base64)" class="px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded-lg active:bg-blue-600">
                  <i class="fa-solid fa-image"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="py-8 text-center text-gray-500">
            <div class="text-base font-medium">No hay pagos pendientes</div>
            <div class="mt-1 text-sm">Todos los pagos han sido procesados</div>
          </div>
        </div>
      </div>

      <!-- Bottom Tab Toggle (sticky) -->
      <div class="fixed bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-white border-t border-gray-100 z-20">
        <div class="relative p-1 bg-gray-200 rounded-2xl">
          <div
            class="absolute top-1 left-1 w-1/2 h-[calc(100%-8px)] bg-blue-600 rounded-xl transition-transform duration-300 ease-in-out"
            :class="activeTab === 'bookings' ? 'translate-x-0' : 'translate-x-full'"
          ></div>
          <div class="flex relative">
            <button
              @click="activeTab = 'bookings'"
              class="relative z-10 flex-1 py-3 text-base font-bold rounded-xl transition-colors duration-300"
              :class="activeTab === 'bookings' ? 'text-white' : 'text-black'"
            >
              Reservas
            </button>
            <button
              @click="activeTab = 'payments'"
              class="relative z-10 flex-1 py-3 text-base font-bold rounded-xl transition-colors duration-300"
              :class="activeTab === 'payments' ? 'text-white' : 'text-black'"
            >
              Pagos
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Animation Overlay -->
    <div v-if="successAnimation" class="fixed bottom-6 left-1/2 z-50 transform -translate-x-1/2 pointer-events-none">
      <div class="px-4 py-3 max-w-2xl text-white bg-green-500 rounded-lg shadow-lg animate-bounce">
        <div class="flex items-center space-x-2">
          <i class="text-lg fa-solid fa-check-circle"></i>
          <span class="text-sm font-bold">{{ successMessage }}</span>
        </div>
      </div>
    </div>

    <!-- Accept Confirmation Modal -->
    <div v-if="showAcceptModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
      <div class="p-6 mx-4 w-full max-w-md bg-white rounded-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Confirmar Aceptación</h3>
          <button 
            @click="closeAcceptModal"
            class="text-gray-400 transition-colors hover:text-gray-600"
          >
            <i class="text-xl fa-solid fa-times"></i>
          </button>
        </div>
        
        <div class="mb-4">
          <p class="mb-2 text-gray-600">
            ¿Estás seguro de que quieres aceptar esta reserva?
          </p>
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="font-medium text-gray-900">{{ selectedBookingForAccept?.client_name }}</div>
            <div class="text-sm text-gray-600">{{ selectedBookingForAccept?.package_name }}</div>
            <div class="text-sm text-gray-500">{{ formatEventDate(selectedBookingForAccept?.start_datetime) }}</div>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="closeAcceptModal"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            @click="confirmAcceptBooking"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">Procesando...</span>
            <span v-else>Aceptar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
      <div class="p-6 mx-4 w-full max-w-md bg-white rounded-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Rechazar Reserva</h3>
          <button 
            @click="closeRejectModal"
            class="text-gray-400 transition-colors hover:text-gray-600"
          >
            <i class="text-xl fa-solid fa-times"></i>
          </button>
        </div>
        
        <div class="mb-4">
          <p class="mb-2 text-gray-600">
            ¿Estás seguro de que quieres rechazar esta reserva?
          </p>
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="font-medium text-gray-900">{{ selectedBooking?.client_name }}</div>
            <div class="text-sm text-gray-600">{{ selectedBooking?.package_name }}</div>
            <div class="text-sm text-gray-500">{{ formatEventDate(selectedBooking?.start_datetime) }}</div>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Razón del rechazo *
          </label>
          <textarea
            v-model="rejectReason"
            rows="3"
            class="px-3 py-2 w-full rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingresa la razón del rechazo..."
            required
          ></textarea>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="closeRejectModal"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            @click="rejectBooking(selectedBooking.booking_id, rejectReason)"
            :disabled="!rejectReason.trim() || isSubmitting"
            class="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">Procesando...</span>
            <span v-else>Rechazar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Reject Modal -->
    <div v-if="showPaymentRejectModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
      <div class="p-6 mx-4 w-full max-w-md bg-white rounded-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Rechazar Pago</h3>
          <button 
            @click="closePaymentRejectModal"
            class="text-gray-400 transition-colors hover:text-gray-600"
          >
            <i class="text-xl fa-solid fa-times"></i>
          </button>
        </div>
        
        <div class="mb-4">
          <p class="mb-2 text-gray-600">
            ¿Estás seguro de que quieres rechazar este pago?
          </p>
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="font-medium text-gray-900">{{ selectedPayment?.user_name }}</div>
            <div class="text-sm text-gray-600">Monto: ${{ parseFloat(selectedPayment?.amount || 0).toLocaleString() }}</div>
            <div class="text-sm text-gray-500">{{ formatPaymentDate(selectedPayment?.booking_date) }}</div>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Razón del rechazo *
          </label>
          <textarea
            v-model="paymentRejectReason"
            rows="3"
            class="px-3 py-2 w-full rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingresa la razón del rechazo..."
            required
          ></textarea>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="closePaymentRejectModal"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            @click="rejectPayment(selectedPayment.payment_id, paymentRejectReason)"
            :disabled="!paymentRejectReason.trim() || isSubmitting"
            class="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">Procesando...</span>
            <span v-else>Rechazar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Photo Modal -->
    <div v-if="showPaymentPhotoModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-75">
      <div class="p-4 mx-4 w-full max-w-4xl bg-white rounded-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Comprobante de Pago</h3>
          <button 
            @click="showPaymentPhotoModal = false"
            class="text-gray-400 transition-colors hover:text-gray-600"
          >
            <i class="text-xl fa-solid fa-times"></i>
          </button>
        </div>
        
        <div class="flex justify-center">
          <img 
            :src="paymentPhotoModalSrc"
            alt="Comprobante de pago"
            class="object-contain max-w-full max-h-96 rounded-lg"
          />
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div v-if="showEventDetailsModal" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-75">
      <div class="p-6 mx-4 w-full max-w-2xl bg-white rounded-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Detalles de la Reserva</h3>
          <button 
            @click="showEventDetailsModal = false"
            class="text-gray-400 transition-colors hover:text-gray-600"
          >
            <i class="text-xl fa-solid fa-times"></i>
          </button>
        </div>
        
        <div v-if="selectedEvent" class="space-y-4">
          <!-- Client Information -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="mb-2 font-medium text-gray-900">Información del Cliente</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="flex-shrink-0 text-gray-600">Nombre:</span>
                <span class="ml-2 font-medium text-right text-gray-900 truncate">{{ selectedEvent.client_name }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex-shrink-0 text-gray-600">Email:</span>
                <span class="ml-2 font-medium text-right text-gray-900 truncate">{{ selectedEvent.client_email }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex-shrink-0 text-gray-600">Teléfono:</span>
                <span class="ml-2 font-medium text-right text-gray-900 truncate">{{ selectedEvent.client_phone }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex-shrink-0 text-gray-600">Personas:</span>
                <span class="ml-2 font-medium text-right text-gray-900 truncate">{{ selectedEvent.people_count }}</span>
              </div>
            </div>
          </div>
          
          <!-- Event Details -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="mb-2 font-medium text-gray-900">Detalles del Evento</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="flex-shrink-0 text-gray-600">Paquete:</span>
                <span class="ml-2 font-medium text-right text-gray-900 truncate">{{ selectedEvent.package_name }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex-shrink-0 text-gray-600">Fecha:</span>
                <span class="ml-2 font-medium text-right text-gray-900 truncate">{{ formatEventDate(selectedEvent.start_datetime) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex-shrink-0 text-gray-600">Hora:</span>
                <span class="ml-2 font-medium text-right text-gray-900 truncate">{{ formatEventTime(selectedEvent.start_datetime) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex-shrink-0 text-gray-600">Estado:</span>
                <span class="ml-2 font-medium text-right text-gray-900 truncate">{{ getStatusText(selectedEvent.status) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Additional Information -->
          <div v-if="selectedEvent.additional_notes" class="p-4 bg-gray-50 rounded-lg">
            <h4 class="mb-2 font-medium text-gray-900">Notas Adicionales</h4>
            <p class="text-sm text-gray-700 break-words">{{ selectedEvent.additional_notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const isActivePath = (path) => router.currentRoute.value.path === path
const toast = inject('$toast')

// Dashboard data state
const dashboardData = ref(null)
const eventsData = ref(null)
const paymentsData = ref(null)
const loading = ref(true)
const eventsLoading = ref(true)
const paymentsLoading = ref(true)
const error = ref(null)

// Week calendar state
const currentWeekStart = ref(null)
const weekCalendarData = ref(null)
const weekCalendarLoading = ref(false)

// Mobile sidebar state
const showMobileSidebar = ref(false)

// Initialize current week start
const initializeCurrentWeekStart = () => {
  console.log('=== initializeCurrentWeekStart called ===')
  const today = new Date()
  console.log('Today:', today)
  
  const dayOfWeek = today.getDay()
  console.log('Day of week:', dayOfWeek)
  
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  console.log('Monday offset:', mondayOffset)
  
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)
  console.log('Calculated Monday:', monday)
  
  currentWeekStart.value = monday
  console.log('Set currentWeekStart.value to:', currentWeekStart.value)
}

// Auto-rotation for balance card
const currentCardIndex = ref(0)
let rotationInterval = null

// User profile state
const user = ref(null)

// Navigation items (same as navbar)
const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Precios', path: '/precios' },
  { name: 'Reservar', path: '/reservar' },
  { name: 'Fotos', path: '/fotos' },
  { name: 'Reglamento', path: '/reglamento' },
  { name: 'Preguntas', path: '/preguntas-frecuentes' },
]

// Public navigation items (same as Navbar)
const publicNavigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Precios', path: '/precios' },
  { name: 'Fotos', path: '/fotos' },
  { name: 'Reglamento', path: '/reglamento' },
  { name: 'Preguntas', path: '/preguntas-frecuentes' },
]

// Authenticated navigation items
const authenticatedNavigationItems = [
  { name: 'Reservar', path: '/reservar' },
  { name: 'Mis Reservas', path: '/mis-reservas' },
  { name: 'Dashboard', path: '/dashboard', condition: 'staff' },
]

// Filtered authenticated items based on user role
const filteredAuthenticatedItems = computed(() => {
  if (!authStore.isAuthenticated) return []
  
  return authenticatedNavigationItems.filter(item => {
    if (item.condition === 'staff') {
      return authStore.user && (authStore.user.is_staff || authStore.user.role === 'admin')
    }
    return true
  })
})

// Navigation icon mapping
const getNavigationIcon = (name) => {
  const iconMap = {
    'Home': 'fa-solid fa-home',
    'Precios': 'fa-solid fa-tags',
    'Reservar': 'fa-solid fa-calendar-plus',
    'Fotos': 'fa-solid fa-images',
    'Reglamento': 'fa-solid fa-file-contract',
    'Preguntas': 'fa-solid fa-question-circle',
    'Mis Reservas': 'fa-solid fa-calendar-check',
    'Dashboard': 'fa-solid fa-tachometer-alt'
  }
  return iconMap[name] || 'fa-solid fa-link'
}

// Navigation function
const goToPage = (path) => {
  router.push(path)
}

// Notification count
const unreadCount = ref(0)

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    loading.value = true
    const response = await api.get('/api/dashboard/dashboard/overview/')
    dashboardData.value = response.data
    console.log('Dashboard data:', dashboardData.value)
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
    error.value = 'Error al cargar los datos del dashboard'
  } finally {
    loading.value = false
  }
}

// Fetch events data
const fetchEventsData = async () => {
  try {
    eventsLoading.value = true
    console.log('Fetching events data...')
    const response = await api.get('/api/dashboard/dashboard/solicitud_events/')
    console.log('API Response:', response)
    console.log('Response data:', response.data)
    eventsData.value = response.data
    console.log('Events data loaded:', eventsData.value)
    console.log('Events count:', eventsData.value?.events?.length || 0)
    console.log('Total requests:', eventsData.value?.total_requests || 0)
  } catch (err) {
    console.error('Error fetching events data:', err)
    console.error('Error details:', {
      message: err.message,
      response: err.response,
      status: err.response?.status,
      data: err.response?.data
    })
    error.value = 'Error al cargar los eventos'
  } finally {
    eventsLoading.value = false
  }
}

// Fetch payments data
const fetchPaymentsData = async () => {
  try {
    paymentsLoading.value = true
    console.log('Fetching payments data...')
    const response = await api.get('/api/dashboard/dashboard/pending_cash_transfer_payments/')
    console.log('Payments API Response:', response)
    console.log('Payments Response data:', response.data)
            paymentsData.value = response.data
        console.log('Payments data loaded:', paymentsData.value)
        console.log('Payments count:', paymentsData.value?.payments?.length || 0)
  } catch (err) {
    console.error('Error fetching payments data:', err)
    console.error('Error details:', {
      message: err.message,
      response: err.response,
      status: err.response?.status,
      data: err.response?.data
    })
    error.value = 'Error al cargar los pagos'
  } finally {
    paymentsLoading.value = false
  }
}

// Fetch week calendar data
const fetchWeekCalendarData = async (date) => {
  try {
    console.log('=== fetchWeekCalendarData called ===')
    console.log('Input date:', date)
    console.log('Date type:', typeof date)
    
    if (!date) {
      console.error('No date provided to fetchWeekCalendarData')
      return
    }
    
    weekCalendarLoading.value = true
    const formattedDate = date.toISOString().split('T')[0]
    console.log('Formatted date for API:', formattedDate)
    
    const apiUrl = `/api/dashboard/dashboard/daily_cards/?date=${formattedDate}`
    console.log('API URL:', apiUrl)
    
    console.log('Making API call to:', apiUrl)
    const response = await api.get(apiUrl)
    console.log('Week Calendar API Response:', response)
    console.log('Week Calendar Data:', response.data)
    
    weekCalendarData.value = response.data
    console.log('Week calendar data set to:', weekCalendarData.value)
  } catch (err) {
    console.error('Error fetching week calendar data:', err)
    console.error('Error details:', {
      message: err.message,
      response: err.response,
      status: err.response?.status,
      data: err.response?.data
    })
    error.value = 'Error al cargar el calendario semanal'
  } finally {
    weekCalendarLoading.value = false
    console.log('Week calendar loading finished')
  }
}

// Auto-rotate balance cards
const startCardRotation = () => {
  rotationInterval = setInterval(() => {
    currentCardIndex.value = (currentCardIndex.value + 1) % 4
  }, 3000) // Change every 3 seconds
}

const stopCardRotation = () => {
  if (rotationInterval) {
    clearInterval(rotationInterval)
    rotationInterval = null
  }
}

// Get user from auth store
onMounted(async () => {
  if (authStore.user) {
    user.value = authStore.user
  }
  
  // Initialize week calendar
  initializeCurrentWeekStart()
  
  // Test calendar API call directly
  console.log('Testing calendar API call directly...')
  console.log('currentWeekStart.value before call:', currentWeekStart.value)
  try {
    await fetchWeekCalendarData(currentWeekStart.value)
    console.log('Calendar API call completed successfully')
  } catch (error) {
    console.error('Error in direct calendar API call:', error)
  }
  
  await Promise.all([fetchDashboardData(), fetchEventsData(), fetchPaymentsData()])
  startCardRotation()
})

onUnmounted(() => {
  stopCardRotation()
})

// Computed properties for user display
const userName = computed(() => {
  if (!user.value) return 'Admin User'
  
  if (user.value.first_name && user.value.last_name) {
    return `${user.value.first_name} ${user.value.last_name}`
  } else if (user.value.first_name) {
    return user.value.first_name
  } else if (user.value.username) {
    return user.value.username
  } else if (user.value.email) {
    return user.value.email.split('@')[0]
  }
  
  return 'Admin User'
})

const userRole = computed(() => {
  if (!user.value) return 'Admin'
  
  if (user.value.role) {
    return user.value.role.charAt(0).toUpperCase() + user.value.role.slice(1)
  } else if (user.value.is_staff) {
    return 'Staff'
  }
  
  return 'User'
})

const userInitials = computed(() => {
  if (!user.value) return 'AU'
  
  if (user.value.first_name && user.value.last_name) {
    return `${user.value.first_name.charAt(0)}${user.value.last_name.charAt(0)}`.toUpperCase()
  } else if (user.value.first_name) {
    return user.value.first_name.charAt(0).toUpperCase()
  } else if (user.value.username) {
    return user.value.username.charAt(0).toUpperCase()
  }
  
  return 'AU'
})

// Dashboard stats cards
const statsCards = computed(() => {
  if (!dashboardData.value) return []
  
  const baseCards = [
    {
      title: 'Reservas del Mes',
      value: dashboardData.value.current_month?.bookings || 0,
      percentage: `+${dashboardData.value.percentage_changes?.bookings || 0}%`,
      icon: 'fa-solid fa-calendar',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      color: 'from-purple-500 to-purple-600',
      type: 'stats'
    },
    {
      title: 'Ingresos del Mes',
      value: `$${parseFloat(dashboardData.value.current_month?.revenue || 0).toLocaleString()}`,
      percentage: `+${dashboardData.value.percentage_changes?.revenue || 0}%`,
      icon: 'fa-solid fa-dollar-sign',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'from-green-500 to-green-600',
      type: 'stats'
    },
    {
      title: 'Reservas Aceptadas',
      value: dashboardData.value.current_month?.accepted_bookings || 0,
      percentage: `+${dashboardData.value.percentage_changes?.accepted_bookings || 0}%`,
      icon: 'fa-solid fa-check-circle',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'from-blue-500 to-blue-600',
      type: 'stats'
    },
    {
      title: 'Usuarios Activos',
      value: dashboardData.value.active_users || 0,
      percentage: 'Total',
      icon: 'fa-solid fa-users',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      color: 'from-gray-500 to-gray-600',
      type: 'stats'
    }
  ]

  // Add calendar event card if a date is selected from calendar
  if (showCalendarEventCard.value && selectedCalendarEvent.value) {
    console.log('=== Creating calendar event card ===')
    console.log('selectedCalendarEvent.value:', selectedCalendarEvent.value)
    console.log('dayData:', selectedCalendarEvent.value.dayData)
    console.log('bookings:', selectedCalendarEvent.value.bookings)
    
    const totalAmount = selectedCalendarEvent.value.bookings.reduce((sum, booking) => sum + (parseFloat(booking.amount_due) || 0), 0)
    const eventCard = {
      title: `${selectedCalendarEvent.value.dayData.day_name} ${selectedCalendarEvent.value.dayData.day_number}`,
      value: `${selectedCalendarEvent.value.bookings.length} reserva${selectedCalendarEvent.value.bookings.length > 1 ? 's' : ''}`,
      percentage: `$${totalAmount.toLocaleString()}`,
      icon: 'fa-solid fa-calendar-day',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: 'from-orange-500 to-orange-600',
      type: 'calendar-event',
      eventData: selectedCalendarEvent.value
    }
    console.log('Event card created:', eventCard)
    console.log('Returning cards:', [eventCard, ...baseCards.slice(0, 3)])
    // Show only the first 3 base cards + the event card (hide the last base card)
    return [eventCard, ...baseCards.slice(0, 3)]
  }

  // Add single event details card if a day is selected (replaces any existing event card)
  if (selectedEventDay.value && selectedEventDay.value.bookings && selectedEventDay.value.bookings.length > 0) {
    const eventCard = {
      title: `${selectedEventDay.value.day_name} ${selectedEventDay.value.day_number}`,
      value: `$${parseFloat(selectedEventDay.value.amount_due || 0).toLocaleString()}`,
      percentage: 'Total a Deber',
      icon: 'fa-solid fa-calendar-day',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: 'from-orange-500 to-orange-600',
      type: 'event',
      eventData: selectedEventDay.value
    }
    return [eventCard, ...baseCards]
  }

  return baseCards
})

// handleLogout function
const handleLogout = () => {
  authStore.logout(router)
}

// Helper function to get status color
const getStatusColor = (status) => {
  const statusColors = {
    'aceptacion': 'bg-green-100 text-green-800',
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'rechazado': 'bg-red-100 text-red-800',
    'cancelado': 'bg-gray-100 text-gray-800',
    'solicitud': 'bg-blue-100 text-blue-800 '
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

// Helper function to get status text
const getStatusText = (status) => {
  const statusTexts = {
    'aceptacion': 'Aceptado',
    'pendiente': 'Pendiente',
    'rechazado': 'Rechazado',
    'cancelado': 'Cancelado',
    'solicitud': 'Solicitud'
  }
  return statusTexts[status] || status
}

// Helper function to format phone number
const formatPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/\s+/g, ' ').trim()
}

// Make phone call
const makeCall = (phone) => {
  if (phone) {
    window.open(`tel:${phone}`, '_self')
  }
}

// Touch/Swipe functionality for mobile stats cards
const mobileCardsContainer = ref(null)
const touchStartX = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  isDragging.value = true
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return
  touchEndX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  
  const swipeThreshold = 50
  const diff = touchStartX.value - touchEndX.value
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next card
      currentCardIndex.value = (currentCardIndex.value + 1) % statsCards.value.length
    } else {
      // Swipe right - previous card
      currentCardIndex.value = currentCardIndex.value === 0 
        ? statsCards.value.length - 1 
        : currentCardIndex.value - 1
    }
  }
  
  isDragging.value = false
}

const goToCard = (index) => {
  currentCardIndex.value = index
}

// Event details functionality
const selectedEventDay = ref(null)
const activeTab = ref('bookings') // Track which tab is active (Bookings on left)







const showEventDetails = (day) => {
  if (day.bookings && day.bookings.length > 0) {
    selectedEventDay.value = day
    currentCardIndex.value = 0 // Show the event card (first position)
    stopCardRotation() // Stop auto-rotation when showing event details
  }
}

const closeEventDetails = () => {
  selectedEventDay.value = null
  currentCardIndex.value = 0 // Reset to first stats card
  startCardRotation() // Resume auto-rotation when closing event details
}

// Format event date to Spanish format
const formatEventDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  const day = date.getDate()
  const month = months[date.getMonth()]
  
  return `${day} de ${month}`
}

// Function to generate comprehensive tooltip text for events
const getEventTooltipText = (event) => {
  if (!event) return ''
  
  const parts = []
  
  // Client information
  if (event.client_name) {
    parts.push(`Cliente: ${event.client_name}`)
  }
  if (event.client_email) {
    parts.push(`Email: ${event.client_email}`)
  }
  
  // Package and people
  if (event.package_name) {
    parts.push(`Paquete: ${event.package_name}`)
  }
  if (event.people_count) {
    parts.push(`Personas: ${event.people_count}`)
  }
  
  // Venue information
  if (event.venue_name) {
    parts.push(`Lugar: ${event.venue_name}`)
  }
  
  // Date and time information
  if (event.start_datetime) {
    parts.push(`Fecha: ${formatEventDate(event.start_datetime)}`)
  }
  if (event.start_datetime && event.end_datetime) {
    const startTime = new Date(event.start_datetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    const endTime = new Date(event.end_datetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    parts.push(`Horario: ${startTime} - ${endTime}`)
  }
  
  // Price information
  if (event.total_price) {
    parts.push(`Precio: $${parseFloat(event.total_price).toLocaleString()}`)
  }
  
  // Created date
  if (event.created_at) {
    const createdDate = new Date(event.created_at).toLocaleDateString('es-ES')
    parts.push(`Creado: ${createdDate}`)
  }
  
  return parts.join('\n')
}

// Add these refs after the existing ones
const showRejectModal = ref(false)
const selectedBooking = ref(null)
const rejectReason = ref('')
const isSubmitting = ref(false)
const successAnimation = ref(null)
const successMessage = ref('')

// Payment modal refs
const showPaymentRejectModal = ref(false)
const selectedPayment = ref(null)
const paymentRejectReason = ref('')
const showPaymentPhotoModal = ref(false)
const paymentPhotoModalSrc = ref('')
const showEventDetailsModal = ref(false)
const selectedEvent = ref(null)
const showCalendarEventCard = ref(false)
const selectedCalendarEvent = ref(null)

// Safe toast function (fallback if toast is not available)
const safeToast = (type, message) => {
  try {
    if (toast && typeof toast[type] === 'function') {
      toast[type](message)
    } else {
      console.log(`[Toast ${type}]: ${message}`)
      // Fallback to alert if toast is not available
      alert(`${type.toUpperCase()}: ${message}`)
    }
  } catch (error) {
    console.error('Toast error:', error)
    alert(`${type.toUpperCase()}: ${message}`)
  }
}

// Touch/swipe functionality for bookings
const bookingTouchStartX = ref(0)
const bookingTouchStartY = ref(0)
const bookingTouchEndX = ref(0)
const bookingTouchEndY = ref(0)
const currentTouchedBooking = ref(null)
const swipingBooking = ref(null)
const swipeOffset = ref(0)

const handleBookingTouchStart = (e, booking) => {
  // Don't prevent default here - let the click event work
  currentTouchedBooking.value = booking
  swipingBooking.value = booking.booking_id
  // Don't reset swipeOffset here - maintain current position
  bookingTouchStartX.value = e.touches[0].clientX
  bookingTouchStartY.value = e.touches[0].clientY
}

const handleBookingTouchMove = (e) => {
  if (!currentTouchedBooking.value) return
  
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  
  // Update end coordinates for proper swipe detection
  bookingTouchEndX.value = currentX
  bookingTouchEndY.value = currentY
  
  const deltaX = currentX - bookingTouchStartX.value
  const deltaY = currentY - bookingTouchStartY.value
  
  // Only prevent default if there's significant movement (swipe)
  if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
    e.preventDefault()
    e.stopPropagation()
  }
  
  // Add resistance and limit the swipe distance
  const resistance = 0.8
  const maxSwipe = 200
  swipeOffset.value = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX * resistance))
}

const handleBookingTouchEnd = (e, booking) => {
  if (!currentTouchedBooking.value || currentTouchedBooking.value.booking_id !== booking.booking_id) return
  
  const deltaX = bookingTouchEndX.value - bookingTouchStartX.value
  const deltaY = bookingTouchEndY.value - bookingTouchStartY.value
  
  // Minimum swipe distance (40px) and check if it's more horizontal than vertical
  if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
    // This is a swipe - prevent default and handle swipe
    e.preventDefault()
    e.stopPropagation()
    
    if (deltaX > 0) {
      // Swipe right to move card back to center
      swipeOffset.value = 0
      swipingBooking.value = null
    } else {
      // Swipe left to reveal actions - keep card in position
      swipeOffset.value = -165 // Keep card shifted left to show actions, but not too far
      // Keep swipingBooking.value set so card stays shifted
    }
  } else {
    // This is a tap - don't prevent default, let click event fire
    // Reset position
    swipeOffset.value = 0
    swipingBooking.value = null
  }
  
  // Only reset touch state, keep swipe state for left swipes
  currentTouchedBooking.value = null
}

// Add these functions after the existing ones
const rejectBooking = async (bookingId, reason) => {
  try {
    const response = await api.post('/api/dashboard/dashboard/reject_booking/', {
      booking_id: bookingId,
      reason: reason
    })
    
    if (response.status >= 200 && response.status < 300) {
      // Refresh the events data
      await fetchEventsData()
      showSuccessAnimation('❌ Reserva rechazada exitosamente')
      showRejectModal.value = false
      selectedBooking.value = null
      rejectReason.value = ''
      // Close the swipe state after action
      closeSwipe()
    }
  } catch (error) {
    console.error('Error rejecting booking:', error)
    
    // Handle different error types
    if (error.response?.data?.detail) {
      safeToast('error', `Error: ${error.response.data.detail}`)
    } else if (error.response?.status === 404) {
      safeToast('error', 'Reserva no encontrada')
    } else if (error.response?.status === 403) {
      safeToast('error', 'No tienes permisos para rechazar esta reserva')
    } else if (error.message) {
      safeToast('error', `Error: ${error.message}`)
    } else {
      safeToast('error', 'Error al rechazar la reserva')
    }
  }
}

const openRejectModal = (booking) => {
  selectedBooking.value = booking
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  selectedBooking.value = null
  rejectReason.value = ''
}

const handleSwipe = (event, direction, booking) => {
  if (direction === 'left') {
    // Swipe left to reject
    openRejectModal(booking)
  } else if (direction === 'right') {
    // Swipe right to open accept confirmation
    openAcceptModal(booking)
  }
}

// Placeholder function for Más action (future use)
const handleMasAction = (booking) => {
  console.log('Más action for booking:', booking.booking_id)
  // TODO: Add link to booking or other actions
  safeToast('info', 'Más acciones próximamente...')
}

const showSuccessAnimation = (message) => {
  successMessage.value = message
  successAnimation.value = true
  
  setTimeout(() => {
    successAnimation.value = false
    successMessage.value = ''
  }, 2000)
}

// Function to reset card position
const resetCardPosition = () => {
  swipeOffset.value = 0
  swipingBooking.value = null
}

// Function to reset all card positions
const resetAllCards = () => {
  swipeOffset.value = 0
  swipingBooking.value = null
  currentTouchedBooking.value = null
}

// Function to manually close the swipe (reset position)
const closeSwipe = () => {
  swipeOffset.value = 0
  swipingBooking.value = null
}

// Accept Confirmation Modal State
const showAcceptModal = ref(false)
const selectedBookingForAccept = ref(null)

const openAcceptModal = (booking) => {
  selectedBookingForAccept.value = booking
  showAcceptModal.value = true
}

const closeAcceptModal = () => {
  showAcceptModal.value = false
  selectedBookingForAccept.value = null
}

const confirmAcceptBooking = async () => {
  if (!selectedBookingForAccept.value) return
  try {
    const response = await api.post('/api/dashboard/dashboard/approve_booking/', {
      booking_id: selectedBookingForAccept.value.booking_id
    })

    if (response.status >= 200 && response.status < 300) {
      await fetchEventsData()
      showSuccessAnimation('✅ Reserva aprobada exitosamente')
      closeAcceptModal()
      closeSwipe()
    }
  } catch (error) {
    console.error('Error confirming booking:', error)
    if (error.response?.data?.detail) {
      safeToast('error', `Error: ${error.response.data.detail}`)
    } else if (error.response?.status === 404) {
      safeToast('error', 'Reserva no encontrada')
    } else if (error.response?.status === 403) {
      safeToast('error', 'No tienes permisos para aprobar esta reserva')
    } else if (error.message) {
      safeToast('error', `Error: ${error.message}`)
    } else {
      safeToast('error', 'Error al aprobar la reserva')
    }
  }
}

// Payment approval/rejection functions
const approvePayment = async (paymentId) => {
  try {
    const response = await api.post('/api/dashboard/dashboard/approve_cash_transfer_payment/', {
      payment_id: paymentId,
      action: 'approve'
    })
    
    if (response.status >= 200 && response.status < 300) {
      await fetchPaymentsData()
      showSuccessAnimation('✅ Pago aprobado exitosamente')
      closeSwipe()
    }
  } catch (error) {
    console.error('Error approving payment:', error)
    if (error.response?.data?.detail) {
      safeToast('error', `Error: ${error.response.data.detail}`)
    } else {
      safeToast('error', 'Error al aprobar el pago')
    }
  }
}

const rejectPayment = async (paymentId, reason) => {
  try {
    const response = await api.post('/api/dashboard/dashboard/approve_cash_transfer_payment/', {
      payment_id: paymentId,
      action: 'reject',
      reason: reason
    })
    
    if (response.status >= 200 && response.status < 300) {
      await fetchPaymentsData()
      showSuccessAnimation('❌ Pago rechazado exitosamente')
      closePaymentRejectModal()
      closeSwipe()
    }
  } catch (error) {
    console.error('Error rejecting payment:', error)
    if (error.response?.data?.detail) {
      safeToast('error', `Error: ${error.response.data.detail}`)
    } else {
      safeToast('error', 'Error al rechazar el pago')
    }
  }
}

// Touch/swipe functionality for payments
const currentTouchedPayment = ref(null)
const swipingPayment = ref(null)

// Touch/swipe functionality for calendar
const currentTouchedCalendar = ref(null)
const calendarTouchStartX = ref(0)
const calendarTouchEndX = ref(0)

const handlePaymentTouchStart = (e, payment) => {
  e.preventDefault()
  e.stopPropagation()
  currentTouchedPayment.value = payment
  swipingPayment.value = payment.payment_id
  // Don't reset swipeOffset here - maintain current position
  bookingTouchStartX.value = e.touches[0].clientX
  bookingTouchStartY.value = e.touches[0].clientY
}

const handlePaymentTouchMove = (e) => {
  if (!currentTouchedPayment.value) return
  e.preventDefault()
  e.stopPropagation()
  
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  
  // Update end coordinates for proper swipe detection
  bookingTouchEndX.value = currentX
  bookingTouchEndY.value = currentY
  
  const deltaX = currentX - bookingTouchStartX.value
  
  // Add resistance and limit the swipe distance
  const resistance = 0.8
  const maxSwipe = 200
  swipeOffset.value = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX * resistance))
}

const handlePaymentTouchEnd = (e, payment) => {
  if (!currentTouchedPayment.value || currentTouchedPayment.value.payment_id !== payment.payment_id) return
  
  e.preventDefault()
  e.stopPropagation()
  
  const deltaX = bookingTouchEndX.value - bookingTouchStartX.value
  const deltaY = bookingTouchEndY.value - bookingTouchStartY.value
  
  // Minimum swipe distance (40px) and check if it's more horizontal than vertical
  if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      // Swipe right to move card back to center
      swipeOffset.value = 0
      swipingPayment.value = null
    } else {
      // Swipe left to reveal actions - keep card in position
      swipeOffset.value = -165 // Keep card shifted left to show actions, but not too far
      // Keep swipingPayment.value set so card stays shifted
    }
  } else {
    // Not enough swipe distance, reset position
    swipeOffset.value = 0
    swipingPayment.value = null
  }
  
  // Only reset touch state, keep swipe state for left swipes
  currentTouchedPayment.value = null
}

// Add these functions after the existing ones
const openPaymentRejectModal = (payment) => {
  selectedPayment.value = payment
  showPaymentRejectModal.value = true
}

const closePaymentRejectModal = () => {
  showPaymentRejectModal.value = false
  selectedPayment.value = null
  paymentRejectReason.value = ''
}

const openPaymentPhotoModal = (base64Image) => {
  if (base64Image) {
    paymentPhotoModalSrc.value = base64Image
    showPaymentPhotoModal.value = true
  }
}

const openEventDetailsModal = (event) => {
  if (event) {
    selectedEvent.value = event
    showEventDetailsModal.value = true
  }
}

const showCalendarEventDetails = (date) => {
  console.log('=== showCalendarEventDetails called ===')
  console.log('Input date:', date)
  console.log('weekCalendarData.value:', weekCalendarData.value)
  
  if (!date || !weekCalendarData.value?.daily_cards) {
    console.log('Missing date or weekCalendarData')
    return
  }
  
  const dateStr = date.toISOString().split('T')[0]
  console.log('Looking for date:', dateStr)
  
  const dayData = weekCalendarData.value.daily_cards.find(day => day.date === dateStr)
  console.log('Found dayData:', dayData)
  
  if (!dayData || !dayData.bookings || dayData.bookings.length === 0) {
    console.log('No dayData or bookings found')
    return
  }
  
  console.log('Creating event card with:', dayData.bookings.length, 'bookings')
  
  // Create event data for the card
  selectedCalendarEvent.value = {
    date: date,
    dayData: dayData,
    bookings: dayData.bookings
  }
  
  showCalendarEventCard.value = true
  console.log('Event card should now be visible')
  
  // Stop auto-rotation by pausing the interval
  if (rotationInterval) {
    console.log('Stopping auto-rotation')
    clearInterval(rotationInterval)
    rotationInterval = null
  }
  
  // Focus on the event card (set currentCardIndex to 0)
  currentCardIndex.value = 0
  console.log('Focused on event card at index 0')
  console.log('showCalendarEventCard.value:', showCalendarEventCard.value)
  console.log('selectedCalendarEvent.value:', selectedCalendarEvent.value)
  console.log('currentCardIndex.value after:', currentCardIndex.value)
}

const closeCalendarEventCard = () => {
  showCalendarEventCard.value = false
  selectedCalendarEvent.value = null
  
  // Resume auto-rotation
  startCardRotation()
}

// Simplified mobile-friendly day click handler
const handleDayClick = (date) => {
  console.log('Day clicked:', date)
  console.log('Screen width:', window.innerWidth)
  console.log('Current card index before:', currentCardIndex.value)
  
  if (getDayStatus(date)) {
    console.log('Day has events, showing details...')
    showCalendarEventDetails(date)
  } else {
    console.log('Day has no events')
  }
}

const formatPaymentDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleDateString('es-ES', { month: 'numeric' })
  return `${day}/${month}`
}

const formatEventTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

// Calendar touch handlers
const handleCalendarTouchStart = (e) => {
  // Only handle touches on the calendar container, not on day elements
  if (e.target.closest('.calendar-day')) return
  
  e.preventDefault()
  e.stopPropagation()
  currentTouchedCalendar.value = true
  calendarTouchStartX.value = e.touches[0].clientX
}

const handleCalendarTouchMove = (e) => {
  // Only handle touches on the calendar container, not on day elements
  if (e.target.closest('.calendar-day')) return
  
  if (!currentTouchedCalendar.value) return
  e.preventDefault()
  e.stopPropagation()
  
  const currentX = e.touches[0].clientX
  calendarTouchEndX.value = currentX
}

const handleCalendarTouchEnd = (e) => {
  // Only handle touches on the calendar container, not on day elements
  if (e.target.closest('.calendar-day')) return
  
  if (!currentTouchedCalendar.value) return
  
  e.preventDefault()
  e.stopPropagation()
  
  const deltaX = calendarTouchEndX.value - calendarTouchStartX.value
  const minSwipeDistance = 50
  
  if (Math.abs(deltaX) > minSwipeDistance) {
    if (deltaX > 0) {
      // Swipe right - go to previous week
      goToPreviousWeek()
    } else {
      // Swipe left - go to next week
      goToNextWeek()
    }
  }
  
  currentTouchedCalendar.value = false
  calendarTouchStartX.value = 0
  calendarTouchEndX.value = 0
}

// Week calendar navigation functions
const goToPreviousWeek = () => {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekStart.value = newDate
  fetchWeekCalendarData(newDate)
}

const goToNextWeek = () => {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekStart.value = newDate
  fetchWeekCalendarData(newDate)
}

const goToCurrentWeek = () => {
  const today = new Date()
  currentWeekStart.value = today
  fetchWeekCalendarData(today)
}

// Get week dates for display
const getWeekDates = computed(() => {
  // Use the actual dates from weekCalendarData if available
  if (weekCalendarData.value?.daily_cards && weekCalendarData.value.daily_cards.length > 0) {
    return weekCalendarData.value.daily_cards.map(day => new Date(day.date + 'T00:00:00'))
  }
  
  // Fallback to currentWeekStart if no data
  if (!currentWeekStart.value) {
    return []
  }
  
  const dates = []
  const startDate = new Date(currentWeekStart.value)
  
  // Get the start of the week (Monday)
  const dayOfWeek = startDate.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(startDate)
  monday.setDate(startDate.getDate() + mondayOffset)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push(date)
  }
  
  return dates
})

// Format date for display
const formatWeekDate = (date) => {
  if (!date) return ''
  return date.toLocaleDateString('es-ES', { 
    weekday: 'short', 
    day: 'numeric',
    month: 'short'
  })
}

// Check if date is today
const isToday = (date) => {
  if (!date) return false
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// Get day's booking status for coloring
const getDayStatus = (date) => {
  if (!date || !weekCalendarData.value?.daily_cards) {
    return null
  }
  
  const dateStr = date.toISOString().split('T')[0]
  const dayData = weekCalendarData.value.daily_cards.find(day => day.date === dateStr)
  
  if (!dayData || !dayData.bookings || dayData.bookings.length === 0) {
    return null
  }
  
  // Priority order: rechazado > pendiente > solicitud > aceptacion > cancelado
  if (dayData.bookings.some(b => b.status === 'rechazado')) return 'rechazado'
  if (dayData.bookings.some(b => b.status === 'pendiente')) return 'pendiente'
  if (dayData.bookings.some(b => b.status === 'solicitud')) return 'solicitud'
  if (dayData.bookings.some(b => b.status === 'aceptacion')) return 'aceptacion'
  if (dayData.bookings.some(b => b.status === 'cancelado')) return 'cancelado'
  
  return null
}

// Get day status color classes
const getDayStatusClasses = (date) => {
  const status = getDayStatus(date)
  const isTodayDate = isToday(date)
  
  if (isTodayDate) {
    return 'bg-blue-600 text-white'
  }
  
  switch (status) {
    case 'aceptacion':
      return 'bg-green-100 text-green-800 border-2 border-green-300'
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
    case 'rechazado':
      return 'bg-red-100 text-red-800 border-2 border-red-300'
    case 'cancelado':
      return 'bg-gray-100 text-gray-800 border-2 border-gray-300'
    case 'solicitud':
      return 'bg-blue-100 text-blue-800 border-2 border-blue-300'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const navigateToBookingDetail = (bookingId) => {
  console.log('navigateToBookingDetail called with bookingId:', bookingId)
  if (bookingId) {
    // If user is staff, navigate to /mis-reservas, otherwise to /mis-reservas
    const route = authStore.user?.is_staff ? '/mis-reservas' : '/mis-reservas'
    console.log('Navigating to:', `/detalle-reserva/${bookingId}`)
    router.push(`/detalle-reserva/${bookingId}`)
  } else {
    console.log('No bookingId provided')
  }
}

// Mobile sidebar functions
const openMobileSidebar = () => {
  showMobileSidebar.value = true
}

const closeMobileSidebar = () => {
  showMobileSidebar.value = false
}
</script> 
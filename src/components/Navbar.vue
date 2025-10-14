<template>
  <!-- Original Navbar -->
  <nav class="fixed top-0 right-0 left-0 z-50 bg-black border-b border-gray-800 shadow-sm">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-2">
            <svg
              class="mr-2 w-7 h-7"
              viewBox="0 0 511.998 511.998"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/2000/svg"
              fill="url(#navbar-gradient)"
            >
              <defs>
                <linearGradient id="navbar-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#7c3aed" />
                  <stop offset="100%" stop-color="#22d3ee" />
                </linearGradient>
              </defs>
              <g>
                <g>
                  <path d="M510.402,218.004c-14.818-19.889-34.282-36.372-56.292-47.671c-13.305-6.83-27.233-11.708-41.646-14.623l70.042-34.05
			c2.741-1.332,4.495-4.097,4.534-7.143c0.039-3.048-1.644-5.855-4.35-7.257c-22.022-11.408-46.736-17.723-71.468-18.261
			c-11.994-0.258-23.798,0.795-35.351,3.114l3.78-4.516c1.665-1.99,2.262-4.648,1.634-7.139c2.568,0.179,5.074-0.877,6.738-2.869
			l33.262-39.757c1.955-2.338,2.426-5.577,1.214-8.374c-1.212-2.797-3.898-4.67-6.94-4.842
			c-24.763-1.389-49.894,2.957-72.682,12.585c-23.896,10.098-44.51,25.373-61.268,45.404
			c-10.778,12.883-19.346,27.006-25.611,42.187c-6.265-15.181-14.833-29.303-25.611-42.187
			C213.629,62.574,193.016,47.3,169.12,37.201c-22.788-9.63-47.923-13.978-72.683-12.585c-3.043,0.172-5.729,2.044-6.94,4.842
			c-1.212,2.797-0.741,6.036,1.214,8.374l33.262,39.757c1.665,1.992,4.175,3.05,6.74,2.867c-0.628,2.491-0.031,5.151,1.634,7.14
			l3.78,4.517c-11.554-2.32-23.359-3.375-35.351-3.115c-24.733,0.538-49.446,6.853-71.468,18.261
			c-2.705,1.402-4.389,4.209-4.35,7.257c0.039,3.047,1.793,5.811,4.534,7.143l70.042,34.05
			c-14.413,2.916-28.341,7.794-41.646,14.623c-22.008,11.299-41.474,27.782-56.292,47.671c-1.82,2.443-2.107,5.706-0.739,8.43
			c1.367,2.722,4.154,4.443,7.202,4.443h47.511c-1.404,1.327-2.794,2.673-4.158,4.056c-17.369,17.614-30.701,39.361-38.556,62.885
			c-0.965,2.89-0.216,6.079,1.934,8.238c1.537,1.542,3.6,2.371,5.71,2.371c0.842,0,1.693-0.132,2.519-0.404l78.949-26.002
			c2.466-0.812,4.375-2.756,5.156-5.204c2.082,1.504,4.773,1.935,7.238,1.122l35.066-11.544c2.465-0.812,4.374-2.755,5.156-5.202
			c2.082,1.504,4.77,1.933,7.235,1.12l53.882-17.743l-9.606,234.681c-0.089,2.192,0.719,4.326,2.238,5.909
			c1.52,1.584,3.62,2.479,5.813,2.479h83.723c2.194,0,4.293-0.895,5.813-2.479c1.519-1.583,2.327-3.717,2.238-5.909l-9.606-234.674
			l53.863,17.737c2.465,0.812,5.154,0.384,7.235-1.119c0.782,2.446,2.691,4.39,5.156,5.202l35.065,11.544
			c2.47,0.813,5.158,0.382,7.238-1.122c0.782,2.447,2.691,4.392,5.157,5.204l78.951,26.002c0.825,0.272,1.676,0.404,2.519,0.404
			c2.109,0,4.174-0.829,5.71-2.371c2.15-2.16,2.899-5.348,1.934-8.238c-7.855-23.525-21.187-45.271-38.556-62.885
			c-1.364-1.383-2.754-2.729-4.158-4.056h47.511c3.048,0,5.835-1.72,7.202-4.443C512.509,223.709,512.223,220.447,510.402,218.004z
			 M410.873,105.109c16.701,0.364,33.395,3.653,49.066,9.605l-55.163,26.817l-6.743-4.33c-2.365-1.519-5.349-1.694-7.876-0.466
			c-2.528,1.229-4.232,3.685-4.498,6.483l-0.76,7.975l-2.711,1.319c-0.739-0.011-1.475-0.032-2.215-0.032
			c-26.116,0-51.059,6.008-74.137,17.855c-11.305,5.803-21.929,12.983-31.606,21.28c4.459-9.955,10.002-19.415,16.529-28.109
			c14.024-18.68,31.864-33.368,53.025-43.656C364.949,109.559,387.522,104.617,410.873,105.109z M293.969,92.946
			c15.1-18.047,33.666-31.808,55.182-40.9c15.388-6.503,31.965-10.334,48.7-11.315l-19.282,23.046l-7.922-1.191
			c-2.779-0.42-5.575,0.641-7.379,2.798c-1.804,2.155-2.353,5.095-1.453,7.757l2.573,7.588l-16.499,19.719
			c-3.752,1.498-7.471,3.122-11.149,4.91c-23.486,11.418-43.292,27.727-58.868,48.473c-5.18,6.9-9.791,14.239-13.815,21.895v-23.78
			h-0.001C269.393,130.152,279.448,110.304,293.969,92.946z M279.964,239.191l0.604,14.753h-49.12l0.605-14.76l23.947-7.886
			L279.964,239.191z M226.967,363.381l1.58-38.603h54.92l1.581,38.603H226.967z M285.707,379.497l1.58,38.604h-62.559l1.581-38.604
			H285.707z M229.207,308.664l1.581-38.604h50.438l1.58,38.604H229.207z M133.427,63.775l-19.282-23.046
			c16.734,0.982,33.313,4.814,48.701,11.315c21.515,9.092,40.083,22.854,55.182,40.9c14.521,17.359,24.576,37.206,29.913,58.999
			v23.781c-4.025-7.657-8.637-14.997-13.816-21.897c-15.576-20.747-35.382-37.055-58.868-48.473
			c-3.677-1.787-7.396-3.412-11.148-4.909l-16.499-19.72l2.573-7.588c0.901-2.662,0.351-5.602-1.453-7.757
			c-1.804-2.156-4.603-3.218-7.379-2.798L133.427,63.775z M52.057,114.712c15.672-5.952,32.365-9.241,49.066-9.605
			c23.376-0.495,45.923,4.451,67.086,14.74c21.162,10.288,39.003,24.976,53.025,43.656c6.527,8.694,12.069,18.153,16.528,28.108
			c-9.676-8.297-20.301-15.475-31.604-21.279c-23.077-11.847-48.021-17.855-74.137-17.855c-0.739,0-1.476,0.023-2.215,0.032
			l-2.711-1.319l-0.76-7.975c-0.266-2.798-1.97-5.255-4.498-6.483c-2.526-1.229-5.511-1.053-7.876,0.466l-6.743,4.329
			L52.057,114.712z M55.364,214.76H25.317c11.49-12.204,25.067-22.461,39.928-30.09c20.78-10.668,43.248-16.077,66.778-16.077
			c23.53,0,45.997,5.408,66.776,16.077c5.069,2.602,9.985,5.514,14.722,8.7c-14.952-4.466-30.541-6.786-46.414-6.786
			c-17.235,0-34.349,2.758-50.865,8.197c-14.118,4.649-27.263,11.035-39.331,19.073l-3.617-5.935c-1.462-2.4-4.07-3.866-6.88-3.866
			s-5.418,1.464-6.88,3.865L55.364,214.76z M161.077,245.589l-6.098-5.192c-2.138-1.821-5.073-2.399-7.744-1.519
			c-2.67,0.879-4.689,3.087-5.327,5.824l-1.819,7.801l-26.469,8.714l-6.1-5.195c-2.14-1.821-5.074-2.398-7.744-1.518
			c-2.67,0.879-4.689,3.086-5.327,5.823l-1.82,7.803l-58.26,19.186c7.097-15.187,16.785-29.174,28.514-41.07
			c16.401-16.631,36.049-28.797,58.401-36.157c14.888-4.903,30.305-7.389,45.824-7.389c24.634,0,48.535,6.13,70,17.852
			L161.077,245.589z M222.541,471.521l1.527-37.304h63.881l1.527,37.304H222.541z M477.627,287.316l-58.26-19.187l-1.821-7.804
			c-0.639-2.736-2.658-4.943-5.327-5.822c-2.669-0.88-5.604-0.302-7.744,1.518l-6.1,5.195l-26.468-8.714l-1.819-7.801
			c-0.638-2.737-2.657-4.944-5.327-5.824c-2.669-0.879-5.605-0.303-7.744,1.519l-6.098,5.192l-76.032-25.037
			c21.466-11.721,45.367-17.852,70.001-17.852c15.519,0,30.936,2.486,45.824,7.39c22.351,7.361,41.999,19.526,58.401,36.157
			C460.842,258.141,470.529,272.129,477.627,287.316z M456.633,214.759v0.001l-4.17-6.842c-1.462-2.399-4.07-3.865-6.88-3.865
			s-5.418,1.464-6.88,3.866l-3.617,5.935c-12.067-8.038-25.213-14.424-39.33-19.073c-16.516-5.44-33.63-8.197-50.865-8.197
			c-15.873,0-31.462,2.32-46.414,6.786c4.737-3.187,9.653-6.098,14.722-8.7c20.779-10.668,43.247-16.077,66.776-16.077
			c23.531,0,45.998,5.408,66.778,16.077c14.861,7.629,28.437,17.886,39.928,30.09H456.633z"/>
                </g>
              </g>
            </svg>
            <span class="text-xl font-bold text-white">Terraza Pineda</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="flex items-baseline ml-10 space-x-4">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.path"
              class="px-3 py-2 text-sm font-medium rounded-md border-b-2 transition-colors duration-200"
              :class="[
                $route.path === item.path
                  ? 'text-transparent bg-clip-text border-transparent bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] border-b-2 border-[#7c3aed]'
                  : 'text-white border-transparent hover:text-cyan-400 hover:border-cyan-400'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- User Menu / Auth Buttons -->
        <div class="hidden items-center space-x-4 md:flex">
          <template v-if="authStore.isAuthenticated">
            <router-link
              v-if="authStore.user && (authStore.user.is_staff || authStore.user.role === 'admin')"
              to="/dashboard"
              class="btn-primary"
            >
              Dashboard
            </router-link>
            <router-link
              v-else
              to="/mis-reservas"
              class="btn-primary"
            >
              Reservas
            </router-link>
            <!-- User avatar and popover for desktop -->
            <div class="relative" @mouseenter="cancelCloseDesktop; openUserMenuDesktop" @mouseleave="closeUserMenuDesktop">
              <button @click="openUserMenuDesktop" data-user-menu class="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] border-2 border-white shadow">
                <span v-if="authStore.user && authStore.user.first_name && authStore.user.last_name" class="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] text-white text-base font-bold">
                  {{ authStore.user.first_name.charAt(0).toUpperCase() + authStore.user.last_name.charAt(0).toUpperCase() }}
                </span>
                <span v-else class="text-base font-bold text-white"><i class="fa-regular fa-user"></i></span>
                <!-- Notification count badge -->
                <span v-if="unreadCount > 0" class="flex absolute -top-1 -right-1 justify-center items-center px-1 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white min-w-5">
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </span>
              </button>
              
              <!-- User Dropdown Menu -->
              <div 
                v-if="showUserMenuDesktop" 
                ref="userMenuRef"
                @mouseenter="cancelCloseDesktop"
                @mouseleave="closeUserMenuDesktop"
                class="absolute right-0 z-50 mt-1 w-64 bg-white rounded-lg border border-gray-200 shadow-lg"
              >
                <div class="p-4 border-b border-gray-200">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ userName }}</div>
                    <div class="text-xs text-gray-500 truncate">{{ user && user.email ? user.email : '' }}</div>
                  </div>
                </div>
                
                <div class="py-2">
                  <router-link
                    to="/perfil"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <i class="mr-3 text-gray-400 fa-solid fa-user"></i>
                    Perfil
                  </router-link>
                  
                  <router-link
                    to="/mis-reservas"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <i class="mr-3 text-gray-400 fa-solid fa-calendar-check"></i>
                    Reservas
                  </router-link>
                  
                  <router-link
                    v-if="authStore.user && (authStore.user.is_staff || authStore.user.role === 'admin')"
                    to="/dashboard"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <i class="mr-3 text-gray-400 fa-solid fa-tachometer-alt"></i>
                    Dashboard
                  </router-link>
                  
                  <!-- Notifications Section -->
                  <div class="px-4 py-2">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-xs font-semibold text-gray-500 uppercase">Notificaciones</span>
                      <span v-if="unreadCount > 0" class="inline-flex items-center px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                        {{ unreadCount }}
                      </span>
                    </div>
                    
                    <!-- Last 5 Notifications -->
                    <div v-if="lastFiveNotifications.length > 0" class="overflow-y-auto space-y-1 max-h-64">
                      <div
                        v-for="notification in lastFiveNotifications"
                        :key="notification.id"
                        @click="router.push('/perfil?notifications=true')"
                        class="p-2 rounded-md transition-colors cursor-pointer"
                        :class="notification.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'"
                      >
                        <div class="flex items-start space-x-2">
                          <i class="mt-0.5 text-sm fa-solid fa-bell" :class="notification.read ? 'text-gray-400' : 'text-blue-500'"></i>
                          <div class="flex-1 min-w-0">
                            <p class="text-xs font-medium text-gray-900 line-clamp-2">{{ notification.message }}</p>
                            <p class="mt-0.5 text-xs text-gray-400">{{ formatNotificationDate(notification.created_at) }}</p>
                          </div>
                          <div v-if="!notification.read" class="flex-shrink-0 mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- No notifications message -->
                    <div v-else class="py-3 text-center">
                      <i class="text-2xl text-gray-300 fa-solid fa-bell-slash"></i>
                      <p class="mt-1 text-xs text-gray-400">Sin notificaciones</p>
                    </div>
                    
                    <!-- View all link -->
                  <button
                      @click="router.push('/perfil?notifications=true')"
                      class="px-3 py-1.5 mt-2 w-full text-xs font-medium text-blue-600 bg-blue-50 rounded-md transition-colors hover:bg-blue-100"
                  >
                      Ver todas →
                  </button>
                  </div>
                  
                  <div class="my-1 border-t border-gray-200"></div>
                  
                  <button
                    @click="handleLogout"
                    class="flex items-center px-4 py-2 w-full text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <i class="mr-3 fa-solid fa-sign-out-alt"></i>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white rounded px-4 py-2 font-semibold shadow-md hover:opacity-90 transition"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/registrar"
              class="bg-gradient-to-r from-[#f472b6] to-[#fbbf24] text-white rounded px-4 py-2 font-semibold shadow-md hover:opacity-90 transition"
            >
              Registrar
            </router-link>
          </template>
        </div>

        <!-- Mobile menu button and user avatar -->
        <div class="flex gap-2 items-center md:hidden">
          <template v-if="authStore.isAuthenticated">
            <div class="relative" @mouseenter="cancelCloseMobile; openUserMenuMobile" @mouseleave="closeUserMenuMobile">
              <button
                @click="openUserMenuMobile"
                data-user-menu-mobile
                class="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] border-2 border-white shadow"
              >
                <span v-if="authStore.user && authStore.user.first_name && authStore.user.last_name" class="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] text-white text-base font-bold">
                  {{ authStore.user.first_name.charAt(0).toUpperCase() + authStore.user.last_name.charAt(0).toUpperCase() }}
                </span>
                <span v-else class="text-base font-bold text-white"><i class="fa-regular fa-user"></i></span>
                <!-- Notification count badge -->
                <span v-if="unreadCount > 0" class="flex absolute -top-1 -right-1 justify-center items-center px-1 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white min-w-5">
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </span>
              </button>
              
              <!-- Mobile User Dropdown Menu -->
              <div 
                v-if="showUserMenuMobile" 
                ref="userMenuMobileRef"
                @mouseenter="cancelCloseMobile"
                @mouseleave="closeUserMenuMobile"
                class="absolute right-0 z-50 mt-1 w-64 bg-white rounded-lg border border-gray-200 shadow-lg"
              >
                <div class="p-4 border-b border-gray-200">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ userName }}</div>
                    <div class="text-xs text-gray-500 truncate">{{ user && user.email ? user.email : '' }}</div>
                  </div>
                </div>
                
                <div class="py-2">
                  <router-link
                    to="/mis-reservas"
                    @click="closeUserMenuMobile"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <i class="mr-3 text-gray-400 fa-solid fa-calendar-check"></i>
                    Mis Reservas
                  </router-link>
                  
                  <router-link
                    v-if="authStore.user && (authStore.user.is_staff || authStore.user.role === 'admin')"
                    to="/dashboard"
                    @click="closeUserMenuMobile"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <i class="mr-3 text-gray-400 fa-solid fa-tachometer-alt"></i>
                    Dashboard
                  </router-link>
                  
                  <!-- Notifications Section -->
                  <div class="px-4 py-2">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-xs font-semibold text-gray-500 uppercase">Notificaciones</span>
                      <span v-if="unreadCount > 0" class="inline-flex items-center px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                        {{ unreadCount }}
                      </span>
                    </div>
                    
                    <!-- Last 5 Notifications -->
                    <div v-if="lastFiveNotifications.length > 0" class="overflow-y-auto space-y-1 max-h-64">
                      <div
                        v-for="notification in lastFiveNotifications"
                        :key="notification.id"
                        @click="router.push('/perfil?notifications=true'); closeUserMenuMobile()"
                        class="p-2 rounded-md transition-colors cursor-pointer"
                        :class="notification.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'"
                      >
                        <div class="flex items-start space-x-2">
                          <i class="mt-0.5 text-sm fa-solid fa-bell" :class="notification.read ? 'text-gray-400' : 'text-blue-500'"></i>
                          <div class="flex-1 min-w-0">
                            <p class="text-xs font-medium text-gray-900 line-clamp-2">{{ notification.message }}</p>
                            <p class="mt-0.5 text-xs text-gray-400">{{ formatNotificationDate(notification.created_at) }}</p>
                          </div>
                          <div v-if="!notification.read" class="flex-shrink-0 mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- No notifications message -->
                    <div v-else class="py-3 text-center">
                      <i class="text-2xl text-gray-300 fa-solid fa-bell-slash"></i>
                      <p class="mt-1 text-xs text-gray-400">Sin notificaciones</p>
                    </div>
                    
                    <!-- View all link -->
                  <button
                      @click="router.push('/perfil?notifications=true'); closeUserMenuMobile()"
                      class="px-3 py-1.5 mt-2 w-full text-xs font-medium text-blue-600 bg-blue-50 rounded-md transition-colors hover:bg-blue-100"
                  >
                      Ver todas →
                  </button>
                  </div>
                  
                  <div class="my-1 border-t border-gray-200"></div>
                  
                  <button
                    @click="handleLogout; closeUserMenuMobile()"
                    class="flex items-center px-4 py-2 w-full text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <i class="mr-3 fa-solid fa-sign-out-alt"></i>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </template>
          <button
            @click="openMobileSidebar"
            class="inline-flex justify-center items-center p-2 text-white rounded-md hover:text-green-400 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            aria-expanded="false"
            ref="hamburgerButtonRef"
          >
            <span class="sr-only">Open sidebar</span>
            <i class="text-xl fa-solid fa-bars"></i>
          </button>
        </div>

        <!-- Mobile menu: move outside the flex row, make it fixed below navbar, full width -->
        <div
          v-show="isMobileMenuOpen"
          ref="mobileMenuRef"
          class="fixed right-0 left-0 z-40 bg-black border-t border-gray-800 md:hidden"
          style="top: 64px;"
        >
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.path"
              class="block px-3 py-2 text-base font-medium rounded-md border-b-2 transition-colors duration-200"
              :class="[
                $route.path === item.path
                  ? 'text-purple-400 border-purple-400'
                  : 'text-white border-transparent hover:text-green-400 hover:border-green-400'
              ]"
              @click="closeMobileMenu"
            >
              {{ item.name }}
            </router-link>
            <template v-if="authStore.isAuthenticated">
              <router-link v-if="!(authStore.user && (authStore.user.is_staff || authStore.user.role === 'admin'))" to="/mis-reservas" class="block px-3 py-2 text-base font-medium text-white rounded-md border-b-2 hover:text-green-400 hover:border-green-400" @click="closeMobileMenu">Reservas</router-link>
              <router-link v-if="authStore.user && (authStore.user.is_staff || authStore.user.role === 'admin')" to="/dashboard" class="block px-3 py-2 text-base font-medium text-white rounded-md border-b-2 hover:text-green-400 hover:border-green-400" @click="closeMobileMenu">Dashboard</router-link>
              <button @click="handleLogout" class="block px-3 py-2 w-full text-base font-medium text-left text-white rounded-md border-b-2 hover:text-green-400 hover:border-green-400">Logout</button>
            </template>
            <template v-else>
              <router-link
                to="/login"
                class="block px-3 py-2 text-base font-medium text-white rounded-md border-b-2 hover:text-blue-400 hover:border-blue-400"
                @click="closeMobileMenu"
              >
                Iniciar Sesión
              </router-link>
              <router-link
                to="/registrar"
                class="block px-3 py-2 text-base font-medium text-white rounded-md border-b-2 hover:text-pink-400 hover:border-pink-400"
                @click="closeMobileMenu"
              >
                Registrar
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile Sidebar Overlay -->
  <div 
    v-if="showMobileSidebar" 
    class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
    @click="closeMobileSidebar"
  ></div>
  
  <!-- Mobile Sidebar -->
  <div 
    class="fixed top-0 left-0 z-50 w-80 h-full bg-black transition-transform duration-300 ease-in-out transform md:hidden"
    :class="showMobileSidebar ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Sidebar Header -->
    <div class="flex justify-between items-center p-6 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="flex justify-center items-center w-10 h-10">
          <img src="/tp-white.svg" alt="Terraza Pineda Logo" class="w-8 h-8" />
  </div>
        <div>
          <div class="text-xl font-bold text-white">Terraza Pineda</div>
          <div class="text-xs text-gray-400">Celebra tus eventos con nosotros</div>
        </div>
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
      <!-- User Profile (only if logged in) -->
      <div v-if="authStore.isAuthenticated" class="p-6 border-b border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <!-- User Image or Initials Circle -->
            <div v-if="false" class="overflow-hidden w-12 h-12 rounded-full">
              <img 
                :src="user.profile.image" 
                :alt="`${userName} Profile`" 
                class="object-cover w-full h-full"
              />
            </div>
            <div v-else class="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
              <span class="text-lg font-bold text-white">{{ userInitials }}</span>
  </div>
            <!-- Notification indicator -->
            <div v-if="unreadCount > 0" class="flex absolute -top-1 -right-1 justify-center items-center w-4 h-4 bg-red-500 rounded-full">
              <span class="text-xs font-bold text-white">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </div>
  </div>
          <div class="flex-1">
            <router-link 
              to="/perfil" 
              class="block text-lg font-bold text-white transition-colors cursor-pointer hover:text-blue-400"
            >
              {{ userName }}
            </router-link>
            <div class="text-sm text-gray-400">{{ userRole }}</div>
            <div v-if="user && user.email" class="text-xs text-gray-500 truncate">{{ user.email }}</div>
            <div v-if="user && user.phone" class="text-xs text-gray-500">{{ user.phone }}</div>
            <div v-if="user && user.profile && user.profile.pid" class="text-xs text-gray-600">ID: {{ user.profile.pid }}</div>
          </div>
          <div class="flex flex-col space-y-2">
            <!-- Notification icon -->
            <button 
              @click="router.push('/perfil?notifications=true'); closeMobileSidebar()"
              class="relative p-2 text-gray-400 transition-colors hover:text-white"
              title="Ver Notificaciones"
            >
              <i class="text-lg fa-solid fa-bell"></i>
              <span v-if="unreadCount > 0" class="flex absolute -top-1 -right-1 justify-center items-center px-1 h-4 text-xs font-bold text-white bg-red-500 rounded-full min-w-4">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>
            <!-- Logout button -->
            <button 
              @click="handleLogout"
              class="p-2 text-gray-400 transition-colors hover:text-red-400"
              title="Cerrar Sesión"
            >
              <i class="text-lg fa-solid fa-sign-out-alt"></i>
</button>
    </div>
  </div>
</div>

      <!-- Navigation Menu -->
      <div class="overflow-y-auto flex-1">
        <nav class="p-4 space-y-2">
          <!-- Public Navigation Items -->
          <div 
            v-for="item in publicNavigationItems" 
            :key="item.name"
            @click="goToPage(item.path); closeMobileSidebar()"
            class="flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors cursor-pointer hover:bg-gray-800 hover:text-white"
          >
            <i :class="getNavigationIcon(item.name) + ' mr-3 text-lg'"></i>
            <span class="text-base">{{ item.name }}</span>
          </div>
          
          <!-- Authenticated Navigation Items -->
          <template v-if="authStore.isAuthenticated">
            <div class="my-2 border-t border-gray-700"></div>
            <div 
              v-for="item in filteredAuthenticatedItems" 
              :key="item.name"
              @click="goToPage(item.path); closeMobileSidebar()"
              class="flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors cursor-pointer hover:bg-gray-800 hover:text-white"
            >
              <i :class="getNavigationIcon(item.name) + ' mr-3 text-lg'"></i>
              <span class="text-base">{{ item.name }}</span>
        </div>
          </template>
        </nav>
      </div>
      
      <!-- Sidebar Footer -->
      <div class="p-6 border-t border-gray-700">
        <!-- Not logged in user actions -->
        <template v-if="!authStore.isAuthenticated">
          <div class="space-y-2">
            <button 
              @click="goToPage('/login'); closeMobileSidebar()"
              class="flex justify-center items-center px-4 py-3 w-full text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
            >
              <i class="mr-3 text-lg fa-solid fa-sign-in-alt"></i>
              <span class="text-base font-medium">Iniciar Sesión</span>
            </button>
            <button 
              @click="goToPage('/registrar'); closeMobileSidebar()"
              class="flex justify-center items-center px-4 py-3 w-full text-white bg-pink-600 rounded-lg transition-colors hover:bg-pink-700"
            >
              <i class="mr-3 text-lg fa-solid fa-user-plus"></i>
              <span class="text-base font-medium">Registrarse</span>
      </button>
          </div>
        </template>
      </div>
    </div>
  </div>


</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Mobile sidebar state
const showMobileSidebar = ref(false)

// Mobile menu state
const isMobileMenuOpen = ref(false)
const mobileMenuRef = ref(null)
const hamburgerButtonRef = ref(null)

// Desktop user menu state
const showUserMenuDesktop = ref(false)
const userMenuRef = ref(null)
let desktopCloseTimeout = null

// Mobile user menu state
const showUserMenuMobile = ref(false)
const userMenuMobileRef = ref(null)
let mobileCloseTimeout = null

// User profile state
const user = ref(null)

// Notifications state
const unreadCount = ref(0)
const notifications = ref([])
const lastFiveNotifications = computed(() => {
  return notifications.value.slice(0, 5)
})

// Fetch notifications
const fetchNotifications = async () => {
  if (!authStore.isAuthenticated) return
  
  try {
    const response = await fetch('/api/bookings/notifications/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      // Handle both array and paginated response
      const notificationsList = Array.isArray(data) ? data : (data.results || [])
      notifications.value = notificationsList
      unreadCount.value = notificationsList.filter(n => !n.read).length
      console.log('[Navbar] Notifications loaded:', notificationsList.length, 'Unread:', unreadCount.value)
    }
  } catch (error) {
    console.error('[Navbar] Error fetching notifications:', error)
  }
}

// Format notification date
const formatNotificationDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    return 'Hace unos minutos'
  } else if (diffInHours < 24) {
    return `Hace ${Math.floor(diffInHours)} horas`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
  }
}

// Navigation items
const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Precios', path: '/precios' },
  { name: 'Reservar', path: '/reservar' },
  { name: 'Fotos', path: '/fotos' },
  { name: 'Reglamento', path: '/reglamento' },
  { name: 'Preguntas', path: '/preguntas-frecuentes' },
]

// Public navigation items (always visible)
const publicNavigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Precios', path: '/precios' },
  { name: 'Fotos', path: '/fotos' },
  { name: 'Reglamento', path: '/reglamento' },
  { name: 'Preguntas', path: '/preguntas-frecuentes' },
]

// Authenticated navigation items (only for logged in users)
const authenticatedNavigationItems = [
  { name: 'Reservar', path: '/reservar' },
  { name: 'Reservas', path: '/mis-reservas' },
  { name: 'Dashboard', path: '/dashboard', condition: 'staff' },
]

// Get user from auth store and localStorage
onMounted(async () => {
  if (authStore.user) {
    user.value = authStore.user
  } else {
    // Try to get user from localStorage as fallback
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Error parsing user from localStorage:', error)
      }
    }
  }
  
  // Fetch notifications if authenticated
  if (authStore.isAuthenticated) {
    await fetchNotifications()
  }
})

// Watch auth state to fetch notifications when user logs in
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    fetchNotifications()
  } else {
    notifications.value = []
    unreadCount.value = 0
  }
})

// Watch for changes in auth store user
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    user.value = newUser
  }
}, { immediate: true })

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
  } else if (user.value.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  
  return 'U'
})

// Filter authenticated navigation items based on user role
const filteredAuthenticatedItems = computed(() => {
  if (!authStore.isAuthenticated) return []
  
  return authenticatedNavigationItems.filter(item => {
    if (item.condition === 'staff') {
      return authStore.user && (authStore.user.is_staff || authStore.user.role === 'admin')
    }
    return true
  })
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

// Mobile menu functions
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// User menu functions
const openUserMenuDesktop = () => {
  console.log('Opening user menu, current state:', showUserMenuDesktop.value)
  showUserMenuDesktop.value = true
  console.log('New state:', showUserMenuDesktop.value)
}

const closeUserMenuDesktop = () => {
  desktopCloseTimeout = setTimeout(() => {
    showUserMenuDesktop.value = false
  }, 100)
}

const cancelCloseDesktop = () => {
  if (desktopCloseTimeout) {
    clearTimeout(desktopCloseTimeout)
    desktopCloseTimeout = null
  }
}

const openUserMenuMobile = () => {
  console.log('Opening mobile user menu, current state:', showUserMenuMobile.value)
  showUserMenuMobile.value = true
  console.log('New mobile state:', showUserMenuMobile.value)
}

const closeUserMenuMobile = () => {
  mobileCloseTimeout = setTimeout(() => {
    showUserMenuMobile.value = false
  }, 100)
}

const cancelCloseMobile = () => {
  if (mobileCloseTimeout) {
    clearTimeout(mobileCloseTimeout)
    mobileCloseTimeout = null
  }
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
    'Mis Reservas': 'fa-solid fa-calendar-check',
    'Reservas': 'fa-solid fa-calendar-check',
    'Dashboard': 'fa-solid fa-tachometer-alt'
  }
  return iconMap[name] || 'fa-solid fa-link'
}

// Click outside handler
function handleClickOutside(event) {
  // Mobile sidebar
  if (showMobileSidebar.value && !event.target.closest('.fixed.top-0.left-0.z-50.w-80')) {
    showMobileSidebar.value = false;
  }
  // Mobile user menu
  if (mobileMenuRef.value && !mobileMenuRef.value.contains(event.target)) {
    isMobileMenuOpen.value = false;
  }
  // Mobile nav menu
  if (
    isMobileMenuOpen.value &&
    mobileMenuRef.value &&
    !mobileMenuRef.value.contains(event.target) &&
    hamburgerButtonRef.value &&
    !hamburgerButtonRef.value.contains(event.target)
  ) {
    isMobileMenuOpen.value = false;
  }
  // Desktop user menu
  if (
    showUserMenuDesktop.value &&
    userMenuRef.value &&
    !userMenuRef.value.contains(event.target) &&
    !event.target.closest('button[data-user-menu]')
  ) {
    showUserMenuDesktop.value = false;
  }
  // Mobile user menu
  if (
    showUserMenuMobile.value &&
    userMenuMobileRef.value &&
    !userMenuMobileRef.value.contains(event.target) &&
    !event.target.closest('button[data-user-menu-mobile]')
  ) {
    showUserMenuMobile.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script> 

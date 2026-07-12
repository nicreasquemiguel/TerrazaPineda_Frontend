<template>
  <div class="min-h-screen bg-white">
    <!-- Desktop Sidebar -->
    <div class="hidden md:block">
      <AdminSidebar />

      <!-- Desktop Main Content -->
      <div class="p-6 min-h-screen" style="margin-left: 16rem;">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Registro de Actividad</h1>
          <template v-if="logsStore.activitySummary">
            <div class="grid grid-cols-4 gap-4 mb-6">
              <div v-for="card in summaryCards" :key="card.label"
                class="p-4 rounded-xl text-white"
                :style="{ background: card.gradient }"
              >
                <div class="text-xs opacity-80 mb-1">{{ card.label }}</div>
                <div class="text-2xl font-bold">{{ card.value }}</div>
              </div>
            </div>
          </template>
          <LogTable />
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="md:hidden pb-4">
      <div class="px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-100">
        <h1 class="text-xl font-bold text-gray-800">Registro de Actividad</h1>
        <button @click="router.push('/dashboard')" class="text-gray-500 text-sm">
          <i class="fa-solid fa-arrow-left mr-1"></i>Dashboard
        </button>
      </div>
      <div class="px-4 pt-4">
        <LogTable />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLogsStore } from '@/stores/logs'
import AdminSidebar from '@/components/AdminSidebar.vue'

const router = useRouter()
const authStore = useAuthStore()
const logsStore = useLogsStore()

const summaryCards = computed(() => {
  const s = logsStore.activitySummary
  if (!s) return []
  return [
    { label: 'Total Actividades', value: s.total_activities, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
    { label: 'Errores', value: s.by_level?.error || 0, gradient: 'linear-gradient(135deg,#ef4444,#dc2626)' },
    { label: 'Advertencias', value: s.by_level?.warning || 0, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
    { label: 'Período (días)', value: s.period_days, gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  ]
})

// --- LogTable inline component ---
const TABS = [
  { key: 'activity', label: 'General', icon: 'fa-solid fa-list' },
  { key: 'booking', label: 'Reservas', icon: 'fa-solid fa-calendar' },
  { key: 'payment', label: 'Pagos', icon: 'fa-solid fa-dollar-sign' },
  { key: 'user', label: 'Usuarios', icon: 'fa-solid fa-user' },
  { key: 'system', label: 'Sistema', icon: 'fa-solid fa-server' },
]

const activeTab = ref('activity')
const search = ref('')
const filterLevel = ref('')
const filterCategory = ref('')
const currentPage = ref(1)

const LEVEL_COLORS = {
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  critical: 'bg-red-200 text-red-900',
  debug: 'bg-gray-100 text-gray-600',
}

const currentLogs = computed(() => {
  switch (activeTab.value) {
    case 'booking': return logsStore.bookingLogs
    case 'payment': return logsStore.paymentLogs
    case 'user': return logsStore.userLogs
    case 'system': return logsStore.systemLogs
    default: return logsStore.activityLogs
  }
})

const fetchCurrentTab = async (page = 1) => {
  const params = { page, search: search.value || undefined }
  if (filterLevel.value) params.log_level = filterLevel.value
  if (filterCategory.value) params.category = filterCategory.value
  currentPage.value = page

  switch (activeTab.value) {
    case 'booking': await logsStore.fetchBookingLogs(params); break
    case 'payment': await logsStore.fetchPaymentLogs(params); break
    case 'user': await logsStore.fetchUserLogs(params); break
    case 'system': await logsStore.fetchSystemLogs({ ...params, level: filterLevel.value || undefined }); break
    default: await logsStore.fetchActivityLogs(params)
  }
}

watch(activeTab, () => {
  search.value = ''
  filterLevel.value = ''
  filterCategory.value = ''
  fetchCurrentTab(1)
})

let searchTimer = null
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => fetchCurrentTab(1), 400)
})

watch([filterLevel, filterCategory], () => fetchCurrentTab(1))

const formatTimestamp = (ts) => {
  if (!ts) return '-'
  return new Date(ts).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
}

const levelClass = (level) => LEVEL_COLORS[level] || 'bg-gray-100 text-gray-600'

const colsForTab = computed(() => {
  switch (activeTab.value) {
    case 'booking': return ['Hora', 'Usuario', 'Acción', 'Estado anterior', 'Estado nuevo', 'Descripción']
    case 'payment': return ['Hora', 'Usuario', 'Acción', 'Monto', 'Método', 'Descripción']
    case 'user': return ['Hora', 'Usuario', 'Acción', 'IP', 'Descripción']
    case 'system': return ['Hora', 'Nivel', 'Componente', 'Mensaje']
    default: return ['Hora', 'Usuario', 'Categoría', 'Nivel', 'Acción', 'Descripción']
  }
})

const CATEGORIES = ['booking','payment','user','admin','system','venue','package','notification','review']
const LEVELS = ['info','warning','error','critical']

const LogTable = defineComponent({
  name: 'LogTable',
  setup() {
    return () => h('div', { class: 'space-y-4' }, [
      // Tabs
      h('div', { class: 'flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto' },
        TABS.map(tab =>
          h('button', {
            key: tab.key,
            class: `flex items-center px-3 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${activeTab.value === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`,
            onClick: () => { activeTab.value = tab.key }
          }, [
            h('i', { class: tab.icon + ' mr-1.5' }),
            tab.label
          ])
        )
      ),

      // Filters
      h('div', { class: 'flex flex-wrap gap-3' }, [
        h('div', { class: 'relative flex-1 min-w-[180px]' }, [
          h('i', { class: 'fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs' }),
          h('input', {
            class: 'w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            placeholder: 'Buscar...',
            value: search.value,
            onInput: (e) => { search.value = e.target.value }
          })
        ]),
        activeTab.value === 'activity' && h('select', {
          class: 'px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
          value: filterCategory.value,
          onChange: (e) => { filterCategory.value = e.target.value }
        }, [
          h('option', { value: '' }, 'Categoría'),
          ...CATEGORIES.map(c => h('option', { value: c }, c.charAt(0).toUpperCase() + c.slice(1)))
        ]),
        (activeTab.value === 'activity' || activeTab.value === 'system') && h('select', {
          class: 'px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
          value: filterLevel.value,
          onChange: (e) => { filterLevel.value = e.target.value }
        }, [
          h('option', { value: '' }, 'Nivel'),
          ...LEVELS.map(l => h('option', { value: l }, l.charAt(0).toUpperCase() + l.slice(1)))
        ]),
      ]),

      // Loading
      logsStore.loading && h('div', { class: 'py-12 text-center' }, [
        h('div', { class: 'inline-block w-6 h-6 border-b-2 border-blue-500 rounded-full animate-spin' }),
        h('p', { class: 'mt-2 text-sm text-gray-500' }, 'Cargando...')
      ]),

      // Error
      logsStore.error && h('div', { class: 'py-8 text-center text-red-500 text-sm' }, logsStore.error),

      // Table
      !logsStore.loading && !logsStore.error && h('div', { class: 'overflow-x-auto rounded-xl border border-gray-100 shadow-sm' },
        h('table', { class: 'w-full text-sm' }, [
          h('thead', { class: 'bg-gray-50' },
            h('tr', {},
              colsForTab.value.map(col =>
                h('th', { class: 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap' }, col)
              )
            )
          ),
          h('tbody', { class: 'divide-y divide-gray-100 bg-white' },
            currentLogs.value.length === 0
              ? [h('tr', {}, h('td', { colspan: colsForTab.value.length, class: 'py-12 text-center text-gray-400' }, 'No hay registros'))]
              : currentLogs.value.map((log, i) =>
                  h('tr', { key: log.id || i, class: 'hover:bg-gray-50 transition-colors' },
                    activeTab.value === 'activity' ? [
                      h('td', { class: 'px-4 py-3 whitespace-nowrap text-gray-500 text-xs' }, formatTimestamp(log.timestamp)),
                      h('td', { class: 'px-4 py-3 text-gray-900 text-xs' }, log.user_email || '-'),
                      h('td', { class: 'px-4 py-3 text-gray-600 text-xs' }, log.category || '-'),
                      h('td', { class: 'px-4 py-3' }, h('span', { class: `px-2 py-0.5 rounded-full text-xs font-medium ${levelClass(log.log_level)}` }, log.log_level || '-')),
                      h('td', { class: 'px-4 py-3 text-gray-700 text-xs font-mono' }, log.action || '-'),
                      h('td', { class: 'px-4 py-3 text-gray-600 text-xs max-w-xs truncate' }, log.description || '-'),
                    ] : activeTab.value === 'booking' ? [
                      h('td', { class: 'px-4 py-3 whitespace-nowrap text-gray-500 text-xs' }, formatTimestamp(log.timestamp)),
                      h('td', { class: 'px-4 py-3 text-gray-900 text-xs' }, log.user_email || '-'),
                      h('td', { class: 'px-4 py-3 text-gray-700 text-xs font-mono' }, log.action || '-'),
                      h('td', { class: 'px-4 py-3 text-xs' }, log.old_status ? h('span', { class: 'px-2 py-0.5 bg-gray-100 text-gray-600 rounded' }, log.old_status) : '-'),
                      h('td', { class: 'px-4 py-3 text-xs' }, log.new_status ? h('span', { class: 'px-2 py-0.5 bg-blue-100 text-blue-700 rounded' }, log.new_status) : '-'),
                      h('td', { class: 'px-4 py-3 text-gray-600 text-xs max-w-xs truncate' }, log.description || '-'),
                    ] : activeTab.value === 'payment' ? [
                      h('td', { class: 'px-4 py-3 whitespace-nowrap text-gray-500 text-xs' }, formatTimestamp(log.timestamp)),
                      h('td', { class: 'px-4 py-3 text-gray-900 text-xs' }, log.user_email || '-'),
                      h('td', { class: 'px-4 py-3 text-gray-700 text-xs font-mono' }, log.action || '-'),
                      h('td', { class: 'px-4 py-3 text-xs font-semibold text-green-700' }, log.amount ? `$${parseFloat(log.amount).toLocaleString()}` : '-'),
                      h('td', { class: 'px-4 py-3 text-gray-600 text-xs' }, log.method || '-'),
                      h('td', { class: 'px-4 py-3 text-gray-600 text-xs max-w-xs truncate' }, log.description || '-'),
                    ] : activeTab.value === 'user' ? [
                      h('td', { class: 'px-4 py-3 whitespace-nowrap text-gray-500 text-xs' }, formatTimestamp(log.timestamp)),
                      h('td', { class: 'px-4 py-3 text-gray-900 text-xs' }, log.user_email || '-'),
                      h('td', { class: 'px-4 py-3 text-gray-700 text-xs font-mono' }, log.action || '-'),
                      h('td', { class: 'px-4 py-3 text-gray-500 text-xs font-mono' }, log.ip_address || '-'),
                      h('td', { class: 'px-4 py-3 text-gray-600 text-xs max-w-xs truncate' }, log.description || '-'),
                    ] : /* system */ [
                      h('td', { class: 'px-4 py-3 whitespace-nowrap text-gray-500 text-xs' }, formatTimestamp(log.timestamp)),
                      h('td', { class: 'px-4 py-3' }, h('span', { class: `px-2 py-0.5 rounded-full text-xs font-medium ${levelClass(log.level)}` }, log.level || '-')),
                      h('td', { class: 'px-4 py-3 text-gray-700 text-xs font-mono' }, log.component || '-'),
                      h('td', { class: 'px-4 py-3 text-gray-600 text-xs max-w-sm truncate' }, log.message || '-'),
                    ]
                  )
                )
          )
        ])
      ),

      // Pagination
      !logsStore.loading && logsStore.pagination.count > 50 && h('div', { class: 'flex items-center justify-between pt-2' }, [
        h('span', { class: 'text-xs text-gray-500' }, `${logsStore.pagination.count} registros`),
        h('div', { class: 'flex gap-2' }, [
          h('button', {
            class: `px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${logsStore.pagination.previous ? 'border-gray-300 hover:bg-gray-50 text-gray-700' : 'border-gray-100 text-gray-300 cursor-not-allowed'}`,
            disabled: !logsStore.pagination.previous,
            onClick: () => logsStore.pagination.previous && fetchCurrentTab(currentPage.value - 1)
          }, h('i', { class: 'fa-solid fa-chevron-left mr-1' }), 'Anterior'),
          h('span', { class: 'px-3 py-1.5 text-xs text-gray-500' }, `Pág. ${currentPage.value}`),
          h('button', {
            class: `px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${logsStore.pagination.next ? 'border-gray-300 hover:bg-gray-50 text-gray-700' : 'border-gray-100 text-gray-300 cursor-not-allowed'}`,
            disabled: !logsStore.pagination.next,
            onClick: () => logsStore.pagination.next && fetchCurrentTab(currentPage.value + 1)
          }, 'Siguiente', h('i', { class: 'fa-solid fa-chevron-right ml-1' }))
        ])
      ]),
    ])
  }
})

onMounted(async () => {
  await Promise.all([
    logsStore.fetchActivitySummary(30),
    logsStore.fetchActivityLogs({ page: 1 }),
  ])
})
</script>

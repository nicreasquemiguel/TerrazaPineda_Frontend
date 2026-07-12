<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div class="flex items-center gap-3 px-4 py-3">
        <div class="flex justify-center items-center w-9 h-9 bg-indigo-100 rounded-xl flex-shrink-0">
          <i class="fa-solid fa-calendar-days text-indigo-500 text-sm"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-base font-bold text-gray-900">Reservas</div>
          <div class="text-xs text-gray-400">
            {{ loading ? 'Cargando...' : `${filteredBookings.length} evento${filteredBookings.length !== 1 ? 's' : ''}` }}
          </div>
        </div>
        <!-- View toggle -->
        <div class="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button @click="view = 'calendar'"
            :class="['px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
              view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600']">
            <i class="fa-solid fa-calendar-week mr-1"></i>Calendario
          </button>
          <button @click="view = 'list'"
            :class="['px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
              view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600']">
            <i class="fa-solid fa-list mr-1"></i>Lista
          </button>
        </div>
      </div>

      <!-- Search + filters -->
      <div class="px-4 pb-3 flex flex-col gap-2">
        <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <i class="fa-solid fa-magnifying-glass text-gray-300 text-sm flex-shrink-0"></i>
          <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, descripción..."
            class="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400" />
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-gray-300 hover:text-gray-500">
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
        <!-- Status filter chips -->
        <div class="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          <button @click="toggleStatus('all')"
            :class="['px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all flex-shrink-0',
              selectedStatuses.length === 0 ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200']">
            Todos
          </button>
          <button v-for="s in statusOptions" :key="s.value" @click="toggleStatus(s.value)"
            :class="['px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all flex-shrink-0',
              selectedStatuses.includes(s.value) ? `${s.activeBg} ${s.activeText}` : 'bg-gray-100 text-gray-500 hover:bg-gray-200']">
            {{ s.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── CALENDAR VIEW ──────────────────────────────────────────────────── -->
    <div v-if="view === 'calendar'" class="px-3 py-4">
      <!-- Month navigation -->
      <div class="flex items-center justify-between mb-4 px-1">
        <button @click="prevMonth" class="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition shadow-sm">
          <i class="fa-solid fa-chevron-left text-xs"></i>
        </button>
        <div class="text-sm font-bold text-gray-900 capitalize">{{ monthLabel }}</div>
        <button @click="nextMonth" class="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition shadow-sm">
          <i class="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      <!-- Day headers -->
      <div class="grid grid-cols-7 mb-1">
        <div v-for="d in ['Lu','Ma','Mi','Ju','Vi','Sa','Do']" :key="d"
          class="text-center text-[10px] font-bold text-gray-400 py-1">{{ d }}</div>
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">
        <div v-for="(cell, i) in calendarCells" :key="i"
          :class="['bg-white p-1 min-h-[72px] flex flex-col',
            !cell.inMonth ? 'opacity-30' : '',
            isToday(cell.date) ? 'ring-2 ring-inset ring-indigo-400' : '']">
          <!-- Date number -->
          <div :class="['text-[11px] font-bold mb-1 w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0',
            isToday(cell.date) ? 'bg-indigo-500 text-white' : 'text-gray-500']">
            {{ cell.date.getDate() }}
          </div>
          <!-- Events on this day -->
          <div class="flex flex-col gap-px overflow-hidden">
            <router-link v-for="b in bookingsOnDay(cell.date)" :key="b.id"
              :to="`/detalle-reserva/${b.id}`"
              :class="['block px-1 py-px rounded text-[9px] leading-tight font-semibold truncate cursor-pointer transition hover:opacity-80', statusColor(b.status).chip]"
              :title="bookingLabel(b)">
              {{ bookingLabel(b) }}
            </router-link>
            <div v-if="bookingsOnDay(cell.date).length > 2" class="text-[9px] text-gray-400 pl-1">
              +{{ bookingsOnDay(cell.date).length - 2 }} más
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap gap-2 mt-4 px-1">
        <div v-for="s in statusOptions" :key="s.value" class="flex items-center gap-1">
          <div :class="['w-2.5 h-2.5 rounded-full flex-shrink-0', s.dot]"></div>
          <span class="text-[10px] text-gray-500">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <!-- ── LIST VIEW ──────────────────────────────────────────────────────── -->
    <div v-if="view === 'list'" class="px-3 py-4">
      <div v-if="loading" class="flex flex-col gap-3">
        <div v-for="i in 6" :key="i" class="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
      </div>

      <div v-else-if="filteredBookings.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
        <i class="fa-solid fa-calendar-xmark text-3xl mb-3"></i>
        <div class="text-sm font-semibold">Sin resultados</div>
        <div class="text-xs mt-1">Intenta con otro filtro o búsqueda</div>
      </div>

      <div v-else class="flex flex-col gap-2">
        <!-- Sort bar -->
        <div class="flex items-center justify-between px-1 mb-1">
          <span class="text-xs text-gray-400">{{ filteredBookings.length }} resultado{{ filteredBookings.length !== 1 ? 's' : '' }}</span>
          <button @click="toggleSort" class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition">
            <i :class="['fa-solid text-[10px]', sortAsc ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
            {{ sortAsc ? 'Más antiguo' : 'Más reciente' }}
          </button>
        </div>

        <router-link v-for="b in sortedBookings" :key="b.id" :to="`/detalle-reserva/${b.id}`"
          class="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
          <!-- Status dot + date -->
          <div class="flex flex-col items-center flex-shrink-0 w-10">
            <div :class="['w-2.5 h-2.5 rounded-full mb-1', statusColor(b.status).dot]"></div>
            <div class="text-[10px] font-bold text-gray-500 text-center leading-tight">
              {{ formatShortDate(b.start_datetime) }}
            </div>
          </div>
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-gray-900 truncate">{{ bookingLabel(b) }}</div>
            <div class="text-xs text-gray-400 mt-0.5 truncate">
              {{ formatTime(b.start_datetime) }} – {{ formatTime(b.end_datetime) }}
              <span v-if="b.package" class="ml-1">· {{ b.package.title }}</span>
            </div>
          </div>
          <!-- Price + chevron -->
          <div class="flex flex-col items-end flex-shrink-0 gap-1">
            <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full', statusColor(b.status).badge]">
              {{ statusLabel(b.status) }}
            </span>
            <span class="text-xs font-semibold text-gray-500">${{ (parseFloat(b.total_price) || 0).toLocaleString() }}</span>
          </div>
          <i class="fa-solid fa-chevron-right text-gray-300 text-xs flex-shrink-0"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/services/api'

// ── state ──────────────────────────────────────────────────────────────────
const bookings    = ref([])
const loading     = ref(false)
const view        = ref('calendar')
const searchQuery = ref('')
const sortAsc     = ref(false)
const selectedStatuses = ref([])

const today = new Date()
const calendarYear  = ref(today.getFullYear())
const calendarMonth = ref(today.getMonth()) // 0-indexed

// ── status config ──────────────────────────────────────────────────────────
const statusOptions = [
  { value: 'solicitud',           label: 'Solicitud',  dot: 'bg-gray-400',   chip: 'bg-gray-100 text-gray-700',   badge: 'bg-gray-100 text-gray-600',   activeBg: 'bg-gray-500',   activeText: 'text-white' },
  { value: 'aceptacion',          label: 'Aceptado',   dot: 'bg-blue-400',   chip: 'bg-blue-100 text-blue-700',   badge: 'bg-blue-100 text-blue-600',   activeBg: 'bg-blue-500',   activeText: 'text-white' },
  { value: 'apartado',            label: 'Apartado',   dot: 'bg-amber-400',  chip: 'bg-amber-100 text-amber-700', badge: 'bg-amber-100 text-amber-600', activeBg: 'bg-amber-400',  activeText: 'text-white' },
  { value: 'liquidado',           label: 'Liquidado',  dot: 'bg-green-400',  chip: 'bg-green-100 text-green-700', badge: 'bg-green-100 text-green-600', activeBg: 'bg-green-500',  activeText: 'text-white' },
  { value: 'liquidado_entregado', label: 'Entregado',  dot: 'bg-teal-400',   chip: 'bg-teal-100 text-teal-700',   badge: 'bg-teal-100 text-teal-600',   activeBg: 'bg-teal-500',   activeText: 'text-white' },
  { value: 'finalizado',          label: 'Finalizado', dot: 'bg-slate-300',  chip: 'bg-slate-100 text-slate-600', badge: 'bg-slate-100 text-slate-500', activeBg: 'bg-slate-400',  activeText: 'text-white' },
  { value: 'cancelado',           label: 'Cancelado',  dot: 'bg-red-400',    chip: 'bg-red-100 text-red-700',     badge: 'bg-red-100 text-red-600',     activeBg: 'bg-red-500',    activeText: 'text-white' },
]

function statusColor(status) {
  return statusOptions.find(s => s.value === status) || statusOptions[0]
}
function statusLabel(status) {
  return statusOptions.find(s => s.value === status)?.label || status
}

// ── fetch ──────────────────────────────────────────────────────────────────
async function fetchBookings() {
  loading.value = true
  try {
    // Fetch all bookings for the current calendar month (±1 week buffer)
    const firstDay = new Date(calendarYear.value, calendarMonth.value, 1)
    const lastDay  = new Date(calendarYear.value, calendarMonth.value + 1, 0)

    const from = new Date(firstDay); from.setDate(from.getDate() - 7)
    const to   = new Date(lastDay);  to.setDate(to.getDate() + 7)

    // For list view or when calendar has a search, fetch broader
    const params = new URLSearchParams()
    if (view.value === 'calendar') {
      // Use a wide window so bookings that START before the month but END in it are included
      params.set('start_from', from.toISOString())
      params.set('start_to',   to.toISOString())
    }
    if (searchQuery.value) params.set('search', searchQuery.value)
    params.set('page_size', '200')

    const res = await api.get(`/api/bookings/bookings/?${params}`)
    const data = res.data
    bookings.value = Array.isArray(data) ? data : (data.results || [])
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchBookings)
watch([calendarYear, calendarMonth, view], fetchBookings)

// debounce search
let searchTimer = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchBookings, 350)
})

// ── filters ────────────────────────────────────────────────────────────────
function toggleStatus(value) {
  if (value === 'all') { selectedStatuses.value = []; return }
  const idx = selectedStatuses.value.indexOf(value)
  if (idx > -1) selectedStatuses.value.splice(idx, 1)
  else selectedStatuses.value.push(value)
}

const filteredBookings = computed(() => {
  let list = bookings.value
  if (selectedStatuses.value.length > 0) {
    list = list.filter(b => selectedStatuses.value.includes(b.status))
  }
  return list
})

const sortedBookings = computed(() => {
  return [...filteredBookings.value].sort((a, b) => {
    const diff = new Date(a.start_datetime) - new Date(b.start_datetime)
    return sortAsc.value ? diff : -diff
  })
})

function toggleSort() { sortAsc.value = !sortAsc.value }

// ── calendar ───────────────────────────────────────────────────────────────
const monthLabel = computed(() => {
  return new Date(calendarYear.value, calendarMonth.value, 1)
    .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
})

function prevMonth() {
  if (calendarMonth.value === 0) { calendarMonth.value = 11; calendarYear.value-- }
  else calendarMonth.value--
}
function nextMonth() {
  if (calendarMonth.value === 11) { calendarMonth.value = 0; calendarYear.value++ }
  else calendarMonth.value++
}

const calendarCells = computed(() => {
  const first = new Date(calendarYear.value, calendarMonth.value, 1)
  // Start grid on Monday (0=Sun → shift)
  let startDay = first.getDay() // 0=Sun
  startDay = startDay === 0 ? 6 : startDay - 1 // convert to Mon=0

  const cells = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(calendarYear.value, calendarMonth.value, 1 - startDay + i)
    cells.push({
      date: d,
      inMonth: d.getMonth() === calendarMonth.value,
    })
  }
  // Trim trailing empty weeks
  while (cells.length > 35 && !cells[cells.length - 7].inMonth) cells.splice(-7)
  return cells
})

function isToday(date) {
  return date.toDateString() === today.toDateString()
}

function bookingsOnDay(date) {
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  const dayEnd   = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
  return filteredBookings.value.filter(b => {
    const bStart = new Date(b.start_datetime)
    const bEnd   = new Date(b.end_datetime)
    return bStart <= dayEnd && bEnd > dayStart
  })
}

// ── labels ─────────────────────────────────────────────────────────────────
function bookingLabel(b) {
  if (b.description?.startsWith('[GCal]\n')) {
    return b.description.split('\n')[1]?.trim() || 'Sin nombre'
  }
  if (b.user?.first_name || b.user?.last_name) {
    return `${b.user.first_name} ${b.user.last_name}`.trim()
  }
  if (b.description) return b.description.slice(0, 30)
  return 'Sin nombre'
}

function formatShortDate(dt) {
  const d = new Date(dt)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

function formatTime(dt) {
  return new Date(dt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>

<template>
  <div class="calendar-wrapper" :class="{ 'staff-calendar': isStaff }">
    <v-date-picker
      class="my-calendar"
      v-model="internalDate"
      :min-date="minDate"
      :max-date="maxDate"
      :initial-page="initialPage"
      :attributes="calendarAttributes"
      :disabled-dates="[]"
      is-inline
      locale="es"
      @dayclick="onDayClick"
    />
    <!-- Leyenda -->
    <div class="flex gap-4 justify-center mt-3 text-xs text-gray-500">
      <span class="flex gap-1.5 items-center">
        <span class="inline-block w-3 h-3 rounded-full bg-gradient-to-br from-[#22d3ee] to-[#06b6d4]"></span>
        Seleccionada
      </span>
      <span class="flex gap-1.5 items-center">
        <span class="inline-block w-3 h-3 rounded-full bg-red-600"></span>
        Ocupada
      </span>
      <span class="flex gap-1.5 items-center">
        <span class="inline-block w-3 h-3 rounded-full bg-gray-200"></span>
        No disponible
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import SplitText from '@/components/SplitText.vue'

const props = defineProps({
  modelValue: { type: [Date, String, null], default: null },
  isStaff:    { type: Boolean, default: false },
})

const router = useRouter()
const emit = defineEmits(['update:modelValue'])

function toDate(val) {
  if (!val) return null;
  if (val instanceof Date) {
    const d = new Date(val);
    d.setHours(0, 0, 0, 0); // Normalize to midnight
    return d;
  }
  // If it's a string, try to parse as date
  const d = new Date(val);
  if (isNaN(d)) return null;
  d.setHours(0, 0, 0, 0); // Normalize to midnight
  return d;
}

// Internal date for v-calendar
const internalDate = ref(toDate(props.modelValue))

const occupiedDates = ref([])
const minDate = new Date()
const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
const today = new Date()
const initialPage = { month: today.getMonth() + 1, year: today.getFullYear() }

// Map date → { user_initials, booking_id, label }
const occupiedDatesMap = computed(() => {
  const map = new Map()
  occupiedDates.value.forEach(item => {
    map.set(item.date.toDateString(), item)
  })
  return map
})


const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

const fetchOccupiedEvents = async () => {
  try {
    const res = await api.get('/api/bookings/booked-dates/')
    // res.data is now [{ date: "2025-07-08", user_initials: "MH" }, ...]
    const bookedDates = res.data || []
    // Store the full data for popover display
    occupiedDates.value = bookedDates.map(item => {
      const [year, month, day] = item.date.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      date.setHours(0, 0, 0, 0)
      return {
        date,
        user_initials: item.user_initials,
        booking_id:    item.booking_id || null,
        label:         item.label || item.user_initials,
      }
    })
  } catch (e) {
    console.error('Error fetching occupied dates:', e)
    occupiedDates.value = []
  }
}

const calendarAttributes = computed(() => {
  const attributes = []

  occupiedDates.value.forEach(item => {
    attributes.push({
      key: `occupied-${item.date.toDateString()}`,
      dates: item.date,
      highlight: {
        color: 'red',
        fillMode: 'solid',
        contentClass: 'vc-occupied',
      },
      popover: {
        label: props.isStaff && item.label
          ? `${item.label} — ver reserva`
          : `Ocupado — ${item.user_initials}`,
        visibility: 'hover',
      },
      order: 0,
    })
  })

  if (occupiedDates.value.length > 0) {
    attributes.push({
      key: 'disabled-dates',
      dates: occupiedDates.value.map(item => item.date),
      order: 1,
    })
  }

  return attributes
})

function onDayClick({ date }) {
  const ds = date.toDateString()
  const entry = occupiedDatesMap.value.get(ds)
  if (props.isStaff && entry?.booking_id) {
    router.push(`/detalle-reserva/${entry.booking_id}`)
    return
  }
  // non-staff: occupied dates are disabled; free dates handled by v-model watcher
}

// Watch internal date changes from v-calendar (AFTER occupiedDatesMap is defined)
watch(internalDate, (newVal, oldVal) => {
  console.log('[Calendar] internalDate changed:', {
    newVal: newVal ? newVal.toDateString() : null,
    oldVal: oldVal ? oldVal.toDateString() : null
  })
  
  if (!newVal) {
    console.log('[Calendar] Emitting null')
    emit('update:modelValue', null)
    return
  }
  
  // Normalize the date to midnight for comparison
  const normalized = new Date(newVal);
  normalized.setHours(0, 0, 0, 0);
  
  // Block selecting an occupied date (staff navigate via onDayClick instead)
  const dateString = normalized.toDateString()
  if (occupiedDatesMap.value.has(dateString)) {
    nextTick(() => { internalDate.value = toDate(props.modelValue) })
    return
  }
  
  // Check if value actually changed to prevent loops
  const oldNormalized = oldVal ? toDate(oldVal) : null;
  if (oldNormalized && oldNormalized.getTime() === normalized.getTime()) {
    console.log('[Calendar] ⏭️  Same date, skipping emit:', dateString);
    return; // Same date, don't emit
  }
  
  // Emit the new valid date
  console.log('[Calendar] ✅ Emitting new date:', dateString)
  emit('update:modelValue', normalized)
})

// Sync from parent (when programmatically changed)
watch(() => props.modelValue, (val) => {
  const d = toDate(val);
  const current = internalDate.value;
  
  console.log('[Calendar] Parent modelValue changed:', {
    newValue: d ? d.toDateString() : null,
    currentInternal: current ? current.toDateString() : null
  })
  
  // Only update if actually different to prevent loops
  if (!d && !current) {
    console.log('[Calendar] Both null, skipping')
    return;
  }
  if (d && current && d.getTime() === current.getTime()) {
    console.log('[Calendar] Same timestamp, skipping sync')
    return;
  }
  
  console.log('[Calendar] Updating internalDate from parent')
  internalDate.value = d;
})

onMounted(fetchOccupiedEvents)
</script>

<style scoped>
/* ── Wrapper ── */
.calendar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Container card ── */
:deep(.my-calendar.vc-container) {
  border: 1px solid #e0f2fe !important;
  border-radius: 1.5rem !important;
  box-shadow: 0 8px 32px rgba(6,182,212,0.10), 0 2px 8px rgba(0,0,0,0.06) !important;
  padding: 1.25rem 1.5rem 1.1rem !important;
  background: #fff !important;
  font-family: inherit !important;
  min-width: 300px;
}

/* ── Header ── */
:deep(.my-calendar .vc-header) {
  padding: 0 0 0.8rem 0 !important;
  border-bottom: 1.5px solid #e0f2fe !important;
  margin-bottom: 0.6rem !important;
}

:deep(.my-calendar .vc-title) {
  font-size: 1.05rem !important;
  font-weight: 800 !important;
  color: #0e7490 !important;
  background: none !important;
  text-transform: capitalize !important;
  pointer-events: none !important;
  cursor: default !important;
}

/* ── Nav arrows ── */
:deep(.my-calendar .vc-arrow) {
  border-radius: 0.55rem !important;
  color: #06b6d4 !important;
  background: #f0fdff !important;
  border: 1.5px solid #a5f3fc !important;
  width: 28px !important;
  height: 28px !important;
  transition: background 0.15s !important;
}
:deep(.my-calendar .vc-arrow:hover) { background: #cffafe !important; }

/* ── Weekday labels ── */
:deep(.my-calendar .vc-weekday) {
  font-size: 0.68rem !important;
  font-weight: 700 !important;
  color: #94a3b8 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.07em !important;
  padding-bottom: 0.4rem !important;
}

/* ── All day cells base ── */
:deep(.my-calendar .vc-day-content) {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  width: 36px !important;
  height: 36px !important;
  border-radius: 0.65rem !important;
  transition: background 0.15s, color 0.15s, transform 0.1s !important;
  color: #1e293b !important;
}

/* Hover on available days */
:deep(.my-calendar .vc-day-content:hover:not([disabled])) {
  background: #e0f9ff !important;
  color: #0891b2 !important;
  font-weight: 700 !important;
  transform: scale(1.08) !important;
}

/* ── Today ── */
:deep(.my-calendar .vc-day.is-today .vc-day-content) {
  border: 2px solid #22d3ee !important;
  color: #0891b2 !important;
  font-weight: 800 !important;
  background: #f0fdff !important;
}
/* Today that is also occupied: red takes priority, no today border */
:deep(.my-calendar .vc-day.is-today .vc-day-content.vc-occupied) {
  border: none !important;
  background: #dc2626 !important;
  color: #fff !important;
}

/* ── Disabled / past dates (v-calendar v3: class on vc-day-content) ── */
:deep(.my-calendar .vc-day-content.vc-disabled),
:deep(.my-calendar .vc-day-content[disabled]) {
  background: #f8fafc !important;
  color: #d1d5db !important;
  cursor: not-allowed !important;
  opacity: 1 !important;
  pointer-events: none !important;
}

/* ── Days outside current month ── */
/* v-calendar v3 hides ALL children of .is-not-in-month with opacity:0 */
/* Restore at 50% for non-occupied padding days */
:deep(.my-calendar .vc-day.is-not-in-month) {
  pointer-events: auto !important;
}
:deep(.my-calendar .vc-day.is-not-in-month .vc-day-content:not(.vc-occupied)) {
  opacity: 0.5 !important;
  color: #94a3b8 !important;
  font-weight: 400 !important;
  background: transparent !important;
  pointer-events: auto !important;
}

/* ── Occupied dates: red on the day content (covers highlight bg underneath) ── */
/* .vc-highlight-bg-solid has z-index:-1; .vc-day-content is on top and covers it */
:deep(.my-calendar .vc-day-content.vc-occupied) {
  background: #dc2626 !important;
  color: #fff !important;
  font-weight: 800 !important;
  opacity: 1 !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
  width: 30px !important;
  height: 30px !important;
}

/* ── Selection highlight: cyan gradient ── */
:deep(.my-calendar .vc-highlight-bg-solid) {
  background: linear-gradient(135deg, #22d3ee, #06b6d4) !important;
  border-radius: 0.65rem !important;
  width: 36px !important;
  height: 36px !important;
}
/* Occupied highlight bg: hide it — red comes from .vc-day-content.vc-occupied */
:deep(.my-calendar .vc-day-layer.vc-red .vc-highlight-bg-solid) {
  display: none !important;
}

/* ── Row spacing ── */
:deep(.my-calendar .vc-week) { margin-bottom: 1px !important; }

/* ── Focus ring off ── */
:deep(.my-calendar .vc-day-content:focus) { box-shadow: none !important; outline: none !important; }

/* ── Prevent iOS double-tap zoom on calendar cells ── */
:deep(.my-calendar .vc-day-content),
:deep(.my-calendar .vc-arrow) {
  touch-action: manipulation !important;
}

/* ── Prevent iOS input-zoom: keep font-size ≥ 16px on focusable elements ── */
:deep(.my-calendar input),
:deep(.my-calendar select),
:deep(.my-calendar button) {
  font-size: 16px !important;
}

/* ── Staff mode: occupied dates are clickable ── */
.staff-calendar :deep(.my-calendar .vc-day-content.vc-occupied) {
  cursor: pointer !important;
  pointer-events: auto !important;
}
.staff-calendar :deep(.my-calendar .vc-day-content.vc-occupied:hover) {
  opacity: 0.8 !important;
  transform: scale(1.08) !important;
}
</style> 
<template>
  <div>
    <v-date-picker
      class="my-calendar"
      v-model="internalDate"
      :min-date="minDate"
      :max-date="maxDate"
      :attributes="calendarAttributes"
      :disabled-dates="disabledDates"
      is-inline
      locale="es"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, toRef, defineProps, defineEmits } from 'vue'
import api from '@/services/api'
import SplitText from '@/components/SplitText.vue'

const props = defineProps({
  modelValue: { type: [Date, String, null], default: null }
})
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

// Create a map for quick lookup of user initials by date
const occupiedDatesMap = computed(() => {
  const map = new Map()
  occupiedDates.value.forEach(item => {
    map.set(item.date.toDateString(), item.user_initials)
  })
  return map
})

// Computed property for disabled dates
const disabledDates = computed(() => {
  return occupiedDates.value.map(item => item.date)
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
      const date = new Date(year, month - 1, day) // month is 0-indexed
      date.setHours(0, 0, 0, 0) // Normalize to midnight
      return {
        date: date,
        user_initials: item.user_initials
      }
    })
  } catch (e) {
    console.error('Error fetching occupied dates:', e)
    occupiedDates.value = []
  }
}

const calendarAttributes = computed(() => {
  const attributes = []
  // Create a separate attribute for each occupied date with its initials
  occupiedDates.value.forEach(item => {
    attributes.push({
      key: `occupied-${item.date.toDateString()}`,
      dates: item.date,
      highlight: {
        fillMode: 'solid',
        contentClass: 'text-white font-bold',
      },
      popover: {
        label: `Ocupado por ${item.user_initials}`,
      },
      customData: { isOccupied: true },
      // Mark the date as disabled so it can't be selected
      order: 0
    })
  })
  
  // Add disabled dates attribute to prevent selection
  if (occupiedDates.value.length > 0) {
    attributes.push({
      key: 'disabled-dates',
      dates: occupiedDates.value.map(item => item.date),
      order: 1
    })
  }
  
  return attributes
})

// Function to get user initials for a specific date
const getUserInitials = (date) => {
  const dateString = date.toDateString()
  const initials = occupiedDatesMap.value.get(dateString)
  return initials ? `Ocupado por ${initials}` : 'Ocupado'
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
  
  // Check if the selected date is reserved
  const dateString = normalized.toDateString()
  if (occupiedDatesMap.value.has(dateString)) {
    console.log('[Calendar] ❌ Blocked reserved date selection:', dateString)
    // Don't emit, calendar will stay on previous selection
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
/* Disabled dates (past dates, etc.) */
:deep(.my-calendar .vc-day.vc-disabled) {
  background: #f1f5f9 !important;
  color: #cbd5e1 !important;
  opacity: 1 !important;
  cursor: not-allowed !important;
}

/* Reserved/Occupied dates - RED color */
:deep(.my-calendar .vc-day.vc-highlight[data-highlight-key^="occupied"]) {
  background: #fecaca !important; /* Light red background */
  color: #991b1b !important; /* Dark red text */
  font-weight: 700 !important;
  opacity: 1 !important;
  cursor: not-allowed !important;
  pointer-events: none !important; /* Prevent any click events */
}

/* Hover state for reserved dates - keep red */
:deep(.my-calendar .vc-day.vc-highlight[data-highlight-key^="occupied"]:hover) {
  background: #fca5a5 !important; /* Slightly darker red on hover */
  color: #7f1d1d !important;
  cursor: not-allowed !important;
}

/* Selected date (non-reserved) */
:deep(.my-calendar .vc-day.vc-selected) {
  background: #0ea5e9 !important;
  color: #fff !important;
  border-radius: 0.75rem !important;
  font-weight: 800;
  box-shadow: 0 2px 8px #0ea5e933;
}

/* If somehow a reserved date gets selected (shouldn't happen), keep it red */
:deep(.my-calendar .vc-day.vc-highlight[data-highlight-key^="occupied"].vc-selected) {
  background: #dc2626 !important; /* Solid red */
  color: #fff !important;
  opacity: 1 !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}

/* Additional styling for disabled reserved dates */
:deep(.my-calendar .vc-day.vc-disabled.vc-highlight[data-highlight-key^="occupied"]) {
  background: #fca5a5 !important;
  color: #7f1d1d !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}

</style> 
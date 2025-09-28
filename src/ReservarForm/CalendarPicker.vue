<template>
  <div>
    <v-date-picker
      class="my-calendar"
      v-model="selectedDate"
      :min-date="minDate"
      :max-date="maxDate"
      :attributes="calendarAttributes"
      is-inline
      locale="es"
      @update:model-value="onDateChange"
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
  if (val instanceof Date) return val;
  // If it's a string, try to parse as date
  const d = new Date(val);
  return isNaN(d) ? null : d;
}
const selectedDate = ref(toDate(props.modelValue))

// Keep selectedDate in sync with v-model
watch(() => props.modelValue, (val) => {
  const d = toDate(val);
  if (+d !== +selectedDate.value) selectedDate.value = d;
})
watch(selectedDate, (val) => {
  emit('update:modelValue', val)
})

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
      return {
        date: new Date(year, month - 1, day), // month is 0-indexed
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
      customData: { isOccupied: true }
    })
  })
  return attributes
})

// Function to get user initials for a specific date
const getUserInitials = (date) => {
  const dateString = date.toDateString()
  const initials = occupiedDatesMap.value.get(dateString)
  return initials ? `Ocupado por ${initials}` : 'Ocupado'
}

const onDateChange = (val) => {
  selectedDate.value = toDate(val)
}

onMounted(fetchOccupiedEvents)
</script>

<style scoped>
:deep(.my-calendar .vc-day.vc-disabled) {
  background: #f1f5f9 !important;
  color: #cbd5e1 !important;
  opacity: 1 !important;
  cursor: not-allowed !important;
}
:deep(.my-calendar .vc-day.vc-highlight[data-highlight-key="occupied"]) {
  background: #e5e7eb !important;
  color: #94a3b8 !important;
  font-weight: 700;
  opacity: 1 !important;
}
:deep(.my-calendar .vc-day.vc-selected) {
  background: #0ea5e9 !important;
  color: #fff !important;
  border-radius: 0.75rem !important;
  font-weight: 800;
  box-shadow: 0 2px 8px #0ea5e933;
}
:deep(.my-calendar .vc-day.vc-highlight[data-highlight-key="occupied"].vc-selected) {
  background: #0ea5e9 !important;
  color: #fff !important;
  opacity: 1 !important;
}
</style> 
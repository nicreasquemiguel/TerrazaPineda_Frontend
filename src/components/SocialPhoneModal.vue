<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div class="mb-1 flex justify-center">
          <span class="text-4xl">📱</span>
        </div>
        <h2 class="mb-1 text-center text-xl font-extrabold text-gray-800">Un último paso</h2>
        <p class="mb-6 text-center text-sm text-gray-500">
          Necesitamos tu número de teléfono para completar tu perfil y poder contactarte sobre tu reservación.
        </p>

        <form @submit.prevent="submit">
          <label class="mb-1 block text-sm font-semibold text-gray-700">Teléfono</label>
          <input
            v-model="phone"
            type="tel"
            inputmode="numeric"
            @input="formatPhone"
            placeholder="000-000-0000"
            required
            maxlength="12"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400 transition"
          />
          <p v-if="error" class="mt-2 text-xs text-red-500">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading || phone.replace(/\D/g, '').length < 10"
            class="mt-5 w-full rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] py-3 font-bold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
          >
            {{ loading ? 'Guardando...' : 'Continuar' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['done'])
const authStore = useAuthStore()

const phone = ref('')
const loading = ref(false)
const error = ref('')

function formatPhone(event) {
  let digits = event.target.value.replace(/\D/g, '').slice(0, 10)
  if (digits.length > 6) {
    digits = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
  } else if (digits.length > 3) {
    digits = digits.slice(0, 3) + '-' + digits.slice(3)
  }
  phone.value = digits
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await api.patch('/api/users/me/', { phone: phone.value })
    await authStore.fetchUser()
    emit('done')
  } catch (err) {
    error.value = err.response?.data?.phone?.[0] || 'Error al guardar el teléfono. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

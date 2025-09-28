<template>
  <div class="w-full max-w-md">
    <label class="block mb-1 font-semibold text-gray-700">¿Qué tipo de evento, música o petición?</label>
    <div :class="['relative rounded-xl border-2 transition-all', isFocused ? 'border-purple-400 shadow-md' : 'border-gray-300']">
      <textarea
        v-model="inputValue"
        :maxlength="maxLength"
        rows="4"
        class="p-3 w-full text-gray-800 bg-transparent rounded-xl outline-none resize-none"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @input="onInput"
        placeholder="¿Qué tipo de evento , música o peticiones que tengan...?"
      />
      <div class="absolute bottom-2 left-3 text-xs text-gray-500 select-none">
        {{ inputValue.length }}/{{ maxLength }}
      </div>
      <div class="absolute bottom-2 right-3 text-xs" :class="inputValue.length < minLength ? 'text-red-400' : 'text-green-500'">
        <template v-if="inputValue.length < minLength">
          {{ minLength }} mínimo
        </template>
        <template v-else>
          ✓
        </template>
      </div>
    </div>
    <div class="mt-1 text-xs text-gray-400">Describe tu evento (mínimo 64 caracteres).</div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: String,
  label: {
    type: String,
    default: 'Descripción'
  },
  helperText: {
    type: String,
    default: 'Describe tu evento (mínimo 64 caracteres).'
  },
  minLength: {
    type: Number,
    default: 64
  },
  maxLength: {
    type: Number,
    default: 300
  }
})
const emit = defineEmits(['update:modelValue'])
const inputValue = ref(props.modelValue || '')
const isFocused = ref(false)

watch(() => props.modelValue, (val) => {
  if (val !== inputValue.value) inputValue.value = val || ''
})

function onInput(e) {
  emit('update:modelValue', inputValue.value)
}
</script>

<style scoped>
textarea::-webkit-input-placeholder { color: #bdbdbd; }
textarea:-moz-placeholder { color: #bdbdbd; }
textarea::-moz-placeholder { color: #bdbdbd; }
textarea:-ms-input-placeholder { color: #bdbdbd; }
</style> 
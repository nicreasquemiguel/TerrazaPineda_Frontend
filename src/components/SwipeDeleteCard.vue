<template>
  <div class="relative h-14 select-none"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
  >
    <!-- Red background with trash icon -->
    <div class="flex absolute inset-0 justify-end items-center pr-6 bg-red-500 rounded-xl transition-all duration-300"
      :class="{ 'opacity-100': showDelete, 'opacity-80': !showDelete }"
    >
      <button @click="handleDelete" class="focus:outline-none">
        <i class="w-5 h-5 text-white fa-solid fa-trash"></i>
      </button>
    </div>
    <!-- Sliding card -->
    <div class="flex relative z-30 items-center px-2 w-full bg-white rounded-xl border-b border-gray-100 transition-all duration-300 last:border-b-0"
      :style="{
        transform: `translateX(${translateX}px)`,
        opacity: deleting ? 0 : 1,
        height: deleting ? '0px' : '56px',
        marginBottom: deleting ? '0px' : '',
        transition: 'transform 0.3s, opacity 0.3s, height 0.3s, margin-bottom 0.3s'
      }"
    >
      <slot />
      <!-- Small X button for both desktop and mobile -->
      <button v-if="!showDelete" @click.prevent="triggerShowDelete" class="flex absolute top-0.5 right-1 z-20 justify-center items-center p-0 m-0 w-4 h-4 text-xs leading-none text-red-500 bg-transparent hover:text-red-600 focus:outline-none">
        <i class="text-xs fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  showDelete: { type: Boolean, default: false },
  deleting: { type: Boolean, default: false },
})
const emit = defineEmits(['delete', 'show-delete'])

const translateX = ref(0)
const localShowDelete = ref(props.showDelete)
const localDeleting = ref(props.deleting)
let startX = 0

function onTouchStart(e) {
  if (e.touches) startX = e.touches[0].clientX
}
function onTouchMove(e) {
  if (e.touches) {
    const deltaX = e.touches[0].clientX - startX
    translateX.value = Math.min(0, deltaX)
    if (deltaX < -50) localShowDelete.value = true
    else localShowDelete.value = false
  }
}
function onTouchEnd() {
  if (translateX.value < -50) {
    localShowDelete.value = true
    translateX.value = -60
  } else {
    localShowDelete.value = false
    translateX.value = 0
  }
  emit('show-delete', localShowDelete.value)
}
function onMouseDown(e) {
  // Optional: implement drag with mouse if needed
}
function triggerShowDelete() {
  localShowDelete.value = true
  translateX.value = -60
  emit('show-delete', true)
}
function handleDelete() {
  localDeleting.value = true
  emit('delete')
}
watch(() => props.showDelete, val => localShowDelete.value = val)
watch(() => props.deleting, val => localDeleting.value = val)
</script>

<style scoped>
</style> 
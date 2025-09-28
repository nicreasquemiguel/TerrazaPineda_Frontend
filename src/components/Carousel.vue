<template>
  <div
    ref="containerRef"
    class="relative overflow-hidden p-4 rounded-2xl border border-gray-200 bg-white/10 backdrop-blur-md"
    :style="{ width: baseWidth + 'px' }"
    @mouseenter="pauseOnHover && (isHovered = true)"
    @mouseleave="pauseOnHover && (isHovered = false)"
  >
    <div class="flex" :style="{ gap: gap + 'px' }">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="relative shrink-0 flex flex-col items-center justify-between bg-white rounded-xl border border-gray-200 overflow-hidden cursor-grab active:cursor-grabbing shadow-lg"
        :style="{
          width: itemWidth + 'px',
          minHeight: '220px',
          background: cardGradients[i % cardGradients.length],
          transform: `translateX(${(i - currentIndex) * (itemWidth + gap)}px)`
        }"
        @mousedown.prevent="startDrag(i, $event)"
        @touchstart.prevent="startDrag(i, $event)"
      >
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-white/30 mt-6 mb-2">
          <Icon :icon="item.icon" class="w-7 h-7 text-primary-600" />
        </div>
        <div class="p-4 text-center">
          <div class="mb-1 font-black text-lg text-gray-900">{{ item.title }}</div>
          <p class="text-sm text-gray-700">{{ item.description }}</p>
        </div>
      </div>
    </div>
    <!-- Dots -->
    <div class="flex w-full justify-center mt-4">
      <div class="flex w-[150px] justify-between px-8">
        <div
          v-for="(_, index) in items"
          :key="index"
          class="h-2 w-2 rounded-full cursor-pointer transition-colors duration-150"
          :class="currentIndex === index ? 'bg-[#7c3aed]' : 'bg-gray-300'"
          @click="goTo(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  items: { type: Array, required: true },
  baseWidth: { type: Number, default: 320 },
  autoplay: { type: Boolean, default: false },
  autoplayDelay: { type: Number, default: 3000 },
  pauseOnHover: { type: Boolean, default: false },
  cardGradients: { type: Array, default: () => [
    'linear-gradient(90deg, #7c3aed, #22d3ee)',
    'linear-gradient(90deg, #f472b6, #fbbf24)',
    'linear-gradient(90deg, #34d399, #a3e635)',
  ] },
  gap: { type: Number, default: 16 },
})

const currentIndex = ref(0)
const isHovered = ref(false)
const itemWidth = props.baseWidth - 32
const containerRef = ref(null)
let autoplayTimer = null

function goTo(idx) {
  currentIndex.value = idx
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.items.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
}

function startDrag(idx, event) {
  // Simple drag-to-snap (not inertia, for simplicity)
  let startX = event.touches ? event.touches[0].clientX : event.clientX
  let moved = false
  function onMove(e) {
    moved = true
  }
  function onUp(e) {
    let endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    if (endX < startX - 40) next()
    else if (endX > startX + 40) prev()
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('touchend', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('touchmove', onMove)
  window.addEventListener('touchend', onUp)
}

watch(() => props.autoplay, (val) => {
  if (val) startAutoplay()
  else stopAutoplay()
})

function startAutoplay() {
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    if (!props.pauseOnHover || !isHovered.value) next()
  }, props.autoplayDelay)
}
function stopAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer)
}

onMounted(() => {
  if (props.autoplay) startAutoplay()
})
onBeforeUnmount(() => {
  stopAutoplay()
})
</script> 
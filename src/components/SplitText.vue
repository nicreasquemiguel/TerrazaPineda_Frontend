<template>
  <p
    ref="textRef"
    class="split-parent overflow-hidden inline-block whitespace-normal"
    :class="className"
    :style="{
      textAlign,
      wordWrap: 'break-word',
      position: splitType === 'lines' ? 'relative' : 'static'
    }"
  >
    <slot>{{ text }}</slot>
  </p>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText as GSAPSplitText } from 'gsap/SplitText'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, GSAPSplitText)

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  },
  delay: {
    type: Number,
    default: 100
  },
  duration: {
    type: Number,
    default: 0.6
  },
  ease: {
    type: String,
    default: 'power3.out'
  },
  splitType: {
    type: String,
    default: 'chars'
  },
  from: {
    type: Object,
    default: () => ({ opacity: 0, y: 40 })
  },
  to: {
    type: Object,
    default: () => ({ opacity: 1, y: 0 })
  },
  threshold: {
    type: Number,
    default: 0.1
  },
  rootMargin: {
    type: String,
    default: '-100px'
  },
  textAlign: {
    type: String,
    default: 'center'
  },
  useScroll: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['letterAnimationComplete'])

const textRef = ref(null)
const animationCompletedRef = ref(false)
let timeline = null
let splitter = null

const initAnimation = () => {
  const el = textRef.value
  if (!el || animationCompletedRef.value) return

  // Wait for fonts to load before initializing SplitText
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      createSplitText(el)
    })
  } else {
    // Fallback for browsers without font loading API
    setTimeout(() => {
      createSplitText(el)
    }, 100)
  }
}

const createSplitText = (el) => {
  const absoluteLines = props.splitType === 'lines'
  if (absoluteLines) el.style.position = 'relative'

  splitter = new GSAPSplitText(el, {
    type: props.splitType,
    absolute: absoluteLines,
    linesClass: 'split-line'
  })

  let targets
  switch (props.splitType) {
    case 'lines':
      targets = splitter.lines
      break
    case 'words':
      targets = splitter.words
      break
    case 'words, chars':
      targets = [...splitter.words, ...splitter.chars]
      break
    default:
      targets = splitter.chars
  }

  targets.forEach((t) => {
    t.style.willChange = 'transform, opacity'
  })

  let timelineConfig = {
    smoothChildTiming: true,
    onComplete: () => {
      animationCompletedRef.value = true
      gsap.set(targets, {
        ...props.to,
        clearProps: 'willChange',
        immediateRender: true
      })
      emit('letterAnimationComplete')
    }
  }
  if (props.useScroll) {
    const startPct = (1 - props.threshold) * 100
    const m = /^(-?\d+)px$/.exec(props.rootMargin)
    const raw = m ? parseInt(m[1], 10) : 0
    const sign = raw < 0 ? `-=${Math.abs(raw)}px` : `+=${raw}px`
    const start = `top ${startPct}%${sign}`
    timelineConfig.scrollTrigger = {
      trigger: el,
      start,
      toggleActions: 'play none none none',
      once: true
    }
  }

  timeline = gsap.timeline(timelineConfig)
  timeline.set(targets, { ...props.from, immediateRender: false, force3D: true })
  timeline.to(targets, {
    ...props.to,
    duration: props.duration,
    ease: props.ease,
    stagger: props.delay / 1000,
    force3D: true
  })
}

const cleanup = () => {
  if (timeline) {
    timeline.kill()
  }
  ScrollTrigger.getAll().forEach((t) => t.kill())
  if (splitter) {
    splitter.revert()
  }
}

onMounted(() => {
  initAnimation()
})

onUnmounted(() => {
  cleanup()
})

// Watch for prop changes and reinitialize animation
watch(() => [props.text, props.splitType], () => {
  cleanup()
  animationCompletedRef.value = false
  nextTick(() => {
    initAnimation()
  })
})
</script>

<style scoped>
.split-parent {
  display: inline-block;
}
</style> 
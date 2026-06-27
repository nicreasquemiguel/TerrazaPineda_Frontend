<template>
  <div :id="containerId"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'

let instanceCounter = 0

const props = defineProps({
  preferenceId: { type: String, required: true },
  publicKey: { type: String, required: true }
})

const containerId = `walletBrick_container_${++instanceCounter}`

let brickController = null

async function initBrick() {
  if (brickController) {
    brickController.unmount()
    brickController = null
  }

  if (!props.preferenceId || !props.publicKey || !window.MercadoPago) return

  const mp = new window.MercadoPago(props.publicKey)
  const bricksBuilder = mp.bricks()

  brickController = await bricksBuilder.create('wallet', containerId, {
    initialization: {
      preferenceId: props.preferenceId
    }
  })
}

onMounted(initBrick)

watch(() => props.preferenceId, initBrick)

onBeforeUnmount(() => {
  if (brickController) {
    brickController.unmount()
    brickController = null
  }
})
</script>
